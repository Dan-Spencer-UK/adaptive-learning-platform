import {
  describeExpression,
  formatExpressionInline,
  substitutionResolver,
  symbolicResolver,
} from "./format-formula";
import {
  FORMULA_OHMS_LAW,
  FORMULA_PARALLEL_RESISTANCE,
  FORMULA_SERIES_RESISTANCE,
} from "@/lib/proving-content/unit202-proving-fixture";

describe("format-formula", () => {
  it("renders multiply (V = I x R) symbolically and with substitution", () => {
    const form = FORMULA_OHMS_LAW.forms.find((f) => f.target === "V")!;
    expect(formatExpressionInline(form.expression)).toBe("I × R");
    expect(formatExpressionInline(form.expression, substitutionResolver({ I: 4, R: 6 }))).toBe("4 × 6");
    expect(describeExpression(form.expression)).toBe("I times R");
  });

  it("renders divide (I = V / R) symbolically and with substitution", () => {
    const form = FORMULA_OHMS_LAW.forms.find((f) => f.target === "I")!;
    expect(formatExpressionInline(form.expression)).toBe("V / R");
    expect(formatExpressionInline(form.expression, substitutionResolver({ V: 24, R: 6 }))).toBe("24 / 6");
    expect(describeExpression(form.expression)).toBe("V divided by R");
  });

  it("renders add (Rt = R1 + R2 + R3 + R4) with only bound operands substituted, unbound left symbolic", () => {
    const form = FORMULA_SERIES_RESISTANCE.forms[0]!;
    expect(formatExpressionInline(form.expression)).toBe("R1 + R2 + R3 + R4");
    expect(formatExpressionInline(form.expression, substitutionResolver({ R1: 10, R2: 20, R3: 30 }))).toBe(
      "10 + 20 + 30 + R4",
    );
  });

  it("renders reciprocal_of_sum_of_reciprocals (parallel Rt) correctly", () => {
    const form = FORMULA_PARALLEL_RESISTANCE.forms[0]!;
    expect(formatExpressionInline(form.expression)).toBe("1 / (1/R1 + 1/R2 + 1/R3 + 1/R4)");
    expect(describeExpression(form.expression)).toContain("one divided by the sum of");
  });

  it("symbolicResolver returns the bare symbol", () => {
    expect(symbolicResolver("R1")).toBe("R1");
  });

  it("substitutionResolver falls back to the symbol for unbound variables", () => {
    const resolve = substitutionResolver({ V: 24 });
    expect(resolve("V")).toBe("24");
    expect(resolve("R")).toBe("R");
  });

  it("renders sqrt and square nested inside real formula operations without throwing", () => {
    // formula.ac_waveform_relationships' rms form: peak / sqrt(2) -- exercises numeric-literal sqrt operand.
    const expr = { operation: "divide" as const, numerator: "peak", denominator: { operation: "sqrt" as const, operand: 2 } };
    expect(formatExpressionInline(expr)).toBe("peak / (√2)");
    expect(describeExpression(expr)).toBe("peak divided by the square root of 2");
  });
});
