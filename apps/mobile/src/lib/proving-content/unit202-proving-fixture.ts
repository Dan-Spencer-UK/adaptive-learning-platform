/**
 * CC-05C: the governed content for the four representative proving
 * families (Ohm's law, series resistance, parallel resistance, magnetism/
 * electromagnetism) that this native proving slice demonstrates end-to-end.
 *
 * This is a literal, field-for-field mirror of the corresponding records in
 * the real governed CC-05A corpus
 * (scripts/content/data/cc05a-pedagogy-unit202.ts) -- nothing here is
 * invented or reworded. A mechanical cross-check
 * (scripts/content/check-cc05c-proving-fixture.test.ts) imports both this
 * file and the real corpus module and asserts structural equality for
 * every id mirrored here, so this file cannot silently drift from the
 * governed source.
 *
 * Why a mirror and not a direct import: apps/mobile depends only on
 * published `@alp/*` packages, never on content-authoring tooling under
 * scripts/content -- see @alp/calculation-engine's engine-proof.ts, which
 * establishes the same rule for a single fixture blueprint. The full
 * published learner-runtime content-projection pipeline (governed content
 * -> validated versioned release -> device) is explicitly future work
 * (docs/architecture/MOBILE-ARCHITECTURE.md §2 -- "This projection is a
 * new artefact to design and build, not an existing one to expose"), out
 * of scope for this proving slice (CC-05C task brief §18: "Do not
 * implement the entire future publication/sync architecture"). This
 * module is the smallest honest stand-in for that projection: a fixed,
 * versioned, faithful excerpt of the governed manifest, sufficient to
 * prove the full native rendering/interaction/marking/evidence path.
 */
import type {
  DiagramBlueprint,
  FormulaFamily,
  QuestionBlueprint,
  VisualAidBlueprint,
  WorkedExampleBlueprint,
} from "@alp/content-schema";

/**
 * The governed content release this proving fixture mirrors (CC-06D,
 * Correction A: one coherent current release -- see
 * scripts/content/data/content-releases.ts). Previously an inconsistent
 * free-form string ("cc05c-proving-slice-fixture-v1") describing the same
 * actual governed Unit 202 snapshot. Every generated instance/evidence
 * record carries this value (docs/architecture/MOBILE-ARCHITECTURE.md §2).
 */
export const PROVING_CONTENT_RELEASE = "release.unit202.v1";

// =========================================================================
// Formula families (verbatim from cc05a-pedagogy-unit202.ts)
// =========================================================================

export const FORMULA_OHMS_LAW: FormulaFamily = {
  id: "formula.ohms_law",
  assertionFamilyId: "electrical.ohms_law",
  canonicalTarget: "V",
  variables: [
    { symbol: "V", name: "voltage", quantity: "voltage", unitName: "volt", unitSymbol: "V" },
    { symbol: "I", name: "current", quantity: "current", unitName: "ampere", unitSymbol: "A" },
    { symbol: "R", name: "resistance", quantity: "resistance", unitName: "ohm", unitSymbol: "Ω" },
  ],
  forms: [
    {
      target: "V",
      expression: { operation: "multiply", operands: ["I", "R"] },
      instruction: "To find voltage, multiply current by resistance.",
      requiresWorkedExample: true,
    },
    {
      target: "I",
      expression: { operation: "divide", numerator: "V", denominator: "R" },
      instruction: "To find current, divide voltage by resistance.",
      requiresWorkedExample: true,
    },
    {
      target: "R",
      expression: { operation: "divide", numerator: "V", denominator: "I" },
      instruction: "To find resistance, divide voltage by current.",
      requiresWorkedExample: true,
    },
  ],
  requiredTargets: ["V", "I", "R"],
  mnemonicId: "mnemonic.vir_triangle",
};

