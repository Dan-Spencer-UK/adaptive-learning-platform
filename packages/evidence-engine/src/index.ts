/**
 * Framework-independent evidence/mastery engine (CC-07).
 *
 * Owns the deterministic transformation reserved for this package since
 * CC-01: raw learner attempts -> trustworthy evidence interpretation ->
 * derived capability/family/misconception state -> the
 * `LearnerEvidenceSnapshot` @alp/learning-engine's assembler consumes.
 *
 * Independent of React, Expo, Supabase, SQLite, the DOM and any runtime
 * AI -- pure batch derivation over plain serialisable data, equally
 * executable on-device (offline lesson assembly) and server-side
 * (canonical re-derivation from synchronized history).
 */

export const packageId = "evidence-engine" as const;

export type PackageId = typeof packageId;

export * from "./types.ts";
export * from "./derivation.ts";
export * from "./snapshot.ts";
