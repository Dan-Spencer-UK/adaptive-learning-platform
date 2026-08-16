/**
 * CC-05B: execution for the 10 `electrical.series_circuits` question
 * blueprints. Total-resistance/current/voltage/power calculations all
 * route through ../formula-evaluator.ts against formula.series_resistance
 * (add), formula.ohms_law (V/I/R) and formula.electrical_power (P),
 * proving the same generic evaluator serves multiple governed formula
 * families, not just Ohm's law.
 */

import { evaluateFormulaExpression, selectFormForKnownVariables } from "../formula-evaluator.ts";
import { cleanInteger, distinctCleanIntegers } from "../parameter-generation.ts";
import { nextInt, pick } from "../seed.ts";
import type { ExpectedAnswer } from "../types.ts";
import {
  assembleInstance,
  buildDiagramInstance,
  buildFormulaInstance,
  requireDiagramBlueprint,
  requireFormulaFamily,
  type GenerationContext,
  type QuestionExecutor,
} from "./shared.ts";

const SERIES_FORMULA_ID = "formula.series_resistance";
const OHMS_LAW_FORMULA_ID = "formula.ohms_law";
const POWER_FORMULA_ID = "formula.electrical_power";
const DIAGRAM_ID = "circuit.series_resistors";
const RESISTANCE_MIN = 1;
const RESISTANCE_MAX = 100;
const CURRENT_MIN = 1;
const CURRENT_MAX = 10;

function componentLabels(count: number): string[] {
  return Array.from({ length: count }, (_, i) => `R${i + 1}`);
}

function componentBindings(values: readonly number[]): Record<string, number> {
  const bindings: Record<string, number> = {};
  values.forEach((value, i) => {
    bindings[`R${i + 1}`] = value;
  });
  return bindings;
}

function generateComponents(ctx: GenerationContext, count: number): { values: number[]; Rt: number } {
  const formulaFamily = requireFormulaFamily(ctx, SERIES_FORMULA_ID);
  const values = distinctCleanIntegers(ctx.rng, count, RESISTANCE_MIN, RESISTANCE_MAX);
  const Rt = evaluateFormulaExpression(formulaFamily.forms[0]!.expression, componentBindings(values));
  return { values, Rt };
}

function quantityAnswer(quantity: string, canonicalUnit: string, value: number): ExpectedAnswer {
  return { answer: { type: "quantity", quantity, canonicalUnit }, value };
}

const calculateTotalResistance: QuestionExecutor = (ctx) => {
  const count = pick(ctx.rng, [2, 3, 4] as const);
  const { values, Rt } = generateComponents(ctx, count);
  const formulaFamily = requireFormulaFamily(ctx, SERIES_FORMULA_ID);
  const diagramBlueprint = requireDiagramBlueprint(ctx, DIAGRAM_ID);
  const formulaInstance = buildFormulaInstance(formulaFamily, "Rt", componentBindings(values));
  const diagram = buildDiagramInstance(
    diagramBlueprint,
    { component_count: count, show_values: true, show_current_arrow: false },
    componentLabels(count),
  );
  return assembleInstance(
    ctx,
    { component_count: count, ...componentBindings(values) },
    { formula: formulaInstance, diagram },
    quantityAnswer("resistance", "ohm", Rt),
  );
};

const solveMissingComponent: QuestionExecutor = (ctx) => {
  const count = pick(ctx.rng, [2, 3, 4] as const);
  const { values, Rt } = generateComponents(ctx, count);
  const diagramBlueprint = requireDiagramBlueprint(ctx, DIAGRAM_ID);
  const missingIndex = nextInt(ctx.rng, 0, count - 1);
  const missingValue = values[missingIndex]!;
  const knownParameters: Record<string, number | string> = { component_count: count, Rt, target: `R${missingIndex + 1}` };
  values.forEach((value, i) => {
    if (i !== missingIndex) knownParameters[`R${i + 1}`] = value;
  });
  const diagram = buildDiagramInstance(
    diagramBlueprint,
    { component_count: count, show_values: true, show_current_arrow: false },
    componentLabels(count),
  );
  return assembleInstance(ctx, knownParameters, { diagram }, quantityAnswer("resistance", "ohm", missingValue));
};

const calculateSupplyCurrent: QuestionExecutor = (ctx) => {
  const count = pick(ctx.rng, [2, 3, 4] as const);
  const { values, Rt } = generateComponents(ctx, count);
  const ohmsLaw = requireFormulaFamily(ctx, OHMS_LAW_FORMULA_ID);
  const I = cleanInteger(ctx.rng, CURRENT_MIN, CURRENT_MAX);
  const V = evaluateFormulaExpression(ohmsLaw.forms.find((f) => f.target === "V")!.expression, { I, R: Rt });
  const formulaInstance = buildFormulaInstance(ohmsLaw, "I", { V, R: Rt });
  return assembleInstance(
    ctx,
    { component_count: count, ...componentBindings(values), Rt, V },
    { formula: formulaInstance },
    quantityAnswer("current", "ampere", I),
  );
};

