/**
 * CC-18/CC-18A: generic qualification knowledge-construction pipeline --
 * types.
 *
 * This package is deliberately independent of any specific qualification.
 * Nothing here may name a real subject, AC number, Range item, or
 * qualification. Concrete subjects/topics are opaque strings supplied by
 * evidence records at call time; production logic in ./rules.ts must never
 * branch on their content. Subject-specific values belong only in test
 * fixtures (./rules.test.ts) and, later, in a qualification-specific data
 * package that constructs evidence records and calls these functions --
 * never in this package.
 *
 * ARCHITECTURE DOCUMENT: docs/architecture/qualification-knowledge-
 * construction-pipeline.md is the governing design document this package
 * implements. Read it first.
 *
 * CC-18A hardening (Project-Architect adversarial review of CC-18) closed
 * several places where a synthetic fixture could pre-declare a
 * relationship that production code then trusted as proven:
 *   - assessment-to-curriculum mapping is now validated against a real
 *     OfficialCurriculumUnit registry, never trusted from a bare string;
 *   - category/family relationships (`underCategory`/`familyKey`) must
 *     resolve against governed CurriculumSubjectRelation/CurriculumFamily
 *     records, not an arbitrary string supplied only by the assessment
 *     item itself;
 *   - QUALIFICATION_LEVEL is its own evidence type (depth constraint
 *     only, never scope-creating), separated from prerequisite necessity;
 *   - a prerequisite can become FOUNDATIONAL_PREREQUISITE only via a
 *     structural capabilityKey match against a required candidate's own
 *     declared `requiredCapabilityKeys` -- a free-form necessity label is
 *     no longer sufficient on its own;
 *   - curriculum/provider and technical-truth factual claims are
 *     independent `SourceFactualClaim` records compared by `claimKey`;
 *     nothing pre-labels a conflict;
 *   - category breadth status (`CategoryBreadthStatus`) is declared by
 *     curriculum normalization independently of whether any assessment
 *     evidence exists, so a breadth gap can fire with zero assessment
 *     coverage;
 *   - every evidence record capable of influencing required scope,
 *     performance, depth, prerequisite status, category/family
 *     relationship, or factual truth carries mandatory `sourceRef` /
 *     `sourceLocator` / `normalizationBasis` provenance.
 */

import { z } from "zod";

// ---------------------------------------------------------------------
// 1. Evidence-role hierarchy (task section 2, CC-18). Locked by the
// Product Owner / Project Architect -- this package implements it, never
// revises it.
// ---------------------------------------------------------------------

/**
 * - OFFICIAL_CURRICULUM: curriculum SCOPE authority.
 * - PUBLIC_ASSESSMENT: learner-performance discovery + depth/performance calibration.
 * - QUALIFICATION_LEVEL: depth constraint only -- never scope-creating (CC-18A).
 * - TECHNICAL_TRUTH: factual truth only -- never curriculum scope authority on its own.
 * - OPTIONAL_CALIBRATION: optional external calibration benchmark only -- never required by the standard pipeline.
 * - LEGACY_DIAGNOSTIC: diagnostic/comparison only -- never scope, depth, or factual authority.
 * - MODEL_KNOWLEDGE: no evidential authority.
 */
export const evidenceRoleSchema = z.enum([
  "OFFICIAL_CURRICULUM",
  "PUBLIC_ASSESSMENT",
  "QUALIFICATION_LEVEL",
  "TECHNICAL_TRUTH",
  "OPTIONAL_CALIBRATION",
  "LEGACY_DIAGNOSTIC",
  "MODEL_KNOWLEDGE",
]);
export type EvidenceRole = z.infer<typeof evidenceRoleSchema>;

/** Evidence roles the STANDARD pipeline may consult to justify a required candidate. */
export const STANDARD_MODE_CANDIDATE_ROLES: readonly EvidenceRole[] = [
  "OFFICIAL_CURRICULUM",
  "PUBLIC_ASSESSMENT",
  "QUALIFICATION_LEVEL",
  "TECHNICAL_TRUTH",
];

/** Evidence roles the standard pipeline must never use to justify a required candidate. */
export const DIAGNOSTIC_ONLY_ROLES: readonly EvidenceRole[] = ["OPTIONAL_CALIBRATION", "LEGACY_DIAGNOSTIC", "MODEL_KNOWLEDGE"];

