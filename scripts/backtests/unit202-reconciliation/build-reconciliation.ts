/**
 * CC-22: mechanically constructs the Unit-202 knowledge-boundary
 * reconciliation. Reads the frozen, already-hardened Unit-202 input
 * (reports/backtests/unit202-post-hardening/CC-21-FULL-PUBLIC-INPUT.json)
 * READ-ONLY, applies the Project-Architect-directed decisions recorded in
 * ./decisions.ts to construct NEW SemanticAdjudication and
 * KnowledgeBoundaryCertification records (never mutating the frozen
 * input), runs the REAL, unmodified `buildStandardPipeline` from
 * @alp/qualification-pipeline at HEAD, and emits the reconciliation
 * ledger, technical-evidence-gap manifest, and candidate-level status
 * report into reports/backtests/unit202-reconciliation/.
 *
 * This script performs NO renormalization, NO new research, and NO
 * generic-architecture changes. Every evidenceId/claimKey/candidateKey it
 * writes to its outputs is read directly from the real frozen input or
 * the real pipeline result -- never hand-transcribed.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildStandardPipeline,
  computeKnowledgeBoundaryFingerprint,
  type CandidateFactRequirement,
  type KnowledgeBoundaryCertification,
  type SemanticAdjudication,
  type StandardPipelineInput,
  type StandardPipelineResult,
} from "@alp/qualification-pipeline";

import { ADJUDICATION_OVERRIDES, AC21_SUBJECTS_NOT_ADDRESSED_BY_PA, MISSING_PROPOSITIONS, SUBJECT_NOTES, type SubjectNote } from "./decisions.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..");
const frozenInputPath = path.join(repoRoot, "reports", "backtests", "unit202-post-hardening", "CC-21-FULL-PUBLIC-INPUT.json");
const outDir = path.join(repoRoot, "reports", "backtests", "unit202-reconciliation");

function canonicalJson(value: unknown): string {
  return JSON.stringify(value, null, 2) + "\n";
}
function writeJson(absPath: string, value: unknown): void {
  writeFileSync(absPath, canonicalJson(value), "utf-8");
}

// ---------------------------------------------------------------------
// 1. Load the frozen input -- READ ONLY, never written back to.
// ---------------------------------------------------------------------
const frozenInput = JSON.parse(readFileSync(frozenInputPath, "utf-8")) as StandardPipelineInput;
const QUAL = frozenInput.qualificationId;

const AC_PATTERN = /^AC[1-6]\./;

// ---------------------------------------------------------------------
// 2. Validate every locked-AC curriculum subject has a SUBJECT_NOTES
//    entry (task section 18: "no locked proposition is silently
//    omitted"). A typo in decisions.ts fails the build loudly instead of
//    silently dropping a row.
// ---------------------------------------------------------------------
const subjectsInScope = new Set(frozenInput.curriculum.filter((c) => AC_PATTERN.test(c.curriculumUnitId)).map((c) => c.subject));
const missingNotes: string[] = [];
for (const subject of subjectsInScope) {
  if (AC21_SUBJECTS_NOT_ADDRESSED_BY_PA.has(subject)) continue;
  if (!(subject in SUBJECT_NOTES)) missingNotes.push(subject);
}
if (missingNotes.length > 0) {
  throw new Error(`CC-22 validation failure: the following curriculum subjects have no SUBJECT_NOTES entry and are not whitelisted as AC2.1/unaddressed: ${missingNotes.join(" | ")}`);
}
const unusedNotes = Object.keys(SUBJECT_NOTES).filter((s) => !subjectsInScope.has(s));
if (unusedNotes.length > 0) {
  throw new Error(`CC-22 validation failure: SUBJECT_NOTES references subjects with no matching real curriculum candidate (possible typo): ${unusedNotes.join(" | ")}`);
}

// ---------------------------------------------------------------------
// 3. Construct SemanticAdjudication[] mechanically: REQUIRED_CORE for
//    every REVIEW_PROPOSED CandidateFactRequirement, except the explicit
//    ADJUDICATION_OVERRIDES. supportingEvidenceRefs are reused DIRECTLY
//    from the factRequirement's own sourceEvidenceRefs -- guaranteed
//    real and already-correctly-targeted, never re-typed.
// ---------------------------------------------------------------------
const overrideByIdentity = new Map(ADJUDICATION_OVERRIDES.map((o) => [`${o.targetCandidateKey}::${o.claimKey}`, o]));

const curriculumByEvidenceId = new Map(frozenInput.curriculum.map((c) => [c.evidenceId, c]));
/** Real OFFICIAL_CURRICULUM evidenceId(s) for a given candidateKey -- the exact curriculum record(s) that generated it. */
const curriculumEvidenceIdsByCandidateKey = new Map<string, string[]>();
for (const c of frozenInput.curriculum) {
  const key = `${c.subject}::${c.commandVerbPerformanceType}`;
  const list = curriculumEvidenceIdsByCandidateKey.get(key) ?? [];
  list.push(c.evidenceId);
  curriculumEvidenceIdsByCandidateKey.set(key, list);
}

