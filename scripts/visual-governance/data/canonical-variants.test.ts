import { describe, expect, it } from "vitest";
import { canonicalVariantSchema } from "@alp/content-schema";
import {
  seriesCircuitVariants,
  parallelCircuitVariants,
  rightHandGripRuleVariants,
  motorForceVariants,
  CANONICAL_VARIANT_BUILDERS,
} from "./canonical-variants.ts";

describe("seriesCircuitVariants", () => {
  const variants = seriesCircuitVariants("visual-contract.series-circuit-current-direction", 1);

  it("produces exactly one variant per pedagogically distinct component_count", () => {
    expect(variants.map((v) => v.parameters.component_count)).toEqual([2, 3, 4]);
  });

  it("every variant validates against the schema", () => {
    for (const v of variants) expect(canonicalVariantSchema.safeParse(v).success).toBe(true);
  });

  it("produces R1..Rn labels matching component_count", () => {
    const three = variants.find((v) => v.parameters.component_count === 3)!;
    expect(three.labels).toEqual(["R1", "R2", "R3"]);
  });

  it("has no revealProps -- this diagram type never withholds/reveals an answer element", () => {
    for (const v of variants) expect(v.revealProps).toEqual({});
  });

  it("produces stable, deterministic variant ids across repeated calls", () => {
    const again = seriesCircuitVariants("visual-contract.series-circuit-current-direction", 1);
    expect(again.map((v) => v.variantId)).toEqual(variants.map((v) => v.variantId));
  });
});

describe("parallelCircuitVariants", () => {
  const variants = parallelCircuitVariants("visual-contract.parallel-circuit-branches", 1);

  it("produces exactly one variant per pedagogically distinct branch_count", () => {
    expect(variants.map((v) => v.parameters.branch_count)).toEqual([2, 3, 4]);
  });
});

describe("rightHandGripRuleVariants", () => {
  const variants = rightHandGripRuleVariants("visual-contract.right-hand-grip-rule", 1);

  it("covers exactly the two engine-reachable current directions, each in both modes (4 total)", () => {
    expect(variants).toHaveLength(4);
    const directions = new Set(variants.map((v) => v.parameters.current_direction));
    expect(directions).toEqual(new Set(["into_page", "out_of_page"]));
  });

  it("never includes 'left_to_right' -- the documented CC-05B scoping exclusion", () => {
    expect(variants.some((v) => v.parameters.current_direction === "left_to_right")).toBe(false);
  });

  it("reveals field_rotation only in teaching mode, never in assessment mode", () => {
    for (const v of variants) {
      if (v.mode === "teaching") {
        expect(v.revealProps.field_rotation).toBeDefined();
      } else {
        expect(v.revealProps).toEqual({});
      }
    }
  });

  it("derives field_rotation from current_direction via the right-hand grip rule, matching the engine's own lookup table", () => {
    const intoPageTeaching = variants.find((v) => v.parameters.current_direction === "into_page" && v.mode === "teaching")!;
    const outOfPageTeaching = variants.find((v) => v.parameters.current_direction === "out_of_page" && v.mode === "teaching")!;
    expect(intoPageTeaching.revealProps.field_rotation).toBe("clockwise");
    expect(outOfPageTeaching.revealProps.field_rotation).toBe("counterclockwise");
  });
});

describe("motorForceVariants", () => {
  const variants = motorForceVariants("visual-contract.motor-principle-force", 1);

  it("covers the full 2x2 pole/current grid, each in both modes (8 total)", () => {
    expect(variants).toHaveLength(8);
  });

  it("reveals force_direction only in teaching mode", () => {
    for (const v of variants) {
      if (v.mode === "teaching") expect(v.revealProps.force_direction).toBeDefined();
      else expect(v.revealProps).toEqual({});
    }
  });

  it("force direction is always perpendicular to the field direction (motor principle), never parallel to it", () => {
    // N_S_horizontal => field is horizontal => force must be vertical (up/down), never left/right.
    const horizontal = variants.filter((v) => v.parameters.pole_labels === "N_S_horizontal" && v.mode === "teaching");
    for (const v of horizontal) expect(["up", "down"]).toContain(v.revealProps.force_direction);
    // N_S_vertical => field is vertical => force must be horizontal (left/right), never up/down.
    const vertical = variants.filter((v) => v.parameters.pole_labels === "N_S_vertical" && v.mode === "teaching");
    for (const v of vertical) expect(["left", "right"]).toContain(v.revealProps.force_direction);
  });
});

describe("CANONICAL_VARIANT_BUILDERS", () => {
  it("has exactly one entry per rendered diagram blueprint", () => {
    expect(Object.keys(CANONICAL_VARIANT_BUILDERS).sort()).toEqual(
      ["circuit.parallel_resistors", "circuit.series_resistors", "magnetic.field_conductor_direction", "motor.force_field_current"].sort(),
    );
  });
});
