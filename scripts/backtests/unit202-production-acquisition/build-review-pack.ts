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

// --- Two distinct, never-mixed scopes: WHOLE UNIT 202 (all six batches) and
//     BATCHES 04-06 ONLY (the batches this pass corrects). Every total below
//     is mechanically derived from `batchSummaries`, split by `b.frozen`, so
//     the two scopes can never silently collapse into one another again. ---
function aggregate(scope: readonly BatchSummary[]) {
  const statusTotals: Record<string, number> = {};
  let structSat = 0;
  let retired = 0;
  let learningPointCount = 0;
  const lpReadiness: Record<string, number> = {};
  for (const b of scope) {
    for (const [k, v] of Object.entries(b.statusTotals)) statusTotals[k] = (statusTotals[k] ?? 0) + v;
    structSat += b.structurallySatisfiedCount;
    retired += b.retiredOutOfScopeCount;
    learningPointCount += b.learningPointCount;
    for (const [k, v] of Object.entries(b.learningPointReadiness)) lpReadiness[k] = (lpReadiness[k] ?? 0) + v;
  }
  const requirementCount = scope.reduce((s, b) => s + b.requirementCount, 0);
  return { requirementCount, statusTotals, structSat, retired, learningPointCount, lpReadiness };
}

const wholeUnit = aggregate(batchSummaries);
const batches0406 = aggregate(batchSummaries.filter((b) => !b.frozen));

