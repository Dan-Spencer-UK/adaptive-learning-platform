/**
 * CC-05B: execution for the 10 `electrical.ohms_law` question blueprints
 * (scripts/content/data/cc05a-pedagogy-unit202.ts). Every calculation
 * goes through ../formula-evaluator.ts against formula.ohms_law's
 * governed structured forms -- nothing here recomputes V=IR with ad hoc
 * arithmetic.
 */

import { evaluateFormulaExpression } from "../formula-evaluator.ts";
import { cleanInteger } from "../parameter-generation.ts";
import { pick } from "../seed.ts";
import type { ExpectedAnswer, GeneratedQuestionInstance } from "../types.ts";
import {
  assembleInstance,
  buildFormulaInstance,
  buildWorkedExampleInstance,
  requireFormulaFamily,
  variableUnitSymbol,
  type GenerationContext,
  type QuestionExecutor,
} from "./shared.ts";

const FORMULA_FAMILY_ID = "formula.ohms_law";
const CURRENT_MIN = 1;
const CURRENT_MAX = 10;
const RESISTANCE_MIN = 1;
const RESISTANCE_MAX = 50;

/** Generates I, R and derives the exact (integer, never-rounded) V = I x R via the governed formula form. */
function generateFromIR(ctx: GenerationContext): { I: number; R: number; V: number } {
  const formulaFamily = requireFormulaFamily(ctx, FORMULA_FAMILY_ID);
  const I = cleanInteger(ctx.rng, CURRENT_MIN, CURRENT_MAX);
  const R = cleanInteger(ctx.rng, RESISTANCE_MIN, RESISTANCE_MAX);
  const V = evaluateFormulaExpression(formulaFamily.forms.find((f) => f.target === "V")!.expression, { I, R });
  return { I, R, V };
}

function quantityAnswer(quantity: string, canonicalUnit: string, value: number): ExpectedAnswer {
  return { answer: { type: "quantity", quantity, canonicalUnit }, value };
}

const solveForVoltage: QuestionExecutor = (ctx) => {
  const { I, R, V } = generateFromIR(ctx);
  const formulaFamily = requireFormulaFamily(ctx, FORMULA_FAMILY_ID);
  const formulaInstance = buildFormulaInstance(formulaFamily, "V", { I, R });
  return assembleInstance(ctx, { I, R }, { formula: formulaInstance }, quantityAnswer("voltage", "volt", V));
};

const solveForCurrent: QuestionExecutor = (ctx) => {
  // Generate R and a clean target current, derive V = I x R via the formula
  // (never V/R directly) so the division the question asks the learner to
  // perform (I = V / R) is guaranteed to land on the same clean integer.
  const { I, R, V } = generateFromIR(ctx);
  const formulaFamily = requireFormulaFamily(ctx, FORMULA_FAMILY_ID);
  const formulaInstance = buildFormulaInstance(formulaFamily, "I", { V, R });
  return assembleInstance(ctx, { V, R }, { formula: formulaInstance }, quantityAnswer("current", "ampere", I));
};

const solveForResistance: QuestionExecutor = (ctx) => {
  const { I, R, V } = generateFromIR(ctx);
  const formulaFamily = requireFormulaFamily(ctx, FORMULA_FAMILY_ID);
  const formulaInstance = buildFormulaInstance(formulaFamily, "R", { V, I });
  return assembleInstance(ctx, { V, I }, { formula: formulaInstance }, quantityAnswer("resistance", "ohm", R));
};

const selectRearrangement: QuestionExecutor = (ctx) => {
  const target = pick(ctx.rng, ["V", "I", "R"] as const);
  const { I, R, V } = generateFromIR(ctx);
  const formulaFamily = requireFormulaFamily(ctx, FORMULA_FAMILY_ID);
  const formulaInstance = buildFormulaInstance(formulaFamily, target, { V, I, R });
  return assembleInstance(
    ctx,
    { V, I, R, target_variable: target },
    { formula: formulaInstance },
    { answer: ctx.blueprint.answer, value: target },
  );
};

