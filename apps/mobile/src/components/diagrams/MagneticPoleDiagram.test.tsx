import { render } from "@testing-library/react-native";

import { MagneticPoleDiagram } from "./MagneticPoleDiagram";

describe("MagneticPoleDiagram", () => {
  it("describes both facing poles as north for like_poles_facing", async () => {
    const { getByLabelText } = await render(
      <MagneticPoleDiagram diagram={{ blueprintId: "magnetic.pole_interaction", parameters: { pole_pairing: "like_poles_facing" }, labels: [] }} />,
    );
    expect(
      getByLabelText(/the north pole of the left magnet faces the north pole of the right magnet\./),
    ).toBeTruthy();
  });

  it("describes north facing south for unlike_poles_facing", async () => {
    const { getByLabelText } = await render(
      <MagneticPoleDiagram diagram={{ blueprintId: "magnetic.pole_interaction", parameters: { pole_pairing: "unlike_poles_facing" }, labels: [] }} />,
    );
    expect(
      getByLabelText(/the north pole of the left magnet faces the south pole of the right magnet\./),
    ).toBeTruthy();
  });

  it("withholds the attract/repel behaviour from the accessibility text and visual when showForceArrows is omitted (assessment mode)", async () => {
    const { getByLabelText, toJSON } = await render(
      <MagneticPoleDiagram diagram={{ blueprintId: "magnetic.pole_interaction", parameters: { pole_pairing: "like_poles_facing" }, labels: [] }} />,
    );
    // Only the facing-poles sentence is present -- no "repel"/"attract" verb.
    expect(getByLabelText(/^Two bar magnets facing each other:.*\.$/)).toBeTruthy();
    const svgTree = JSON.stringify(toJSON());
    expect(svgTree).not.toContain("Repel");
    expect(svgTree).not.toContain("Attract");
  });

  it("reveals repel for like poles and attract for unlike poles only when showForceArrows is explicitly passed (teaching mode)", async () => {
    const likeRevealed = await render(
      <MagneticPoleDiagram
        diagram={{ blueprintId: "magnetic.pole_interaction", parameters: { pole_pairing: "like_poles_facing" }, labels: [] }}
        showForceArrows
      />,
    );
    expect(likeRevealed.getByLabelText(/the magnets repel each other\./)).toBeTruthy();
    expect(JSON.stringify(likeRevealed.toJSON())).toContain("Repel");

    const unlikeRevealed = await render(
      <MagneticPoleDiagram
        diagram={{ blueprintId: "magnetic.pole_interaction", parameters: { pole_pairing: "unlike_poles_facing" }, labels: [] }}
        showForceArrows
      />,
    );
    expect(unlikeRevealed.getByLabelText(/the magnets attract each other\./)).toBeTruthy();
    expect(JSON.stringify(unlikeRevealed.toJSON())).toContain("Attract");
  });

  it("defaults to unlike_poles_facing when pole_pairing is not provided", async () => {
    const { getByLabelText } = await render(
      <MagneticPoleDiagram diagram={{ blueprintId: "magnetic.pole_interaction", parameters: {}, labels: [] }} />,
    );
    expect(
      getByLabelText(/the north pole of the left magnet faces the south pole of the right magnet\./),
    ).toBeTruthy();
  });
});