const allFactRequirements = frozenInput.factRequirements ?? [];
const allFactualClaims = frozenInput.factualClaims ?? [];
const allQualificationLevel = frozenInput.qualificationLevel ?? [];

const reviewProposed = allFactRequirements.filter((f) => f.derivationStatus === "REVIEW_PROPOSED");
let adjudicationCounter = 0;
const semanticAdjudications: SemanticAdjudication[] = reviewProposed.map((f) => {
  adjudicationCounter += 1;
  const identity = `${f.targetCandidateKey}::${f.claimKey}`;
  const override = overrideByIdentity.get(identity);
  const curriculumRef = curriculumByEvidenceId.get(f.sourceEvidenceRefs[0]?.evidenceId ?? "");
  return {
    qualificationId: QUAL,
    targetCandidateKey: f.targetCandidateKey,
    claimKey: f.claimKey,
    decision: override?.decision ?? "REQUIRED_CORE",
    adjudicationBasis: ["SEMANTIC_NECESSITY"],
    adjudicatorKind: "LLM_EVIDENCE_BOUND",
    decisionRef: `CC-22-ADJ-${String(adjudicationCounter).padStart(3, "0")}`,
    rationale:
      override?.rationale ??
      `Project-Architect locked decision (CC-22 task section 5${curriculumRef ? `, ${curriculumRef.curriculumUnitId}` : ""}): required qualification knowledge, promoted REQUIRED_CORE against real curriculum evidence.`,
    supportingEvidenceRefs: f.sourceEvidenceRefs,
    sourceRef: "CC-22 task prompt: Project-Architect locked Unit-202 decisions, section 5",
    sourceLocator: `${identity}`,
    normalizationBasis: "SEMANTIC_ADJUDICATION_DECISION",
  };
});

// ---------------------------------------------------------------------
// 4. Pass 1: run the pipeline with adjudications only, to learn each
//    candidate's REAL current boundary fingerprint -- mirrors the exact
//    logic buildStandardPipeline itself uses internally (rules.test.ts's
//    computeFingerprintFromResult pattern), from public result fields
//    only.
// ---------------------------------------------------------------------
function computeFingerprintFromResult(result: StandardPipelineResult, targetCandidateKey: string): string {
  const candidate = result.candidates.find((c) => c.candidateKey === targetCandidateKey);
  if (!candidate) throw new Error(`CC-22: cannot compute fingerprint -- no candidate for "${targetCandidateKey}"`);
  const governingKeys = new Set(candidate.requiredFactKeys ?? []);
  const pendingReviewProposedClaimKeys = allFactRequirements
    .filter((f) => f.targetCandidateKey === targetCandidateKey && f.derivationStatus === "REVIEW_PROPOSED" && !governingKeys.has(f.claimKey))
    .map((f) => f.claimKey);
  const adjudicationOutcomes = result.semanticAdjudicationOutcomes.filter((a) => a.targetCandidateKey === targetCandidateKey).map((a) => ({ claimKey: a.claimKey, decision: a.decision }));
  const governedChildCandidateKeys = result.candidates.filter((c) => c.parentSubject === candidate.subject).map((c) => c.candidateKey);
  return computeKnowledgeBoundaryFingerprint({
    qualificationId: QUAL,
    targetCandidateKey,
    performanceType: candidate.performanceType,
    performanceProvenance: candidate.performanceProvenance,
    requiredFactKeys: candidate.requiredFactKeys ?? [],
    pendingReviewProposedClaimKeys,
    adjudicationOutcomes,
    governedChildCandidateKeys,
  });
}

const pass1Input: StandardPipelineInput = { ...frozenInput, semanticAdjudications };
const pass1Result = buildStandardPipeline(pass1Input);

