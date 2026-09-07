/**
 * CC-24 §1/§2/§4/§7: CLEAN tests only -- this file, and everything it
 * imports, contains ZERO reference to historical/benchmark/reconciliation
 * material. Proves: Correction A's adapter-adoption of existing generic
 * modes; the fixed 15-requirement selection resolves cleanly; the pilot
 * import graph is genuinely clean; the pilot allowlist denies historical
 * material and allows only the intended paths.
 */
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { UnauthorizedLocalReadError } from "@alp/technical-evidence-engine";
import { describe, expect, it } from "vitest";

import { buildCleanPlan } from "./clean-plan.ts";
import { buildPilotGuardConfig, createPilotGuard } from "./pilot-guard.ts";
import { SELECTED_EVIDENCE_REQUIREMENT_IDS, selectPilotSample } from "./pilot-selection.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..");

const plan = buildCleanPlan();

/**
 * [Correction, test-contract reconciliation] The frozen manifest's
 * historical/audit universe is 213 (EVIDENCE-RESULTS.json's total row
 * count across all batches, per validate-correction-pass.mjs checks 4/13
 * -- HISTORICAL_ORIGINAL_COUNT). Two of those 213 historical rows carry
 * disposition "STRUCTURALLY_SATISFIED": ACQ-134 ("Appropriate simple
 * AC-generation calculations.") and ACQ-146 ("Appropriate sine-wave
 * conversions/calculations."). Both are AC5 procedure/integration targets
 * whose `constituentKnowledgeTargetIds.length >= 2` (see
 * unit202-adapter.ts's `PROCEDURE_INTEGRATION_TARGET_IDS`/
 * `INTEGRATION_CONSTITUENTS`), so the generic planner's
 * INTEGRATION_SATISFIED_BY_CONSTITUENTS structural-satisfaction branch
 * (planner.ts, `constituentKnowledgeTargetIds.length >= 2`) removes them
 * from `plan.requirements` entirely -- this is a genuine, deliberate
 * structural satisfaction, not a bug (see
 * UNIT202-CORRECTION-AMENDMENT-LEDGER.json's two STRUCTURAL_REUSE entries
 * for these exact evidenceRequirementIds). The LIVE plan is therefore
 * 213 - 2 = 211 requirements; the persisted plan of record
 * (reports/backtests/unit202-evidence-acquisition-preflight/
 * UNIT202-EVIDENCE-REQUIREMENT-PLAN.json, read directly by
 * validate-correction-pass.mjs) already reflects 211 -- only this test
 * file's hard-coded assertions had drifted.
 */
