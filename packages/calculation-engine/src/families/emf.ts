/**
 * CC-05B2: execution for the `electrical.emf_and_generation` question
 * blueprints. `describe_ac_generation` declares its diagram as optional
 * (`required: false`), so no DiagramInstance is emitted for it -- nothing
 * was promised, so omitting it is not a silent fallback.
 *
 * CC-09E adds `calculateFluxChange`, routed through formula.flux_change_emf
 * (e = (change in flux) / (time taken)) via the generic evaluator -- the
 * direct sample-analogue archetype for the official 2365-602 sample's item
 * 35 (see cc05a-pedagogy-unit202.ts's own assessmentStyleEvidence note).
 */

import { cleanInteger } from "../parameter-generation.ts";
import { pick } from "../seed.ts";
import { assembleInstance, buildFormulaInstance, requireFormulaFamily, type QuestionExecutor } from "./shared.ts";

const FLUX_CHANGE_EMF_FORMULA_ID = "formula.flux_change_emf";

const distinguishEmfTerminalVoltage: QuestionExecutor = (ctx) => {
  const scenario = pick(ctx.rng, ["measured_with_no_current_flowing", "measured_while_supplying_current"] as const);
  const expected = scenario === "measured_with_no_current_flowing" ? "emf" : "terminal_voltage";
  return assembleInstance(ctx, { scenario }, {}, { answer: ctx.blueprint.answer, value: expected });
};

const describeAcGeneration: QuestionExecutor = (ctx) => {
  return assembleInstance(ctx, {}, {}, { answer: ctx.blueprint.answer, value: "sine_wave" });
};

const calculateFluxChange: QuestionExecutor = (ctx) => {
  const formulaFamily = requireFormulaFamily(ctx, FLUX_CHANGE_EMF_FORMULA_ID);
  const deltaPhi = cleanInteger(ctx.rng, 1, 20);
  const deltaT = cleanInteger(ctx.rng, 1, 60);
  const eFormulaInstance = buildFormulaInstance(formulaFamily, "e", { deltaPhi, deltaT });
  const e = eFormulaInstance.result;

  const target = pick(ctx.rng, ["e", "deltaPhi", "deltaT"] as const);
  if (target === "deltaPhi") {
    const formulaInstance = buildFormulaInstance(formulaFamily, "deltaPhi", { e, deltaT });
    return assembleInstance(
      ctx,
      { e, deltaT, target_variable: target },
      { formula: formulaInstance },
      { answer: ctx.blueprint.answer, value: deltaPhi },
    );
  }
  if (target === "deltaT") {
    const formulaInstance = buildFormulaInstance(formulaFamily, "deltaT", { deltaPhi, e });
    return assembleInstance(
      ctx,
      { deltaPhi, e, target_variable: target },
      { formula: formulaInstance },
      { answer: ctx.blueprint.answer, value: deltaT },
    );
  }
  return assembleInstance(
    ctx,
    { deltaPhi, deltaT, target_variable: target },
    { formula: eFormulaInstance },
    { answer: ctx.blueprint.answer, value: e },
  );
};

export const emfExecutors: Readonly<Record<string, QuestionExecutor>> = {
  "emf.distinguish_emf_terminal_voltage": distinguishEmfTerminalVoltage,
  "emf.describe_ac_generation": describeAcGeneration,
  "emf.calculate_flux_change": calculateFluxChange,
};
