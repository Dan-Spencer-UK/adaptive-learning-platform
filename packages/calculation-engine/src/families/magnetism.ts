/**
 * CC-05B: execution for the 5 `electrical.magnetism_and_electromagnetism`
 * question blueprints -- the "one approved diagram-heavy motor/generator/
 * magnetic-direction family" this task's proving slice requires.
 *
 * `interpret_field_direction` and `interpret_force_direction` are the two
 * genuinely directional blueprints. CC-05A's diagram blueprints
 * (magnetic.field_conductor_direction, motor.force_field_current) model
 * the DIAGRAM PARAMETERS (current_direction, pole_labels) but do not
 * themselves encode the physical rule that maps those parameters to a
 * correct direction -- there is no FormulaFamily for this (the
 * relationship is directional/vector, not a scalar formula). Per the
 * task brief §13 ("do not invent electrical-physics rules... if they
 * belong in governed content semantics"), the two lookup tables below
 * are NOT invented pedagogy: they are a direct, explicitly-derived
 * application of the two standard, universally-agreed physical laws this
 * topic is built on --
 *
 *   - the right-hand grip rule (field circulation direction around a
 *     straight current-carrying conductor, viewed end-on), and
 *   - F = I L x B (the Lorentz force law restricted to a current-carrying
 *     conductor in a uniform field -- the physics Fleming's left-hand
 *     rule is a mnemonic for), evaluated via the standard right-hand
 *     cross-product with the axis convention x=right, y=up, z=out-of-page.
 *
 * Every table entry is individually re-derivable from that cross product
 * (worked in this module's test file) and is covered by an explicit
 * per-combination test -- this is the same category of "generic
 * derivation logic" as ../formula-evaluator.ts, not family-specific
 * pedagogy authored by this package.
 *
 * Scoping note: magnetic.field_conductor_direction's `current_direction`
 * diagram parameter also allows `"left_to_right"` (current flowing in the
 * plane of the page). That case has no single well-defined field-rotation
 * answer without an additional "observation point" diagram parameter
 * CC-05A does not yet model, so this executor deliberately restricts
 * `interpret_field_direction` generation to `into_page`/`out_of_page`
 * (both of which have an unambiguous single answer viewed end-on). This
 * is a bounded CC-05B scoping decision, not a defect -- see the CC-05B
 * evidence document.
 */

import { cleanInteger } from "../parameter-generation.ts";
import { pick } from "../seed.ts";
import type { DiagramInstance } from "../types.ts";
import { assembleInstance, buildFormulaInstance, requireDiagramBlueprint, requireFormulaFamily, type QuestionExecutor } from "./shared.ts";

const FORCE_ON_CONDUCTOR_FORMULA_ID = "formula.force_on_conductor";

const FIELD_DIAGRAM_ID = "magnetic.field_conductor_direction";
const FORCE_DIAGRAM_ID = "motor.force_field_current";
const POLE_DIAGRAM_ID = "magnetic.pole_interaction";

const CONDUCTOR_CURRENT_DIRECTIONS = ["into_page", "out_of_page"] as const;
type ConductorCurrentDirection = (typeof CONDUCTOR_CURRENT_DIRECTIONS)[number];

/**
 * Right-hand grip rule: thumb points along the current, fingers curl in
 * the field direction. Viewed end-on by the reader (the diagram's own
 * point of view): current toward the viewer (out_of_page) curls
 * anticlockwise; current away from the viewer (into_page) curls
 * clockwise. (Standard result -- see e.g. any introductory
 * electromagnetism text's treatment of the field around a straight wire.)
 */
const FIELD_ROTATION_BY_CURRENT_DIRECTION: Readonly<Record<ConductorCurrentDirection, "clockwise" | "counterclockwise">> = {
  into_page: "clockwise",
  out_of_page: "counterclockwise",
};

const POLE_LABELS = ["N_S_horizontal", "N_S_vertical"] as const;
type PoleLabels = (typeof POLE_LABELS)[number];

/**
 * F = I L x B, evaluated with axes x=right, y=up, z=out-of-page (a
 * standard right-handed physics convention) and this module's explicit
 * interpretation of CC-05A's pole-label parameter: N_S_horizontal = N
 * pole on the left (field points right, B=(+1,0,0)); N_S_vertical = N
 * pole at the top (field points down, B=(0,-1,0)). Each entry below is
 * the literal cross product I x B for that combination -- worked and
 * cross-checked in magnetism.test.ts.
 */