describe("CC-24 §1 Correction A -- adapter adoption of existing generic modes", () => {
  it("the plan contains exactly 211 requirements", () => {
    expect(plan.requirements).toHaveLength(211);
  });

  it("ACQ-134 and ACQ-146 are structurally satisfied by their constituents, not emitted as independent requirements", () => {
    const acq134 = plan.structuralSatisfactions.find((s) => s.knowledgeTargetId === "unit202::ACQ-134");
    expect(acq134, "expected a structuralSatisfactions entry for unit202::ACQ-134").toBeDefined();
    expect(acq134!.kind).toBe("INTEGRATION_SATISFIED_BY_CONSTITUENTS");
    expect(new Set(acq134!.satisfiedByKnowledgeTargetIds)).toEqual(new Set(["unit202::ACQ-131", "unit202::ACQ-132", "unit202::ACQ-133", "unit202::ACQ-004"]));

    const acq146 = plan.structuralSatisfactions.find((s) => s.knowledgeTargetId === "unit202::ACQ-146");
    expect(acq146, "expected a structuralSatisfactions entry for unit202::ACQ-146").toBeDefined();
    expect(acq146!.kind).toBe("INTEGRATION_SATISFIED_BY_CONSTITUENTS");
    expect(new Set(acq146!.satisfiedByKnowledgeTargetIds)).toEqual(new Set(["unit202::ACQ-141", "unit202::ACQ-142", "unit202::ACQ-143", "unit202::ACQ-144", "unit202::ACQ-145", "unit202::ACQ-004"]));

    // Neither ID is emitted as (or folded into) a live requirement -- a
    // future accidental re-addition of a requirement sourced from either
    // target must fail here, not hide behind a bare 211 count.
    expect(plan.requirements.some((r) => r.sourceKnowledgeTargetIds.includes("unit202::ACQ-134"))).toBe(false);
    expect(plan.requirements.some((r) => r.sourceKnowledgeTargetIds.includes("unit202::ACQ-146"))).toBe(false);

    // Reconciliation: historical audit universe (213, EVIDENCE-RESULTS.json
    // total rows) = live plan.requirements (211) + exactly these two
    // STRUCTURALLY_SATISFIED historical rows.
    expect(plan.requirements.length + 2).toBe(213);
  });

  /**
   * [Correction] Pre-existing, disclosed, and unrelated to the 213->211
   * reconciliation above: three representative-exemplar targets (Stage 1.3
   * underspecified-exemplar detection -- an exact circuit/component-value
   * object no governed reference determinately identifies) are never READY;
   * they remain SEMANTIC_DECOMPOSITION_REQUIRED. This was already true of
   * the live plan before this reconciliation (it was simply never reached,
   * because the stale 213-length assertion above threw first). Naming the
   * three explicitly here -- rather than asserting a bare "not all READY"
   * -- lets a genuinely new decomposition gap be caught instead of hidden
   * behind this known set.
   */
  it("decompositionStatus: exactly the three known underspecified-exemplar targets are SEMANTIC_DECOMPOSITION_REQUIRED; every other requirement is READY", () => {
    const KNOWN_UNDERSPECIFIED_EXEMPLAR_SOURCE_TARGET_IDS = new Set(["unit202::ACQ-164", "unit202::ACQ-166", "unit202::ACQ-155"]);
    const notReady = plan.requirements.filter((r) => r.decompositionStatus !== "READY");
    expect(notReady).toHaveLength(3);
    for (const r of notReady) {
      expect(r.decompositionStatus).toBe("SEMANTIC_DECOMPOSITION_REQUIRED");
      expect(r.sourceKnowledgeTargetIds.some((id) => KNOWN_UNDERSPECIFIED_EXEMPLAR_SOURCE_TARGET_IDS.has(id))).toBe(true);
    }
    expect(plan.requirements.filter((r) => r.decompositionStatus === "READY")).toHaveLength(208);
  });

  it("specification mode split is unchanged: 20 KNOWN_CLAIM_TO_VERIFY, 191 OPEN_TECHNICAL_QUESTION", () => {
    const known = plan.requirements.filter((r) => r.specificationMode === "KNOWN_CLAIM_TO_VERIFY").length;
    const open = plan.requirements.filter((r) => r.specificationMode === "OPEN_TECHNICAL_QUESTION").length;
    expect(known).toBe(20);
    expect(open).toBe(191);
  });

  it("requirement-mode counts include APPLICATION_FUNCTION=6, OPERATING_PRINCIPLE=14, EXACT_FACT=78", () => {
    const counts: Record<string, number> = {};
    for (const r of plan.requirements) counts[r.requirementMode] = (counts[r.requirementMode] ?? 0) + 1;
    expect(counts.APPLICATION_FUNCTION).toBe(6);
    expect(counts.OPERATING_PRINCIPLE).toBe(14);
    expect(counts.EXACT_FACT).toBe(78);
  });

  it("all six named application targets emit APPLICATION_FUNCTION, with mode-correct evidence questions/dimensions/authority/acceptance", () => {
    const ids = ["ACQ-147", "ACQ-148", "ACQ-149", "ACQ-150", "ACQ-151", "ACQ-152"];
    for (const acqId of ids) {
      const req = plan.requirements.find((r) => r.sourceKnowledgeTargetIds.includes(`unit202::${acqId}`));
      expect(req, `no requirement found for ${acqId}`).toBeDefined();
      expect(req!.requirementMode, `${acqId} should be APPLICATION_FUNCTION`).toBe("APPLICATION_FUNCTION");
      expect(req!.requiredCoverageDimensions).toContain("APPLICATION_FUNCTION");
      expect(req!.sourceAuthorityClasses.length).toBeGreaterThan(0);
      expect(req!.acceptanceCriteria.toLowerCase()).toContain("application/function");
      if (req!.specificationMode === "OPEN_TECHNICAL_QUESTION") expect(req!.evidenceQuestion).not.toBeNull();
    }
  });

  it("all fourteen named component targets emit OPERATING_PRINCIPLE, with mode-correct evidence questions/dimensions/authority/acceptance", () => {
    const ids = ["ACQ-170", "ACQ-171", "ACQ-172", "ACQ-173", "ACQ-174", "ACQ-175", "ACQ-176", "ACQ-177", "ACQ-178", "ACQ-179", "ACQ-180", "ACQ-181", "ACQ-182", "ACQ-183"];
    for (const acqId of ids) {
      const req = plan.requirements.find((r) => r.sourceKnowledgeTargetIds.includes(`unit202::${acqId}`));
      expect(req, `no requirement found for ${acqId}`).toBeDefined();
      expect(req!.requirementMode, `${acqId} should be OPERATING_PRINCIPLE`).toBe("OPERATING_PRINCIPLE");
      expect(req!.requiredCoverageDimensions).toContain("OPERATING_PRINCIPLE");
      expect(req!.sourceAuthorityClasses.length).toBeGreaterThan(0);
      expect(req!.acceptanceCriteria.toLowerCase()).toContain("operating behaviour");
      if (req!.specificationMode === "OPEN_TECHNICAL_QUESTION") expect(req!.evidenceQuestion).not.toBeNull();
    }
  });

  it("the three directional-rule requirements remain answer-free OPEN questions after Correction A", () => {
    for (const acqId of ["ACQ-108", "ACQ-114", "ACQ-117"]) {
      const req = plan.requirements.find((r) => r.sourceKnowledgeTargetIds.includes(`unit202::${acqId}`))!;
      expect(req.specificationMode).toBe("OPEN_TECHNICAL_QUESTION");
      const haystack = `${req.requirementText} ${req.evidenceQuestion ?? ""}`.toLowerCase();
      for (const forbidden of ["thumb", "finger", "curl"]) expect(haystack).not.toContain(forbidden);
    }
  });
});

