/**
 * CC-05D: deterministic canonical semantic-variant enumeration for the
 * pilot instructional visuals. Design authority: docs/architecture/
 * CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-AND-SEMANTIC-QA.md §C.
 *
 * This file enumerates every PEDAGOGICALLY DISTINCT parameter combination
 * per governed diagram blueprint -- never arbitrary numeric permutations,
 * never every enum value the raw DiagramBlueprint schema *allows* if the
 * engine itself deliberately never produces some of them.
 *
 * `magnetic.field_conductor_direction`'s `current_direction` parameter is
 * a documented example: the DiagramBlueprint allows "left_to_right" as a
 * parameter value, but packages/calculation-engine/src/families/
 * magnetism.ts deliberately restricts real generation to
 * `into_page`/`out_of_page` (a documented CC-05B scoping decision, not a
 * defect -- see that file's header comment). Canonical variants below
 * follow the engine's real reachable set, not the blueprint's full
 * declared-but-partially-unreachable one, so this file never asserts
 * semantic coverage for an image the platform can never actually produce.
 */

import type { CanonicalVariant } from "@alp/content-schema";

function stableVariantId(contractId: string, contractVersion: number, parameters: Record<string, string | number | boolean>, mode: string): string {
  const sortedParams = Object.keys(parameters)
    .sort()
    .map((key) => `${key}=${parameters[key]}`)
    .join(",");
  return `${contractId}@${contractVersion}::${sortedParams}::${mode}`;
}

function labelsForComponentCount(prefix: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => `${prefix}${i + 1}`);
}

function variant(
  contractId: string,
  contractVersion: number,
  diagramBlueprintId: string,
  mode: CanonicalVariant["mode"],
  parameters: Record<string, string | number | boolean>,
  labels: string[],
  revealProps: Record<string, string | number | boolean> = {},
  seed?: number,
): CanonicalVariant {
  return {
    variantId: stableVariantId(contractId, contractVersion, { ...parameters, ...revealProps, mode }, mode),
    contractId,
    contractVersion,
    diagramBlueprintId,
    mode,
    parameters,
    labels,
    revealProps,
    seed,
  };
}

// ---------------------------------------------------------------------
// circuit.series_resistors -- component_count is the only semantically
// distinct dimension (show_values is always false under CC-05A's
// symbolic_only valueEmbedding policy; show_current_arrow is always true
// -- the current-arrow IS the thing under regression protection, so it
// is never varied away).
// ---------------------------------------------------------------------

export function seriesCircuitVariants(contractId: string, contractVersion: number): CanonicalVariant[] {
  return [2, 3, 4].map((count) =>
    variant(
      contractId,
      contractVersion,
      "circuit.series_resistors",
      "both",
      { component_count: count, show_values: false, show_current_arrow: true },
      labelsForComponentCount("R", count),
    ),
  );
}

// ---------------------------------------------------------------------
// circuit.parallel_resistors -- branch_count is the only semantically
// distinct dimension, for the same reason as above.
// ---------------------------------------------------------------------

export function parallelCircuitVariants(contractId: string, contractVersion: number): CanonicalVariant[] {
  return [2, 3, 4].map((count) =>
    variant(
      contractId,
      contractVersion,
      "circuit.parallel_resistors",
      "both",
      { branch_count: count, show_values: false, show_branch_current_arrows: true },
      labelsForComponentCount("R", count),
    ),
  );
}

// ---------------------------------------------------------------------
// magnetic.field_conductor_direction (right-hand grip rule) -- the two
// engine-reachable current directions, each in teaching mode (field
// rotation revealed) and assessment mode (withheld), since those are
// semantically different images (answer-disclosure differs), not merely
// different parameter values.
// ---------------------------------------------------------------------

const FIELD_ROTATION_BY_CURRENT_DIRECTION: Record<"into_page" | "out_of_page", "clockwise" | "counterclockwise"> = {
  into_page: "clockwise",
  out_of_page: "counterclockwise",
};

export function rightHandGripRuleVariants(contractId: string, contractVersion: number): CanonicalVariant[] {
  const directions: Array<"into_page" | "out_of_page"> = ["into_page", "out_of_page"];
  const modes: CanonicalVariant["mode"][] = ["teaching", "assessment"];
  const variants: CanonicalVariant[] = [];
  for (const direction of directions) {
    for (const mode of modes) {
      variants.push(
        variant(
          contractId,
          contractVersion,
          "magnetic.field_conductor_direction",
          mode,
          { current_direction: direction, show_field_arrows: true },
          ["conductor"],
          mode === "teaching" ? { field_rotation: FIELD_ROTATION_BY_CURRENT_DIRECTION[direction] } : {},
        ),
      );
    }
  }
  return variants;
}

// ---------------------------------------------------------------------
// motor.force_field_current (motor-principle force diagram) -- pole
// orientation x current direction is a real 2x2 semantic grid (each
// combination produces a genuinely different force direction), each in
// teaching mode (force revealed) and assessment mode (withheld).
// ---------------------------------------------------------------------

const FORCE_DIRECTION: Record<"N_S_horizontal" | "N_S_vertical", Record<"into_page" | "out_of_page", "up" | "down" | "left" | "right">> = {
  N_S_horizontal: { into_page: "down", out_of_page: "up" },
  N_S_vertical: { into_page: "left", out_of_page: "right" },
};

export function motorForceVariants(contractId: string, contractVersion: number): CanonicalVariant[] {
  const poleLabels: Array<"N_S_horizontal" | "N_S_vertical"> = ["N_S_horizontal", "N_S_vertical"];
  const directions: Array<"into_page" | "out_of_page"> = ["into_page", "out_of_page"];
  const modes: CanonicalVariant["mode"][] = ["teaching", "assessment"];
  const variants: CanonicalVariant[] = [];
  for (const poles of poleLabels) {
    for (const direction of directions) {
      for (const mode of modes) {
        variants.push(
          variant(
            contractId,
            contractVersion,
            "motor.force_field_current",
            mode,
            { pole_labels: poles, current_direction: direction, show_force_arrow: true },
            ["conductor"],
            mode === "teaching" ? { force_direction: FORCE_DIRECTION[poles][direction] } : {},
          ),
        );
      }
    }
  }
  return variants;
}

export const CANONICAL_VARIANT_BUILDERS: Record<string, (contractId: string, contractVersion: number) => CanonicalVariant[]> = {
  "circuit.series_resistors": seriesCircuitVariants,
  "circuit.parallel_resistors": parallelCircuitVariants,
  "magnetic.field_conductor_direction": rightHandGripRuleVariants,
  "motor.force_field_current": motorForceVariants,
};
