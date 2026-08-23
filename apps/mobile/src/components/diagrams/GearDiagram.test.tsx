import { render } from "@testing-library/react-native";

import { GearDiagram } from "./GearDiagram";

describe("GearDiagram", () => {
  it("describes the driven gear as larger, with lower speed and higher torque, for driven_larger", async () => {
    const result = await render(<GearDiagram diagram={{ blueprintId: "mechanical.gear_mesh", parameters: { size_ratio: "driven_larger" }, labels: [] }} />);
    expect(
      result.getByLabelText(/The driven gear is larger than the driver gear, meaning it turns more slowly and produces higher output torque\./),
    ).toBeTruthy();
    const tree = JSON.stringify(result.toJSON());
    expect(tree).toContain("Driver");
    expect(tree).toContain("Driven");
  });

  it("describes the driven gear as smaller, with higher speed and lower torque, for driven_smaller", async () => {
    const { getByLabelText } = await render(
      <GearDiagram diagram={{ blueprintId: "mechanical.gear_mesh", parameters: { size_ratio: "driven_smaller" }, labels: [] }} />,
    );
    expect(
      getByLabelText(/The driven gear is smaller than the driver gear, meaning it turns faster and produces lower output torque\./),
    ).toBeTruthy();
  });

  it("describes the driven gear as the same size for equal, with no speed/torque change", async () => {
    const { getByLabelText } = await render(
      <GearDiagram diagram={{ blueprintId: "mechanical.gear_mesh", parameters: { size_ratio: "equal" }, labels: [] }} />,
    );
    expect(getByLabelText(/The driven gear is the same size as the driver gear, so speed and torque are unchanged\./)).toBeTruthy();
  });

  it("falls back to equal size when size_ratio is missing from parameters", async () => {
    const { getByLabelText } = await render(<GearDiagram diagram={{ blueprintId: "mechanical.gear_mesh", parameters: {}, labels: [] }} />);
    expect(getByLabelText(/the same size as the driver gear/)).toBeTruthy();
  });
});