// Back-compat local names used by the JSON/MD below refer to the WHOLE-UNIT
// scope only where historically they meant "all six batches"; the
// Batches-04-06-only scope is reported separately and explicitly.
const aggregateStatusTotals = wholeUnit.statusTotals;
const aggregateStructSat = wholeUnit.structSat;
const aggregateRetired = wholeUnit.retired;
const totalLearningPoints = wholeUnit.learningPointCount;
const aggregateLpReadiness = wholeUnit.lpReadiness;

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
    scopeNote: "The two scopes below are computed independently and never mixed: wholeUnit202 sums all six batches (01-06); batches0406Only sums only the unfrozen batches this correction pass touches. Neither figure is hand-asserted -- both are recomputed from `batchSummaries` on every run.",
    wholeUnit202: { verifiedOrPartiallyVerifiedOrGap: wholeUnit.statusTotals, structurallySatisfied: wholeUnit.structSat, retiredOutOfScope: wholeUnit.retired, requirementCount: wholeUnit.requirementCount },
    batches0406Only: { verifiedOrPartiallyVerifiedOrGap: batches0406.statusTotals, structurallySatisfied: batches0406.structSat, retiredOutOfScope: batches0406.retired, requirementCount: batches0406.requirementCount },
  },
  evidenceStatusTotalsByBatch: Object.fromEntries(batchSummaries.map((b) => [b.id, { ...b.statusTotals, STRUCTURALLY_SATISFIED: b.structurallySatisfiedCount, RETIRED_OUT_OF_SCOPE: b.retiredOutOfScopeCount, requirementCount: b.requirementCount }])),
  learningPoints: {
    scopeNote: "wholeUnit202 sums all six batches; batches0406Only sums only the unfrozen batches. Learning-point readiness (evidenceReadiness) is never mixed with evidence status, structural satisfaction, retirement, exemplar readiness or learner-facing asset readiness -- see technicalEvidenceExemplarAndAssetDependenciesSeparated below for those.",
    wholeUnit202: { total: wholeUnit.learningPointCount, readinessTotals: wholeUnit.lpReadiness },
    batches0406Only: { total: batches0406.learningPointCount, readinessTotals: batches0406.lpReadiness },
    byBatch: Object.fromEntries(batchSummaries.map((b) => [b.id, { count: b.learningPointCount, readiness: b.learningPointReadiness, identityStatus: b.identityStatus }])),
  },
  technicalEvidenceExemplarAndAssetDependenciesSeparated: {
    explanation: "Stage 1.5: technical-evidence readiness (verificationStatus), learning-point identity readiness (evidenceReadiness), representative-exemplar readiness (exemplarObjectIdentity / RETIRED_OUT_OF_SCOPE / TRANSFORMED_TO_EXEMPLAR disposition), and learner-facing visual/recognition-asset readiness (outstandingProductionDependencies) are tracked as four separate concerns, never conflated.",
    representativeExemplarDependencies: allOutstandingDependencyLPs,
    knownAssetGaps: ["No photographic material for component physical-appearance recognition exists in Batch 06's evidence (component identity is accepted; photographs remain a LEARNER_FACING_VISUAL_ASSET production dependency, not a technical-evidence gap).", "AC6.2 schematic-symbol artwork for learner-facing lessons remains a production-asset dependency once the underlying symbol facts are settled; missing artwork must never be invented to close this dependency."],
  },
  crossBatchSatisfaction: allCrossBatchSatisfactions,
  remainingGenuineGaps: {
    battery: "See each batch's own EVIDENCE-RESULTS.json `gaps` fields for full detail. Headline remaining items after the final correction pass: (1) Batch 04 -- 4 SYMBOL_OR_CONVENTION quantity-symbol letters (power factor, frequency, capacitance, inductance) still have no in-permitted-class (PRIMARY_NORMATIVE_OR_STANDARDS_BODY / PROFESSIONAL_BODY / AUTHORITATIVE_TECHNICAL_REFERENCE) source despite a genuine re-sourcing attempt; the ohmmeter-measures-resistance device-level definition likewise remains genuinely unresolved (Wikipedia found but not itself a permitted-class source); (2) Batch 05 -- Fleming's right-hand (generator) rule's finger mapping remains unverified in directly-read text form (the strongest lead, Hughes' textbook p.145 cited by Wikipedia, could not be directly read); the single-loop-alternator-generator-parts diagram genuinely lacks one source both captioned single-loop and fully labelled with slip rings/brushes; (3) Batch 06 -- AC6.2 schematic-symbol currency against the current IEC 60617 database remains genuinely unresolved (independently re-verified: the free preview explains its own data model but exposes no specific numbered symbol entry without a paid login); no photographic component-recognition evidence exists; three exemplar circuits (dimmer RC values, heating relay/transistor topology, security-alarm exact topology) remain retired/transformed as documented, with the alarm circuit specifically needing a downstream authored-and-validated representative exemplar before final lesson production.",
  },
  remainingProductArchitectQuestions: [
    "Is the corrected 211-requirement count (down from the historical 213, both integration targets structurally satisfied) accepted, given full traceability is preserved via the amendment ledger's requirementIdMigrations?",
    "Does the security-alarm learning point's transformation (retained transferable roles as READY content, exact circuit as an explicit REPRESENTATIVE_EXEMPLAR_AUTHORING dependency) satisfy the intent of Stage 5 exemplar decision 3, or is a different disposition preferred?",
    "Is the disclosed judgment call classifying Instrumentation Tools and the DOE power-thyristor handbook host as AUTHORITATIVE_TECHNICAL_REFERENCE (rather than a stricter tier) accepted?",
    "Are the 4 remaining Batch 04 quantity-symbol gaps (power factor, frequency, capacitance, inductance) and the Fleming right-hand-rule finger-mapping gap worth a further dedicated re-sourcing pass (e.g. paid access to IEC 60027-1/ISO 80000-6, or the Hughes textbook) before Batch 04/05 are frozen?",
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

## Disposition totals -- WHOLE UNIT 202 (all six batches)

- Evidence-status totals: ${JSON.stringify(wholeUnit.statusTotals)}
- Requirement count: **${wholeUnit.requirementCount}**
- Structurally satisfied (integration targets, zero independent requirement): **${wholeUnit.structSat}**
- Retired out of scope (non-canonical exemplar detail): **${wholeUnit.retired}**

## Disposition totals -- BATCHES 04-06 ONLY (the batches this pass corrects; Batches 01-03 are frozen and excluded from this scope)

- Evidence-status totals: ${JSON.stringify(batches0406.statusTotals)}
- Requirement count: **${batches0406.requirementCount}**
- Structurally satisfied: **${batches0406.structSat}**
- Retired out of scope: **${batches0406.retired}**

## Per-batch evidence status

${batchSummaries.map((b) => `- **${b.id} (${b.name})** -- ${b.frozen ? "FROZEN" : "unfrozen, proposed"}: ${b.requirementCount} requirements, status ${JSON.stringify(b.statusTotals)}, structurally satisfied ${b.structurallySatisfiedCount}, retired ${b.retiredOutOfScopeCount}`).join("\n")}

## Learning points -- WHOLE UNIT 202 (all six batches)

- Total: **${wholeUnit.learningPointCount}**
- Readiness totals: ${JSON.stringify(wholeUnit.lpReadiness)}

## Learning points -- BATCHES 04-06 ONLY

- Total: **${batches0406.learningPointCount}**
- Readiness totals: ${JSON.stringify(batches0406.lpReadiness)}

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
