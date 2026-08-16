/**
 * CC-05B: generic answer marking against CC-05A's `MarkingContract`
 * (packages/content-schema/src/pedagogy.ts).
 *
 * Implements exactly the marking-contract subset the proving-slice
 * families (Ohm's law, series/parallel resistance, magnetism/
 * electromagnetism) actually use: "exact", "numeric_tolerance", "enum",
 * "set_equality", "direction_match". CC-05A's MarkingContract type
 * permits a wider vocabulary ("equivalent_fraction", "unit_aware_numeric",
 * "ordered_sequence", "structured_expression") that no proving blueprint
 * currently requires -- markAnswer throws an explicit
 * UnsupportedMarkingTypeError for those rather than silently returning a
 * result, so an unimplemented marking type can never be mistaken for a
 * correct evaluation (CC-05B task brief §22: "Do not pretend every future
 * blueprint type is implemented").
 *
 * Numeric marking never uses string equality (task brief §15): both
 * "exact" and "numeric_tolerance" coerce to Number and compare
 * numerically, rounded to the same CALCULATION_PRECISION_DECIMALS policy
 * the formula evaluator uses, with a small absolute epsilon floor so
 * legitimate floating-point noise at/near zero never fails a truly
 * correct answer.
 */

import type { MarkingContract } from "@alp/content-schema";
import { CALCULATION_PRECISION_DECIMALS, roundToPrecision } from "./formula-evaluator.ts";
import type { AnswerValue } from "./types.ts";

export class UnsupportedMarkingTypeError extends Error {
  constructor(markingType: string) {
    super(`marking type "${markingType}" is not implemented by CC-05B's proving-slice scope`);
    this.name = "UnsupportedMarkingTypeError";
  }
}

export type { AnswerValue };

export interface MarkingOutcome {
  readonly correct: boolean;
  readonly detail: string;
}

/** Absolute floor below which two numbers are always treated as equal, regardless of tolerance percent. */
const ABSOLUTE_EPSILON = 10 ** -CALCULATION_PRECISION_DECIMALS;

function toFiniteNumber(value: AnswerValue, label: string): number {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) {
    throw new TypeError(`${label} could not be interpreted as a finite number: ${JSON.stringify(value)}`);
  }
  return num;
}

function toStringValue(value: AnswerValue, label: string): string {
  if (typeof value !== "string") {
    throw new TypeError(`${label} must be a string for this marking type, got ${JSON.stringify(value)}`);
  }
  return value;
}

function toStringArray(value: AnswerValue, label: string): readonly string[] {
  if (!Array.isArray(value)) {
    throw new TypeError(`${label} must be a string array for this marking type, got ${JSON.stringify(value)}`);
  }
  return value;
}

export function markAnswer(marking: MarkingContract, expected: AnswerValue, given: AnswerValue): MarkingOutcome {
  switch (marking.type) {
    case "exact": {
      if (typeof expected === "number" || typeof given === "number") {
        const expectedNum = toFiniteNumber(expected, "expected");
        const givenNum = toFiniteNumber(given, "given");
        const correct = roundToPrecision(expectedNum) === roundToPrecision(givenNum);
        return { correct, detail: correct ? "exact numeric match" : `expected ${expectedNum}, got ${givenNum}` };
      }
      const expectedStr = toStringValue(expected, "expected");
      const givenStr = toStringValue(given, "given");
      const correct = expectedStr === givenStr;
      return { correct, detail: correct ? "exact match" : `expected "${expectedStr}", got "${givenStr}"` };
    }

    case "numeric_tolerance": {
      const expectedNum = toFiniteNumber(expected, "expected");
      const givenNum = toFiniteNumber(given, "given");
      const tolerancePercent = marking.tolerancePercent ?? 0;
      const allowedDelta = Math.max(Math.abs(expectedNum) * (tolerancePercent / 100), ABSOLUTE_EPSILON);
      const delta = Math.abs(roundToPrecision(givenNum) - roundToPrecision(expectedNum));
      const correct = delta <= allowedDelta;
      return {
        correct,
        detail: correct
          ? `within tolerance (delta ${delta}, allowed ${allowedDelta})`
          : `outside tolerance: expected ${expectedNum} +/-${tolerancePercent}%, got ${givenNum} (delta ${delta}, allowed ${allowedDelta})`,
      };
    }

    case "enum": {
      const expectedStr = toStringValue(expected, "expected");
      const givenStr = toStringValue(given, "given");
      const correct = expectedStr === givenStr;
      return { correct, detail: correct ? "enum match" : `expected "${expectedStr}", got "${givenStr}"` };
    }

    case "direction_match": {
      const expectedStr = toStringValue(expected, "expected");
      const givenStr = toStringValue(given, "given");
      const correct = expectedStr === givenStr;
      return { correct, detail: correct ? "direction match" : `expected direction "${expectedStr}", got "${givenStr}"` };
    }

    case "set_equality": {
      const expectedSet = new Set(toStringArray(expected, "expected"));
      const givenSet = new Set(toStringArray(given, "given"));
      const correct =
        expectedSet.size === givenSet.size && [...expectedSet].every((value) => givenSet.has(value));
      return {
        correct,
        detail: correct ? "set match" : `expected {${[...expectedSet].join(", ")}}, got {${[...givenSet].join(", ")}}`,
      };
    }

    default:
      throw new UnsupportedMarkingTypeError(marking.type);
  }
}
