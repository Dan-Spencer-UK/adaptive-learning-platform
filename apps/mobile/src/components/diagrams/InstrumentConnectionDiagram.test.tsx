import { render } from "@testing-library/react-native";

import { InstrumentConnectionDiagram } from "./InstrumentConnectionDiagram";

describe("InstrumentConnectionDiagram", () => {
  it("voltmeter + parallel is described as the standard connection", async () => {
    const { getByLabelText } = await render(
      <InstrumentConnectionDiagram diagram={{ blueprintId: "instrument.measurement_connection", parameters: { instrument_type: "voltmeter", connection_style: "parallel" }, labels: [] }} />,
    );
    expect(getByLabelText(/Voltmeter connected in parallel.*standard, correct way to connect a voltmeter \(in parallel/)).toBeTruthy();
  });

  it("ammeter + series is described as the standard connection", async () => {
    const { getByLabelText } = await render(
      <InstrumentConnectionDiagram diagram={{ blueprintId: "instrument.measurement_connection", parameters: { instrument_type: "ammeter", connection_style: "series" }, labels: [] }} />,
    );
    expect(getByLabelText(/Ammeter connected in series.*standard, correct way to connect an ammeter \(in series/)).toBeTruthy();
  });

  it("ammeter + parallel is explicitly flagged as NOT the standard connection", async () => {
    const { getByLabelText } = await render(
      <InstrumentConnectionDiagram diagram={{ blueprintId: "instrument.measurement_connection", parameters: { instrument_type: "ammeter", connection_style: "parallel" }, labels: [] }} />,
    );
    expect(getByLabelText(/Ammeter connected in parallel.*does not match the standard, correct method/)).toBeTruthy();
  });

  it("ohmmeter is always rendered isolated with no source, regardless of connection_style", async () => {
    const { getByLabelText } = await render(
      <InstrumentConnectionDiagram diagram={{ blueprintId: "instrument.measurement_connection", parameters: { instrument_type: "ohmmeter", connection_style: "series" }, labels: [] }} />,
    );
    expect(getByLabelText(/Ohmmeter connected across an isolated component. No supply is present/)).toBeTruthy();
  });
});
