/**
 * CC-05B2: execution for the 2 `electrical.charge_and_current` question
 * blueprints, routed through formula.charge_current (I = Q / t) via the
 * generic evaluator.
 */

import { cleanInteger } from "../parameter-generation.ts";
import { pick } from "../seed.ts";
import { assembleInstance, buildFormulaInstance, requireFormulaFamily, type QuestionExecutor } from "./shared.ts";

const CHARGE_FORMULA_ID = "formula.charge_current";

const recognise: QuestionExecutor = (ctx) => {
  return assembleInstance(ctx, {}, {}, { answer: ctx.blueprint.answer, value: "I" });
};

const calculate: QuestionExecutor = (ctx) => {
  const formulaFamily = requireFormulaFamily(ctx, CHARGE_FORMULA_ID);
  const I = cleanInteger(ctx.rng, 1, 10);
  const t = cleanInteger(ctx.rng, 1, 30);
  const qFormulaInstance = buildFormulaInstance(formulaFamily, "Q", { I, t });
  const Q = qFormulaInstance.result;

  const target = pick(ctx.rng, ["I", "Q"] as const);
  if (target === "I") {
    const formulaInstance = buildFormulaInstance(formulaFamily, "I", { Q, t });
    return assembleInstance(
      ctx,
      // `given_summary` is a safe, always-present param for
      // `presentation.promptLines`: the branch-specific known values (Q vs
      // I) can't both be templated in a single static prompt line (one is
      // always undefined), so the executor renders the known pair itself.
      { Q, t, target_variable: target, given_summary: `Q = ${Q} C, t = ${t} s` },
      { formula: formulaInstance },
      { answer: { type: "quantity", quantity: "charge_or_current", canonicalUnit: "coulomb_or_ampere" }, value: I },
    );
  }
  return assembleInstance(
    ctx,
    { I, t, target_variable: target, given_summary: `I = ${I} A, t = ${t} s` },
    { formula: qFormulaInstance },
    { answer: { type: "quantity", quantity: "charge_or_current", canonicalUnit: "coulomb_or_ampere" }, value: Q },
  );
};

export const chargeExecutors: Readonly<Record<string, QuestionExecutor>> = {
  "charge.recognise": recognise,
  "charge.calculate": calculate,
};
