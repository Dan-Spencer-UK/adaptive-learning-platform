import { render } from "@testing-library/react-native";

import { PulleyDiagram } from "./PulleyDiagram";

describe("PulleyDiagram", () => {
  it("describes a fixed pulley as one supporting rope segment with no mechanical advantage, and renders Effort/Load labels", async () => {
    const result = await render(
      <PulleyDiagram diagram={{ blueprintId: "mechanical.pulley_arrangement", parameters: { arrangement: "fixed" }, labels: [] }} />,
    );
    expect(
      result.getByLabelText(
        /A fixed pulley: the wheel is mounted to a fixed anchor at the top\..*One rope segment supports the load -- the pulley changes the direction of the force but gives no mechanical advantage\./,
      ),
    ).toBeTruthy();
    const tree = JSON.stringify(result.toJSON());
    expect(tree).toContain("Effort");
    expect(tree).toContain("Load");
  });

  it("describes a movable pulley as two supporting rope segments with MA approximately 2", async () => {
    const { getByLabelText } = await render(
      <PulleyDiagram diagram={{ blueprintId: "mechanical.pulley_arrangement", parameters: { arrangement: "movable" }, labels: [] }} />,
    );
    expect(
      getByLabelText(
        /A movable pulley: the wheel is attached directly to the load and moves with it\..*Two rope segments support the load, giving a mechanical advantage of approximately 2\./,
      ),
    ).toBeTruthy();
  });

  it("renders the fixed anchor label in both arrangements", async () => {
    const fixed = await render(<PulleyDiagram diagram={{ blueprintId: "mechanical.pulley_arrangement", parameters: { arrangement: "fixed" }, labels: [] }} />);
    const movable = await render(
      <PulleyDiagram diagram={{ blueprintId: "mechanical.pulley_arrangement", parameters: { arrangement: "movable" }, labels: [] }} />,
    );
    expect(JSON.stringify(fixed.toJSON())).toContain("Fixed anchor");
    expect(JSON.stringify(movable.toJSON())).toContain("Fixed anchor");
  });

  it("falls back to the fixed arrangement when arrangement is missing from parameters", async () => {
    const { getByLabelText } = await render(<PulleyDiagram diagram={{ blueprintId: "mechanical.pulley_arrangement", parameters: {}, labels: [] }} />);
    expect(getByLabelText(/A fixed pulley:/)).toBeTruthy();
  });
});
