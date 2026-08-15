/**
 * Deterministic UUIDv5 (RFC 4122 SS4.3) generation from a stable name
 * string, using a fixed namespace UUID for this repository's generated
 * content. Every CC-04 database primary key is derived this way instead
 * of being hand-assigned or randomly generated, so:
 *
 * - the same manifest always produces the same row identities
 *   (`supabase db reset` reconstructs byte-identical content);
 * - re-running the generator/import never produces a duplicate row for
 *   the same logical entity (`ON CONFLICT (id) DO NOTHING` is safe);
 * - the stable business identifier (e.g. an assertion's `identifier`)
 *   remains the thing a human edits -- the UUID is a mechanical
 *   derivation of it, not a second thing to keep in sync by hand.
 *
 * This does not depend on the `uuid` npm package; UUIDv5 is ~15 lines of
 * hashing over Node's built-in `crypto` module.
 */

import { createHash } from "node:crypto";

// Fixed, arbitrary namespace UUID for adaptive-learning-platform generated
// content. Changing this constant would change every derived id, so it
// must never be edited casually.
const CONTENT_NAMESPACE_UUID = "5b6e6a9a-2f3b-4e3a-9c8a-9b7b9a6b6a10";

function namespaceBytes(uuid: string): Buffer {
  return Buffer.from(uuid.replace(/-/g, ""), "hex");
}

/**
 * Derives a deterministic UUIDv5 string from a stable name. Names should
 * be prefixed with the target entity kind (e.g. "domain:FM",
 * "assertion:EL-OHM-RELATIONSHIP-001") so that different entity kinds
 * sharing a coincidentally identical natural key never collide.
 */
export function deterministicUuid(name: string): string {
  const hash = createHash("sha1")
    .update(namespaceBytes(CONTENT_NAMESPACE_UUID))
    .update(Buffer.from(name, "utf8"))
    .digest();

  const bytes = hash.subarray(0, 16);
  const withVersion = Buffer.from(bytes);
  withVersion[6] = (withVersion[6]! & 0x0f) | 0x50; // version 5
  withVersion[8] = (withVersion[8]! & 0x3f) | 0x80; // RFC 4122 variant

  const hex = withVersion.toString("hex");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}
