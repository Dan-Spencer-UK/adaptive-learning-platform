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

  // CC-12G: the I-vs-l readability fix applies to the symbol badge, not
  // just the equation view -- a legend showing "I" and "L" side by side
  // is exactly where the original ambiguity would show up. Resolved by
  // renaming the governed length symbol to plain capital "L" (the
  // course's own existing notation), not by introducing a special glyph.
  it("renders I and L as distinct plain symbol badges, with the accessible name unaffected", async () => {
    const variables = [
      { symbol: "I", name: "current", quantity: "current", unitName: "ampere", unitSymbol: "A" },
      { symbol: "L", name: "conductor length", quantity: "length", unitName: "metre", unitSymbol: "m" },
    ];
    const { getByText, getByLabelText } = await render(<VariableKey variables={variables} />);
    expect(getByText("I")).toBeTruthy();
    expect(getByText("L")).toBeTruthy();
    expect(getByLabelText("L stands for conductor length, measured in metre, symbol m")).toBeTruthy();
  });
});
