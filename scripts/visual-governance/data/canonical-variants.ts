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

// ---------------------------------------------------------------------
// circuit.series_parallel_mixed (CC-11 -- closes the CC-05D-tracked
// renderer gap) -- branch_arrangement is the only semantically distinct
// dimension; the diagram is always the GIVEN topology for its 3 real
// question blueprints (comparison.identify_topology/recognise_mixed_
// circuit/trace_current_path), never an answer-bearing element, so there
// is no teaching/assessment mode split here (mode "both", matching
// circuit.series_resistors/circuit.parallel_resistors above).
// ---------------------------------------------------------------------

export function seriesParallelMixedVariants(contractId: string, contractVersion: number): CanonicalVariant[] {
  return [
    variant(contractId, contractVersion, "circuit.series_parallel_mixed", "both", { branch_arrangement: "series_of_parallel", show_values: false }, ["R1", "R2", "R3"]),
    variant(contractId, contractVersion, "circuit.series_parallel_mixed", "both", { branch_arrangement: "parallel_of_series", show_values: false }, ["R1", "R2", "R3", "R4"]),
  ];
}

// ---------------------------------------------------------------------
// graph.waveform_sine (CC-11) -- the three boolean reference-line flags
// are the pedagogically distinct dimension (progressive reveal: none,
// peak only, peak+RMS, peak+RMS+period -- the order a teaching sequence
// would actually introduce them in), plus the two non-default
// `cycles_shown` values shown with every line on, since cycle count is a
// genuinely different picture, not a numeric permutation. `mode` is
// "both": per this blueprint's own valueEmbedding design (see
// WaveformSineDiagram.tsx's header comment), the component never embeds
// a numeric value regardless of context, so there is nothing for a
// reveal/withhold split to gate at the rendering layer.
// ---------------------------------------------------------------------

export function waveformSineVariants(contractId: string, contractVersion: number): CanonicalVariant[] {
  const lineProgression = [
    { show_peak_line: false, show_rms_line: false, show_period_marker: false },
    { show_peak_line: true, show_rms_line: false, show_period_marker: false },
    { show_peak_line: true, show_rms_line: true, show_period_marker: false },
    { show_peak_line: true, show_rms_line: true, show_period_marker: true },
  ];
  const variants = lineProgression.map((lines) =>
    variant(contractId, contractVersion, "graph.waveform_sine", "both", { ...lines, cycles_shown: 2 }, []),
  );
  for (const cycles of [1, 3]) {
    variants.push(
      variant(
        contractId,
        contractVersion,
        "graph.waveform_sine",
        "both",
        { show_peak_line: true, show_rms_line: true, show_period_marker: true, cycles_shown: cycles },
        [],
      ),
    );
  }
  return variants;
}

// ---------------------------------------------------------------------
// instrument.measurement_connection (CC-11) -- instrument_type x
// connection_style is a real semantic grid. Canonical variants cover
// every instrument's STANDARD connection (voltmeter/parallel,
// ammeter/series, ohmmeter/isolated) plus two deliberately NON-standard
// combinations (voltmeter/series, ammeter/parallel) -- InstrumentConnection
// Diagram.tsx's own design never silently endorses a miswiring (it always
// captions whether the shown combination is standard), so the catalogue
// should show both classes for QA review, not just the correct ones.
// mode "both": this is a "which combination is depicted" parameter, not
// a teaching/assessment reveal split (see check-visual-governance's
// contract knownAmbiguity for the one open question this raises for a
// future assessment-mode pairing).
// ---------------------------------------------------------------------

export function instrumentConnectionVariants(contractId: string, contractVersion: number): CanonicalVariant[] {
  const combinations: Array<{ instrument_type: string; connection_style: string }> = [
    { instrument_type: "voltmeter", connection_style: "parallel" },
    { instrument_type: "voltmeter", connection_style: "series" },
    { instrument_type: "ammeter", connection_style: "series" },
    { instrument_type: "ammeter", connection_style: "parallel" },
    // CC-11.3: "isolated" (not "series") -- the ohmmeter connection is
    // never meaningfully series/parallel; see the DiagramBlueprint's own
    // parameter comment in cc05a-pedagogy-unit202.ts.
    { instrument_type: "ohmmeter", connection_style: "isolated" },
  ];
  return combinations.map((c) => variant(contractId, contractVersion, "instrument.measurement_connection", "both", c, []));
}

// ---------------------------------------------------------------------
// CC-11.3: whole-course instructional visual coverage closeout.
// ---------------------------------------------------------------------

