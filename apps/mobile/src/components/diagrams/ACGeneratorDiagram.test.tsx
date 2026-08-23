import { render } from "@testing-library/react-native";

import { ACGeneratorDiagram } from "./ACGeneratorDiagram";

describe("ACGeneratorDiagram", () => {
  it("always describes the pole arrangement and that a loop rotates on a central axis", async () => {
    const { getByLabelText } = await render(
      <ACGeneratorDiagram diagram={{ blueprintId: "generator.rotating_loop", parameters: { rotation_phase: "vertical" }, labels: [] }} />,
    );
    expect(getByLabelText(/North pole on the left, south pole on the right\./)).toBeTruthy();
    expect(getByLabelText(/A single loop of wire rotates on a central vertical axis between the poles/)).toBeTruthy();
  });

  it("describes the vertical phase as near-peak EMF (loop plane aligned with the field)", async () => {
    const { getByLabelText } = await render(
      <ACGeneratorDiagram diagram={{ blueprintId: "generator.rotating_loop", parameters: { rotation_phase: "vertical" }, labels: [] }} />,
    );
    expect(getByLabelText(/its plane aligned with the field lines.*producing an EMF near its peak/)).toBeTruthy();
  });

  it("describes the horizontal phase as near-zero EMF (loop plane facing the poles)", async () => {
    const { getByLabelText } = await render(
      <ACGeneratorDiagram diagram={{ blueprintId: "generator.rotating_loop", parameters: { rotation_phase: "horizontal" }, labels: [] }} />,
    );
    expect(getByLabelText(/its plane at right angles to the field lines, directly facing the poles.*producing an EMF near zero/)).toBeTruthy();
  });

  it("renders a visually distinct loop shape for each phase (tall/narrow vs wide/flat)", async () => {
    const vertical = await render(
      <ACGeneratorDiagram diagram={{ blueprintId: "generator.rotating_loop", parameters: { rotation_phase: "vertical" }, labels: [] }} />,
    );
    const horizontal = await render(
      <ACGeneratorDiagram diagram={{ blueprintId: "generator.rotating_loop", parameters: { rotation_phase: "horizontal" }, labels: [] }} />,
    );
    expect(vertical.toJSON()).not.toEqual(horizontal.toJSON());
  });

  it("never draws a waveform or a numeric EMF value -- purely qualitative loop-position teaching", async () => {
    const { toJSON } = await render(
      <ACGeneratorDiagram diagram={{ blueprintId: "generator.rotating_loop", parameters: { rotation_phase: "vertical" }, labels: [] }} />,
    );
    const svgTree = JSON.stringify(toJSON());
    expect(svgTree).not.toMatch(/[0-9]+\s*V\b/);
  });
});
