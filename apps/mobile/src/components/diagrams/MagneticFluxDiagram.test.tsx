import { render } from "@testing-library/react-native";

import { MagneticFluxDiagram } from "./MagneticFluxDiagram";

describe("MagneticFluxDiagram", () => {
  it("always describes the field lines from north to south, even without density comparison", async () => {
    const { getByLabelText } = await render(
      <MagneticFluxDiagram diagram={{ blueprintId: "magnetic.flux_field_lines", parameters: { density_comparison: false }, labels: [] }} />,
    );
    expect(
      getByLabelText(/A bar magnet with curved field lines arcing from the north pole, around, to the south pole/),
    ).toBeTruthy();
  });

  it("does not describe or draw the density-comparison gates when density_comparison is false", async () => {
    const { getByLabelText, toJSON } = await render(
      <MagneticFluxDiagram diagram={{ blueprintId: "magnetic.flux_field_lines", parameters: { density_comparison: false }, labels: [] }} />,
    );
    expect(getByLabelText(/^A bar magnet with curved field lines.*\.$/)).toBeTruthy();
    const svgTree = JSON.stringify(toJSON());
    expect(svgTree).not.toContain("Lower density");
    expect(svgTree).not.toContain("Higher density");
  });

  it("describes the area-vs-concentration relationship in words when density_comparison is true", async () => {
    const { getByLabelText, toJSON } = await render(
      <MagneticFluxDiagram diagram={{ blueprintId: "magnetic.flux_field_lines", parameters: { density_comparison: true }, labels: [] }} />,
    );
    expect(
      getByLabelText(/a wider gate on the left, giving lower flux density.*a narrower gate on the right, giving higher flux density/),
    ).toBeTruthy();
    const svgTree = JSON.stringify(toJSON());
    expect(svgTree).toContain("Lower density");
    expect(svgTree).toContain("Higher density");
  });

  it("never embeds a formula or numeric flux value -- purely conceptual", async () => {
    const { toJSON } = await render(
      <MagneticFluxDiagram diagram={{ blueprintId: "magnetic.flux_field_lines", parameters: { density_comparison: true }, labels: [] }} />,
    );
    const svgTree = JSON.stringify(toJSON());
    expect(svgTree).not.toMatch(/[0-9]+\s*(Wb|T|weber|tesla)/);
  });

  it("defaults to no density comparison when the parameter is absent", async () => {
    const { toJSON } = await render(<MagneticFluxDiagram diagram={{ blueprintId: "magnetic.flux_field_lines", parameters: {}, labels: [] }} />);
    const svgTree = JSON.stringify(toJSON());
    expect(svgTree).not.toContain("Lower density");
  });
});
