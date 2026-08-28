import { fireEvent, render } from "@testing-library/react-native";

import { FORMULA_OHMS_LAW, MNEMONIC_VIR_TRIANGLE } from "@/lib/proving-content/unit202-proving-fixture";
import { VirTriangle } from "./VirTriangle";

describe("VirTriangle", () => {
  it("reveals the exact governed relationship for the tapped region, derived from formula.ohms_law -- never a hardcoded string", async () => {
    const { getByLabelText, getByText, queryByText } = await render(
      <VirTriangle visualAid={MNEMONIC_VIR_TRIANGLE} formulaFamily={FORMULA_OHMS_LAW} />,
    );

    expect(queryByText("Covering I shows:")).toBeNull();

    await fireEvent.press(getByLabelText("Cover current I"));
    expect(getByText("Covering I shows:")).toBeTruthy();
    expect(getByLabelText("I equals V divided by R")).toBeTruthy();

    await fireEvent.press(getByLabelText("Cover resistance R"));
    expect(getByText("Covering R shows:")).toBeTruthy();
    expect(getByLabelText("R equals V divided by I")).toBeTruthy();

    await fireEvent.press(getByLabelText("Cover voltage V"));
    expect(getByText("Covering V shows:")).toBeTruthy();
    expect(getByLabelText("V equals I times R")).toBeTruthy();
  });

  it("deselects (returns to hint state) when the same region is tapped again", async () => {
    const { getByLabelText, getByText } = await render(
      <VirTriangle visualAid={MNEMONIC_VIR_TRIANGLE} formulaFamily={FORMULA_OHMS_LAW} />,
    );
    await fireEvent.press(getByLabelText("Cover voltage V"));
    expect(getByText("Covering V shows:")).toBeTruthy();
    await fireEvent.press(getByLabelText("voltage (V) covered. Relationship revealed. Tap to uncover."));
    expect(getByText("Tap a letter to cover it and reveal the relationship it stands for.")).toBeTruthy();
  });

  it("marks the selected region's accessibility state as selected", async () => {
    const { getByLabelText } = await render(
      <VirTriangle visualAid={MNEMONIC_VIR_TRIANGLE} formulaFamily={FORMULA_OHMS_LAW} />,
    );
    const button = getByLabelText("Cover current I");
    expect(button.props.accessibilityState?.selected).toBe(false);
    await fireEvent.press(button);
    expect(button.props.accessibilityState?.selected).toBe(true);
  });

  it("exposes the revealed relationship in the selected region's own accessibility label, and only one region is covered at a time", async () => {
    const { getByLabelText, queryByLabelText } = await render(
      <VirTriangle visualAid={MNEMONIC_VIR_TRIANGLE} formulaFamily={FORMULA_OHMS_LAW} />,
    );
    await fireEvent.press(getByLabelText("Cover current I"));
    expect(getByLabelText("current (I) covered. Relationship revealed. Tap to uncover.")).toBeTruthy();
    // The other two regions are untouched -- still offering to cover, not already covered.
    expect(getByLabelText("Cover voltage V")).toBeTruthy();
    expect(getByLabelText("Cover resistance R")).toBeTruthy();
    expect(queryByLabelText("voltage (V) covered. Relationship revealed. Tap to uncover.")).toBeNull();
  });
});
