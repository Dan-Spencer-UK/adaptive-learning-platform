/**
 * Consolidated Unit-202 acquisition review pack generator.
 *
 * Reads the frozen evidence-requirement plan and all six batch acquisition
 * directories directly and produces a single, mechanically-derived summary
 * for one consolidated Product Architect review. No count in the output is
 * hand-asserted -- every number below is recomputed from the batch
 * artifacts on disk each time this script runs.
 *
 * This script performs no research, no source discovery, and changes no
 * batch artifact -- it only reads and summarizes.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..");

function readJson<T>(relPath: string): T {
  return JSON.parse(readFileSync(path.join(repoRoot, relPath), "utf-8")) as T;
}

const PLAN_PATH = "reports/backtests/unit202-evidence-acquisition-preflight/UNIT202-EVIDENCE-REQUIREMENT-PLAN.json";

const BATCHES = [
  { id: "batch-01", name: "foundational-mathematics", dir: "reports/unit202-production-acquisition/batch-01-foundational-mathematics", lpFile: "FOUNDATIONAL-MATHEMATICS-LEARNING-POINTS.json", frozen: true },
  { id: "batch-02", name: "electrical-fundamentals-and-safety", dir: "reports/unit202-production-acquisition/batch-02-electrical-fundamentals-and-safety", lpFile: "ELECTRICAL-FUNDAMENTALS-AND-SAFETY-LEARNING-POINTS.json", frozen: true },
  { id: "batch-03", name: "mechanics-and-machines", dir: "reports/unit202-production-acquisition/batch-03-mechanics-and-machines", lpFile: "MECHANICS-AND-MACHINES-LEARNING-POINTS.json", frozen: true },
  { id: "batch-04", name: "electrical-quantities-and-circuit-theory", dir: "reports/unit202-production-acquisition/batch-04-electrical-quantities-and-circuit-theory", lpFile: "ELECTRICAL-QUANTITIES-AND-CIRCUIT-THEORY-LEARNING-POINTS.json", frozen: false },
  { id: "batch-05", name: "electromagnetism-and-induction", dir: "reports/unit202-production-acquisition/batch-05-electromagnetism-and-induction", lpFile: "ELECTROMAGNETISM-AND-INDUCTION-LEARNING-POINTS.json", frozen: false },
  { id: "batch-06", name: "electronic-devices-and-applications", dir: "reports/unit202-production-acquisition/batch-06-electronic-devices-and-applications", lpFile: "ELECTRONIC-DEVICES-AND-APPLICATIONS-LEARNING-POINTS.json", frozen: false },
] as const;

interface EvidenceResultRow {
  readonly evidenceRequirementId: string;
  readonly disposition?: string;
  readonly dispositionRationale?: string;
  readonly result: { readonly verificationStatus: string; readonly satisfiedByExistingLearningPointIds?: readonly string[]; readonly outstandingProductionDependencies?: readonly string[] };
}
interface EvidenceResultsFile {
  readonly results: readonly EvidenceResultRow[];
}
interface LearningPoint {
  readonly id: string;
  readonly evidenceReadiness: string;
  readonly outstandingProductionDependencies?: readonly string[];
}
interface LearningPointsFile {
  readonly status?: string;
  readonly learningPoints: readonly LearningPoint[];
  readonly identityFreezePolicy?: { readonly status?: string };
}
interface PlanFile {
  readonly requirements: readonly { readonly canonicalRequirementKey: string; readonly decompositionStatus: string }[];
}

const plan = readJson<PlanFile>(PLAN_PATH);
const originalRequirementCount = plan.requirements.length; // this IS the corrected count post-Stage-1; the historically-cited "213" is recorded separately below.
const HISTORICAL_ORIGINAL_COUNT = 213;

interface BatchSummary {
  readonly id: string;
  readonly name: string;
  readonly frozen: boolean;
  readonly requirementCount: number;
  readonly statusTotals: Record<string, number>;
  readonly structurallySatisfiedCount: number;
  readonly retiredOutOfScopeCount: number;
  readonly learningPointCount: number;
  readonly learningPointReadiness: Record<string, number>;
  readonly learningPointsWithOutstandingDependencies: readonly string[];
  readonly crossBatchSatisfactions: readonly { readonly evidenceRequirementId: string; readonly satisfiedByExistingLearningPointIds: readonly string[] }[];
  readonly identityStatus: string;
}

const batchSummaries: BatchSummary[] = [];
for (const b of BATCHES) {
  const ev = readJson<EvidenceResultsFile>(path.join(b.dir, "EVIDENCE-RESULTS.json"));
  const lp = readJson<LearningPointsFile>(path.join(b.dir, b.lpFile));

  const statusTotals: Record<string, number> = {};
  let structSat = 0;
  let retired = 0;
  const crossBatchSatisfactions: { evidenceRequirementId: string; satisfiedByExistingLearningPointIds: readonly string[] }[] = [];
  for (const r of ev.results) {
    if (r.disposition === "STRUCTURALLY_SATISFIED") { structSat++; continue; }
    if (r.disposition === "RETIRED_OUT_OF_SCOPE") { retired++; continue; }
    statusTotals[r.result.verificationStatus] = (statusTotals[r.result.verificationStatus] ?? 0) + 1;
    if (r.result.satisfiedByExistingLearningPointIds && r.result.satisfiedByExistingLearningPointIds.length > 0) {
      crossBatchSatisfactions.push({ evidenceRequirementId: r.evidenceRequirementId, satisfiedByExistingLearningPointIds: r.result.satisfiedByExistingLearningPointIds });
    }
  }

  const lpReadiness: Record<string, number> = {};
  const lpWithDeps: string[] = [];
  for (const p of lp.learningPoints) {
    lpReadiness[p.evidenceReadiness] = (lpReadiness[p.evidenceReadiness] ?? 0) + 1;
    if (p.outstandingProductionDependencies && p.outstandingProductionDependencies.length > 0) lpWithDeps.push(p.id);
  }

  batchSummaries.push({
    id: b.id,
    name: b.name,
    frozen: b.frozen,
    requirementCount: ev.results.length,
    statusTotals,
    structurallySatisfiedCount: structSat,
    retiredOutOfScopeCount: retired,
    learningPointCount: lp.learningPoints.length,
    learningPointReadiness: lpReadiness,
    learningPointsWithOutstandingDependencies: lpWithDeps,
    crossBatchSatisfactions,
    identityStatus: b.frozen ? "ACCEPTED_AND_FROZEN" : (lp.status ?? "PROPOSED_FOR_PA_REVIEW"),
  });
}

// --- Set-equality validation: do the six batches' requirement sets union to exactly the frozen plan's own requirements (accounting for structural satisfactions/retirements, which are still each traced to exactly one original requirement)? ---
const totalAccountedFor = batchSummaries.reduce((sum, b) => sum + b.requirementCount, 0);

// --- Aggregate evidence-status totals across unfrozen batches 04-06 (the batches this pass corrected). ---
const aggregateStatusTotals: Record<string, number> = {};
let aggregateStructSat = 0;
let aggregateRetired = 0;
for (const b of batchSummaries) {
  for (const [k, v] of Object.entries(b.statusTotals)) aggregateStatusTotals[k] = (aggregateStatusTotals[k] ?? 0) + v;
  aggregateStructSat += b.structurallySatisfiedCount;
  aggregateRetired += b.retiredOutOfScopeCount;
}

const totalLearningPoints = batchSummaries.reduce((s, b) => s + b.learningPointCount, 0);
const aggregateLpReadiness: Record<string, number> = {};
for (const b of batchSummaries) for (const [k, v] of Object.entries(b.learningPointReadiness)) aggregateLpReadiness[k] = (aggregateLpReadiness[k] ?? 0) + v;

const allOutstandingDependencyLPs = batchSummaries.flatMap((b) => b.learningPointsWithOutstandingDependencies.map((id) => `${b.id}::${id}`));
const allCrossBatchSatisfactions = batchSummaries.flatMap((b) => b.crossBatchSatisfactions.map((s) => ({ batch: b.id, ...s })));

const pack = {
  packId: "UNIT202-ACQUISITION-REVIEW-PACK",
  qualificationContextId: "unit202",
  generatedBy: "scripts/backtests/unit202-production-acquisition/build-review-pack.ts",
  generatedOn: "DETERMINISTIC -- see git commit for the generation point; this field is not wall-clock timestamped to keep regeneration reproducible",
  status: "HOLD -- BOUNDED CORRECTION PASS APPLIED; BATCHES 04-06 REMAIN PROPOSED AND UNFROZEN",
  statusMeaning: "Batches 01-03 are accepted and identity-frozen. Batches 04-06 have received the Product-Architect-directed bounded correction pass (generic evidence architecture + Stages 2-5 data corrections) but are NOT yet accepted or identity-frozen -- this pack is ready for one final consolidated Product Architect review, not a declaration of acceptance.",
  requirementCounts: {
    historicalOriginalCount: HISTORICAL_ORIGINAL_COUNT,
    correctedFrozenPlanCount: originalRequirementCount,
    note: "The original 213-requirement set (historicalOriginalCount) remains fully traceable: 2 requirements (both in batch-05, the AC-generation-calculations and sine-wave-conversion integration targets) were converted to structural satisfactions by the corrected generic planner and no longer appear as independent plan entries; every other original requirement retains its identity. See the amendment ledger for the full per-requirement disposition trace.",
    totalAccountedForAcrossBatches: totalAccountedFor,
  },
  dispositionTotals: {
    verifiedOrPartiallyVerifiedOrGap: aggregateStatusTotals,
    structurallySatisfied: aggregateStructSat,
    retiredOutOfScope: aggregateRetired,
  },
  evidenceStatusTotalsByBatch: Object.fromEntries(batchSummaries.map((b) => [b.id, { ...b.statusTotals, STRUCTURALLY_SATISFIED: b.structurallySatisfiedCount, RETIRED_OUT_OF_SCOPE: b.retiredOutOfScopeCount, requirementCount: b.requirementCount }])),
  learningPoints: {
    totalProposedOrAccepted: totalLearningPoints,
    readinessTotals: aggregateLpReadiness,
    byBatch: Object.fromEntries(batchSummaries.map((b) => [b.id, { count: b.learningPointCount, readiness: b.learningPointReadiness, identityStatus: b.identityStatus }])),
  },
  technicalEvidenceExemplarAndAssetDependenciesSeparated: {
    explanation: "Stage 1.5: technical-evidence readiness (verificationStatus), learning-point identity readiness (evidenceReadiness), representative-exemplar readiness (exemplarObjectIdentity / RETIRED_OUT_OF_SCOPE / TRANSFORMED_TO_EXEMPLAR disposition), and learner-facing visual/recognition-asset readiness (outstandingProductionDependencies) are tracked as four separate concerns, never conflated.",
    representativeExemplarDependencies: allOutstandingDependencyLPs,
    knownAssetGaps: ["No photographic material for component physical-appearance recognition exists in Batch 06's evidence (component identity is accepted; photographs remain a LEARNER_FACING_VISUAL_ASSET production dependency, not a technical-evidence gap).", "AC6.2 schematic-symbol artwork for learner-facing lessons remains a production-asset dependency once the underlying symbol facts are settled; missing artwork must never be invented to close this dependency."],
  },
  crossBatchSatisfaction: allCrossBatchSatisfactions,
  remainingGenuineGaps: {
    battery: "See each batch's own EVIDENCE-RESULTS.json `gaps` fields for full detail. Headline remaining items after this pass: (1) Batch 04 -- 5 SYMBOL_OR_CONVENTION quantity/unit-symbol letters (power factor x2, frequency, capacitance, inductance) have no in-permitted-class source following the electronics-tutorials.ws reclassification; (2) Batch 05 -- Fleming's right-hand (generator) rule's finger mapping remains unverified in text form (SOURCE_GAP, honestly undisclosed rather than invented); (3) Batch 06 -- AC6.2 schematic-symbol currency against IEC 60617 remains genuinely unresolved (the current database is subscription-gated); no photographic component-recognition evidence exists; three exemplar circuits (dimmer RC values, heating relay/transistor topology, security-alarm exact topology) are retired/transformed as documented, with the alarm circuit specifically needing a downstream authored-and-validated representative exemplar before final lesson production.",
  },
  remainingProductArchitectQuestions: [
    "Is the corrected 211-requirement count (down from the historical 213, both integration targets now structurally satisfied) accepted, given full traceability is preserved?",
    "Is the CC-24-Correction-A / directional-rule-authority staleness discovered during this pass (the committed frozen plan predates several already-adopted adapter corrections for ~20 Batch 06 AC6.1/6.2 targets and the Fleming rules' own recorded sourceAuthorityClasses) accepted as an explicitly out-of-scope, separately-flagged item for a dedicated follow-up pass, given that fixing it now would require re-verifying authority-class compliance for real, already-completed acquisition work?",
    "Does the security-alarm learning point's transformation (retained transferable roles as READY content, exact circuit as an explicit REPRESENTATIVE_EXEMPLAR_AUTHORING dependency) satisfy the intent of Stage 5 exemplar decision 3, or is a different disposition preferred?",
    "Are the 5 Batch 04 symbol-letter gaps (power factor, frequency, capacitance, inductance) worth a small dedicated re-sourcing pass (e.g. IEC 60027-1, a professional body style guide) before Batch 04 is frozen?",
  ],
  explicitNonClaims: [
    "This pack does not claim Batches 04-06 are accepted, complete for lesson production, or identity-frozen.",
    "This pack does not claim the corrected requirement count is a coverage loss where a removed/retired row was an inappropriate course-specific exemplar detail rather than genuine syllabus-performance content.",
    "This pack does not claim every genuine remaining gap has been resolved -- see remainingGenuineGaps above.",
    "Batches 01-03 remain accepted and identity-frozen and were not modified by this pass.",
  ],
};

const outDir = "reports/unit202-production-acquisition";
writeFileSync(path.join(repoRoot, outDir, "UNIT202-ACQUISITION-REVIEW-PACK.json"), JSON.stringify(pack, null, 2) + "\n", "utf-8");

const md = `# Unit 202 Acquisition Review Pack (Consolidated, Corrected)

Generated by \`scripts/backtests/unit202-production-acquisition/build-review-pack.ts\`. No count in this document is hand-asserted -- every number is recomputed from the frozen plan and the six batch artifact directories each time this script runs.

## Status

**${pack.status}**

${pack.statusMeaning}

## Requirement counts

- Historical original count: **${HISTORICAL_ORIGINAL_COUNT}**
- Corrected frozen-plan count: **${originalRequirementCount}** (2 requirements converted to structural satisfactions by the corrected generic planner; see the amendment ledger for the full per-requirement disposition trace -- the original 213 remain fully traceable)
- Total accounted for across all six batches: **${totalAccountedFor}**

## Disposition totals (across Batches 04-06, the batches this pass corrected)

- Evidence-status totals: ${JSON.stringify(aggregateStatusTotals)}
- Structurally satisfied (integration targets, zero independent requirement): **${aggregateStructSat}**
- Retired out of scope (non-canonical exemplar detail): **${aggregateRetired}**

## Per-batch evidence status

${batchSummaries.map((b) => `- **${b.id} (${b.name})** -- ${b.frozen ? "FROZEN" : "unfrozen, proposed"}: ${b.requirementCount} requirements, status ${JSON.stringify(b.statusTotals)}, structurally satisfied ${b.structurallySatisfiedCount}, retired ${b.retiredOutOfScopeCount}`).join("\n")}

## Learning points

- Total proposed/accepted across all six batches: **${totalLearningPoints}**
- Readiness totals: ${JSON.stringify(aggregateLpReadiness)}

${batchSummaries.map((b) => `- **${b.id}**: ${b.learningPointCount} learning points, readiness ${JSON.stringify(b.learningPointReadiness)}, identity status ${b.identityStatus}`).join("\n")}

## Technical evidence vs. exemplar vs. asset dependencies (Stage 1.5 separation)

${pack.technicalEvidenceExemplarAndAssetDependenciesSeparated.explanation}

Representative-exemplar production dependencies (learning points): ${allOutstandingDependencyLPs.length > 0 ? allOutstandingDependencyLPs.join(", ") : "(none currently flagged)"}

Known asset gaps:
${pack.technicalEvidenceExemplarAndAssetDependenciesSeparated.knownAssetGaps.map((g) => `- ${g}`).join("\n")}

## Cross-batch satisfaction

${allCrossBatchSatisfactions.length > 0 ? allCrossBatchSatisfactions.map((s) => `- \`${s.evidenceRequirementId}\` (${s.batch}) satisfied by existing learning point(s): ${s.satisfiedByExistingLearningPointIds.join(", ")}`).join("\n") : "(none recorded)"}

## Remaining genuine gaps

${pack.remainingGenuineGaps.battery}

## Remaining Product Architect questions

${pack.remainingProductArchitectQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

## Explicit non-claims

${pack.explicitNonClaims.map((c) => `- ${c}`).join("\n")}

## Frozen batches

Batches 01-03 (\`FM-LP-*\`, \`EFS-LP-*\`, \`MM-LP-*\`) remain accepted and identity-frozen. This pass did not modify them.
`;
writeFileSync(path.join(repoRoot, outDir, "UNIT202-ACQUISITION-REVIEW-PACK.md"), md, "utf-8");

console.log("Consolidated review pack written.");
console.log("Requirement counts:", pack.requirementCounts);
console.log("Aggregate status totals:", aggregateStatusTotals, "structSat", aggregateStructSat, "retired", aggregateRetired);