// ---------------------------------------------------------------------
// 5. Construct KnowledgeBoundaryCertification[] for every subject whose
//    SUBJECT_NOTES entry names a certification decision, bound to the
//    REAL current fingerprint from pass 1, cited against the real
//    OFFICIAL_CURRICULUM evidence for that exact candidate.
// ---------------------------------------------------------------------
let certificationCounter = 0;
const knowledgeBoundaryCertifications: KnowledgeBoundaryCertification[] = [];
for (const [subject, note] of Object.entries(SUBJECT_NOTES)) {
  if (!note.certification) continue;
  const candidatesForSubject = pass1Result.candidates.filter((c) => c.subject === subject);
  for (const candidate of candidatesForSubject) {
    certificationCounter += 1;
    const fingerprint = computeFingerprintFromResult(pass1Result, candidate.candidateKey);
    const curriculumIds = curriculumEvidenceIdsByCandidateKey.get(candidate.candidateKey) ?? [];
    if (curriculumIds.length === 0) throw new Error(`CC-22: no real OFFICIAL_CURRICULUM evidenceId found for candidate "${candidate.candidateKey}" -- cannot construct a certification`);
    knowledgeBoundaryCertifications.push({
      qualificationId: QUAL,
      targetCandidateKey: candidate.candidateKey,
      decision: note.certification.decision,
      adjudicatorKind: "LLM_EVIDENCE_BOUND",
      certificationRef: `CC-22-CERT-${String(certificationCounter).padStart(3, "0")}`,
      boundaryFingerprint: fingerprint,
      rationale: note.certification.rationale,
      supportingEvidenceRefs: curriculumIds.map((evidenceId) => ({ role: "OFFICIAL_CURRICULUM" as const, evidenceId })),
      sourceRef: "CC-22 task prompt: Project-Architect locked Unit-202 decisions, section 5",
      sourceLocator: `SUBJECT_NOTES["${subject}"].certification`,
      normalizationBasis: "KNOWLEDGE_BOUNDARY_CERTIFICATION_DECISION",
    });
  }
}

// ---------------------------------------------------------------------
// 6. Pass 2 -- the REAL final result: adjudications + certifications
//    together, against the unmodified frozen input.
// ---------------------------------------------------------------------
const finalInput: StandardPipelineInput = { ...frozenInput, semanticAdjudications, knowledgeBoundaryCertifications };
const finalResult = buildStandardPipeline(finalInput);

// ---------------------------------------------------------------------
// 7. Reconciliation ledger -- one row per real candidate, joined with
//    SUBJECT_NOTES (or AC2.1's AWAITING_PROJECT_ARCHITECT_DECISION
//    default), plus one row per MISSING_PROPOSITIONS entry.
// ---------------------------------------------------------------------
const factReqsByTarget = new Map<string, CandidateFactRequirement[]>();
for (const f of allFactRequirements) {
  const list = factReqsByTarget.get(f.targetCandidateKey) ?? [];
  list.push(f);
  factReqsByTarget.set(f.targetCandidateKey, list);
}
const claimsByKey = new Map(allFactualClaims.map((c) => [c.claimKey, c]));
const adjudicationsByTarget = new Map<string, SemanticAdjudication[]>();
for (const a of semanticAdjudications) {
  const list = adjudicationsByTarget.get(a.targetCandidateKey) ?? [];
  list.push(a);
  adjudicationsByTarget.set(a.targetCandidateKey, list);
}
const qualLevelByTarget = new Map<string, string[]>();
for (const q of allQualificationLevel) {
  const list = qualLevelByTarget.get(q.appliesToCandidateKey) ?? [];
  list.push(q.evidenceId);
  qualLevelByTarget.set(q.appliesToCandidateKey, list);
}

interface LedgerRow {
  readonly reconciliationId: string;
  readonly ac: string;
  readonly subject: string;
  readonly performanceType: string | null;
  readonly paClassification: string;
  readonly candidateExists: boolean;
  readonly candidateKey: string | null;
  readonly factRequirementExists: boolean;
  readonly claimKeys: string[];
  readonly semanticAdjudicationRequired: boolean;
  readonly semanticAdjudicationDecisions: { claimKey: string; decision: string }[];
  readonly officialCurriculumEvidenceIds: string[];
  readonly publicAssessmentEvidenceIds: string[];
  readonly qualificationLevelEvidenceIds: string[];
  readonly technicalFactualClaimIds: string[];
  readonly technicalSourceRefs: string[];
  readonly technicalCoverageState: string | null;
  readonly knowledgeBoundaryStatus: string | null;
  readonly certificationEligibleComplete: boolean;
  readonly certificationReasonIfNot: string | null;
  readonly gapType: string;
  readonly notes: string;
}

