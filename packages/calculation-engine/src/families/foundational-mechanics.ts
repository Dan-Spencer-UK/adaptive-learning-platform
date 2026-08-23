/**
 * CC-11 (Workstream A): execution for the new foundational.mass_weight,
 * foundational.levers_mechanical_advantage and
 * foundational.mechanics_work_energy_power question blueprints -- Unit 202
 * LO3 (AC3.1-AC3.4), reclassified from `teaching_only` to `assessable` by
 * this same package (see cc05a-pedagogy-unit202.ts's own reclassification
 * comment on those three families). Before this package, AC3.1/AC3.2 had
 * zero lesson/question-blueprint coverage at all, and AC3.3/AC3.4 showed
 * as covered only via a false-green artefact (a shared capability touched
 * by an unrelated Electrical lesson) -- see PROJECT-STATUS.md's CC-11
 * entry.
 *
 * Recognition-style executors (mass/weight, lever class, gear tradeoff,
 * pulley tradeoff, general-mechanics concept) follow the magnetism.ts /
 * comparison.ts pattern exactly: a small closed enum picked by `pick`,
 * with a governed CLUE string that describes the scenario WITHOUT
 * naming (or trivially spelling out) the blueprint's own correct answer
 * -- the CC-10 "answer-leakage" lesson (PROJECT-STATUS.md's CC-10 entry,
 * point 3): a prompt-line parameter must never equal the blueprint's own
 * correct answer value.
 *
 * Calculation-style executors (lever moment-balance, and the five
 * general-mechanics forms: work, kinetic energy, potential energy, power,
 * efficiency) follow the energy.ts/power.ts pattern: every numeric result
 * comes from the generic `evaluateFormulaExpression` (via
 * `buildFormulaInstance`) against a real, structured FormulaFamily --
 * never ad hoc arithmetic. Gravitational field strength (g = 9.81 N/kg)
 * is embedded as a numeric-constant literal leaf inside
 * formula.mechanics_potential_energy's expression tree, exactly the same
 * "numeric-literal leaf, not a physical-quantity variable requiring its
 * own binding" treatment @alp/content-schema's own pedagogy.ts module
 * comment documents for e.g. the "2" inside AC-waveform's sqrt(2)
 * RMS/peak conversion -- never a hard-coded physics rule invented by this
 * engine package (task brief precedent: magnetism.ts's own header
 * comment on the same boundary).
 */

import { cleanInteger } from "../parameter-generation.ts";
import { nextInt, pick } from "../seed.ts";
import type { ExpectedAnswer } from "../types.ts";
import { assembleInstance, buildFormulaInstance, requireFormulaFamily, type QuestionExecutor } from "./shared.ts";

function quantityAnswer(quantity: string, canonicalUnit: string, value: number): ExpectedAnswer {
  return { answer: { type: "quantity", quantity, canonicalUnit }, value };
}

// ---------------------------------------------------------------------
// foundational.mass_weight -- cap.foundational.mass_weight.recognise
// ---------------------------------------------------------------------

const MASS_OR_WEIGHT = ["mass", "weight"] as const;
type MassOrWeight = (typeof MASS_OR_WEIGHT)[number];

/** Derived directly from FP-CONCEPT-MASS-001/FP-CONCEPT-WEIGHT-001's own governed statements, never naming "mass"/"weight" in the clue itself. */
const MASS_WEIGHT_CLUES: Readonly<Record<MassOrWeight, string>> = {
  mass: "the amount of matter an object contains, measured in kilograms, and unchanged wherever the object is",
  weight: "the force of gravity acting on an object, measured in newtons, and dependent on the local gravitational field strength",
};

const recogniseMassOrWeight: QuestionExecutor = (ctx) => {
  const concept = pick(ctx.rng, MASS_OR_WEIGHT);
  return assembleInstance(ctx, { concept_clue: MASS_WEIGHT_CLUES[concept] }, {}, { answer: ctx.blueprint.answer, value: concept });
};

