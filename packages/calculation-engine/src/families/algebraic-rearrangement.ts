/**
 * CC-08: execution for the 2 `foundational.algebraic_technique` question
 * blueprints (foundational.rearrange_multiplicative,
 * foundational.rearrange_additive). Deliberately abstract/non-electrical
 * (a, b, c -- no physical quantity or unit), restating governed
 * assertions FM-ALG-TRANSPOSE-MULT-001 / FM-ALG-TRANSPOSE-ADD-001
 * directly, through the same generic formula-evaluator/marking machinery
 * every Electrical family uses (../formula-evaluator.ts), never a
 * bespoke mechanism.
 */

import { evaluateFormulaExpression } from "../formula-evaluator.ts";
import { cleanInteger } from "../parameter-generation.ts";
import type { ExpectedAnswer } from "../types.ts";
import { assembleInstance, buildFormulaInstance, requireFormulaFamily, type QuestionExecutor } from "./shared.ts";

const MULTIPLICATIVE_FORMULA_ID = "formula.algebraic_rearrangement_multiplicative";
const ADDITIVE_FORMULA_ID = "formula.algebraic_rearrangement_additive";
const FACTOR_MIN = 2;
const FACTOR_MAX = 12;
const TERM_MIN = 1;
const TERM_MAX = 50;

function quantityAnswer(value: number): ExpectedAnswer {
  return { answer: { type: "quantity", quantity: "value", canonicalUnit: "unit" }, value };
}

const rearrangeMultiplicative: QuestionExecutor = (ctx) => {
  const formulaFamily = requireFormulaFamily(ctx, MULTIPLICATIVE_FORMULA_ID);
  const b = cleanInteger(ctx.rng, FACTOR_MIN, FACTOR_MAX);
  const c = cleanInteger(ctx.rng, FACTOR_MIN, FACTOR_MAX);
  const a = evaluateFormulaExpression(formulaFamily.forms.find((f) => f.target === "a")!.expression, { b, c });
  const formulaInstance = buildFormulaInstance(formulaFamily, "b", { a, c });
  return assembleInstance(ctx, { a, c }, { formula: formulaInstance }, quantityAnswer(formulaInstance.result));
};

const rearrangeAdditive: QuestionExecutor = (ctx) => {
  const formulaFamily = requireFormulaFamily(ctx, ADDITIVE_FORMULA_ID);
  const b = cleanInteger(ctx.rng, TERM_MIN, TERM_MAX);
  const c = cleanInteger(ctx.rng, TERM_MIN, TERM_MAX);
  const a = evaluateFormulaExpression(formulaFamily.forms.find((f) => f.target === "a")!.expression, { b, c });
  const formulaInstance = buildFormulaInstance(formulaFamily, "b", { a, c });
  return assembleInstance(ctx, { a, c }, { formula: formulaInstance }, quantityAnswer(formulaInstance.result));
};

export const algebraicRearrangementExecutors: Readonly<Record<string, QuestionExecutor>> = {
  "foundational.rearrange_multiplicative": rearrangeMultiplicative,
  "foundational.rearrange_additive": rearrangeAdditive,
};
