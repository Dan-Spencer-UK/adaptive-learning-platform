import { render } from "@testing-library/react-native";

import { ParallelCircuitDiagram } from "./ParallelCircuitDiagram";

describe("ParallelCircuitDiagram", () => {
  it("labels match the diagram instance's branch count (3)", async () => {
    const { getByLabelText } = await render(
      <ParallelCircuitDiagram
        diagram={{ blueprintId: "circuit.parallel_resistors", parameters: { branch_count: 3, show_values: false, show_branch_current_arrows: false }, labels: ["R1", "R2", "R3"] }}
      />,
    );
    expect(getByLabelText(/3 branches labelled R1, R2, R3/)).toBeTruthy();
  });

  it("branch count of 2 renders a different accessible description than 3", async () => {
    const { getByLabelText } = await render(
      <ParallelCircuitDiagram
        diagram={{ blueprintId: "circuit.parallel_resistors", parameters: { branch_count: 2, show_values: false, show_branch_current_arrows: false }, labels: ["R1", "R2"] }}
      />,
    );
    expect(getByLabelText(/2 branches labelled R1, R2/)).toBeTruthy();
  });
});
