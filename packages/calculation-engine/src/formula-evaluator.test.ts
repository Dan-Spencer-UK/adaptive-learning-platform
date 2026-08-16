import { describe, expect, it } from "vitest";
import type { FormulaExpression } from "@alp/content-schema";
import {
  CALCULATION_PRECISION_DECIMALS,
  collectFormulaVariableSymbols,
  evaluateFormulaExpression,
  FormulaEvaluationError,
  roundToPrecision,
  selectFormForKnownVariables,
} from "./formula-evaluator.ts";

describe("evaluateFormulaExpression", () => {
  it("multiply: V = I x R", () => {
    const expr: FormulaExpression = { operation: "multiply", operands: ["I", "R"] };
    expect(evaluateFormulaExpression(expr, { I: 4, R: 6 })).toBe(24);
  });

  it("divide: I = V / R", () => {
    const expr: FormulaExpression = { operation: "divide", numerator: "V", denominator: "R" };
    expect(evaluateFormulaExpression(expr, { V: 24, R: 6 })).toBe(4);
  });

  it("divide by zero throws explicitly", () => {
    const expr: FormulaExpression = { operation: "divide", numerator: "V", denominator: "R" };
    expect(() => evaluateFormulaExpression(expr, { V: 24, R: 0 })).toThrow(FormulaEvaluationError);
  });

  it("add: series total resistance across exactly the bound components", () => {
    const expr: FormulaExpression = { operation: "add", operands: ["R1", "R2", "R3", "R4"] };
    expect(evaluateFormulaExpression(expr, { R1: 6, R2: 12, R3: 4 })).toBe(22);
  });

  it("add: 2-component series total (R3/R4 unbound, silently skipped)", () => {
    const expr: FormulaExpression = { operation: "add", operands: ["R1", "R2", "R3", "R4"] };
    expect(evaluateFormulaExpression(expr, { R1: 10, R2: 20 })).toBe(30);
  });

  it("subtract", () => {
    const expr: FormulaExpression = { operation: "subtract", operands: ["Rt", "R1", "R2"] };
    expect(evaluateFormulaExpression(expr, { Rt: 30, R1: 10, R2: 5 })).toBe(15);
  });

  it("square", () => {
    const expr: FormulaExpression = { operation: "square", operand: "I" };
    expect(evaluateFormulaExpression(expr, { I: 5 })).toBe(25);
  });

  it("sqrt", () => {
    const expr: FormulaExpression = { operation: "sqrt", operand: 2 };
    expect(evaluateFormulaExpression(expr, {})).toBeCloseTo(Math.SQRT2, 6);
  });

  it("sqrt of negative throws explicitly", () => {
    const expr: FormulaExpression = { operation: "sqrt", operand: -4 };
    expect(() => evaluateFormulaExpression(expr, {})).toThrow(FormulaEvaluationError);
  });

  it("power", () => {
    const expr: FormulaExpression = { operation: "power", operand: 2, exponent: 10 };
    expect(evaluateFormulaExpression(expr, {})).toBe(1024);
  });

  it("reciprocal", () => {
    const expr: FormulaExpression = { operation: "reciprocal", operand: "R" };
    expect(evaluateFormulaExpression(expr, { R: 4 })).toBe(0.25);
  });

  it("reciprocal of 0 throws explicitly", () => {
    const expr: FormulaExpression = { operation: "reciprocal", operand: "R" };
    expect(() => evaluateFormulaExpression(expr, { R: 0 })).toThrow(FormulaEvaluationError);
  });

  it("reciprocal_of_sum_of_reciprocals: parallel total resistance (classic 6/12/4 -> 2)", () => {
    const expr: FormulaExpression = {
      operation: "reciprocal_of_sum_of_reciprocals",
      operands: ["R1", "R2", "R3", "R4"],
    };
    expect(evaluateFormulaExpression(expr, { R1: 6, R2: 12, R3: 4 })).toBe(2);
  });

  it("reciprocal_of_sum_of_reciprocals: 2-branch case, unbound slots skipped", () => {
    const expr: FormulaExpression = {
      operation: "reciprocal_of_sum_of_reciprocals",
      operands: ["R1", "R2", "R3", "R4"],
    };
    // 1/(1/10 + 1/10) = 5
    expect(evaluateFormulaExpression(expr, { R1: 10, R2: 10 })).toBe(5);
  });

  it("ratio_percentage: efficiency", () => {
    const expr: FormulaExpression = { operation: "ratio_percentage", numerator: "Pout", denominator: "Pin" };
    expect(evaluateFormulaExpression(expr, { Pout: 75, Pin: 100 })).toBe(75);
  });

  it("nested expression: P = I^2 x R", () => {
    const expr: FormulaExpression = {
      operation: "multiply",
      operands: [{ operation: "square", operand: "I" }, "R"],
    };
    expect(evaluateFormulaExpression(expr, { I: 3, R: 10 })).toBe(90);
  });

  it("nested expression: R = (rho x L) / A", () => {
    const expr: FormulaExpression = {
      operation: "divide",
      numerator: { operation: "multiply", operands: ["rho", "L"] },
      denominator: "A",
    };
    expect(evaluateFormulaExpression(expr, { rho: 2, L: 5, A: 4 })).toBe(2.5);
  });

  it("nested expression with literal constant: rms = peak / sqrt(2)", () => {
    const expr: FormulaExpression = {
      operation: "divide",
      numerator: "peak",
      denominator: { operation: "sqrt", operand: 2 },
    };
    expect(evaluateFormulaExpression(expr, { peak: 100 })).toBeCloseTo(70.710678, 5);
  });

  it("throws on a missing required (non-variadic) binding", () => {
    const expr: FormulaExpression = { operation: "multiply", operands: ["I", "R"] };
    expect(() => evaluateFormulaExpression(expr, { I: 4 })).toThrow(FormulaEvaluationError);
  });

  it("add with zero bound operands throws explicitly rather than returning 0 silently", () => {
    const expr: FormulaExpression = { operation: "add", operands: ["R1", "R2"] };
    expect(() => evaluateFormulaExpression(expr, {})).toThrow(FormulaEvaluationError);
  });
});