// ---------------------------------------------------------------------
// 2. Learner-performance type (task section 10, CC-18) -- first-class,
// never collapsed into a bare "knows topic X" proposition.
// ---------------------------------------------------------------------

export const learnerPerformanceTypeSchema = z.enum([
  "DEFINE",
  "STATE",
  "DESCRIBE",
  "EXPLAIN",
  "IDENTIFY",
  "RECOGNISE",
  "DISTINGUISH",
  "CALCULATE",
  "APPLY",
  "INTERPRET",
  "DIRECTION_RULE",
  "COMPONENT_ROLE",
  "SCHEMATIC_RECOGNITION",
  "PHYSICAL_RECOGNITION",
  "PROCEDURE",
  "OTHER",
]);
export type LearnerPerformanceType = z.infer<typeof learnerPerformanceTypeSchema>;

// ---------------------------------------------------------------------
// 3. Candidate disposition (task section 9, CC-18).
// ---------------------------------------------------------------------

export const candidateDispositionSchema = z.enum([
  "REQUIRED_EXPLICIT_CURRICULUM",
  "REQUIRED_ASSESSMENT_EVIDENCED",
  "FOUNDATIONAL_PREREQUISITE",
  "REPRESENTATIVE_EXEMPLAR",
  "CONTEXTUAL_TEACHING_SUPPORT",
  "OPEN_SCOPE_GAP",
  "REVIEW_REQUIRED",
]);
export type CandidateDisposition = z.infer<typeof candidateDispositionSchema>;

export const REQUIRED_DISPOSITIONS: readonly CandidateDisposition[] = ["REQUIRED_EXPLICIT_CURRICULUM", "REQUIRED_ASSESSMENT_EVIDENCED"];

// ---------------------------------------------------------------------
// 4. Confidence model (task section 16, CC-18).
// ---------------------------------------------------------------------

export const confidenceLevelSchema = z.enum(["HIGH", "MEDIUM", "LOW", "NONE"]);
export type ConfidenceLevel = z.infer<typeof confidenceLevelSchema>;

export interface ConfidenceProfile {
  readonly scopeConfidence: ConfidenceLevel;
  readonly depthConfidence: ConfidenceLevel;
  readonly technicalTruthConfidence: ConfidenceLevel;
}

// ---------------------------------------------------------------------
// 5. Gap model (task section 17, CC-18; extended CC-18A section 5/20).
// ---------------------------------------------------------------------

export const gapTypeSchema = z.enum([
  "SCOPE_BREADTH_GAP",
  "PERFORMANCE_DEPTH_GAP",
  "TECHNICAL_TRUTH_GAP",
  "CURRICULUM_TECHNICAL_CONFLICT",
  "ASSESSMENT_GENERALISATION_REVIEW",
  "ASSESSMENT_MAPPING_REVIEW",
]);
export type GapType = z.infer<typeof gapTypeSchema>;

/**
 * One structured gap. `legitimateResolverRoles` is plural (CC-18A section
 * 20) -- a gap may legitimately be resolved by more than one evidence
 * role (e.g. a scope-breadth gap by further official curriculum wording
 * OR by additional public-assessment evidence). TECHNICAL_TRUTH must
 * never appear as a resolver for a curriculum-breadth question.
 */
export interface GapRecord {
  readonly gapType: GapType;
  readonly candidateKey: string;
  readonly evidenceAvailable: readonly string[];
  readonly unresolved: string;
  readonly legitimateResolverRoles: readonly EvidenceRole[];
  readonly notes?: string;
}

// ---------------------------------------------------------------------
// 6. Source-normalization provenance (CC-18A section 21) -- mandatory on
// every evidence record capable of influencing required scope, learner
// performance, depth, prerequisite status, category/family relationship,
// or factual truth.
// ---------------------------------------------------------------------

export const normalizationBasisSchema = z.enum([
  "EXPLICIT_CURRICULUM_WORDING",
  "EXPLICIT_RANGE_STRUCTURE",
  "POSITIVE_ASSESSMENT_TARGET",
  "ASSESSMENT_CURRICULUM_MAPPING",
  "QUALIFICATION_LEVEL_DESCRIPTOR",
  "STRUCTURAL_PREREQUISITE_DEPENDENCY",
  "AUTHORITATIVE_TECHNICAL_FACT",
  "SOURCE_FACTUAL_CLAIM",
]);
export type NormalizationBasis = z.infer<typeof normalizationBasisSchema>;