export const FORMULA_SERIES_RESISTANCE: FormulaFamily = {
  id: "formula.series_resistance",
  assertionFamilyId: "electrical.series_circuits",
  canonicalTarget: "Rt",
  variables: [
    { symbol: "Rt", name: "total resistance", quantity: "resistance", unitName: "ohm", unitSymbol: "Ω" },
    { symbol: "R1", name: "resistance of component 1", quantity: "resistance", unitName: "ohm", unitSymbol: "Ω" },
    { symbol: "R2", name: "resistance of component 2", quantity: "resistance", unitName: "ohm", unitSymbol: "Ω" },
    { symbol: "R3", name: "resistance of component 3", quantity: "resistance", unitName: "ohm", unitSymbol: "Ω" },
    { symbol: "R4", name: "resistance of component 4", quantity: "resistance", unitName: "ohm", unitSymbol: "Ω" },
  ],
  forms: [
    {
      target: "Rt",
      expression: { operation: "add", operands: ["R1", "R2", "R3", "R4"] },
      instruction:
        "To find total series resistance, add the individual component resistances (using as many of R1..R4 as the circuit actually has).",
      requiresWorkedExample: true,
    },
  ],
  requiredTargets: ["Rt"],
};

export const FORMULA_PARALLEL_RESISTANCE: FormulaFamily = {
  id: "formula.parallel_resistance",
  assertionFamilyId: "electrical.parallel_circuits",
  canonicalTarget: "Rt",
  variables: [
    { symbol: "Rt", name: "total resistance", quantity: "resistance", unitName: "ohm", unitSymbol: "Ω" },
    { symbol: "R1", name: "resistance of branch 1", quantity: "resistance", unitName: "ohm", unitSymbol: "Ω" },
    { symbol: "R2", name: "resistance of branch 2", quantity: "resistance", unitName: "ohm", unitSymbol: "Ω" },
    { symbol: "R3", name: "resistance of branch 3", quantity: "resistance", unitName: "ohm", unitSymbol: "Ω" },
    { symbol: "R4", name: "resistance of branch 4", quantity: "resistance", unitName: "ohm", unitSymbol: "Ω" },
  ],
  forms: [
    {
      target: "Rt",
      expression: { operation: "reciprocal_of_sum_of_reciprocals", operands: ["R1", "R2", "R3", "R4"] },
      instruction:
        "To find total parallel resistance, sum the reciprocals of the individual branch resistances, then take the reciprocal of that total (using as many of R1..R4 as the circuit actually has).",
      requiresWorkedExample: true,
    },
  ],
  requiredTargets: ["Rt"],
};

// Magnetism has no FormulaFamily in the governed corpus -- the field/force
// relationships are directional, not scalar formulae (see
// @alp/calculation-engine's families/magnetism.ts header comment).

// =========================================================================
// Mnemonic visual aid (verbatim)
// =========================================================================

export const MNEMONIC_VIR_TRIANGLE: VisualAidBlueprint = {
  id: "mnemonic.vir_triangle",
  type: "mnemonic",
  formulaFamilyId: "formula.ohms_law",
  renderer: "svg",
  regions: { top: "V", bottom_left: "I", bottom_right: "R" },
  accessibleDescription:
    "A triangle divided into three regions labelled V (top), I (bottom left) and R (bottom right). Covering V shows I x R; covering I shows V / R; covering R shows V / I. The triangle is a learning aid only -- the authoritative relationship is formula.ohms_law.",
};

// =========================================================================
// Diagram blueprints (verbatim)
// =========================================================================

function diagramAccessibility(labelPattern: string) {
  return {
    semanticDescriptionRequired: true as const,
    colourOnlyEncodingProhibited: true as const,
    identifierLabelPattern: labelPattern,
  };
}

export const DIAGRAM_SERIES_RESISTORS: DiagramBlueprint = {
  id: "circuit.series_resistors",
  type: "electrical_circuit",
  renderer: "svg",
  parameters: [
    { name: "component_count", kind: "enum", allowed: [2, 3, 4] },
    { name: "show_values", kind: "boolean" },
    { name: "show_current_arrow", kind: "boolean" },
  ],
  accessibility: diagramAccessibility("R{index}"),
  valueEmbedding: "symbolic_only",
};

