/**
 * CC-22A: corrects the CC-22 Unit-202 reconciliation (commit d828e78,
 * held for six defects -- see the CC-22A task prompt section 1). This
 * script:
 *
 *  1. Removes the blanket "every REVIEW_PROPOSED -> REQUIRED_CORE"
 *     default entirely -- SemanticAdjudication records are constructed
 *     ONLY from claim-decisions.ts's explicit whitelist.
 *  2. Builds the reconciliation ledger from ATOMIC Project-Architect
 *     propositions (the real, Product-Owner-approved Source-Acquisition-
 *     Manifest's 126 required-knowledge items, plus 21 supplementary
 *     rows for content that manifest does not decompose to -- see
 *     cluster-mapping.ts), never from candidate count.
 *  3. Classifies technical-evidence state from the REAL, already-
 *     collected Unit-202 Technical Source Verification dossier
 *     (scripts/content/data/unit202-technical-source-verification.ts,
 *     126 propositionCoverage records, 67 approved sources) -- never
 *     treating the frozen CC-21 blind-experiment input as the entire
 *     evidence universe.
 *  4. Separates qualification-evidence state, technical-evidence state,
 *     and next-action from each other and from PA classification.
 *  5. Constructs KnowledgeBoundaryCertification records only per
 *     certification-decisions.ts's conservative, corrected list.
 *  6. Emits NO automatic A/B/C verdict -- PROJECT_ARCHITECT_PENDING.
 *
 * Reads the frozen CC-21 input, the Source-Acquisition-Manifest and the
 * Technical Source Verification manifest READ-ONLY. Modifies none of
 * them. Modifies no generic pipeline file.
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

import { unit202SourceAcquisitionManifest } from "../../content/data/unit202-source-acquisition-manifest.ts";
import { unit202TechnicalSourceVerification } from "../../content/data/unit202-technical-source-verification.ts";
import { CLAIM_DECISIONS } from "./claim-decisions.ts";
import { CERTIFICATION_DECISIONS } from "./certification-decisions.ts";
import { CLUSTER_TO_SUBJECTS, SUPPLEMENTARY_PROPOSITIONS } from "./cluster-mapping.ts";

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
function countBy(values: readonly (string | undefined)[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const v of values) {
    const key = v ?? "(undeclared)";
    out[key] = (out[key] ?? 0) + 1;
  }
  return out;
}

// ---------------------------------------------------------------------
// 1. Load frozen QP input (read-only) + the real, already-collected
//    Unit-202 evidence inventory (read-only).
// ---------------------------------------------------------------------
const frozenInput = JSON.parse(readFileSync(frozenInputPath, "utf-8")) as StandardPipelineInput;
const QUAL = frozenInput.qualificationId;
const allFactRequirements = frozenInput.factRequirements ?? [];
const allFactualClaims = frozenInput.factualClaims ?? [];
const allCurriculum = frozenInput.curriculum;

const curriculumBySubject = new Map<string, (typeof allCurriculum)[number][]>();
for (const c of allCurriculum) {
  const list = curriculumBySubject.get(c.subject) ?? [];
  list.push(c);
  curriculumBySubject.set(c.subject, list);
}
function candidateKeysForSubject(subject: string): string[] {
  return (curriculumBySubject.get(subject) ?? []).map((c) => `${c.subject}::${c.commandVerbPerformanceType}`);
}
const factReqsByTarget = new Map<string, CandidateFactRequirement[]>();
for (const f of allFactRequirements) {
  const list = factReqsByTarget.get(f.targetCandidateKey) ?? [];
  list.push(f);
  factReqsByTarget.set(f.targetCandidateKey, list);
}
const claimsByKey = new Map(allFactualClaims.map((c) => [c.claimKey, c]));
const curriculumByEvidenceId = new Map(allCurriculum.map((c) => [c.evidenceId, c]));

// ---------------------------------------------------------------------
// 2. Validate: every AC1-6 curriculum subject in the frozen input is
//    covered by exactly one cluster mapping (task section 25: "every
//    active SemanticAdjudication has an explicit decision entry" starts
//    with knowing every subject's cluster).
// ---------------------------------------------------------------------
const AC_PATTERN = /^AC[1-6]\./;
const subjectsInScope = new Set(allCurriculum.filter((c) => AC_PATTERN.test(c.curriculumUnitId)).map((c) => c.subject));
const subjectToCluster = new Map<string, string>();
for (const [clusterKey, subjects] of Object.entries(CLUSTER_TO_SUBJECTS)) {
  for (const s of subjects) {
    if (subjectToCluster.has(s)) throw new Error(`CC-22A validation failure: subject "${s}" is mapped to more than one cluster (${subjectToCluster.get(s)}, ${clusterKey})`);
    subjectToCluster.set(s, clusterKey);
    if (!subjectsInScope.has(s)) throw new Error(`CC-22A validation failure: CLUSTER_TO_SUBJECTS names subject "${s}" (cluster ${clusterKey}) with no matching real curriculum candidate -- possible typo`);
  }
}
const uncoveredSubjects = [...subjectsInScope].filter((s) => !subjectToCluster.has(s));
if (uncoveredSubjects.length > 0) {
  throw new Error(`CC-22A validation failure: the following curriculum subjects have no cluster mapping: ${uncoveredSubjects.join(" | ")}`);
}

// ---------------------------------------------------------------------
// 3. Construct SemanticAdjudication[] EXCLUSIVELY from claim-decisions.ts
//    -- no default. Mechanically verify every listed (targetCandidateKey,
//    claimKey) pair actually names a real REVIEW_PROPOSED
//    CandidateFactRequirement in the frozen input (never adjudicating a
//    fabricated pair), and that no REVIEW_PROPOSED requirement outside
//    this whitelist is silently adjudicated.
// ---------------------------------------------------------------------
const decisionByIdentity = new Map(CLAIM_DECISIONS.map((d) => [`${d.targetCandidateKey}::${d.claimKey}`, d]));
const allReviewProposed = allFactRequirements.filter((f) => f.derivationStatus === "REVIEW_PROPOSED");
const reviewProposedIdentities = new Set(allReviewProposed.map((f) => `${f.targetCandidateKey}::${f.claimKey}`));

const badDecisions = CLAIM_DECISIONS.filter((d) => !reviewProposedIdentities.has(`${d.targetCandidateKey}::${d.claimKey}`));
if (badDecisions.length > 0) {
  throw new Error(`CC-22A validation failure: claim-decisions.ts names (targetCandidateKey, claimKey) pairs with no matching REVIEW_PROPOSED CandidateFactRequirement: ${badDecisions.map((d) => `${d.targetCandidateKey}::${d.claimKey}`).join(" | ")}`);
}

let adjudicationCounter = 0;
const semanticAdjudications: SemanticAdjudication[] = CLAIM_DECISIONS.map((d) => {
  adjudicationCounter += 1;
  const factReq = allReviewProposed.find((f) => f.targetCandidateKey === d.targetCandidateKey && f.claimKey === d.claimKey)!;
  return {
    qualificationId: QUAL,
    targetCandidateKey: d.targetCandidateKey,
    claimKey: d.claimKey,
    decision: d.decision,
    adjudicationBasis: d.decision === "REQUIRED_CORE" || d.decision === "REQUIRED_OPERATIONAL" ? ["SEMANTIC_NECESSITY"] : ["INSUFFICIENT_EVIDENCE"],
    adjudicatorKind: "LLM_EVIDENCE_BOUND",
    decisionRef: `CC-22A-ADJ-${String(adjudicationCounter).padStart(3, "0")}`,
    rationale: d.rationale,
    supportingEvidenceRefs: factReq.sourceEvidenceRefs,
    sourceRef: "CC-22A task prompt: Project-Architect Unit-202 decisions, section " + d.taskSection,
    sourceLocator: `${d.targetCandidateKey}::${d.claimKey}`,
    normalizationBasis: "SEMANTIC_ADJUDICATION_DECISION",
  };
});

// Mechanical proof (task section 25): no REVIEW_PROPOSED -> REQUIRED_CORE default remains --
// every adjudicated identity is explicitly named in CLAIM_DECISIONS, and every REVIEW_PROPOSED
// identity NOT in CLAIM_DECISIONS remains unadjudicated (governs nothing).
const adjudicatedIdentities = new Set(semanticAdjudications.map((a) => `${a.targetCandidateKey}::${a.claimKey}`));
const unadjudicatedReviewProposed = [...reviewProposedIdentities].filter((id) => !adjudicatedIdentities.has(id));

// ---------------------------------------------------------------------
// 4. Pass 1 -- adjudications only, to learn real current fingerprints.
// ---------------------------------------------------------------------
function computeFingerprintFromResult(result: StandardPipelineResult, targetCandidateKey: string): string {
  const candidate = result.candidates.find((c) => c.candidateKey === targetCandidateKey);
  if (!candidate) throw new Error(`CC-22A: cannot compute fingerprint -- no candidate for "${targetCandidateKey}"`);
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

const pass1Result = buildStandardPipeline({ ...frozenInput, semanticAdjudications });

// ---------------------------------------------------------------------
// 5. Construct KnowledgeBoundaryCertification[] from certification-
//    decisions.ts only.
// ---------------------------------------------------------------------
const curriculumEvidenceIdsByCandidateKey = new Map<string, string[]>();
for (const c of allCurriculum) {
  const key = `${c.subject}::${c.commandVerbPerformanceType}`;
  const list = curriculumEvidenceIdsByCandidateKey.get(key) ?? [];
  list.push(c.evidenceId);
  curriculumEvidenceIdsByCandidateKey.set(key, list);
}
const badCertifications = CERTIFICATION_DECISIONS.filter((c) => !pass1Result.candidates.some((cand) => cand.candidateKey === c.targetCandidateKey));
if (badCertifications.length > 0) {
  throw new Error(`CC-22A validation failure: certification-decisions.ts names candidateKeys with no matching real candidate: ${badCertifications.map((c) => c.targetCandidateKey).join(" | ")}`);
}

let certificationCounter = 0;
const knowledgeBoundaryCertifications: KnowledgeBoundaryCertification[] = CERTIFICATION_DECISIONS.map((d) => {
  certificationCounter += 1;
  const fingerprint = computeFingerprintFromResult(pass1Result, d.targetCandidateKey);
  const curriculumIds = curriculumEvidenceIdsByCandidateKey.get(d.targetCandidateKey) ?? [];
  if (curriculumIds.length === 0) throw new Error(`CC-22A: no real OFFICIAL_CURRICULUM evidenceId for "${d.targetCandidateKey}"`);
  return {
    qualificationId: QUAL,
    targetCandidateKey: d.targetCandidateKey,
    decision: d.decision,
    adjudicatorKind: "LLM_EVIDENCE_BOUND",
    certificationRef: `CC-22A-CERT-${String(certificationCounter).padStart(3, "0")}`,
    boundaryFingerprint: fingerprint,
    rationale: d.rationale,
    supportingEvidenceRefs: curriculumIds.map((evidenceId) => ({ role: "OFFICIAL_CURRICULUM" as const, evidenceId })),
    sourceRef: "CC-22A task prompt: Project-Architect Unit-202 decisions",
    sourceLocator: `certification-decisions.ts["${d.targetCandidateKey}"]`,
    normalizationBasis: "KNOWLEDGE_BOUNDARY_CERTIFICATION_DECISION",
  };
});

const finalResult = buildStandardPipeline({ ...frozenInput, semanticAdjudications, knowledgeBoundaryCertifications });

// ---------------------------------------------------------------------
// 6. Build the ATOMIC PA proposition ledger.
// ---------------------------------------------------------------------
type TechnicalEvidenceState = "EXACT_CURRENT_FACTUAL_CLAIM" | "VERIFIED_EXISTING_SOURCE_NEEDS_CLAIM_NORMALIZATION" | "REVIEW_EXISTING_SOURCE_LOCATOR" | "NEW_EXTERNAL_TECHNICAL_SOURCE_REQUIRED" | "NOT_APPLICABLE";
type QualificationEvidenceState = "EXPLICIT_PUBLIC_CURRICULUM" | "PUBLIC_ASSESSMENT_SUPPORTED" | "CALIBRATED_ONLY_PUBLIC_SUPPORT_NEEDED" | "FOUNDATIONAL_NECESSITY" | "CONTEXT_ONLY" | "OUT_OF_SCOPE";
type NextAction = "NONE" | "AUTHOR_FACT_REQUIREMENT_FROM_EXISTING_AUTHORITY" | "NORMALIZE_CLAIM_FROM_EXISTING_VERIFIED_SOURCE" | "REVIEW_EXISTING_SOURCE_LOCATOR" | "GATHER_NEW_PUBLIC_QUALIFICATION_EVIDENCE" | "GATHER_NEW_TECHNICAL_SOURCE" | "PROJECT_ARCHITECT_DECISION";

interface AtomicRow {
  reconciliationId: string;
  ac: string;
  clusterKey: string | null;
  proposition: string;
  paClassification: string;
  qualificationEvidenceState: QualificationEvidenceState;
  technicalEvidenceState: TechnicalEvidenceState;
  gapTypes: string[];
  nextAction: NextAction;
  candidateKeys: string[];
  supportingSourceLocatorKeys: string[];
  approvedSourceStatus: string | null;
  gapReason: string | null;
  notes: string;
}

const propositionCoverageByKey = new Map(unit202TechnicalSourceVerification.propositionCoverage.map((p) => [`${p.clusterKey}::${p.requirementText}`, p]));

function technicalStateFromCoverage(coverageState: string | undefined): TechnicalEvidenceState {
  switch (coverageState) {
    case "VERIFIED":
      return "VERIFIED_EXISTING_SOURCE_NEEDS_CLAIM_NORMALIZATION";
    case "SOURCE_GAP":
      return "NEW_EXTERNAL_TECHNICAL_SOURCE_REQUIRED";
    case "CONDITIONAL_SOURCE_GAP":
      return "REVIEW_EXISTING_SOURCE_LOCATOR";
    default:
      return "NOT_APPLICABLE";
  }
}

/** Mechanical, candidate-mapping-derived gap dimensions + upgrade of technicalEvidenceState to EXACT_CURRENT_FACTUAL_CLAIM when a real, governing claim already exists for the mapped candidate(s). */
function candidateMappingFindings(candidateKeys: readonly string[]): { gapTypes: string[]; hasRealGoverningClaim: boolean; hasAnyFactRequirement: boolean; hasUnadjudicatedReviewProposed: boolean } {
  const gapTypes: string[] = [];
  if (candidateKeys.length === 0) {
    gapTypes.push("MISSING_NORMALIZED_CANDIDATE");
    return { gapTypes, hasRealGoverningClaim: false, hasAnyFactRequirement: false, hasUnadjudicatedReviewProposed: false };
  }
  let hasAnyFactRequirement = false;
  let hasUnadjudicatedReviewProposed = false;
  let hasRealGoverningClaim = false;
  for (const ck of candidateKeys) {
    const reqs = factReqsByTarget.get(ck) ?? [];
    if (reqs.length > 0) hasAnyFactRequirement = true;
    for (const r of reqs) {
      const identity = `${ck}::${r.claimKey}`;
      const isGoverning = r.derivationStatus === "EXPLICIT_CURRICULUM_FACT" || r.derivationStatus === "EXPLICIT_ASSESSMENT_FACT" || adjudicatedIdentities.has(identity);
      if (r.derivationStatus === "REVIEW_PROPOSED" && !adjudicatedIdentities.has(identity)) hasUnadjudicatedReviewProposed = true;
      if (isGoverning) {
        const decision = decisionByIdentity.get(identity)?.decision;
        const rejected = decision === "REJECT_OVERDEPTH" || decision === "REJECT_NOT_NECESSARY";
        if (!rejected && claimsByKey.has(r.claimKey)) hasRealGoverningClaim = true;
      }
    }
  }
  if (!hasAnyFactRequirement) gapTypes.push("MISSING_FACT_REQUIREMENT");
  if (hasUnadjudicatedReviewProposed) gapTypes.push("SEMANTIC_ADJUDICATION_REQUIRED");
  return { gapTypes, hasRealGoverningClaim, hasAnyFactRequirement, hasUnadjudicatedReviewProposed };
}

