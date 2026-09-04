/**
 * CC-22B/CC-22C: freezes the FINAL Project-Architect Unit-202 knowledge
 * target (pa-target.ts, independent of any historical evidence file's
 * row count -- corrects CC-22A's remaining defect, task section 3), maps
 * historical Unit-202 evidence onto it as a BENCHMARK ONLY (never as the
 * source of PA requirements), and emits the blind acquisition target
 * manifest + sealed historical answer key + allowlist + denylist +
 * freeze file the next package's blind acquisition replay will consume.
 *
 * CC-22C hardens the historical benchmark: it is now resolved
 * EXCLUSIVELY from historical-benchmark-bindings.ts's explicit,
 * auditable (clusterKey, requirementKind, requirementText) record
 * bindings -- CC-22B's fuzzy/token matcher and MANUAL_HISTORICAL_
 * OVERRIDES mechanism are both gone (task section 2/4). CC-22C also
 * adds the positive allowlist (task section 10/11) -- the future blind
 * acquisition runner's authoritative local-input contract, with the
 * denylist retained only as defence in depth (task section 12).
 *
 * This script performs NO source discovery, browses nothing, and writes
 * no new technical-truth claim. It reads the frozen CC-21 QP input, the
 * historical Source-Acquisition-Manifest, and the historical Technical
 * Source Verification manifest READ-ONLY. It modifies no generic
 * pipeline file. It must reproduce reports/backtests/unit202-evidence-
 * acquisition-benchmark/UNIT202-BLIND-ACQUISITION-TARGETS.json
 * byte-for-byte (task section 15) -- its construction depends only on
 * pa-target.ts, never on the historical benchmark resolution below.
 */
import { createHash } from "node:crypto";
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
import type { LocalAccessGuardConfig } from "@alp/technical-evidence-engine";

import { CERTIFICATION_DECISIONS } from "./certification-decisions.ts";
import { CLAIM_DECISIONS } from "./claim-decisions.ts";
import { EXACT_CLAIM_BINDINGS } from "./exact-claim-bindings.ts";
import { HISTORICAL_BENCHMARK_BINDINGS } from "./historical-benchmark-bindings.ts";
import { historicalBenchmarkFor, validateHistoricalBenchmarkBindings, type HistoricalResolution, type HistoricalState } from "./historical-resolution.ts";
import { PA_TARGET } from "./pa-target.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..");
const frozenInputPath = path.join(repoRoot, "reports", "backtests", "unit202-post-hardening", "CC-21-FULL-PUBLIC-INPUT.json");
const reconciliationOutDir = path.join(repoRoot, "reports", "backtests", "unit202-reconciliation");
const benchmarkOutDir = path.join(repoRoot, "reports", "backtests", "unit202-evidence-acquisition-benchmark");