export const DIAGRAM_PARALLEL_RESISTORS: DiagramBlueprint = {
  id: "circuit.parallel_resistors",
  type: "electrical_circuit",
  renderer: "svg",
  parameters: [
    { name: "branch_count", kind: "enum", allowed: [2, 3, 4] },
    { name: "show_values", kind: "boolean" },
    { name: "show_branch_current_arrows", kind: "boolean" },
  ],
  accessibility: diagramAccessibility("R{index}"),
  valueEmbedding: "symbolic_only",
};

export const DIAGRAM_MOTOR_FORCE_FIELD_CURRENT: DiagramBlueprint = {
  id: "motor.force_field_current",
  type: "magnetic_field",
  renderer: "svg",
  parameters: [
    { name: "pole_labels", kind: "enum", allowed: ["N_S_horizontal", "N_S_vertical"] },
    { name: "current_direction", kind: "enum", allowed: ["into_page", "out_of_page"] },
    { name: "show_force_arrow", kind: "boolean" },
  ],
  accessibility: diagramAccessibility("arrow-{index}"),
  valueEmbedding: "symbolic_only",
};

export const DIAGRAM_MAGNETIC_FIELD_CONDUCTOR_DIRECTION: DiagramBlueprint = {
  id: "magnetic.field_conductor_direction",
  type: "magnetic_field",
  renderer: "svg",
  parameters: [
    { name: "current_direction", kind: "enum", allowed: ["into_page", "out_of_page", "left_to_right"] },
    { name: "show_field_arrows", kind: "boolean" },
  ],
  accessibility: diagramAccessibility("arrow-{index}"),
  valueEmbedding: "symbolic_only",
};

// =========================================================================
// Worked-example blueprints (verbatim, the subset this proving slice uses)
// =========================================================================

export const WORKED_OHMS_LAW_SOLVE_VOLTAGE: WorkedExampleBlueprint = {
  id: "worked.ohms_law.solve_voltage",
  formulaFamilyId: "formula.ohms_law",
  target: "V",
  knownVariables: ["I", "R"],
  steps: ["show_formula", "substitute_values", "calculate", "show_answer_with_unit"],
  teachingValues: { I: 4, R: 6 },
};

export const WORKED_OHMS_LAW_SOLVE_CURRENT: WorkedExampleBlueprint = {
  id: "worked.ohms_law.solve_current",
  formulaFamilyId: "formula.ohms_law",
  target: "I",
  knownVariables: ["V", "R"],
  steps: ["show_formula", "show_rearrangement", "substitute_values", "calculate", "show_answer_with_unit"],
  teachingValues: { V: 24, R: 6 },
};

export const WORKED_OHMS_LAW_SOLVE_RESISTANCE: WorkedExampleBlueprint = {
  id: "worked.ohms_law.solve_resistance",
  formulaFamilyId: "formula.ohms_law",
  target: "R",
  knownVariables: ["V", "I"],
  steps: ["show_formula", "show_rearrangement", "substitute_values", "calculate", "show_answer_with_unit"],
  teachingValues: { V: 24, I: 4 },
};

export const WORKED_SERIES_CALCULATE_TOTAL: WorkedExampleBlueprint = {
  id: "worked.series_resistance.calculate_total",
  formulaFamilyId: "formula.series_resistance",
  target: "Rt",
  knownVariables: ["R1", "R2", "R3"],
  steps: ["show_formula", "substitute_values", "calculate", "show_answer_with_unit", "sanity_check_result"],
};

export const WORKED_PARALLEL_CALCULATE_TOTAL: WorkedExampleBlueprint = {
  id: "worked.parallel_resistance.calculate_total",
  formulaFamilyId: "formula.parallel_resistance",
  target: "Rt",
  knownVariables: ["R1", "R2", "R3"],
  steps: ["show_formula", "substitute_values", "calculate", "show_answer_with_unit", "sanity_check_result"],
};

