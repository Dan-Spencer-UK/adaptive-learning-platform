import { describe, expect, it } from "vitest";
import type { MarkingContract } from "@alp/content-schema";
import { markAnswer, UnsupportedMarkingTypeError } from "./marking.ts";

describe("markAnswer", () => {
  it("exact: numeric equality, not string equality", () => {
    const marking: MarkingContract = { type: "exact" };
    expect(markAnswer(marking, 4, 4).correct).toBe(true);
    expect(markAnswer(marking, 4, "4").correct).toBe(true); // coerced numerically, never compared as strings
    expect(markAnswer(marking, 4, 5).correct).toBe(false);
  });

  it("exact: string equality for non-numeric values", () => {
    const marking: MarkingContract = { type: "exact" };
    expect(markAnswer(marking, "V", "V").correct).toBe(true);
    expect(markAnswer(marking, "V", "I").correct).toBe(false);
  });

  it("numeric_tolerance: within tolerance percent is correct", () => {
    const marking: MarkingContract = { type: "numeric_tolerance", tolerancePercent: 5 };
    expect(markAnswer(marking, 100, 103).correct).toBe(true); // 3% off, within 5%
    expect(markAnswer(marking, 100, 96).correct).toBe(true); // 4% off, within 5%
    expect(markAnswer(marking, 100, 110).correct).toBe(false); // 10% off
  });

  it("numeric_tolerance: zero tolerance behaves as exact but with an epsilon floor for float noise", () => {
    const marking: MarkingContract = { type: "numeric_tolerance", tolerancePercent: 0 };
    expect(markAnswer(marking, 0.3, 0.1 + 0.2).correct).toBe(true);
    expect(markAnswer(marking, 4, 4.5).correct).toBe(false);
  });

  it("numeric_tolerance: default tolerancePercent (undefined) behaves as 0", () => {
    const marking: MarkingContract = { type: "numeric_tolerance" };
    expect(markAnswer(marking, 10, 10).correct).toBe(true);
    expect(markAnswer(marking, 10, 11).correct).toBe(false);
  });

  it("numeric_tolerance: rejects a non-numeric given value", () => {
    const marking: MarkingContract = { type: "numeric_tolerance", tolerancePercent: 1 };
    expect(() => markAnswer(marking, 10, "not-a-number")).toThrow(TypeError);
  });

  it("enum: exact string match", () => {
    const marking: MarkingContract = { type: "enum" };
    expect(markAnswer(marking, "plausible", "plausible").correct).toBe(true);
    expect(markAnswer(marking, "plausible", "implausible").correct).toBe(false);
  });

  it("direction_match: exact string match", () => {
    const marking: MarkingContract = { type: "direction_match" };
    expect(markAnswer(marking, "clockwise", "clockwise").correct).toBe(true);
    expect(markAnswer(marking, "clockwise", "counterclockwise").correct).toBe(false);
  });

  it("set_equality: order-independent set match", () => {
    const marking: MarkingContract = { type: "set_equality" };
    expect(markAnswer(marking, ["V:V", "I:A", "R:Ω"], ["R:Ω", "V:V", "I:A"]).correct).toBe(true);
    expect(markAnswer(marking, ["V:V", "I:A"], ["V:V"]).correct).toBe(false);
    expect(markAnswer(marking, ["V:V", "I:A"], ["V:V", "I:mA"]).correct).toBe(false);
  });

  it("throws UnsupportedMarkingTypeError for a marking type outside CC-05B's proving scope", () => {
    const marking: MarkingContract = { type: "equivalent_fraction" };
    expect(() => markAnswer(marking, "1/2", "2/4")).toThrow(UnsupportedMarkingTypeError);
  });
});
