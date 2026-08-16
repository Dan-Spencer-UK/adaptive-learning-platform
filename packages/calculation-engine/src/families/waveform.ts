/**
 * CC-05B2: execution for the 6 `electrical.ac_dc_waveforms` question
 * blueprints. The two calculation blueprints route through
 * formula.ac_waveform_relationships (rms<->peak via sqrt(2), f<->T via
 * reciprocal) using the generic evaluator; the rest are categorical.
 */

import { evaluateFormulaExpression } from "../formula-evaluator.ts";
import { cleanInteger } from "../parameter-generation.ts";
import { pick } from "../seed.ts";
import type { ExpectedAnswer } from "../types.ts";
import {
  assembleInstance,
  buildDiagramInstance,
  buildFormulaInstance,
  requireDiagramBlueprint,
  requireFormulaFamily,
  type QuestionExecutor,
} from "./shared.ts";

const WAVEFORM_FORMULA_ID = "formula.ac_waveform_relationships";
const WAVEFORM_DIAGRAM_ID = "graph.waveform_sine";

function quantityAnswer(quantity: string, canonicalUnit: string, value: number): ExpectedAnswer {
  return { answer: { type: "quantity", quantity, canonicalUnit }, value };
}

const recogniseAcDc: QuestionExecutor = (ctx) => {
  const supply = pick(ctx.rng, ["ac", "dc"] as const);
  return assembleInstance(ctx, { supply }, {}, { answer: ctx.blueprint.answer, value: supply });
};

const CHARACTERISTIC_TO_DIAGRAM_PARAMETERS: Readonly<
  Record<"periodic_time" | "amplitude" | "peak_to_peak" | "rms" | "average_value", Record<string, boolean>>
> = {
  periodic_time: { show_peak_line: false, show_rms_line: false, show_period_marker: true },
  amplitude: { show_peak_line: true, show_rms_line: false, show_period_marker: false },
  peak_to_peak: { show_peak_line: true, show_rms_line: false, show_period_marker: false },
  rms: { show_peak_line: false, show_rms_line: true, show_period_marker: false },
  average_value: { show_peak_line: false, show_rms_line: false, show_period_marker: false },
};

const identifyCharacteristic: QuestionExecutor = (ctx) => {
  const diagramBlueprint = requireDiagramBlueprint(ctx, WAVEFORM_DIAGRAM_ID);
  const characteristic = pick(ctx.rng, ["periodic_time", "amplitude", "peak_to_peak", "rms", "average_value"] as const);
  const diagram = buildDiagramInstance(
    diagramBlueprint,
    { ...CHARACTERISTIC_TO_DIAGRAM_PARAMETERS[characteristic], cycles_shown: 2 },
    ["waveform"],
  );
  return assembleInstance(ctx, { characteristic }, { diagram }, { answer: ctx.blueprint.answer, value: characteristic });
};

const calculateRmsFromPeak: QuestionExecutor = (ctx) => {
  const formulaFamily = requireFormulaFamily(ctx, WAVEFORM_FORMULA_ID);
  const peak = cleanInteger(ctx.rng, 1, 350);
  const rmsFormulaInstance = buildFormulaInstance(formulaFamily, "rms", { peak });
  const target = pick(ctx.rng, ["rms", "peak"] as const);
  if (target === "rms") {
    return assembleInstance(
      ctx,
      { peak, target_variable: target },
      { formula: rmsFormulaInstance },
      quantityAnswer("voltage_or_current", "volt_or_ampere", rmsFormulaInstance.result),
    );
  }
  const rms = rmsFormulaInstance.result;
  const peakFormulaInstance = buildFormulaInstance(formulaFamily, "peak", { rms });
  return assembleInstance(
    ctx,
    { rms, target_variable: target },
    { formula: peakFormulaInstance },
    quantityAnswer("voltage_or_current", "volt_or_ampere", peakFormulaInstance.result),
  );
};

const calculateFrequencyFromPeriod: QuestionExecutor = (ctx) => {
  const formulaFamily = requireFormulaFamily(ctx, WAVEFORM_FORMULA_ID);
  const f = cleanInteger(ctx.rng, 1, 200);
  const target = pick(ctx.rng, ["f", "T"] as const);
  if (target === "T") {
    const formulaInstance = buildFormulaInstance(formulaFamily, "T", { f });
    return assembleInstance(
      ctx,
      { f, target_variable: target },
      { formula: formulaInstance },
      quantityAnswer("frequency_or_time", "hertz_or_second", formulaInstance.result),
    );
  }
  const TForm = formulaFamily.forms.find((form) => form.target === "T")!;
  const T = evaluateFormulaExpression(TForm.expression, { f });
  const formulaInstance = buildFormulaInstance(formulaFamily, "f", { T });
  return assembleInstance(
    ctx,
    { T, target_variable: target },
    { formula: formulaInstance },
    quantityAnswer("frequency_or_time", "hertz_or_second", formulaInstance.result),
  );
};

const interpretRatedValue: QuestionExecutor = (ctx) => {
  return assembleInstance(ctx, {}, {}, { answer: ctx.blueprint.answer, value: "rms" });
};

const compareAcDcBehaviour: QuestionExecutor = (ctx) => {
  const component = pick(ctx.rng, ["resistor", "inductor", "capacitor"] as const);
  const expected = component === "resistor" ? "same_both" : "differs_by_frequency";
  return assembleInstance(ctx, { component }, {}, { answer: ctx.blueprint.answer, value: expected });
};

export const waveformExecutors: Readonly<Record<string, QuestionExecutor>> = {
  "waveform.recognise_ac_dc": recogniseAcDc,
  "waveform.identify_characteristic": identifyCharacteristic,
  "waveform.calculate_rms_from_peak": calculateRmsFromPeak,
  "waveform.calculate_frequency_from_period": calculateFrequencyFromPeriod,
  "waveform.interpret_rated_value": interpretRatedValue,
  "waveform.compare_ac_dc_behaviour": compareAcDcBehaviour,
};
