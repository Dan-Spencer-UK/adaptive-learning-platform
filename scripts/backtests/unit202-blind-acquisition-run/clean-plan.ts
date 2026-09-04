/**
 * CC-24 §1: the CLEAN pilot-preparation path. Imports ONLY:
 *   - the frozen blind acquisition target manifest (via unit202-adapter.ts,
 *     read through a real, guarded, hash-verifiable filesystem read);
 *   - the answer-free Unit-202 adapter itself
 *     (scripts/backtests/unit202-evidence-acquisition-preflight/unit202-adapter.ts);
 *   - @alp/technical-evidence-engine.
 *
 * It deliberately imports NOTHING from scripts/backtests/unit202-
 * reconciliation/ (historical-resolution.ts, pa-target.ts, historical-
 * benchmark-bindings.ts, build-benchmark.ts) and NOTHING from
 * build-preflight.ts (which pulls in that historical-comparison
 * machinery). This is mechanically proven by a dedicated source-scan test
 * in clean-plan.test.ts -- never merely asserted in a comment.
 *
 * This is the ONLY plan-generation path the CC-24 pilot may use. Running
 * scripts/backtests/unit202-evidence-acquisition-preflight/build-preflight.ts
 * (which imports the historical benchmark) is explicitly out of scope for
 * pilot preparation (task §1).
 */
import { planEvidenceRequirements, type KnowledgeEvidencePlanResult } from "@alp/technical-evidence-engine";

import { buildUnit202PlanningInput } from "../unit202-evidence-acquisition-preflight/unit202-adapter.ts";

/**
 * Builds the full 213-row generic evidence-requirement plan from the
 * frozen Unit-202 target, with zero historical/benchmark data anywhere
 * on the import path.
 *
 * [Corrected] This function previously applied a post-planning authority-
 * policy patch here, on the pilot path only. The Unit-202 directional-
 * rule authority-policy correction (PA review of pilot-001, requirement
 * 6) is now CANONICAL -- `buildUnit202PlanningInput().input.sourceAuthorityPolicy`
 * already carries `UNIT202_SOURCE_AUTHORITY_POLICY`, so a plain
 * `planEvidenceRequirements(input)` call, exactly like any other caller
 * of the adapter (including `build-preflight.ts`) would make, already
 * produces the corrected `sourceAuthorityClasses` -- no pilot-specific
 * post-processing step remains.
 */
export function buildCleanPlan(): KnowledgeEvidencePlanResult {
  const { input } = buildUnit202PlanningInput();
  return planEvidenceRequirements(input);
}
