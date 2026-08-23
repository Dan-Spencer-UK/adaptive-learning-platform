import { render } from "@testing-library/react-native";

import { ResistivityDimensionsDiagram } from "./ResistivityDimensionsDiagram";

describe("ResistivityDimensionsDiagram", () => {
  it("describes the length comparison and renders symbolic shorter/longer captions for comparison: length", async () => {
    const result = await render(
      <ResistivityDimensionsDiagram diagram={{ blueprintId: "mechanical.resistivity_dimensions", parameters: { comparison: "length" }, labels: [] }} />,
    );
    expect(
      result.getByLabelText(
        /Comparing conductor length, with cross-sectional area and material held the same: the shorter rod has less resistance, and the longer rod has more resistance\./,
      ),
    ).toBeTruthy();
    const tree = JSON.stringify(result.toJSON());
    expect(tree).toContain("shorter -> less resistance");
    expect(tree).toContain("longer -> more resistance");
  });

  it("describes the area comparison and renders symbolic thinner/thicker captions for comparison: area", async () => {
    const result = await render(
      <ResistivityDimensionsDiagram diagram={{ blueprintId: "mechanical.resistivity_dimensions", parameters: { comparison: "area" }, labels: [] }} />,
    );
    expect(
      result.getByLabelText(
        /Comparing conductor cross-sectional area, with length and material held the same: the thinner rod has more resistance, and the thicker rod has less resistance\./,
      ),
    ).toBeTruthy();
    const tree = JSON.stringify(result.toJSON());
    expect(tree).toContain("thinner -> more resistance");
    expect(tree).toContain("thicker -> less resistance");
  });

  it("never embeds a numeric value anywhere in the rendered artwork (symbolic_only convention)", async () => {
    const lengthResult = await render(
      <ResistivityDimensionsDiagram diagram={{ blueprintId: "mechanical.resistivity_dimensions", parameters: { comparison: "length" }, labels: [] }} />,
    );
    const areaResult = await render(
      <ResistivityDimensionsDiagram diagram={{ blueprintId: "mechanical.resistivity_dimensions", parameters: { comparison: "area" }, labels: [] }} />,
    );
    // Extract only the text-bearing "children" arrays from the render tree, since
    // numeric-looking layout coordinates (x/y/width props etc) are expected and fine --
    // only literal caption/label TEXT content must never contain a digit.
    const captionTexts = (json: unknown): string[] => {
      const out: string[] = [];
      const visit = (node: unknown) => {
        if (Array.isArray(node)) {
          node.forEach(visit);
          return;
        }
        if (node && typeof node === "object") {
          const n = node as { children?: unknown[] };
          if (Array.isArray(n.children)) {
            for (const child of n.children) {
              if (typeof child === "string") out.push(child);
              else visit(child);
            }
          }
        }
      };
      visit(json);
      return out;
    };

    for (const text of [...captionTexts(lengthResult.toJSON()), ...captionTexts(areaResult.toJSON())]) {
      expect(text).not.toMatch(/\d/);
    }
  });

  it("falls back to the length comparison when comparison is missing from parameters", async () => {
    const { getByLabelText } = await render(
      <ResistivityDimensionsDiagram diagram={{ blueprintId: "mechanical.resistivity_dimensions", parameters: {}, labels: [] }} />,
    );
    expect(getByLabelText(/Comparing conductor length,/)).toBeTruthy();
  });
});
