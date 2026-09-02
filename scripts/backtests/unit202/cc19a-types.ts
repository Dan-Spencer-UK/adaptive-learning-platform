/**
 * CC-19A: Unit 202 blind source-normalization freeze -- back-test-specific
 * serialization types.
 *
 * These types are NOT part of the generic qualification-pipeline package
 * (packages/qualification-pipeline). They exist only to wrap a genuine
 * qualification-pipeline evidence record (Layer B) together with the raw
 * source it was normalized from (Layer A) and the as-yet-unrun pipeline
 * acceptance layer (Layer C, always "NOT_RUN_CC19A" in this package -- see
 * task section 25/CC-19A section 7).
 *
 * CC-19A must NOT modify packages/qualification-pipeline's own production
 * types or rules -- this file is deliberately back-test-only.
 */

import type {
  AssessmentEvidence,
  CandidateCapabilityRequirement,
  CandidateFactRequirement,
  CurriculumEvidence,
  CurriculumFamily,
  CurriculumSubjectRelation,
  ExemplarEvidence,
  OfficialCurriculumUnit,
  PrerequisiteEvidence,
  QualificationLevelEvidence,
  SourceFactualClaim,
} from "@alp/qualification-pipeline";

export type CC19AEvidenceRole = "OFFICIAL_CURRICULUM" | "PUBLIC_ASSESSMENT" | "QUALIFICATION_LEVEL" | "TECHNICAL_TRUTH";

export type CC19ARecordType =
  | "OfficialCurriculumUnit"
  | "CurriculumEvidence"
  | "AssessmentEvidence"
  | "CurriculumSubjectRelation"
  | "CurriculumFamily"
  | "QualificationLevelEvidence"
  | "CandidateCapabilityRequirement"
  | "PrerequisiteEvidence"
  | "CandidateFactRequirement"
  | "SourceFactualClaim"
  | "ExemplarEvidence";

/** CC-19A section 7: locked confidence vocabulary for a normalization proposal -- never "correct/incorrect", only how directly the raw wording supports it. */
export type CC19ANormalizationConfidence = "EXPLICIT" | "STRONG_INFERENCE" | "REVIEW_PROPOSED";

/** CC-19A section 21: which future back-test profile(s) this proposal is eligible to participate in, mechanically derivable by filtering -- never hand-authored per profile. */
export type CC19AProfile = "FULL_PUBLIC" | "DEGRADED_NO_ASSESSMENT";

export type CC19APipelineRecord =
  | { recordType: "OfficialCurriculumUnit"; record: OfficialCurriculumUnit }
  | { recordType: "CurriculumEvidence"; record: CurriculumEvidence }
  | { recordType: "AssessmentEvidence"; record: AssessmentEvidence }
  | { recordType: "CurriculumSubjectRelation"; record: CurriculumSubjectRelation }
  | { recordType: "CurriculumFamily"; record: CurriculumFamily }
  | { recordType: "QualificationLevelEvidence"; record: QualificationLevelEvidence }
  | { recordType: "CandidateCapabilityRequirement"; record: CandidateCapabilityRequirement }
  | { recordType: "PrerequisiteEvidence"; record: PrerequisiteEvidence }
  | { recordType: "CandidateFactRequirement"; record: CandidateFactRequirement }
  | { recordType: "SourceFactualClaim"; record: SourceFactualClaim }
  | { recordType: "ExemplarEvidence"; record: ExemplarEvidence };

/** CC-19A section 6: Layer A -- the raw source locator, preserved independently of what Layer B claims about it. */
export interface CC19ALayerA {
  readonly sourceId: string;
  readonly sourceRef: string;
  readonly sourceLocator: string;
  /** Short verbatim excerpt sufficient to audit the normalization without reconstructing the normalizer's reasoning. */
  readonly sourceExcerpt: string;
  /** The raw curriculum/assessment identifier as printed in the source, if any (e.g. "AC2.2", "Q17"). */
  readonly rawIdentifier?: string;
}

/** CC-19A section 7: Layer B -- the normalization proposal itself, plus its own confidence/rationale/profile tags. */
export interface CC19ALayerB {
  readonly normalizationConfidence: CC19ANormalizationConfidence;
  /** Must explain the transformation from the quoted source wording, never pedagogical usefulness. */
  readonly normalizationRationale: string;
  readonly profileEligibility: readonly CC19AProfile[];
}

/** CC-19A section 7: Layer C -- deliberately inert in this package; the pipeline has not run against Unit 202. */
export interface CC19ALayerC {
  readonly pipelineAcceptance: "NOT_RUN_CC19A";
}

export interface CC19AProposal {
  readonly proposalId: string;
  readonly evidenceRole: CC19AEvidenceRole;
  readonly layerA: CC19ALayerA;
  readonly layerB: CC19ALayerB & CC19APipelineRecord;
  readonly layerC: CC19ALayerC;
}

export type CC19ASourceStatus = "INCLUDED" | "EXCLUDED_PRIVATE" | "EXCLUDED_DERIVED" | "EXCLUDED_LEGACY" | "EXCLUDED_NOT_RELEVANT";

export interface CC19ASourceInventoryEntry {
  readonly sourceId: string;
  readonly sourceRole: CC19AEvidenceRole | "N/A";
  /** Exact path/URI/source reference -- a repo-relative path for a locally stored raw artefact, or a fully-qualified public URL. */
  readonly sourceRef: string;
  readonly title: string;
  readonly publicPrivateDerivedStatus: "PUBLIC" | "PRIVATE" | "DERIVED" | "MIXED_THIRD_PARTY_UNVERIFIED";
  readonly inclusionDecision: CC19ASourceStatus;
  readonly reason: string;
  /** SHA-256 of the locally stored raw artefact, present only when `INCLUDED` and a local copy was retained under reports/backtests/unit202/raw-sources/. */
  readonly contentHashSha256?: string;
}

/** RAW_SOURCE_UNAVAILABLE / TECHNICAL_RAW_SOURCE_UNAVAILABLE stop-reporting record (CC-19A sections 4 and 17). */
export interface CC19AUnavailabilityRecord {
  readonly kind: "RAW_SOURCE_UNAVAILABLE" | "TECHNICAL_RAW_SOURCE_UNAVAILABLE";
  readonly evidenceClass: string;
  readonly attemptedSources: readonly string[];
  readonly explanation: string;
}
