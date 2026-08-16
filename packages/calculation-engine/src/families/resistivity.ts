/**
 * CC-05B2: execution for the 5 `electrical.resistivity` question
 * blueprints. `resistivity.calculate_resistance` routes through
 * formula.resistivity's nested `R = (rho x L) / A` expression via the
 * generic evaluator; the remaining four blueprints are categorical.
 */

import { evaluateFormulaExpression } from "../formula-evaluator.ts";
import { cleanInteger } from "../parameter-generation.ts";
import { pick } from "../seed.ts";
import type { ExpectedAnswer } from "../types.ts";
import { assembleInstance, buildFormulaInstance, requireFormulaFamily, type QuestionExecutor } from "./shared.ts";

const RESISTIVITY_FORMULA_ID = "formula.resistivity";

function quantityAnswer(quantity: string, canonicalUnit: string, value: number): ExpectedAnswer {
  return { answer: { type: "quantity", quantity, canonicalUnit }, value };
}

const recognise: QuestionExecutor = (ctx) => {
  const term = pick(ctx.rng, ["resistance", "resistivity"] as const);
  return assembleInstance(ctx, { term }, {}, { answer: ctx.blueprint.answer, value: term });
};

const calculateResistance: QuestionExecutor = (ctx) => {
  const formulaFamily = requireFormulaFamily(ctx, RESISTIVITY_FORMULA_ID);
  const rho = cleanInteger(ctx.rng, 1, 10);
  const L = cleanInteger(ctx.rng, 1, 20);
  const A = cleanInteger(ctx.rng, 1, 5);
  const bindings = { rho, L, A };
  const R = evaluateFormulaExpression(formulaFamily.forms[0]!.expression, bindings);
  const formulaInstance = buildFormulaInstance(formulaFamily, "R", bindings);
  return assembleInstance(ctx, bindings, { formula: formulaInstance }, quantityAnswer("resistance", "ohm", R));
};

const compareMaterials: QuestionExecutor = (ctx) => {
  const lowerResistivityIsMaterialA = pick(ctx.rng, [true, false] as const);
  const winner = lowerResistivityIsMaterialA ? "material_a" : "material_b";
  return assembleInstance(
    ctx,
    { lower_resistivity_material: winner },
    {},
    { answer: ctx.blueprint.answer, value: winner },
  );
};

const predictLengthEffect: QuestionExecutor = (ctx) => {
  return assembleInstance(ctx, {}, {}, { answer: ctx.blueprint.answer, value: "increase" });
};

const predictAreaEffect: QuestionExecutor = (ctx) => {
  return assembleInstance(ctx, {}, {}, { answer: ctx.blueprint.answer, value: "decrease" });
};

export const resistivityExecutors: Readonly<Record<string, QuestionExecutor>> = {
  "resistivity.recognise": recognise,
  "resistivity.calculate_resistance": calculateResistance,
  "resistivity.compare_materials": compareMaterials,
  "resistivity.predict_length_effect": predictLengthEffect,
  "resistivity.predict_area_effect": predictAreaEffect,
};