// =========================================================================
// Question blueprints (verbatim, the representative subset this proving
// slice demonstrates -- not the full 84-blueprint inventory; see CC-05C
// evidence doc §1 for why this subset was chosen).
// =========================================================================

function evidence(
  familyId: string,
  primaryCapabilityId: string,
  assertionIdentifiers: string[],
  opts: Partial<
    Pick<
      QuestionBlueprint["evidence"],
      "supportingCapabilityIds" | "representationDependency" | "misconceptionTargets"
    >
  > = {},
): QuestionBlueprint["evidence"] {
  return {
    familyId,
    primaryCapabilityId,
    assertionIdentifiers,
    supportingCapabilityIds: opts.supportingCapabilityIds ?? [],
    representationDependency: opts.representationDependency ?? [],
    misconceptionTargets: opts.misconceptionTargets ?? [],
  };
}

export const QB_OHMS_LAW_SOLVE_FOR_VOLTAGE: QuestionBlueprint = {
  id: "ohms_law.solve_for_voltage",
  assertionFamilyId: "electrical.ohms_law",
  capabilityId: "cap.ohms_law.solve_for_voltage",
  title: "Solve for voltage given current and resistance",
  representation: { formula: { required: true, formulaFamilyId: "formula.ohms_law" } },
  variantDimensions: {},
  parameterGenerators: [],
  answer: { type: "quantity", quantity: "voltage", canonicalUnit: "volt" },
  marking: { type: "numeric_tolerance", tolerancePercent: 1 },
  evidence: evidence("electrical.ohms_law", "cap.ohms_law.solve_for_voltage", ["EL-OHM-SOLVE-V-001"], {
    supportingCapabilityIds: ["cap.ohms_law.apply_substitution"],
  }),
  difficultyBand: "introductory",
  presentation: { promptLines: ["I = {I} A", "R = {R} Ω"] },
};

export const QB_OHMS_LAW_SOLVE_FOR_CURRENT: QuestionBlueprint = {
  id: "ohms_law.solve_for_current",
  assertionFamilyId: "electrical.ohms_law",
  capabilityId: "cap.ohms_law.solve_for_current",
  title: "Solve for current given voltage and resistance",
  representation: { formula: { required: true, formulaFamilyId: "formula.ohms_law" } },
  variantDimensions: {},
  parameterGenerators: [],
  answer: { type: "quantity", quantity: "current", canonicalUnit: "ampere" },
  marking: { type: "numeric_tolerance", tolerancePercent: 1 },
  evidence: evidence("electrical.ohms_law", "cap.ohms_law.solve_for_current", ["EL-OHM-SOLVE-I-001"], {
    supportingCapabilityIds: ["cap.ohms_law.apply_substitution"],
  }),
  difficultyBand: "introductory",
  presentation: { promptLines: ["V = {V} V", "R = {R} Ω"] },
};

export const QB_OHMS_LAW_SOLVE_FOR_RESISTANCE: QuestionBlueprint = {
  id: "ohms_law.solve_for_resistance",
  assertionFamilyId: "electrical.ohms_law",
  capabilityId: "cap.ohms_law.solve_for_resistance",
  title: "Solve for resistance given voltage and current",
  representation: { formula: { required: true, formulaFamilyId: "formula.ohms_law" } },
  variantDimensions: {},
  parameterGenerators: [],
  answer: { type: "quantity", quantity: "resistance", canonicalUnit: "ohm" },
  marking: { type: "numeric_tolerance", tolerancePercent: 1 },
  evidence: evidence("electrical.ohms_law", "cap.ohms_law.solve_for_resistance", ["EL-OHM-SOLVE-R-001"], {
    supportingCapabilityIds: ["cap.ohms_law.apply_substitution"],
  }),
  difficultyBand: "intermediate",
  presentation: { promptLines: ["V = {V} V", "I = {I} A"] },
};