function canonicalJson(value: unknown): string {
  return JSON.stringify(value, null, 2) + "\n";
}
function writeJson(absPath: string, value: unknown): string {
  const text = canonicalJson(value);
  writeFileSync(absPath, text, "utf-8");
  return createHash("sha256").update(text).digest("hex");
}
function sha256OfText(text: string): string {
  return createHash("sha256").update(text).digest("hex");
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
// 1. Load frozen QP input (read-only) and historical evidence (read-only,
//    benchmark cross-reference only).
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
const curriculumEvidenceIdsByCandidateKey = new Map<string, string[]>();
for (const c of allCurriculum) {
  const key = `${c.subject}::${c.commandVerbPerformanceType}`;
  const list = curriculumEvidenceIdsByCandidateKey.get(key) ?? [];
  list.push(c.evidenceId);
  curriculumEvidenceIdsByCandidateKey.set(key, list);
}
const factReqsByTarget = new Map<string, CandidateFactRequirement[]>();
for (const f of allFactRequirements) {
  const list = factReqsByTarget.get(f.targetCandidateKey) ?? [];
  list.push(f);
  factReqsByTarget.set(f.targetCandidateKey, list);
}
const claimsByKey = new Map(allFactualClaims.map((c) => [c.claimKey, c]));

// ---------------------------------------------------------------------
// 2. Validate EXACT_CLAIM_BINDINGS + PA_TARGET internal consistency.
// ---------------------------------------------------------------------
const paByText = new Map(PA_TARGET.map((p) => [p.proposition, p]));
const paIds = new Set(PA_TARGET.map((p) => p.id));
if (paIds.size !== PA_TARGET.length) throw new Error("CC-22B validation failure: duplicate PA_TARGET id");

for (const b of EXACT_CLAIM_BINDINGS) {
  if (!paByText.has(b.propositionText)) throw new Error(`CC-22B validation failure: EXACT_CLAIM_BINDINGS references unknown proposition text "${b.propositionText}"`);
  const reqs = factReqsByTarget.get(b.targetCandidateKey) ?? [];
  const match = reqs.find((r) => r.claimKey === b.claimKey);
  if (!match) throw new Error(`CC-22B validation failure: EXACT_CLAIM_BINDINGS names (${b.targetCandidateKey}, ${b.claimKey}) with no matching real CandidateFactRequirement`);
  if (!claimsByKey.has(b.claimKey)) throw new Error(`CC-22B validation failure: EXACT_CLAIM_BINDINGS names claimKey "${b.claimKey}" with no matching real SourceFactualClaim`);
}

// ---------------------------------------------------------------------
// 3. Construct SemanticAdjudication[] / KnowledgeBoundaryCertification[]
//    exclusively from claim-decisions.ts / certification-decisions.ts --
//    no default (same mechanical proof as CC-22A, now including AC5.5).
// ---------------------------------------------------------------------
const decisionByIdentity = new Map(CLAIM_DECISIONS.map((d) => [`${d.targetCandidateKey}::${d.claimKey}`, d]));
const allReviewProposed = allFactRequirements.filter((f) => f.derivationStatus === "REVIEW_PROPOSED");
const reviewProposedIdentities = new Set(allReviewProposed.map((f) => `${f.targetCandidateKey}::${f.claimKey}`));
const badDecisions = CLAIM_DECISIONS.filter((d) => !reviewProposedIdentities.has(`${d.targetCandidateKey}::${d.claimKey}`));
if (badDecisions.length > 0) throw new Error(`CC-22B validation failure: claim-decisions.ts names pairs with no matching REVIEW_PROPOSED requirement: ${badDecisions.map((d) => `${d.targetCandidateKey}::${d.claimKey}`).join(" | ")}`);

let adjCounter = 0;
const semanticAdjudications: SemanticAdjudication[] = CLAIM_DECISIONS.map((d) => {
  adjCounter += 1;
  const factReq = allReviewProposed.find((f) => f.targetCandidateKey === d.targetCandidateKey && f.claimKey === d.claimKey)!;
  return {
    qualificationId: QUAL,
    targetCandidateKey: d.targetCandidateKey,
    claimKey: d.claimKey,
    decision: d.decision,
    adjudicationBasis: d.decision === "REQUIRED_CORE" || d.decision === "REQUIRED_OPERATIONAL" ? ["SEMANTIC_NECESSITY"] : ["INSUFFICIENT_EVIDENCE"],
    adjudicatorKind: "LLM_EVIDENCE_BOUND",
    decisionRef: `CC-22B-ADJ-${String(adjCounter).padStart(3, "0")}`,
    rationale: d.rationale,
    supportingEvidenceRefs: factReq.sourceEvidenceRefs,
    sourceRef: "CC-22B task prompt: Project-Architect Unit-202 target, section " + d.taskSection,
    sourceLocator: `${d.targetCandidateKey}::${d.claimKey}`,
    normalizationBasis: "SEMANTIC_ADJUDICATION_DECISION",
  };
});
const adjudicatedIdentities = new Set(semanticAdjudications.map((a) => `${a.targetCandidateKey}::${a.claimKey}`));
const unadjudicatedReviewProposed = [...reviewProposedIdentities].filter((idn) => !adjudicatedIdentities.has(idn));

function computeFingerprintFromResult(result: StandardPipelineResult, targetCandidateKey: string): string {
  const candidate = result.candidates.find((c) => c.candidateKey === targetCandidateKey);
  if (!candidate) throw new Error(`CC-22B: no candidate for "${targetCandidateKey}"`);
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

const badCertifications = CERTIFICATION_DECISIONS.filter((c) => !pass1Result.candidates.some((cand) => cand.candidateKey === c.targetCandidateKey));
if (badCertifications.length > 0) throw new Error(`CC-22B validation failure: certification-decisions.ts names unknown candidateKeys: ${badCertifications.map((c) => c.targetCandidateKey).join(" | ")}`);

let certCounter = 0;
const knowledgeBoundaryCertifications: KnowledgeBoundaryCertification[] = CERTIFICATION_DECISIONS.map((d) => {
  certCounter += 1;
  const fingerprint = computeFingerprintFromResult(pass1Result, d.targetCandidateKey);
  const curriculumIds = curriculumEvidenceIdsByCandidateKey.get(d.targetCandidateKey) ?? [];
  if (curriculumIds.length === 0) throw new Error(`CC-22B: no OFFICIAL_CURRICULUM evidenceId for "${d.targetCandidateKey}"`);
  return {
    qualificationId: QUAL,
    targetCandidateKey: d.targetCandidateKey,
    decision: d.decision,
    adjudicatorKind: "LLM_EVIDENCE_BOUND",
    certificationRef: `CC-22B-CERT-${String(certCounter).padStart(3, "0")}`,
    boundaryFingerprint: fingerprint,
    rationale: d.rationale,
    supportingEvidenceRefs: curriculumIds.map((evidenceId) => ({ role: "OFFICIAL_CURRICULUM" as const, evidenceId })),
    sourceRef: "CC-22B task prompt: Project-Architect Unit-202 target",
    sourceLocator: `certification-decisions.ts["${d.targetCandidateKey}"]`,
    normalizationBasis: "KNOWLEDGE_BOUNDARY_CERTIFICATION_DECISION",
  };
});
const finalResult = buildStandardPipeline({ ...frozenInput, semanticAdjudications, knowledgeBoundaryCertifications });

// ---------------------------------------------------------------------
// 4. Historical benchmark cross-reference (CC-22C: BENCHMARK ONLY --
//    never feeds back into PA classification, which is already fixed by
//    pa-target.ts). Resolves EXCLUSIVELY from historical-benchmark-
//    bindings.ts's explicit (clusterKey, requirementKind, requirementText)
//    record identities -- no fuzzy/token matching, no manual state
//    overrides (task section 2/4). Every binding's every record must
//    resolve to EXACTLY one real propositionCoverage record, or the build
//    fails loudly. CC-23 section 19 extracted this resolution logic (plus
//    its atomic-subclaim-override correction) into historical-
//    resolution.ts, shared with the evidence-requirement-level benchmark
//    in scripts/backtests/unit202-evidence-acquisition-preflight/ -- see
//    that module for the full rule.
// ---------------------------------------------------------------------
validateHistoricalBenchmarkBindings();

// ---------------------------------------------------------------------
// 5. Per-PA-proposition candidate mapping + technical-evidence state
//    (section 7: EXACT_CURRENT_FACTUAL_CLAIM ONLY via explicit binding).
// ---------------------------------------------------------------------
type TechnicalEvidenceState = "EXACT_CURRENT_FACTUAL_CLAIM" | "HISTORICAL_SOURCE_NEEDS_CLAIM_NORMALIZATION" | "REVIEW_HISTORICAL_SOURCE_LOCATOR" | "NEW_TECHNICAL_SOURCE_REQUIRED" | "NOT_APPLICABLE";
type QualificationEvidenceState = "EXPLICIT_PUBLIC_CURRICULUM" | "PUBLIC_ASSESSMENT_SUPPORTED" | "CALIBRATED_ONLY_PUBLIC_SUPPORT_NEEDED" | "FOUNDATIONAL_NECESSITY" | "CONTEXT_ONLY" | "OUT_OF_SCOPE";
type AcquisitionReplayRequirement = "REQUIRED" | "OPTIONAL_CONTEXT" | "NOT_APPLICABLE";
type NextAction = "NONE" | "AUTHOR_FACT_REQUIREMENT_FROM_EXISTING_AUTHORITY" | "NORMALIZE_CLAIM_FROM_HISTORICAL_VERIFIED_SOURCE" | "REVIEW_HISTORICAL_SOURCE_LOCATOR" | "BLIND_ACQUISITION_REQUIRED" | "PUBLIC_QUALIFICATION_EVIDENCE_RESEARCH_REQUIRED" | "PROJECT_ARCHITECT_DECISION";

const exactBindingByText = new Map(EXACT_CLAIM_BINDINGS.map((b) => [b.propositionText, b]));

interface LedgerRow {
  id: string;
  ac: string;
  proposition: string;
  paClassification: string;
  kind: string;
  isRepresentativeExemplar: boolean;
  qualificationEvidenceState: QualificationEvidenceState;
  technicalEvidenceState: TechnicalEvidenceState;
  historicalBenchmarkState: HistoricalState;
  historicalBindingBasis: string | null;
  historicalResolvedRecords: HistoricalResolution["resolvedRecords"];
  historicalReasonIfUnmapped: string | null;
  historicalOverrideNote: string | null;
  acquisitionReplayRequirement: AcquisitionReplayRequirement;
  gapTypes: string[];
  nextActions: NextAction[];
  candidateKeys: string[];
  boundClaimKey: string | null;
  notes: string;
}

const ledger: LedgerRow[] = PA_TARGET.map((p) => {
  const subjectCandidates = curriculumBySubject.get(p.proposition) ?? []; // rarely matches directly; candidateKeys mainly come from binding
  const binding = exactBindingByText.get(p.proposition);
  const historical = historicalBenchmarkFor(p);

  let qes: QualificationEvidenceState;
  if (p.class === "OUT_OF_SCOPE") qes = "OUT_OF_SCOPE";
  else if (p.class === "CONTEXTUAL_TEACHING_SUPPORT") qes = "CONTEXT_ONLY";
  else if (p.class === "FOUNDATIONAL_PREREQUISITE") qes = "FOUNDATIONAL_NECESSITY";
  else if (p.isRepresentativeExemplar) qes = "CALIBRATED_ONLY_PUBLIC_SUPPORT_NEEDED";
  else qes = "EXPLICIT_PUBLIC_CURRICULUM";

  let tes: TechnicalEvidenceState;
  let candidateKeys: string[] = subjectCandidates.map((c) => `${c.subject}::${c.commandVerbPerformanceType}`);
  if (p.class === "OUT_OF_SCOPE") {
    tes = "NOT_APPLICABLE";
  } else if (binding) {
    candidateKeys = [binding.targetCandidateKey];
    const rejected = decisionByIdentity.get(`${binding.targetCandidateKey}::${binding.claimKey}`)?.decision;
    const isRejected = rejected === "REJECT_OVERDEPTH" || rejected === "REJECT_NOT_NECESSARY";
    tes = isRejected ? (historical.state === "HISTORICALLY_VERIFIED" ? "HISTORICAL_SOURCE_NEEDS_CLAIM_NORMALIZATION" : historical.state === "HISTORICALLY_CONDITIONAL" ? "REVIEW_HISTORICAL_SOURCE_LOCATOR" : "NEW_TECHNICAL_SOURCE_REQUIRED") : "EXACT_CURRENT_FACTUAL_CLAIM";
  } else {
    tes = historical.state === "HISTORICALLY_VERIFIED" ? "HISTORICAL_SOURCE_NEEDS_CLAIM_NORMALIZATION" : historical.state === "HISTORICALLY_CONDITIONAL" ? "REVIEW_HISTORICAL_SOURCE_LOCATOR" : historical.state === "HISTORICALLY_SOURCE_GAP" || historical.state === "NO_HISTORICAL_BENCHMARK" ? "NEW_TECHNICAL_SOURCE_REQUIRED" : "NOT_APPLICABLE";
  }

  let acquisitionReplayRequirement: AcquisitionReplayRequirement;
  if (p.class === "OUT_OF_SCOPE") acquisitionReplayRequirement = "NOT_APPLICABLE";
  else if (p.class === "CONTEXTUAL_TEACHING_SUPPORT") acquisitionReplayRequirement = "OPTIONAL_CONTEXT";
  else acquisitionReplayRequirement = "REQUIRED"; // REQUIRED_QUALIFICATION_KNOWLEDGE, FOUNDATIONAL_PREREQUISITE, and exemplars all REQUIRED per task section 9

  const gapTypes: string[] = [];
  if (p.class !== "OUT_OF_SCOPE" && p.class !== "CONTEXTUAL_TEACHING_SUPPORT") {
    if (candidateKeys.length === 0) gapTypes.push("MISSING_NORMALIZED_CANDIDATE");
    if (tes !== "EXACT_CURRENT_FACTUAL_CLAIM" && tes !== "NOT_APPLICABLE") gapTypes.push("MISSING_TECHNICAL_TRUTH");
    if (qes === "CALIBRATED_ONLY_PUBLIC_SUPPORT_NEEDED") gapTypes.push("CALIBRATED_EXEMPLAR_NEEDS_PUBLIC_SUPPORT");
  }
  if (gapTypes.length === 0 && p.class !== "OUT_OF_SCOPE" && p.class !== "CONTEXTUAL_TEACHING_SUPPORT") gapTypes.push("NO_GAP");
  if (p.class === "OUT_OF_SCOPE" || p.class === "CONTEXTUAL_TEACHING_SUPPORT") gapTypes.push("NOT_A_MASTERY_ACQUISITION_TARGET");

  const nextActions: NextAction[] = [];
  if (p.class === "OUT_OF_SCOPE" || p.class === "CONTEXTUAL_TEACHING_SUPPORT") {
    nextActions.push("NONE");
  } else {
    if (gapTypes.includes("MISSING_NORMALIZED_CANDIDATE") && tes !== "EXACT_CURRENT_FACTUAL_CLAIM") {
      // Candidate itself absent from the QP model -- still a real acquisition target; no separate
      // production action exists yet beyond what acquisition/authoring will eventually enable.
    }
    if (tes === "EXACT_CURRENT_FACTUAL_CLAIM" && gapTypes.includes("MISSING_NORMALIZED_CANDIDATE")) nextActions.push("AUTHOR_FACT_REQUIREMENT_FROM_EXISTING_AUTHORITY");
    if (tes === "HISTORICAL_SOURCE_NEEDS_CLAIM_NORMALIZATION") nextActions.push("NORMALIZE_CLAIM_FROM_HISTORICAL_VERIFIED_SOURCE");
    if (tes === "REVIEW_HISTORICAL_SOURCE_LOCATOR") nextActions.push("REVIEW_HISTORICAL_SOURCE_LOCATOR");
    if (qes === "CALIBRATED_ONLY_PUBLIC_SUPPORT_NEEDED") nextActions.push("PUBLIC_QUALIFICATION_EVIDENCE_RESEARCH_REQUIRED");
    // Every REQUIRED/FOUNDATIONAL/exemplar proposition is a blind-acquisition-replay target
    // regardless of historical/production state (task section 9/17) -- never suppressed by
    // already having a historical or even a current exact claim.
    nextActions.push("BLIND_ACQUISITION_REQUIRED");
    if (nextActions.length === 0) nextActions.push("NONE");
  }

  return {
    id: p.id,
    ac: p.ac,
    proposition: p.proposition,
    paClassification: p.class,
    kind: p.kind,
    isRepresentativeExemplar: p.isRepresentativeExemplar ?? false,
    qualificationEvidenceState: qes,
    technicalEvidenceState: tes,
    historicalBenchmarkState: historical.state,
    historicalBindingBasis: historical.bindingBasis,
    historicalResolvedRecords: historical.resolvedRecords,
    historicalReasonIfUnmapped: historical.reasonIfUnmapped,
    historicalOverrideNote: historical.overrideNote,
    acquisitionReplayRequirement,
    gapTypes,
    nextActions,
    candidateKeys,
    boundClaimKey: binding?.claimKey ?? null,
    notes: p.notes ?? "",
  };
});

// ---------------------------------------------------------------------
// 6. Emit corrected production reconciliation outputs.
// ---------------------------------------------------------------------
mkdirSync(reconciliationOutDir, { recursive: true });
mkdirSync(benchmarkOutDir, { recursive: true });

const classificationCounts = countBy(ledger.map((r) => r.paClassification));
const qesCounts = countBy(ledger.map((r) => r.qualificationEvidenceState));
const tesCounts = countBy(ledger.map((r) => r.technicalEvidenceState));
const historicalCounts = countBy(ledger.map((r) => r.historicalBenchmarkState));
const nextActionCounts: Record<string, number> = {};
for (const r of ledger) for (const a of r.nextActions) nextActionCounts[a] = (nextActionCounts[a] ?? 0) + 1;
const acquisitionReqCounts = countBy(ledger.map((r) => r.acquisitionReplayRequirement));

const candidateMapping = finalResult.candidates
  .filter((c) => /^AC[1-6]\./.test(allCurriculum.find((cur) => cur.evidenceId === c.evidenceRefs.find((r) => r.role === "OFFICIAL_CURRICULUM")?.evidenceId)?.curriculumUnitId ?? ""))
  .map((c) => {
    const factReqs = factReqsByTarget.get(c.candidateKey) ?? [];
    const claimKeys = [...new Set(factReqs.map((f) => f.claimKey))];
    const cert = knowledgeBoundaryCertifications.find((k) => k.targetCandidateKey === c.candidateKey);
    return {
      candidateKey: c.candidateKey,
      subject: c.subject,
      performanceType: c.performanceType,
      paPropositionIds: ledger.filter((r) => r.candidateKeys.includes(c.candidateKey)).map((r) => r.id),
      factRequirementClaimKeys: claimKeys,
      requiredFactKeys: c.requiredFactKeys ?? [],
      technicalCoverageStatus: c.technicalCoverageStatus ?? null,
      knowledgeBoundaryStatus: c.knowledgeBoundaryStatus ?? null,
      certification: cert ? { decision: cert.decision, certificationRef: cert.certificationRef } : null,
    };
  });

const summary = {
  supersedes: ["d828e78 (CC-22)", "48b1a98 (CC-22A)"],
  totalPAPropositions: ledger.length,
  classificationCounts,
  qualificationEvidenceStateCounts: qesCounts,
  technicalEvidenceStateCounts: tesCounts,
  historicalBenchmarkStateCounts: historicalCounts,
  acquisitionReplayRequirementCounts: acquisitionReqCounts,
  nextActionCounts,
  candidateKnowledgeBoundaryStatusCounts: countBy(finalResult.candidates.map((c) => c.knowledgeBoundaryStatus)),
  projectArchitectDecisionRemaining: nextActionCounts["PROJECT_ARCHITECT_DECISION"] ?? 0,
};

writeJson(path.join(reconciliationOutDir, "UNIT202-PA-PROPOSITION-LEDGER.json"), { qualificationId: QUAL, summary, ledger });
writeJson(path.join(reconciliationOutDir, "UNIT202-CANDIDATE-MAPPING.json"), { qualificationId: QUAL, candidates: candidateMapping });

const statusOutput = {
  qualificationId: QUAL,
  generatedFrom: "reports/backtests/unit202-post-hardening/CC-21-FULL-PUBLIC-INPUT.json (frozen, read-only)",
  pipelineVersion: "packages/qualification-pipeline @ HEAD 9663120 (CC-21B, unmodified)",
  semanticAdjudicationsApplied: semanticAdjudications.length,
  knowledgeBoundaryCertificationsApplied: knowledgeBoundaryCertifications.length,
  unadjudicatedReviewProposedCount: unadjudicatedReviewProposed.length,
  candidates: finalResult.candidates.map((c) => ({ candidateKey: c.candidateKey, subject: c.subject, performanceType: c.performanceType, requiredFactKeys: c.requiredFactKeys ?? [], technicalCoverageStatus: c.technicalCoverageStatus ?? null, knowledgeBoundaryStatus: c.knowledgeBoundaryStatus ?? null })),
  gapsByType: countBy(finalResult.gaps.map((g) => g.gapType)),
  totalGaps: finalResult.gaps.length,
};
writeJson(path.join(reconciliationOutDir, "UNIT202-KNOWLEDGE-BOUNDARY-STATUS.json"), statusOutput);

const supersededNote = { status: "SUPERSEDED", supersededBy: "UNIT202-PA-PROPOSITION-LEDGER.json (CC-22B)", commits: ["d828e78 (CC-22)", "48b1a98 (CC-22A)"], reason: "CC-22A still derived PA-proposition count from the historical Source-Acquisition-Manifest's row count and used an unsafe EXACT_CURRENT_FACTUAL_CLAIM shortcut. CC-22B fixes both -- see this package's task prompt sections 3 and 7." };
writeJson(path.join(reconciliationOutDir, "UNIT202-EVIDENCE-ACTION-MANIFEST.json"), supersededNote);
writeFileSync(path.join(reconciliationOutDir, "UNIT202-EVIDENCE-ACTION-MANIFEST.md"), "# SUPERSEDED -- see UNIT202-PA-PROPOSITION-LEDGER.md (CC-22B)\n", "utf-8");

function mdEscape(s: string): string {
  return s.replace(/\|/g, "\\|");
}

const ledgerMd = `# Unit 202 Project-Architect Proposition Ledger (CC-22B propositions; CC-22C hardened historical benchmark)

Supersedes \`d828e78\` (CC-22) and \`48b1a98\` (CC-22A). The PA proposition ledger is now authored directly from the LOCKED Project-Architect Unit-202 target (task prompt section 5) -- **${ledger.length} atomic propositions**, independent of the historical Source-Acquisition-Manifest's own row count (task section 3's correction). The historical manifest is consulted only as a benchmark cross-reference below.

## Classification counts

${Object.entries(classificationCounts).map(([k, v]) => `- ${k}: ${v}`).join("\n")}

## Qualification-evidence state

${Object.entries(qesCounts).map(([k, v]) => `- ${k}: ${v}`).join("\n")}

## Technical-evidence state (current QP-model production state)

${Object.entries(tesCounts).map(([k, v]) => `- ${k}: ${v}`).join("\n")}

## Historical benchmark state (benchmark only, never PA-defining)

${Object.entries(historicalCounts).map(([k, v]) => `- ${k}: ${v}`).join("\n")}

## Acquisition replay requirement

${Object.entries(acquisitionReqCounts).map(([k, v]) => `- ${k}: ${v}`).join("\n")}

## Next actions (production; multiple may coexist per row)

${Object.entries(nextActionCounts).map(([k, v]) => `- ${k}: ${v}`).join("\n")}

**PROJECT_ARCHITECT_DECISION remaining: ${summary.projectArchitectDecisionRemaining}** (expected 0 -- task section 8).

## Candidate knowledge-boundary status (current production, real pipeline)

${Object.entries(summary.candidateKnowledgeBoundaryStatusCounts).map(([k, v]) => `- ${k}: ${v}`).join("\n")}

## Full ledger

See \`UNIT202-PA-PROPOSITION-LEDGER.json\`.

| ID | AC | Proposition | Class | Historical | Acq. replay |
|---|---|---|---|---|---|
${ledger.map((r) => `| ${r.id} | ${r.ac} | ${mdEscape(r.proposition.slice(0, 70))} | ${r.paClassification} | ${r.historicalBenchmarkState} | ${r.acquisitionReplayRequirement} |`).join("\n")}
`;
writeFileSync(path.join(reconciliationOutDir, "UNIT202-PA-PROPOSITION-LEDGER.md"), ledgerMd, "utf-8");

// ---------------------------------------------------------------------
// 7. Blind acquisition target manifest -- NO historical-source leakage.
// ---------------------------------------------------------------------
const blindTargets = ledger
  .filter((r) => r.acquisitionReplayRequirement !== "NOT_APPLICABLE")
  .map((r, i) => ({
    acquisitionTargetId: `ACQ-${String(i + 1).padStart(3, "0")}`,
    ac: r.ac,
    proposition: r.proposition,
    knowledgeClassification: r.paClassification,
    acquisitionReplayRequirement: r.acquisitionReplayRequirement,
    isRepresentativeExemplar: r.isRepresentativeExemplar,
    propositionKind: r.kind,
    technicalDomainCategory: r.ac,
    requiresMultipleIndependentClaims: r.kind === "RELATIONSHIP_OR_MECHANISM" && /and|,/.test(r.proposition),
    genericRequiredSourceCharacteristics: ["AUTHORITATIVE_ENGINEERING_OR_SCIENCE_REFERENCE"],
    acceptanceCriteria: "At least one independently retrievable, publicly accessible authoritative source whose exact locator/passage states this proposition (or an equivalent, algebraically/semantically identical form) verbatim or near-verbatim; the passage must be actually read and cited, never inferred from a source title alone.",
  }));
writeJson(path.join(benchmarkOutDir, "UNIT202-BLIND-ACQUISITION-TARGETS.json"), { qualificationId: QUAL, purpose: "The ONLY Unit-202 target file the future blind acquisition process should need. Contains no historical source identity, URL, locator, excerpt, or verification outcome.", targets: blindTargets });

const blindTargetsMd = `# Unit 202 Blind Acquisition Targets (CC-22B)

${blindTargets.length} acquisition targets. This is the ONLY Unit-202 file the future blind acquisition process should need -- it contains no historical source identity, URL, title, locator, excerpt, claim ID, or verification outcome.

| ID | AC | Proposition | Replay |
|---|---|---|---|
${blindTargets.map((t) => `| ${t.acquisitionTargetId} | ${t.ac} | ${mdEscape(t.proposition.slice(0, 70))} | ${t.acquisitionReplayRequirement} |`).join("\n")}
`;
writeFileSync(path.join(benchmarkOutDir, "UNIT202-BLIND-ACQUISITION-TARGETS.md"), blindTargetsMd, "utf-8");

// ---------------------------------------------------------------------
// 8. Sealed historical benchmark (answer key -- POST_RUN_COMPARISON_ONLY).
//    CC-22C section 7: full auditable provenance per target -- every
//    bound record's own identity, its OWN real coverageState (never
//    re-typed), its supportingSourceLocatorKeys/gapReason, the mapping
//    basis, and an explicit reason for any NO_HISTORICAL_BENCHMARK.
// ---------------------------------------------------------------------
const sealedBenchmark = {
  qualificationId: QUAL,
  BENCHMARK_ACCESS_POLICY: "POST_RUN_COMPARISON_ONLY",
  policyStatement: "The next blind acquisition runner MUST mechanically exclude this file, and every path named in UNIT202-BLIND-ACQUISITION-DENYLIST.json, from its accessible evidence inputs. This file exists only for comparison AFTER a blind acquisition run has completed. It is never itself the authorisation contract -- see UNIT202-BLIND-ACQUISITION-ALLOWLIST.json (task section 12).",
  entries: ledger
    .filter((r) => r.acquisitionReplayRequirement !== "NOT_APPLICABLE")
    .map((r) => ({
      acquisitionTargetId: `ACQ-${String(blindTargets.findIndex((t) => t.proposition === r.proposition && t.ac === r.ac) + 1).padStart(3, "0")}`,
      proposition: r.proposition,
      historicalCoverageState: r.historicalBenchmarkState,
      mappingBasis: r.historicalBindingBasis,
      boundHistoricalRecords: r.historicalResolvedRecords,
      reasonIfUnmapped: r.historicalReasonIfUnmapped,
      overrideNote: r.historicalOverrideNote,
      currentQPBoundClaimKey: r.boundClaimKey,
    })),
};
writeJson(path.join(benchmarkOutDir, "UNIT202-HISTORICAL-ACQUISITION-BENCHMARK.json"), sealedBenchmark);

// ---------------------------------------------------------------------
// 9. Positive allowlist (task section 10/11) -- the AUTHORITATIVE local-
//    input contract for the future blind acquisition run. Default: DENY
//    ALL local Unit-202 material except what is explicitly listed here.
// ---------------------------------------------------------------------
const blindTargetsHashForAllowlist = sha256OfText(readFileSync(path.join(benchmarkOutDir, "UNIT202-BLIND-ACQUISITION-TARGETS.json"), "utf-8"));

/**
 * CC-23 section 21: the CONCRETE, machine-evaluable local-input contract --
 * a real `LocalAccessGuardConfig` (from @alp/technical-evidence-engine),
 * not prose placeholder paths. `scripts/backtests/unit202-evidence-
 * acquisition-preflight/unit202-guard-config.test.ts` actually instantiates
 * a `LocalAccessGuard` from this exact object and mechanically proves it
 * denies a non-allowlisted path and enforces the pinned hash -- this is
 * not merely documented, it is executable.
 */
const guardConfig: LocalAccessGuardConfig = {
  experimentId: "unit202-blind-acquisition",
  allowedInputs: [
    {
      rule: "FROZEN_BLIND_TARGET_MANIFEST",
      matchKind: "EXACT_PATH",
      pathOrGlob: "reports/backtests/unit202-evidence-acquisition-benchmark/UNIT202-BLIND-ACQUISITION-TARGETS.json",
      requiredHash: blindTargetsHashForAllowlist,
      note: "The exact frozen file, identified by hash -- a file at this path with a different hash is NOT authorised by this rule.",
    },
    {
      rule: "GENERIC_TECHNICAL_EVIDENCE_ENGINE_CODE",
      matchKind: "GLOB",
      pathOrGlob: "packages/technical-evidence-engine/**",
      note: "Generic planner/acquisition-contract/access-guard code and its default source-authority policy -- never Unit-202-specific data.",
    },
    {
      rule: "EXPERIMENT_RUNTIME_OUTPUT",
      matchKind: "GLOB",
      pathOrGlob: "reports/backtests/unit202-blind-acquisition-run/**",
      note: "Write target reserved for the future acquisition run's own new output -- never pre-existing Unit-202 material. This directory does not exist yet; it is reserved by this rule for when the run is authorised.",
    },
  ],
};

const allowlist = {
  qualificationId: QUAL,
  policyStatement: "AUTHORITATIVE local-input contract for the future blind Unit-202 acquisition run. Default principle: DENY ALL LOCAL UNIT-202 MATERIAL EXCEPT EXPLICITLY ALLOWED INPUTS (task section 10). A path is readable only if it matches an entry in guardConfig.allowedInputs below -- the denylist (UNIT202-BLIND-ACQUISITION-DENYLIST.json) is defence in depth only and never itself grants access. guardConfig is a literal @alp/technical-evidence-engine LocalAccessGuardConfig -- loadable directly into a real LocalAccessGuard, not prose.",
  guardConfig,
  defaultForUnlistedPaths: "DENY",
  unit202DefaultDenyExamples: [
    "any path containing 'unit202'",
    "Unit-202 reconciliation files",
    "historical source acquisition/verification data",
    "source dossiers",
    "knowledge obligations",
    "assertions",
    "lessons",
    "calibration material",
    "clean-room results",
    "post-hardening results",
    "the historical acquisition benchmark",
    "old factual claims",
    "visual/storyboard material that could reveal technical content",
  ],
  exceptionNote: "The ONLY exception to the broad Unit-202 default-deny is the exact frozen blind acquisition target manifest (FROZEN_BLIND_TARGET_MANIFEST above) -- the allowlist overrides the deny for that one approved file and no other.",
  webResearchNote: "This allowlist governs LOCAL file access only (task section 14). It does not restrict legitimate public web research the acquisition runner performs -- a newly-discovered public webpage is never rejected merely because the same URL happened to be found historically; the test is independent discovery, not discovery of a different URL. The runner must simply receive no historical URL/source hint before searching.",
  /**
   * Task section 13: the mechanical access contract the next package's
   * acquisition runner must implement -- DEFINED here, NOT executed by
   * this package (no runner exists yet; this is a contract, not code).
   */
  accessAuditContract: {
    status: "DEFINED_NOT_EXECUTED",
    perLocalReadRecord: {
      requiredFields: ["canonicalPath", "contentHash", "reason", "allowlistRuleId"],
      note: "Every local file read the runner performs must be logged with these four fields -- the exact path (canonical, resolved), a content hash of what was actually read, why it was read, and which allowlist rule (by `rule` id above) authorised it.",
    },
    nonAllowlistedReadPolicy: {
      onAttempt: "IMMEDIATE_HARD_FAILURE",
      experimentValidity: "INVALID",
      continuation: "NONE",
      note: "Any attempted local read of a path not matched by an allowedInputs rule above must immediately hard-fail the run -- the experiment is invalid and must not continue, partially or otherwise.",
    },
    blindTargetIntegrityCheck: {
      when: ["before acquisition run starts", "after acquisition run completes"],
      requirement: "Hash the blind target manifest at both points and compare -- any difference invalidates the run (the runner must never have modified its own input).",
    },
    webAccessPolicy: "Not governed by this local-file access contract -- see webResearchNote above.",
  },
};
writeJson(path.join(benchmarkOutDir, "UNIT202-BLIND-ACQUISITION-ALLOWLIST.json"), allowlist);

// ---------------------------------------------------------------------
// 10. Denylist -- DEFENCE IN DEPTH ONLY (task section 12). The positive
//     allowlist above is authoritative; a missed denylist entry must
//     never make a file readable that the allowlist did not already
//     authorise.
// ---------------------------------------------------------------------
const denylist = {
  qualificationId: QUAL,
  DENYLIST_ROLE: "DEFENCE_IN_DEPTH_ONLY",
  policyStatement:
    "This denylist is DEFENCE IN DEPTH ONLY -- it is never the authorisation source. UNIT202-BLIND-ACQUISITION-ALLOWLIST.json is authoritative: a path is readable only if the allowlist explicitly permits it, regardless of whether that path also appears (or fails to appear) here. A missed denylist entry must not make a file readable if the allowlist does not separately authorise it. The future blind Unit-202 acquisition runner must NOT read any path/resource class below while performing source discovery. The next package will inspect this denylist and implement mechanical isolation.",
  deniedPaths: [
    "scripts/content/data/unit202-source-acquisition-manifest.ts",
    "scripts/content/data/unit202-technical-source-verification.ts",
    "scripts/content/data/unit202-knowledge-obligations.ts",
    "scripts/content/data/cc04-unit202-electrical-science.ts",
    "scripts/content/data/unit202-qualification-scope-audit.ts",
    "scripts/content/data/unit202-blind-calibration-baseline.ts",
    "scripts/content/data/unit202-blind-calibration-baseline-5d45953-snapshot.ts",
    "scripts/content/data/cc05a-pedagogy-unit202.ts",
    "reports/backtests/unit202-cleanroom/**",
    "scripts/backtests/unit202-cleanroom/**",
    "reports/backtests/unit202-post-hardening/**",
    "scripts/backtests/unit202-post-hardening/**",
    "reports/backtests/unit202-reconciliation/UNIT202-KNOWLEDGE-BOUNDARY-RECONCILIATION.json",
    "reports/backtests/unit202-reconciliation/UNIT202-KNOWLEDGE-BOUNDARY-RECONCILIATION.md",
    "reports/backtests/unit202-reconciliation/UNIT202-TECHNICAL-EVIDENCE-GAPS.json",
    "reports/backtests/unit202-reconciliation/UNIT202-TECHNICAL-EVIDENCE-GAPS.md",
    "reports/backtests/unit202-reconciliation/UNIT202-EXISTING-EVIDENCE-INVENTORY.json",
    "reports/backtests/unit202-reconciliation/UNIT202-EXISTING-EVIDENCE-INVENTORY.md",
    "reports/backtests/unit202-reconciliation/UNIT202-PA-PROPOSITION-LEDGER.json",
    "reports/backtests/unit202-reconciliation/UNIT202-PA-PROPOSITION-LEDGER.md",
    "reports/backtests/unit202-reconciliation/UNIT202-CANDIDATE-MAPPING.json",
    "reports/backtests/unit202-reconciliation/UNIT202-EVIDENCE-ACTION-MANIFEST.json",
    "reports/backtests/unit202-reconciliation/UNIT202-EVIDENCE-ACTION-MANIFEST.md",
    "reports/backtests/unit202-reconciliation/UNIT202-KNOWLEDGE-BOUNDARY-STATUS.json",
    "reports/backtests/unit202-evidence-acquisition-benchmark/UNIT202-HISTORICAL-ACQUISITION-BENCHMARK.json",
    "reports/backtests/unit202-evidence-acquisition-benchmark/UNIT202-EVIDENCE-ACQUISITION-BENCHMARK-FREEZE.json",
    "reports/backtests/unit202-evidence-acquisition-benchmark/UNIT202-EVIDENCE-ACQUISITION-BENCHMARK-REPORT.md",
    "scripts/backtests/unit202-reconciliation/exact-claim-bindings.ts",
    "scripts/backtests/unit202-reconciliation/historical-benchmark-bindings.ts",
    "scripts/backtests/unit202-reconciliation/claim-decisions.ts",
    "scripts/backtests/unit202-reconciliation/certification-decisions.ts",
    "scripts/backtests/unit202-reconciliation/pa-target.ts",
    "scripts/content/data/unit202-assessment-specification.ts",
  ],
  authoritativeAllowlist: "UNIT202-BLIND-ACQUISITION-ALLOWLIST.json",
};
writeJson(path.join(benchmarkOutDir, "UNIT202-BLIND-ACQUISITION-DENYLIST.json"), denylist);

// ---------------------------------------------------------------------
// 10. Precomputed benchmark denominators (task section 14 -- no scoring).
// ---------------------------------------------------------------------
const replayTargets = ledger.filter((r) => r.acquisitionReplayRequirement === "REQUIRED");
const denominators = {
  acquisitionTargetsTotal: replayTargets.length,
  historicallyVerified: replayTargets.filter((r) => r.historicalBenchmarkState === "HISTORICALLY_VERIFIED").length,
  historicallyConditional: replayTargets.filter((r) => r.historicalBenchmarkState === "HISTORICALLY_CONDITIONAL").length,
  historicallySourceGap: replayTargets.filter((r) => r.historicalBenchmarkState === "HISTORICALLY_SOURCE_GAP").length,
  noHistoricalBenchmark: replayTargets.filter((r) => r.historicalBenchmarkState === "NO_HISTORICAL_BENCHMARK").length,
  representativeExemplarTargets: replayTargets.filter((r) => r.isRepresentativeExemplar).length,
  contextualOptionalTargets: ledger.filter((r) => r.acquisitionReplayRequirement === "OPTIONAL_CONTEXT").length,
  note: "Denominators only -- no acquisition scoring performed (task section 14).",
};

// ---------------------------------------------------------------------
// 11. Freeze file (CC-22C section 17).
// ---------------------------------------------------------------------
const paLedgerJsonPath = path.join(reconciliationOutDir, "UNIT202-PA-PROPOSITION-LEDGER.json");
const blindTargetsJsonPath = path.join(benchmarkOutDir, "UNIT202-BLIND-ACQUISITION-TARGETS.json");
const sealedBenchmarkJsonPath = path.join(benchmarkOutDir, "UNIT202-HISTORICAL-ACQUISITION-BENCHMARK.json");
const allowlistJsonPath = path.join(benchmarkOutDir, "UNIT202-BLIND-ACQUISITION-ALLOWLIST.json");
const denylistJsonPath = path.join(benchmarkOutDir, "UNIT202-BLIND-ACQUISITION-DENYLIST.json");

const sourceManifestPath = path.join(repoRoot, "scripts", "content", "data", "unit202-source-acquisition-manifest.ts");
const sourceVerificationPath = path.join(repoRoot, "scripts", "content", "data", "unit202-technical-source-verification.ts");

const byACCounts: Record<string, number> = {};
for (const t of blindTargets) byACCounts[t.ac] = (byACCounts[t.ac] ?? 0) + 1;

/**
 * CC-22C task section 9: provenance-only record of the CC-22B fuzzy/
 * token-matched counts this package supersedes. Sourced from commit
 * 8fa98b0's own UNIT202-EVIDENCE-ACQUISITION-BENCHMARK-FREEZE.json
 * `denominators` -- never re-derived here (the fuzzy matcher is gone).
 * These numbers were never a target to reproduce; they are recorded so
 * the correction's direction and magnitude remain auditable.
 */
const previousHeuristicCounts = {
  commit: "8fa98b0",
  method: "cluster-scoped token/keyword overlap matcher plus MANUAL_HISTORICAL_OVERRIDES (both removed in CC-22C)",
  historicallyVerified: 101,
  historicallyConditional: 10,
  historicallySourceGap: 6,
  noHistoricalBenchmark: 54,
  note: "SUPERSEDED. Task section 9: 'There is NO expected VERIFIED count... The correct counts are whatever the explicit audited bindings produce.'",
};

const finalExplicitBindingCounts = {
  historicallyVerified: denominators.historicallyVerified,
  historicallyConditional: denominators.historicallyConditional,
  historicallySourceGap: denominators.historicallySourceGap,
  noHistoricalBenchmark: denominators.noHistoricalBenchmark,
  totalExplicitBindings: HISTORICAL_BENCHMARK_BINDINGS.length,
};

const freeze = {
  parentHEAD: "8fa98b0",
  parentHEADSubject: "audit: freeze Unit 202 acquisition benchmark",
  cc22bCommit: "8fa98b0",
  blindTargetManifestHashUnchanged: true,
  blindTargetManifestExpectedHash: "3052aede77b472247fbdf7a9e04d62adb2e98bba3a2896dacd610267e4a754b4",
  paPropositionLedgerHash: sha256OfText(readFileSync(paLedgerJsonPath, "utf-8")),
  blindAcquisitionTargetManifestHash: sha256OfText(readFileSync(blindTargetsJsonPath, "utf-8")),
  historicalBindingsFileHash: sha256OfText(readFileSync(path.join(__dirname, "historical-benchmark-bindings.ts"), "utf-8")),
  historicalBenchmarkHash: sha256OfText(readFileSync(sealedBenchmarkJsonPath, "utf-8")),
  allowlistHash: sha256OfText(readFileSync(allowlistJsonPath, "utf-8")),
  denylistHash: sha256OfText(readFileSync(denylistJsonPath, "utf-8")),
  paPropositionCountsByClass: classificationCounts,
  acquisitionTargetCount: blindTargets.length,
  acquisitionTargetCountsByAC: byACCounts,
  previousHeuristicCounts,
  finalExplicitBindingCounts,
  zeroFuzzyBenchmarkAssignments: true,
  zeroManualStateOverrides: true,
  targetSemanticHashUnchanged: true,
  projectArchitectDecisionsRemaining: summary.projectArchitectDecisionRemaining,
  sourceAcquisitionManifestHash: sha256OfText(readFileSync(sourceManifestPath, "utf-8")),
  technicalSourceVerificationHash: sha256OfText(readFileSync(sourceVerificationPath, "utf-8")),
  statement:
    "The historical Unit-202 technical-source dossier (unit202-source-acquisition-manifest.ts, unit202-technical-source-verification.ts) is BENCHMARK-ONLY. It is not evidence available to the future blind Unit-202 acquisition process, which must mechanically exclude it per the POSITIVE ALLOWLIST (UNIT202-BLIND-ACQUISITION-ALLOWLIST.json, authoritative) and the denylist (defence in depth only).",
  supersedesNote: "d828e78 (CC-22) and 48b1a98 (CC-22A/CC-22B) reconciliation counts and the CC-22B heuristic historical-benchmark counts (previousHeuristicCounts above) are SUPERSEDED. The blind acquisition target manifest itself is NOT superseded -- its hash is unchanged from CC-22B (task section 17's explicit instruction).",
  denominators,
};
writeJson(path.join(benchmarkOutDir, "UNIT202-EVIDENCE-ACQUISITION-BENCHMARK-FREEZE.json"), freeze);

if (freeze.blindAcquisitionTargetManifestHash !== freeze.blindTargetManifestExpectedHash) {
  throw new Error(`CC-22C STOP: blind acquisition target manifest hash changed! expected ${freeze.blindTargetManifestExpectedHash}, got ${freeze.blindAcquisitionTargetManifestHash}. Task section 15: do not regenerate/reorder/modify this file.`);
}

const reportMd = `# Unit 202 Evidence Acquisition Benchmark Freeze (CC-22C)

Parent HEAD: \`8fa98b0\` (audit: freeze Unit 202 acquisition benchmark).

This package hardens the CC-22B benchmark: the historical answer key is now derived exclusively from explicit, auditable bindings (historical-benchmark-bindings.ts) -- no fuzzy/token matching, no manual state overrides -- and a positive, default-deny local-input allowlist is frozen for the future blind acquisition runner.

**Blind target manifest hash unchanged (task section 15):** \`${freeze.blindAcquisitionTargetManifestHash}\` -- matches the CC-22B-frozen hash exactly. Not regenerated, not reordered, not modified.

## PA proposition counts (unchanged from CC-22B -- pa-target.ts was not touched)

${Object.entries(classificationCounts).map(([k, v]) => `- ${k}: ${v}`).join("\n")}

## Acquisition target counts

- Total acquisition targets (REQUIRED + OPTIONAL_CONTEXT): ${blindTargets.length}
- REQUIRED: ${denominators.acquisitionTargetsTotal}
- OPTIONAL_CONTEXT: ${denominators.contextualOptionalTargets}
- Representative-exemplar targets: ${denominators.representativeExemplarTargets}

## Historical benchmark counts -- explicit bindings only (task section 9: no expected count)

**Previous (CC-22B heuristic, SUPERSEDED):** VERIFIED=${previousHeuristicCounts.historicallyVerified}, CONDITIONAL=${previousHeuristicCounts.historicallyConditional}, SOURCE_GAP=${previousHeuristicCounts.historicallySourceGap}, NONE=${previousHeuristicCounts.noHistoricalBenchmark} (fuzzy/token matcher + manual overrides -- both removed).

**Final (CC-22C explicit bindings, ${finalExplicitBindingCounts.totalExplicitBindings} bindings):**

- Historically VERIFIED: ${denominators.historicallyVerified}
- Historically CONDITIONAL: ${denominators.historicallyConditional}
- Historically SOURCE_GAP: ${denominators.historicallySourceGap}
- No historical benchmark at all: ${denominators.noHistoricalBenchmark}

## Targets by AC

${Object.entries(byACCounts).sort().map(([ac, n2]) => `- ${ac}: ${n2}`).join("\n")}

## Files frozen

- \`UNIT202-BLIND-ACQUISITION-TARGETS.json\` (sha256 ${freeze.blindAcquisitionTargetManifestHash}, UNCHANGED from CC-22B)
- \`UNIT202-HISTORICAL-ACQUISITION-BENCHMARK.json\` (sealed, sha256 ${freeze.historicalBenchmarkHash})
- \`UNIT202-BLIND-ACQUISITION-ALLOWLIST.json\` (authoritative, sha256 ${freeze.allowlistHash})
- \`UNIT202-BLIND-ACQUISITION-DENYLIST.json\` (defence in depth only, sha256 ${freeze.denylistHash})
- \`UNIT202-PA-PROPOSITION-LEDGER.json\` (sha256 ${freeze.paPropositionLedgerHash})
- \`historical-benchmark-bindings.ts\` (sha256 ${freeze.historicalBindingsFileHash})

Project-Architect decisions remaining: **${summary.projectArchitectDecisionRemaining}** (expected 0).

STOP. No acquisition performed. The next package inspects/builds the generic technical-evidence acquisition workflow and executes a mechanically isolated blind Unit-202 acquisition replay using ONLY \`UNIT202-BLIND-ACQUISITION-TARGETS.json\`, governed by \`UNIT202-BLIND-ACQUISITION-ALLOWLIST.json\`.
`;
writeFileSync(path.join(benchmarkOutDir, "UNIT202-EVIDENCE-ACQUISITION-BENCHMARK-REPORT.md"), reportMd, "utf-8");

console.log("CC-22C benchmark hardening complete.");
console.log(`  PA propositions: ${ledger.length} (unchanged from CC-22B)`);
console.log(`  acquisition targets: ${blindTargets.length} (REQUIRED=${denominators.acquisitionTargetsTotal}, OPTIONAL_CONTEXT=${denominators.contextualOptionalTargets})`);
console.log(`  blind target manifest hash unchanged: ${freeze.blindAcquisitionTargetManifestHash === freeze.blindTargetManifestExpectedHash}`);
console.log(`  explicit bindings: ${HISTORICAL_BENCHMARK_BINDINGS.length}`);
console.log(`  historically VERIFIED/CONDITIONAL/SOURCE_GAP/none (explicit): ${denominators.historicallyVerified}/${denominators.historicallyConditional}/${denominators.historicallySourceGap}/${denominators.noHistoricalBenchmark}`);
console.log(`  previous heuristic (superseded) VERIFIED/CONDITIONAL/SOURCE_GAP/none: ${previousHeuristicCounts.historicallyVerified}/${previousHeuristicCounts.historicallyConditional}/${previousHeuristicCounts.historicallySourceGap}/${previousHeuristicCounts.noHistoricalBenchmark}`);
console.log(`  PROJECT_ARCHITECT_DECISION remaining: ${summary.projectArchitectDecisionRemaining}`);
console.log(`  semanticAdjudications: ${semanticAdjudications.length}, certifications: ${knowledgeBoundaryCertifications.length}, unadjudicated REVIEW_PROPOSED: ${unadjudicatedReviewProposed.length}`);