/** Fields every scope/performance/depth/prerequisite/relationship/factual-truth-influencing evidence record must carry. */
export interface SourceProvenance {
  readonly sourceRef: string;
  readonly sourceLocator: string;
  readonly normalizationBasis: NormalizationBasis;
}

// ---------------------------------------------------------------------
// 7. Candidate identity and shape.
// ---------------------------------------------------------------------

export function candidateKey(subject: string, performanceType: LearnerPerformanceType): string {
  return `${subject}::${performanceType}`;
}

/**
 * `role` covers the 7 governed evidence roles; `"STRUCTURAL_PREREQUISITE_
 * DEPENDENCY"` additionally tags a reference back to a `PrerequisiteEvidence`
 * record, which (CC-18A section 7) is a DERIVED structural claim about
 * capability dependency, never itself one of the 7 primary evidence roles.
 */
export interface EvidenceRef {
  readonly role: EvidenceRole | "STRUCTURAL_PREREQUISITE_DEPENDENCY";
  readonly evidenceId: string;
}

/** The pipeline's own output unit -- never a final curriculum decision. */
export interface KnowledgeCandidate {
  readonly candidateKey: string;
  readonly subject: string;
  readonly performanceType: LearnerPerformanceType;
  readonly disposition: CandidateDisposition;
  readonly confidence: ConfidenceProfile;
  readonly rationale: string;
  readonly evidenceRefs: readonly EvidenceRef[];
  readonly factualStatement?: string;
  readonly exemplarOfCategory?: string;
  readonly assessmentPattern?: {
    readonly familyKey: string;
    readonly evidencedMembers: readonly string[];
  };
  /**
   * Capability dependencies this required performance structurally needs
   * (CC-18A section 10), declared by the curriculum evidence that created
   * this candidate -- the only thing a `PrerequisiteEvidence` record can
   * structurally match against to earn `FOUNDATIONAL_PREREQUISITE`.
   */
  readonly requiredCapabilityKeys?: readonly string[];
  /** References to QualificationLevelEvidence attached to this candidate (CC-18A section 7) -- depth constraint only, never scope. */
  readonly qualificationLevelRefs?: readonly EvidenceRef[];
  readonly depthConstraintNote?: string;
}

// ---------------------------------------------------------------------
// 8. Official curriculum-unit registry (CC-18A section 3). NOT a
// candidate list -- the real, authoritative set of AC/LO/curriculum
// units available for assessment mapping.
// ---------------------------------------------------------------------

export interface OfficialCurriculumUnit {
  readonly curriculumUnitId: string;
  readonly qualificationId: string;
  readonly sourceRef: string;
  readonly sourceLocator: string;
  readonly officialWording: string;
  readonly learningOutcomeId?: string;
  readonly parentCurriculumUnitId?: string;
}

// ---------------------------------------------------------------------
// 9. Category breadth status (CC-18A section 19) -- declared explicitly
// by curriculum normalization, never guessed from the category's own
// English word inside production logic.
// ---------------------------------------------------------------------

export const categoryBreadthStatusSchema = z.enum(["ENUMERATED_COMPLETE", "OPEN_OR_UNDERSPECIFIED", "UNKNOWN"]);
export type CategoryBreadthStatus = z.infer<typeof categoryBreadthStatusSchema>;

// ---------------------------------------------------------------------
// 10. Curriculum evidence (task section 5/6, CC-18; extended CC-18A).
// ---------------------------------------------------------------------

