/**
 * CC-05B: deterministic seed derivation and pseudo-random number source.
 *
 * Determinism contract (docs/architecture/CC-05-PEDAGOGICAL-KNOWLEDGE-AND-
 * QUESTION-ARCHITECTURE.md §23): the same
 *   (blueprintId, blueprintVersion, contentRelease, seed)
 * tuple must always produce the same generated instance. The engine never
 * reads Math.random(), Date.now(), locale, network, database ordering or
 * process/environment state inside deterministic generation -- every
 * source of variation is this module's `createRng`, seeded from a value
 * derived purely from the four fields above.
 *
 * `deriveSeed` folds the full identity tuple into a single 32-bit integer
 * via FNV-1a (a small, well-known, non-cryptographic string hash) rather
 * than using the caller-supplied `seed` number directly. This matters:
 * two different blueprints given the same raw `seed` number must not
 * produce correlated pseudo-random sequences -- folding the full tuple in
 * guarantees each (blueprint, version, release, seed) combination gets an
 * independently-seeded stream, while remaining exactly reproducible.
 *
 * `createRng` implements mulberry32 (public-domain, Tommy Ettinger) -- a
 * 32-bit state, single-multiply-and-xorshift generator. It is deliberately
 * tiny: pure Number/bitwise arithmetic (Math.imul, >>>, |, ^), no BigInt,
 * no external dependency, no platform API -- so it behaves identically
 * under Node/Vitest, Hermes and any other JS engine, which is the whole
 * point of a Hermes-portable deterministic engine (see the mobile-runtime
 * boundary rules in this package's README section of the CC-05B evidence
 * doc). It is not cryptographically secure and must never be used for
 * anything security-sensitive -- it exists only to produce reproducible,
 * well-distributed *content* variation.
 */

export interface DeterministicIdentity {
  readonly blueprintId: string;
  readonly blueprintVersion: number;
  readonly contentRelease: string;
  readonly seed: number;
}

/** FNV-1a 32-bit hash. Deterministic, pure, allocation-free. */
export function fnv1a32(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** Folds a full deterministic identity tuple into a single 32-bit RNG seed. */
export function deriveSeed(identity: DeterministicIdentity): number {
  const key = `${identity.blueprintId}|${identity.blueprintVersion}|${identity.contentRelease}|${identity.seed}`;
  return fnv1a32(key);
}

export type Rng = () => number;

/**
 * mulberry32: given a 32-bit integer seed, returns a function that yields
 * successive pseudo-random floats in [0, 1). Same seed -> same sequence,
 * always, on every JS engine (integer-only bitwise arithmetic).
 */
export function createRng(seed: number): Rng {
  let a = seed >>> 0;
  return function next(): number {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Creates a ready-to-use Rng directly from a deterministic identity tuple. */
export function createRngFromIdentity(identity: DeterministicIdentity): Rng {
  return createRng(deriveSeed(identity));
}

/** Integer in [min, max], inclusive on both ends. */
export function nextInt(rng: Rng, min: number, max: number): number {
  if (max < min) throw new RangeError(`nextInt: max (${max}) < min (${min})`);
  return min + Math.floor(rng() * (max - min + 1));
}

/** Picks one element deterministically from a non-empty readonly array. */
export function pick<T>(rng: Rng, options: readonly T[]): T {
  if (options.length === 0) throw new RangeError("pick: options must be non-empty");
  const value = options[nextInt(rng, 0, options.length - 1)];
  if (value === undefined) throw new RangeError("pick: unreachable index");
  return value;
}

/**
 * Picks `count` distinct indices from [0, size) in ascending order,
 * deterministically. Used to choose e.g. "which component is the unknown
 * one" without ever picking the same index twice.
 */
export function pickDistinctIndices(rng: Rng, size: number, count: number): number[] {
  if (count > size) {
    throw new RangeError(`pickDistinctIndices: cannot pick ${count} distinct indices from a set of size ${size}`);
  }
  const pool = Array.from({ length: size }, (_, i) => i);
  const chosen: number[] = [];
  for (let i = 0; i < count; i++) {
    const index = nextInt(rng, 0, pool.length - 1);
    const removed = pool.splice(index, 1)[0];
    if (removed === undefined) throw new RangeError("pickDistinctIndices: unreachable");
    chosen.push(removed);
  }
  return chosen.sort((a, b) => a - b);
}
