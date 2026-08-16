/**
 * CC-05B2: execution for the 5 `electrical.si_units` (3) and
 * `electrical.core_quantities` (2) question blueprints. Purely
 * categorical/definitional -- no formula family or diagram is involved;
 * every generator call decides which option among a small governed set
 * is being presented, deterministically, via ../seed.ts's `pick`.
 */

import { pick } from "../seed.ts";
import { assembleInstance, type QuestionExecutor } from "./shared.ts";

const identifyUnit: QuestionExecutor = (ctx) => {
  const quantity = pick(ctx.rng, ["voltage", "current", "resistance", "power", "energy", "frequency"] as const);
  const unitBySymbol: Readonly<Record<string, string>> = {
    voltage: "V",
    current: "A",
    resistance: "Ω",
    power: "W",
    energy: "J",
    frequency: "Hz",
  };
  return assembleInstance(ctx, { quantity }, {}, { answer: ctx.blueprint.answer, value: unitBySymbol[quantity]! });
};

const distinguishBaseDerived: QuestionExecutor = (ctx) => {
  // The ampere is the one SI BASE unit among the electrical quantities this
  // family covers (EL-UNIT-BASE-VS-DERIVED-001); volt/ohm/watt/joule/hertz are derived.
  const unit = pick(ctx.rng, ["ampere", "volt", "ohm", "watt", "joule", "hertz"] as const);
  const classification = unit === "ampere" ? "base" : "derived";
  return assembleInstance(ctx, { unit }, {}, { answer: ctx.blueprint.answer, value: classification });
};

const diagnoseUnitConfusion: QuestionExecutor = (ctx) => {
  const confusedPair = pick(ctx.rng, ["volt_ohm", "watt_joule", "ampere_coulomb"] as const);
  return assembleInstance(ctx, { confused_pair: confusedPair }, {}, { answer: ctx.blueprint.answer, value: "unit_confusion" });
};

const recogniseFromDefinition: QuestionExecutor = (ctx) => {
  const quantity = pick(ctx.rng, ["voltage", "current", "resistance"] as const);
  return assembleInstance(ctx, { quantity }, {}, { answer: ctx.blueprint.answer, value: quantity });
};

const diagnoseCurrentVoltageConfusion: QuestionExecutor = (ctx) => {
  const scenario = pick(ctx.rng, ["voltage_described_as_flow", "current_described_as_pressure"] as const);
  return assembleInstance(ctx, { scenario }, {}, { answer: ctx.blueprint.answer, value: "current_voltage_confusion" });
};

export const unitsAndQuantitiesExecutors: Readonly<Record<string, QuestionExecutor>> = {
  "si_units.identify_unit": identifyUnit,
  "si_units.distinguish_base_derived": distinguishBaseDerived,
  "si_units.diagnose_unit_confusion": diagnoseUnitConfusion,
  "core_quantities.recognise_from_definition": recogniseFromDefinition,
  "core_quantities.diagnose_current_voltage_confusion": diagnoseCurrentVoltageConfusion,
};