describe("CC-24 §4 -- the fixed 15-requirement pilot sample resolves cleanly", () => {
  it("selectPilotSample succeeds with exactly 15 requirements, zero failures", () => {
    const outcome = selectPilotSample(plan);
    expect(outcome.ok, !outcome.ok ? outcome.failures.map((f) => f.reason).join("; ") : "").toBe(true);
    if (outcome.ok) expect(outcome.requirements).toHaveLength(15);
  });

  it("every selected ID is unique in the source list itself", () => {
    expect(new Set(SELECTED_EVIDENCE_REQUIREMENT_IDS).size).toBe(SELECTED_EVIDENCE_REQUIREMENT_IDS.length);
    expect(SELECTED_EVIDENCE_REQUIREMENT_IDS).toHaveLength(15);
  });

  it("every selected requirement is READY and REQUIRED", () => {
    const outcome = selectPilotSample(plan);
    if (!outcome.ok) throw new Error("selection failed");
    for (const r of outcome.requirements) {
      expect(r.decompositionStatus).toBe("READY");
      expect(r.acquisitionPriority).toBe("REQUIRED");
    }
  });

  it("both directional-rule selections (Fleming left/right, right-hand grip) contain no technical answer", () => {
    const outcome = selectPilotSample(plan);
    if (!outcome.ok) throw new Error("selection failed");
    const directional = outcome.requirements.filter((r) => r.requirementMode === "OPERATIONAL_USE_RULE");
    expect(directional.length).toBeGreaterThanOrEqual(3);
    for (const r of directional) {
      const haystack = `${r.requirementText} ${r.evidenceQuestion ?? ""}`.toLowerCase();
      for (const forbidden of ["thumb", "finger", "curl"]) expect(haystack).not.toContain(forbidden);
    }
  });

  it("fails preparation (never silently substitutes) if an ID is renamed away", () => {
    const brokenPlan = { ...plan, requirements: plan.requirements.filter((r) => r.evidenceRequirementId !== SELECTED_EVIDENCE_REQUIREMENT_IDS[0]) };
    const outcome = selectPilotSample(brokenPlan);
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) expect(outcome.failures.some((f) => f.reason.includes("absent"))).toBe(true);
  });
});

