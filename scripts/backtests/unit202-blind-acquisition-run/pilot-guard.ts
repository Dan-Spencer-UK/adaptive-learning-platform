/**
 * CC-24 §2/§6: the concrete, machine-evaluable `LocalAccessGuardConfig`
 * for the blind acquisition pilot. Positive allowlist, default deny (task
 * §15 of CC-23, carried forward unchanged) -- extended ONLY as needed for:
 *   - the frozen blind acquisition target manifest (exact path, hash-pinned);
 *   - the answer-free Unit-202 adapter + generic planner code;
 *   - the pilot harness's own source code;
 *   - the clean plan / sample-selection manifest this run generates,
 *     hash-pinned AFTER generation (never a broad glob over historical
 *     reconciliation output -- those live in a completely different
 *     directory this config never references);
 *   - the pilot's own output directory.
 *
 * No historical or learner-content directory is allowed by broad glob, or
 * at all -- `scripts/backtests/unit202-reconciliation/**`,
 * `reports/backtests/unit202-evidence-acquisition-benchmark/UNIT202-
 * HISTORICAL-ACQUISITION-BENCHMARK.json`,
 * `reports/backtests/unit202-evidence-acquisition-preflight/UNIT202-
 * EVIDENCE-REQUIREMENT-BENCHMARK.json`, cleanroom/post-hardening output,
 * and legacy lesson/assertion/visual material are never named here.
 */
import { LocalAccessGuard, hashContent, type AllowedLocalInput, type LocalAccessGuardConfig } from "@alp/technical-evidence-engine";

/** Run-selection: which pilot run's own output directory this guard allows read-back of. Defaults to "pilot-001" so any existing caller that does not set PILOT_ID is unaffected; a pilot-002 run sets PILOT_ID=pilot-002 to target its own directory without ever widening the allowlist to pilot-001's. */
const PILOT_ID = process.env.PILOT_ID ?? "pilot-001";
export const PILOT_OUTPUT_DIR_RELATIVE = `reports/backtests/unit202-blind-acquisition-run/${PILOT_ID}`;
export const BLIND_TARGETS_RELATIVE_PATH = "reports/backtests/unit202-evidence-acquisition-benchmark/UNIT202-BLIND-ACQUISITION-TARGETS.json";
export const FROZEN_BLIND_TARGETS_HASH = "3052aede77b472247fbdf7a9e04d62adb2e98bba3a2896dacd610267e4a754b4";

/**
 * PA-review correction §1: the Project Architect's own qualification-
 * depth decision (CC-24-PA-DEPTH-001) is legitimate acquisition input --
 * a floor/ceiling on depth for the 15 pilot-selected requirements, not
 * learner content or scope. Allowlisted by EXACT hash of this one
 * stable, committed file -- never a broad directory glob -- so a future
 * edit to this file (a new decision revision) must also update this
 * hash deliberately, rather than silently continuing to be trusted.
 */
export const PA_DEPTH_DECISION_RELATIVE_PATH = "reports/backtests/unit202-blind-acquisition-run/CC-24-PILOT-002-PA-DEPTH-DECISION.json";
export const PA_DEPTH_DECISION_HASH = "ad59d1d43c017166c1311e93ac6a26e8dc1cf3450c715c514c1413fb96d8059e";

export interface PilotGuardExtras {
  /** The clean plan file's content, once written, so its rule can be hash-pinned to the EXACT bytes this run generated -- never a broad unpinned glob. */
  readonly cleanPlanContent?: string;
  /** The frozen sample-selection manifest's content, once written, hash-pinned the same way. */
  readonly selectionManifestContent?: string;
}

/** Builds the pilot's allowlist. `extras` lets the caller hash-pin the clean-plan/selection files AFTER they are generated (task §2: "the exact clean plan/sample manifest, hash-pinned after generation"). */
export function buildPilotGuardConfig(extras: PilotGuardExtras = {}): LocalAccessGuardConfig {
  const allowedInputs: AllowedLocalInput[] = [
    { rule: "FROZEN_BLIND_TARGET_MANIFEST", matchKind: "EXACT_PATH", pathOrGlob: BLIND_TARGETS_RELATIVE_PATH, requiredHash: FROZEN_BLIND_TARGETS_HASH, note: "The one frozen learner-target input, pinned to its accepted hash." },
    { rule: "GENERIC_TECHNICAL_EVIDENCE_ENGINE_CODE", matchKind: "GLOB", pathOrGlob: "packages/technical-evidence-engine/**", note: "Generic planner/access-guard code -- never Unit-202-specific data." },
    { rule: "UNIT202_ANSWER_FREE_ADAPTER", matchKind: "GLOB", pathOrGlob: "scripts/backtests/unit202-evidence-acquisition-preflight/unit202-adapter.ts", note: "The answer-free Unit-202 adapter -- the only Unit-202-specific code this pilot may read." },
    { rule: "PILOT_HARNESS_CODE", matchKind: "GLOB", pathOrGlob: "scripts/backtests/unit202-blind-acquisition-run/**", note: "The pilot harness's own source code." },
    { rule: "PILOT_OUTPUT_DIRECTORY", matchKind: "GLOB", pathOrGlob: `${PILOT_OUTPUT_DIR_RELATIVE}/**`, note: "The pilot's own output directory -- read-back of its own already-written artefacts only." },
    { rule: "PA_DEPTH_DECISION", matchKind: "EXACT_PATH", pathOrGlob: PA_DEPTH_DECISION_RELATIVE_PATH, requiredHash: PA_DEPTH_DECISION_HASH, note: "The Project Architect's own qualification-depth decision (CC-24-PA-DEPTH-001) -- a floor/ceiling on acquisition depth, allowlisted by exact hash of this one stable file, never a broad directory glob." },
  ];

  if (extras.cleanPlanContent !== undefined) {
    allowedInputs.push({
      rule: "PILOT_CLEAN_PLAN",
      matchKind: "EXACT_PATH",
      pathOrGlob: `${PILOT_OUTPUT_DIR_RELATIVE}/PILOT-CLEAN-PLAN.json`,
      requiredHash: hashContent(extras.cleanPlanContent),
      note: "This run's own generated clean plan, hash-pinned to the exact bytes generated this run.",
    });
  }
  if (extras.selectionManifestContent !== undefined) {
    allowedInputs.push({
      rule: "PILOT_SELECTION_MANIFEST",
      matchKind: "EXACT_PATH",
      pathOrGlob: `${PILOT_OUTPUT_DIR_RELATIVE}/PILOT-SELECTION.json`,
      requiredHash: hashContent(extras.selectionManifestContent),
      note: "This run's own frozen 15-requirement selection, hash-pinned to the exact bytes generated this run.",
    });
  }

  return { experimentId: `unit202-blind-acquisition-${PILOT_ID}`, allowedInputs };
}

export function createPilotGuard(repoRoot: string, extras: PilotGuardExtras = {}): LocalAccessGuard {
  return new LocalAccessGuard(buildPilotGuardConfig(extras), repoRoot);
}
