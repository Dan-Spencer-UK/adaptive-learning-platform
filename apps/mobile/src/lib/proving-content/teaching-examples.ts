/**
 * CC-05C: fixed, illustrative known-value sets used only by lesson-screen
 * worked examples (never by generated/assessed questions, which always
 * come from @alp/calculation-engine's deterministic seeded generation).
 * Chosen to be pedagogically clean (small whole numbers, exact results)
 * and deliberately reused across all three Ohm's-law worked-example
 * views, per design doc §9: "The same generated values may be reused
 * across the three views... helping the learner see the relationship
 * from multiple directions." Fixed by construction, so trivially
 * deterministic -- no seed/PRNG involved.
 */

/** V = 24 V, I = 4 A, R = 6 Ω -- V = I × R holds exactly (24 = 4 × 6). */
export const OHMS_LAW_TEACHING_VALUES = { V: 24, I: 4, R: 6 } as const;

/** R1 = 10 Ω, R2 = 20 Ω, R3 = 30 Ω -- Rt = 60 Ω. */
export const SERIES_TEACHING_VALUES = { R1: 10, R2: 20, R3: 30 } as const;

/** R1 = 6 Ω, R2 = 12 Ω, R3 = 4 Ω -- Rt = 2 Ω exactly. */
export const PARALLEL_TEACHING_VALUES = { R1: 6, R2: 12, R3: 4 } as const;