let rowCounter = 0;
const ledger: LedgerRow[] = [];

for (const c of finalResult.candidates) {
  if (!AC_PATTERN.test(curriculumByEvidenceId.get((c.evidenceRefs.find((r) => r.role === "OFFICIAL_CURRICULUM")?.evidenceId) ?? "")?.curriculumUnitId ?? "")) continue;
  rowCounter += 1;
  const note: SubjectNote | undefined = SUBJECT_NOTES[c.subject];
  const isAC21 = AC21_SUBJECTS_NOT_ADDRESSED_BY_PA.has(c.subject);
  const factReqs = factReqsByTarget.get(c.candidateKey) ?? [];
  const claimKeys = [...new Set(factReqs.map((f) => f.claimKey))];
  const claims = claimKeys.map((k) => claimsByKey.get(k)).filter((x): x is NonNullable<typeof x> => x !== undefined);
  const adjudications = adjudicationsByTarget.get(c.candidateKey) ?? [];
  const certification = knowledgeBoundaryCertifications.find((cert) => cert.targetCandidateKey === c.candidateKey);
  const curriculumRef = frozenInput.curriculum.find((cur) => cur.evidenceId === (c.evidenceRefs.find((r) => r.role === "OFFICIAL_CURRICULUM")?.evidenceId));

  ledger.push({
    reconciliationId: `RL-${String(rowCounter).padStart(3, "0")}`,
    ac: curriculumRef?.curriculumUnitId ?? note?.ac ?? "UNKNOWN",
    subject: c.subject,
    performanceType: c.performanceType,
    paClassification: isAC21 ? "AWAITING_PROJECT_ARCHITECT_DECISION" : (note?.paClassification ?? "AWAITING_PROJECT_ARCHITECT_DECISION"),
    candidateExists: true,
    candidateKey: c.candidateKey,
    factRequirementExists: factReqs.length > 0,
    claimKeys,
    semanticAdjudicationRequired: factReqs.some((f) => f.derivationStatus === "REVIEW_PROPOSED"),
    semanticAdjudicationDecisions: adjudications.map((a) => ({ claimKey: a.claimKey, decision: a.decision })),
    officialCurriculumEvidenceIds: c.evidenceRefs.filter((r) => r.role === "OFFICIAL_CURRICULUM").map((r) => r.evidenceId),
    publicAssessmentEvidenceIds: c.evidenceRefs.filter((r) => r.role === "PUBLIC_ASSESSMENT").map((r) => r.evidenceId),
    qualificationLevelEvidenceIds: qualLevelByTarget.get(c.candidateKey) ?? [],
    technicalFactualClaimIds: claims.map((cl) => cl.evidenceId),
    technicalSourceRefs: [...new Set(claims.map((cl) => cl.sourceRef))],
    technicalCoverageState: c.technicalCoverageStatus ?? null,
    knowledgeBoundaryStatus: c.knowledgeBoundaryStatus ?? null,
    certificationEligibleComplete: certification?.decision === "COMPLETE",
    certificationReasonIfNot: certification?.decision === "COMPLETE" ? null : (note?.notes ?? (isAC21 ? "AC2.1 not addressed by Project-Architect locked decisions in this package." : "No certification constructed in this package.")),
    gapType: isAC21 ? "AWAITING_PA_DECISION" : (note?.gapType ?? "C_MISSING_FACT_REQUIREMENT"),
    notes: isAC21 ? "AC2.1 is not part of the Project-Architect locked decisions in CC-22 task section 5 -- left unresolved and reported here for Project-Architect decision, per task section 9." : (note?.notes ?? "No SUBJECT_NOTES entry."),
  });
}

