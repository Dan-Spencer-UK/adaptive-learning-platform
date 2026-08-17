/**
 * Deterministic identity/digest utilities. Mirrors the existing
 * `deriveSeed`/`fnv1a32` precedent in
 * packages/calculation-engine/src/seed.ts (pure bitwise arithmetic, no
 * `crypto`, no external dependency -- Hermes-portable, since assembly
 * must be able to run on-device per task brief §18) rather than the
 * Node-`crypto`-based `sha256Hex` pattern in
 * scripts/visual-governance/audit-cache.ts, which is tooling-only.
 */

import { fnv1a32 } from "@alp/calculation-engine";
import type { LearnerEvidenceSnapshot } from "./types.ts";

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value as Record<string, unknown>)
        .sort()
        .map((key) => [key, sortKeysDeep((value as Record<string, unknown>)[key])]),
    );
  }
  return value;
}

/** Deterministic regardless of source object/array key or Map/Set insertion order. */
export function canonicalJson(value: unknown): string {
  return JSON.stringify(sortKeysDeep(value));
}

function toSortedEntries<K extends string, V>(map: ReadonlyMap<K, V>): Array<[K, V]> {
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
}

function toSortedArray(set: ReadonlySet<string>): string[] {
  return [...set].sort((a, b) => a.localeCompare(b));
}

/**
 * A stable digest of exactly the evidence fields the assembler
 * consumes -- never the learner's raw evidence values verbatim beyond
 * what identity requires. Two snapshots that differ only in learnerId
 * order-of-construction or Map/Set insertion order still digest
 * identically; a snapshot with materially different capability status,
 * misconceptions, or retrieval-due state digests differently.
 */
export function computeEvidenceDigest(snapshot: LearnerEvidenceSnapshot): string {
  const canonical = {
    capabilityStatus: toSortedEntries(snapshot.capabilityStatus),
    misconceptionsEvidenced: toSortedArray(snapshot.misconceptionsEvidenced),
    retrievalDue: toSortedArray(snapshot.retrievalDue),
  };
  return fnv1a32(canonicalJson(canonical)).toString(16).padStart(8, "0");
}

export interface InstanceIdentityInput {
  readonly lessonId: string;
  readonly lessonVersion: number;
  readonly contentRelease: string;
  readonly assemblyPolicyVersion: number;
  readonly learnerId: string;
  readonly evidenceDigest: string;
}

/**
 * The Lesson Instance's own deterministic identity. Same inputs always
 * produce the same id; a change to any one of lesson version, content
 * release, policy version, learner, or evidence digest changes it
 * (task brief §15's required test matrix).
 */
export function computeInstanceIdentity(input: InstanceIdentityInput): string {
  return fnv1a32(canonicalJson(input)).toString(16).padStart(8, "0");
}