function nextActionFor(qes: QualificationEvidenceState, tes: TechnicalEvidenceState, mappingGaps: readonly string[], paClassification: string): NextAction {
  if (paClassification === "CONTEXTUAL_TEACHING_SUPPORT" || paClassification === "OUT_OF_SCOPE") return "NONE";
  if (mappingGaps.includes("SEMANTIC_ADJUDICATION_REQUIRED")) return "PROJECT_ARCHITECT_DECISION";
  if (tes === "NEW_EXTERNAL_TECHNICAL_SOURCE_REQUIRED") return "GATHER_NEW_TECHNICAL_SOURCE";
  if (tes === "REVIEW_EXISTING_SOURCE_LOCATOR") return "REVIEW_EXISTING_SOURCE_LOCATOR";
  if (tes === "VERIFIED_EXISTING_SOURCE_NEEDS_CLAIM_NORMALIZATION") return "NORMALIZE_CLAIM_FROM_EXISTING_VERIFIED_SOURCE";
  if (mappingGaps.includes("MISSING_NORMALIZED_CANDIDATE")) return qes === "EXPLICIT_PUBLIC_CURRICULUM" || qes === "FOUNDATIONAL_NECESSITY" ? "PROJECT_ARCHITECT_DECISION" : "GATHER_NEW_PUBLIC_QUALIFICATION_EVIDENCE";
  if (qes === "CALIBRATED_ONLY_PUBLIC_SUPPORT_NEEDED") return "GATHER_NEW_PUBLIC_QUALIFICATION_EVIDENCE";
  if (mappingGaps.includes("MISSING_FACT_REQUIREMENT") && tes === "EXACT_CURRENT_FACTUAL_CLAIM") return "AUTHOR_FACT_REQUIREMENT_FROM_EXISTING_AUTHORITY";
  return "NONE";
}

