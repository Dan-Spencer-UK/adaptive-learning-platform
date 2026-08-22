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

// Learner-facing pair labels for the confusable-unit scenarios (CC-10:
// presentation copy only, never a new knowledge fact -- restates the pair
// the executor already picks in readable form for `presentation.promptLines`).
const CONFUSED_PAIR_LABELS: Readonly<Record<string, string>> = {
  volt_ohm: "the volt and the ohm",
  watt_joule: "the watt and the joule",
  ampere_coulomb: "the ampere and the coulomb",
};

const diagnoseUnitConfusion: QuestionExecutor = (ctx) => {
  const confusedPair = pick(ctx.rng, ["volt_ohm", "watt_joule", "ampere_coulomb"] as const);
  return assembleInstance(
    ctx,
    { confused_pair: confusedPair, confused_pair_label: CONFUSED_PAIR_LABELS[confusedPair]! },
    {},
    { answer: ctx.blueprint.answer, value: "unit_confusion" },
  );
};

// Definition CLAUSES only (the governed term itself deliberately omitted --
// EL-CONCEPT-VOLTAGE-001/CURRENT-001/RESISTANCE-001's own statements name
// their term in the opening words, so quoting them whole would hand the
// learner the answer; these clauses are the same governed definitions with
// only the naming word withheld for `presentation.promptLines`).
const DEFINITION_CLAUSES: Readonly<Record<string, string>> = {
  voltage: "the electrical energy transferred per unit charge between two points in a circuit",
  current: "the rate of flow of electric charge through a conductor",
  resistance: "the opposition a component presents to the flow of electric current",
};

const recogniseFromDefinition: QuestionExecutor = (ctx) => {
  const quantity = pick(ctx.rng, ["voltage", "current", "resistance"] as const);
  return assembleInstance(
    ctx,
    { quantity, definition_clause: DEFINITION_CLAUSES[quantity]! },
    {},
    { answer: ctx.blueprint.answer, value: quantity },
  );
};

// Learner-facing restatements of MIS-EL-CURRENT-VOLTAGE-CONFUSION-001's own
// governed description ("treating current as something a source 'has'
// independent of the circuit rather than voltage driving current through
// resistance") for `presentation.promptLines` -- not a new misconception fact.
const CURRENT_VOLTAGE_SCENARIO_TEXT: Readonly<Record<string, string>> = {
  voltage_described_as_flow: "A learner describes voltage as \"the flow of electricity around the circuit\".",
  current_described_as_pressure: "A learner describes current as \"the electrical pressure that pushes charge around the circuit\".",
};

const diagnoseCurrentVoltageConfusion: QuestionExecutor = (ctx) => {
  const scenario = pick(ctx.rng, ["voltage_described_as_flow", "current_described_as_pressure"] as const);
  return assembleInstance(
    ctx,
    { scenario, scenario_text: CURRENT_VOLTAGE_SCENARIO_TEXT[scenario]! },
    {},
    { answer: ctx.blueprint.answer, value: "current_voltage_confusion" },
  );
};

export const unitsAndQuantitiesExecutors: Readonly<Record<string, QuestionExecutor>> = {
  "si_units.identify_unit": identifyUnit,
  "si_units.distinguish_base_derived": distinguishBaseDerived,
  "si_units.diagnose_unit_confusion": diagnoseUnitConfusion,
  "core_quantities.recognise_from_definition": recogniseFromDefinition,
  "core_quantities.diagnose_current_voltage_confusion": diagnoseCurrentVoltageConfusion,
};