const FORCE_DIRECTION: Readonly<Record<PoleLabels, Readonly<Record<ConductorCurrentDirection, "up" | "down" | "left" | "right">>>> = {
  N_S_horizontal: { into_page: "down", out_of_page: "up" },
  N_S_vertical: { into_page: "left", out_of_page: "right" },
};

function fieldDiagram(currentDirection: ConductorCurrentDirection): DiagramInstance {
  return {
    blueprintId: FIELD_DIAGRAM_ID,
    parameters: { current_direction: currentDirection, show_field_arrows: true },
    labels: ["conductor"],
  };
}

function forceDiagram(poleLabels: PoleLabels, currentDirection: ConductorCurrentDirection): DiagramInstance {
  return {
    blueprintId: FORCE_DIAGRAM_ID,
    parameters: { pole_labels: poleLabels, current_direction: currentDirection, show_force_arrow: true },
    labels: ["conductor"],
  };
}

// CC-11.3: the diagram's own `pole_pairing` parameter is given context
// (which poles face each other) -- never itself the attract/repel
// answer, which stays gated entirely by the separate showForceArrows/
// reveal prop the Lesson Player supplies only in teaching mode or after
// feedback (see MagneticPoleDiagram.tsx's own header comment).
function poleDiagram(poleCombination: "like" | "unlike"): DiagramInstance {
  return {
    blueprintId: POLE_DIAGRAM_ID,
    parameters: { pole_pairing: poleCombination === "like" ? "like_poles_facing" : "unlike_poles_facing" },
    labels: [],
  };
}

// CC-11: `concept` is itself the blueprint's own correct answer -- a
// prompt template referencing it directly would hand the learner the
// answer (the exact leak class CC-10 found and fixed for 7 other
// blueprints). `definitionClue` is an additive, governed-statement-
// derived description that identifies the concept without naming it,
// following the same pattern.
const CONCEPT_DEFINITION_CLUE: Readonly<Record<"flux" | "flux_density", string>> = {
  flux: "the total magnetic field passing through a given area",
  flux_density: "the amount of magnetic flux per unit area",
};

const recogniseConcept: QuestionExecutor = (ctx) => {
  const concept = pick(ctx.rng, ["flux", "flux_density"] as const);
  return assembleInstance(ctx, { concept, definition_clue: CONCEPT_DEFINITION_CLUE[concept] }, {}, { answer: ctx.blueprint.answer, value: concept });
};

const interpretFieldDirection: QuestionExecutor = (ctx) => {
  requireDiagramBlueprint(ctx, FIELD_DIAGRAM_ID); // proves the referenced diagram blueprint exists in context
  const currentDirection = pick(ctx.rng, CONDUCTOR_CURRENT_DIRECTIONS);
  const diagram = fieldDiagram(currentDirection);
  const expected = FIELD_ROTATION_BY_CURRENT_DIRECTION[currentDirection];
  return assembleInstance(ctx, { current_direction: currentDirection }, { diagram }, {
    answer: ctx.blueprint.answer,
    value: expected,
  });
};

const interpretForceDirection: QuestionExecutor = (ctx) => {
  requireDiagramBlueprint(ctx, FORCE_DIAGRAM_ID);
  const poleLabels = pick(ctx.rng, POLE_LABELS);
  const currentDirection = pick(ctx.rng, CONDUCTOR_CURRENT_DIRECTIONS);
  const diagram = forceDiagram(poleLabels, currentDirection);
  const expected = FORCE_DIRECTION[poleLabels][currentDirection];
  return assembleInstance(
    ctx,
    { pole_labels: poleLabels, current_direction: currentDirection },
    { diagram },
    { answer: ctx.blueprint.answer, value: expected },
  );
};

// CC-11: `scenario` is itself the correct answer for both blueprints
// below -- same leak class as `CONCEPT_DEFINITION_CLUE` above.
const MAGNET_TYPE_CLUE: Readonly<Record<"permanent_magnet" | "electromagnet", string>> = {
  permanent_magnet: "retains its magnetism without any electrical supply",
  electromagnet: "only produces a magnetic field while current flows through its coil",
};

const comparePermanentElectromagnet: QuestionExecutor = (ctx) => {
  const scenario = pick(ctx.rng, ["permanent_magnet", "electromagnet"] as const);
  return assembleInstance(ctx, { scenario, scenario_clue: MAGNET_TYPE_CLUE[scenario] }, {}, { answer: ctx.blueprint.answer, value: scenario });
};

const MOTOR_GENERATOR_CLUE: Readonly<Record<"motor" | "generator", string>> = {
  motor: "converts electrical energy into mechanical motion",
  generator: "converts mechanical motion into electrical energy (EMF)",
};

