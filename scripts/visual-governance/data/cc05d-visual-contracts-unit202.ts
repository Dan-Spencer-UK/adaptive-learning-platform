/**
 * CC-05D: governed VisualSemanticContract records for the 4 instructional
 * diagram blueprints currently rendered in the mobile proving slice
 * (apps/mobile/src/components/diagrams/*). Every id below is a real,
 * live reference into scripts/content/data/cc05a-pedagogy-unit202.ts --
 * cross-checked mechanically by scripts/visual-governance/check-visual-
 * governance.ts, exactly as apps/mobile's proving-content fixture is
 * cross-checked by scripts/content/check-cc05c-proving-fixture.test.ts.
 *
 * Scope note: 3 further diagram blueprints are governed in CC-05A
 * (circuit.series_parallel_mixed, graph.waveform_sine,
 * instrument.measurement_connection) but have no mobile renderer yet --
 * building those renderers is out of CC-05D's scope (see the CC-05D
 * architecture doc §S); they intentionally have no contract here, and
 * the mechanical check reports them as a tracked, non-fatal gap rather
 * than silently ignoring them.
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
];