let rowCounter = 0;
const atomicLedger: AtomicRow[] = [];

for (const cluster of unit202SourceAcquisitionManifest.clusters) {
  const ac = cluster.relatedAcNumbers[0] ?? "?";
  const subjects = CLUSTER_TO_SUBJECTS[cluster.clusterKey] ?? [];
  const candidateKeys = subjects.flatMap((s) => candidateKeysForSubject(s));
  const groups: { kind: string; texts: readonly string[] }[] = [
    { kind: "FACTUAL_PROPOSITION", texts: cluster.factualPropositionsRequiringSupport },
    { kind: "RELATIONSHIP_OR_MECHANISM", texts: cluster.relationshipsOrMechanismsRequiringSupport },
    { kind: "PROCEDURE_OR_CALCULATION_RULE", texts: cluster.proceduresOrCalculationRulesRequiringSupport },
    { kind: "SYMBOL_OR_CONVENTION", texts: cluster.symbolsOrConventionsRequiringSupport },
    { kind: "PHYSICAL_OR_COMPONENT_RECOGNITION", texts: cluster.physicalOrComponentRecognitionRequirements },
  ];
  for (const group of groups) {
    for (const text of group.texts) {
      rowCounter += 1;
      const coverage = propositionCoverageByKey.get(`${cluster.clusterKey}::${text}`);
      const qes: QualificationEvidenceState = ac === "6.1" ? "CALIBRATED_ONLY_PUBLIC_SUPPORT_NEEDED" : "EXPLICIT_PUBLIC_CURRICULUM";
      let tes = technicalStateFromCoverage(coverage?.coverageState);
      const mapping = candidateMappingFindings(candidateKeys);
      if (tes === "VERIFIED_EXISTING_SOURCE_NEEDS_CLAIM_NORMALIZATION" && mapping.hasRealGoverningClaim) tes = "EXACT_CURRENT_FACTUAL_CLAIM";
      const gapTypes = [...mapping.gapTypes];
      if (qes === "CALIBRATED_ONLY_PUBLIC_SUPPORT_NEEDED") gapTypes.push("CALIBRATED_EXEMPLAR_NEEDS_PUBLIC_SUPPORT");
      if (tes !== "EXACT_CURRENT_FACTUAL_CLAIM" && tes !== "NOT_APPLICABLE") gapTypes.push("MISSING_TECHNICAL_TRUTH");
      if (gapTypes.length === 0) gapTypes.push("NO_GAP");
      atomicLedger.push({
        reconciliationId: `AT-${String(rowCounter).padStart(3, "0")}`,
        ac: `AC${ac}`,
        clusterKey: cluster.clusterKey,
        proposition: text,
        paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
        qualificationEvidenceState: qes,
        technicalEvidenceState: tes,
        gapTypes,
        nextAction: nextActionFor(qes, tes, gapTypes, "REQUIRED_QUALIFICATION_KNOWLEDGE"),
        candidateKeys,
        supportingSourceLocatorKeys: [...(coverage?.supportingSourceLocatorKeys ?? [])],
        approvedSourceStatus: coverage?.coverageState ?? null,
        gapReason: coverage?.gapReason ?? null,
        notes: `requirementKind=${group.kind}`,
      });
    }
  }
}

