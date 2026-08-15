/**
 * Minimal RFC-4122-shaped v4 (random) UUID generator, used only to assign
 * stable local identity/idempotency keys to foundation records (see
 * outbox.ts). Deliberately not the deterministic namespaced UUIDv5 scheme
 * used by the content pipeline (scripts/content/lib/deterministic-uuid.ts)
 * -- that scheme is for reproducible content-manifest identity; this one
 * is for locally-generated, genuinely random event identity, which is the
 * correct property for outbox idempotency keys.
 */
import "react-native-get-random-values";

export function randomId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));

  // Per RFC 4122 §4.4: set version (4) and variant (10) bits.
  bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x40;
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80;

  let hex = "";
  for (let i = 0; i < bytes.length; i += 1) {
    hex += (bytes[i] ?? 0).toString(16).padStart(2, "0");
  }
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}
