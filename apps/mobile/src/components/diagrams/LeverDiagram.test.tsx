import { render } from "@testing-library/react-native";

import { LeverDiagram } from "./LeverDiagram";

describe("LeverDiagram", () => {
  it("describes a class_1 lever as pivot in the middle, between effort and load", async () => {
    const { getByLabelText } = await render(
      <LeverDiagram diagram={{ blueprintId: "mechanical.lever_arrangement", parameters: { lever_class: "class_1" }, labels: [] }} />,
    );
    expect(getByLabelText(/A Class I lever with the effort on the left, the pivot in the middle, and the load on the right\./)).toBeTruthy();
  });

  it("describes a class_2 lever as pivot on the left, load in the middle, effort on the right", async () => {
    const { getByLabelText } = await render(
      <LeverDiagram diagram={{ blueprintId: "mechanical.lever_arrangement", parameters: { lever_class: "class_2" }, labels: [] }} />,
    );
    expect(getByLabelText(/A Class II lever with the pivot on the left, the load in the middle, and the effort on the right\./)).toBeTruthy();
  });

  it("describes a class_3 lever as pivot on the left, effort in the middle, load on the right", async () => {
    const { getByLabelText } = await render(
      <LeverDiagram diagram={{ blueprintId: "mechanical.lever_arrangement", parameters: { lever_class: "class_3" }, labels: [] }} />,
    );
    expect(getByLabelText(/A Class III lever with the pivot on the left, the effort in the middle, and the load on the right\./)).toBeTruthy();
  });

  it("omits distance-arm information from the accessibility label when show_distances is false", async () => {
    const { getByLabelText } = await render(
      <LeverDiagram diagram={{ blueprintId: "mechanical.lever_arrangement", parameters: { lever_class: "class_1", show_distances: false }, labels: [] }} />,
    );
    const label = getByLabelText(/A Class I lever/);
    expect(label.props.accessibilityLabel).not.toMatch(/effort arm/);
  });

  it("describes the de/dl distance brackets and renders their labels when show_distances is true", async () => {
    const result = await render(
      <LeverDiagram diagram={{ blueprintId: "mechanical.lever_arrangement", parameters: { lever_class: "class_2", show_distances: true }, labels: [] }} />,
    );
    expect(
      result.getByLabelText(
        /Distance brackets show the effort arm, de, measured from the pivot to the effort, and the load arm, dl, measured from the pivot to the load\./,
      ),
    ).toBeTruthy();
    const tree = JSON.stringify(result.toJSON());
    expect(tree).toContain("de");
    expect(tree).toContain("dl");
  });
});