// ---------------------------------------------------------------------
// foundational.levers_mechanical_advantage -- levers / gears / pulleys
// ---------------------------------------------------------------------

const LEVER_CLASSES = ["class_I", "class_II", "class_III"] as const;
type LeverClass = (typeof LEVER_CLASSES)[number];

/** Derived directly from FP-LEVER-CLASS-I/II/III-001's own governed pivot/effort/load statements. */
const LEVER_CLASS_CLUES: Readonly<Record<LeverClass, string>> = {
  class_I: "the pivot is positioned between the effort and the load",
  class_II: "the load is positioned between the pivot and the effort",
  class_III: "the effort is positioned between the pivot and the load",
};

const identifyLeverClass: QuestionExecutor = (ctx) => {
  const leverClass = pick(ctx.rng, LEVER_CLASSES);
  return assembleInstance(ctx, { arrangement_clue: LEVER_CLASS_CLUES[leverClass] }, {}, { answer: ctx.blueprint.answer, value: leverClass });
};

const GEAR_SCENARIOS = ["driven_larger", "driven_smaller"] as const;
type GearScenario = (typeof GEAR_SCENARIOS)[number];

const GEAR_SCENARIO_CLUES: Readonly<Record<GearScenario, string>> = {
  driven_larger: "The driven gear has a larger radius (more teeth) than the driving gear.",
  driven_smaller: "The driven gear has a smaller radius (fewer teeth) than the driving gear.",
};

/** FP-REL-GEAR-RATIO-001: MA = tau_out/tau_in = driven radius/driving radius. A larger driven gear (MA > 1) increases output torque; a smaller driven gear (MA < 1) increases output speed -- FP-GEAR-SPEED-TORQUE-TRADEOFF-001's torque-or-speed (never both) trade-off. */
const GEAR_TRADEOFF_OUTCOME: Readonly<Record<GearScenario, "torque_increases" | "speed_increases">> = {
  driven_larger: "torque_increases",
  driven_smaller: "speed_increases",
};

const recogniseGearTradeoff: QuestionExecutor = (ctx) => {
  const scenario = pick(ctx.rng, GEAR_SCENARIOS);
  return assembleInstance(
    ctx,
    { scenario_clue: GEAR_SCENARIO_CLUES[scenario] },
    {},
    { answer: ctx.blueprint.answer, value: GEAR_TRADEOFF_OUTCOME[scenario] },
  );
};

const PULLEY_SCENARIOS = ["more_supporting_sections", "fewer_supporting_sections"] as const;
type PulleyScenario = (typeof PULLEY_SCENARIOS)[number];

const PULLEY_SCENARIO_CLUES: Readonly<Record<PulleyScenario, string>> = {
  more_supporting_sections: "A movable pulley system is rigged with MORE rope/cable sections directly supporting the load than before.",
  fewer_supporting_sections: "A movable pulley system is rigged with FEWER rope/cable sections directly supporting the load than before.",
};

/** FP-REL-PULLEY-FORCE-DISTANCE-TRADEOFF-001: more supporting sections raises mechanical advantage, reducing the required effort force (at the cost of a proportionally greater distance moved). */
const PULLEY_TRADEOFF_OUTCOME: Readonly<Record<PulleyScenario, "effort_force_decreases" | "effort_force_increases">> = {
  more_supporting_sections: "effort_force_decreases",
  fewer_supporting_sections: "effort_force_increases",
};

const recognisePulleyTradeoff: QuestionExecutor = (ctx) => {
  const scenario = pick(ctx.rng, PULLEY_SCENARIOS);
  return assembleInstance(
    ctx,
    { scenario_clue: PULLEY_SCENARIO_CLUES[scenario] },
    {},
    { answer: ctx.blueprint.answer, value: PULLEY_TRADEOFF_OUTCOME[scenario] },
  );
};

const LEVER_BALANCE_FORMULA_ID = "formula.lever_balance";

