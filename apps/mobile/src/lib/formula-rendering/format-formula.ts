/**
 * CC-05C: pure, RN-free formatting helpers over CC-05A's structured
 * `FormulaExpression` tree (@alp/content-schema). This module never
 * computes a numeric result -- that is @alp/calculation-engine's job
 * (design doc §8: "rendering must never be the source of calculation
 * truth"). It only turns the same structured tree the engine evaluates
 * into (a) a plain-English accessibility description and (b) a small
 * layout tree the FormulaExpressionView component turns into a fraction-
 * bar visual. Both outputs are derived from the identical structure, so
 * the visual and its screen-reader description can never disagree.
 */
import type { FormulaExpression, FormulaOperand } from "@alp/content-schema";

export type SymbolResolver = (symbol: string) => string;

/** Identity resolver: shows the bare variable symbol (teaching/display mode). */
export const symbolicResolver: SymbolResolver = (symbol) => symbol;

/** Builds a resolver that substitutes known numeric values, falling back to the symbol for anything not yet known (worked-example/substitution mode). */
export function substitutionResolver(values: Readonly<Record<string, number>>): SymbolResolver {
  return (symbol) => (symbol in values ? String(values[symbol]) : symbol);
}

function resolveOperand(operand: FormulaOperand, resolve: SymbolResolver): string {
  if (typeof operand === "number") return String(operand);
  if (typeof operand === "string") return resolve(operand);
  return describeExpression(operand, resolve);
}

/** Plain-English, screen-reader-friendly description of an expression tree -- e.g. "one divided by the square root of two". */
export function describeExpression(expression: FormulaExpression, resolve: SymbolResolver = symbolicResolver): string {
  switch (expression.operation) {
    case "multiply":
      return (expression.operands ?? []).map((o) => resolveOperand(o, resolve)).join(" times ");
    case "add":
      return (expression.operands ?? []).map((o) => resolveOperand(o, resolve)).join(" plus ");
    case "subtract": {
      const [a, b] = expression.operands ?? [];
      return `${a !== undefined ? resolveOperand(a, resolve) : ""} minus ${b !== undefined ? resolveOperand(b, resolve) : ""}`;
    }
    case "square":
      return `${resolveOperand(expression.operand!, resolve)} squared`;
    case "sqrt":
      return `the square root of ${resolveOperand(expression.operand!, resolve)}`;
    case "power":
      return `${resolveOperand(expression.operand!, resolve)} to the power of ${expression.exponent}`;
    case "reciprocal":
      return `one divided by ${resolveOperand(expression.operand!, resolve)}`;
    case "reciprocal_of_sum_of_reciprocals": {
      const parts = (expression.operands ?? []).map((o) => `one divided by ${resolveOperand(o, resolve)}`);
      return `one divided by the sum of: ${parts.join(", plus ")}`;
    }
    case "ratio_percentage":
      return `${resolveOperand(expression.numerator!, resolve)} divided by ${resolveOperand(expression.denominator!, resolve)}, expressed as a percentage`;
    case "divide":
      return `${resolveOperand(expression.numerator!, resolve)} divided by ${resolveOperand(expression.denominator!, resolve)}`;
    default: {
      const exhaustive: never = expression.operation;
      throw new Error(`format-formula: unhandled operation "${String(exhaustive)}"`);
    }
  }
}

/** Compact single-line display string (fallback for contexts that cannot render the fraction-bar layout, e.g. accessibility hints, dev-QA labels). */
export function formatExpressionInline(expression: FormulaExpression, resolve: SymbolResolver = symbolicResolver): string {
  switch (expression.operation) {
    case "multiply":
      return (expression.operands ?? []).map((o) => inlineOperand(o, resolve)).join(" × ");
    case "add":
      return (expression.operands ?? []).map((o) => inlineOperand(o, resolve)).join(" + ");
    case "subtract": {
      const [a, b] = expression.operands ?? [];
      return `${a !== undefined ? inlineOperand(a, resolve) : ""} − ${b !== undefined ? inlineOperand(b, resolve) : ""}`;
    }
    case "square":
      return `${inlineOperand(expression.operand!, resolve)}²`;
    case "sqrt":
      return `√${inlineOperand(expression.operand!, resolve)}`;
    case "power":
      return `${inlineOperand(expression.operand!, resolve)}^${expression.exponent}`;
    case "reciprocal":
      return `1 / ${inlineOperand(expression.operand!, resolve)}`;
    case "reciprocal_of_sum_of_reciprocals": {
      const parts = (expression.operands ?? []).map((o) => `1/${inlineOperand(o, resolve)}`);
      return `1 / (${parts.join(" + ")})`;
    }
    case "ratio_percentage":
      return `(${inlineOperand(expression.numerator!, resolve)} / ${inlineOperand(expression.denominator!, resolve)}) × 100%`;
    case "divide":
      return `${inlineOperand(expression.numerator!, resolve)} / ${inlineOperand(expression.denominator!, resolve)}`;
    default: {
      const exhaustive: never = expression.operation;
      throw new Error(`format-formula: unhandled operation "${String(exhaustive)}"`);
    }
  }
}

function inlineOperand(operand: FormulaOperand, resolve: SymbolResolver): string {
  if (typeof operand === "number") return String(operand);
  if (typeof operand === "string") return resolve(operand);
  return `(${formatExpressionInline(operand, resolve)})`;
}