const missingPropRows = MISSING_PROPOSITIONS.map((mp) => ({
  reconciliationId: mp.reconciliationId,
  ac: mp.ac,
  subject: mp.proposition,
  performanceType: null,
  paClassification: mp.paClassification,
  candidateExists: false,
  candidateKey: mp.closestCandidateKey,
  factRequirementExists: false,
  claimKeys: [],
  semanticAdjudicationRequired: false,
  semanticAdjudicationDecisions: [],
  officialCurriculumEvidenceIds: [],
  publicAssessmentEvidenceIds: [],
  qualificationLevelEvidenceIds: [],
  technicalFactualClaimIds: [],
  technicalSourceRefs: [],
  technicalCoverageState: null,
  knowledgeBoundaryStatus: null,
  certificationEligibleComplete: false,
  certificationReasonIfNot: mp.notes,
  gapType: mp.gapType,
  notes: mp.notes,
}));

const fullLedger = [...ledger, ...missingPropRows];

// ---------------------------------------------------------------------
// 8. Technical-evidence gap manifest -- every row whose gapType names a
//    technical/scope/exemplar/adjudication deficiency (task section 14).
// ---------------------------------------------------------------------
const ACTIONABLE_GAP_TYPES = new Set(["B_MISSING_NORMALIZED_CANDIDATE", "C_MISSING_FACT_REQUIREMENT", "D_SEMANTIC_ADJUDICATION_REQUIRED", "E_MISSING_QUALIFICATION_SCOPE_EVIDENCE", "F_MISSING_PERFORMANCE_DEPTH_EVIDENCE", "G_MISSING_TECHNICAL_TRUTH", "H_TECHNICAL_CONFLICT", "I_CALIBRATED_EXEMPLAR_NEEDS_PUBLIC_SUPPORT"]);

function sourceTypeFor(gapType: string): string {
  switch (gapType) {
    case "B_MISSING_NORMALIZED_CANDIDATE":
    case "E_MISSING_QUALIFICATION_SCOPE_EVIDENCE":
      return "official curriculum clarification or public assessment evidence";
    case "I_CALIBRATED_EXEMPLAR_NEEDS_PUBLIC_SUPPORT":
      return "official/public assessment evidence linking the named component to the named application";
    case "G_MISSING_TECHNICAL_TRUTH":
      return "authoritative electrical-engineering / electronics / mathematics source, as applicable to the proposition";
    case "C_MISSING_FACT_REQUIREMENT":
    case "D_SEMANTIC_ADJUDICATION_REQUIRED":
      return "fact/procedure requirement authoring against existing curriculum evidence (no new source needed)";
    default:
      return "Project-Architect review";
  }
}

const technicalEvidenceGaps = fullLedger
  .filter((r) => ACTIONABLE_GAP_TYPES.has(r.gapType))
  .map((r) => ({
    reconciliationId: r.reconciliationId,
    ac: r.ac,
    proposition: r.subject,
    candidateKey: r.candidateKey,
    claimKeys: r.claimKeys,
    gapType: r.gapType,
    missingEvidenceRole:
      r.gapType === "I_CALIBRATED_EXEMPLAR_NEEDS_PUBLIC_SUPPORT" || r.gapType === "E_MISSING_QUALIFICATION_SCOPE_EVIDENCE"
        ? "OFFICIAL_CURRICULUM / PUBLIC_ASSESSMENT"
        : r.gapType === "G_MISSING_TECHNICAL_TRUTH"
          ? "TECHNICAL_TRUTH"
          : r.gapType === "B_MISSING_NORMALIZED_CANDIDATE"
            ? "OFFICIAL_CURRICULUM (new candidate/Range member)"
            : "CandidateFactRequirement",
    whyInsufficient: r.notes,
    newResearchRequired: r.gapType === "E_MISSING_QUALIFICATION_SCOPE_EVIDENCE" || r.gapType === "G_MISSING_TECHNICAL_TRUTH" || r.gapType === "I_CALIBRATED_EXEMPLAR_NEEDS_PUBLIC_SUPPORT" || r.gapType === "B_MISSING_NORMALIZED_CANDIDATE",
    sourceTypeRequested: sourceTypeFor(r.gapType),
  }));