/**
 * FP-REL-LEVER-BALANCE-001: effort x effort-arm = load x load-arm.
 * Randomly solves for either the effort or the load (never always the
 * same direction), mirroring charge.ts's calculate executor's own
 * two-direction pattern. `target_variable` is a safe, non-leaking
 * parameter (a variable NAME, "Fe"/"Fl" -- never the numeric answer),
 * exactly as charge.calculate already establishes.
 */
const calculateLeverBalance: QuestionExecutor = (ctx) => {
  const formulaFamily = requireFormulaFamily(ctx, LEVER_BALANCE_FORMULA_ID);
  const solveForEffort = pick(ctx.rng, [true, false] as const);
  if (solveForEffort) {
    const Fl = cleanInteger(ctx.rng, 20, 400, 5);
    const dl = cleanInteger(ctx.rng, 1, 5);
    const de = cleanInteger(ctx.rng, 1, 10);
    const formulaInstance = buildFormulaInstance(formulaFamily, "Fe", { Fl, dl, de });
    const given_summary = `Load = ${Fl} N, load-to-pivot distance = ${dl} m, effort-to-pivot distance = ${de} m.`;
    return assembleInstance(
      ctx,
      { Fl, dl, de, target_variable: "Fe", given_summary },
      { formula: formulaInstance },
      quantityAnswer("force", "newton", formulaInstance.result),
    );
  }
  const Fe = cleanInteger(ctx.rng, 10, 200, 5);
  const de = cleanInteger(ctx.rng, 1, 10);
  const dl = cleanInteger(ctx.rng, 1, 5);
  const formulaInstance = buildFormulaInstance(formulaFamily, "Fl", { Fe, de, dl });
  const given_summary = `Effort = ${Fe} N, effort-to-pivot distance = ${de} m, load-to-pivot distance = ${dl} m.`;
  return assembleInstance(
    ctx,
    { Fe, de, dl, target_variable: "Fl", given_summary },
    { formula: formulaInstance },
    quantityAnswer("force", "newton", formulaInstance.result),
  );
};

// ---------------------------------------------------------------------
// foundational.mechanics_work_energy_power -- recognise + calculate
// ---------------------------------------------------------------------

const MECHANICS_CONCEPTS = ["force", "work", "energy", "power", "efficiency"] as const;
type MechanicsConcept = (typeof MECHANICS_CONCEPTS)[number];

/** Derived directly from FP-CONCEPT-FORCE/WORK/ENERGY/POWER/EFFICIENCY-001's own governed statements. */
const MECHANICS_CONCEPT_CLUES: Readonly<Record<MechanicsConcept, string>> = {
  force: "a push or a pull that can change an object's motion, shape, or state of rest",
  work: "done when a force causes its point of application to move through a distance, in the direction of that force",
  energy: "the general capacity to do work",
  power: "the rate at which work is done, or energy is transferred",
  efficiency: "the ratio of useful output to total input, usually expressed as a percentage",
};

const recogniseMechanicsConcept: QuestionExecutor = (ctx) => {
  const concept = pick(ctx.rng, MECHANICS_CONCEPTS);
  return assembleInstance(ctx, { concept_clue: MECHANICS_CONCEPT_CLUES[concept] }, {}, { answer: ctx.blueprint.answer, value: concept });
};

const WORK_FORMULA_ID = "formula.mechanics_work";
const KINETIC_ENERGY_FORMULA_ID = "formula.mechanics_kinetic_energy";
const POTENTIAL_ENERGY_FORMULA_ID = "formula.mechanics_potential_energy";
const POWER_FORMULA_ID = "formula.mechanics_power";
const EFFICIENCY_FORMULA_ID = "formula.mechanics_efficiency";

