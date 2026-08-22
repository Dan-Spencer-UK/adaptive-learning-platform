/**
 * CC-05B2: execution for the 4 `electrical.fault_conditions_protection`
 * question blueprints. No formula family or diagram is involved -- all
 * four are categorical recognition/prediction/comparison questions.
 */

import { pick } from "../seed.ts";
import { assembleInstance, type QuestionExecutor } from "./shared.ts";

// Learner-facing clue text for `presentation.promptLines` -- restates
// EL-CIRCUIT-RECOGNISE-SHORT-CIRCUIT-001/OPEN-CIRCUIT-001's own governed
// definitions with the fault-condition name withheld.
const CONDITION_CLUES: Readonly<Record<string, string>> = {
  short_circuit: "An unintended low-resistance path that causes abnormally high current to flow.",
  open_circuit: "An unintended break in the current path that prevents current from flowing.",
};

const recogniseCondition: QuestionExecutor = (ctx) => {
  const condition = pick(ctx.rng, ["short_circuit", "open_circuit"] as const);
  return assembleInstance(
    ctx,
    { condition, condition_clue: CONDITION_CLUES[condition]! },
    {},
    { answer: ctx.blueprint.answer, value: condition },
  );
};

const predictShortEffect: QuestionExecutor = (ctx) => {
  return assembleInstance(ctx, {}, {}, { answer: ctx.blueprint.answer, value: "current_increases_sharply" });
};

const SCENARIO_TEXT: Readonly<Record<string, string>> = {
  low_cost_one_time_protection: "A low-cost, one-time overcurrent protection device is needed; it does not need to be reused after operating.",
  frequent_reset_required: "The protection device needs to be reset and reused quickly and repeatedly, without buying a replacement each time.",
};

const selectProtectiveDevice: QuestionExecutor = (ctx) => {
  const scenario = pick(ctx.rng, ["low_cost_one_time_protection", "frequent_reset_required"] as const);
  const expected = scenario === "low_cost_one_time_protection" ? "fuse" : "circuit_breaker";
  return assembleInstance(ctx, { scenario, scenario_text: SCENARIO_TEXT[scenario]! }, {}, { answer: ctx.blueprint.answer, value: expected });
};

const ASKED_ABOUT_TEXT: Readonly<Record<string, string>> = {
  must_be_replaced_after_operating: "must be replaced with a new one after it operates",
  can_be_reset_and_reused: "can simply be reset and reused after it operates",
};

const compareFuseBreaker: QuestionExecutor = (ctx) => {
  const askedAbout = pick(ctx.rng, ["must_be_replaced_after_operating", "can_be_reset_and_reused"] as const);
  const expected = askedAbout === "must_be_replaced_after_operating" ? "fuse" : "circuit_breaker";
  return assembleInstance(
    ctx,
    { asked_about: askedAbout, asked_about_text: ASKED_ABOUT_TEXT[askedAbout]! },
    {},
    { answer: ctx.blueprint.answer, value: expected },
  );
};

export const faultExecutors: Readonly<Record<string, QuestionExecutor>> = {
  "fault.recognise_condition": recogniseCondition,
  "fault.predict_short_effect": predictShortEffect,
  "fault.select_protective_device": selectProtectiveDevice,
  "fault.compare_fuse_breaker": compareFuseBreaker,
};
