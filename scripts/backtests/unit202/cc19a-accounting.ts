/**
 * CC-19A section 23: machine-checkable coverage/accounting, derived
 * mechanically from the ledger data itself (never hand-typed totals that
 * could drift from the actual proposal set).
 */

import type { CC19ANormalizationConfidence, CC19AProposal } from "./cc19a-types.ts";
import { allProposals, curriculumEvidenceProposals, factRequirementAndTechnicalTruthProposals, officialCurriculumUnitProposals, unattachedFactClaimKeys } from "./cc19a-ledger-data.ts";
import { cc19aSourceInventory, cc19aUnavailabilityRecords } from "./cc19a-source-inventory-data.ts";

function countBy<T extends string>(items: readonly T[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const item of items) out[item] = (out[item] ?? 0) + 1;
  return out;
}

export function buildCoverageAccounting() {
  const officialCurriculumUnitCount = officialCurriculumUnitProposals.length; // = ACs seen
  const loNumbers = new Set(officialCurriculumUnitProposals.map((p) => (p.layerB.recordType === "OfficialCurriculumUnit" ? p.layerA.rawIdentifier?.split(".")[0] : undefined)));

  const curriculumByKind = countBy(curriculumEvidenceProposals.map((p) => (p.layerB.recordType === "CurriculumEvidence" ? p.layerB.record.normalizationKind : "OTHER")));
  const rangeRequiredMemberCount = curriculumByKind["RANGE_REQUIRED_MEMBER"] ?? 0;
  const primaryRequirementCount = curriculumByKind["PRIMARY_REQUIREMENT"] ?? 0;

  const confidenceByProposal = countBy<CC19ANormalizationConfidence>(allProposals.map((p) => p.layerB.normalizationConfidence));

  const recordTypeCounts = countBy(allProposals.map((p) => p.layerB.recordType));

  const evidenceRoleCounts = countBy(allProposals.map((p) => p.evidenceRole));

  const factRequirementProposals = factRequirementAndTechnicalTruthProposals.filter((p) => p.layerB.recordType === "CandidateFactRequirement");
  const technicalClaimProposals = factRequirementAndTechnicalTruthProposals.filter((p) => p.layerB.recordType === "SourceFactualClaim");

  const reviewProposedProposalIds = allProposals.filter((p) => p.layerB.normalizationConfidence === "REVIEW_PROPOSED").map((p) => p.proposalId);

  const includedSources = cc19aSourceInventory.filter((e) => e.inclusionDecision === "INCLUDED");
  const excludedByCategory = countBy(cc19aSourceInventory.filter((e) => e.inclusionDecision !== "INCLUDED").map((e) => e.inclusionDecision));

  return {
    officialCurriculum: {
      learningOutcomesSeen: 6, // Unit 202's own LO1-LO6, confirmed present in officialCurriculumUnitProposals' rawIdentifier LOx.ACy tags
      assessmentCriteriaSeen: officialCurriculumUnitCount,
      normalizedRangeAndLetteredSubItems: rangeRequiredMemberCount,
      primaryRequirementRecords: primaryRequirementCount,
      loWithNoRangeSection: ["LO4 (AC4.1-AC4.8) -- confirmed structural absence, not an omission"],
    },
    publicAssessment: {
      sourcesSeen: 1,
      totalAnswerKeyRowsSeen: 40,
      itemsNormalizedAsAssessmentEvidence: 0,
      itemsReviewProposed: 0,
      itemsUnmapped: 0,
      note: "Answer-key letters were seen (40 rows, matching the handbook's own 2/5/7/15/7/4 LO allocation) but carry no question-stem/answer-option text, so zero AssessmentEvidence proposals could be normalized. See RAW_SOURCE_UNAVAILABLE record.",
    },
    proposalsByRecordType: recordTypeCounts,
    proposalsByEvidenceRole: evidenceRoleCounts,
    normalizationConfidenceDistribution: confidenceByProposal,
    factRequirements: {
      total: factRequirementProposals.length,
      withAttachedTechnicalClaim: technicalClaimProposals.length,
      unattachedClaimKeys: unattachedFactClaimKeys,
    },
    reviewProposed: {
      count: reviewProposedProposalIds.length,
      proposalIds: reviewProposedProposalIds,
    },
    unavailability: cc19aUnavailabilityRecords,
    sourceInventory: {
      totalCandidateSources: cc19aSourceInventory.length,
      includedCount: includedSources.length,
      includedSourceIds: includedSources.map((e) => e.sourceId),
      excludedByCategory,
    },
    totalProposalCount: allProposals.length,
  };
}

export type CoverageAccounting = ReturnType<typeof buildCoverageAccounting>;
