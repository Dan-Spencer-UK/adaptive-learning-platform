/**
 * CC-05D: governed VisualSemanticContract records for the instructional
 * diagram blueprints rendered in the mobile app
 * (apps/mobile/src/components/diagrams/*). Every id below is a real,
 * live reference into scripts/content/data/cc05a-pedagogy-unit202.ts --
 * cross-checked mechanically by scripts/visual-governance/check-visual-
 * governance.ts, exactly as apps/mobile's proving-content fixture is
 * cross-checked by scripts/content/check-cc05c-proving-fixture.test.ts.
 *
 * CC-11 closes the renderer gap CC-05D tracked but deliberately left open
 * (`circuit.series_parallel_mixed`, `graph.waveform_sine`,
 * `instrument.measurement_connection`) -- all 7 governed diagram
 * blueprints now have both a real renderer and a contract here.
 */

import type { VisualSemanticContract } from "@alp/content-schema";

export const visualSemanticContracts: VisualSemanticContract[] = [
  {
    id: "visual-contract.series-circuit-current-direction",
    version: 1,
    diagramBlueprintId: "circuit.series_resistors",
    teachingIntent:
      "Show resistors connected one after another in a single loop, with an arrow indicating the single shared current direction around the loop.",
    representationRole: "essential",
    assertionFamilyIds: ["electrical.series_circuits"],
    assertionIdentifiers: [
      "EL-SERIES-RESISTANCE-CALC-001",
      "EL-SERIES-RESISTANCE-001",
      "EL-SERIES-VOLTAGE-CALC-001",
      "EL-SERIES-DOMINANT-RESISTOR-001",
      "EL-CIRCUIT-SERIES-STRUCTURE-001",
    ],
    capabilityIds: [
      "cap.series.calculate_total_resistance",
      "cap.series.solve_missing_component",
      "cap.series.calculate_voltage_drop",
      "cap.series.identify_dominant_component",
      "cap.series.recognise_structure",
    ],
    relevantQuestionBlueprintIds: [
      "series.calculate_total_resistance",
      "series.solve_missing_component",
      "series.calculate_voltage_drop",
      "series.identify_dominant_component",
      "series.interpret_diagram",
    ],
    modeApplicability: ["both"],
    mustShow: [
      "one continuous single loop",
      "every resistor drawn in the loop, labelled R1..Rn in order",
      "a current-direction arrow on the loop, pointing along the wire it sits on",
    ],
    mustNotShow: ["a second, parallel current path", "numeric component values (symbolic labels only, per CC-05A valueEmbedding policy)"],
    semanticMappings: [{ element: "current_direction_arrow", concept: "conventional_current_flow_direction" }],
    directionalRelationships: [
      { from: "current_direction_arrow", to: "the wire segment it is drawn on", relationship: "must be collinear with, not perpendicular to" },
    ],
    variantExpectations: [
      { parameter: "component_count", value: 2, expectation: "exactly 2 resistors drawn in the loop" },
      { parameter: "component_count", value: 3, expectation: "exactly 3 resistors drawn in the loop" },
      { parameter: "component_count", value: 4, expectation: "exactly 4 resistors drawn in the loop" },
    ],
    invariantExpectations: [
      "the current-direction arrowhead always points along its wire segment, never perpendicular to it (CC-05C-DIAGRAM-FIX regression)",
      "resistor labels never overlap the resistor symbol or each other",
    ],
    answerDisclosure: [],
    accessibilityExpectations: [
      { description: "Current direction is stated in the accessibility label in words (e.g. 'flowing left to right'), not only as a visual arrow.", requiresNonColourEncoding: true },
    ],
  },
  {
    id: "visual-contract.parallel-circuit-branches",
    version: 1,
    diagramBlueprintId: "circuit.parallel_resistors",
    teachingIntent: "Show resistors connected as independent branches between two shared rails.",
    representationRole: "essential",
    assertionFamilyIds: ["electrical.parallel_circuits"],
    assertionIdentifiers: [
      "EL-PARALLEL-RESISTANCE-CALC-001",
      "EL-PARALLEL-RESISTANCE-001",
      "EL-CIRCUIT-PARALLEL-STRUCTURE-001",
      "EL-PARALLEL-CURRENT-CALC-001",
      "EL-PARALLEL-DOMINANT-RESISTOR-001",
    ],
    capabilityIds: [
      "cap.parallel.calculate_total_resistance",
      "cap.parallel.solve_missing_branch",
      "cap.parallel.recognise_structure",
      "cap.parallel.calculate_branch_current",
      "cap.parallel.identify_dominant_branch",
    ],
    relevantQuestionBlueprintIds: [
      "parallel.calculate_total",
      "parallel.solve_missing_branch",
      "parallel.identify_topology",
      "parallel.calculate_branch_current",
      "parallel.identify_dominant_branch",
    ],
    modeApplicability: ["both"],
    mustShow: [
      "two shared horizontal rails",
      "every branch drawn as a separate vertical connection between the rails, labelled R1..Rn",
    ],
    mustNotShow: ["branches drawn as a single series loop", "numeric component values"],
    semanticMappings: [{ element: "each_vertical_branch", concept: "independent_parallel_current_path" }],
    directionalRelationships: [],
    variantExpectations: [
      { parameter: "branch_count", value: 2, expectation: "exactly 2 branches between the rails" },
      { parameter: "branch_count", value: 3, expectation: "exactly 3 branches between the rails" },
      { parameter: "branch_count", value: 4, expectation: "exactly 4 branches between the rails" },
    ],
    invariantExpectations: ["every branch spans the full distance between the two rails", "branch labels never overlap"],
    answerDisclosure: [],
    accessibilityExpectations: [{ description: "Topology (parallel, not series) is stated in words in the accessibility label.", requiresNonColourEncoding: true }],
  },
  {
    id: "visual-contract.right-hand-grip-rule",
    version: 1,
    diagramBlueprintId: "magnetic.field_conductor_direction",
    teachingIntent: "Teach the right-hand grip rule for the magnetic field circulating around a current-carrying conductor.",
    representationRole: "essential",
    assertionFamilyIds: ["electrical.magnetism_and_electromagnetism"],
    assertionIdentifiers: ["EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001"],
    capabilityIds: ["cap.magnetism.interpret_field_direction"],
    relevantQuestionBlueprintIds: ["magnetism.interpret_field_direction"],
    modeApplicability: ["teaching", "assessment"],
    mustShow: ["a recognisable right hand", "a distinctly labelled thumb", "distinctly labelled curled fingers", "the conductor cross-section the hand grips"],
    mustNotShow: [
      "a generic force arrow presented as if it were the field direction (the pre-CC-05C-DIAGRAM-FIX defect: a generic magnetic-force diagram shown for a right-hand-grip-rule lesson)",
      "the field-rotation arrow/label in assessment mode (it is the assessed answer)",
    ],
    semanticMappings: [
      { element: "thumb", concept: "conventional_current_direction" },
      { element: "curled_fingers", concept: "magnetic_field_direction" },
    ],
    directionalRelationships: [{ from: "current_direction", to: "field_rotation", relationship: "determines (right-hand grip rule)" }],
    variantExpectations: [
      { parameter: "current_direction", value: "into_page", expectation: "field rotation is clockwise as seen by the viewer" },
      { parameter: "current_direction", value: "out_of_page", expectation: "field rotation is counterclockwise as seen by the viewer" },
    ],
    invariantExpectations: [
      "the thumb always points along the conductor's current direction",
      "the 'Field: ...' label and the '(current direction)' caption never visually collide (CC-05C-DIAGRAM-FIX regression -- found only on real Android device render)",
    ],
    answerDisclosure: [{ element: "field_rotation_arrow_and_label", revealedInModes: ["teaching"] }],
    accessibilityExpectations: [
      { description: "Both the current direction and (when revealed) the field rotation are stated in words in the accessibility label.", requiresNonColourEncoding: true },
    ],
    knownAmbiguity:
      "The governed DiagramBlueprint also permits current_direction='left_to_right'; CC-05B deliberately never generates it (no single well-defined field-rotation answer without an additional observation-point parameter CC-05A does not yet model -- see packages/calculation-engine/src/families/magnetism.ts header). This contract's canonical variants therefore cover only the two engine-reachable directions, not the blueprint's full declared enum.",
  },
  {
    id: "visual-contract.motor-principle-force",
    version: 1,
    diagramBlueprintId: "motor.force_field_current",
    teachingIntent: "Teach the motor principle: the direction of the force on a current-carrying conductor in a magnetic field.",
    representationRole: "essential",
    assertionFamilyIds: ["electrical.magnetism_and_electromagnetism"],
    assertionIdentifiers: ["EL-CONCEPT-FORCE-ON-CONDUCTOR-001", "EL-CONCEPT-MOTOR-PRINCIPLE-001"],
    capabilityIds: ["cap.magnetism.interpret_force_direction"],
    relevantQuestionBlueprintIds: ["magnetism.interpret_force_direction"],
    modeApplicability: ["teaching", "assessment"],
    mustShow: ["a labelled north pole", "a labelled south pole", "field-direction arrows from north to south", "the conductor cross-section between the poles"],
    mustNotShow: ["a hand/grip-rule visual (this is the motor-principle diagram, distinct from the right-hand-grip-rule diagram -- the two concepts must never be conflated in one image)", "the force arrow/label in assessment mode"],
    semanticMappings: [
      { element: "field_arrows", concept: "magnetic_field_direction_north_to_south" },
      { element: "conductor_dot_or_cross", concept: "current_direction" },
    ],
    directionalRelationships: [
      { from: "pole_labels and current_direction", to: "force_direction", relationship: "determines (motor principle / F = IL x B)" },
    ],
    variantExpectations: [
      { parameter: "pole_labels", value: "N_S_horizontal", expectation: "field arrows are horizontal, left to right" },
      { parameter: "pole_labels", value: "N_S_vertical", expectation: "field arrows are vertical, top to bottom" },
    ],
    invariantExpectations: ["the force arrow, when revealed, never points along the field-arrow direction (force is perpendicular to the field, by the motor principle)"],
    answerDisclosure: [{ element: "force_arrow_and_label", revealedInModes: ["teaching"] }],
    accessibilityExpectations: [
      { description: "Pole orientation, current direction, and (when revealed) force direction are stated in words in the accessibility label.", requiresNonColourEncoding: true },
    ],
  },
  {
    id: "visual-contract.series-parallel-mixed-topology",
    version: 1,
    diagramBlueprintId: "circuit.series_parallel_mixed",
    teachingIntent:
      "Show a genuinely mixed series-and-parallel topology so learners can distinguish it from pure series or pure parallel, and trace the current path(s) through it.",
    representationRole: "essential",
    assertionFamilyIds: ["electrical.series_vs_parallel_comparison"],
    assertionIdentifiers: ["EL-CIRCUIT-SELECT-CONFIGURATION-001", "EL-CIRCUIT-MIXED-SERIES-PARALLEL-RECOGNITION-001", "EL-CIRCUIT-TRACE-CURRENT-PATH-001"],
    capabilityIds: ["cap.comparison.identify_topology", "cap.comparison.recognise_mixed_circuit", "cap.comparison.trace_current_path"],
    relevantQuestionBlueprintIds: ["comparison.identify_topology", "comparison.recognise_mixed_circuit", "comparison.trace_current_path"],
    modeApplicability: ["both"],
    mustShow: [
      "a genuine series run (one or more components in a single current path)",
      "a genuine parallel group (two or more components between shared local rails) within the same image",
      "symbolic R1..Rn labels in a single consistent reading order",
      "the specific arrangement (series-of-parallel vs parallel-of-series) visually distinguishable from the other",
    ],
    mustNotShow: [
      "a topology that is actually pure series or pure parallel dressed up to look mixed",
      "numeric component values (symbolic labels only, per CC-05A valueEmbedding policy)",
    ],
    semanticMappings: [
      { element: "series_run", concept: "components_sharing_one_current_path" },
      { element: "parallel_group", concept: "components_between_shared_local_rails" },
    ],
    directionalRelationships: [],
    variantExpectations: [
      { parameter: "branch_arrangement", value: "series_of_parallel", expectation: "one series resistor, then a two-branch parallel group, reconnecting before the loop completes" },
      { parameter: "branch_arrangement", value: "parallel_of_series", expectation: "two parallel branches between shared rails, each branch itself carrying two resistors in series" },
    ],
    invariantExpectations: [
      "labels never overlap",
      "the parallel sub-group's local rails/branches are visually distinct from the series loop's wires -- no ambiguity about which wires belong to which structure",
    ],
    answerDisclosure: [],
    accessibilityExpectations: [
      { description: "The exact topology (which components are in series, which are in parallel with each other) is stated in words in the accessibility label.", requiresNonColourEncoding: true },
    ],
    knownAmbiguity:
      "comparison.trace_current_path's answer type is diagram_region, implying future tappable-region interactivity none of the current renderers implement -- worth a semantic reviewer's attention once interactivity is built (CC-11 Workstream D finding).",
  },
  {
    id: "visual-contract.ac-waveform-sine",
    version: 1,
    diagramBlueprintId: "graph.waveform_sine",
    teachingIntent:
      "Show a sine AC waveform with correctly-positioned peak/RMS/period reference marks, teaching the RMS ~ 0.707 x peak relationship and the zero full-cycle average of symmetric AC.",
    representationRole: "essential",
    assertionFamilyIds: ["electrical.ac_dc_waveforms"],
    assertionIdentifiers: [
      "EL-WAVEFORM-PERIODIC-TIME-001",
      "EL-WAVEFORM-AMPLITUDE-001",
      "EL-WAVEFORM-PEAK-TO-PEAK-001",
      "EL-WAVEFORM-RMS-001",
      "EL-WAVEFORM-AVERAGE-VALUE-001",
      "EL-WAVEFORM-AVERAGE-ZERO-INTERPRETATION-001",
      "EL-WAVEFORM-RMS-CALC-001",
      "EL-WAVEFORM-RMS-PEAK-RELATIONSHIP-001",
    ],
    capabilityIds: ["cap.waveform.identify_characteristic", "cap.waveform.calculate_rms_peak"],
    relevantQuestionBlueprintIds: ["waveform.identify_characteristic", "waveform.calculate_rms_from_peak"],
    modeApplicability: ["both"],
    mustShow: ["the sine curve itself over cycles_shown full periods", "the zero/reference axis, which every other reference line is measured from"],
    mustNotShow: [
      "an RMS line coincident with the peak line",
      "a non-zero horizontal 'average' reference line for a full symmetric cycle (the real signed average is zero -- EL-WAVEFORM-AVERAGE-ZERO-INTERPRETATION-001)",
      "any numeric peak/RMS/period value embedded in the artwork itself (values belong in question/lesson prompt text, per the symbolic-only convention every diagram in this folder follows)",
    ],
    semanticMappings: [
      { element: "peak_line", concept: "maximum_instantaneous_value" },
      { element: "rms_line", concept: "root_mean_square_value" },
      { element: "period_marker", concept: "periodic_time" },
    ],
    directionalRelationships: [],
    variantExpectations: [
      { parameter: "show_peak_line", value: true, expectation: "a dashed reference line touching the curve's maximum, measured from the zero axis" },
      { parameter: "show_rms_line", value: true, expectation: "a distinctly-dashed reference line at exactly 1/sqrt(2) of the peak's distance from the zero axis -- never at the peak, never at zero" },
      { parameter: "show_period_marker", value: true, expectation: "a horizontal marker spanning exactly one full cycle" },
    ],
    invariantExpectations: [
      "rms_line height == 0.7071 x peak_line height (measured from the zero axis) whenever both are shown",
      "the period marker always spans exactly one horizontal cycle-width, never a partial or arbitrary span",
    ],
    answerDisclosure: [],
    accessibilityExpectations: [
      { description: "Which reference lines are present (peak/RMS/period) and the cycle count are stated in words in the accessibility label; no numeric value is ever stated since none is ever drawn.", requiresNonColourEncoding: true },
    ],
    knownAmbiguity:
      "This is the only blueprint with valueEmbedding 'values_when_assessed' rather than 'symbolic_only'. This renderer resolves that by never embedding a numeric value in the artwork under any circumstance (see WaveformSineDiagram.tsx's header comment) -- a semantic reviewer used to the other 6 blueprints' plain symbolic-only convention should not mistake the absence of numeric labels here for a defect; it is this blueprint's specific, deliberate design.",
  },
  {
    id: "visual-contract.instrument-measurement-connection",
    version: 1,
    diagramBlueprintId: "instrument.measurement_connection",
    teachingIntent: "Teach correct voltmeter-parallel / ammeter-series connection, and that ohmmeter use requires a de-energised, isolated component.",
    representationRole: "essential",
    assertionFamilyIds: ["electrical.instrumentation"],
    assertionIdentifiers: ["EL-INSTRUMENT-VOLTMETER-001", "EL-INSTRUMENT-AMMETER-001"],
    capabilityIds: ["cap.instrumentation.recognise_connection"],
    relevantQuestionBlueprintIds: ["instrumentation.recognise_connection"],
    modeApplicability: ["both"],
    mustShow: [
      "the instrument symbol (circle containing V/A/Omega) at the correct topological position for the requested connection_style",
      "the component/path being measured",
      "an explicit on-diagram caption stating whether the shown combination matches the standard, correct connection method for that instrument (never silently implying a miswiring is standard practice)",
    ],
    mustNotShow: [
      "a voltmeter spliced into the current path (the main path must remain unbroken whenever a voltmeter is shown)",
      "an ammeter drawn as a side branch (it must always be spliced into the current path)",
      "for instrument_type 'ohmmeter', any energised-source symbol in a closed loop with the meter -- ohmmeter use requires an isolated, de-energised component",
    ],
    semanticMappings: [
      { element: "meter_symbol", concept: "measured_quantity" },
      { element: "connection_topology", concept: "series_or_parallel_measurement_method" },
    ],
    directionalRelationships: [
      { from: "instrument_type", to: "connection_style", relationship: "determines the standard/correct connection (voltmeter->parallel, ammeter->series, ohmmeter->isolated, never in a live loop)" },
    ],
    variantExpectations: [
      { parameter: "instrument_type", value: "voltmeter", expectation: "standard connection is parallel, across the component" },
      { parameter: "instrument_type", value: "ammeter", expectation: "standard connection is series, in the current path" },
      { parameter: "instrument_type", value: "ohmmeter", expectation: "always isolated -- no source, no closed energised loop, regardless of connection_style" },
    ],
    invariantExpectations: ["the ohmmeter variant never co-renders a source symbol in a closed path, regardless of the requested connection_style"],
    answerDisclosure: [],
    accessibilityExpectations: [
      { description: "The connection style shown and whether it is the standard/correct method are both stated in words in the accessibility label.", requiresNonColourEncoding: true },
    ],
    knownAmbiguity:
      "instrumentation.recognise_connection's answer options are literally 'series'/'parallel'. This renderer's own always-shown standard/non-standard caption directly states the answer -- fine for the diagram's current teaching-only use (lesson.electrical.instrumentation), but if this diagram is ever wired into that blueprint's own assessment-mode presentation, the caption would leak the answer and must be suppressed for that call site specifically (CC-11 Workstream D flagged this as an open design question, not silently resolved here).",
  },
];
