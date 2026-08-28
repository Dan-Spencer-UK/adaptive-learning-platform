import { render } from "@testing-library/react-native";

import { MotionalEmfDiagram } from "./MotionalEmfDiagram";

describe("MotionalEmfDiagram", () => {
  it("states that B, L and v are mutually perpendicular", async () => {
    const { getByLabelText } = await render(
      <MotionalEmfDiagram diagram={{ blueprintId: "emf.motional_emf_geometry", parameters: {}, labels: [] }} />,
    );
    expect(
      getByLabelText(/The conductor's length, its velocity and the magnetic field are mutually perpendicular to one another/),
    ).toBeTruthy();
  });

  it("identifies what each of B, L and v represents in the accessibility label", async () => {
    const { getByLabelText } = await render(
      <MotionalEmfDiagram diagram={{ blueprintId: "emf.motional_emf_geometry", parameters: {}, labels: [] }} />,
    );
    expect(getByLabelText(/A conductor of length L lies across two parallel rails/)).toBeTruthy();
    expect(getByLabelText(/can slide along the rails with velocity v/)).toBeTruthy();
    expect(getByLabelText(/The magnetic field B points straight down through the plane/)).toBeTruthy();
  });

  it("renders the same fixed geometry regardless of the diagram instance's parameters (a governed given fact, never a varying/oblique case)", async () => {
    const a = await render(<MotionalEmfDiagram diagram={{ blueprintId: "emf.motional_emf_geometry", parameters: {}, labels: [] }} />);
    const b = await render(
      <MotionalEmfDiagram diagram={{ blueprintId: "emf.motional_emf_geometry", parameters: { irrelevant: "value" }, labels: ["conductor"] }} />,
    );
    expect(a.toJSON()).toEqual(b.toJSON());
  });

  it("draws all three of B, L and v as distinct labelled SVG elements", async () => {
    const { toJSON } = await render(<MotionalEmfDiagram diagram={{ blueprintId: "emf.motional_emf_geometry", parameters: {}, labels: [] }} />);
    const svgTree = JSON.stringify(toJSON());
    expect(svgTree).toContain('"content":"B"');
    expect(svgTree).toContain('"content":"L"');
    expect(svgTree).toContain('"content":"v"');
  });

  it("never introduces a numeric value or angle -- purely the given perpendicular geometry", async () => {
    const { toJSON } = await render(<MotionalEmfDiagram diagram={{ blueprintId: "emf.motional_emf_geometry", parameters: {}, labels: [] }} />);
    const svgTree = JSON.stringify(toJSON());
    expect(svgTree).not.toMatch(/sin\(|theta|degrees/i);
  });
});
