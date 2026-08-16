/**
 * CC-05B2: execution for the 4 `electrical.fault_conditions_protection`
 * question blueprints. No formula family or diagram is involved -- all
 * four are categorical recognition/prediction/comparison questions.
 */

import { pick } from "../seed.ts";
import { assembleInstance, type QuestionExecutor } from "./shared.ts";

const recogniseCondition: QuestionExecutor = (ctx) => {
  const condition = pick(ctx.rng, ["short_circuit", "open_circuit"] as const);
  return assembleInstance(ctx, { condition }, {}, { answer: ctx.blueprint.answer, value: condition });
};

const predictShortEffect: QuestionExecutor = (ctx) => {
  return assembleInstance(ctx, {}, {}, { answer: ctx.blueprint.answer, value: "current_increases_sharply" });
};

const selectProtectiveDevice: QuestionExecutor = (ctx) => {
  const scenario = pick(ctx.rng, ["low_cost_one_time_protection", "frequent_reset_required"] as const);
  const expected = scenario === "low_cost_one_time_protection" ? "fuse" : "circuit_breaker";
  return assembleInstance(ctx, { scenario }, {}, { answer: ctx.blueprint.answer, value: expected });
};

const compareFuseBreaker: QuestionExecutor = (ctx) => {
  const askedAbout = pick(ctx.rng, ["must_be_replaced_after_operating", "can_be_reset_and_reused"] as const);
  const expected = askedAbout === "must_be_replaced_after_operating" ? "fuse" : "circuit_breaker";
  return assembleInstance(ctx, { asked_about: askedAbout }, {}, { answer: ctx.blueprint.answer, value: expected });
};

export const faultExecutors: Readonly<Record<string, QuestionExecutor>> = {
  "fault.recognise_condition": recogniseCondition,
  "fault.predict_short_effect": predictShortEffect,
  "fault.select_protective_device": selectProtectiveDevice,
  "fault.compare_fuse_breaker": compareFuseBreaker,
};
