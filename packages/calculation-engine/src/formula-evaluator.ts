/**
 * CC-05B: generic evaluator for CC-05A's structured `FormulaExpression`
 * tree (packages/content-schema/src/pedagogy.ts). This is the single
 * place calculation semantics are executed -- family executors (Ohm's
 * law, series/parallel resistance, ...) never compute results with ad hoc
 * arithmetic; they always call `evaluateFormulaExpression`, so proving
 * this evaluator correct proves every family's calculation is correct.
 *
 * Formula display and formula calculation are deliberately separate
 * consumers of the same structured semantics (design doc §8/§35): this
 * module only ever produces a number from an expression tree plus
 * variable bindings. Nothing here renders, formats, or parses a display
 * string -- rendering is a CC-05C concern this package does not touch.
 */

import type { FormulaExpression, FormulaForm, FormulaOperand } from "@alp/content-schema";

export class FormulaEvaluationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FormulaEvaluationError";
  }
}

export type VariableBindings = Readonly<Record<string, number>>;

/**
 * Numeric precision policy (documented, per design doc §15/CC-05B §15):
 * every intermediate/final formula result is rounded to this many decimal
 * places before being returned. This avoids float noise (e.g.
 * 0.1 + 0.2 !== 0.3) propagating into marking/tolerance comparisons
 * without hiding genuine precision the proving-slice families need
 * (6 d.p. comfortably exceeds any tolerance percentage used by the
 * proving blueprints).
 */
export const CALCULATION_PRECISION_DECIMALS = 6;

export function roundToPrecision(value: number, decimals: number = CALCULATION_PRECISION_DECIMALS): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function resolveOperand(operand: FormulaOperand, bindings: VariableBindings, allowMissing: boolean): number | undefined {
  if (typeof operand === "number") return operand;
  if (typeof operand === "string") {
    const value = bindings[operand];
    if (value === undefined) {
      if (allowMissing) return undefined;
      throw new FormulaEvaluationError(`missing binding for variable "${operand}"`);
    }
    return value;
  }
  return evaluateRaw(operand, bindings);
}

function requireOperand(operand: FormulaOperand | undefined, label: string, bindings: VariableBindings): number {
  if (operand === undefined) {
    throw new FormulaEvaluationError(`expression is missing required operand "${label}"`);
  }
  const value = resolveOperand(operand, bindings, false);
  if (value === undefined) {
    throw new FormulaEvaluationError(`expression is missing required operand "${label}"`);
  }
  return value;
}

/**
 * Evaluates a single FormulaExpression node against a set of variable
 * bindings, returning a plain, UNROUNDED number. Nested sub-expressions
 * (e.g. the "square" inside P = I^2 x R, or the "sqrt" inside
 * rms = peak / sqrt(2)) recurse through this raw form, never through the
 * rounding public entry point -- rounding at every recursion level would
 * compound across nested operations and lose precision the final
 * roundToPrecision() call is supposed to be the *only* deliberate loss of
 * (see evaluateFormulaExpression below).
 *
 * "add" and "reciprocal_of_sum_of_reciprocals" are the two genuinely
 * variadic aggregation operators in the formula-operation vocabulary
 * (CC-05A models series/parallel resistance formulas with a fixed
 * variable list R1..R4, of which only as many as the instance's actual
 * component/branch count are ever bound -- see
 * scripts/content/data/cc05a-pedagogy-unit202.ts, formula.series_resistance
 * / formula.parallel_resistance). For exactly these two operations,
 * operands with no binding are skipped rather than treated as an error --
 * this is what lets the SAME formula family structure serve a 2-, 3- or
 * 4-component instance without CC-05A needing a separate formula form per
 * component count. Every other operation requires all of its operands to
 * resolve, and throws FormulaEvaluationError otherwise (never silently
 * substitutes a default).
 */
