/**
 * CC-05B2: execution for the 2 `electrical.emf_and_generation` question
 * blueprints. `describe_ac_generation` declares its diagram as optional
 * (`required: false`), so no DiagramInstance is emitted for it -- nothing
 * was promised, so omitting it is not a silent fallback.
 */

import { pick } from "../seed.ts";
import { assembleInstance, type QuestionExecutor } from "./shared.ts";

const distinguishEmfTerminalVoltage: QuestionExecutor = (ctx) => {
  const scenario = pick(ctx.rng, ["measured_with_no_current_flowing", "measured_while_supplying_current"] as const);
  const expected = scenario === "measured_with_no_current_flowing" ? "emf" : "terminal_voltage";
  return assembleInstance(ctx, { scenario }, {}, { answer: ctx.blueprint.answer, value: expected });
};

const describeAcGeneration: QuestionExecutor = (ctx) => {
  return assembleInstance(ctx, {}, {}, { answer: ctx.blueprint.answer, value: "sine_wave" });
};

export const emfExecutors: Readonly<Record<string, QuestionExecutor>> = {
  "emf.distinguish_emf_terminal_voltage": distinguishEmfTerminalVoltage,
  "emf.describe_ac_generation": describeAcGeneration,
};
