import { render } from "@testing-library/react-native";

import { FORMULA_OHMS_LAW } from "@/lib/proving-content/unit202-proving-fixture";
import { VariableKey } from "./VariableKey";

describe("VariableKey", () => {
  it("renders one accessible row per governed variable with name and unit", async () => {
    const { getByLabelText } = await render(<VariableKey variables={FORMULA_OHMS_LAW.variables} />);
    expect(getByLabelText("V stands for voltage, measured in volt, symbol V")).toBeTruthy();
    expect(getByLabelText("I stands for current, measured in ampere, symbol A")).toBeTruthy();
    expect(getByLabelText("R stands for resistance, measured in ohm, symbol Ω")).toBeTruthy();
  });
});