// ---------------------------------------------------------------------
// 9. Candidate-level status output (task section 13 item 5).
// ---------------------------------------------------------------------
const statusOutput = {
  qualificationId: QUAL,
  generatedFrom: "reports/backtests/unit202-post-hardening/CC-21-FULL-PUBLIC-INPUT.json (frozen, read-only)",
  pipelineVersion: "packages/qualification-pipeline @ HEAD 9663120 (CC-21B)",
  semanticAdjudicationsApplied: semanticAdjudications.length,
  knowledgeBoundaryCertificationsApplied: knowledgeBoundaryCertifications.length,
  candidates: finalResult.candidates.map((c) => ({
    candidateKey: c.candidateKey,
    subject: c.subject,
    performanceType: c.performanceType,
    disposition: c.disposition,
    isExplicitlyStructuralNode: c.isExplicitlyStructuralNode ?? false,
    requiredFactKeys: c.requiredFactKeys ?? [],
    technicalCoverageStatus: c.technicalCoverageStatus ?? null,
    knowledgeBoundaryStatus: c.knowledgeBoundaryStatus ?? null,
  })),
  gapsByType: countBy(finalResult.gaps.map((g) => g.gapType)),
  totalGaps: finalResult.gaps.length,
  knowledgeBoundaryCertificationOutcomes: finalResult.knowledgeBoundaryCertificationOutcomes.map((cert) => ({ targetCandidateKey: cert.targetCandidateKey, decision: cert.decision, certificationRef: cert.certificationRef })),
};

function countBy<T extends string>(values: readonly (T | undefined)[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const v of values) {
    const key = v ?? "(undeclared)";
    out[key] = (out[key] ?? 0) + 1;
  }
  return out;
}

// ---------------------------------------------------------------------
// 10. Summary counts (task section 15).
// ---------------------------------------------------------------------
const acCandidates = finalResult.candidates.filter((c) => AC_PATTERN.test(curriculumByEvidenceId.get(c.evidenceRefs.find((r) => r.role === "OFFICIAL_CURRICULUM")?.evidenceId ?? "")?.curriculumUnitId ?? ""));

const summary = {
  totalLockedPropositions: fullLedger.length,
  fullyMapped: fullLedger.filter((r) => r.gapType === "A_NO_GAP").length,
  missingNormalizedCandidate: fullLedger.filter((r) => r.gapType === "B_MISSING_NORMALIZED_CANDIDATE").length,
  missingFactRequirement: fullLedger.filter((r) => r.gapType === "C_MISSING_FACT_REQUIREMENT").length,
  awaitingSemanticAdjudication: fullLedger.filter((r) => r.gapType === "D_SEMANTIC_ADJUDICATION_REQUIRED").length,
  qualificationScopeEvidenceGaps: fullLedger.filter((r) => r.gapType === "E_MISSING_QUALIFICATION_SCOPE_EVIDENCE").length,
  depthPerformanceEvidenceGaps: fullLedger.filter((r) => r.gapType === "F_MISSING_PERFORMANCE_DEPTH_EVIDENCE").length,
  technicalTruthGaps: fullLedger.filter((r) => r.gapType === "G_MISSING_TECHNICAL_TRUTH").length,
  technicalConflicts: fullLedger.filter((r) => r.gapType === "H_TECHNICAL_CONFLICT").length,
  calibratedExemplarPublicSupportGaps: fullLedger.filter((r) => r.gapType === "I_CALIBRATED_EXEMPLAR_NEEDS_PUBLIC_SUPPORT").length,
  contextualSupport: fullLedger.filter((r) => r.paClassification === "CONTEXTUAL_TEACHING_SUPPORT").length,
  outOfScopeOrOverdepth: fullLedger.filter((r) => r.gapType === "J_OUT_OF_SCOPE_OR_OVERDEPTH").length,
  awaitingProjectArchitectDecision: fullLedger.filter((r) => r.paClassification === "AWAITING_PROJECT_ARCHITECT_DECISION").length,
  candidatesGoverned: acCandidates.filter((c) => c.knowledgeBoundaryStatus === "GOVERNED").length,
  candidatesPartial: acCandidates.filter((c) => c.knowledgeBoundaryStatus === "PARTIAL").length,
  candidatesAdjudicationRequired: acCandidates.filter((c) => c.knowledgeBoundaryStatus === "ADJUDICATION_REQUIRED").length,
  candidatesUnresolved: acCandidates.filter((c) => c.knowledgeBoundaryStatus === "UNRESOLVED").length,
  candidatesStructurallyDecomposed: acCandidates.filter((c) => c.knowledgeBoundaryStatus === "STRUCTURALLY_DECOMPOSED").length,
  byAC: (() => {
    const groups = new Map<string, { total: number; noGap: number; gaps: Record<string, number> }>();
    for (const r of fullLedger) {
      const g = groups.get(r.ac) ?? { total: 0, noGap: 0, gaps: {} };
      g.total += 1;
      if (r.gapType === "A_NO_GAP") g.noGap += 1;
      else g.gaps[r.gapType] = (g.gaps[r.gapType] ?? 0) + 1;
      groups.set(r.ac, g);
    }
    return Object.fromEntries([...groups.entries()].sort());
  })(),
};

