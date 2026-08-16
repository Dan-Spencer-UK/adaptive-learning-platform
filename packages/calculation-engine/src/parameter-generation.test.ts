import { describe, expect, it } from "vitest";
import { createRng } from "./seed.ts";
import { cleanInteger, distinctCleanIntegers, nonZeroCleanInteger, ParameterGenerationError } from "./parameter-generation.ts";

describe("cleanInteger", () => {
  it("always returns min + a multiple of step, within [min, max]", () => {
    const rng = createRng(1);
    for (let i = 0; i < 200; i++) {
      const value = cleanInteger(rng, 1, 50, 5);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(50);
      expect((value - 1) % 5).toBe(0); // min=1, step=5 -> 1, 6, 11, ..., 46
    }
  });

  it("respects step exactly when min is a multiple of step", () => {
    const rng = createRng(2);
    for (let i = 0; i < 100; i++) {
      const value = cleanInteger(rng, 0, 100, 10);
      expect(value % 10).toBe(0);
    }
  });

  it("falls back to min itself when no other multiple of step fits the range (min is always a valid clean value)", () => {
    const rng = createRng(3);
    expect(cleanInteger(rng, 1, 3, 10)).toBe(1);
  });

  it("throws explicitly when max < min", () => {
    const rng = createRng(3);
    expect(() => cleanInteger(rng, 10, 1)).toThrow(ParameterGenerationError);
  });
});

describe("nonZeroCleanInteger", () => {
  it("never returns 0 across a range spanning zero", () => {
    const rng = createRng(4);
    for (let i = 0; i < 300; i++) {
      expect(nonZeroCleanInteger(rng, -5, 5, 1)).not.toBe(0);
    }
  });

  it("throws when the only value in range is 0", () => {
    const rng = createRng(4);
    expect(() => nonZeroCleanInteger(rng, 0, 0, 1)).toThrow(ParameterGenerationError);
  });
});

describe("distinctCleanIntegers", () => {
  it("returns the requested count of genuinely distinct values", () => {
    const rng = createRng(5);
    const values = distinctCleanIntegers(rng, 4, 1, 100);
    expect(values).toHaveLength(4);
    expect(new Set(values).size).toBe(4);
    for (const v of values) {
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(100);
    }
  });

  it("throws explicitly rather than silently returning duplicates when the range is too small", () => {
    const rng = createRng(6);
    expect(() => distinctCleanIntegers(rng, 5, 1, 3)).toThrow(ParameterGenerationError);
  });

  it("is deterministic for a fixed seed", () => {
    const a = distinctCleanIntegers(createRng(77), 3, 1, 50);
    const b = distinctCleanIntegers(createRng(77), 3, 1, 50);
    expect(a).toEqual(b);
  });
});