export const QB_SERIES_CALCULATE_TOTAL_RESISTANCE: QuestionBlueprint = {
  id: "series.calculate_total_resistance",
  assertionFamilyId: "electrical.series_circuits",
  capabilityId: "cap.series.calculate_total_resistance",
  title: "Calculate total resistance of resistors connected in series",
  representation: {
    formula: { required: true, formulaFamilyId: "formula.series_resistance" },
    diagram: { required: true, blueprintId: "circuit.series_resistors" },
  },
  variantDimensions: { component_count: { allowed: [2, 3, 4] } },
  parameterGenerators: [{ variable: "R1", min: 1, max: 100, constraints: ["positive", "pedagogically_sensible"] }],
  answer: { type: "quantity", quantity: "resistance", canonicalUnit: "ohm" },
  marking: { type: "numeric_tolerance", tolerancePercent: 1 },
  evidence: evidence("electrical.series_circuits", "cap.series.calculate_total_resistance", [
    "EL-SERIES-RESISTANCE-CALC-001",
  ]),
  difficultyBand: "introductory",
  presentation: { promptLines: ["The series circuit shown has {component_count} resistors."] },
};

export const QB_SERIES_SOLVE_MISSING_COMPONENT: QuestionBlueprint = {
  id: "series.solve_missing_component",
  assertionFamilyId: "electrical.series_circuits",
  capabilityId: "cap.series.solve_missing_component",
  title: "Solve for a missing series component resistance given the total and the other components",
  representation: { diagram: { required: true, blueprintId: "circuit.series_resistors" } },
  variantDimensions: { component_count: { allowed: [2, 3, 4] }, target: { allowed: ["choose_from_components"] } },
  parameterGenerators: [],
  answer: { type: "quantity", quantity: "resistance", canonicalUnit: "ohm" },
  marking: { type: "numeric_tolerance", tolerancePercent: 1 },
  evidence: evidence(
    "electrical.series_circuits",
    "cap.series.solve_missing_component",
    ["EL-SERIES-RESISTANCE-001", "FM-ALG-TRANSPOSE-ADD-001"],
  ),
  difficultyBand: "advanced",
  normalisationNote:
    "A single blueprint with the unknown component chosen by the generator, rather than a separate find_R1/find_R2/find_R3 blueprint per component -- the assessed skill is identical regardless of which component is unknown.",
  presentation: {
    promptLines: [
      "This series circuit has {component_count} resistors with a total resistance of {Rt} Ω.",
      "Find the resistance of {target} (rearrange RT = R1 + R2 + ... to isolate it).",
    ],
  },
};

export const QB_PARALLEL_CALCULATE_TOTAL: QuestionBlueprint = {
  id: "parallel.calculate_total",
  assertionFamilyId: "electrical.parallel_circuits",
  capabilityId: "cap.parallel.calculate_total_resistance",
  title: "Calculate total resistance of resistors connected in parallel",
  representation: {
    formula: { required: true, formulaFamilyId: "formula.parallel_resistance" },
    diagram: { required: true, blueprintId: "circuit.parallel_resistors" },
  },
  variantDimensions: { branch_count: { allowed: [2, 3, 4] } },
  parameterGenerators: [{ variable: "R1", min: 1, max: 100, constraints: ["positive", "pedagogically_sensible"] }],
  answer: { type: "quantity", quantity: "resistance", canonicalUnit: "ohm" },
  marking: { type: "numeric_tolerance", tolerancePercent: 2 },
  evidence: evidence("electrical.parallel_circuits", "cap.parallel.calculate_total_resistance", [
    "EL-PARALLEL-RESISTANCE-CALC-001",
  ]),
  difficultyBand: "intermediate",
  presentation: { promptLines: ["The parallel circuit shown has {branch_count} branches."] },
};