// ---------------------------------------------------------------------
// 11. Emit outputs.
// ---------------------------------------------------------------------
mkdirSync(outDir, { recursive: true });

writeJson(path.join(outDir, "UNIT202-KNOWLEDGE-BOUNDARY-RECONCILIATION.json"), {
  qualificationId: QUAL,
  generatedFrom: frozenInputPath.replace(repoRoot + path.sep, "").replace(/\\/g, "/"),
  summary,
  ledger: fullLedger,
});

writeJson(path.join(outDir, "UNIT202-TECHNICAL-EVIDENCE-GAPS.json"), {
  qualificationId: QUAL,
  totalGaps: technicalEvidenceGaps.length,
  gaps: technicalEvidenceGaps,
});

writeJson(path.join(outDir, "UNIT202-KNOWLEDGE-BOUNDARY-STATUS.json"), statusOutput);

function mdEscape(s: string): string {
  return s.replace(/\|/g, "\\|");
}

const answer = summary.qualificationScopeEvidenceGaps + summary.technicalTruthGaps + summary.calibratedExemplarPublicSupportGaps > 25 ? "C" : summary.qualificationScopeEvidenceGaps + summary.technicalTruthGaps + summary.calibratedExemplarPublicSupportGaps > 5 ? "B" : "A";

const reconciliationMd = `# Unit 202 Knowledge-Boundary Reconciliation (CC-22)

Generated from \`reports/backtests/unit202-post-hardening/CC-21-FULL-PUBLIC-INPUT.json\` (frozen, read-only), against \`@alp/qualification-pipeline\` at HEAD 9663120 (CC-21B). ${semanticAdjudications.length} SemanticAdjudication and ${knowledgeBoundaryCertifications.length} KnowledgeBoundaryCertification records were constructed by this package (see \`decisions.ts\`) and applied to a COPY of the frozen input -- the frozen input itself is never modified.

## Summary counts

| Metric | Count |
|---|---|
| Total locked propositions (candidate rows + explicit missing-proposition rows) | ${summary.totalLockedPropositions} |
| Fully mapped (NO_GAP) | ${summary.fullyMapped} |
| Missing normalized candidate | ${summary.missingNormalizedCandidate} |
| Missing fact requirement | ${summary.missingFactRequirement} |
| Awaiting semantic adjudication | ${summary.awaitingSemanticAdjudication} |
| Qualification-scope evidence gaps | ${summary.qualificationScopeEvidenceGaps} |
| Depth/performance evidence gaps | ${summary.depthPerformanceEvidenceGaps} |
| Technical-truth gaps | ${summary.technicalTruthGaps} |
| Technical conflicts | ${summary.technicalConflicts} |
| Calibrated-exemplar public-support gaps | ${summary.calibratedExemplarPublicSupportGaps} |
| Contextual support | ${summary.contextualSupport} |
| Out-of-scope/overdepth | ${summary.outOfScopeOrOverdepth} |
| Awaiting Project-Architect decision (AC2.1) | ${summary.awaitingProjectArchitectDecision} |
| Candidates GOVERNED | ${summary.candidatesGoverned} |
| Candidates PARTIAL | ${summary.candidatesPartial} |
| Candidates ADJUDICATION_REQUIRED | ${summary.candidatesAdjudicationRequired} |
| Candidates UNRESOLVED | ${summary.candidatesUnresolved} |
| Candidates STRUCTURALLY_DECOMPOSED | ${summary.candidatesStructurallyDecomposed} |

## Gaps grouped by AC

| AC | Total rows | NO_GAP | Other gap types |
|---|---|---|---|
${Object.entries(summary.byAC)
  .map(([ac, g]) => `| ${ac} | ${g.total} | ${g.noGap} | ${Object.entries(g.gaps).map(([t, n]) => `${t}=${n}`).join(", ") || "-"} |`)
  .join("\n")}

## Direct answer (task section 16)

**${answer}** -- ${answer === "A" ? "current evidence is sufficient." : answer === "B" ? "only a narrow targeted evidence pass is required." : "substantial evidence collection is required."}

Based on: ${summary.qualificationScopeEvidenceGaps} qualification-scope evidence gaps (category E) + ${summary.technicalTruthGaps} technical-truth gaps (category G) + ${summary.calibratedExemplarPublicSupportGaps} calibrated-exemplar public-support gaps (category I) = ${summary.qualificationScopeEvidenceGaps + summary.technicalTruthGaps + summary.calibratedExemplarPublicSupportGaps} evidence-collection-relevant gaps out of ${summary.totalLockedPropositions} total locked propositions. See \`UNIT202-TECHNICAL-EVIDENCE-GAPS.md\` for the full actionable list.

## Systemic finding: umbrella parents not structurally linked to their own content

Seven curriculum-authored "principles of..."/"basic operating principles of..." PRIMARY_REQUIREMENT candidates exist as umbrellas over real, well-evidenced sibling topics, but were never given \`refinesSubject\`/\`parentSubject\` links (or their own facts) connecting them to those siblings: \`electrical instruments for the measurement of electrical quantities\` (AC2.3), \`principles of basic mechanics as applied to levers, gears and pulleys\` (AC3.2), \`principles of force, work, energy, power and efficiency\` (AC3.3) and its AC3.4 sibling \`values of mechanical energy, power and efficiency\`, \`magnetic effects of electrical currents\` and \`electromagnetism\` (AC5.3), \`basic principles of generating an A.C. supply\` (AC5.4), \`function and application of electronic components used in electrical systems\` (AC6.1), and \`basic operating principles of electronic components and devices\` (AC6.2). Per CC-20A's correctly-conservative rule, a \`PRIMARY_REQUIREMENT\` is never treated as structurally exhausted merely because children point to it (and several of these have NO children pointing to them at all -- a parallel RANGE_CATEGORY sibling exists instead, e.g. AC2.3's dual-parent pattern). Each stays \`UNRESOLVED\`/\`ADJUDICATION_REQUIRED\`, correctly and conservatively, even though their constituent topics are individually well-governed. This is a real, recurring **evidence-authoring** pattern in the frozen Unit-202 curriculum data (not a generic-pipeline defect) -- flagged here for Project-Architect review; not corrected in this package (frozen evidence).

## Full ledger

See \`UNIT202-KNOWLEDGE-BOUNDARY-RECONCILIATION.json\` for the complete, machine-readable ledger (${fullLedger.length} rows). Abbreviated view below (subject, AC, classification, gap type):

| ID | AC | Subject | Classification | Gap |
|---|---|---|---|---|
${fullLedger.map((r) => `| ${r.reconciliationId} | ${r.ac} | ${mdEscape(r.subject)}${r.performanceType ? ` (${r.performanceType})` : ""} | ${r.paClassification} | ${r.gapType} |`).join("\n")}
`;

