/**
 * CC-05D: mechanically proves that
 * apps/mobile/src/lib/visual-governance/canonical-variants-fixture.ts (the
 * mobile render-capture step's governed-content mirror -- see that
 * file's header for why apps/mobile cannot import
 * scripts/visual-governance directly) has not drifted from the real
 * canonical-variant builders. This is content-authoring tooling
 * (scripts/visual-governance), which is allowed to import both the real
 * builders and the mobile fixture to cross-check them -- the dependency
 * direction this guards is the other one: apps/mobile must never import
 * scripts/visual-governance. Mirrors the exact same pattern
 * scripts/content/check-cc05c-proving-fixture.test.ts already
 * established for CC-05C's governed content.
 */
import { describe, expect, it } from "vitest";
import { visualSemanticContracts } from "./data/cc05d-visual-contracts-unit202.ts";
import {
  CANONICAL_VARIANT_BUILDERS,
  motorForceVariants,
  parallelCircuitVariants,
  rightHandGripRuleVariants,
  seriesCircuitVariants,
} from "./data/canonical-variants.ts";
import { CANONICAL_VARIANTS as MOBILE_FIXTURE } from "../../apps/mobile/src/lib/visual-governance/canonical-variants-fixture.ts";

describe("apps/mobile canonical-variants fixture matches the real builders", () => {
  const realVariants = visualSemanticContracts.flatMap((contract) => {
    const builder = CANONICAL_VARIANT_BUILDERS[contract.diagramBlueprintId];
    if (!builder) throw new Error(`no builder registered for ${contract.diagramBlueprintId}`);
    return builder(contract.id, contract.version);
  });

  it("has exactly the same number of variants as the real builders produce", () => {
    expect(MOBILE_FIXTURE).toHaveLength(realVariants.length);
  });

  it("every real variant appears in the mobile fixture, byte-for-byte identical", () => {
    const fixtureById = new Map(MOBILE_FIXTURE.map((v) => [v.variantId, v]));
    for (const real of realVariants) {
      const mirrored = fixtureById.get(real.variantId);
      expect(mirrored, `mobile fixture is missing variant ${real.variantId}`).toBeDefined();
      expect(mirrored).toEqual(real);
    }
  });

  it("the mobile fixture contains no variant the real builders no longer produce", () => {
    const realIds = new Set(realVariants.map((v) => v.variantId));
    const extra = MOBILE_FIXTURE.filter((v) => !realIds.has(v.variantId));
    expect(extra.map((v) => v.variantId)).toEqual([]);
  });

  it("individually cross-checks each builder family (series/parallel/grip-rule/motor-force) for a clearer failure message if one family drifts", () => {
    const series = seriesCircuitVariants("visual-contract.series-circuit-current-direction", 1);
    const parallel = parallelCircuitVariants("visual-contract.parallel-circuit-branches", 1);
    const gripRule = rightHandGripRuleVariants("visual-contract.right-hand-grip-rule", 1);
    const motor = motorForceVariants("visual-contract.motor-principle-force", 1);
    const fixtureById = new Map(MOBILE_FIXTURE.map((v) => [v.variantId, v]));

    for (const v of [...series, ...parallel, ...gripRule, ...motor]) {
      expect(fixtureById.get(v.variantId)).toEqual(v);
    }
  });
});