function evaluateRaw(expr: FormulaExpression, bindings: VariableBindings): number {
  switch (expr.operation) {
    case "multiply": {
      if (!expr.operands || expr.operands.length === 0) {
        throw new FormulaEvaluationError('"multiply" requires a non-empty operands array');
      }
      let product = 1;
      for (const operand of expr.operands) {
        product *= requireOperand(operand, "operands[]", bindings);
      }
      return product;
    }

    case "divide": {
      const numerator = requireOperand(expr.numerator, "numerator", bindings);
      const denominator = requireOperand(expr.denominator, "denominator", bindings);
      if (denominator === 0) {
        throw new FormulaEvaluationError('"divide" by zero (denominator resolved to 0)');
      }
      return numerator / denominator;
    }

    case "add": {
      if (!expr.operands || expr.operands.length === 0) {
        throw new FormulaEvaluationError('"add" requires a non-empty operands array');
      }
      let sum = 0;
      let boundCount = 0;
      for (const operand of expr.operands) {
        const value = resolveOperand(operand, bindings, true);
        if (value !== undefined) {
          sum += value;
          boundCount++;
        }
      }
      if (boundCount === 0) {
        throw new FormulaEvaluationError('"add" had no bound operands (need at least one)');
      }
      return sum;
    }

    case "subtract": {
      if (!expr.operands || expr.operands.length < 2) {
        throw new FormulaEvaluationError('"subtract" requires at least two operands (minuend, subtrahend...)');
      }
      const [minuend, ...subtrahends] = expr.operands;
      let result = requireOperand(minuend, "operands[0]", bindings);
      for (const subtrahend of subtrahends) {
        result -= requireOperand(subtrahend, "operands[]", bindings);
      }
      return result;
    }

    case "square": {
      const value = requireOperand(expr.operand, "operand", bindings);
      return value * value;
    }

    case "sqrt": {
      const value = requireOperand(expr.operand, "operand", bindings);
      if (value < 0) throw new FormulaEvaluationError('"sqrt" of a negative number is not supported');
      return Math.sqrt(value);
    }

    case "power": {
      const base = requireOperand(expr.operand, "operand", bindings);
      if (expr.exponent === undefined) {
        throw new FormulaEvaluationError('"power" requires an exponent');
      }
      return base ** expr.exponent;
    }

    case "reciprocal": {
      const value = requireOperand(expr.operand, "operand", bindings);
      if (value === 0) throw new FormulaEvaluationError('"reciprocal" of 0 is undefined');
      return 1 / value;
    }

    case "reciprocal_of_sum_of_reciprocals": {
      if (!expr.operands || expr.operands.length === 0) {
        throw new FormulaEvaluationError('"reciprocal_of_sum_of_reciprocals" requires a non-empty operands array');
      }
      let sumOfReciprocals = 0;
      let boundCount = 0;
      for (const operand of expr.operands) {
        const value = resolveOperand(operand, bindings, true);
        if (value !== undefined) {
          if (value === 0) {
            throw new FormulaEvaluationError('"reciprocal_of_sum_of_reciprocals" operand resolved to 0 (undefined reciprocal)');
          }
          sumOfReciprocals += 1 / value;
          boundCount++;
        }
      }
      if (boundCount === 0) {
        throw new FormulaEvaluationError('"reciprocal_of_sum_of_reciprocals" had no bound operands (need at least one)');
      }
      if (sumOfReciprocals === 0) {
        throw new FormulaEvaluationError('"reciprocal_of_sum_of_reciprocals" sum of reciprocals is 0 (undefined result)');
      }
      return 1 / sumOfReciprocals;
    }

    case "ratio_percentage": {
      const numerator = requireOperand(expr.numerator, "numerator", bindings);
      const denominator = requireOperand(expr.denominator, "denominator", bindings);
      if (denominator === 0) {
        throw new FormulaEvaluationError('"ratio_percentage" by zero (denominator resolved to 0)');
      }
      return (numerator / denominator) * 100;
    }

    default: {
      const exhaustiveCheck: never = expr.operation;
      throw new FormulaEvaluationError(`unsupported formula operation: ${String(exhaustiveCheck)}`);
    }
  }
}

/**
 * Public entry point: evaluates a FormulaExpression tree and rounds the
 * FINAL result once, per CALCULATION_PRECISION_DECIMALS. Intermediate/
 * nested sub-expression results are never independently rounded (see
 * evaluateRaw's documentation) -- only this one, outermost rounding
 * happens, so precision loss never compounds across a nested expression
 * like P = I^2 x R or rms = peak / sqrt(2).
 */
export function evaluateFormulaExpression(expr: FormulaExpression, bindings: VariableBindings): number {
  return roundToPrecision(evaluateRaw(expr, bindings));
}

/** Recursively collects every leaf variable symbol an expression references (numeric literals excluded). */
export function collectFormulaVariableSymbols(operand: FormulaOperand, out: Set<string> = new Set()): Set<string> {
  if (typeof operand === "number") return out;
  if (typeof operand === "string") {
    out.add(operand);
    return out;
  }
  operand.operands?.forEach((o) => collectFormulaVariableSymbols(o, out));
  if (operand.operand !== undefined) collectFormulaVariableSymbols(operand.operand, out);
  if (operand.numerator !== undefined) collectFormulaVariableSymbols(operand.numerator, out);
  if (operand.denominator !== undefined) collectFormulaVariableSymbols(operand.denominator, out);
  return out;
}

/**
 * A formula family may declare more than one form for the same target
 * (e.g. formula.electrical_power has both P = V x I and P = I^2 x R,
 * both targeting "P"). Selects the form whose required variable symbols
 * are exactly the supplied `knownSymbols`, rather than guessing from
 * array order -- throws explicitly if no form matches or more than one
 * does (an authoring ambiguity, never silently resolved).
 */
export function selectFormForKnownVariables(
  forms: readonly FormulaForm[],
  target: string,
  knownSymbols: readonly string[],
): FormulaForm {
  const knownSet = new Set(knownSymbols);
  const candidates = forms.filter((form) => {
    if (form.target !== target) return false;
    const required = collectFormulaVariableSymbols(form.expression);
    return required.size === knownSet.size && [...required].every((symbol) => knownSet.has(symbol));
  });
  if (candidates.length === 0) {
    throw new FormulaEvaluationError(
      `no form targeting "${target}" uses exactly the known variables {${knownSymbols.join(", ")}}`,
    );
  }
  if (candidates.length > 1) {
    throw new FormulaEvaluationError(
      `ambiguous: ${candidates.length} forms targeting "${target}" use exactly the known variables {${knownSymbols.join(", ")}}`,
    );
  }
  return candidates[0]!;
}
