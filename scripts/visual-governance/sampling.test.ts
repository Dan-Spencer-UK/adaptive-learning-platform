import { describe, expect, it } from "vitest";
import { DEFAULT_SAMPLE_SIZE, selectHumanReviewSample } from "./sampling.ts";

function pool(n: number) {
  return Array.from({ length: n }, (_, i) => ({ variantId: `variant-${i}` }));
}

describe("selectHumanReviewSample", () => {
  it("selects the configured sample size when the pool is large enough", () => {
    const result = selectHumanReviewSample(pool(20), { contentRelease: "release-1", sampleSeed: 1, sampleSize: 5 });
    expect(result.selected).toHaveLength(5);
    expect(result.policy.sampleSize).toBe(5);
  });

  it("selects distinct items -- never the same variant twice", () => {
    const result = selectHumanReviewSample(pool(20), { contentRelease: "release-1", sampleSeed: 1, sampleSize: 8 });
    const ids = result.selected.map((r) => r.variantId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("clamps the sample size to the pool size when the pool is smaller than requested", () => {
    const result = selectHumanReviewSample(pool(3), { contentRelease: "release-1", sampleSeed: 1, sampleSize: 5 });
    expect(result.selected).toHaveLength(3);
  });

  it("defaults to DEFAULT_SAMPLE_SIZE when sampleSize is not given", () => {
    const result = selectHumanReviewSample(pool(20), { contentRelease: "release-1", sampleSeed: 1 });
    expect(result.selected).toHaveLength(DEFAULT_SAMPLE_SIZE);
  });

  it("is deterministic and repeatable for the same (contentRelease, sampleSeed)", () => {
    const a = selectHumanReviewSample(pool(20), { contentRelease: "release-1", sampleSeed: 42 });
    const b = selectHumanReviewSample(pool(20), { contentRelease: "release-1", sampleSeed: 42 });
    expect(a.selected.map((r) => r.variantId)).toEqual(b.selected.map((r) => r.variantId));
  });

  it("produces a different selection for a different seed (not always the same items)", () => {
    const a = selectHumanReviewSample(pool(20), { contentRelease: "release-1", sampleSeed: 1 });
    const b = selectHumanReviewSample(pool(20), { contentRelease: "release-1", sampleSeed: 2 });
    expect(a.selected.map((r) => r.variantId)).not.toEqual(b.selected.map((r) => r.variantId));
  });

  it("is not biased toward the first N items in file order across many seeds", () => {
    const firstFiveIds = pool(20)
      .slice(0, 5)
      .map((p) => p.variantId);
    let matchesFirstFiveExactly = 0;
    for (let seed = 0; seed < 30; seed++) {
      const result = selectHumanReviewSample(pool(20), { contentRelease: "release-1", sampleSeed: seed });
      const ids = result.selected.map((r) => r.variantId).sort();
      if (JSON.stringify(ids) === JSON.stringify([...firstFiveIds].sort())) matchesFirstFiveExactly++;
    }
    // A real shuffle should essentially never reproduce exactly the first-5-in-order set across 30 different seeds.
    expect(matchesFirstFiveExactly).toBeLessThan(3);
  });

  it("records the exact policy that produced the selection, for audit reproducibility", () => {
    const result = selectHumanReviewSample(pool(20), { contentRelease: "release-2026-08", sampleSeed: 7, sampleSize: 4 });
    expect(result.policy).toEqual({ contentRelease: "release-2026-08", sampleSeed: 7, sampleSize: 4 });
  });
});
