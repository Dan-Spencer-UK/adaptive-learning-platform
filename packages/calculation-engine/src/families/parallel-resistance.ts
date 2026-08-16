/**
 * CC-05B: execution for the 11 `electrical.parallel_circuits` question
 * blueprints. Total-resistance/current/power calculations route through
 * ../formula-evaluator.ts against formula.parallel_resistance
 * (reciprocal_of_sum_of_reciprocals), formula.ohms_law and
 * formula.electrical_power, exactly as series-resistance.ts does for its
 * own formula families -- the same generic machinery, different governed
 * structure.
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

const PARALLEL_FORMULA_ID = "formula.parallel_resistance";
const OHMS_LAW_FORMULA_ID = "formula.ohms_law";
const POWER_FORMULA_ID = "formula.electrical_power";
const DIAGRAM_ID = "circuit.parallel_resistors";
const RESISTANCE_MIN = 2;
const RESISTANCE_MAX = 100;
const VOLTAGE_MIN = 1;
const VOLTAGE_MAX = 24;

function branchLabels(count: number): string[] {
  return Array.from({ length: count }, (_, i) => `R${i + 1}`);
}

function branchBindings(values: readonly number[]): Record<string, number> {
  const bindings: Record<string, number> = {};
  values.forEach((value, i) => {
    bindings[`R${i + 1}`] = value;
  });
  return bindings;
}

function generateBranches(ctx: GenerationContext, count: number): { values: number[]; Rt: number } {
  const formulaFamily = requireFormulaFamily(ctx, PARALLEL_FORMULA_ID);
  const values = distinctCleanIntegers(ctx.rng, count, RESISTANCE_MIN, RESISTANCE_MAX);
  const Rt = evaluateFormulaExpression(formulaFamily.forms[0]!.expression, branchBindings(values));
  return { values, Rt };
}

function quantityAnswer(quantity: string, canonicalUnit: string, value: number): ExpectedAnswer {
  return { answer: { type: "quantity", quantity, canonicalUnit }, value };
}

const calculateTotal: QuestionExecutor = (ctx) => {
  const count = pick(ctx.rng, [2, 3, 4] as const);
  const { values, Rt } = generateBranches(ctx, count);
  const formulaFamily = requireFormulaFamily(ctx, PARALLEL_FORMULA_ID);
  const diagramBlueprint = requireDiagramBlueprint(ctx, DIAGRAM_ID);
  const formulaInstance = buildFormulaInstance(formulaFamily, "Rt", branchBindings(values));
  const diagram = buildDiagramInstance(
    diagramBlueprint,
    { branch_count: count, show_values: true, show_branch_current_arrows: false },
    branchLabels(count),
  );
  return assembleInstance(
    ctx,
    { branch_count: count, ...branchBindings(values) },
    { formula: formulaInstance, diagram },
    quantityAnswer("resistance", "ohm", Rt),
  );
};

const solveMissingBranch: QuestionExecutor = (ctx) => {
  const count = pick(ctx.rng, [2, 3] as const);
  const { values, Rt } = generateBranches(ctx, count);
  const diagramBlueprint = requireDiagramBlueprint(ctx, DIAGRAM_ID);
  const missingIndex = nextInt(ctx.rng, 0, count - 1);
  const missingValue = values[missingIndex]!;
  const knownParameters: Record<string, number | string> = { branch_count: count, Rt, target: `R${missingIndex + 1}` };
  values.forEach((value, i) => {
    if (i !== missingIndex) knownParameters[`R${i + 1}`] = value;
  });
  const diagram = buildDiagramInstance(
    diagramBlueprint,
    { branch_count: count, show_values: true, show_branch_current_arrows: false },
    branchLabels(count),
  );
  return assembleInstance(ctx, knownParameters, { diagram }, quantityAnswer("resistance", "ohm", missingValue));
};

const identifyTopology: QuestionExecutor = (ctx) => {
  const count = pick(ctx.rng, [2, 3, 4] as const);
  const { values } = generateBranches(ctx, count);
  const diagramBlueprint = requireDiagramBlueprint(ctx, DIAGRAM_ID);
  const diagram = buildDiagramInstance(
    diagramBlueprint,
    { branch_count: count, show_values: false, show_branch_current_arrows: true },
    branchLabels(count),
  );
  return assembleInstance(
    ctx,
    { branch_count: count, ...branchBindings(values) },
    { diagram },
    { answer: ctx.blueprint.answer, value: "region-multiple-branches" },
  );
};

const predictAddBranchEffect: QuestionExecutor = (ctx) => {
  const count = pick(ctx.rng, [2, 3] as const);
  const { values, Rt } = generateBranches(ctx, count);
  return assembleInstance(
    ctx,
    { branch_count: count, ...branchBindings(values), Rt },
    {},
    { answer: ctx.blueprint.answer, value: "increase" },
  );
};

const predictOpenBranchEffect: QuestionExecutor = (ctx) => {
  const count = pick(ctx.rng, [2, 3, 4] as const);
  const { values } = generateBranches(ctx, count);
  return assembleInstance(
    ctx,
    { branch_count: count, ...branchBindings(values) },
    {},
    { answer: ctx.blueprint.answer, value: "other_branches_unaffected" },
  );
};

const calculateBranchCurrent: QuestionExecutor = (ctx) => {
  const count = pick(ctx.rng, [2, 3, 4] as const);
  const { values } = generateBranches(ctx, count);
  const ohmsLaw = requireFormulaFamily(ctx, OHMS_LAW_FORMULA_ID);
  const diagramBlueprint = requireDiagramBlueprint(ctx, DIAGRAM_ID);
  const V = cleanInteger(ctx.rng, VOLTAGE_MIN, VOLTAGE_MAX);
  const targetIndex = nextInt(ctx.rng, 0, count - 1);
  const targetResistance = values[targetIndex]!;
  const formulaInstance = buildFormulaInstance(ohmsLaw, "I", { V, R: targetResistance });
  const diagram = buildDiagramInstance(
    diagramBlueprint,
    { branch_count: count, show_values: true, show_branch_current_arrows: true },
    branchLabels(count),
  );
  return assembleInstance(
    ctx,
    { branch_count: count, ...branchBindings(values), V, target: `R${targetIndex + 1}` },
    { formula: formulaInstance, diagram },
    quantityAnswer("current", "ampere", formulaInstance.result),
  );
};

const calculatePower: QuestionExecutor = (ctx) => {
  const count = pick(ctx.rng, [2, 3, 4] as const);
  const { values } = generateBranches(ctx, count);
  const powerFormula = requireFormulaFamily(ctx, POWER_FORMULA_ID);
  const V = cleanInteger(ctx.rng, VOLTAGE_MIN, VOLTAGE_MAX);
  const targetIndex = nextInt(ctx.rng, 0, count - 1);
  const targetResistance = values[targetIndex]!;
  // In a parallel branch, voltage (not current) is common -- select the
  // P = V^2 / R form, whose required variables are exactly {V, R}.
  const form = selectFormForKnownVariables(powerFormula.forms, "P", ["V", "R"]);
  const P = evaluateFormulaExpression(form.expression, { V, R: targetResistance });
  return assembleInstance(
    ctx,
    { branch_count: count, ...branchBindings(values), V, target: `R${targetIndex + 1}` },
    {
      formula: {
        formulaFamilyId: powerFormula.id,
        target: "P",
        substitution: { V, R: targetResistance },
        result: P,
        unitSymbol: "W",
      },
    },
    quantityAnswer("power", "watt", P),
  );
};

const identifyDominantBranch: QuestionExecutor = (ctx) => {
  const values = distinctCleanIntegers(ctx.rng, 3, RESISTANCE_MIN, RESISTANCE_MAX);
  const diagramBlueprint = requireDiagramBlueprint(ctx, DIAGRAM_ID);
  // In parallel, the SMALLEST branch resistance carries the largest current/power.
  let dominantIndex = 0;
  for (let i = 1; i < values.length; i++) {
    if (values[i]! < values[dominantIndex]!) dominantIndex = i;
  }
  const diagram = buildDiagramInstance(
    diagramBlueprint,
    { branch_count: 3, show_values: true, show_branch_current_arrows: false },
    branchLabels(3),
  );
  return assembleInstance(
    ctx,
    branchBindings(values),
    { diagram },
    { answer: ctx.blueprint.answer, value: `R${dominantIndex + 1}` },
  );
};

const detectImpossibleTotal: QuestionExecutor = (ctx) => {
  const count = pick(ctx.rng, [2, 3, 4] as const);
  const { values, Rt } = generateBranches(ctx, count);
  const isPlausible = pick(ctx.rng, [true, false] as const);
  const smallest = Math.min(...values);
  // An impossible parallel total: at or above the smallest branch resistance,
  // which the governed corpus (EL-INTERPRET-PARALLEL-RESULT-001) states cannot happen.
  const shownTotal = isPlausible ? Rt : smallest + 1 + nextInt(ctx.rng, 0, smallest);
  return assembleInstance(
    ctx,
    { branch_count: count, ...branchBindings(values), shown_total: shownTotal },
    {},
    { answer: ctx.blueprint.answer, value: isPlausible ? "plausible" : "impossible" },
  );
};

type ReciprocalErrorClassification = "reciprocal_error" | "missing_final_inversion" | "no_error";

const diagnoseReciprocalError: QuestionExecutor = (ctx) => {
  const count = pick(ctx.rng, [2, 3] as const);
  const { values, Rt } = generateBranches(ctx, count);
  // The misconception: adding branch resistances directly instead of using the reciprocal relationship.
  const shownTotal = values.reduce((sum, v) => sum + v, 0);
  const classification: ReciprocalErrorClassification = "reciprocal_error";
  return assembleInstance(
    ctx,
    { branch_count: count, ...branchBindings(values), Rt, shown_total: shownTotal },
    {},
    { answer: ctx.blueprint.answer, value: classification },
  );
};

const diagnoseMissingFinalInversion: QuestionExecutor = (ctx) => {
  const count = pick(ctx.rng, [2, 3] as const);
  const { values, Rt } = generateBranches(ctx, count);
  // The misconception: summing the reciprocals correctly but forgetting to invert the sum back.
  const sumOfReciprocals = values.reduce((sum, v) => sum + 1 / v, 0);
  const classification: ReciprocalErrorClassification = "missing_final_inversion";
  return assembleInstance(
    ctx,
    { branch_count: count, ...branchBindings(values), Rt, shown_total: sumOfReciprocals },
    {},
    { answer: ctx.blueprint.answer, value: classification },
  );
};

export const parallelResistanceExecutors: Readonly<Record<string, QuestionExecutor>> = {
  "parallel.calculate_total": calculateTotal,
  "parallel.solve_missing_branch": solveMissingBranch,
  "parallel.identify_topology": identifyTopology,
  "parallel.predict_add_branch_effect": predictAddBranchEffect,
  "parallel.predict_open_branch_effect": predictOpenBranchEffect,
  "parallel.calculate_branch_current": calculateBranchCurrent,
  "parallel.calculate_power": calculatePower,
  "parallel.identify_dominant_branch": identifyDominantBranch,
  "parallel.detect_impossible_total": detectImpossibleTotal,
  "parallel.diagnose_reciprocal_error": diagnoseReciprocalError,
  "parallel.diagnose_missing_final_inversion": diagnoseMissingFinalInversion,
};