export const QB_PARALLEL_SOLVE_MISSING_BRANCH: QuestionBlueprint = {
  id: "parallel.solve_missing_branch",
  assertionFamilyId: "electrical.parallel_circuits",
  capabilityId: "cap.parallel.solve_missing_branch",
  title: "Solve for a missing parallel branch resistance given the total and the other branches",
  representation: { diagram: { required: true, blueprintId: "circuit.parallel_resistors" } },
  variantDimensions: { branch_count: { allowed: [2, 3] }, target: { allowed: ["choose_from_branches"] } },
  parameterGenerators: [],
  answer: { type: "quantity", quantity: "resistance", canonicalUnit: "ohm" },
  marking: { type: "numeric_tolerance", tolerancePercent: 2 },
  evidence: evidence("electrical.parallel_circuits", "cap.parallel.solve_missing_branch", [
    "EL-PARALLEL-RESISTANCE-001",
    "FM-ARITH-RECIPROCAL-SUM-001",
    "FM-ARITH-RECIPROCAL-INVERT-001",
    "FM-ALG-TRANSPOSE-ADD-001",
  ]),
  difficultyBand: "advanced",
  normalisationNote:
    "A single blueprint with the unknown branch chosen by the generator (design doc §18), rather than a separate find_R1_given_Rt_R2 / find_R2_given_Rt_R1 blueprint pair -- the assessed skill is identical regardless of which branch is unknown.",
  presentation: {
    promptLines: [
      "This parallel circuit has {branch_count} branches with a total resistance of {Rt} Ω.",
      "Find the resistance of {target}.",
    ],
  },
};

export const QB_MAGNETISM_INTERPRET_FIELD_DIRECTION: QuestionBlueprint = {
  id: "magnetism.interpret_field_direction",
  assertionFamilyId: "electrical.magnetism_and_electromagnetism",
  capabilityId: "cap.magnetism.interpret_field_direction",
  title: "Interpret the direction of the magnetic field produced by a current-carrying conductor",
  representation: { diagram: { required: true, blueprintId: "magnetic.field_conductor_direction" } },
  variantDimensions: {},
  parameterGenerators: [],
  answer: { type: "direction" },
  marking: { type: "direction_match" },
  evidence: evidence("electrical.magnetism_and_electromagnetism", "cap.magnetism.interpret_field_direction", [
    "EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001",
  ]),
  difficultyBand: "advanced",
};

export const QB_MAGNETISM_INTERPRET_FORCE_DIRECTION: QuestionBlueprint = {
  id: "magnetism.interpret_force_direction",
  assertionFamilyId: "electrical.magnetism_and_electromagnetism",
  capabilityId: "cap.magnetism.interpret_force_direction",
  title: "Interpret the direction of the force on a current-carrying conductor in a magnetic field",
  representation: { diagram: { required: true, blueprintId: "motor.force_field_current" } },
  variantDimensions: {},
  parameterGenerators: [],
  answer: { type: "direction" },
  marking: { type: "direction_match" },
  evidence: evidence(
    "electrical.magnetism_and_electromagnetism",
    "cap.magnetism.interpret_force_direction",
    ["EL-CONCEPT-FORCE-ON-CONDUCTOR-001", "EL-CONCEPT-MOTOR-PRINCIPLE-001"],
    {
      misconceptionTargets: [
        { misconceptionIdentifier: "MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001", evidenceStrength: "suggestive" },
      ],
    },
  ),
  difficultyBand: "advanced",
};

// =========================================================================
// Family groupings the lesson/practice screens consume
// =========================================================================

export interface ProvingFamily {
  readonly id: string;
  readonly title: string;
  readonly learningIntent: string;
  readonly formulaFamily?: FormulaFamily;
  readonly visualAid?: VisualAidBlueprint;
  readonly diagramBlueprints: readonly DiagramBlueprint[];
  readonly workedExampleBlueprints: readonly WorkedExampleBlueprint[];
  readonly questionBlueprints: readonly QuestionBlueprint[];
}

