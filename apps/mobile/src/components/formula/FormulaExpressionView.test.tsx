import { render } from "@testing-library/react-native";

import { FORMULA_OHMS_LAW, FORMULA_SERIES_RESISTANCE } from "@/lib/proving-content/unit202-proving-fixture";
import { substitutionResolver } from "@/lib/formula-rendering/format-formula";
import { FormulaEquation } from "./FormulaExpressionView";

describe("FormulaEquation", () => {
  it("renders the target symbol and an accessibility label describing the whole relationship", async () => {
    const form = FORMULA_OHMS_LAW.forms.find((f) => f.target === "V")!;
    const { getByLabelText } = await render(<FormulaEquation target="V" expression={form.expression} />);
    expect(getByLabelText("V equals I times R")).toBeTruthy();
  });

  it("renders substituted numeric values when given a substitution resolver", async () => {
    const form = FORMULA_OHMS_LAW.forms.find((f) => f.target === "I")!;
    const { getByLabelText } = await render(
      <FormulaEquation target="I" expression={form.expression} resolve={substitutionResolver({ V: 24, R: 6 })} unitSymbol="A" />,
    );
    expect(getByLabelText("I equals 24 divided by 6 A")).toBeTruthy();
  });

  it("renders an add expression with more than two operands (series resistance)", async () => {
    const form = FORMULA_SERIES_RESISTANCE.forms[0]!;
    const { getByLabelText } = await render(<FormulaEquation target="Rt" expression={form.expression} />);
    expect(getByLabelText(/Rt equals R1 plus R2 plus R3 plus R4/)).toBeTruthy();
  });

  // CC-12G: F = B x I x l originally rendered capital I (current) and
  // lowercase l (conductor length) as visually near-identical vertical
  // strokes (a Product Owner emulator finding). The governed length
  // symbol is renamed to plain capital "L" (the course's own existing
  // notation) rather than introducing a special glyph -- "I" and "L"
  // are visually distinguishable strokes.
  it("renders I and L as distinct plain symbols, with the accessibility label unaffected", async () => {
    const expression = { operation: "multiply" as const, operands: ["B", "I", "L"] };
    const { getByText, getByLabelText } = await render(<FormulaEquation target="F" expression={expression} />);
    expect(getByText("I")).toBeTruthy();
    expect(getByText("L")).toBeTruthy();
    expect(getByLabelText("F equals B times I times L")).toBeTruthy();
  });
});
