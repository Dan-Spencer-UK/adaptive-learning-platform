import { render } from "@testing-library/react-native";

import { SeriesParallelMixedCircuitDiagram } from "./SeriesParallelMixedCircuitDiagram";

describe("SeriesParallelMixedCircuitDiagram", () => {
  it("series_of_parallel: describes R1 in series with R2 and R3 in parallel", async () => {
    const { getByLabelText } = await render(
      <SeriesParallelMixedCircuitDiagram
        diagram={{ blueprintId: "circuit.series_parallel_mixed", parameters: { branch_arrangement: "series_of_parallel", show_values: false }, labels: ["R1", "R2", "R3"] }}
      />,
    );
    expect(getByLabelText(/R1 connected in series with R2 and R3, which are connected in parallel/)).toBeTruthy();
  });

  it("parallel_of_series: describes two branches, each a series pair", async () => {
    const { getByLabelText } = await render(
      <SeriesParallelMixedCircuitDiagram
        diagram={{
          blueprintId: "circuit.series_parallel_mixed",
          parameters: { branch_arrangement: "parallel_of_series", show_values: false },
          labels: ["R1", "R2", "R3", "R4"],
        }}
      />,
    );
    expect(getByLabelText(/One branch has R1 in series with R2.*other branch has R3 in series with R4/)).toBeTruthy();
  });

  it("never embeds numeric values regardless of show_values", async () => {
    const { getByLabelText } = await render(
      <SeriesParallelMixedCircuitDiagram
        diagram={{ blueprintId: "circuit.series_parallel_mixed", parameters: { branch_arrangement: "series_of_parallel", show_values: true }, labels: ["R1", "R2", "R3"] }}
      />,
    );
    const label = getByLabelText(/Mixed circuit/).props.accessibilityLabel as string;
    expect(label).not.toMatch(/\d+\s*(Ω|ohm)/);
  });

  it("falls back to symbolic R{n} labels when no labels are supplied", async () => {
    const { getByLabelText } = await render(
      <SeriesParallelMixedCircuitDiagram diagram={{ blueprintId: "circuit.series_parallel_mixed", parameters: { branch_arrangement: "series_of_parallel" }, labels: [] }} />,
    );
    expect(getByLabelText(/R1 connected in series with R2 and R3/)).toBeTruthy();
  });
});
