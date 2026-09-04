/**
 * CC-24 PA-review correction §4: proves the depth-review input is
 * exactly 15 items, deterministic, answer-free, and status-honest --
 * i.e. that pilot-002 cannot be described as authorised while the
 * depth review is pending. Imports only the clean pilot-preparation
 * path -- no historical material, and (mechanically, by construction --
 * this generator never imports it) no pilot-001 artifact either.
 */
import { describe, expect, it } from "vitest";

import { buildDepthReviewInput } from "./generate-depth-review-input.ts";
import { SELECTED_EVIDENCE_REQUIREMENT_IDS } from "./pilot-selection.ts";

const FORBIDDEN_DIRECTIONAL_ANSWER_TERMS = ["thumb", "finger", "curl", "curled"];
const DIRECTIONAL_REQUIREMENT_IDS = new Set([
  "ER::provisional::unit202::electromagnetism-and-induction::right-hand-grip-rule::OPERATIONAL_USE_RULE",
  "ER::provisional::unit202::electromagnetism-and-induction::fleming-left-hand-rule::OPERATIONAL_USE_RULE",
  "ER::provisional::unit202::electromagnetism-and-induction::fleming-right-hand-generator-rule::OPERATIONAL_USE_RULE",
]);

/** Strips the one intentionally-variable field (`generatedAt`) so two calls can be compared for determinism. */
function withoutTimestamp<T extends { generatedAt: unknown }>(value: T): Omit<T, "generatedAt"> {
  const { generatedAt: _generatedAt, ...rest } = value;
  return rest;
}

describe("CC-24 PA-review correction §4 -- pilot-002 depth-review input", () => {
  it("contains exactly the 15 expected evidenceRequirementIds, each exactly once, in the frozen selection order", () => {
    const input = buildDepthReviewInput();
    expect(input.expectedItemCount).toBe(15);
    expect(input.items).toHaveLength(15);
    expect(input.items.map((i) => i.evidenceRequirementId)).toEqual(SELECTED_EVIDENCE_REQUIREMENT_IDS);
  });

  it("is deterministic -- two independent calls produce byte-identical items (ignoring the one intentionally-variable generatedAt field)", () => {
    const a = buildDepthReviewInput();
    const b = buildDepthReviewInput();
    expect(withoutTimestamp(a)).toEqual(withoutTimestamp(b));
  });

  it("contains no source URLs, candidate identities, retrieved passages, or any pilot-001 normalized-claim vocabulary", () => {
    const json = JSON.stringify(buildDepthReviewInput());
    for (const forbidden of ["http://", "https://", "SRC-", "candidateSources", "retrievedPassage", "normalizedClaims", "sourceLocator", "sourceRef", "pilot-001", "PILOT-RESULTS", "PILOT-SEARCH-LOG", "PILOT-RETRIEVAL-LOG", "VERIFIED", "SOURCE_GAP", "PARTIALLY_VERIFIED", "CONFLICTED"]) {
      expect(json.includes(forbidden), `depth-review input must not contain "${forbidden}"`).toBe(false);
    }
  });

  it("keeps every directional OPEN_TECHNICAL_QUESTION requirement answer-free -- requirementText/evidenceQuestion name the rule only, never its finger/current/field/force mapping", () => {
    const input = buildDepthReviewInput();
    const directional = input.items.filter((i) => DIRECTIONAL_REQUIREMENT_IDS.has(i.evidenceRequirementId));
    expect(directional).toHaveLength(3);
    for (const item of directional) {
      expect(item.specificationMode).toBe("OPEN_TECHNICAL_QUESTION");
      const haystack = `${item.requirementText} ${item.evidenceQuestion ?? ""}`.toLowerCase();
      for (const term of FORBIDDEN_DIRECTIONAL_ANSWER_TERMS) {
        expect(haystack.includes(term), `"${item.evidenceRequirementId}" leaks forbidden directional-answer term "${term}"`).toBe(false);
      }
    }
  });

  it("sets overall status to PENDING_PROJECT_ARCHITECT_DEPTH_REVIEW", () => {
    expect(buildDepthReviewInput().status).toBe("PENDING_PROJECT_ARCHITECT_DEPTH_REVIEW");
  });

  it("makes no depth/curriculum/pedagogy decision -- every paDepthReview field is null for every item, so pilot-002 cannot be described as authorised while this review is pending", () => {
    const input = buildDepthReviewInput();
    expect(input.status).toBe("PENDING_PROJECT_ARCHITECT_DEPTH_REVIEW");
    for (const item of input.items) {
      expect(item.paDepthReview).toEqual({
        qualificationPerformanceVerb: null,
        minimumSufficientDepth: null,
        maximumJustifiedDepth: null,
        excludedEnrichment: null,
        assessmentPerformanceExpected: null,
        depthEvidenceBasis: null,
        depthVerdict: null,
        architectNotes: null,
        approvedAt: null,
      });
    }
    // No item's depthVerdict is ever non-null while status is PENDING -- an
    // "authorised" claim would require at least one non-null depthVerdict
    // AND a non-pending status, neither of which this generator ever
    // produces on its own.
    expect(input.items.every((i) => i.paDepthReview.depthVerdict === null && i.paDepthReview.approvedAt === null)).toBe(true);
  });

  it("carries qualification provenance (acquisitionTargetId/AC/raw wording) for every item, sourced only from the adapter's own audit metadata", () => {
    const input = buildDepthReviewInput();
    for (const item of input.items) {
      expect(item.qualificationProvenance.length).toBeGreaterThan(0);
      for (const p of item.qualificationProvenance) {
        expect(p.acquisitionTargetId).toMatch(/^ACQ-\d+$/);
        expect(p.ac).toMatch(/^AC\d/);
        expect(p.rawQualificationWording.length).toBeGreaterThan(0);
      }
    }
  });
});