export function leverArrangementVariants(contractId: string, contractVersion: number): CanonicalVariant[] {
  const classes: Array<"class_1" | "class_2" | "class_3"> = ["class_1", "class_2", "class_3"];
  const variants: CanonicalVariant[] = [];
  for (const leverClass of classes) {
    for (const showDistances of [false, true]) {
      variants.push(variant(contractId, contractVersion, "mechanical.lever_arrangement", "both", { lever_class: leverClass, show_distances: showDistances }, []));
    }
  }
  return variants;
}

export function gearMeshVariants(contractId: string, contractVersion: number): CanonicalVariant[] {
  const ratios: Array<"driven_larger" | "driven_smaller" | "equal"> = ["driven_larger", "driven_smaller", "equal"];
  return ratios.map((size_ratio) => variant(contractId, contractVersion, "mechanical.gear_mesh", "both", { size_ratio }, []));
}

export function pulleyArrangementVariants(contractId: string, contractVersion: number): CanonicalVariant[] {
  const arrangements: Array<"fixed" | "movable"> = ["fixed", "movable"];
  return arrangements.map((arrangement) => variant(contractId, contractVersion, "mechanical.pulley_arrangement", "both", { arrangement }, []));
}

export function resistivityDimensionsVariants(contractId: string, contractVersion: number): CanonicalVariant[] {
  const comparisons: Array<"length" | "area"> = ["length", "area"];
  return comparisons.map((comparison) => variant(contractId, contractVersion, "mechanical.resistivity_dimensions", "both", { comparison }, []));
}

export function magneticPoleInteractionVariants(contractId: string, contractVersion: number): CanonicalVariant[] {
  const pairings: Array<"like_poles_facing" | "unlike_poles_facing"> = ["like_poles_facing", "unlike_poles_facing"];
  const modes: CanonicalVariant["mode"][] = ["teaching", "assessment"];
  const variants: CanonicalVariant[] = [];
  for (const pairing of pairings) {
    for (const mode of modes) {
      variants.push(
        variant(contractId, contractVersion, "magnetic.pole_interaction", mode, { pole_pairing: pairing }, [], mode === "teaching" ? { show_pole_force: true } : {}),
      );
    }
  }
  return variants;
}

export function magneticFluxVariants(contractId: string, contractVersion: number): CanonicalVariant[] {
  return [
    variant(contractId, contractVersion, "magnetic.flux_field_lines", "both", { density_comparison: false }, []),
    variant(contractId, contractVersion, "magnetic.flux_field_lines", "both", { density_comparison: true }, []),
  ];
}

export function motionalEmfVariants(contractId: string, contractVersion: number): CanonicalVariant[] {
  return [variant(contractId, contractVersion, "emf.motional_emf_geometry", "both", {}, ["conductor"])];
}

export function acGeneratorVariants(contractId: string, contractVersion: number): CanonicalVariant[] {
  const phases: Array<"vertical" | "horizontal"> = ["vertical", "horizontal"];
  return phases.map((rotation_phase) => variant(contractId, contractVersion, "generator.rotating_loop", "both", { rotation_phase }, []));
}

const ELECTRONIC_COMPONENT_TYPES = [
  "resistor",
  "capacitor",
  "diode",
  "zener_diode",
  "led",
  "photodiode",
  "thermistor",
  "diac",
  "triac",
  "transistor",
  "thyristor_scr",
  "rectifier",
  "inverter",
] as const;

export function componentSymbolCardVariants(contractId: string, contractVersion: number): CanonicalVariant[] {
  return ELECTRONIC_COMPONENT_TYPES.map((componentType) =>
    variant(contractId, contractVersion, "electronics.component_symbol_card", "both", { component_type: componentType }, []),
  );
}

export const CANONICAL_VARIANT_BUILDERS: Record<string, (contractId: string, contractVersion: number) => CanonicalVariant[]> = {
  "circuit.series_resistors": seriesCircuitVariants,
  "circuit.parallel_resistors": parallelCircuitVariants,
  "magnetic.field_conductor_direction": rightHandGripRuleVariants,
  "motor.force_field_current": motorForceVariants,
  "circuit.series_parallel_mixed": seriesParallelMixedVariants,
  "graph.waveform_sine": waveformSineVariants,
  "instrument.measurement_connection": instrumentConnectionVariants,
  "mechanical.lever_arrangement": leverArrangementVariants,
  "mechanical.gear_mesh": gearMeshVariants,
  "mechanical.pulley_arrangement": pulleyArrangementVariants,
  "mechanical.resistivity_dimensions": resistivityDimensionsVariants,
  "magnetic.pole_interaction": magneticPoleInteractionVariants,
  "magnetic.flux_field_lines": magneticFluxVariants,
  "emf.motional_emf_geometry": motionalEmfVariants,
  "generator.rotating_loop": acGeneratorVariants,
  "electronics.component_symbol_card": componentSymbolCardVariants,
};