const calculateWork: QuestionExecutor = (ctx) => {
  const formulaFamily = requireFormulaFamily(ctx, WORK_FORMULA_ID);
  const F = cleanInteger(ctx.rng, 5, 100);
  const d = cleanInteger(ctx.rng, 1, 20);
  const formulaInstance = buildFormulaInstance(formulaFamily, "W", { F, d });
  return assembleInstance(ctx, { F, d }, { formula: formulaInstance }, quantityAnswer("work", "joule", formulaInstance.result));
};

const calculateKineticEnergy: QuestionExecutor = (ctx) => {
  const formulaFamily = requireFormulaFamily(ctx, KINETIC_ENERGY_FORMULA_ID);
  const m = cleanInteger(ctx.rng, 1, 50);
  const v = cleanInteger(ctx.rng, 1, 20);
  const formulaInstance = buildFormulaInstance(formulaFamily, "KE", { m, v });
  return assembleInstance(ctx, { m, v }, { formula: formulaInstance }, quantityAnswer("energy", "joule", formulaInstance.result));
};

const calculatePotentialEnergy: QuestionExecutor = (ctx) => {
  const formulaFamily = requireFormulaFamily(ctx, POTENTIAL_ENERGY_FORMULA_ID);
  const m = cleanInteger(ctx.rng, 1, 50);
  const h = cleanInteger(ctx.rng, 1, 20);
  const formulaInstance = buildFormulaInstance(formulaFamily, "PE", { m, h });
  return assembleInstance(ctx, { m, h }, { formula: formulaInstance }, quantityAnswer("energy", "joule", formulaInstance.result));
};

const calculatePower: QuestionExecutor = (ctx) => {
  const formulaFamily = requireFormulaFamily(ctx, POWER_FORMULA_ID);
  const W = cleanInteger(ctx.rng, 10, 500);
  const t = cleanInteger(ctx.rng, 1, 60);
  const formulaInstance = buildFormulaInstance(formulaFamily, "P", { W, t });
  return assembleInstance(ctx, { W, t }, { formula: formulaInstance }, quantityAnswer("power", "watt", formulaInstance.result));
};

const calculateEfficiency: QuestionExecutor = (ctx) => {
  const formulaFamily = requireFormulaFamily(ctx, EFFICIENCY_FORMULA_ID);
  const Ein = cleanInteger(ctx.rng, 50, 500);
  // Eout is a genuine fraction of Ein (50-95%) so eta stays physically
  // sensible (< 100%), mirroring energy.ts's calculateEfficiency exactly.
  const percentUseful = nextInt(ctx.rng, 50, 95);
  const Eout = Math.round((Ein * percentUseful) / 100);
  const formulaInstance = buildFormulaInstance(formulaFamily, "eta", { Eout, Ein });
  return assembleInstance(ctx, { Eout, Ein }, { formula: formulaInstance }, { answer: ctx.blueprint.answer, value: formulaInstance.result });
};

export const foundationalMechanicsExecutors: Readonly<Record<string, QuestionExecutor>> = {
  "mass_weight.recognise_relationship": recogniseMassOrWeight,
  "levers.identify_class": identifyLeverClass,
  "gears.recognise_ratio_tradeoff": recogniseGearTradeoff,
  "pulleys.recognise_force_distance_tradeoff": recognisePulleyTradeoff,
  "levers.calculate_effort_or_load": calculateLeverBalance,
  "mechanics.recognise_concept": recogniseMechanicsConcept,
  "mechanics.calculate_work": calculateWork,
  "mechanics.calculate_kinetic_energy": calculateKineticEnergy,
  "mechanics.calculate_potential_energy": calculatePotentialEnergy,
  "mechanics.calculate_power": calculatePower,
  "mechanics.calculate_efficiency": calculateEfficiency,
};

export const __internal = {
  MASS_WEIGHT_CLUES,
  LEVER_CLASS_CLUES,
  GEAR_SCENARIO_CLUES,
  GEAR_TRADEOFF_OUTCOME,
  PULLEY_SCENARIO_CLUES,
  PULLEY_TRADEOFF_OUTCOME,
  MECHANICS_CONCEPT_CLUES,
};
