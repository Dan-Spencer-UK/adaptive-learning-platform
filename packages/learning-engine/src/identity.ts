/**
 * Deterministic identity/digest utilities.
 *
 * Corrected (Package B "bounded architecture correction" brief §10-§13)
 * from an earlier revision that used 32-bit FNV-1a: `LessonInstance`
 * identity is intended to be a DURABLE identifier -- used for session
 * restoration, offline persistence, evidence association, and audit,
 * potentially across millions of learner lesson instances -- and a
 * 32-bit space is far too small a collision-resistance budget for that
 * role, even though FNV-1a remains perfectly appropriate where it is
 * still used purely for deterministic PRNG seeding
 * (packages/calculation-engine/src/seed.ts).
 *
 * Uses `@noble/hashes`'s SHA-256 implementation instead: audited,
 * zero-dependency, pure JS/TS (no native bindings, no Node `crypto`),
 * synchronous, and already proven portable across browser/Node/React
 * Native-Hermes -- so the assembler stays synchronous and
 * framework-independent (deliberately NOT `expo-crypto`, which is
 * async and would tie this framework-independent package to Expo).
 */

import { sha256 } from "@noble/hashes/sha2";
import { bytesToHex, utf8ToBytes } from "@noble/hashes/utils";
import type { LearnerEvidenceSnapshot } from "./types.ts";

/** Version/format prefix on `instanceId` so a future identity-format migration is distinguishable rather than ambiguous with the current one. */
const INSTANCE_IDENTITY_FORMAT = "li1";

function sha256Hex(input: string): string {
  return bytesToHex(sha256(utf8ToBytes(input)));
}

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
 *
 * Full SHA-256 (64 hex chars / 256 bits), not merely an internal
 * checksum: this digest is itself an input to `computeInstanceIdentity`,
 * so if it were weak it would silently bottleneck the durable
 * instanceId's own collision resistance no matter how strong the outer
 * hash is.
 */
export function computeEvidenceDigest(snapshot: LearnerEvidenceSnapshot): string {
  const canonical = {
    capabilityStatus: toSortedEntries(snapshot.capabilityStatus),
    misconceptionsEvidenced: toSortedArray(snapshot.misconceptionsEvidenced),
    retrievalDue: toSortedArray(snapshot.retrievalDue),
  };
  return sha256Hex(canonicalJson(canonical));
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
 * The Lesson Instance's own durable deterministic identity. Same inputs
 * always produce the same id; a change to any one of lesson version,
 * content release, policy version, learner, or evidence digest changes
 * it (task brief §15's required test matrix). Formatted as
 * `li1_<64-hex-char SHA-256>` -- the `li1` prefix identifies both "this
 * is a Lesson Instance id" and the identity-format version, so a future
 * algorithm change is a new prefix, never a silent reinterpretation of
 * old ids.
 */
export function computeInstanceIdentity(input: InstanceIdentityInput): string {
  return `${INSTANCE_IDENTITY_FORMAT}_${sha256Hex(canonicalJson(input))}`;
}
