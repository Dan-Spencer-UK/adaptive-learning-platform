/**
 * CC-05B2: execution for the 4 `electrical.energy_and_efficiency`
 * question blueprints, routed through formula.electrical_energy (E = P x
 * t) and formula.electrical_efficiency (eta = Pout/Pin x 100) via the
 * generic evaluator.
 *
 * `energy.calculate_energy_kwh` needs no unit-conversion mechanism: the
 * SAME E = P x t relationship is evaluated with power already generated
 * in kilowatts and time already generated in hours (exactly how a real
 * "2 kW kettle run for 3 hours" kWh word problem is posed), giving
 * kilowatt-hours directly -- not a base-SI-joules value requiring a
 * post-hoc conversion. No blueprint in this family needs an actual
 * numeric unit-scale conversion (task brief §17: only build one if
 * genuinely required).
 */

import { evaluateFormulaExpression, selectFormForKnownVariables } from "../formula-evaluator.ts";
import { cleanInteger } from "../parameter-generation.ts";
import { nextInt, pick } from "../seed.ts";
import type { ExpectedAnswer } from "../types.ts";
import { assembleInstance, buildFormulaInstance, requireFormulaFamily, type QuestionExecutor } from "./shared.ts";

const ENERGY_FORMULA_ID = "formula.electrical_energy";
const EFFICIENCY_FORMULA_ID = "formula.electrical_efficiency";

function quantityAnswer(quantity: string, canonicalUnit: string, value: number): ExpectedAnswer {
  return { answer: { type: "quantity", quantity, canonicalUnit }, value };
}

const calculateEnergy: QuestionExecutor = (ctx) => {
  const formulaFamily = requireFormulaFamily(ctx, ENERGY_FORMULA_ID);
  const P = cleanInteger(ctx.rng, 1, 100);
  const t = cleanInteger(ctx.rng, 1, 60);
  const formulaInstance = buildFormulaInstance(formulaFamily, "E", { P, t });
  return assembleInstance(ctx, { P, t }, { formula: formulaInstance }, quantityAnswer("energy", "joule", formulaInstance.result));
};

const calculateEnergyKwh: QuestionExecutor = (ctx) => {
  const formulaFamily = requireFormulaFamily(ctx, ENERGY_FORMULA_ID);
  const P_kW = cleanInteger(ctx.rng, 1, 10);
  const t_hours = cleanInteger(ctx.rng, 1, 24);
  const form = selectFormForKnownVariables(formulaFamily.forms, "E", ["P", "t"]);
  const E_kwh = evaluateFormulaExpression(form.expression, { P: P_kW, t: t_hours });
  return assembleInstance(
    ctx,
    { P_kW, t_hours },
    {
      formula: {
        formulaFamilyId: formulaFamily.id,
        target: "E",
        substitution: { P: P_kW, t: t_hours },
        result: E_kwh,
        unitSymbol: "kWh",
      },
    },
    quantityAnswer("energy", "kilowatt-hour", E_kwh),
  );
};

const REARRANGE_SCENARIOS = [
  { known: ["E", "t"] as const, target: "P" },
  { known: ["E", "P"] as const, target: "t" },
];

const rearrange: QuestionExecutor = (ctx) => {
  const formulaFamily = requireFormulaFamily(ctx, ENERGY_FORMULA_ID);
  const scenario = pick(ctx.rng, REARRANGE_SCENARIOS);
  const form = selectFormForKnownVariables(formulaFamily.forms, scenario.target, scenario.known);
  return assembleInstance(
    ctx,
    { known: scenario.known.join(",") },
    { formula: { formulaFamilyId: formulaFamily.id, target: form.target, substitution: {}, result: 0, unitSymbol: "" } },
    { answer: ctx.blueprint.answer, value: form.target },
  );
};

const calculateEfficiency: QuestionExecutor = (ctx) => {
  const formulaFamily = requireFormulaFamily(ctx, EFFICIENCY_FORMULA_ID);
  const Pin = cleanInteger(ctx.rng, 50, 500);
  // Pout is a genuine fraction of Pin (50-95%) so eta stays physically
  // sensible (< 100%), never generated independently of Pin.
  const percentUseful = nextInt(ctx.rng, 50, 95);
  const Pout = Math.round((Pin * percentUseful) / 100);
  const formulaInstance = buildFormulaInstance(formulaFamily, "eta", { Pout, Pin });
  return assembleInstance(
    ctx,
    { Pout, Pin },
    { formula: formulaInstance },
    { answer: ctx.blueprint.answer, value: formulaInstance.result },
  );
};

export const energyExecutors: Readonly<Record<string, QuestionExecutor>> = {
  "energy.calculate_energy": calculateEnergy,
  "energy.calculate_energy_kwh": calculateEnergyKwh,
  "energy.rearrange": rearrange,
  "energy.calculate_efficiency": calculateEfficiency,
};