for (const sp of SUPPLEMENTARY_PROPOSITIONS) {
  const candidateKeys = sp.closestSubject ? candidateKeysForSubject(sp.closestSubject) : [];
  const mapping = candidateMappingFindings(sp.paClassification === "REQUIRED_QUALIFICATION_KNOWLEDGE" ? candidateKeys : []);
  const gapTypes = sp.paClassification === "REQUIRED_QUALIFICATION_KNOWLEDGE" ? [...mapping.gapTypes] : ["CONTEXT_ONLY_OR_OUT_OF_SCOPE"];
  if (sp.qualificationEvidenceState === "CALIBRATED_ONLY_PUBLIC_SUPPORT_NEEDED") gapTypes.push("CALIBRATED_EXEMPLAR_NEEDS_PUBLIC_SUPPORT");
  if (sp.paClassification === "REQUIRED_QUALIFICATION_KNOWLEDGE" && gapTypes.filter((g) => g !== "NO_GAP").length === 0) gapTypes.push("NO_GAP");
  atomicLedger.push({
    reconciliationId: sp.reconciliationId,
    ac: sp.ac,
    clusterKey: sp.clusterKey,
    proposition: sp.proposition,
    paClassification: sp.paClassification,
    qualificationEvidenceState: sp.qualificationEvidenceState,
    technicalEvidenceState: "NOT_APPLICABLE",
    gapTypes,
    nextAction: nextActionFor(sp.qualificationEvidenceState, "NOT_APPLICABLE", gapTypes, sp.paClassification),
    candidateKeys,
    supportingSourceLocatorKeys: [],
    approvedSourceStatus: null,
    gapReason: null,
    notes: sp.notes,
  });
}