export const OHMS_LAW_FAMILY: ProvingFamily = {
  id: "electrical.ohms_law",
  title: "Ohm's Law",
  learningIntent:
    "Understand and apply the relationship between voltage, current and resistance (V = I x R), including every rearrangement, and recognise common rearrangement/unit errors.",
  formulaFamily: FORMULA_OHMS_LAW,
  visualAid: MNEMONIC_VIR_TRIANGLE,
  diagramBlueprints: [],
  workedExampleBlueprints: [
    WORKED_OHMS_LAW_SOLVE_VOLTAGE,
    WORKED_OHMS_LAW_SOLVE_CURRENT,
    WORKED_OHMS_LAW_SOLVE_RESISTANCE,
  ],
  questionBlueprints: [
    QB_OHMS_LAW_SOLVE_FOR_VOLTAGE,
    QB_OHMS_LAW_SOLVE_FOR_CURRENT,
    QB_OHMS_LAW_SOLVE_FOR_RESISTANCE,
  ],
};

export const SERIES_FAMILY: ProvingFamily = {
  id: "electrical.series_circuits",
  title: "Series D.C. circuits",
  learningIntent:
    "Understand and calculate current, resistance, voltage drop and power in series D.C. circuits, and predict the effect of circuit changes.",
  formulaFamily: FORMULA_SERIES_RESISTANCE,
  diagramBlueprints: [DIAGRAM_SERIES_RESISTORS],
  workedExampleBlueprints: [WORKED_SERIES_CALCULATE_TOTAL],
  questionBlueprints: [QB_SERIES_CALCULATE_TOTAL_RESISTANCE, QB_SERIES_SOLVE_MISSING_COMPONENT],
};

export const PARALLEL_FAMILY: ProvingFamily = {
  id: "electrical.parallel_circuits",
  title: "Parallel D.C. circuits",
  learningIntent:
    "Understand and calculate current, resistance, branch voltage/current and power in parallel D.C. circuits, and predict the effect of circuit changes.",
  formulaFamily: FORMULA_PARALLEL_RESISTANCE,
  diagramBlueprints: [DIAGRAM_PARALLEL_RESISTORS],
  workedExampleBlueprints: [WORKED_PARALLEL_CALCULATE_TOTAL],
  questionBlueprints: [QB_PARALLEL_CALCULATE_TOTAL, QB_PARALLEL_SOLVE_MISSING_BRANCH],
};

export const MAGNETISM_FAMILY: ProvingFamily = {
  id: "electrical.magnetism_and_electromagnetism",
  title: "Magnetism, electromagnetism and the motor principle",
  learningIntent:
    "Understand magnetic flux/flux density, the magnetic field around a current-carrying conductor, the force on a conductor in a field, and the motor principle.",
  diagramBlueprints: [DIAGRAM_MAGNETIC_FIELD_CONDUCTOR_DIRECTION, DIAGRAM_MOTOR_FORCE_FIELD_CURRENT],
  workedExampleBlueprints: [],
  questionBlueprints: [QB_MAGNETISM_INTERPRET_FIELD_DIRECTION, QB_MAGNETISM_INTERPRET_FORCE_DIRECTION],
};

export const PROVING_FAMILIES: readonly ProvingFamily[] = [
  OHMS_LAW_FAMILY,
  SERIES_FAMILY,
  PARALLEL_FAMILY,
  MAGNETISM_FAMILY,
];

export function getProvingFamily(familyId: string): ProvingFamily | undefined {
  return PROVING_FAMILIES.find((f) => f.id === familyId);
}

export function getProvingQuestionBlueprint(blueprintId: string): QuestionBlueprint | undefined {
  for (const family of PROVING_FAMILIES) {
    const found = family.questionBlueprints.find((q) => q.id === blueprintId);
    if (found) return found;
  }
  return undefined;
}
