/**
 * CC-05B: generic, blueprint-agnostic educational parameter-generation
 * helpers built on top of ./seed.ts's deterministic Rng.
 *
 * These implement the constraint vocabulary CC-05A's ParameterGenerator
 * manifests reference informally as string tags ("positive",
 * "pedagogically_sensible", "avoid_pathological_rounding",
 * "respect_expected_physical_relationships") -- see design doc §22. None
 * of this is family-specific: every helper here is reusable by any
 * calculation family, not only the proving families this task implements
 * executors for.
 *
 * Every generator here throws ParameterGenerationError rather than
 * silently returning an out-of-range/invalid value when a constraint
 * cannot be satisfied (e.g. asking for more distinct values than the
 * range contains) -- generation must fail explicitly, never produce a
 * silently-invalid question (CC-05B task brief §6).
 */

import type { Rng } from "./seed.ts";
import { nextInt, pickDistinctIndices } from "./seed.ts";

export class ParameterGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParameterGenerationError";
  }
}

/**
 * A deterministic "clean" integer for introductory/intermediate
 * educational contexts: drawn from a restricted, human-friendly value
 * set (multiples of `step` within [min, max]) rather than an arbitrary
 * uniformly-random integer, so generated numbers read like a textbook
 * example (e.g. 6, 12, 24 ohms) rather than an ugly value (e.g. 17 ohms)
 * that produces "avoid_pathological_rounding"-violating results downstream.
 */
export function cleanInteger(rng: Rng, min: number, max: number, step = 1): number {
  if (step <= 0) throw new ParameterGenerationError(`cleanInteger: step must be positive, got ${step}`);
  if (max < min) throw new ParameterGenerationError(`cleanInteger: max (${max}) < min (${min})`);
  const stepsAvailable = Math.floor((max - min) / step);
  if (stepsAvailable < 0) {
    throw new ParameterGenerationError(`cleanInteger: no multiple of ${step} fits within [${min}, ${max}]`);
  }
  const chosenStep = nextInt(rng, 0, stepsAvailable);
  return min + chosenStep * step;
}

/** A clean integer guaranteed non-zero (retries by construction: excludes 0 from the candidate range). */
export function nonZeroCleanInteger(rng: Rng, min: number, max: number, step = 1): number {
  if (min <= 0 && max >= 0) {
    // Split the range around zero and choose a side, rather than reject-sampling
    // (reject-sampling would still be deterministic given a fixed rng, but would
    // consume a variable, less-obviously-bounded number of rng calls).
    const negativeSteps = min < 0 ? Math.floor((-step - min) / step) : -1;
    const positiveSteps = max > 0 ? Math.floor((max - step) / step) : -1;
    const canGoNegative = negativeSteps >= 0;
    const canGoPositive = positiveSteps >= 0;
    if (!canGoNegative && !canGoPositive) {
      throw new ParameterGenerationError(`nonZeroCleanInteger: no non-zero multiple of ${step} fits within [${min}, ${max}]`);
    }
    if (canGoNegative && (!canGoPositive || rng() < 0.5)) {
      return cleanInteger(rng, min, -step, step);
    }
    return cleanInteger(rng, step, max, step);
  }
  const value = cleanInteger(rng, min, max, step);
  if (value === 0) {
    throw new ParameterGenerationError(`nonZeroCleanInteger: range [${min}, ${max}] step ${step} produced 0`);
  }
  return value;
}

/**
 * `count` distinct clean integers drawn from [min, max] step `step`,
 * returned in the order chosen (not sorted) -- used wherever pedagogical
 * clarity requires visibly different values (e.g. distinct resistor
 * values so an "identify the dominant component" question has one
 * unambiguous correct answer).
 */
export function distinctCleanIntegers(rng: Rng, count: number, min: number, max: number, step = 1): number[] {
  const stepsAvailable = Math.floor((max - min) / step) + 1;
  if (count > stepsAvailable) {
    throw new ParameterGenerationError(
      `distinctCleanIntegers: cannot draw ${count} distinct multiples of ${step} from [${min}, ${max}] (only ${stepsAvailable} available)`,
    );
  }
  const indices = pickDistinctIndices(rng, stepsAvailable, count);
  // pickDistinctIndices sorts ascending; shuffle deterministically via a second rng draw
  // so which value ends up assigned to which "slot" (R1, R2, ...) still varies by seed.
  const values = indices.map((i) => min + i * step);
  for (let i = values.length - 1; i > 0; i--) {
    const j = nextInt(rng, 0, i);
    const tmp = values[i];
    const swap = values[j];
    if (tmp === undefined || swap === undefined) throw new ParameterGenerationError("distinctCleanIntegers: unreachable");
    values[i] = swap;
    values[j] = tmp;
  }
  return values;
}