// ---------------------------------------------------------------------
// 7. Candidate mapping (section 14.B) -- every real candidate, its
//    atomic-proposition membership, fact-requirement/claim/certification
//    state, from the REAL post-adjudication/certification result.
// ---------------------------------------------------------------------
const propositionsByCandidateKey = new Map<string, string[]>();
for (const row of atomicLedger) {
  for (const ck of row.candidateKeys) {
    const list = propositionsByCandidateKey.get(ck) ?? [];
    list.push(row.reconciliationId);
    propositionsByCandidateKey.set(ck, list);
  }
}

const candidateMapping = finalResult.candidates
  .filter((c) => AC_PATTERN.test(curriculumByEvidenceId.get(c.evidenceRefs.find((r) => r.role === "OFFICIAL_CURRICULUM")?.evidenceId ?? "")?.curriculumUnitId ?? ""))
  .map((c) => {
    const factReqs = factReqsByTarget.get(c.candidateKey) ?? [];
    const claimKeys = [...new Set(factReqs.map((f) => f.claimKey))];
    const claims = claimKeys.map((k) => claimsByKey.get(k)).filter((x): x is NonNullable<typeof x> => x !== undefined);
    const cert = knowledgeBoundaryCertifications.find((k) => k.targetCandidateKey === c.candidateKey);
    return {
      candidateKey: c.candidateKey,
      subject: c.subject,
      performanceType: c.performanceType,
      atomicPropositionIds: propositionsByCandidateKey.get(c.candidateKey) ?? [],
      factRequirementClaimKeys: claimKeys,
      factRequirementStatuses: factReqs.map((f) => ({ claimKey: f.claimKey, derivationStatus: f.derivationStatus, adjudicationDecision: decisionByIdentity.get(`${c.candidateKey}::${f.claimKey}`)?.decision ?? null })),
      technicalFactualClaimIds: claims.map((cl) => cl.evidenceId),
      requiredFactKeys: c.requiredFactKeys ?? [],
      technicalCoverageStatus: c.technicalCoverageStatus ?? null,
      knowledgeBoundaryStatus: c.knowledgeBoundaryStatus ?? null,
      certification: cert ? { decision: cert.decision, certificationRef: cert.certificationRef } : null,
    };
  });

// ---------------------------------------------------------------------
// 8. Outputs.
// ---------------------------------------------------------------------
mkdirSync(outDir, { recursive: true });

