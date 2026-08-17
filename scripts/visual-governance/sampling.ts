/**
 * CC-05D: deterministic random sampling of high-confidence PASS results
 * for human spot-checking. Design authority: docs/architecture/CC-05D-
 * INSTRUCTIONAL-VISUAL-GOVERNANCE-AND-SEMANTIC-QA.md §I.
 *
 * Reuses @alp/calculation-engine's own mulberry32/FNV-1a generator
 * family (packages/calculation-engine/src/seed.ts, already public API)
 * rather than inventing a second PRNG -- the same "seed a small,
 * portable, pure generator from a hashed identity tuple" pattern CC-05B
 * already established for deterministic question generation.
 */

import { createRng, fnv1a32, pickDistinctIndices } from "@alp/calculation-engine";

/**
 * Conservative fixed count appropriate to the current small pilot corpus
 * (18 canonical variants total). No product/governance authority has
 * specified a sampling percentage -- this constant exists so that value
 * is trivially visible and overridable, not silently hard-coded as if it
 * were an authorised policy.
 */
export const DEFAULT_SAMPLE_SIZE = 5;

export interface SamplePolicy {
  readonly contentRelease: string;
  readonly sampleSeed: number;
  readonly sampleSize?: number;
}

export interface SampleResult<T extends { variantId: string }> {
  readonly selected: T[];
  readonly policy: { contentRelease: string; sampleSeed: number; sampleSize: number };
}

/**
 * Deterministic, repeatable for a given (contentRelease, sampleSeed):
 * the same pool + policy always yields the same selection. Not biased
 * toward the first N items in file order -- selection uses
 * pickDistinctIndices' shuffle-style draw over the whole pool, not a
 * sequential slice.
 */
export function selectHumanReviewSample<T extends { variantId: string }>(pool: readonly T[], policy: SamplePolicy): SampleResult<T> {
  const sampleSize = policy.sampleSize ?? DEFAULT_SAMPLE_SIZE;
  const effectiveSize = Math.min(sampleSize, pool.length);
  const seedKey = `${policy.contentRelease}::${policy.sampleSeed}`;
  const rng = createRng(fnv1a32(seedKey));
  const indices = pickDistinctIndices(rng, pool.length, effectiveSize);
  const selected = indices.map((i) => pool[i]!);
  return { selected, policy: { contentRelease: policy.contentRelease, sampleSeed: policy.sampleSeed, sampleSize: effectiveSize } };
}