describe("roundToPrecision", () => {
  it("avoids classic float noise (0.1 + 0.2)", () => {
    expect(roundToPrecision(0.1 + 0.2)).toBe(0.3);
  });

  it("respects the documented default precision", () => {
    expect(CALCULATION_PRECISION_DECIMALS).toBe(6);
    expect(roundToPrecision(1 / 3)).toBe(0.333333);
  });
});

describe("collectFormulaVariableSymbols", () => {
  it("collects every leaf variable symbol, ignoring numeric literals", () => {
    const expr: FormulaExpression = {
      operation: "multiply",
      operands: [{ operation: "square", operand: "I" }, "R"],
    };
    expect([...collectFormulaVariableSymbols(expr)].sort()).toEqual(["I", "R"]);
  });

  it("excludes numeric literals", () => {
    const expr: FormulaExpression = { operation: "divide", numerator: "peak", denominator: { operation: "sqrt", operand: 2 } };
    expect([...collectFormulaVariableSymbols(expr)]).toEqual(["peak"]);
  });
});

describe("selectFormForKnownVariables", () => {
  const forms = [
    { target: "P", expression: { operation: "multiply", operands: ["V", "I"] } as FormulaExpression, instruction: "", requiresWorkedExample: true },
    { target: "P", expression: { operation: "multiply", operands: [{ operation: "square", operand: "I" } as FormulaExpression, "R"] } as FormulaExpression, instruction: "", requiresWorkedExample: true },
    { target: "P", expression: { operation: "divide", numerator: { operation: "square", operand: "V" } as FormulaExpression, denominator: "R" } as FormulaExpression, instruction: "", requiresWorkedExample: true },
  ];

  it("selects the unique form whose required variables match exactly", () => {
    expect(selectFormForKnownVariables(forms, "P", ["I", "R"]).expression).toEqual(forms[1]!.expression);
    expect(selectFormForKnownVariables(forms, "P", ["V", "I"]).expression).toEqual(forms[0]!.expression);
    expect(selectFormForKnownVariables(forms, "P", ["V", "R"]).expression).toEqual(forms[2]!.expression);
  });

  it("throws when no form matches", () => {
    expect(() => selectFormForKnownVariables(forms, "P", ["Q"])).toThrow(FormulaEvaluationError);
  });
});
