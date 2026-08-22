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

// Learner-facing clue text for `presentation.promptLines` -- the same
// governed EL-CONCEPT-RESISTANCE-001/EL-CONCEPT-RESISTIVITY-001 definitions
// with the term itself withheld (both statements name their own term in
// the opening words, so quoting them whole would hand the learner the
// multiple-choice answer).
const RECOGNISE_CLUES: Readonly<Record<string, string>> = {
  resistance: "the opposition a specific component presents to current flow, which depends on that component's length and cross-sectional area",
  resistivity: "a material property describing how strongly a material opposes current flow, independent of the conductor's length or cross-sectional area",
};

const recognise: QuestionExecutor = (ctx) => {
  const term = pick(ctx.rng, ["resistance", "resistivity"] as const);
  return assembleInstance(ctx, { term, recognise_clue: RECOGNISE_CLUES[term]! }, {}, { answer: ctx.blueprint.answer, value: term });
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
  const resistivityA = cleanInteger(ctx.rng, 1, 100);
  let resistivityB = cleanInteger(ctx.rng, 1, 100);
  while (resistivityB === resistivityA) resistivityB = cleanInteger(ctx.rng, 1, 100);
  const winner = resistivityA < resistivityB ? "material_a" : "material_b";
  return assembleInstance(
    ctx,
    { resistivity_a: resistivityA, resistivity_b: resistivityB },
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
