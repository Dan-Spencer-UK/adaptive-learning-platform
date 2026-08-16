import { fireEvent, render } from "@testing-library/react-native";

import { FORMULA_OHMS_LAW, MNEMONIC_VIR_TRIANGLE } from "@/lib/proving-content/unit202-proving-fixture";
import { VirTriangle } from "./VirTriangle";

describe("VirTriangle", () => {
  it("reveals the exact governed relationship for the tapped region, derived from formula.ohms_law -- never a hardcoded string", async () => {
    const { getByLabelText, getByText, queryByText } = await render(
      <VirTriangle visualAid={MNEMONIC_VIR_TRIANGLE} formulaFamily={FORMULA_OHMS_LAW} />,
    );

    expect(queryByText("Covering I shows:")).toBeNull();

    await fireEvent.press(getByLabelText("I region of the VIR triangle"));
    expect(getByText("Covering I shows:")).toBeTruthy();
    expect(getByLabelText("I equals V divided by R")).toBeTruthy();

    await fireEvent.press(getByLabelText("R region of the VIR triangle"));
    expect(getByText("Covering R shows:")).toBeTruthy();
    expect(getByLabelText("R equals V divided by I")).toBeTruthy();

    await fireEvent.press(getByLabelText("V region of the VIR triangle"));
    expect(getByText("Covering V shows:")).toBeTruthy();
    expect(getByLabelText("V equals I times R")).toBeTruthy();
  });

  it("deselects (returns to hint state) when the same region is tapped again", async () => {
    const { getByLabelText, getByText } = await render(
      <VirTriangle visualAid={MNEMONIC_VIR_TRIANGLE} formulaFamily={FORMULA_OHMS_LAW} />,
    );
    await fireEvent.press(getByLabelText("V region of the VIR triangle"));
    expect(getByText("Covering V shows:")).toBeTruthy();
    await fireEvent.press(getByLabelText("V region of the VIR triangle"));
    expect(getByText("Tap a letter to reveal the relationship it stands for.")).toBeTruthy();
  });

  it("marks the selected region's accessibility state as selected", async () => {
    const { getByLabelText } = await render(
      <VirTriangle visualAid={MNEMONIC_VIR_TRIANGLE} formulaFamily={FORMULA_OHMS_LAW} />,
    );
    const button = getByLabelText("I region of the VIR triangle");
    expect(button.props.accessibilityState?.selected).toBe(false);
    await fireEvent.press(button);
    expect(button.props.accessibilityState?.selected).toBe(true);
  });
});