const compareMotorGenerator: QuestionExecutor = (ctx) => {
  const scenario = pick(ctx.rng, ["motor", "generator"] as const);
  return assembleInstance(ctx, { scenario, principle_clue: MOTOR_GENERATOR_CLUE[scenario] }, {}, { answer: ctx.blueprint.answer, value: scenario });
};

/**
 * CC-09E.1 (Project Architect correction): split from the original single
 * CC-09E `identifyFluxDensityUnit` executor, which used a variantDimensions
 * quantity pick to silently generate BOTH magnetic flux density (tesla,
 * genuinely sample-evidenced by item 31) and magnetic flux (weber, only
 * ever transfer-supported) under one DIRECT_SAMPLE_ANALOGUE blueprint --
 * hiding a transfer inside a direct-analogue classification. Each
 * quantity now has its own constant-output executor tied to its own
 * honestly-classified blueprint (see cc05a-pedagogy-unit202.ts).
 */
const identifyFluxDensityUnit: QuestionExecutor = (ctx) =>
  assembleInstance(ctx, {}, {}, { answer: ctx.blueprint.answer, value: "tesla" });

const identifyFluxUnit: QuestionExecutor = (ctx) =>
  assembleInstance(ctx, {}, {}, { answer: ctx.blueprint.answer, value: "weber" });

// CC-11.1: AC5.1's own explicit obligation -- "like poles repel, unlike
// poles attract" (EL-CONCEPT-MAGNETISM-001). `pole_combination` is
// deliberately NOT the answer's own value domain ("attract"/"repel"),
// so no clue lookup is needed to avoid leaking it -- unlike
// recogniseConcept/comparePermanentElectromagnet/compareMotorGenerator
// above, whose raw generated parameter IS the answer.
const POLE_SCENARIO_CLUE: Readonly<Record<"like" | "unlike", string>> = {
  like: "two poles of the same type (for example, two north poles)",
  unlike: "two poles of opposite types (a north pole and a south pole)",
};

const recogniseAttractionRepulsion: QuestionExecutor = (ctx) => {
  requireDiagramBlueprint(ctx, POLE_DIAGRAM_ID);
  const poleCombination = pick(ctx.rng, ["like", "unlike"] as const);
  const expected = poleCombination === "like" ? "repel" : "attract";
  const diagram = poleDiagram(poleCombination);
  return assembleInstance(
    ctx,
    { pole_combination: poleCombination, pole_scenario_clue: POLE_SCENARIO_CLUE[poleCombination] },
    { diagram },
    { answer: ctx.blueprint.answer, value: expected },
  );
};

// CC-11.1: AC5.3's own governed "force-on-conductor-calculation"
// obligation -- F = B I l, the single governed right-angles case only
// (no vector maths, no sin(theta)). Single target (F) only, matching
// formula.force_on_conductor's own single declared form.
const calculateForceOnConductor: QuestionExecutor = (ctx) => {
  const formulaFamily = requireFormulaFamily(ctx, FORCE_ON_CONDUCTOR_FORMULA_ID);
  const B = cleanInteger(ctx.rng, 1, 20) / 10; // 0.1 - 2.0 T
  const I = cleanInteger(ctx.rng, 1, 15); // A
  const l = cleanInteger(ctx.rng, 5, 100) / 100; // 0.05 - 1.00 m
  const formulaInstance = buildFormulaInstance(formulaFamily, "F", { B, I, l });
  return assembleInstance(ctx, { B, I, l }, { formula: formulaInstance }, { answer: ctx.blueprint.answer, value: formulaInstance.result });
};

export const magnetismExecutors: Readonly<Record<string, QuestionExecutor>> = {
  "magnetism.recognise_concept": recogniseConcept,
  "magnetism.interpret_field_direction": interpretFieldDirection,
  "magnetism.interpret_force_direction": interpretForceDirection,
  "magnetism.compare_permanent_electromagnet": comparePermanentElectromagnet,
  "magnetism.compare_motor_generator": compareMotorGenerator,
  "magnetism.identify_flux_density_unit": identifyFluxDensityUnit,
  "magnetism.identify_flux_unit": identifyFluxUnit,
  "magnetism.recognise_attraction_repulsion": recogniseAttractionRepulsion,
  "magnetism.calculate_force_on_conductor": calculateForceOnConductor,
};

export const __internal = {
  FIELD_ROTATION_BY_CURRENT_DIRECTION,
  FORCE_DIRECTION,
};
