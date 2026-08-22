/**
 * CC-09E: execution for the 2 `electrical.ac_reactive_quantities`
 * question blueprints -- both purely categorical/definitional (no numeric
 * AC reactive-quantity calculation engine exists or is added by this
 * package, matching the family's own narrow reclassification comment in
 * cc05a-pedagogy-unit202.ts).
 *
 * `selectImpedanceFormula` mirrors ../families/emf.ts's `describeAcGeneration`
 * precedent exactly -- a single fixed governed fact, no seed-dependent
 * variation, since there is only one correct governed impedance formula to
 * recognise (EL-REL-IMPEDANCE-001). `identifyReactanceUnit` mirrors
 * ../families/units-and-quantities.ts's `identifyUnit` pattern.
 */

import { pick } from "../seed.ts";
import { assembleInstance, type QuestionExecutor } from "./shared.ts";

const recognise: QuestionExecutor = (ctx) => {
  const quantity = pick(ctx.rng, ["reactance", "impedance", "inductance", "capacitance", "power_factor"] as const);
  return assembleInstance(ctx, { quantity }, {}, { answer: ctx.blueprint.answer, value: quantity });
};

const selectImpedanceFormula: QuestionExecutor = (ctx) => {
  return assembleInstance(ctx, {}, {}, { answer: ctx.blueprint.answer, value: "sqrt_r2_plus_x2" });
};

const identifyReactanceUnit: QuestionExecutor = (ctx) => {
  return assembleInstance(ctx, {}, {}, { answer: ctx.blueprint.answer, value: "ohm" });
};

export const acReactiveQuantitiesExecutors: Readonly<Record<string, QuestionExecutor>> = {
  "ac_reactive.recognise": recognise,
  "ac_reactive.select_impedance_formula": selectImpedanceFormula,
  "ac_reactive.identify_reactance_unit": identifyReactanceUnit,
};