const classificationCounts = countBy(atomicLedger.map((r) => r.paClassification));
const qualificationStateCounts = countBy(atomicLedger.map((r) => r.qualificationEvidenceState));
const technicalStateCounts = countBy(atomicLedger.map((r) => r.technicalEvidenceState));
const nextActionCounts = countBy(atomicLedger.map((r) => r.nextAction));
const byAC: Record<string, { total: number; classification: Record<string, number>; qualificationState: Record<string, number>; technicalState: Record<string, number>; nextAction: Record<string, number> }> = {};
for (const r of atomicLedger) {
  const g = byAC[r.ac] ?? { total: 0, classification: {}, qualificationState: {}, technicalState: {}, nextAction: {} };
  g.total += 1;
  g.classification[r.paClassification] = (g.classification[r.paClassification] ?? 0) + 1;
  g.qualificationState[r.qualificationEvidenceState] = (g.qualificationState[r.qualificationEvidenceState] ?? 0) + 1;
  g.technicalState[r.technicalEvidenceState] = (g.technicalState[r.technicalEvidenceState] ?? 0) + 1;
  g.nextAction[r.nextAction] = (g.nextAction[r.nextAction] ?? 0) + 1;
  byAC[r.ac] = g;
}

const summary = {
  verdict: "PROJECT_ARCHITECT_PENDING",
  totalAtomicPropositions: atomicLedger.length,
  classificationCounts,
  qualificationEvidenceStateCounts: qualificationStateCounts,
  technicalEvidenceStateCounts: technicalStateCounts,
  nextActionCounts,
  candidateKnowledgeBoundaryStatusCounts: countBy(finalResult.candidates.map((c) => c.knowledgeBoundaryStatus)),
  byAC: Object.fromEntries(Object.entries(byAC).sort()),
  originalCC22ReportSuperseded: {
    commit: "d828e78",
    note: "The original CC-22 report (167 candidate-derived rows, verdict C via a numeric threshold) is SUPERSEDED by this atomic, whitelist-only reconciliation. See CC-22A task prompt section 1 for the six corrected defects.",
  },
};

writeJson(path.join(outDir, "UNIT202-PA-PROPOSITION-LEDGER.json"), { qualificationId: QUAL, summary, ledger: atomicLedger });
writeJson(path.join(outDir, "UNIT202-CANDIDATE-MAPPING.json"), { qualificationId: QUAL, candidates: candidateMapping });

const existingEvidenceInventory = {
  approvedSourcesTotal: unit202TechnicalSourceVerification.approvedSources.length,
  approvedSourcesByStatus: countBy(unit202TechnicalSourceVerification.approvedSources.map((s) => s.status)),
  propositionCoverageTotal: unit202TechnicalSourceVerification.propositionCoverage.length,
  propositionCoverageByState: countBy(unit202TechnicalSourceVerification.propositionCoverage.map((p) => p.coverageState)),
  sourceDossierNote: "scripts/content/data/unit202-technical-source-verification.ts -- Project-Architect-approved technical source dossier, retrieved 2026-08-30. NOT the frozen CC-21 blind-experiment input, which is only the mechanical evidence CC-19R/CC-21 assembled for the generic-pipeline back-test.",
  approvedSources: unit202TechnicalSourceVerification.approvedSources,
};
writeJson(path.join(outDir, "UNIT202-EXISTING-EVIDENCE-INVENTORY.json"), existingEvidenceInventory);

const gatherNewTechnical = atomicLedger.filter((r) => r.nextAction === "GATHER_NEW_TECHNICAL_SOURCE");
const gatherNewQualification = atomicLedger.filter((r) => r.nextAction === "GATHER_NEW_PUBLIC_QUALIFICATION_EVIDENCE");
const reviewLocator = atomicLedger.filter((r) => r.nextAction === "REVIEW_EXISTING_SOURCE_LOCATOR");
const normalize = atomicLedger.filter((r) => r.nextAction === "NORMALIZE_CLAIM_FROM_EXISTING_VERIFIED_SOURCE");
const authorFactReq = atomicLedger.filter((r) => r.nextAction === "AUTHOR_FACT_REQUIREMENT_FROM_EXISTING_AUTHORITY");
const paDecision = atomicLedger.filter((r) => r.nextAction === "PROJECT_ARCHITECT_DECISION");

const actionManifest = {
  qualificationId: QUAL,
  counts: {
    noNewSourceRequired: atomicLedger.filter((r) => r.nextAction === "NONE" || r.nextAction === "AUTHOR_FACT_REQUIREMENT_FROM_EXISTING_AUTHORITY").length,
    authoringOrNormalizationOnly: authorFactReq.length + normalize.length,
    reviewExistingSourceLocator: reviewLocator.length,
    newTechnicalSourceRequired: gatherNewTechnical.length,
    newPublicQualificationEvidenceRequired: gatherNewQualification.length,
    projectArchitectDecisionRequired: paDecision.length,
  },
  gatherNewTechnicalSource: gatherNewTechnical.map((r) => ({ id: r.reconciliationId, ac: r.ac, proposition: r.proposition, gapReason: r.gapReason })),
  gatherNewPublicQualificationEvidence: gatherNewQualification.map((r) => ({ id: r.reconciliationId, ac: r.ac, proposition: r.proposition })),
  reviewExistingSourceLocator: reviewLocator.map((r) => ({ id: r.reconciliationId, ac: r.ac, proposition: r.proposition, gapReason: r.gapReason })),
  normalizeFromExistingVerifiedSource: normalize.map((r) => ({ id: r.reconciliationId, ac: r.ac, proposition: r.proposition, supportingSourceLocatorKeys: r.supportingSourceLocatorKeys })),
  projectArchitectDecisionRequired: paDecision.map((r) => ({ id: r.reconciliationId, ac: r.ac, proposition: r.proposition, candidateKeys: r.candidateKeys })),
};
writeJson(path.join(outDir, "UNIT202-EVIDENCE-ACTION-MANIFEST.json"), actionManifest);

