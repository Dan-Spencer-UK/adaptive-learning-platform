/**
 * CC-05B2: execution for the 4 remaining small categorical families:
 * `electrical.thermal_and_chemical_effects` (2) and
 * `electrical.conductors_and_insulators` (2). No formula family or
 * diagram is involved in either.
 */

import { pick } from "../seed.ts";
import { assembleInstance, type QuestionExecutor } from "./shared.ts";

// Learner-facing clue text for `presentation.promptLines` -- restates
// EL-CURRENT-THERMAL-EFFECT-001/EL-CURRENT-CHEMICAL-EFFECT-001's own
// governed definitions with the answer word itself withheld.
const THERMAL_CHEMICAL_CLUES: Readonly<Record<string, string>> = {
  thermal: "Current flowing through a resistance causes heating, because electrical energy is converted into heat energy.",
  chemical: "Current flowing through certain solutions (electrolytes) causes changes in the solution, a process known as electrolysis.",
};

const recogniseThermalChemicalEffect: QuestionExecutor = (ctx) => {
  const scenario = pick(ctx.rng, ["thermal", "chemical"] as const);
  return assembleInstance(ctx, { scenario, effect_clue: THERMAL_CHEMICAL_CLUES[scenario]! }, {}, { answer: ctx.blueprint.answer, value: scenario });
};

// Learner-facing clue text for the two genuinely thermal-effect
// applications (EL-THERMAL-EFFECT-APPLICATION-001), answer word withheld.
const THERMAL_APPLICATION_CLUES: Readonly<Record<string, string>> = {
  heating_element: "A device that converts electrical energy directly into heat for space heating or cooking, such as a kettle element.",
  filament_lamp: "A device whose thin wire filament is heated by current until it glows, producing light as a result.",
};

const recogniseThermalApplication: QuestionExecutor = (ctx) => {
  // The blueprint's declared options are ["heating_element", "filament_lamp",
  // "relay_coil"] -- the third is a genuine distractor (a relay operates via
  // electromagnetism, not the thermal effect), so the generator only ever
  // presents one of the two genuinely thermal examples as the question's
  // subject; "relay_coil" remains a valid wrong option for a learner UI to
  // offer, just never the presented/correct scenario here.
  const application = pick(ctx.rng, ["heating_element", "filament_lamp"] as const);
  return assembleInstance(
    ctx,
    { application, application_clue: THERMAL_APPLICATION_CLUES[application]! },
    {},
    { answer: ctx.blueprint.answer, value: application },
  );
};

// EL-MATERIAL-CONDUCTOR-INSULATOR-EXAMPLES-001's own named examples --
// showing the material lets the learner classify it themselves instead of
// being told the classification directly.
const CONDUCTOR_MATERIALS = ["copper", "aluminium"] as const;
const INSULATOR_MATERIALS = ["PVC", "rubber"] as const;

const classifyMaterial: QuestionExecutor = (ctx) => {
  const classification = pick(ctx.rng, ["conductor", "insulator"] as const);
  const material = classification === "conductor" ? pick(ctx.rng, CONDUCTOR_MATERIALS) : pick(ctx.rng, INSULATOR_MATERIALS);
  return assembleInstance(ctx, { material, classification }, {}, { answer: ctx.blueprint.answer, value: classification });
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
