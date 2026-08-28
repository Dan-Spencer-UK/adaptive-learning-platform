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
    mustShow: [
      "the sine curve itself over cycles_shown full periods",
      "the zero/reference axis, which every other reference line is measured from",
      // CC-11.3: closes this contract's own previously-claimed-but-unmet
      // EL-WAVEFORM-PEAK-TO-PEAK-001 linkage -- a labelled peak-to-peak
      // bracket now exists whenever the peak line is shown.
      "when show_peak_line is true: a labelled peak-to-peak bracket spanning from the peak line to the trough line",
    ],
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
    teachingIntent:
      "Teach correct voltmeter-parallel / ammeter-series connection (including, in TEACHING mode, deliberate non-standard comparison examples), and that ohmmeter use requires a de-energised circuit, with isolation of the individual component from other parallel paths where needed for an accurate reading.",
    representationRole: "essential",
    assertionFamilyIds: ["electrical.instrumentation"],
    assertionIdentifiers: ["EL-INSTRUMENT-VOLTMETER-001", "EL-INSTRUMENT-AMMETER-001", "EL-INSTRUMENT-OHMMETER-001"],
    capabilityIds: ["cap.instrumentation.recognise_connection"],
    relevantQuestionBlueprintIds: ["instrumentation.recognise_connection"],
    modeApplicability: ["teaching", "assessment", "both"],
    mustShow: [
      "the instrument symbol (circle containing V/A/Omega) at the correct topological position for the requested connection_style",
      "the component/path being measured",
      "in TEACHING or BOTH mode: an explicit on-diagram caption stating whether the shown combination matches the standard, correct connection method for that instrument (never silently implying a miswiring is standard practice)",
    ],
    mustNotShow: [
      // CC-11.3 correction: the pre-CC-11.3 wording here ("a voltmeter
      // spliced into the current path" / "an ammeter drawn as a side
      // branch") was an absolute prohibition that directly contradicted
      // this same diagram's own deliberate, governed teaching-comparison
      // canonical variants (voltmeter/series, ammeter/parallel) -- a
      // genuine defect (task brief §11.B), not a documented exception.
      // Deliberate non-standard TEACHING examples are legitimate and
      // stay; what must never happen is presenting one WITHOUT its
      // disclosing caption, or disclosing the caption during assessment.
      "a voltmeter spliced into the current path, or an ammeter drawn as a side branch, in TEACHING or BOTH mode, without the caption identifying whether it is the standard connection",
      "the standard/non-standard caption in ASSESSMENT mode (it directly states instrumentation.recognise_connection's own answer -- series or parallel)",
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
    answerDisclosure: [{ element: "standard_non_standard_caption", revealedInModes: ["teaching", "both"] }],
    accessibilityExpectations: [
      { description: "The connection style shown is always stated in words; whether it is the standard/correct method is stated in words only when the caption itself is shown (teaching/both mode).", requiresNonColourEncoding: true },
    ],
  },
  // ---------------------------------------------------------------------
  // CC-11.3: whole-course instructional visual coverage closeout.
  // ---------------------------------------------------------------------
  {
    id: "visual-contract.lever-class-arrangement",
    version: 1,
    diagramBlueprintId: "mechanical.lever_arrangement",
    teachingIntent:
      "Show a lever's pivot, effort and load positioned along a bar so the learner can identify the lever class (I/II/III) from the arrangement itself, and (optionally) the effort-arm/load-arm distances the moment-balance relationship depends on.",
    representationRole: "essential",
    assertionFamilyIds: ["foundational.levers_mechanical_advantage"],
    assertionIdentifiers: ["FP-CONCEPT-LEVER-PRINCIPLE-001", "FP-LEVER-CLASS-I-001", "FP-LEVER-CLASS-II-001", "FP-LEVER-CLASS-III-001", "FP-REL-LEVER-BALANCE-001"],
    capabilityIds: ["cap.foundational.levers.recognise", "cap.foundational.levers.calculate"],
    relevantQuestionBlueprintIds: ["levers.identify_class", "levers.calculate_effort_or_load"],
    modeApplicability: ["both"],
    mustShow: [
      "a single horizontal bar",
      "the pivot (triangle fulcrum symbol) at its class-determined position",
      "an effort arrow and a load arrow, each labelled in text, at their class-determined positions",
    ],
    mustNotShow: ["numeric force or distance values (symbolic de/dl labels only, per CC-05A valueEmbedding policy)"],
    semanticMappings: [
      { element: "pivot_triangle", concept: "fulcrum_position" },
      { element: "effort_arrow", concept: "applied_effort_force_position" },
      { element: "load_arrow", concept: "load_force_position" },
    ],
    directionalRelationships: [
      { from: "relative position of pivot/effort/load", to: "lever_class", relationship: "determines (structural encoding of FP-LEVER-CLASS-I/II/III-001)" },
    ],
    variantExpectations: [
      { parameter: "lever_class", value: "class_1", expectation: "pivot in the middle, effort and load at the two ends" },
      { parameter: "lever_class", value: "class_2", expectation: "pivot at one end, load in the middle, effort at the other end" },
      { parameter: "lever_class", value: "class_3", expectation: "pivot at one end, effort in the middle, load at the other end" },
      { parameter: "show_distances", value: true, expectation: "de (pivot-to-effort) and dl (pivot-to-load) distance brackets are shown, symbolically labelled, never with a numeric value" },
    ],
    invariantExpectations: [
      "the diagram never depicts an arrangement inconsistent with the requested lever_class -- class is structurally encoded in position, never merely asserted in a caption",
      "pivot/effort/load labels never overlap each other",
    ],
    answerDisclosure: [],
    accessibilityExpectations: [
      { description: "The relative left-to-right order of pivot, effort and load, and (when shown) the de/dl distance-bracket meaning, are stated in words in the accessibility label.", requiresNonColourEncoding: true },
    ],
  },
  {
    id: "visual-contract.gear-mesh-ratio",
    version: 1,
    diagramBlueprintId: "mechanical.gear_mesh",
    teachingIntent: "Show two meshed gears whose relative size represents the gear ratio, so the learner recognises the torque/speed trade-off a larger or smaller driven gear produces.",
    representationRole: "essential",
    assertionFamilyIds: ["foundational.levers_mechanical_advantage"],
    assertionIdentifiers: ["FP-CONCEPT-GEAR-001", "FP-REL-GEAR-RATIO-001", "FP-GEAR-SPEED-TORQUE-TRADEOFF-001"],
    capabilityIds: ["cap.foundational.gears.recognise"],
    relevantQuestionBlueprintIds: ["gears.recognise_ratio_tradeoff"],
    modeApplicability: ["both"],
    mustShow: ["a driver gear, labelled", "a driven gear, labelled, tangent to (meshing with) the driver", "a ring of tooth marks around each gear's circumference"],
    mustNotShow: [
      "numeric radius or tooth-count values (recognition-depth only -- no gear-ratio calculation blueprint exists)",
      "rotation-direction arrows as a primary element (not the governed teaching point)",
    ],
    semanticMappings: [{ element: "relative_circle_radius", concept: "gear_ratio_size_relationship" }],
    directionalRelationships: [
      { from: "driven_gear_relative_size", to: "torque_speed_tradeoff", relationship: "determines (larger driven -> more torque/less speed; smaller driven -> less torque/more speed)" },
    ],
    variantExpectations: [
      { parameter: "size_ratio", value: "driven_larger", expectation: "driven gear visibly larger in radius than the driver gear" },
      { parameter: "size_ratio", value: "driven_smaller", expectation: "driven gear visibly smaller in radius than the driver gear" },
      { parameter: "size_ratio", value: "equal", expectation: "both gears drawn at the same radius" },
    ],
    invariantExpectations: ["the two gear circles are always drawn tangent (meshing), never overlapping or separated", "gear labels never overlap the tooth marks"],
    answerDisclosure: [],
    accessibilityExpectations: [
      { description: "Which gear is driver/driven and their relative size are stated in words; the torque/speed consequence is stated only for the two non-equal size_ratio values.", requiresNonColourEncoding: true },
    ],
  },
  {
    id: "visual-contract.pulley-fixed-vs-movable",
    version: 1,
    diagramBlueprintId: "mechanical.pulley_arrangement",
    teachingIntent: "Contrast a fixed pulley (direction change only, MA=1) with a simple movable pulley (MA approximately 2, via two supporting rope segments) so the learner recognises the effort force/distance trade-off.",
    representationRole: "essential",
    assertionFamilyIds: ["foundational.levers_mechanical_advantage"],
    assertionIdentifiers: ["FP-CONCEPT-PULLEY-001", "FP-PULLEY-FIXED-VS-MOVABLE-001", "FP-REL-PULLEY-MECHANICAL-ADVANTAGE-001", "FP-REL-PULLEY-FORCE-DISTANCE-TRADEOFF-001"],
    capabilityIds: ["cap.foundational.pulleys.recognise"],
    relevantQuestionBlueprintIds: ["pulleys.recognise_force_distance_tradeoff"],
    modeApplicability: ["both"],
    mustShow: ["the pulley wheel", "a fixed anchor point, labelled", "Effort and Load, both labelled", "for 'movable', two visually distinct rope segments both connecting to the movable pulley/load"],
    mustNotShow: [
      "a multi-pulley block-and-tackle system (out of governed scope -- only one fixed and one simple movable example)",
      "a physically-accurate rope-wrap path (a stylised schematic of straight segments is this course's house style)",
    ],
    semanticMappings: [{ element: "supporting_rope_segment_count", concept: "mechanical_advantage" }],
    directionalRelationships: [
      { from: "arrangement", to: "mechanical_advantage_and_force_direction_change", relationship: "determines (fixed: direction change only, MA=1; movable: MA approximately 2, no direction change)" },
    ],
    variantExpectations: [
      { parameter: "arrangement", value: "fixed", expectation: "one rope over a fixed-mounted wheel, effort pulling down on one side, load hanging on the other -- exactly one supporting segment" },
      { parameter: "arrangement", value: "movable", expectation: "the wheel attached to the load, one rope end fixed at the top and the other pulled as effort -- exactly two supporting segments" },
    ],
    invariantExpectations: ["the movable arrangement always shows exactly two supporting rope segments, never one or three (no other block-and-tackle ratio is depicted)"],
    answerDisclosure: [],
    accessibilityExpectations: [
      { description: "The arrangement and the number of rope segments supporting the load are stated in words in the accessibility label.", requiresNonColourEncoding: true },
    ],
  },
  {
    id: "visual-contract.resistivity-length-area-dimensions",
    version: 1,
    diagramBlueprintId: "mechanical.resistivity_dimensions",
    teachingIntent: "Show two conductor rods differing only in length (or only in cross-sectional area) so the learner predicts the qualitative effect on resistance, without any numeric R = rho L / A calculation.",
    representationRole: "essential",
    assertionFamilyIds: ["electrical.resistivity"],
    assertionIdentifiers: ["EL-RESISTIVITY-LENGTH-EFFECT-001", "EL-RESISTIVITY-AREA-EFFECT-001", "EL-CONDUCTOR-RESISTANCE-FACTORS-001"],
    capabilityIds: ["cap.resistivity.predict_length_effect", "cap.resistivity.predict_area_effect"],
    relevantQuestionBlueprintIds: ["resistivity.predict_length_effect", "resistivity.predict_area_effect"],
    modeApplicability: ["both"],
    mustShow: ["two rod/cylinder schematics side by side", "a symbolic caption on each rod stating the qualitative resistance consequence"],
    mustNotShow: [
      "any numeric length, area or resistance value (symbolic captions only, per CC-05A valueEmbedding policy)",
      "an actual R = rho L / A calculation (out of this diagram's governed scope -- handled by formula.resistivity elsewhere)",
    ],
    semanticMappings: [
      { element: "rod_length", concept: "conductor_length_L" },
      { element: "rod_thickness", concept: "conductor_cross_sectional_area_A" },
    ],
    directionalRelationships: [
      { from: "conductor_length", to: "resistance", relationship: "direct proportion (longer -> more resistance)" },
      { from: "conductor_cross_sectional_area", to: "resistance", relationship: "inverse proportion (larger area -> less resistance)" },
    ],
    variantExpectations: [
      { parameter: "comparison", value: "length", expectation: "two rods of equal thickness, different length, captioned 'shorter -> less resistance' / 'longer -> more resistance'" },
      { parameter: "comparison", value: "area", expectation: "two rods of equal length, different thickness, captioned 'thinner -> more resistance' / 'thicker -> less resistance'" },
    ],
    invariantExpectations: ["the non-varying dimension (thickness for 'length', length for 'area') is always visually equal between the two rods, never accidentally varied too"],
    answerDisclosure: [],
    accessibilityExpectations: [
      { description: "Which comparison is shown (length or area) and the qualitative resistance relationship are stated in words in the accessibility label.", requiresNonColourEncoding: true },
    ],
  },
  {
    id: "visual-contract.magnetic-pole-interaction",
    version: 1,
    diagramBlueprintId: "magnetic.pole_interaction",
    teachingIntent: "Teach that like magnetic poles repel and unlike poles attract, from the pole labels on two facing bar magnets.",
    representationRole: "essential",
    assertionFamilyIds: ["electrical.magnetism_and_electromagnetism"],
    assertionIdentifiers: ["EL-CONCEPT-MAGNETISM-001"],
    capabilityIds: ["cap.magnetism.recognise_attraction_repulsion"],
    relevantQuestionBlueprintIds: ["magnetism.recognise_attraction_repulsion"],
    modeApplicability: ["teaching", "assessment"],
    mustShow: ["both poles of the left magnet, labelled", "both poles of the right magnet, labelled", "a visible central gap between the two facing poles"],
    mustNotShow: ["the force-arrows/attract-repel label in assessment mode (it is the assessed answer)"],
    semanticMappings: [
      { element: "left_magnet_facing_pole_label", concept: "pole_polarity" },
      { element: "right_magnet_facing_pole_label", concept: "pole_polarity" },
    ],
    directionalRelationships: [{ from: "facing_pole_labels", to: "force_arrows", relationship: "determines (like poles repel, unlike poles attract)" }],
    variantExpectations: [
      { parameter: "pole_pairing", value: "like_poles_facing", expectation: "both facing poles are labelled N; force arrows (when shown) point outward" },
      { parameter: "pole_pairing", value: "unlike_poles_facing", expectation: "facing poles are labelled N and S; force arrows (when shown) point inward" },
    ],
    invariantExpectations: ["the left magnet's facing pole is always N; only the right magnet's facing pole varies with pole_pairing"],
    answerDisclosure: [{ element: "force_arrows_and_attract_repel_label", revealedInModes: ["teaching"] }],
    accessibilityExpectations: [
      { description: "Which poles face each other is always stated in words; the resulting attract/repel behaviour is stated in words only when revealed.", requiresNonColourEncoding: true },
    ],
  },
  {
    id: "visual-contract.magnetic-flux-density-comparison",
    version: 1,
    diagramBlueprintId: "magnetic.flux_field_lines",
    teachingIntent: "Show magnetic flux as the field-line pattern from N to S, and (when density_comparison is shown) flux density as the same flux concentrated over different cross-sectional areas.",
    representationRole: "supporting",
    assertionFamilyIds: ["electrical.magnetism_and_electromagnetism"],
    assertionIdentifiers: ["EL-CONCEPT-MAGNETIC-FLUX-001", "EL-CONCEPT-MAGNETIC-FLUX-DENSITY-001"],
    capabilityIds: ["cap.magnetism.recognise_concept"],
    relevantQuestionBlueprintIds: ["magnetism.recognise_concept"],
    modeApplicability: ["both"],
    mustShow: ["a labelled north pole", "a labelled south pole", "curved field lines from north to south"],
    mustNotShow: ["any numeric flux or flux-density value or formula (purely conceptual, per CC-05A valueEmbedding policy)"],
    semanticMappings: [
      { element: "field_lines", concept: "magnetic_flux" },
      { element: "gate_width", concept: "cross_sectional_area" },
    ],
    directionalRelationships: [{ from: "gate_width", to: "flux_density", relationship: "inversely determines (same flux, smaller area = higher density)" }],
    variantExpectations: [
      { parameter: "density_comparison", value: false, expectation: "only the single field-line diagram is shown" },
      { parameter: "density_comparison", value: true, expectation: "two gates of different width are shown below, each carrying the same number of field lines" },
    ],
    invariantExpectations: ["the same number of field lines passes through both gates whenever density_comparison is true -- only the gate width differs"],
    answerDisclosure: [],
    accessibilityExpectations: [
      { description: "The field-line direction (N to S) and, when shown, the area-vs-concentration relationship are stated in words.", requiresNonColourEncoding: true },
    ],
  },
  {
    id: "visual-contract.motional-emf-geometry",
    version: 1,
    diagramBlueprintId: "emf.motional_emf_geometry",
    teachingIntent: "Show that the conductor length, its velocity and the magnetic field are mutually perpendicular -- the given geometric fact behind the simple e = B L v formula.",
    representationRole: "essential",
    assertionFamilyIds: ["electrical.emf_and_generation"],
    assertionIdentifiers: ["EL-REL-INDUCED-EMF-001"],
    capabilityIds: ["cap.emf.calculate_motional_emf"],
    relevantQuestionBlueprintIds: ["emf.calculate_motional_emf"],
    modeApplicability: ["both"],
    mustShow: [
      "two parallel rails suggesting depth",
      "a conductor rod lying across the rails, labelled l",
      "a velocity arrow along the rails, labelled v",
      "field arrows perpendicular to the rail-plane, labelled B",
    ],
    mustNotShow: ["any oblique/non-perpendicular arrangement", "a numeric EMF value or the formula itself"],
    semanticMappings: [
      { element: "conductor_rod", concept: "conductor_length_l" },
      { element: "centreline_arrow", concept: "conductor_velocity_v" },
      { element: "downward_arrows", concept: "magnetic_flux_density_B" },
    ],
    directionalRelationships: [{ from: "B, l and v", to: "e = B x l x v", relationship: "mutually perpendicular arrangement makes the simple scalar formula valid" }],
    variantExpectations: [],
    invariantExpectations: ["the geometry never varies -- always the same given perpendicular arrangement, regardless of the diagram instance's parameters"],
    answerDisclosure: [],
    accessibilityExpectations: [
      { description: "That B, l and v are mutually perpendicular, and what each arrow/segment represents, is stated in words.", requiresNonColourEncoding: true },
    ],
    knownAmbiguity: "This blueprint has no parameters, so variantExpectations is deliberately empty and the canonical-variant catalogue has exactly one entry, not a per-parameter grid.",
  },
  {
    id: "visual-contract.ac-generator-rotating-loop",
    version: 1,
    diagramBlueprintId: "generator.rotating_loop",
    teachingIntent:
      "Show a single loop of wire rotating on a central axis between N and S poles, and that the loop's position relative to the field determines whether it is cutting flux at the maximum rate (near-peak EMF) or not at all (near-zero EMF).",
    representationRole: "essential",
    assertionFamilyIds: ["electrical.emf_and_generation"],
    assertionIdentifiers: ["EL-CONCEPT-AC-GENERATOR-001", "EL-CONCEPT-SINE-WAVE-001"],
    capabilityIds: ["cap.emf.describe_ac_generation"],
    relevantQuestionBlueprintIds: ["emf.describe_ac_generation"],
    modeApplicability: ["both"],
    mustShow: ["a labelled north pole", "a labelled south pole", "a rotating loop between them", "a central rotation axis", "a minimal slip-ring/output connection"],
    mustNotShow: [
      "a waveform overlay (this pairs with the separate, existing graph.waveform_sine blueprint, never merged into one image)",
      "the static motor-principle diagram substituted for this rotating-loop concept (the defect this blueprint fixes)",
      "three-phase alternators, phasors or any vector-maths depiction",
    ],
    semanticMappings: [
      { element: "loop_shape", concept: "loop_rotational_position" },
      { element: "rotation_axis", concept: "axis_of_rotation" },
    ],
    directionalRelationships: [
      { from: "rotation_phase", to: "instantaneous_emf_magnitude", relationship: "loop plane aligned with field -> near-peak EMF; loop plane facing poles -> near-zero EMF" },
    ],
    variantExpectations: [
      { parameter: "rotation_phase", value: "vertical", expectation: "loop drawn as a tall, narrow ellipse (edge-on), captioned near-peak EMF" },
      { parameter: "rotation_phase", value: "horizontal", expectation: "loop drawn as a wide, flat ellipse (face-on), captioned near-zero EMF" },
    ],
    invariantExpectations: ["no numeric EMF value or waveform is ever drawn -- purely qualitative/positional"],
    answerDisclosure: [],
    accessibilityExpectations: [
      { description: "The pole arrangement, that the loop rotates on a central axis, and which phase is shown are all stated in words.", requiresNonColourEncoding: true },
    ],
  },
  {
    id: "visual-contract.electronic-component-symbol-card",
    version: 1,
    diagramBlueprintId: "electronics.component_symbol_card",
    teachingIntent:
      "Show the governed BS EN 60617 / IEC 60617 schematic symbol (or, for rectifier/inverter, a functional-block illustration) for one named electronic component, for symbol recognition and at-a-glance function -- never detailed operating-principle prose.",
    representationRole: "essential",
    assertionFamilyIds: ["electrical.electronic_components"],
    assertionIdentifiers: [
      "EL-COMPONENT-RESISTOR-001",
      "EL-COMPONENT-CAPACITOR-001",
      "EL-COMPONENT-DIODE-001",
      "EL-COMPONENT-ZENER-DIODE-001",
      "EL-COMPONENT-LED-001",
      "EL-COMPONENT-PHOTODIODE-001",
      "EL-COMPONENT-THERMISTOR-001",
      "EL-COMPONENT-THERMISTOR-PTC-001",
      "EL-COMPONENT-DIAC-001",
      "EL-COMPONENT-TRIAC-001",
      "EL-COMPONENT-TRANSISTOR-001",
      "EL-COMPONENT-THYRISTOR-SCR-001",
      "EL-COMPONENT-RECTIFIER-001",
      "EL-COMPONENT-INVERTER-001",
    ],
    capabilityIds: ["cap.electronic_components.recognise_principle", "cap.electronic_components.identify_application"],
    relevantQuestionBlueprintIds: [
      "electronics.recognise_capacitor_behaviour",
      "electronics.recognise_thermistor_type",
      "electronics.recognise_rectifier_type",
      "electronics.recognise_diode_family",
      "electronics.recognise_switching_family",
      "electronics.identify_application",
    ],
    modeApplicability: ["both"],
    mustShow: [
      "the governed BS EN 60617 / IEC 60617 symbol (schematic symbol for 11 component_type values, functional block for rectifier/inverter) matching the requested component_type",
      "the component's name as a heading",
      "a short one-line functional caption",
    ],
    mustNotShow: [
      "detailed operating-principle prose beyond the one-line caption (that stays in the lesson step's own text)",
      "any numeric component value",
      "the US/ANSI resistor zigzag or any other non-UK/IEC symbol convention",
    ],
    semanticMappings: [{ element: "schematic_symbol_or_functional_block", concept: "component_type_identity" }],
    directionalRelationships: [],
    variantExpectations: [
      { parameter: "component_type", value: "resistor", expectation: "a plain rectangle, not the US/ANSI zigzag" },
      { parameter: "component_type", value: "capacitor", expectation: "two parallel plates with a gap" },
      { parameter: "component_type", value: "diode", expectation: "a triangle pointing to a straight perpendicular bar" },
      { parameter: "component_type", value: "zener_diode", expectation: "a diode symbol with a kinked Z-shaped bar" },
      { parameter: "component_type", value: "led", expectation: "a diode symbol with two arrows pointing away from it" },
      { parameter: "component_type", value: "photodiode", expectation: "a diode symbol with two arrows pointing toward it" },
      { parameter: "component_type", value: "thermistor", expectation: "a resistor rectangle with a diagonal line and a 't' label" },
      { parameter: "component_type", value: "diac", expectation: "two opposite-pointing diode triangles, no gate lead" },
      { parameter: "component_type", value: "triac", expectation: "two opposite-pointing diode triangles plus a gate lead" },
      { parameter: "component_type", value: "transistor", expectation: "a circle with a base line and two angled leads, one arrowed" },
      { parameter: "component_type", value: "thyristor_scr", expectation: "a diode symbol plus a gate lead" },
      { parameter: "component_type", value: "rectifier", expectation: "a functional block: AC in, DC out, diode shown inside" },
      { parameter: "component_type", value: "inverter", expectation: "a functional block: DC in, AC out" },
    ],
    invariantExpectations: [
      "the rendered symbol never uses the US/ANSI resistor zigzag (BS EN 60617 / IEC 60617 plain rectangle only)",
      "rectifier and inverter always render as a labelled functional block, never presented as if they were a genuine discrete-component symbol",
      "the accessibility label always states both the component's name and a one-sentence description of the symbol's shape",
    ],
    answerDisclosure: [],
    accessibilityExpectations: [
      { description: "The component's name and a plain-language description of the symbol's shape are both stated in the accessibility label.", requiresNonColourEncoding: true },
    ],
    symbolStandard: "UK_IEC",
  },
];