const calculateVoltageDrop: QuestionExecutor = (ctx) => {
  const count = pick(ctx.rng, [2, 3, 4] as const);
  const { values } = generateComponents(ctx, count);
  const ohmsLaw = requireFormulaFamily(ctx, OHMS_LAW_FORMULA_ID);
  const diagramBlueprint = requireDiagramBlueprint(ctx, DIAGRAM_ID);
  const I = cleanInteger(ctx.rng, CURRENT_MIN, CURRENT_MAX);
  const targetIndex = nextInt(ctx.rng, 0, count - 1);
  const targetResistance = values[targetIndex]!;
  const formulaInstance = buildFormulaInstance(ohmsLaw, "V", { I, R: targetResistance });
  const diagram = buildDiagramInstance(
    diagramBlueprint,
    { component_count: count, show_values: true, show_current_arrow: true },
    componentLabels(count),
  );
  return assembleInstance(
    ctx,
    { component_count: count, ...componentBindings(values), I, target: `R${targetIndex + 1}` },
    { formula: formulaInstance, diagram },
    quantityAnswer("voltage", "volt", formulaInstance.result),
  );
};

const calculatePower: QuestionExecutor = (ctx) => {
  const count = pick(ctx.rng, [2, 3, 4] as const);
  const { values } = generateComponents(ctx, count);
  const powerFormula = requireFormulaFamily(ctx, POWER_FORMULA_ID);
  const I = cleanInteger(ctx.rng, CURRENT_MIN, CURRENT_MAX);
  const targetIndex = nextInt(ctx.rng, 0, count - 1);
  const targetResistance = values[targetIndex]!;
  // formula.electrical_power declares multiple forms targeting "P" (P = V x I,
  // P = I^2 x R, P = V^2 / R) -- select the one whose required variables are
  // exactly {I, R}, never assume array order.
  const form = selectFormForKnownVariables(powerFormula.forms, "P", ["I", "R"]);
  const P = evaluateFormulaExpression(form.expression, { I, R: targetResistance });
  return assembleInstance(
    ctx,
    { component_count: count, ...componentBindings(values), I, target: `R${targetIndex + 1}` },
    {
      formula: {
        formulaFamilyId: powerFormula.id,
        target: "P",
        substitution: { I, R: targetResistance },
        result: P,
        unitSymbol: "W",
      },
    },
    quantityAnswer("power", "watt", P),
  );
};

const predictAddComponentEffect: QuestionExecutor = (ctx) => {
  const count = pick(ctx.rng, [2, 3] as const);
  const { values, Rt } = generateComponents(ctx, count);
  return assembleInstance(
    ctx,
    { component_count: count, ...componentBindings(values), Rt },
    {},
    { answer: ctx.blueprint.answer, value: "decrease" },
  );
};

const predictOpenCircuitEffect: QuestionExecutor = (ctx) => {
  const count = pick(ctx.rng, [2, 3, 4] as const);
  const { values } = generateComponents(ctx, count);
  return assembleInstance(
    ctx,
    { component_count: count, ...componentBindings(values) },
    {},
    { answer: ctx.blueprint.answer, value: "current_stops_everywhere" },
  );
};

const detectIncorrectTotal: QuestionExecutor = (ctx) => {
  const count = pick(ctx.rng, [2, 3, 4] as const);
  const { values, Rt } = generateComponents(ctx, count);
  const isPlausible = pick(ctx.rng, [true, false] as const);
  // An implausible series total: strictly less than the largest individual component,
  // which the governed corpus (EL-INTERPRET-SERIES-RESULT-001) states is impossible.
  const largest = Math.max(...values);
  const shownTotal = isPlausible ? Rt : Math.max(1, largest - 1 - nextInt(ctx.rng, 0, largest - 1));
  return assembleInstance(
    ctx,
    { component_count: count, ...componentBindings(values), shown_total: shownTotal },
    {},
    { answer: ctx.blueprint.answer, value: isPlausible ? "plausible" : "implausible" },
  );
};

const identifyDominantComponent: QuestionExecutor = (ctx) => {
  const values = distinctCleanIntegers(ctx.rng, 3, RESISTANCE_MIN, RESISTANCE_MAX);
  const diagramBlueprint = requireDiagramBlueprint(ctx, DIAGRAM_ID);
  let dominantIndex = 0;
  for (let i = 1; i < values.length; i++) {
    if (values[i]! > values[dominantIndex]!) dominantIndex = i;
  }
  const diagram = buildDiagramInstance(
    diagramBlueprint,
    { component_count: 3, show_values: true, show_current_arrow: false },
    componentLabels(3),
  );
  return assembleInstance(
    ctx,
    componentBindings(values),
    { diagram },
    { answer: ctx.blueprint.answer, value: `R${dominantIndex + 1}` },
  );
};

const interpretDiagram: QuestionExecutor = (ctx) => {
  const count = pick(ctx.rng, [2, 3, 4] as const);
  const { values } = generateComponents(ctx, count);
  const diagramBlueprint = requireDiagramBlueprint(ctx, DIAGRAM_ID);
  const diagram = buildDiagramInstance(
    diagramBlueprint,
    { component_count: count, show_values: false, show_current_arrow: true },
    componentLabels(count),
  );
  return assembleInstance(
    ctx,
    { component_count: count, ...componentBindings(values) },
    { diagram },
    { answer: ctx.blueprint.answer, value: "region-full-loop" },
  );
};

export const seriesResistanceExecutors: Readonly<Record<string, QuestionExecutor>> = {
  "series.calculate_total_resistance": calculateTotalResistance,
  "series.solve_missing_component": solveMissingComponent,
  "series.calculate_supply_current": calculateSupplyCurrent,
  "series.calculate_voltage_drop": calculateVoltageDrop,
  "series.calculate_power": calculatePower,
  "series.predict_add_component_effect": predictAddComponentEffect,
  "series.predict_open_circuit_effect": predictOpenCircuitEffect,
  "series.detect_incorrect_total": detectIncorrectTotal,
  "series.identify_dominant_component": identifyDominantComponent,
  "series.interpret_diagram": interpretDiagram,
};
