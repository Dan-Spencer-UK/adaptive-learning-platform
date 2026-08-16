/**
 * CC-05B2: execution for the 4 `electrical.instrumentation` question
 * blueprints. `recognise_connection` uses the `instrument.measurement_connection`
 * diagram blueprint; the rest are categorical recognition questions.
 */

import { pick } from "../seed.ts";
import { assembleInstance, buildDiagramInstance, requireDiagramBlueprint, type QuestionExecutor } from "./shared.ts";

const CONNECTION_DIAGRAM_ID = "instrument.measurement_connection";

const QUANTITY_TO_INSTRUMENT: Readonly<Record<string, string>> = {
  voltage: "voltmeter",
  current: "ammeter",
  resistance: "ohmmeter",
  mixed: "multimeter",
};

const selectInstrument: QuestionExecutor = (ctx) => {
  const quantity = pick(ctx.rng, ["voltage", "current", "resistance", "mixed"] as const);
  return assembleInstance(ctx, { quantity }, {}, { answer: ctx.blueprint.answer, value: QUANTITY_TO_INSTRUMENT[quantity]! });
};

const CONNECTABLE_INSTRUMENTS = ["voltmeter", "ammeter"] as const;
const CONNECTION_STYLE: Readonly<Record<(typeof CONNECTABLE_INSTRUMENTS)[number], "series" | "parallel">> = {
  voltmeter: "parallel",
  ammeter: "series",
};

const recogniseConnection: QuestionExecutor = (ctx) => {
  const diagramBlueprint = requireDiagramBlueprint(ctx, CONNECTION_DIAGRAM_ID);
  const instrumentType = pick(ctx.rng, CONNECTABLE_INSTRUMENTS);
  const expectedConnection = CONNECTION_STYLE[instrumentType];
  const diagram = buildDiagramInstance(
    diagramBlueprint,
    { instrument_type: instrumentType, connection_style: expectedConnection },
    ["instrument"],
  );
  return assembleInstance(
    ctx,
    { instrument_type: instrumentType },
    { diagram },
    { answer: ctx.blueprint.answer, value: expectedConnection },
  );
};

const INTERNAL_RESISTANCE: Readonly<Record<(typeof CONNECTABLE_INSTRUMENTS)[number], "very_high" | "very_low">> = {
  voltmeter: "very_high",
  ammeter: "very_low",
};

const recogniseInternalResistanceProperty: QuestionExecutor = (ctx) => {
  const instrumentType = pick(ctx.rng, CONNECTABLE_INSTRUMENTS);
  return assembleInstance(
    ctx,
    { instrument_type: instrumentType },
    {},
    { answer: ctx.blueprint.answer, value: INTERNAL_RESISTANCE[instrumentType] },
  );
};

const recognisePurpose: QuestionExecutor = (ctx) => {
  const instrument = pick(ctx.rng, ["clamp_meter", "oscilloscope", "continuity_tester"] as const);
  return assembleInstance(ctx, { instrument }, {}, { answer: ctx.blueprint.answer, value: instrument });
};

export const instrumentationExecutors: Readonly<Record<string, QuestionExecutor>> = {
  "instrumentation.select_instrument": selectInstrument,
  "instrumentation.recognise_connection": recogniseConnection,
  "instrumentation.recognise_internal_resistance_property": recogniseInternalResistanceProperty,
  "instrumentation.recognise_purpose": recognisePurpose,
};
