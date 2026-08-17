/**
 * CC-05D: audit identity/hashing and staleness detection. Design
 * authority: docs/architecture/CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-
 * AND-SEMANTIC-QA.md §J.
 *
 * A cached semantic-audit result is reusable only while every identity
 * input (rendered-artefact hash, contract hash, both prompt versions,
 * response-schema version, reviewing provider identity) is unchanged.
 * Nothing here trusts a cache entry's own claim about what it was run
 * against -- staleness is always recomputed from the CURRENT inputs.
 */

import { createHash } from "node:crypto";
import type { SemanticVerification, VisualSemanticContract } from "@alp/content-schema";

export function sha256Hex(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
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

/** Deterministic regardless of the source object's own key order. */
export function canonicalJson(value: unknown): string {
  return JSON.stringify(sortKeysDeep(value));
}

export function computeContractHash(contract: VisualSemanticContract): string {
  return sha256Hex(canonicalJson(contract));
}

export function computeImageHash(svg: string): string {
  return sha256Hex(svg);
}

/** The single `promptVersion` field on SemanticVerification is a composite of both passes' versions -- see run-semantic-audit.ts. */
export function composePromptVersion(passAVersion: string, passBVersion: string): string {
  return `${passAVersion}+${passBVersion}`;
}

export interface CurrentAuditIdentity {
  readonly imageHash: string;
  readonly contractHash: string;
  readonly promptVersion: string;
  readonly schemaVersion: string;
  readonly reviewerIdentity: string;
}

/**
 * A cached verification is stale (must be discarded, artefact re-enters
 * the review queue) if ANY identity input differs from the current
 * inputs -- never treated as evidence for a changed image/contract.
 */
export function isStale(cached: SemanticVerification, current: CurrentAuditIdentity): boolean {
  return (
    cached.imageHash !== current.imageHash ||
    cached.contractHash !== current.contractHash ||
    cached.promptVersion !== current.promptVersion ||
    cached.schemaVersion !== current.schemaVersion ||
    cached.reviewerIdentity !== current.reviewerIdentity
  );
}
