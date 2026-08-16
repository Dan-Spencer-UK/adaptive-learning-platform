/**
 * CC-05B2: execution for the 4 remaining small categorical families:
 * `electrical.thermal_and_chemical_effects` (2) and
 * `electrical.conductors_and_insulators` (2). No formula family or
 * diagram is involved in either.
 */

import { pick } from "../seed.ts";
import { assembleInstance, type QuestionExecutor } from "./shared.ts";

const recogniseThermalChemicalEffect: QuestionExecutor = (ctx) => {
  const scenario = pick(ctx.rng, ["thermal", "chemical"] as const);
  return assembleInstance(ctx, { scenario }, {}, { answer: ctx.blueprint.answer, value: scenario });
};

const recogniseThermalApplication: QuestionExecutor = (ctx) => {
  // The blueprint's declared options are ["heating_element", "filament_lamp",
  // "relay_coil"] -- the third is a genuine distractor (a relay operates via
  // electromagnetism, not the thermal effect), so the generator only ever
  // presents one of the two genuinely thermal examples as the question's
  // subject; "relay_coil" remains a valid wrong option for a learner UI to
  // offer, just never the presented/correct scenario here.
  const application = pick(ctx.rng, ["heating_element", "filament_lamp"] as const);
  return assembleInstance(ctx, { application }, {}, { answer: ctx.blueprint.answer, value: application });
};

const classifyMaterial: QuestionExecutor = (ctx) => {
  const classification = pick(ctx.rng, ["conductor", "insulator"] as const);
  return assembleInstance(ctx, { classification }, {}, { answer: ctx.blueprint.answer, value: classification });
};

const recogniseBreakdown: QuestionExecutor = (ctx) => {
  return assembleInstance(ctx, {}, {}, { answer: ctx.blueprint.answer, value: "breaks_down_and_conducts" });
};

export const thermalAndConductorsExecutors: Readonly<Record<string, QuestionExecutor>> = {
  "thermal_chemical.recognise_effect": recogniseThermalChemicalEffect,
  "thermal_chemical.recognise_application": recogniseThermalApplication,
  "conductors.classify_material": classifyMaterial,
  "conductors.recognise_breakdown": recogniseBreakdown,
};