const matchVariablesUnits: QuestionExecutor = (ctx) => {
  const { I, R, V } = generateFromIR(ctx);
  const formulaFamily = requireFormulaFamily(ctx, FORMULA_FAMILY_ID);
  const expectedPairs = ["V", "I", "R"].map((symbol) => `${symbol}:${variableUnitSymbol(formulaFamily, symbol)}`);
  return assembleInstance(ctx, { V, I, R }, {}, { answer: ctx.blueprint.answer, value: expectedPairs });
};

const substitution: QuestionExecutor = (ctx) => {
  const { I, R, V } = generateFromIR(ctx);
  const formulaFamily = requireFormulaFamily(ctx, FORMULA_FAMILY_ID);
  const formulaInstance = buildFormulaInstance(formulaFamily, "V", { I, R });
  const workedExample = buildWorkedExampleInstance(formulaFamily, "V", { I, R }, [
    "show_formula",
    "substitute_values",
    "calculate",
    "show_answer_with_unit",
  ]);
  return assembleInstance(
    ctx,
    { I, R },
    { formula: formulaInstance, workedExample },
    quantityAnswer("voltage", "volt", V),
  );
};

/** The fixed classification vocabulary shared by all three ohms_law diagnostic blueprints. */
type OhmsLawErrorClassification = "rearrangement_error" | "wrong_operation" | "unrelated_symbols" | "no_error";

function diagnosticInstance(
  ctx: GenerationContext,
  classification: OhmsLawErrorClassification,
  shownWorking: Readonly<Record<string, number>>,
): GeneratedQuestionInstance {
  return assembleInstance(ctx, shownWorking, {}, { answer: ctx.blueprint.answer, value: classification });
}

const diagnoseRearrangementError: QuestionExecutor = (ctx) => {
  const { I, R, V } = generateFromIR(ctx);
  // A genuine rearrangement error solving for R: swaps numerator/denominator (R = I / V instead of V / I).
  const shownR = I / V;
  return diagnosticInstance(ctx, "rearrangement_error", { V, I, R, shown_R: shownR });
};

const diagnoseWrongOperation: QuestionExecutor = (ctx) => {
  const { I, R, V } = generateFromIR(ctx);
  // A wrong-operation error solving for I: multiplies instead of dividing (I = V x R instead of V / R).
  const shownI = V * R;
  return diagnosticInstance(ctx, "wrong_operation", { V, I, R, shown_I: shownI });
};

const diagnoseUnrelatedSymbols: QuestionExecutor = (ctx) => {
  const { I, R, V } = generateFromIR(ctx);
  // Substitutes an unrelated generated value (not R) into the resistance slot when solving for I.
  const unrelatedValue = cleanInteger(ctx.rng, RESISTANCE_MIN, RESISTANCE_MAX);
  const shownI = V / unrelatedValue;
  return diagnosticInstance(ctx, "unrelated_symbols", { V, I, R, unrelated_value: unrelatedValue, shown_I: shownI });
};

const plausibilityCheck: QuestionExecutor = (ctx) => {
  const { I, R, V } = generateFromIR(ctx);
  const outcome = pick(ctx.rng, ["plausible", "too_high", "too_low"] as const);
  const shownV = outcome === "plausible" ? V : outcome === "too_high" ? V * R : V / R;
  return assembleInstance(ctx, { I, R, shown_V: shownV }, {}, { answer: ctx.blueprint.answer, value: outcome });
};

export const ohmsLawExecutors: Readonly<Record<string, QuestionExecutor>> = {
  "ohms_law.solve_for_voltage": solveForVoltage,
  "ohms_law.solve_for_current": solveForCurrent,
  "ohms_law.solve_for_resistance": solveForResistance,
  "ohms_law.select_rearrangement": selectRearrangement,
  "ohms_law.match_variables_units": matchVariablesUnits,
  "ohms_law.substitution": substitution,
  "ohms_law.diagnose_rearrangement_error": diagnoseRearrangementError,
  "ohms_law.diagnose_wrong_operation": diagnoseWrongOperation,
  "ohms_law.diagnose_unrelated_symbols": diagnoseUnrelatedSymbols,
  "ohms_law.plausibility_check": plausibilityCheck,
};