const statusOutput = {
  qualificationId: QUAL,
  generatedFrom: "reports/backtests/unit202-post-hardening/CC-21-FULL-PUBLIC-INPUT.json (frozen, read-only)",
  pipelineVersion: "packages/qualification-pipeline @ HEAD 9663120 (CC-21B, unmodified)",
  semanticAdjudicationsApplied: semanticAdjudications.length,
  knowledgeBoundaryCertificationsApplied: knowledgeBoundaryCertifications.length,
  unadjudicatedReviewProposedCount: unadjudicatedReviewProposed.length,
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
  knowledgeBoundaryCertificationOutcomes: finalResult.knowledgeBoundaryCertificationOutcomes.map((cert) => ({ targetCandidateKey: cert.targetCandidateKey, decision: cert.decision })),
};
writeJson(path.join(outDir, "UNIT202-KNOWLEDGE-BOUNDARY-STATUS.json"), statusOutput);

// Supersede the old CC-22 compatibility files.
const supersededNote = {
  status: "SUPERSEDED",
  supersededBy: "UNIT202-PA-PROPOSITION-LEDGER.json / UNIT202-EVIDENCE-ACTION-MANIFEST.json (CC-22A)",
  originalCommit: "d828e78",
  reason: "CC-22 (167 candidate-derived rows, blanket REQUIRED_CORE default, arbitrary A/B/C threshold) held for six defects -- see CC-22A task prompt section 1. This file is retained only so the old filename does not silently disappear; it no longer claims candidate count is equivalent to atomic locked propositions.",
};
writeJson(path.join(outDir, "UNIT202-KNOWLEDGE-BOUNDARY-RECONCILIATION.json"), supersededNote);
writeJson(path.join(outDir, "UNIT202-TECHNICAL-EVIDENCE-GAPS.json"), supersededNote);
writeFileSync(path.join(outDir, "UNIT202-KNOWLEDGE-BOUNDARY-RECONCILIATION.md"), `# SUPERSEDED\n\nThis CC-22 report (commit d828e78) is superseded by CC-22A's atomic reconciliation.\n\nSee \`UNIT202-PA-PROPOSITION-LEDGER.md\` and \`UNIT202-EVIDENCE-ACTION-MANIFEST.md\`.\n\nReason: CC-22 applied a blanket REQUIRED_CORE default, treated the frozen CC-21 blind-experiment input as the entire evidence universe, used candidate count as proposition count, and produced an automatic A/B/C verdict from an arbitrary numeric threshold -- all six defects listed in the CC-22A task prompt section 1.\n`, "utf-8");
writeFileSync(path.join(outDir, "UNIT202-TECHNICAL-EVIDENCE-GAPS.md"), `# SUPERSEDED\n\nThis CC-22 report (commit d828e78) is superseded by CC-22A's atomic reconciliation.\n\nSee \`UNIT202-EVIDENCE-ACTION-MANIFEST.md\`.\n`, "utf-8");

function mdEscape(s: string): string {
  return s.replace(/\|/g, "\\|");
}

const ledgerMd = `# Unit 202 Project-Architect Proposition Ledger (CC-22A)

Corrects and SUPERSEDES the CC-22 report committed in \`d828e78\`. Built from the real, Product-Owner-approved Source-Acquisition-Manifest (\`scripts/content/data/unit202-source-acquisition-manifest.ts\`, ${unit202SourceAcquisitionManifest.clusters.length} clusters) plus ${SUPPLEMENTARY_PROPOSITIONS.length} supplementary rows for content that manifest does not decompose to (task section 12's AC6.1 breakdown, the rejected "gears create power" misconception, relay/contactor context). **${atomicLedger.length} atomic propositions total** -- this count is the number of distinct required-knowledge items, never candidate count.

**Verdict: PROJECT_ARCHITECT_PENDING** (task section 20 -- no automatic A/B/C).

## Classification counts

| Classification | Count |
|---|---|
${Object.entries(classificationCounts).map(([k, v]) => `| ${k} | ${v} |`).join("\n")}

## Qualification-evidence state counts

| State | Count |
|---|---|
${Object.entries(qualificationStateCounts).map(([k, v]) => `| ${k} | ${v} |`).join("\n")}

## Technical-evidence state counts

| State | Count |
|---|---|
${Object.entries(technicalStateCounts).map(([k, v]) => `| ${k} | ${v} |`).join("\n")}

## Next-action counts

| Action | Count |
|---|---|
${Object.entries(nextActionCounts).map(([k, v]) => `| ${k} | ${v} |`).join("\n")}

## Candidate knowledge-boundary status (real pipeline result, corrected adjudications/certifications)

| Status | Count |
|---|---|
${Object.entries(summary.candidateKnowledgeBoundaryStatusCounts).map(([k, v]) => `| ${k} | ${v} |`).join("\n")}

## By AC

${Object.entries(byAC)
  .map(([ac, g]) => `### ${ac} (${g.total} propositions)\n\nClassification: ${Object.entries(g.classification).map(([k, v]) => `${k}=${v}`).join(", ")}\n\nTechnical state: ${Object.entries(g.technicalState).map(([k, v]) => `${k}=${v}`).join(", ")}\n\nNext action: ${Object.entries(g.nextAction).map(([k, v]) => `${k}=${v}`).join(", ")}`)
  .join("\n\n")}