writeFileSync(path.join(outDir, "UNIT202-KNOWLEDGE-BOUNDARY-RECONCILIATION.md"), reconciliationMd, "utf-8");

const gapsMd = `# Unit 202 Technical Evidence Gaps (CC-22)

${technicalEvidenceGaps.length} actionable gaps, each naming the exact proposition, missing evidence role, why existing evidence is insufficient, whether new research is required, and what type of source would close it. No URLs are nominated (task section 14) -- source TYPE only.

| ID | AC | Proposition | Missing role | New research? | Source type requested |
|---|---|---|---|---|---|
${technicalEvidenceGaps.map((g) => `| ${g.reconciliationId} | ${g.ac} | ${mdEscape(g.proposition)} | ${g.missingEvidenceRole} | ${g.newResearchRequired ? "yes" : "no"} | ${mdEscape(g.sourceTypeRequested)} |`).join("\n")}

## Why each is insufficient

${technicalEvidenceGaps.map((g) => `### ${g.reconciliationId} -- ${g.proposition}\n\n${g.whyInsufficient}`).join("\n\n")}
`;

writeFileSync(path.join(outDir, "UNIT202-TECHNICAL-EVIDENCE-GAPS.md"), gapsMd, "utf-8");

console.log("CC-22 reconciliation complete.");
console.log(`  ledger rows: ${fullLedger.length}`);
console.log(`  technical evidence gaps: ${technicalEvidenceGaps.length}`);
console.log(`  semanticAdjudications applied: ${semanticAdjudications.length}`);
console.log(`  knowledgeBoundaryCertifications applied: ${knowledgeBoundaryCertifications.length}`);
console.log(`  answer: ${answer}`);
console.log(`  outputs written to: ${outDir}`);
