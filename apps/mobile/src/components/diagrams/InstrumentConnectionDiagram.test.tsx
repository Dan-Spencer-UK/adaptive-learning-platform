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

  it("ohmmeter is always rendered isolated with no source, regardless of connection_style, using the corrected conditional (not universal) isolation wording", async () => {
    const { getByLabelText } = await render(
      <InstrumentConnectionDiagram diagram={{ blueprintId: "instrument.measurement_connection", parameters: { instrument_type: "ohmmeter", connection_style: "isolated" }, labels: [] }} />,
    );
    expect(
      getByLabelText(/Ohmmeter connected across an isolated component\. An ohmmeter must never be connected to an energised circuit; other circuit paths may need to be disconnected first/),
    ).toBeTruthy();
  });

  it("CC-11.3: withholds the standard/non-standard caption from the accessibility label in assessment mode", async () => {
    const { getByLabelText, queryByText } = await render(
      <InstrumentConnectionDiagram
        diagram={{ blueprintId: "instrument.measurement_connection", parameters: { instrument_type: "ammeter", connection_style: "parallel" }, labels: [] }}
        mode="assessment"
      />,
    );
    expect(getByLabelText(/^Ammeter connected in parallel with the component under test\.$/)).toBeTruthy();
    expect(queryByText(/standard connection/)).toBeNull();
  });

  it("CC-11.3: reveals the standard/non-standard caption in teaching mode (the default)", async () => {
    const { getByLabelText } = await render(
      <InstrumentConnectionDiagram diagram={{ blueprintId: "instrument.measurement_connection", parameters: { instrument_type: "ammeter", connection_style: "parallel" }, labels: [] }} />,
    );
    expect(getByLabelText(/does not match the standard, correct method for a ammeter/)).toBeTruthy();
  });

  it("CC-11.3: reveals the caption in explicit 'both' mode too", async () => {
    const { getByLabelText } = await render(
      <InstrumentConnectionDiagram
        diagram={{ blueprintId: "instrument.measurement_connection", parameters: { instrument_type: "voltmeter", connection_style: "parallel" }, labels: [] }}
        mode="both"
      />,
    );
    expect(getByLabelText(/standard, correct way to connect a voltmeter/)).toBeTruthy();
  });
});
