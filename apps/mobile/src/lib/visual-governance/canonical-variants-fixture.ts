/**
 * CC-05D: governed-content mirror of
 * scripts/visual-governance/data/canonical-variants.ts's output for the 4
 * rendered diagram blueprints -- apps/mobile must never import
 * scripts/visual-governance directly (the same content-authoring-tooling
 * boundary rule scripts/content/README.md already states, mirrored
 * identically here, and the same pattern
 * apps/mobile/src/lib/proving-content/unit202-proving-fixture.ts already
 * established for CC-05C's governed content).
 *
 * Every entry here is mechanically cross-checked byte-for-byte against
 * the real builder output by
 * scripts/visual-governance/check-mobile-canonical-variants-fixture.test.ts
 * (content-authoring tooling, permitted to import both sides). If the
 * real canonical-variant data changes, that test fails until this file
 * is updated to match -- it cannot silently drift.
 */

import type { CanonicalVariant } from "@alp/content-schema";

export const CC05D_CONTENT_RELEASE = "cc05d-visual-governance-pilot-v1";

export const CANONICAL_VARIANTS: readonly CanonicalVariant[] = [
  {
    variantId: "visual-contract.series-circuit-current-direction@1::component_count=2,mode=both,show_current_arrow=true,show_values=false::both",
    contractId: "visual-contract.series-circuit-current-direction",
    contractVersion: 1,
    diagramBlueprintId: "circuit.series_resistors",
    mode: "both",
    parameters: { component_count: 2, show_values: false, show_current_arrow: true },
    labels: ["R1", "R2"],
    revealProps: {},
  },
  {
    variantId: "visual-contract.series-circuit-current-direction@1::component_count=3,mode=both,show_current_arrow=true,show_values=false::both",
    contractId: "visual-contract.series-circuit-current-direction",
    contractVersion: 1,
    diagramBlueprintId: "circuit.series_resistors",
    mode: "both",
    parameters: { component_count: 3, show_values: false, show_current_arrow: true },
    labels: ["R1", "R2", "R3"],
    revealProps: {},
  },
  {
    variantId: "visual-contract.series-circuit-current-direction@1::component_count=4,mode=both,show_current_arrow=true,show_values=false::both",
    contractId: "visual-contract.series-circuit-current-direction",
    contractVersion: 1,
    diagramBlueprintId: "circuit.series_resistors",
    mode: "both",
    parameters: { component_count: 4, show_values: false, show_current_arrow: true },
    labels: ["R1", "R2", "R3", "R4"],
    revealProps: {},
  },
  {
    variantId: "visual-contract.parallel-circuit-branches@1::branch_count=2,mode=both,show_branch_current_arrows=true,show_values=false::both",
    contractId: "visual-contract.parallel-circuit-branches",
    contractVersion: 1,
    diagramBlueprintId: "circuit.parallel_resistors",
    mode: "both",
    parameters: { branch_count: 2, show_values: false, show_branch_current_arrows: true },
    labels: ["R1", "R2"],
    revealProps: {},
  },
  {
    variantId: "visual-contract.parallel-circuit-branches@1::branch_count=3,mode=both,show_branch_current_arrows=true,show_values=false::both",
    contractId: "visual-contract.parallel-circuit-branches",
    contractVersion: 1,
    diagramBlueprintId: "circuit.parallel_resistors",
    mode: "both",
    parameters: { branch_count: 3, show_values: false, show_branch_current_arrows: true },
    labels: ["R1", "R2", "R3"],
    revealProps: {},
  },
  {
    variantId: "visual-contract.parallel-circuit-branches@1::branch_count=4,mode=both,show_branch_current_arrows=true,show_values=false::both",
    contractId: "visual-contract.parallel-circuit-branches",
    contractVersion: 1,
    diagramBlueprintId: "circuit.parallel_resistors",
    mode: "both",
    parameters: { branch_count: 4, show_values: false, show_branch_current_arrows: true },
    labels: ["R1", "R2", "R3", "R4"],
    revealProps: {},
  },
  {
    variantId:
      "visual-contract.right-hand-grip-rule@1::current_direction=into_page,field_rotation=clockwise,mode=teaching,show_field_arrows=true::teaching",
    contractId: "visual-contract.right-hand-grip-rule",
    contractVersion: 1,
    diagramBlueprintId: "magnetic.field_conductor_direction",
    mode: "teaching",
    parameters: { current_direction: "into_page", show_field_arrows: true },
    labels: ["conductor"],
    revealProps: { field_rotation: "clockwise" },
  },
  {
    variantId: "visual-contract.right-hand-grip-rule@1::current_direction=into_page,mode=assessment,show_field_arrows=true::assessment",
    contractId: "visual-contract.right-hand-grip-rule",
    contractVersion: 1,
    diagramBlueprintId: "magnetic.field_conductor_direction",
    mode: "assessment",
    parameters: { current_direction: "into_page", show_field_arrows: true },
    labels: ["conductor"],
    revealProps: {},
  },
  {
    variantId:
      "visual-contract.right-hand-grip-rule@1::current_direction=out_of_page,field_rotation=counterclockwise,mode=teaching,show_field_arrows=true::teaching",
    contractId: "visual-contract.right-hand-grip-rule",
    contractVersion: 1,
    diagramBlueprintId: "magnetic.field_conductor_direction",
    mode: "teaching",
    parameters: { current_direction: "out_of_page", show_field_arrows: true },
    labels: ["conductor"],
    revealProps: { field_rotation: "counterclockwise" },
  },
  {
    variantId: "visual-contract.right-hand-grip-rule@1::current_direction=out_of_page,mode=assessment,show_field_arrows=true::assessment",
    contractId: "visual-contract.right-hand-grip-rule",
    contractVersion: 1,
    diagramBlueprintId: "magnetic.field_conductor_direction",
    mode: "assessment",
    parameters: { current_direction: "out_of_page", show_field_arrows: true },
    labels: ["conductor"],
    revealProps: {},
  },
  {
    variantId:
      "visual-contract.motor-principle-force@1::current_direction=into_page,force_direction=down,mode=teaching,pole_labels=N_S_horizontal,show_force_arrow=true::teaching",
    contractId: "visual-contract.motor-principle-force",
    contractVersion: 1,
    diagramBlueprintId: "motor.force_field_current",
    mode: "teaching",
    parameters: { pole_labels: "N_S_horizontal", current_direction: "into_page", show_force_arrow: true },
    labels: ["conductor"],
    revealProps: { force_direction: "down" },
  },
  {
    variantId:
      "visual-contract.motor-principle-force@1::current_direction=into_page,mode=assessment,pole_labels=N_S_horizontal,show_force_arrow=true::assessment",
    contractId: "visual-contract.motor-principle-force",
    contractVersion: 1,
    diagramBlueprintId: "motor.force_field_current",
    mode: "assessment",
    parameters: { pole_labels: "N_S_horizontal", current_direction: "into_page", show_force_arrow: true },
    labels: ["conductor"],
    revealProps: {},
  },
  {
    variantId:
      "visual-contract.motor-principle-force@1::current_direction=out_of_page,force_direction=up,mode=teaching,pole_labels=N_S_horizontal,show_force_arrow=true::teaching",
    contractId: "visual-contract.motor-principle-force",
    contractVersion: 1,
    diagramBlueprintId: "motor.force_field_current",
    mode: "teaching",
    parameters: { pole_labels: "N_S_horizontal", current_direction: "out_of_page", show_force_arrow: true },
    labels: ["conductor"],
    revealProps: { force_direction: "up" },
  },
  {
    variantId:
      "visual-contract.motor-principle-force@1::current_direction=out_of_page,mode=assessment,pole_labels=N_S_horizontal,show_force_arrow=true::assessment",
    contractId: "visual-contract.motor-principle-force",
    contractVersion: 1,
    diagramBlueprintId: "motor.force_field_current",
    mode: "assessment",
    parameters: { pole_labels: "N_S_horizontal", current_direction: "out_of_page", show_force_arrow: true },
    labels: ["conductor"],
    revealProps: {},
  },
  {
    variantId:
      "visual-contract.motor-principle-force@1::current_direction=into_page,force_direction=left,mode=teaching,pole_labels=N_S_vertical,show_force_arrow=true::teaching",
    contractId: "visual-contract.motor-principle-force",
    contractVersion: 1,
    diagramBlueprintId: "motor.force_field_current",
    mode: "teaching",
    parameters: { pole_labels: "N_S_vertical", current_direction: "into_page", show_force_arrow: true },
    labels: ["conductor"],
    revealProps: { force_direction: "left" },
  },
  {
    variantId:
      "visual-contract.motor-principle-force@1::current_direction=into_page,mode=assessment,pole_labels=N_S_vertical,show_force_arrow=true::assessment",
    contractId: "visual-contract.motor-principle-force",
    contractVersion: 1,
    diagramBlueprintId: "motor.force_field_current",
    mode: "assessment",
    parameters: { pole_labels: "N_S_vertical", current_direction: "into_page", show_force_arrow: true },
    labels: ["conductor"],
    revealProps: {},
  },
  {
    variantId:
      "visual-contract.motor-principle-force@1::current_direction=out_of_page,force_direction=right,mode=teaching,pole_labels=N_S_vertical,show_force_arrow=true::teaching",
    contractId: "visual-contract.motor-principle-force",
    contractVersion: 1,
    diagramBlueprintId: "motor.force_field_current",
    mode: "teaching",
    parameters: { pole_labels: "N_S_vertical", current_direction: "out_of_page", show_force_arrow: true },
    labels: ["conductor"],
    revealProps: { force_direction: "right" },
  },
  {
    variantId:
      "visual-contract.motor-principle-force@1::current_direction=out_of_page,mode=assessment,pole_labels=N_S_vertical,show_force_arrow=true::assessment",
    contractId: "visual-contract.motor-principle-force",
    contractVersion: 1,
    diagramBlueprintId: "motor.force_field_current",
    mode: "assessment",
    parameters: { pole_labels: "N_S_vertical", current_direction: "out_of_page", show_force_arrow: true },
    labels: ["conductor"],
    revealProps: {},
  },
  // ---------------------------------------------------------------------
  // CC-11: the 3 diagram blueprints that closed CC-05D's tracked renderer
  // gap (circuit.series_parallel_mixed, graph.waveform_sine,
  // instrument.measurement_connection). Generated directly from the real
  // builders (scripts/content/_tmp-gen-variants.mjs, run once and
  // discarded) rather than hand-typed, to guarantee byte-for-byte parity
  // with check-mobile-canonical-variants-fixture.test.ts.
  // ---------------------------------------------------------------------
  {
    variantId: "visual-contract.series-parallel-mixed-topology@1::branch_arrangement=series_of_parallel,mode=both,show_values=false::both",
    contractId: "visual-contract.series-parallel-mixed-topology",
    contractVersion: 1,
    diagramBlueprintId: "circuit.series_parallel_mixed",
    mode: "both",
    parameters: { branch_arrangement: "series_of_parallel", show_values: false },
    labels: ["R1", "R2", "R3"],
    revealProps: {},
  },
  {
    variantId: "visual-contract.series-parallel-mixed-topology@1::branch_arrangement=parallel_of_series,mode=both,show_values=false::both",
    contractId: "visual-contract.series-parallel-mixed-topology",
    contractVersion: 1,
    diagramBlueprintId: "circuit.series_parallel_mixed",
    mode: "both",
    parameters: { branch_arrangement: "parallel_of_series", show_values: false },
    labels: ["R1", "R2", "R3", "R4"],
    revealProps: {},
  },
  {
    variantId: "visual-contract.ac-waveform-sine@1::cycles_shown=2,mode=both,show_peak_line=false,show_period_marker=false,show_rms_line=false::both",
    contractId: "visual-contract.ac-waveform-sine",
    contractVersion: 1,
    diagramBlueprintId: "graph.waveform_sine",
    mode: "both",
    parameters: { show_peak_line: false, show_rms_line: false, show_period_marker: false, cycles_shown: 2 },
    labels: [],
    revealProps: {},
  },
  {
    variantId: "visual-contract.ac-waveform-sine@1::cycles_shown=2,mode=both,show_peak_line=true,show_period_marker=false,show_rms_line=false::both",
    contractId: "visual-contract.ac-waveform-sine",
    contractVersion: 1,
    diagramBlueprintId: "graph.waveform_sine",
    mode: "both",
    parameters: { show_peak_line: true, show_rms_line: false, show_period_marker: false, cycles_shown: 2 },
    labels: [],
    revealProps: {},
  },
  {
    variantId: "visual-contract.ac-waveform-sine@1::cycles_shown=2,mode=both,show_peak_line=true,show_period_marker=false,show_rms_line=true::both",
    contractId: "visual-contract.ac-waveform-sine",
    contractVersion: 1,
    diagramBlueprintId: "graph.waveform_sine",
    mode: "both",
    parameters: { show_peak_line: true, show_rms_line: true, show_period_marker: false, cycles_shown: 2 },
    labels: [],
    revealProps: {},
  },
  {
    variantId: "visual-contract.ac-waveform-sine@1::cycles_shown=2,mode=both,show_peak_line=true,show_period_marker=true,show_rms_line=true::both",
    contractId: "visual-contract.ac-waveform-sine",
    contractVersion: 1,
    diagramBlueprintId: "graph.waveform_sine",
    mode: "both",
    parameters: { show_peak_line: true, show_rms_line: true, show_period_marker: true, cycles_shown: 2 },
    labels: [],
    revealProps: {},
  },
  {
    variantId: "visual-contract.ac-waveform-sine@1::cycles_shown=1,mode=both,show_peak_line=true,show_period_marker=true,show_rms_line=true::both",
    contractId: "visual-contract.ac-waveform-sine",
    contractVersion: 1,
    diagramBlueprintId: "graph.waveform_sine",
    mode: "both",
    parameters: { show_peak_line: true, show_rms_line: true, show_period_marker: true, cycles_shown: 1 },
    labels: [],
    revealProps: {},
  },
  {
    variantId: "visual-contract.ac-waveform-sine@1::cycles_shown=3,mode=both,show_peak_line=true,show_period_marker=true,show_rms_line=true::both",
    contractId: "visual-contract.ac-waveform-sine",
    contractVersion: 1,
    diagramBlueprintId: "graph.waveform_sine",
    mode: "both",
    parameters: { show_peak_line: true, show_rms_line: true, show_period_marker: true, cycles_shown: 3 },
    labels: [],
    revealProps: {},
  },
  {
    variantId: "visual-contract.instrument-measurement-connection@1::connection_style=parallel,instrument_type=voltmeter,mode=both::both",
    contractId: "visual-contract.instrument-measurement-connection",
    contractVersion: 1,
    diagramBlueprintId: "instrument.measurement_connection",
    mode: "both",
    parameters: { instrument_type: "voltmeter", connection_style: "parallel" },
    labels: [],
    revealProps: {},
  },
  {
    variantId: "visual-contract.instrument-measurement-connection@1::connection_style=series,instrument_type=voltmeter,mode=both::both",
    contractId: "visual-contract.instrument-measurement-connection",
    contractVersion: 1,
    diagramBlueprintId: "instrument.measurement_connection",
    mode: "both",
    parameters: { instrument_type: "voltmeter", connection_style: "series" },
    labels: [],
    revealProps: {},
  },
  {
    variantId: "visual-contract.instrument-measurement-connection@1::connection_style=series,instrument_type=ammeter,mode=both::both",
    contractId: "visual-contract.instrument-measurement-connection",
    contractVersion: 1,
    diagramBlueprintId: "instrument.measurement_connection",
    mode: "both",
    parameters: { instrument_type: "ammeter", connection_style: "series" },
    labels: [],
    revealProps: {},
  },
  {
    variantId: "visual-contract.instrument-measurement-connection@1::connection_style=parallel,instrument_type=ammeter,mode=both::both",
    contractId: "visual-contract.instrument-measurement-connection",
    contractVersion: 1,
    diagramBlueprintId: "instrument.measurement_connection",
    mode: "both",
    parameters: { instrument_type: "ammeter", connection_style: "parallel" },
    labels: [],
    revealProps: {},
  },
  {
    variantId: "visual-contract.instrument-measurement-connection@1::connection_style=series,instrument_type=ohmmeter,mode=both::both",
    contractId: "visual-contract.instrument-measurement-connection",
    contractVersion: 1,
    diagramBlueprintId: "instrument.measurement_connection",
    mode: "both",
    parameters: { instrument_type: "ohmmeter", connection_style: "series" },
    labels: [],
    revealProps: {},
  },
];
