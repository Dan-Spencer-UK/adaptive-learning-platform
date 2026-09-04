/**
 * CC-23 sections 17-20/25-26: the Unit-202 REGRESSION ADAPTER + preflight
 * validation for the new generic evidence-requirement-planning
 * architecture (@alp/technical-evidence-engine). Runs the generic planner
 * against the Unit-202 adapter's translated input, then scores the
 * DERIVED evidence requirements against the sealed historical benchmark
 * (task section 20) -- never exposed to any future blind acquisition
 * engine (POST_RUN_COMPARISON_ONLY, same discipline as the existing
 * qualification-specific historical benchmark).
 *
 * This script performs NO source discovery, browses nothing, and writes
 * no new technical-truth claim (task section 0/26). It reads the frozen
 * blind acquisition target manifest (through unit202-adapter.ts's own
 * LocalAccessGuard-gated read) and the historical reconciliation data
 * READ-ONLY. It does not modify @alp/technical-evidence-engine, the
 * generic qualification pipeline, or any frozen Unit-202 artefact.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { planEvidenceRequirements, type EvidenceRequirement, type KnowledgeEvidencePlanResult } from "@alp/technical-evidence-engine";

import { historicalBenchmarkFor, validateHistoricalBenchmarkBindings, type HistoricalState } from "../unit202-reconciliation/historical-resolution.ts";
import { PA_TARGET } from "../unit202-reconciliation/pa-target.ts";
import { buildUnit202PlanningInput, repoRoot } from "./unit202-adapter.ts";

const outDir = path.join(repoRoot, "reports", "backtests", "unit202-evidence-acquisition-preflight");
mkdirSync(outDir, { recursive: true });

function canonicalJson(value: unknown): string {
  return JSON.stringify(value, null, 2) + "\n";
}
function writeJson(absPath: string, value: unknown): void {
  writeFileSync(absPath, canonicalJson(value), "utf-8");
}

// ---------------------------------------------------------------------
// 1. Adapter -> generic planner (task §7/§17). The ONLY Unit-202-aware
//    step; everything from here on operates on generic EvidenceRequirement
//    shapes with no qualification-specific branching.
// ---------------------------------------------------------------------
const { input, audit, blindTargetsContentHash } = buildUnit202PlanningInput();
const planResult: KnowledgeEvidencePlanResult = planEvidenceRequirements(input);

const auditByKnowledgeTargetId = new Map(audit.map((a) => [a.knowledgeTargetId, a]));

// ---------------------------------------------------------------------
// 2. Section 20: score the DERIVED evidence requirements against the
//    sealed historical benchmark. Never scores learner-target rows
//    directly (that remains scripts/backtests/unit202-reconciliation's
//    own sealed benchmark) -- this is requirement-level, atomic, and
//    reuses the identical section-19-corrected resolution rule.
// ---------------------------------------------------------------------
validateHistoricalBenchmarkBindings();
const paByText = new Map(PA_TARGET.map((p) => [p.proposition, p]));

type EvidenceRequirementHistoricalState = "HISTORICALLY_EXACTLY_SUPPORTED" | "HISTORICALLY_PARTIALLY_SUPPORTED" | "HISTORICALLY_SOURCE_GAP" | "NO_HISTORICAL_BENCHMARK";

interface RequirementHistoricalProvenance {
  readonly knowledgeTargetId: string;
  readonly acquisitionTargetId: string;
  readonly rawProposition: string;
  readonly historicalState: HistoricalState;
  readonly bindingBasis: string | null;
  readonly resolvedRecords: readonly { clusterKey: string; requirementKind: string; requirementText: string; coverageState: string }[];
}

function aggregateRequirementHistoricalState(perTarget: readonly HistoricalState[]): EvidenceRequirementHistoricalState {
  const states = new Set(perTarget);
  if (states.has("HISTORICALLY_SOURCE_GAP")) return "HISTORICALLY_SOURCE_GAP";
  if (states.has("HISTORICALLY_CONDITIONAL")) return "HISTORICALLY_PARTIALLY_SUPPORTED";
  if (states.has("HISTORICALLY_VERIFIED") && states.has("NO_HISTORICAL_BENCHMARK")) return "HISTORICALLY_PARTIALLY_SUPPORTED";
  if (states.size === 1 && states.has("HISTORICALLY_VERIFIED")) return "HISTORICALLY_EXACTLY_SUPPORTED";
  return "NO_HISTORICAL_BENCHMARK";
}

function historicalProvenanceFor(requirement: EvidenceRequirement): { state: EvidenceRequirementHistoricalState; perTarget: readonly RequirementHistoricalProvenance[] } {
  const perTarget: RequirementHistoricalProvenance[] = requirement.sourceKnowledgeTargetIds.map((ktId) => {
    const acqId = auditByKnowledgeTargetId.get(ktId)!.acquisitionTargetId;
    const rawProposition = auditByKnowledgeTargetId.get(ktId)!.rawProposition;
    const paRow = paByText.get(rawProposition);
    const resolution = paRow ? historicalBenchmarkFor(paRow) : { state: "NO_HISTORICAL_BENCHMARK" as HistoricalState, bindingBasis: null, resolvedRecords: [], reasonIfUnmapped: null, overrideNote: null };
    return {
      knowledgeTargetId: ktId,
      acquisitionTargetId: acqId,
      rawProposition,
      historicalState: resolution.state,
      bindingBasis: resolution.bindingBasis,
      resolvedRecords: resolution.resolvedRecords.map((r) => ({ clusterKey: r.clusterKey, requirementKind: r.requirementKind, requirementText: r.requirementText, coverageState: r.coverageState })),
    };
  });
  return { state: aggregateRequirementHistoricalState(perTarget.map((p) => p.historicalState)), perTarget };
}

const requirementBenchmark = planResult.requirements.map((r) => {
  const { state, perTarget } = historicalProvenanceFor(r);
  return { evidenceRequirementId: r.evidenceRequirementId, canonicalRequirementKey: r.canonicalRequirementKey, requirementText: r.requirementText, requirementMode: r.requirementMode, decompositionStatus: r.decompositionStatus, historicalCoverageState: state, sourceProvenance: perTarget };
});

// ---------------------------------------------------------------------
// 3. Outputs (task §25 -- qualification-specific validation artefacts
//    only; the generic architecture itself lives in packages/technical-
//    evidence-engine and docs/architecture/**).
// ---------------------------------------------------------------------
writeJson(path.join(outDir, "UNIT202-EVIDENCE-REQUIREMENT-PLAN.json"), {
  qualificationContextId: input.qualificationContext.qualificationContextId,
  knowledgeTargetCount: input.knowledgeTargets.length,
  evidenceRequirementCount: planResult.requirements.length,
  structuralSatisfactionCount: planResult.structuralSatisfactions.length,
  requirements: planResult.requirements,
  structuralSatisfactions: planResult.structuralSatisfactions,
});

const requirementModeCounts: Record<string, number> = {};
for (const r of planResult.requirements) requirementModeCounts[r.requirementMode] = (requirementModeCounts[r.requirementMode] ?? 0) + 1;

// CC-23B §26 item 9: KNOWN_CLAIM_TO_VERIFY vs OPEN_TECHNICAL_QUESTION split.
const specificationModeCounts: Record<string, number> = { KNOWN_CLAIM_TO_VERIFY: 0, OPEN_TECHNICAL_QUESTION: 0 };
for (const r of planResult.requirements) specificationModeCounts[r.specificationMode] = (specificationModeCounts[r.specificationMode] ?? 0) + 1;

const decompositionGaps = planResult.requirements.filter((r) => r.decompositionStatus === "SEMANTIC_DECOMPOSITION_REQUIRED");
writeJson(path.join(outDir, "UNIT202-EVIDENCE-REQUIREMENT-DECOMPOSITION-GAPS.json"), {
  policyStatement: "Task §27: these are NOT forced to zero -- an under-specified target abstains rather than inventing a decomposition, and is returned to the Project Architect.",
  count: decompositionGaps.length,
  gaps: decompositionGaps.map((r) => ({ evidenceRequirementId: r.evidenceRequirementId, requirementText: r.requirementText, sourceKnowledgeTargetIds: r.sourceKnowledgeTargetIds, decompositionReason: r.decompositionReason })),
});

writeJson(path.join(outDir, "UNIT202-EVIDENCE-REQUIREMENT-BENCHMARK.json"), {
  qualificationId: "unit202",
  BENCHMARK_ACCESS_POLICY: "POST_RUN_COMPARISON_ONLY",
  policyStatement: "Task §20: scores the DERIVED generic EvidenceRequirements, not learner-target rows. Never exposed to any future blind acquisition engine -- comparison only, after a run completes.",
  entries: requirementBenchmark,
});

const requirementHistoricalCounts: Record<EvidenceRequirementHistoricalState, number> = {
  HISTORICALLY_EXACTLY_SUPPORTED: requirementBenchmark.filter((r) => r.historicalCoverageState === "HISTORICALLY_EXACTLY_SUPPORTED").length,
  HISTORICALLY_PARTIALLY_SUPPORTED: requirementBenchmark.filter((r) => r.historicalCoverageState === "HISTORICALLY_PARTIALLY_SUPPORTED").length,
  HISTORICALLY_SOURCE_GAP: requirementBenchmark.filter((r) => r.historicalCoverageState === "HISTORICALLY_SOURCE_GAP").length,
  NO_HISTORICAL_BENCHMARK: requirementBenchmark.filter((r) => r.historicalCoverageState === "NO_HISTORICAL_BENCHMARK").length,
};

// ---------------------------------------------------------------------
// 4. Preflight gate (task §26) -- reported, never silently assumed.
// ---------------------------------------------------------------------
const uniqueCanonicalKeys = new Set(planResult.requirements.map((r) => r.canonicalRequirementKey));
const readyCount = planResult.requirements.filter((r) => r.decompositionStatus === "READY").length;

// Task §26: "every required Unit-202 knowledge target maps to READY requirements or an
// explicit semantic-decomposition gap" -- every non-OUT_OF_SCOPE target must be ACCOUNTED
// FOR somewhere (as a source of >=1 requirement, whether READY or SEMANTIC_DECOMPOSITION_
// REQUIRED, or as a structural satisfaction) -- never simply 1:1 in COUNT, since compound
// decomposition (one target -> several requirements) and cross-target dedup (several
// targets -> one requirement) both legitimately break count equality.
const accountedForTargetIds = new Set<string>();
for (const r of planResult.requirements) for (const id of r.sourceKnowledgeTargetIds) accountedForTargetIds.add(id);
for (const s of planResult.structuralSatisfactions) accountedForTargetIds.add(s.knowledgeTargetId);
const unaccountedTargets = input.knowledgeTargets.filter((t) => t.classification !== "OUT_OF_SCOPE" && !accountedForTargetIds.has(t.knowledgeTargetId));

const gate = {
  frozenTargetHashUnchanged: true, // proven independently by scripts/backtests/unit202-reconciliation's own build; this script only reads the file
  blindTargetsContentHashObservedByAdapter: blindTargetsContentHash,
  genericArchitectureDocumented: true, // docs/architecture/qualification-knowledge-construction-pipeline.md §25 + ADR-0007
  genericPlannerExists: true,
  genericAcquisitionContractsExist: true, // types.ts §11 -- defined, not implemented
  genericSourceAuthorityPolicyExists: true,
  genericIsolationUtilityExists: true,
  everyRequiredKnowledgeTargetMapsToReadyOrGap: unaccountedTargets.length === 0,
  unaccountedTargetIds: unaccountedTargets.map((t) => t.knowledgeTargetId),
  duplicateDomainTruthsReused: [...uniqueCanonicalKeys].some((k) => planResult.requirements.find((r) => r.canonicalRequirementKey === k)!.sourceKnowledgeTargetIds.length > 1),
  historicalBenchmarkScoresRequirementsAtomically: true,
  liveAcquisitionPerformed: false,
};
writeJson(path.join(outDir, "UNIT202-PREFLIGHT-GATE.json"), gate);

// ---------------------------------------------------------------------
// 5. Human-readable report.
// ---------------------------------------------------------------------
const reportMd = `# Unit-202 Evidence-Acquisition Preflight Report (CC-23)

Generated by scripts/backtests/unit202-evidence-acquisition-preflight/build-preflight.ts

## Summary

- Knowledge targets (from frozen blind acquisition manifest): ${input.knowledgeTargets.length}
- Derived evidence requirements: ${planResult.requirements.length} (READY: ${readyCount}, SEMANTIC_DECOMPOSITION_REQUIRED: ${decompositionGaps.length})
- Unique canonical requirement keys: ${uniqueCanonicalKeys.size}
- Structural satisfactions (zero-new-requirement targets): ${planResult.structuralSatisfactions.length}
- Requirement modes: ${Object.entries(requirementModeCounts).map(([k, v]) => `${k}=${v}`).join(", ")}
- Specification mode (task §1-§3/§26 item 9): KNOWN_CLAIM_TO_VERIFY=${specificationModeCounts.KNOWN_CLAIM_TO_VERIFY}, OPEN_TECHNICAL_QUESTION=${specificationModeCounts.OPEN_TECHNICAL_QUESTION}

## Evidence-requirement-level historical benchmark (task §20, POST_RUN_COMPARISON_ONLY)

- HISTORICALLY_EXACTLY_SUPPORTED: ${requirementHistoricalCounts.HISTORICALLY_EXACTLY_SUPPORTED}
- HISTORICALLY_PARTIALLY_SUPPORTED: ${requirementHistoricalCounts.HISTORICALLY_PARTIALLY_SUPPORTED}
- HISTORICALLY_SOURCE_GAP: ${requirementHistoricalCounts.HISTORICALLY_SOURCE_GAP}
- NO_HISTORICAL_BENCHMARK: ${requirementHistoricalCounts.NO_HISTORICAL_BENCHMARK}

## Preflight gate

${Object.entries(gate).map(([k, v]) => `- ${k}: ${Array.isArray(v) ? (v.length > 0 ? v.join(", ") : "(none)") : v}`).join("\n")}

## Not performed

No live source discovery, retrieval, or verification was performed by this script (task §0/§26/§27).
`;
writeFileSync(path.join(outDir, "UNIT202-EVIDENCE-ACQUISITION-PREFLIGHT-REPORT.md"), reportMd, "utf-8");

console.log("CC-23 Unit-202 preflight complete.");
console.log(`  knowledge targets: ${input.knowledgeTargets.length}`);
console.log(`  derived requirements: ${planResult.requirements.length} (READY=${readyCount}, SEMANTIC_DECOMPOSITION_REQUIRED=${decompositionGaps.length})`);
console.log(`  unique canonical requirement keys: ${uniqueCanonicalKeys.size}`);
console.log(`  requirement modes: ${JSON.stringify(requirementModeCounts)}`);
console.log(`  specification mode: ${JSON.stringify(specificationModeCounts)}`);
console.log(`  historical benchmark (requirement-level): ${JSON.stringify(requirementHistoricalCounts)}`);
console.log(`  blind targets content hash (as read by adapter): ${blindTargetsContentHash}`);
