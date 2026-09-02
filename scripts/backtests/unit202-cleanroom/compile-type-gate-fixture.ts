/**
 * CC-19R1 section 23.A compile-time proof: demonstrates that
 * `CurriculumEvidence` (and friends) from "@alp/qualification-pipeline"
 * genuinely reject CC-19R's invented shape (bare `performanceType` +
 * `candidateKey` fields, missing `evidenceId`/`normalizationBasis`) at
 * compile time. Every `@ts-expect-error` below MUST have a real type
 * error to suppress -- if the shape were accidentally valid, `tsc
 * --noEmit` would fail on this file (an unused @ts-expect-error is
 * itself a compile error), which is exactly the point: this file is
 * part of `npx tsc --noEmit -p scripts/backtests/unit202-cleanroom`.
 *
 * This file is never imported by build-ledger.ts or any runtime code --
 * it exists purely as a typecheck-time assertion.
 */
import type { CandidateFactRequirement, CurriculumEvidence, QualificationLevelEvidence, SourceFactualClaim } from "@alp/qualification-pipeline";

// A valid CurriculumEvidence -- must compile cleanly (positive control).
const validCurriculum: CurriculumEvidence = {
  role: "OFFICIAL_CURRICULUM",
  evidenceId: "EV-TEST-0001",
  qualificationId: "TEST-QUAL",
  curriculumUnitId: "TEST-AC",
  subject: "test subject",
  normalizationKind: "PRIMARY_REQUIREMENT",
  commandVerbPerformanceType: "DESCRIBE",
  sourceRef: "test source",
  sourceLocator: "test locator",
  normalizationBasis: "EXPLICIT_CURRICULUM_WORDING",
};
void validCurriculum;

// CC-19R's invented shape: `performanceType` (wrong field name -- real
// field is `commandVerbPerformanceType`) must NOT type-check as an excess property.
const invalidCurriculumWithInventedPerformanceField: CurriculumEvidence = {
  role: "OFFICIAL_CURRICULUM",
  evidenceId: "EV-TEST-0003",
  qualificationId: "TEST-QUAL",
  curriculumUnitId: "TEST-AC",
  subject: "test subject",
  normalizationKind: "PRIMARY_REQUIREMENT",
  sourceRef: "test source",
  sourceLocator: "test locator",
  normalizationBasis: "EXPLICIT_CURRICULUM_WORDING",
  // @ts-expect-error -- 'performanceType' does not exist on CurriculumEvidence; the real field is 'commandVerbPerformanceType'.
  performanceType: "DESCRIBE",
};
void invalidCurriculumWithInventedPerformanceField;

// CC-19R's invented `candidateKey` field is not part of CurriculumEvidence at all.
const invalidCurriculumWithInventedCandidateKeyField: CurriculumEvidence = {
  role: "OFFICIAL_CURRICULUM",
  evidenceId: "EV-TEST-0004",
  qualificationId: "TEST-QUAL",
  curriculumUnitId: "TEST-AC",
  subject: "test subject",
  normalizationKind: "PRIMARY_REQUIREMENT",
  commandVerbPerformanceType: "DESCRIBE",
  sourceRef: "test source",
  sourceLocator: "test locator",
  normalizationBasis: "EXPLICIT_CURRICULUM_WORDING",
  // @ts-expect-error -- 'candidateKey' is not a field of CurriculumEvidence; candidate identity is computed via the candidateKey() function, never stored on the record.
  candidateKey: "test subject::DESCRIBE",
};
void invalidCurriculumWithInventedCandidateKeyField;

// Missing mandatory fields entirely (CC-19R never set evidenceId/normalizationBasis).
// @ts-expect-error -- missing mandatory 'evidenceId' and 'normalizationBasis' fields.
const invalidCurriculumMissingMandatoryFields: CurriculumEvidence = {
  role: "OFFICIAL_CURRICULUM",
  qualificationId: "TEST-QUAL",
  curriculumUnitId: "TEST-AC",
  subject: "test subject",
  normalizationKind: "PRIMARY_REQUIREMENT",
  commandVerbPerformanceType: "DESCRIBE",
  sourceRef: "test source",
  sourceLocator: "test locator",
};
void invalidCurriculumMissingMandatoryFields;

// Missing mandatory `sourceEvidenceRefs` on CandidateFactRequirement (CC-19R's defect).
// @ts-expect-error -- 'sourceEvidenceRefs' is missing (mandatory, readonly EvidenceRef[]).
const invalidFactRequirementMissingRefs: CandidateFactRequirement = {
  qualificationId: "TEST-QUAL",
  targetCandidateKey: "test subject::DESCRIBE",
  claimKey: "test.claim",
  derivationStatus: "REVIEW_PROPOSED",
  sourceRef: "test source",
  sourceLocator: "test locator",
  normalizationBasis: "FACT_REQUIREMENT_DERIVATION",
};
void invalidFactRequirementMissingRefs;

// CC-19R's broadcast sentinel is a plain string and type-checks fine as
// `appliesToCandidateKey` (the field IS just `string`) -- the defect was
// SEMANTIC (attachQualificationLevelConstraints never broadcasts), not a
// type error, which is exactly why CC-19R1's fix is the fan-out in
// build-ledger.ts rather than something a type system alone could catch.
// This is a valid, compiling QualificationLevelEvidence (documented here
// so the distinction is explicit, not silently assumed).
const validButSemanticallyWrongQlv: QualificationLevelEvidence = {
  role: "QUALIFICATION_LEVEL",
  evidenceId: "EV-TEST-0002",
  qualificationId: "TEST-QUAL",
  levelId: "Level 2",
  sourceRef: "test source",
  sourceLocator: "test locator",
  normalizationBasis: "QUALIFICATION_LEVEL_DESCRIPTOR",
  depthConstraintDescriptor: "test descriptor",
  appliesToCandidateKey: "ALL_UNIT_202_REQUIRED_CANDIDATES", // compiles, but never matches any real candidate at runtime
};
void validButSemanticallyWrongQlv;

// CC-19R's SourceFactualClaim shape omitted the mandatory `evidenceId` field entirely.
// Note: `normalizationBasis: "SOURCE_FACTUAL_CLAIM"` (CC-19R's incorrect value for a
// TECHNICAL_TRUTH claim) is itself a valid member of the broad `NormalizationBasis`
// union, so TypeScript's structural typing does not catch THAT specific defect --
// it is caught only at runtime by rules.ts's own type-compatibility gate
// (`validateFactualClaims`, TECHNICAL_CLAIM_ALLOWED_BASES). This fixture instead
// proves the field TypeScript CAN catch: the missing mandatory `evidenceId`.
// @ts-expect-error -- 'evidenceId' is missing (mandatory field on SourceFactualClaim).
const invalidFactualClaim: SourceFactualClaim = {
  claimKey: "test.claim",
  subject: "test subject",
  sourceRole: "TECHNICAL_TRUTH",
  normalizedClaimValue: "test value",
  comparisonKind: "CANONICAL_TEXT",
  sourceRef: "test source",
  sourceLocator: "test locator",
  normalizationBasis: "SOURCE_FACTUAL_CLAIM",
};
void invalidFactualClaim;
