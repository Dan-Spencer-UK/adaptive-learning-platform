/**
 * CC-19A section 24: blindness / contamination validator.
 *
 * Rejects the ledger/inventory if any sourceRef, path, evidenceRef, or
 * recorded source role refers to a forbidden private/derived/legacy
 * artefact. This validator protects PROVENANCE REFERENCES (paths, source
 * ids, source titles) -- never scans normal curriculum wording/subject
 * text for coincidental word overlap.
 */

import type { CC19AProposal, CC19ASourceInventoryEntry } from "./cc19a-types.ts";

/** Deliberately explicit, never a broad word like "unit202" or "202" that would false-positive on ordinary curriculum wording. */
export const BANNED_PROVENANCE_PATTERNS: readonly RegExp[] = [
  /OPTIONAL_CALIBRATION/,
  /LEGACY_DIAGNOSTIC/,
  /smartscreen/i,
  /\bhandout\b/i,
  /\bworksheet\b/i,
  /tutor[\s-]?answer/i,
  /scheme of work/i,
  /\bCC-16\b/,
  /\bCC-17[AB]?\b/,
  /depth-performance-matrix/i,
  /depth[\s-]?&?[\s-]?performance[\s-]?matrix/i,
  /blind-calibration/i,
  /blind[\s-]calibration/i,
  /knowledge[\s-]obligations?/i,
  /unit202-source-acquisition-manifest/i,
  /unit202-technical-source-verification/i,
  /unit202-qualification-scope-audit/i,
  /unit202-proving-fixture/i,
  /\blesson-[a-z-]+\.ts\b/i,
  /obsolete-assets/i,
];

export interface CC19AContaminationFinding {
  readonly recordKind: "proposal" | "sourceInventoryEntry";
  readonly id: string;
  readonly field: string;
  readonly pattern: string;
  readonly value: string;
}

function scanField(value: string | undefined, pattern: RegExp): boolean {
  return value !== undefined && pattern.test(value);
}

/** Only scans PROVENANCE fields (sourceId/sourceRef/sourceLocator/rawIdentifier and the source-inventory's own sourceRef/title/reason) -- never `normalizationRationale`/`sourceExcerpt`, which legitimately quote raw curriculum wording that could otherwise coincidentally trip a pattern. */
export function findContamination(proposals: readonly CC19AProposal[], inventory: readonly CC19ASourceInventoryEntry[]): CC19AContaminationFinding[] {
  const findings: CC19AContaminationFinding[] = [];

  for (const p of proposals) {
    const fields: readonly [string, string | undefined][] = [
      ["layerA.sourceId", p.layerA.sourceId],
      ["layerA.sourceRef", p.layerA.sourceRef],
      ["layerA.sourceLocator", p.layerA.sourceLocator],
      ["layerA.rawIdentifier", p.layerA.rawIdentifier],
    ];
    for (const [field, value] of fields) {
      for (const pattern of BANNED_PROVENANCE_PATTERNS) {
        if (scanField(value, pattern)) {
          findings.push({ recordKind: "proposal", id: p.proposalId, field, pattern: pattern.source, value: value! });
        }
      }
    }
  }

  for (const e of inventory) {
    if (e.inclusionDecision !== "INCLUDED") continue; // excluded entries are EXPECTED to name forbidden sources -- that is the audit trail, not contamination
    const fields: readonly [string, string][] = [
      ["sourceRef", e.sourceRef],
      ["title", e.title],
    ];
    for (const [field, value] of fields) {
      for (const pattern of BANNED_PROVENANCE_PATTERNS) {
        if (pattern.test(value)) {
          findings.push({ recordKind: "sourceInventoryEntry", id: e.sourceId, field, pattern: pattern.source, value });
        }
      }
    }
  }

  return findings;
}