export interface CurriculumEvidence extends SourceProvenance {
  readonly role: "OFFICIAL_CURRICULUM";
  readonly evidenceId: string;
  readonly curriculumUnitId: string;
  readonly subject: string;
  /** True when named directly in the AC/LO's own primary wording (not merely in a Range item). */
  readonly namedInPrimaryWording: boolean;
  /** True when this record is itself a Range item (as opposed to AC/LO primary wording). */
  readonly isRangeItem: boolean;
  /** For a Range item refining a broader subject -- the subject it refines. Omit for AC primary wording or a standalone Range category. */
  readonly refinesSubject?: string;
  /** The AC/LO's own command verb, where this evidence is primary wording -- drives the required candidate's performanceType. Defaults to OTHER when absent. */
  readonly commandVerbPerformanceType?: LearnerPerformanceType;
  /**
   * Declared breadth status for a standalone category subject (CC-18A
   * section 19). Undefined is treated as UNKNOWN -- never silently
   * treated as ENUMERATED_COMPLETE or OPEN_OR_UNDERSPECIFIED.
   */
  readonly breadthStatus?: CategoryBreadthStatus;
  /**
   * Capability dependencies this required performance structurally needs
   * (e.g. an operational sub-skill without which the performance cannot
   * be carried out) -- the only thing a prerequisite can match against
   * (CC-18A section 10).
   */
  readonly requiredCapabilityKeys?: readonly string[];
}

// ---------------------------------------------------------------------
// 11. Assessment evidence (task section 3/4, CC-18; mapping validation
// added CC-18A sections 2-6).
// ---------------------------------------------------------------------

export interface AssessmentEvidence extends SourceProvenance {
  readonly role: "PUBLIC_ASSESSMENT";
  readonly evidenceId: string;
  readonly assessmentSource: string;
  readonly itemId: string;
  /** The qualification this assessment paper itself belongs to -- used to reject a mapping to a real unit from a DIFFERENT qualification (CC-18A section 5). */
  readonly qualificationId: string;
  /** Attempted mapping to an OfficialCurriculumUnit.curriculumUnitId. May be empty. Never trusted merely for being non-empty (CC-18A section 2) -- validated against the registry. */
  readonly mappedCurriculumUnitId: string;
  readonly questionStemRef: string;
  readonly correctAnswerTarget: string;
  readonly subject: string;
  readonly performanceType: LearnerPerformanceType;
  /**
   * The broader, standalone curriculum-category subject this item is a
   * narrower sub-case of, if any. Only trusted for scope-breadth
   * purposes when a matching governed `CurriculumSubjectRelation` also
   * exists (CC-18A section 6) -- an assessment record cannot unilaterally
   * assert this relationship.
   */
  readonly underCategory?: string;
  /**
   * Family-grouping key for pattern-generalisation detection. Only
   * trusted when a matching governed `CurriculumFamily` also exists and
   * lists this item's `subject` as a member (CC-18A section 6).
   */
  readonly familyKey?: string;
  /** Distractor-only content from the same item. NEVER read by candidate generation. */
  readonly distractorSubjects?: readonly string[];
}

// ---------------------------------------------------------------------
// 12. Governed category/family relationships (CC-18A section 6) -- the
// ONLY thing that can make an assessment item's own `underCategory` /
// `familyKey` label actually count for breadth/pattern purposes.
// ---------------------------------------------------------------------

export interface CurriculumSubjectRelation extends SourceProvenance {
  readonly subject: string;
  readonly underCategory: string;
}

export interface CurriculumFamily extends SourceProvenance {
  readonly familyKey: string;
  readonly memberSubjects: readonly string[];
}

// ---------------------------------------------------------------------
// 13. Qualification-level evidence (CC-18A section 7/8) -- depth
// constraint ONLY. Never generates scope; only attaches to an existing
// candidate it names by key.
// ---------------------------------------------------------------------

export interface QualificationLevelEvidence extends SourceProvenance {
  readonly role: "QUALIFICATION_LEVEL";
  readonly evidenceId: string;
  readonly levelId: string;
  readonly depthConstraintDescriptor: string;
  /** The exact (subject, performanceType) candidate this depth ceiling constrains -- never creates a new candidate. */
  readonly appliesToCandidateKey: string;
}

// ---------------------------------------------------------------------
// 14. Prerequisite (structural capability-dependency) evidence (CC-18A
// section 9-11). Deliberately NOT tagged with one of the 7 evidence
// roles -- prerequisite necessity is a derived structural claim, not a
// primary evidence source. The free-form `necessityKind` self-declaration
// CC-18 used is REMOVED: the only gate is a `capabilityKey` match against
// an existing required candidate's own declared `requiredCapabilityKeys`.
// ---------------------------------------------------------------------

