/**
 * CC-19R2 sections 6-8: an ACTUAL historical comparison of every original
 * CC-19R REVIEW_FACT_PROPOSALS entry (extracted verbatim from clean-room
 * commit 20d65c6, which is permitted -- it is the preceding clean-room
 * experiment's own output, not forbidden Unit-202 material) against the
 * current frozen set at ea7e8be. Never uses claim-key membership or a
 * bare count as proof of preservation -- every field of every original
 * tuple is compared.
 *
 * The historical snapshot at
 * scripts/backtests/unit202-cleanroom/historical-snapshots/review-facts-data.20d65c6.ts
 * is an untouched `git show 20d65c6:...` extraction, imported directly
 * (not regex-parsed) so the comparison is against the REAL historical
 * data structure, not an approximation.
 */
import { REVIEW_FACT_PROPOSALS as HISTORICAL_PROPOSALS } from "./historical-snapshots/review-facts-data.20d65c6.ts";
import { REVIEW_FACT_PROPOSALS as CURRENT_PROPOSALS_TYPED } from "./review-facts-data.ts";

/**
 * Common comparison shape: the historical (commit-20d65c6) snapshot
 * predates CC-19R1's LearnerPerformanceType typing (DEFECT-A fix) and
 * declares `targetPerformanceType: string`. Widening the current set to
 * the same shape here is a type-level-only accommodation for comparison
 * purposes -- it does not touch either underlying data file.
 */
export interface ReviewFactProposal {
  readonly targetSubject: string;
  readonly targetPerformanceType: string;
  readonly claimKey: string;
  readonly parentAcId: string;
  readonly necessityRationale: string;
  readonly technicalClaimKey?: string;
}
const CURRENT_PROPOSALS: readonly ReviewFactProposal[] = CURRENT_PROPOSALS_TYPED;

/**
 * Documented mechanical target/schema corrections CC-19R1 is known to
 * have applied to ORIGINAL (pre-existing-at-20d65c6) proposals. Empty:
 * the one target-subject fix for AC4.3 ("resistance and resistivity" ->
 * "resistance and resistivity in relation to electrical circuits") was
 * already applied within the CC-19R session itself, before commit
 * 20d65c6 -- so it is NOT a CC-19R1 correction and does not appear here.
 * If this array is non-empty, every entry must be justified by a comment
 * naming which task-authorised correction (never a semantic revision) it
 * represents.
 */
export interface DocumentedMechanicalCorrection {
  readonly historicalClaimKey: string;
  readonly historicalTargetSubject: string;
  readonly historicalTargetPerformanceType: string;
  readonly field: "targetSubject" | "targetPerformanceType" | "parentAcId" | "necessityRationale" | "technicalClaimKey";
  readonly correctedValue: string | undefined;
  readonly justification: string;
}
export const DOCUMENTED_MECHANICAL_CORRECTIONS: readonly DocumentedMechanicalCorrection[] = [];

export interface HistoricalComparisonEntry {
  readonly historical: ReviewFactProposal;
  readonly currentMatch: ReviewFactProposal | undefined;
  readonly status: "EXACT_PRESERVED" | "MECHANICALLY_EQUIVALENT" | "MISSING" | "UNEXPECTED_SEMANTIC_CHANGE";
  readonly fieldDiffs: readonly string[];
}

function findCandidateMatches(historical: ReviewFactProposal): readonly ReviewFactProposal[] {
  // Primary identity: claimKey + historical targetSubject/targetPerformanceType.
  // A mechanically-corrected entry may have a DIFFERENT targetSubject, so we
  // also fall back to claimKey + parentAcId + necessityRationale as a secondary key.
  const primary = CURRENT_PROPOSALS.filter((c) => c.claimKey === historical.claimKey && c.targetSubject === historical.targetSubject && c.targetPerformanceType === historical.targetPerformanceType);
  if (primary.length > 0) return primary;
  return CURRENT_PROPOSALS.filter((c) => c.claimKey === historical.claimKey && c.parentAcId === historical.parentAcId);
}

export function compareHistoricalReviewProposals(): readonly HistoricalComparisonEntry[] {
  return HISTORICAL_PROPOSALS.map((historical): HistoricalComparisonEntry => {
    const candidates = findCandidateMatches(historical);
    if (candidates.length === 0) {
      return { historical, currentMatch: undefined, status: "MISSING", fieldDiffs: ["no current entry matches claimKey+parentAcId at all"] };
    }

    // Prefer an exact full-tuple match if one exists among candidates.
    const exact = candidates.find(
      (c) =>
        c.targetSubject === historical.targetSubject &&
        c.targetPerformanceType === historical.targetPerformanceType &&
        c.parentAcId === historical.parentAcId &&
        c.necessityRationale === historical.necessityRationale &&
        c.technicalClaimKey === historical.technicalClaimKey,
    );
    if (exact) return { historical, currentMatch: exact, status: "EXACT_PRESERVED", fieldDiffs: [] };

    // Check whether the best candidate's differences are covered by a documented mechanical correction.
    const best = candidates[0]!;
    const diffs: string[] = [];
    const fields: readonly (keyof ReviewFactProposal)[] = ["targetSubject", "targetPerformanceType", "parentAcId", "necessityRationale", "technicalClaimKey"];
    for (const field of fields) {
      if (historical[field] !== best[field]) diffs.push(`${field}: "${String(historical[field])}" -> "${String(best[field])}"`);
    }

    const allDiffsDocumented = fields
      .filter((field) => historical[field] !== best[field])
      .every((field) =>
        DOCUMENTED_MECHANICAL_CORRECTIONS.some(
          (corr) => corr.historicalClaimKey === historical.claimKey && corr.historicalTargetSubject === historical.targetSubject && corr.historicalTargetPerformanceType === historical.targetPerformanceType && corr.field === field && corr.correctedValue === best[field],
        ),
      );

    return {
      historical,
      currentMatch: best,
      status: allDiffsDocumented ? "MECHANICALLY_EQUIVALENT" : "UNEXPECTED_SEMANTIC_CHANGE",
      fieldDiffs: diffs,
    };
  });
}

export interface HistoricalComparisonSummary {
  readonly historicalCount: number;
  readonly exactPreservedCount: number;
  readonly mechanicallyEquivalentCount: number;
  readonly missingCount: number;
  readonly unexpectedSemanticChangeCount: number;
}

export function summarizeHistoricalComparison(entries: readonly HistoricalComparisonEntry[] = compareHistoricalReviewProposals()): HistoricalComparisonSummary {
  return {
    historicalCount: entries.length,
    exactPreservedCount: entries.filter((e) => e.status === "EXACT_PRESERVED").length,
    mechanicallyEquivalentCount: entries.filter((e) => e.status === "MECHANICALLY_EQUIVALENT").length,
    missingCount: entries.filter((e) => e.status === "MISSING").length,
    unexpectedSemanticChangeCount: entries.filter((e) => e.status === "UNEXPECTED_SEMANTIC_CHANGE").length,
  };
}