## Full ledger

See \`UNIT202-PA-PROPOSITION-LEDGER.json\` for the complete machine-readable ledger.

| ID | AC | Proposition | Classification | Tech. state | Next action |
|---|---|---|---|---|---|
${atomicLedger.map((r) => `| ${r.reconciliationId} | ${r.ac} | ${mdEscape(r.proposition.slice(0, 80))} | ${r.paClassification} | ${r.technicalEvidenceState} | ${r.nextAction} |`).join("\n")}
`;
writeFileSync(path.join(outDir, "UNIT202-PA-PROPOSITION-LEDGER.md"), ledgerMd, "utf-8");

const inventoryMd = `# Unit 202 Existing Evidence Inventory (CC-22A)

Source: \`scripts/content/data/unit202-technical-source-verification.ts\` -- the Project-Architect-approved technical source dossier, retrieved 2026-08-30. This is the canonical existing-evidence universe CC-22 failed to inspect (task section 16) -- NOT the frozen CC-21 blind-experiment input.

- Approved sources: ${existingEvidenceInventory.approvedSourcesTotal} (${Object.entries(existingEvidenceInventory.approvedSourcesByStatus).map(([k, v]) => `${k}=${v}`).join(", ")})
- Proposition coverage records: ${existingEvidenceInventory.propositionCoverageTotal} (${Object.entries(existingEvidenceInventory.propositionCoverageByState).map(([k, v]) => `${k}=${v}`).join(", ")})

No new external source was gathered or browsed by this package -- this inventory is a read of already-collected data.
`;
writeFileSync(path.join(outDir, "UNIT202-EXISTING-EVIDENCE-INVENTORY.md"), inventoryMd, "utf-8");

const actionMd = `# Unit 202 Evidence Action Manifest (CC-22A)

Distinguishes source AVAILABILITY from claim NORMALIZATION (task section 17/19) -- a missing candidate or fact requirement does not automatically mean web research is required.

| Metric | Count |
|---|---|
| No new source required (NONE / author from existing authority) | ${actionManifest.counts.noNewSourceRequired} |
| Authoring/normalization only from evidence already held | ${actionManifest.counts.authoringOrNormalizationOnly} |
| Review of an existing source locator | ${actionManifest.counts.reviewExistingSourceLocator} |
| Genuinely new TECHNICAL external evidence required | ${actionManifest.counts.newTechnicalSourceRequired} |
| Genuinely new PUBLIC QUALIFICATION/ASSESSMENT evidence required | ${actionManifest.counts.newPublicQualificationEvidenceRequired} |
| Still requires Project-Architect semantic decision | ${actionManifest.counts.projectArchitectDecisionRequired} |

## GATHER_NEW_TECHNICAL_SOURCE (${gatherNewTechnical.length})

${gatherNewTechnical.map((r) => `- **${r.reconciliationId}** (${r.ac}) ${mdEscape(r.proposition)}${r.gapReason ? ` -- ${mdEscape(r.gapReason)}` : ""}`).join("\n") || "(none)"}

## GATHER_NEW_PUBLIC_QUALIFICATION_EVIDENCE (${gatherNewQualification.length})

${gatherNewQualification.map((r) => `- **${r.reconciliationId}** (${r.ac}) ${mdEscape(r.proposition)}`).join("\n") || "(none)"}

## REVIEW_EXISTING_SOURCE_LOCATOR (${reviewLocator.length})

${reviewLocator.map((r) => `- **${r.reconciliationId}** (${r.ac}) ${mdEscape(r.proposition)}${r.gapReason ? ` -- ${mdEscape(r.gapReason)}` : ""}`).join("\n") || "(none)"}

## NORMALIZE_CLAIM_FROM_EXISTING_VERIFIED_SOURCE (${normalize.length})

${normalize.map((r) => `- **${r.reconciliationId}** (${r.ac}) ${mdEscape(r.proposition)}`).join("\n") || "(none)"}

## PROJECT_ARCHITECT_DECISION still required (${paDecision.length})

${paDecision.map((r) => `- **${r.reconciliationId}** (${r.ac}) ${mdEscape(r.proposition)} -- candidates: ${r.candidateKeys.join(", ") || "(none)"}`).join("\n") || "(none)"}
`;
writeFileSync(path.join(outDir, "UNIT202-EVIDENCE-ACTION-MANIFEST.md"), actionMd, "utf-8");

console.log("CC-22A reconciliation complete.");
console.log(`  atomic propositions: ${atomicLedger.length}`);
console.log(`  semanticAdjudications applied: ${semanticAdjudications.length}`);
console.log(`  knowledgeBoundaryCertifications applied: ${knowledgeBoundaryCertifications.length}`);
console.log(`  unadjudicated REVIEW_PROPOSED remaining: ${unadjudicatedReviewProposed.length}`);
console.log(`  verdict: PROJECT_ARCHITECT_PENDING`);
console.log(`  outputs written to: ${outDir}`);