export interface PrerequisiteEvidence extends SourceProvenance {
  readonly kind: "STRUCTURAL_PREREQUISITE_DEPENDENCY";
  readonly evidenceId: string;
  readonly subject: string;
  readonly performanceType: LearnerPerformanceType;
  /** Must match an entry in the target candidate's own `requiredCapabilityKeys` to earn FOUNDATIONAL_PREREQUISITE. */
  readonly capabilityKey: string;
  readonly necessaryForCandidateKey: string;
  readonly minimalDepthJustification: string;
}

// ---------------------------------------------------------------------
// 15. Exemplar evidence (task section 12, CC-18). CC-18A restricts the
// allowed source roles to TECHNICAL_TRUTH/PUBLIC_ASSESSMENT only --
// CC-18's own type additionally allowed OPTIONAL_CALIBRATION, which was
// inconsistent with the hard "never in standard mode" rule for that role
// and is removed here.
// ---------------------------------------------------------------------

export interface ExemplarEvidence {
  readonly role: "TECHNICAL_TRUTH" | "PUBLIC_ASSESSMENT";
  readonly evidenceId: string;
  readonly exemplarOfCategory: string;
  readonly exemplarSubject: string;
  readonly implementationDetailSubjects?: readonly string[];
}

// ---------------------------------------------------------------------
// 16. Independent factual-claim model (CC-18A section 12-15). Curriculum/
// provider claims and technical-truth claims are independent records
// correlated only by a shared canonical `claimKey` -- nothing pre-labels
// a conflict on the technical-truth record itself.
// ---------------------------------------------------------------------

export interface SourceFactualClaim extends SourceProvenance {
  /** Canonical factual-dimension identity -- two claims about the "same fact" share this key regardless of source. */
  readonly claimKey: string;
  readonly subject: string;
  /** Typically OFFICIAL_CURRICULUM, TECHNICAL_TRUTH, or (diagnostic-only comparison, never standard mode) OPTIONAL_CALIBRATION. */
  readonly sourceRole: EvidenceRole;
  readonly evidenceId: string;
  readonly normalizedClaimValue: string;
  readonly originalWordingRef?: string;
}

// ---------------------------------------------------------------------
// 17. Optional-calibration / legacy-diagnostic evidence (task section
// 18/19, CC-18). Never capable of influencing required scope -- no
// mandatory provenance burden imposed here since neither type is ever a
// scope/performance/depth/prerequisite/relationship/factual-truth input
// to the standard pipeline.
// ---------------------------------------------------------------------

export interface OptionalCalibrationEvidence {
  readonly role: "OPTIONAL_CALIBRATION";
  readonly evidenceId: string;
  readonly subject: string;
  readonly claim: string;
}

export interface LegacyDiagnosticEvidence {
  readonly role: "LEGACY_DIAGNOSTIC";
  readonly evidenceId: string;
  readonly subject: string;
  readonly claim: string;
}

export type AnyEvidence =
  | CurriculumEvidence
  | AssessmentEvidence
  | QualificationLevelEvidence
  | ExemplarEvidence
  | OptionalCalibrationEvidence
  | LegacyDiagnosticEvidence;

// ---------------------------------------------------------------------
// 18. Diagnostic comparison (task section 18, CC-18) -- the ONLY thing
// optional-calibration/legacy-diagnostic evidence may ever produce: a
// read-only report, never a mutation and never a new required candidate.
// ---------------------------------------------------------------------

export interface DiagnosticComparisonEntry {
  readonly subject: string;
  readonly diagnosticRole: "OPTIONAL_CALIBRATION" | "LEGACY_DIAGNOSTIC";
  readonly claim: string;
  readonly matchesExistingCandidate: boolean;
  readonly matchingCandidateKeys: readonly string[];
}

// ---------------------------------------------------------------------
// 19. Standard-pipeline result.
// ---------------------------------------------------------------------

export interface StandardPipelineResult {
  readonly candidates: readonly KnowledgeCandidate[];
  readonly gaps: readonly GapRecord[];
  /** TECHNICAL_TRUTH-sourced factual claims that matched no existing candidate -- recorded for transparency, never converted into scope. */
  readonly unmatchedTechnicalTruth: readonly SourceFactualClaim[];
  /** QualificationLevelEvidence that named no existing candidate -- recorded for transparency, never converted into scope. */
  readonly unmatchedQualificationLevel: readonly QualificationLevelEvidence[];
}
