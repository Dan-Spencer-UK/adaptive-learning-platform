import { render } from "@testing-library/react-native";

import { SeriesCircuitDiagram } from "./SeriesCircuitDiagram";

describe("SeriesCircuitDiagram", () => {
  it("labels match the diagram instance's component count (2)", async () => {
    const { getByLabelText } = await render(
      <SeriesCircuitDiagram
        diagram={{ blueprintId: "circuit.series_resistors", parameters: { component_count: 2, show_values: false, show_current_arrow: false }, labels: ["R1", "R2"] }}
      />,
    );
    expect(getByLabelText(/2 resistors labelled R1, R2/)).toBeTruthy();
  });

  it("labels match the diagram instance's component count (4) -- proves dynamic parameterisation, not a fixed image", async () => {
    const { getByLabelText } = await render(
      <SeriesCircuitDiagram
        diagram={{
          blueprintId: "circuit.series_resistors",
          parameters: { component_count: 4, show_values: false, show_current_arrow: false },
          labels: ["R1", "R2", "R3", "R4"],
        }}
      />,
    );
    expect(getByLabelText(/4 resistors labelled R1, R2, R3, R4/)).toBeTruthy();
  });

  it("never embeds numeric values -- only symbolic R{n} labels appear regardless of show_values", async () => {
    const { getByLabelText } = await render(
      <SeriesCircuitDiagram
        diagram={{ blueprintId: "circuit.series_resistors", parameters: { component_count: 2, show_values: true, show_current_arrow: false }, labels: ["R1", "R2"] }}
      />,
    );
    const label = getByLabelText(/resistors labelled/).props.accessibilityLabel as string;
    expect(label).not.toMatch(/\d+\s*(Ω|ohm)/);
  });

  it("mentions the current-direction arrow in the accessible description only when show_current_arrow is true", async () => {
    const shown = await render(
      <SeriesCircuitDiagram
        diagram={{ blueprintId: "circuit.series_resistors", parameters: { component_count: 2, show_values: false, show_current_arrow: true }, labels: ["R1", "R2"] }}
      />,
    );
    expect(shown.getByLabelText(/An arrow on the return wire shows the current direction, flowing left to right\./)).toBeTruthy();

    const hidden = await render(
      <SeriesCircuitDiagram
        diagram={{ blueprintId: "circuit.series_resistors", parameters: { component_count: 2, show_values: false, show_current_arrow: false }, labels: ["R1", "R2"] }}
      />,
    );
    expect(hidden.queryByLabelText(/current direction/)).toBeNull();
  });
});