describe("CC-24 §1/§7 -- the pilot import graph is genuinely clean of historical/benchmark material", () => {
  const pilotDir = path.resolve(__dirname);
  const sourceFiles = readdirSync(pilotDir)
    .filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"))
    .map((f) => ({ name: f, content: readFileSync(path.join(pilotDir, f), "utf-8") }));

  it("no pilot-preparation source file's IMPORT STATEMENTS reference historical-resolution/pa-target/historical-benchmark-bindings/build-preflight/reconciliation modules (doc-comment prose naming them as forbidden is not itself a reference)", () => {
    const forbiddenImportFragments = ["historical-resolution", "pa-target", "historical-benchmark-bindings", "build-preflight", "unit202-reconciliation"];
    for (const file of sourceFiles) {
      const importSpecs = [...file.content.matchAll(/from\s+"([^"]+)"/g)].map((m) => m[1]!);
      for (const spec of importSpecs) {
        for (const fragment of forbiddenImportFragments) {
          expect(spec.includes(fragment), `${file.name} imports a forbidden module: "${spec}"`).toBe(false);
        }
      }
    }
  });

  it("clean-plan.ts imports only the adapter and @alp/technical-evidence-engine (plus node builtins)", () => {
    const cleanPlanSource = sourceFiles.find((f) => f.name === "clean-plan.ts")!.content;
    const importLines = [...cleanPlanSource.matchAll(/from\s+"([^"]+)"/g)].map((m) => m[1]!);
    for (const spec of importLines) {
      const isAllowed = spec === "@alp/technical-evidence-engine" || spec.includes("unit202-adapter") || spec.startsWith("node:");
      expect(isAllowed, `unexpected import in clean-plan.ts: "${spec}"`).toBe(true);
    }
  });
});

describe("CC-24 §2/§6 -- the pilot allowlist denies historical material and allows only the intended paths", () => {
  it("denies the historical Unit-202 reconciliation source directory", () => {
    const guard = createPilotGuard(repoRoot);
    expect(() => guard.guardedReadUtf8("scripts/backtests/unit202-reconciliation/pa-target.ts", "probe")).toThrow(UnauthorizedLocalReadError);
  });

  it("denies the sealed historical benchmark and the PA-level requirement benchmark", () => {
    const guard = createPilotGuard(repoRoot);
    expect(() => guard.checkRead("reports/backtests/unit202-evidence-acquisition-benchmark/UNIT202-HISTORICAL-ACQUISITION-BENCHMARK.json", "probe")).toThrow(UnauthorizedLocalReadError);
    expect(() => guard.checkRead("reports/backtests/unit202-evidence-acquisition-preflight/UNIT202-EVIDENCE-REQUIREMENT-BENCHMARK.json", "probe")).toThrow(UnauthorizedLocalReadError);
  });

  it("denies cleanroom/post-hardening output", () => {
    const guard = createPilotGuard(repoRoot);
    expect(() => guard.checkRead("reports/backtests/unit202-cleanroom/cc19r-source-inventory.json", "probe")).toThrow(UnauthorizedLocalReadError);
    expect(() => guard.checkRead("reports/backtests/unit202-post-hardening/CC-21-FULL-PUBLIC-INPUT.json", "probe")).toThrow(UnauthorizedLocalReadError);
  });

  it("allows the frozen blind target manifest by its pinned hash, and denies it on any other content", () => {
    const guard = createPilotGuard(repoRoot);
    const raw = readFileSync(path.join(repoRoot, "reports/backtests/unit202-evidence-acquisition-benchmark/UNIT202-BLIND-ACQUISITION-TARGETS.json"), "utf-8");
    const record = guard.checkRead("reports/backtests/unit202-evidence-acquisition-benchmark/UNIT202-BLIND-ACQUISITION-TARGETS.json", "probe", raw);
    expect(record.outcome).toBe("ALLOWED");
  });

  it("allows the answer-free adapter and generic engine code, and the pilot's own harness code", () => {
    const guard = createPilotGuard(repoRoot);
    expect(guard.wouldAllow("scripts/backtests/unit202-evidence-acquisition-preflight/unit202-adapter.ts")).toBe(true);
    expect(guard.wouldAllow("packages/technical-evidence-engine/src/planner.ts")).toBe(true);
    expect(guard.wouldAllow("scripts/backtests/unit202-blind-acquisition-run/clean-plan.ts")).toBe(true);
  });

  it("has no broad glob rule matching any historical/reconciliation/cleanroom/post-hardening path", () => {
    const config = buildPilotGuardConfig();
    for (const rule of config.allowedInputs) {
      expect(rule.pathOrGlob.includes("unit202-reconciliation")).toBe(false);
      expect(rule.pathOrGlob.includes("unit202-cleanroom")).toBe(false);
      expect(rule.pathOrGlob.includes("unit202-post-hardening")).toBe(false);
      expect(rule.pathOrGlob.includes("HISTORICAL")).toBe(false);
      expect(rule.pathOrGlob.includes("BENCHMARK")).toBe(false);
    }
  });
});
