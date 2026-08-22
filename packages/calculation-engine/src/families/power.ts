/**
 * CC-05B2: execution for the 6 `electrical.power_relationships` question
 * blueprints, all routed through formula.electrical_power's real
 * structured forms via the generic evaluator/`selectFormForKnownVariables`
 * (never ad hoc arithmetic for the calculation blueprints).
 */

import { evaluateFormulaExpression, selectFormForKnownVariables } from "../formula-evaluator.ts";
import { cleanInteger } from "../parameter-generation.ts";
import { pick } from "../seed.ts";
import type { ExpectedAnswer } from "../types.ts";
import { assembleInstance, buildFormulaInstance, requireFormulaFamily, type QuestionExecutor } from "./shared.ts";

const POWER_FORMULA_ID = "formula.electrical_power";
const VOLTAGE_MIN = 1;
const VOLTAGE_MAX = 24;
const CURRENT_MIN = 1;
const CURRENT_MAX = 10;
const RESISTANCE_MIN = 1;
const RESISTANCE_MAX = 50;

function quantityAnswer(quantity: string, canonicalUnit: string, value: number): ExpectedAnswer {
  return { answer: { type: "quantity", quantity, canonicalUnit }, value };
}

const recogniseRelationship: QuestionExecutor = (ctx) => {
  return assembleInstance(ctx, {}, {}, { answer: ctx.blueprint.answer, value: "P" });
};

// Each scenario names exactly the two known variables and the (necessarily
// different) target that formula.electrical_power's real forms solve for
// from that pair -- derived directly from the 5 governed forms, not guessed.
const KNOWN_VARIABLES_TO_TARGET: ReadonlyArray<{ known: readonly [string, string]; target: string }> = [
  { known: ["V", "I"], target: "P" },
  { known: ["I", "R"], target: "P" },
  { known: ["V", "R"], target: "P" },
  { known: ["P", "I"], target: "V" },
  { known: ["P", "V"], target: "I" },
];

const selectForm: QuestionExecutor = (ctx) => {
  const formulaFamily = requireFormulaFamily(ctx, POWER_FORMULA_ID);
  const scenario = pick(ctx.rng, KNOWN_VARIABLES_TO_TARGET);
  // Proves the scenario is genuinely resolvable through the real formula family
  // (throws if this executor's own known/target pairing were ever wrong).
  const form = selectFormForKnownVariables(formulaFamily.forms, scenario.target, scenario.known);
  return assembleInstance(
    ctx,
    { known: scenario.known.join(",") },
    { formula: { formulaFamilyId: formulaFamily.id, target: form.target, substitution: {}, result: 0, unitSymbol: "" } },
    { answer: ctx.blueprint.answer, value: form.target },
  );
};

const calculateFromVi: QuestionExecutor = (ctx) => {
  const formulaFamily = requireFormulaFamily(ctx, POWER_FORMULA_ID);
  const V = cleanInteger(ctx.rng, VOLTAGE_MIN, VOLTAGE_MAX);
  const I = cleanInteger(ctx.rng, CURRENT_MIN, CURRENT_MAX);
  const formulaInstance = buildFormulaInstance(formulaFamily, "P", { V, I });
  return assembleInstance(ctx, { V, I }, { formula: formulaInstance }, quantityAnswer("power", "watt", formulaInstance.result));
};

const calculateFromIr: QuestionExecutor = (ctx) => {
  const formulaFamily = requireFormulaFamily(ctx, POWER_FORMULA_ID);
  const I = cleanInteger(ctx.rng, CURRENT_MIN, CURRENT_MAX);
  const R = cleanInteger(ctx.rng, RESISTANCE_MIN, RESISTANCE_MAX);
  const form = selectFormForKnownVariables(formulaFamily.forms, "P", ["I", "R"]);
  const P = evaluateFormulaExpression(form.expression, { I, R });
  return assembleInstance(
    ctx,
    { I, R },
    { formula: { formulaFamilyId: formulaFamily.id, target: "P", substitution: { I, R }, result: P, unitSymbol: "W" } },
    quantityAnswer("power", "watt", P),
  );
};

const calculateFromVr: QuestionExecutor = (ctx) => {
  const formulaFamily = requireFormulaFamily(ctx, POWER_FORMULA_ID);
  const V = cleanInteger(ctx.rng, VOLTAGE_MIN, VOLTAGE_MAX);
  const R = cleanInteger(ctx.rng, RESISTANCE_MIN, RESISTANCE_MAX);
  const form = selectFormForKnownVariables(formulaFamily.forms, "P", ["V", "R"]);
  const P = evaluateFormulaExpression(form.expression, { V, R });
  return assembleInstance(
    ctx,
    { V, R },
    { formula: { formulaFamilyId: formulaFamily.id, target: "P", substitution: { V, R }, result: P, unitSymbol: "W" } },
    quantityAnswer("power", "watt", P),
  );
};

const calculateTotal: QuestionExecutor = (ctx) => {
  const componentCount = pick(ctx.rng, [2, 3] as const);
  const powers: Record<string, number> = {};
  const symbols: string[] = [];
  for (let i = 0; i < componentCount; i++) {
    const symbol = `P${i + 1}`;
    powers[symbol] = cleanInteger(ctx.rng, 1, 100);
    symbols.push(symbol);
  }
  // "Total power = sum of individual component powers" is not itself a
  // named CC-05A formula family (only the individual power relationships
  // are) -- it is still evaluated through the SAME generic evaluator via
  // a locally-built "add" expression, never raw JS addition.
  const total = evaluateFormulaExpression({ operation: "add", operands: symbols }, powers);
  // `summary` is a safe, always-present param for `presentation.promptLines`:
  // the individual P1/P2/(P3) keys vary in count by seed, so a single static
  // prompt line can't reference them directly (component_count mirrors the
  // series/parallel calculate-total-resistance precedent).
  const summary = symbols.map((symbol) => `${symbol} = ${powers[symbol]} W`).join(", ");
  return assembleInstance(ctx, { ...powers, component_count: componentCount, summary }, {}, quantityAnswer("power", "watt", total));
};

export const powerExecutors: Readonly<Record<string, QuestionExecutor>> = {
  "power.recognise_relationship": recogniseRelationship,
  "power.select_form": selectForm,
  "power.calculate_from_vi": calculateFromVi,
  "power.calculate_from_ir": calculateFromIr,
  "power.calculate_from_vr": calculateFromVr,
  "power.calculate_total": calculateTotal,
};
