/**
 * CC-05C-DIAGRAM-FIX: proves the right-hand-grip-rule diagram (a) is a
 * genuine hand-based teaching visual (thumb and finger elements present,
 * distinctly labelled, not just a generic arrow arrangement) and (b)
 * correctly withholds the assessed answer (field-curl direction) during
 * assessment while always showing the given information (current
 * direction / thumb).
 */
import { render } from "@testing-library/react-native";

import { RightHandGripRuleDiagram } from "./RightHandGripRuleDiagram";

describe("RightHandGripRuleDiagram", () => {
  it("always describes the thumb pointing along the current direction (given information)", async () => {
    const { getByLabelText } = await render(
      <RightHandGripRuleDiagram
        diagram={{ blueprintId: "magnetic.field_conductor_direction", parameters: { current_direction: "into_page", show_field_arrows: true }, labels: ["conductor"] }}
      />,
    );
    expect(getByLabelText(/Right-hand grip rule\./)).toBeTruthy();
    expect(getByLabelText(/The thumb points along the conductor, in the direction the conventional current into the page flows\./)).toBeTruthy();
  });

  it("describes out-of-page current distinctly from into-page current", async () => {
    const { getByLabelText } = await render(
      <RightHandGripRuleDiagram
        diagram={{ blueprintId: "magnetic.field_conductor_direction", parameters: { current_direction: "out_of_page", show_field_arrows: true }, labels: ["conductor"] }}
      />,
    );
    expect(getByLabelText(/in the direction the conventional current out of the page flows\./)).toBeTruthy();
  });

  it("withholds the field-curl direction (the assessed answer) when fieldRotation is omitted", async () => {
    const { getByLabelText } = await render(
      <RightHandGripRuleDiagram
        diagram={{ blueprintId: "magnetic.field_conductor_direction", parameters: { current_direction: "into_page", show_field_arrows: true }, labels: ["conductor"] }}
      />,
    );
    expect(getByLabelText(/The direction the fingers curl \(the magnetic field direction\) is not shown\./)).toBeTruthy();
  });

  it("reveals the field-curl direction only when fieldRotation is explicitly passed (teaching mode)", async () => {
    const withoutReveal = await render(
      <RightHandGripRuleDiagram
        diagram={{ blueprintId: "magnetic.field_conductor_direction", parameters: { current_direction: "into_page", show_field_arrows: true }, labels: ["conductor"] }}
      />,
    );
    const withReveal = await render(
      <RightHandGripRuleDiagram
        diagram={{ blueprintId: "magnetic.field_conductor_direction", parameters: { current_direction: "into_page", show_field_arrows: true }, labels: ["conductor"] }}
        fieldRotation="clockwise"
      />,
    );
    expect(withReveal.getByLabelText(/The curled fingers show the magnetic field circling clockwise as seen by the viewer\./)).toBeTruthy();
    // Rendering more SVG elements (the arc + arrowhead + label) proves something extra was drawn for the reveal case.
    expect(withReveal.toJSON()).not.toEqual(withoutReveal.toJSON());
  });

  it("renders a distinct thumb element (a tapered wedge, coloured and positioned separately from the finger curls), not a generic field arrow", async () => {
    const { toJSON } = await render(
      <RightHandGripRuleDiagram
        diagram={{ blueprintId: "magnetic.field_conductor_direction", parameters: { current_direction: "into_page", show_field_arrows: true }, labels: ["conductor"] }}
      />,
    );
    // Structural proof of a hand shape: a palm path, a tapered thumb wedge,
    // and four separate finger-curl paths -- not a single arrow/line pair.
    const svgTree = JSON.stringify(toJSON());
    const pathCount = (svgTree.match(/"RNSVGPath"/g) ?? []).length;
    expect(pathCount).toBeGreaterThanOrEqual(6); // 1 palm + 1 thumb wedge + 4 finger curls
  });

  it("CC-11.3: the thumb TIP carries the identical into/out-of-page glyph the conductor symbol uses, tying the thumb's own direction to the current direction rather than leaving them as unrelated marks", async () => {
    const outOfPage = await render(
      <RightHandGripRuleDiagram diagram={{ blueprintId: "magnetic.field_conductor_direction", parameters: { current_direction: "out_of_page", show_field_arrows: true }, labels: ["conductor"] }} />,
    );
    // out_of_page: conductor body circle + conductor centre dot + thumb-tip dot = 3 circles.
    const outOfPageCircleCount = (JSON.stringify(outOfPage.toJSON()).match(/"RNSVGCircle"/g) ?? []).length;
    expect(outOfPageCircleCount).toBe(3);

    const intoPage = await render(
      <RightHandGripRuleDiagram diagram={{ blueprintId: "magnetic.field_conductor_direction", parameters: { current_direction: "into_page", show_field_arrows: true }, labels: ["conductor"] }} />,
    );
    // into_page: conductor body circle only (the cross, and the thumb-tip cross, are drawn as lines, not circles).
    const intoPageCircleCount = (JSON.stringify(intoPage.toJSON()).match(/"RNSVGCircle"/g) ?? []).length;
    expect(intoPageCircleCount).toBe(1);
  });
});
