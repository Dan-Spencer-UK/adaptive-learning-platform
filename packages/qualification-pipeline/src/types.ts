/**
 * CC-18/CC-18A/CC-18B/CC-18C: generic qualification knowledge-
 * construction pipeline -- types.
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
 * CC-18B hardening (a second round of Project-Architect adversarial
 * review) closes the raw-source -> normalized-evidence boundary further:
 *   - the pipeline is locked to exactly one `qualificationId` per run;
 *     every qualification-specific evidence type carries its own
 *     `qualificationId` and is filtered/validated against it;
 *   - `OfficialCurriculumUnit` is keyed by the COMPOSITE
 *     `(qualificationId, curriculumUnitId)`, never `curriculumUnitId`
 *     alone, and a duplicate composite key with incompatible official
 *     wording/source identity is a registry conflict, never
 *     last-write-wins;
 *   - `CurriculumEvidence` itself is now validated against that registry
 *     (CC-18A validated only assessment mappings);
 *   - the ambiguous `namedInPrimaryWording`/`isRangeItem` boolean pair is
 *     replaced by an explicit, locked `CurriculumNormalizationKind` --
 *     `RANGE_REQUIRED_MEMBER` now creates its OWN required candidate
 *     (CC-18/18A's `refinesSubject` silently treated every Range member
 *     as depth-only, which was wrong);
 *   - curriculum-candidate generation groups by the full
 *     `(subject, performanceType)` key from the start, so three
 *     official requirements sharing a subject under three different
 *     performance types survive as three candidates, never one;
 *   - assessment evidence is validated into an explicit, trusted
 *     `validated` stream that is the ONLY thing every downstream
 *     assessment-consuming function may read -- pattern detection and
 *     breadth-gap evidence can no longer see a rejected/unmapped item;
 *   - `normalizationBasis` is now checked for type-compatibility against
 *     the specific evidence type carrying it, not merely "is this any
 *     valid enum member";
 *   - `CurriculumEvidence.requiredCapabilityKeys` (CC-18A) is removed --
 *     capability dependencies are now an independent, provenance-bearing
 *     `CandidateCapabilityRequirement` relation with a locked
 *     `derivationKind`, and only certain kinds may auto-promote a
 *     prerequisite;
 *   - the single `factualStatement` field (subject-only technical-truth
 *     matching) is removed -- technical-truth coverage is now
 *     `claimKey`-specific via `CandidateFactRequirement` and
 *     `factualStatementsByClaimKey`, with an explicit partial/complete
 *     coverage status;
 *   - `SourceFactualClaim` carries a `comparisonKind` so two claims are
 *     only ever compared when their comparison kinds are compatible --
 *     otherwise a `FACTUAL_COMPARISON_REVIEW` is produced instead of a
 *     guessed conflict or false agreement;
 *   - `ExemplarEvidence` now carries mandatory source provenance, and a
 *     `TECHNICAL_TRUTH`-role exemplar no longer auto-grants
 *     `technicalTruthConfidence: HIGH`;
 *   - `CurriculumSubjectRelation`/`CurriculumFamily` are validated
 *     against the qualification, type-compatible provenance, and the set
 *     of subjects actually present in normalized curriculum evidence --
 *     an arbitrary relation object is never governed merely because it
 *     was supplied.
 *
 * CC-18C hardening (a third round of adversarial review) closes five
 * remaining implementation-integrity defects at the same boundary:
 *   - a normalization proposal that fails provenance validation is NEVER
 *     silently dropped -- every validating function reports it as an
 *     `EVIDENCE_NORMALIZATION_REVIEW` gap naming the exact failure,
 *     including the `OfficialCurriculumUnit` registry itself;
 *   - `CandidateCapabilityRequirement` is now bound to the active
 *     `qualificationId`, and `EXPLICIT_CURRICULUM_OPERATION`/
 *     `EXPLICIT_ASSESSMENT_OPERATION` derivations must cite a
 *     role-and-id-matched entry in the correspondingly VALIDATED
 *     curriculum/assessment stream -- an unrelated `EvidenceRef` that
 *     merely reuses the same `evidenceId` under the wrong role never
 *     satisfies the gate;
 *   - `DETERMINISTIC_OPERATIONAL_DEPENDENCY` is a deliberate, documented
 *     HOLD: it never auto-promotes a prerequisite until a governed
 *     deterministic-rule registry is separately designed and authorised
 *     (not part of this package) -- automatic promotion is currently
 *     limited to properly source-cited `EXPLICIT_CURRICULUM_OPERATION`/
 *     `EXPLICIT_ASSESSMENT_OPERATION`;
 *   - `CandidateFactRequirement.qualificationId` is now mandatory, gains
 *     a locked `derivationStatus` (`EXPLICIT_CURRICULUM_FACT` /
 *     `EXPLICIT_ASSESSMENT_FACT` / `REVIEW_PROPOSED`) mirroring the
 *     capability-requirement pattern, and its own dedicated
 *     `normalizationBasis` (`FACT_REQUIREMENT_DERIVATION`) -- a
 *     technical source establishes the ANSWER to a fact, never whether
 *     the course requires it, so `AUTHORITATIVE_TECHNICAL_FACT` is never
 *     valid here;
 *   - multiple `TECHNICAL_TRUTH` claims for the same `(subject,
 *     claimKey)` are resolved deterministically, never by array order:
 *     agreeing claims attach with every supporting evidence ref
 *     preserved; incompatible `comparisonKind`s produce
 *     `FACTUAL_COMPARISON_REVIEW`; disagreeing canonical values produce
 *     `TECHNICAL_TRUTH_CONFLICT_REVIEW` -- never an arbitrary pick, and
 *     never counted as covered;
 *   - `DEPTH_QUALIFIER` now targets an exact `(subject,
 *     performanceType)` candidate via `refinesPerformanceType` where the
 *     parent subject carries more than one performance type -- an
 *     unresolvable qualifier is never applied broadly to every candidate
 *     sharing the subject.
 */

import { z } from "zod";

// ---------------------------------------------------------------------
// 1. Evidence-role hierarchy (task section 2, CC-18). Locked by the
// Product Owner / Project Architect -- this package implements it, never
// revises it.
// ---------------------------------------------------------------------

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

/**
 * Fact-key-specific technical coverage status (CC-18B section 15;
 * corrected CC-20 section 15). The prior two-way split of "PARTIAL" vs
 * "NOT_REQUIRED" let a genuine mastery-bearing leaf with zero governing
 * requiredFactKeys render identically to a candidate that structurally
 * has no factual dimension at all -- the blind back-test showed
 * this reads as a false-green "technical knowledge is simply not
 * required" even when the true state is "nobody has established what, if
 * anything, is required yet".
 *
 *   NOT_APPLICABLE          -- limited to genuinely structural/non-factual
 *                              candidates (see KnowledgeBoundaryStatus
 *                              STRUCTURALLY_DECOMPOSED) or non-mastery-
 *                              bearing dispositions -- never a mastery-
 *                              bearing required candidate.
 *   COMPLETE                -- every current governing requiredFactKey has
 *                              exact, undisputed technical-truth coverage.
 *   PARTIAL                 -- the governing requirement set is settled and
 *                              some, but not all, of it is covered.
 *   UNRESOLVED_REQUIREMENTS -- the learner-knowledge requirements
 *                              themselves are not sufficiently established
 *                              (zero governing facts on a mastery-bearing
 *                              leaf, or governing facts remain pending
 *                              semantic adjudication) -- never rendered as
 *                              though nothing is required.
 *   CONFLICTED               -- at least one governing requiredFactKey hit
 *                              an unresolved TECHNICAL_TRUTH conflict/
 *                              incompatible comparison -- never silently
 *                              folded into PARTIAL.
 */
export const technicalCoverageStatusSchema = z.enum(["NOT_APPLICABLE", "COMPLETE", "PARTIAL", "UNRESOLVED_REQUIREMENTS", "CONFLICTED"]);
export type TechnicalCoverageStatus = z.infer<typeof technicalCoverageStatusSchema>;

/**
 * Candidate-level depth basis (CC-20 section 16) -- what actually bounds
 * this candidate's depthConfidence. QUALIFICATION_LEVEL_BOUNDED is a
 * deliberately weaker, distinguishable basis from
 * ASSESSMENT_CALIBRATED/EXPLICIT_CURRICULUM_DEPTH: qualification-level
 * evidence supplies a defensible ceiling, never the exact content, formula,
 * topology or exemplar required -- it must never be treated as though it
 * were assessment-calibrated depth.
 */
export const depthBasisSchema = z.enum(["EXPLICIT_CURRICULUM_DEPTH", "ASSESSMENT_CALIBRATED", "QUALIFICATION_LEVEL_BOUNDED", "UNRESOLVED"]);
export type DepthBasis = z.infer<typeof depthBasisSchema>;

/**
 * Candidate-level knowledge-boundary status (CC-20 section 12) -- makes
 * the boundary between "governed" and "never actually examined" explicit,
 * rather than collapsing both into an empty requiredFactKeys list.
 *
 *   STRUCTURALLY_DECOMPOSED -- a genuine parent/category candidate whose
 *                              required content is represented by governed
 *                              child candidates (detected from the
 *                              candidate-relationship graph, never a topic
 *                              string).
 *   GOVERNED                -- the current learner-knowledge boundary is
 *                              sufficiently represented by governing fact/
 *                              procedure requirements, OR was explicitly,
 *                              auditably closed at zero requirements by a
 *                              resolved SemanticAdjudication.
 *   PARTIAL                 -- some governing requirements exist but
 *                              technical-truth coverage is incomplete.
 *   ADJUDICATION_REQUIRED   -- source-derived knowledge proposals exist
 *                              (REVIEW_PROPOSED CandidateFactRequirements)
 *                              but require semantic adjudication before
 *                              they can become governing.
 *   UNRESOLVED               -- a mastery-bearing leaf candidate with no
 *                              adequate governing knowledge or
 *                              decomposition, and never examined by any
 *                              adjudication -- the false-green case CC-20
 *                              exists to close.
 */
export const knowledgeBoundaryStatusSchema = z.enum(["STRUCTURALLY_DECOMPOSED", "GOVERNED", "PARTIAL", "ADJUDICATION_REQUIRED", "UNRESOLVED"]);
export type KnowledgeBoundaryStatus = z.infer<typeof knowledgeBoundaryStatusSchema>;

// ---------------------------------------------------------------------
// 5. Gap model (task section 17 CC-18; extended CC-18A/CC-18B).
// ---------------------------------------------------------------------

export const gapTypeSchema = z.enum([
  "SCOPE_BREADTH_GAP",
  "PERFORMANCE_DEPTH_GAP",
  "TECHNICAL_TRUTH_GAP",
  "CURRICULUM_TECHNICAL_CONFLICT",
  "ASSESSMENT_GENERALISATION_REVIEW",
  "ASSESSMENT_MAPPING_REVIEW",
  "CURRICULUM_MAPPING_REVIEW",
  "EVIDENCE_NORMALIZATION_REVIEW",
  "FACTUAL_COMPARISON_REVIEW",
  /** CC-18C section 9: multiple TECHNICAL_TRUTH claims for the same (subject, claimKey) disagree among THEMSELVES -- distinct from FACTUAL_COMPARISON_REVIEW's incompatible-comparison-kind case. */
  "TECHNICAL_TRUTH_CONFLICT_REVIEW",
  /** CC-20 section 13: a required, mastery-bearing candidate has no governed child decomposition and no governing requiredFactKeys, and was never examined by any SemanticAdjudication -- the false-green case the blind back-test exposed. */
  "KNOWLEDGE_DECOMPOSITION_GAP",
  /** CC-20 section 10: an active SemanticAdjudication resolved a proposal as UNRESOLVED -- available transferable evidence cannot safely determine the disposition. */
  "SEMANTIC_ADJUDICATION_GAP",
  /** CC-20 section 11: two or more validated SemanticAdjudications disagree on the decision for the same (qualificationId, targetCandidateKey, claimKey) -- never resolved by array order; no governing promotion occurs until resolved. */
  "SEMANTIC_ADJUDICATION_CONFLICT",
]);
export type GapType = z.infer<typeof gapTypeSchema>;

/**
 * One structured gap. `legitimateResolverRoles` is plural (CC-18A) -- a
 * gap may legitimately be resolved by more than one evidence role.
 * TECHNICAL_TRUTH must never appear as a resolver for a curriculum-scope
 * or breadth question.
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
// 6. Source-normalization provenance (CC-18A section 21, CC-18B section
// 10) -- mandatory on every evidence record capable of influencing
// required scope, learner performance, depth, prerequisite status,
// category/family relationship, or factual truth. `normalizationBasis`
// must additionally be TYPE-COMPATIBLE with the specific evidence type
// carrying it (CC-18B) -- checked by each validate*/generate* function
// against its own allow-list, not accepted as "any valid enum member".
// ---------------------------------------------------------------------

export const normalizationBasisSchema = z.enum([
  "EXPLICIT_CURRICULUM_WORDING",
  "EXPLICIT_RANGE_STRUCTURE",
  "POSITIVE_ASSESSMENT_TARGET",
  "ASSESSMENT_CURRICULUM_MAPPING",
  "QUALIFICATION_LEVEL_DESCRIPTOR",
  "STRUCTURAL_PREREQUISITE_DEPENDENCY",
  "CAPABILITY_DEPENDENCY_DERIVATION",
  "AUTHORITATIVE_TECHNICAL_FACT",
  "SOURCE_FACTUAL_CLAIM",
  /** CC-18C section 7: the ONLY basis a CandidateFactRequirement may declare -- a technical source establishes the answer to a fact, never whether the course requires it, so AUTHORITATIVE_TECHNICAL_FACT is never valid here. */
  "FACT_REQUIREMENT_DERIVATION",
  /** CC-20 section 3: the ONLY basis a SemanticAdjudication may declare -- an adjudication is a governed decision over an already-existing source-derived proposal, never a new factual source in its own right. */
  "SEMANTIC_ADJUDICATION_DECISION",
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
 * `role` covers the 7 governed evidence roles; the three additional
 * string literals tag references back to DERIVED structural-relation/
 * decision records (`PrerequisiteEvidence`, `CandidateCapabilityRequirement`,
 * `SemanticAdjudication`), which are never themselves one of the 7 primary
 * evidence roles -- a SemanticAdjudication is a governed decision over
 * existing evidence, not a new source authority (CC-20 section 2).
 */
export interface EvidenceRef {
  readonly role: EvidenceRole | "STRUCTURAL_PREREQUISITE_DEPENDENCY" | "CANDIDATE_CAPABILITY_REQUIREMENT" | "SEMANTIC_ADJUDICATION";
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
  readonly exemplarOfCategory?: string;
  readonly assessmentPattern?: {
    readonly familyKey: string;
    readonly evidencedMembers: readonly string[];
  };
  /**
   * For a candidate created from a `RANGE_REQUIRED_MEMBER` curriculum
   * record -- the broader subject it is an explicit member of (CC-18B
   * section 6). Purely informational; does not gate this candidate's
   * own required disposition, which stands on its own evidence.
   */
  readonly parentSubject?: string;
  /** References to QualificationLevelEvidence attached to this candidate -- depth constraint only, never scope. */
  readonly qualificationLevelRefs?: readonly EvidenceRef[];
  readonly depthConstraintNote?: string;
  /** claimKeys this candidate structurally requires technical-truth coverage for (CC-18B section 14-17), derived from CandidateFactRequirement. */
  readonly requiredFactKeys?: readonly string[];
  /** Attached TECHNICAL_TRUTH factual statements, keyed by claimKey -- never a single subject-matched statement. */
  readonly factualStatementsByClaimKey?: Readonly<Record<string, string>>;
  readonly technicalCoverageStatus?: TechnicalCoverageStatus;
  /** CC-20 section 12: computed only for REQUIRED_* (mastery-bearing) dispositions -- undefined for prerequisite/exemplar/breadth-gap/review candidates, which are never the target of this analysis. */
  readonly knowledgeBoundaryStatus?: KnowledgeBoundaryStatus;
  /** CC-20 section 16: what actually bounds depthConfidence -- never implies qualification-level evidence reveals exact content, only a ceiling. */
  readonly depthBasis?: DepthBasis;
  /** CC-20 section 18: whether ANY validated PUBLIC_ASSESSMENT evidence resolved to this exact candidate, independent of which basis ultimately determined depthConfidence -- keeps "no assessment" visible without collapsing to total depth ignorance. */
  readonly assessmentCalibrationAvailable?: boolean;
}

// ---------------------------------------------------------------------
// 8. Official curriculum-unit registry (CC-18A section 3; CC-18B
// composite-key hardening). NOT a candidate list -- the real,
// authoritative set of AC/LO/curriculum units available for mapping.
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

/** `(qualificationId, curriculumUnitId)` composite key -- CC-18B section 3. Never key a registry by `curriculumUnitId` alone. */
export function unitRegistryKey(qualificationId: string, curriculumUnitId: string): string {
  return `${qualificationId}::${curriculumUnitId}`;
}

// ---------------------------------------------------------------------
// 9. Category breadth status (CC-18A section 19) -- declared explicitly
// by curriculum normalization, never guessed from the category's own
// English word inside production logic.
// ---------------------------------------------------------------------

export const categoryBreadthStatusSchema = z.enum(["ENUMERATED_COMPLETE", "OPEN_OR_UNDERSPECIFIED", "UNKNOWN"]);
export type CategoryBreadthStatus = z.infer<typeof categoryBreadthStatusSchema>;

// ---------------------------------------------------------------------
// 10. Curriculum normalization kind (CC-18B section 5) -- replaces the
// ambiguous `namedInPrimaryWording`/`isRangeItem` boolean pair. LOCKED
// semantics, declared explicitly by the normalization record, never
// inferred from the subject's own English word.
// ---------------------------------------------------------------------

export const curriculumNormalizationKindSchema = z.enum(["PRIMARY_REQUIREMENT", "RANGE_REQUIRED_MEMBER", "RANGE_CATEGORY", "DEPTH_QUALIFIER"]);
export type CurriculumNormalizationKind = z.infer<typeof curriculumNormalizationKindSchema>;

// ---------------------------------------------------------------------
// 11. Curriculum evidence (CC-18B rewrite).
// ---------------------------------------------------------------------

export interface CurriculumEvidence extends SourceProvenance {
  readonly role: "OFFICIAL_CURRICULUM";
  readonly evidenceId: string;
  readonly qualificationId: string;
  readonly curriculumUnitId: string;
  readonly subject: string;
  /**
   * LOCKED semantics (CC-18B section 5):
   *   PRIMARY_REQUIREMENT   -- explicit AC/LO/criterion wording; creates REQUIRED_EXPLICIT_CURRICULUM.
   *   RANGE_REQUIRED_MEMBER -- an explicit Range member; creates its OWN REQUIRED_EXPLICIT_CURRICULUM candidate AND preserves the parent relationship (`refinesSubject`, required for this kind).
   *   RANGE_CATEGORY        -- a named broad Range category; creates the category requirement; may carry `breadthStatus`.
   *   DEPTH_QUALIFIER       -- constrains/deepens an existing required subject (`refinesSubject`, required) but creates NO independent candidate.
   */
  readonly normalizationKind: CurriculumNormalizationKind;
  /** Required for RANGE_REQUIRED_MEMBER and DEPTH_QUALIFIER -- the parent subject this record relates to. Meaningless for PRIMARY_REQUIREMENT/RANGE_CATEGORY. */
  readonly refinesSubject?: string;
  /**
   * CC-18C section 11: for a DEPTH_QUALIFIER, the EXACT performance type
   * (candidate identity is `(subject, performanceType)`, never subject
   * alone) it constrains. When omitted, the qualifier resolves only if
   * `refinesSubject` has exactly one performance-type candidate of its
   * own; if the parent subject carries more than one performance type
   * and this is omitted, the qualifier cannot resolve to a single
   * intended candidate and is never applied broadly -- it is reported
   * for review instead (see rules.ts `generateCurriculumCandidates`).
   */
  readonly refinesPerformanceType?: LearnerPerformanceType;
  readonly commandVerbPerformanceType?: LearnerPerformanceType;
  /** Meaningful only for RANGE_CATEGORY records. Undeclared is treated as UNKNOWN -- never silently ENUMERATED_COMPLETE or OPEN_OR_UNDERSPECIFIED. */
  readonly breadthStatus?: CategoryBreadthStatus;
}

// ---------------------------------------------------------------------
// 12. Assessment evidence (CC-18B: validated stream separated from
// candidate generation -- see rules.ts `validateAssessmentEvidence`).
// ---------------------------------------------------------------------

export interface AssessmentEvidence extends SourceProvenance {
  readonly role: "PUBLIC_ASSESSMENT";
  readonly evidenceId: string;
  readonly assessmentSource: string;
  readonly itemId: string;
  readonly qualificationId: string;
  /** Attempted mapping to an OfficialCurriculumUnit.curriculumUnitId, resolved under (qualificationId, curriculumUnitId). Never trusted merely for being non-empty. */
  readonly mappedCurriculumUnitId: string;
  readonly questionStemRef: string;
  readonly correctAnswerTarget: string;
  readonly subject: string;
  readonly performanceType: LearnerPerformanceType;
  /** Only trusted for breadth-gap purposes when a matching, governed `CurriculumSubjectRelation` also exists. */
  readonly underCategory?: string;
  /** Only trusted for pattern purposes when a matching, governed `CurriculumFamily` also lists this item's own subject. */
  readonly familyKey?: string;
  /** Distractor-only content from the same item. NEVER read by candidate generation. */
  readonly distractorSubjects?: readonly string[];
}

// ---------------------------------------------------------------------
// 13. Governed category/family relationships (CC-18A section 6; CC-18B
// qualification + known-subject validation).
// ---------------------------------------------------------------------

export interface CurriculumSubjectRelation extends SourceProvenance {
  readonly evidenceId: string;
  readonly qualificationId: string;
  readonly subject: string;
  readonly underCategory: string;
}

export interface CurriculumFamily extends SourceProvenance {
  readonly evidenceId: string;
  readonly qualificationId: string;
  readonly familyKey: string;
  readonly memberSubjects: readonly string[];
}

// ---------------------------------------------------------------------
// 14. Qualification-level evidence -- depth constraint ONLY. Never
// generates scope; only attaches to an existing candidate it names.
// ---------------------------------------------------------------------

export interface QualificationLevelEvidence extends SourceProvenance {
  readonly role: "QUALIFICATION_LEVEL";
  readonly evidenceId: string;
  readonly qualificationId: string;
  readonly levelId: string;
  readonly depthConstraintDescriptor: string;
  readonly appliesToCandidateKey: string;
}

// ---------------------------------------------------------------------
// 15. Prerequisite (structural capability-dependency) evidence, and the
// independent capability-requirement relation it must match against
// (CC-18B sections 11-13; replaces CC-18A's self-authorising
// `necessityKind` and `CurriculumEvidence.requiredCapabilityKeys`).
// ---------------------------------------------------------------------

/**
 * A prerequisite CANDIDATE proposal: "subject/performanceType could
 * supply capabilityKey for necessaryForCandidateKey". Deliberately NOT
 * tagged with one of the 7 evidence roles -- prerequisite necessity is a
 * derived structural claim, not a primary evidence source.
 */
export interface PrerequisiteEvidence extends SourceProvenance {
  readonly kind: "STRUCTURAL_PREREQUISITE_DEPENDENCY";
  readonly evidenceId: string;
  readonly subject: string;
  readonly performanceType: LearnerPerformanceType;
  readonly capabilityKey: string;
  readonly necessaryForCandidateKey: string;
  readonly minimalDepthJustification: string;
}

/**
 * LOCKED derivation kinds (CC-18B section 11-12). Only
 * EXPLICIT_CURRICULUM_OPERATION, EXPLICIT_ASSESSMENT_OPERATION, and
 * DETERMINISTIC_OPERATIONAL_DEPENDENCY may auto-promote a matching
 * prerequisite to FOUNDATIONAL_PREREQUISITE. REVIEW_PROPOSED never does.
 */
export const capabilityDerivationKindSchema = z.enum([
  "EXPLICIT_CURRICULUM_OPERATION",
  "EXPLICIT_ASSESSMENT_OPERATION",
  "DETERMINISTIC_OPERATIONAL_DEPENDENCY",
  "REVIEW_PROPOSED",
]);
export type CapabilityDerivationKind = z.infer<typeof capabilityDerivationKindSchema>;

/**
 * An independent, provenance-bearing declaration that a REQUIRED
 * candidate structurally needs a capability -- the only thing a
 * `PrerequisiteEvidence` record can match against (CC-18B section 11).
 * This replaces `CurriculumEvidence.requiredCapabilityKeys`, which let
 * curriculum normalization self-authorise its own prerequisite gate.
 */
export interface CandidateCapabilityRequirement extends SourceProvenance {
  readonly qualificationId: string;
  readonly targetSubject: string;
  readonly targetCandidateKey: string;
  readonly capabilityKey: string;
  readonly derivationKind: CapabilityDerivationKind;
  /** The curriculum/assessment evidence that substantiates this derivation -- required when derivationKind references a specific operation. */
  readonly sourceEvidenceRefs: readonly EvidenceRef[];
}

// ---------------------------------------------------------------------
// 16. Exemplar evidence (CC-18B: now provenance-bearing; TECHNICAL_TRUTH
// role no longer auto-grants technical-truth confidence).
// ---------------------------------------------------------------------

export interface ExemplarEvidence extends SourceProvenance {
  readonly role: "TECHNICAL_TRUTH" | "PUBLIC_ASSESSMENT";
  readonly evidenceId: string;
  readonly exemplarOfCategory: string;
  readonly exemplarSubject: string;
  readonly implementationDetailSubjects?: readonly string[];
}

// ---------------------------------------------------------------------
// 17. Independent factual-claim model (CC-18A sections 12-15; CC-18B
// adds `comparisonKind` and claim-key-specific candidate requirements).
// ---------------------------------------------------------------------

/** Prevents comparing incommensurate values (CC-18B section 18) -- two claims are only ever compared when their comparisonKind matches. */
export const factualComparisonKindSchema = z.enum(["BOOLEAN", "ENUM", "NUMBER_WITH_UNIT", "CANONICAL_TEXT"]);
export type FactualComparisonKind = z.infer<typeof factualComparisonKindSchema>;

export interface SourceFactualClaim extends SourceProvenance {
  /** Canonical factual-dimension identity -- two claims about the "same fact" share this key regardless of source. */
  readonly claimKey: string;
  readonly subject: string;
  /** Typically OFFICIAL_CURRICULUM, TECHNICAL_TRUTH, or (diagnostic-only comparison, never standard mode) OPTIONAL_CALIBRATION. */
  readonly sourceRole: EvidenceRole;
  readonly evidenceId: string;
  /** A CANONICAL comparison value, not arbitrary prose -- comparability is declared by `comparisonKind`, never inferred. */
  readonly normalizedClaimValue: string;
  readonly comparisonKind: FactualComparisonKind;
  readonly originalWordingRef?: string;
}

/**
 * LOCKED derivation statuses (CC-18C section 8) -- what actually
 * authorises a `CandidateFactRequirement` to contribute a
 * `requiredFactKey`. This prevents a future normalization adapter from
 * hand-authoring the expected factual syllabus and making technical
 * coverage look complete: only a requirement citing REAL, validated
 * primary-source evidence (curriculum wording or an assessment item)
 * ever counts.
 *
 *   EXPLICIT_CURRICULUM_FACT -- must cite validated OFFICIAL_CURRICULUM evidence.
 *   EXPLICIT_ASSESSMENT_FACT -- must cite validated PUBLIC_ASSESSMENT evidence.
 *   REVIEW_PROPOSED          -- exported for Project-Architect review; MUST NOT
 *                                contribute to requiredFactKeys or coverage automatically.
 */
export const factRequirementDerivationStatusSchema = z.enum(["EXPLICIT_CURRICULUM_FACT", "EXPLICIT_ASSESSMENT_FACT", "REVIEW_PROPOSED"]);
export type FactRequirementDerivationStatus = z.infer<typeof factRequirementDerivationStatusSchema>;

/**
 * Declares that a candidate structurally requires technical-truth
 * coverage for a specific `claimKey` (CC-18B section 14). A candidate
 * with zero such requirements never claims HIGH technical-truth
 * confidence merely because some source discusses the same subject.
 *
 * CC-18C section 7: `qualificationId` is now MANDATORY (a fact
 * requirement controls which facts count toward technical coverage, so
 * it cannot be treated as a trusted, qualification-unbound free-form
 * list), and `normalizationBasis` must be `FACT_REQUIREMENT_DERIVATION`
 * specifically -- never `AUTHORITATIVE_TECHNICAL_FACT`, since a
 * technical source establishes the ANSWER to a fact, never WHETHER the
 * course requires it.
 */
export interface CandidateFactRequirement extends SourceProvenance {
  readonly qualificationId: string;
  readonly targetCandidateKey: string;
  readonly claimKey: string;
  readonly derivationStatus: FactRequirementDerivationStatus;
  /** The curriculum/assessment evidence substantiating derivationStatus -- required for EXPLICIT_CURRICULUM_FACT/EXPLICIT_ASSESSMENT_FACT to count. */
  readonly sourceEvidenceRefs: readonly EvidenceRef[];
}

// ---------------------------------------------------------------------
// 17A. Semantic adjudication (CC-20). The blind back-test
// established that source normalization alone cannot safely decide
// whether a technically valid, non-literal knowledge proposal belongs in
// required mastery -- automatically accepting every such proposal
// overteaches; automatically rejecting every one is too conservative and
// leaves legitimate learner knowledge unresolved. Semantic adjudication is
// therefore an explicit, auditable, governed DECISION stage over an
// ALREADY-EXISTING CandidateFactRequirement proposal -- it is never a new
// factual source, and it can never introduce a new curriculum candidate,
// claimKey, subject, or performance (see rules.ts's own validation gate).
// ---------------------------------------------------------------------

/**
 * LOCKED semantic-adjudication decisions (CC-20 section 4).
 *
 *   REQUIRED_CORE          -- necessary learner knowledge to satisfy the
 *                             qualification performance.
 *   REQUIRED_OPERATIONAL   -- operational/procedural knowledge inseparable
 *                             from correctly performing the stated
 *                             requirement.
 *   REPRESENTATIVE_EXEMPLAR -- a technically valid exemplar is required to
 *                             teach/instantiate a broad application, but
 *                             that exact exemplar is NOT itself uniquely
 *                             mandated qualification mastery -- never
 *                             enters requiredFactKeys (section 9).
 *   CONTEXT_ONLY            -- pedagogically useful but not learner mastery.
 *   REJECT_OVERDEPTH        -- technically true but deeper/more formal than
 *                             the qualification evidence justifies.
 *   REJECT_NOT_NECESSARY    -- technically true or related, but not
 *                             necessary to satisfy the qualification
 *                             performance.
 *   UNRESOLVED              -- available transferable evidence cannot
 *                             safely determine the disposition; emits
 *                             SEMANTIC_ADJUDICATION_GAP.
 *
 * Only REQUIRED_CORE and REQUIRED_OPERATIONAL may promote a REVIEW_PROPOSED
 * CandidateFactRequirement into a governing requiredFactKey (section 8).
 * Every other decision remains non-governing but is preserved verbatim in
 * `StandardPipelineResult.semanticAdjudicationOutcomes` so a technically
 * valid fact considered and deliberately excluded is never silently lost
 * (section 10).
 */
export const semanticAdjudicationDecisionSchema = z.enum([
  "REQUIRED_CORE",
  "REQUIRED_OPERATIONAL",
  "REPRESENTATIVE_EXEMPLAR",
  "CONTEXT_ONLY",
  "REJECT_OVERDEPTH",
  "REJECT_NOT_NECESSARY",
  "UNRESOLVED",
]);
export type SemanticAdjudicationDecision = z.infer<typeof semanticAdjudicationDecisionSchema>;

/** The only two decisions capable of promoting a REVIEW_PROPOSED fact requirement into a governing requiredFactKey (CC-20 section 8). */
export const GOVERNING_ADJUDICATION_DECISIONS: readonly SemanticAdjudicationDecision[] = ["REQUIRED_CORE", "REQUIRED_OPERATIONAL"];

/** Governed decision REASONS (CC-20 section 5) -- never evidence authorities in their own right. Multiple bases may apply to one adjudication. */
export const semanticAdjudicationBasisSchema = z.enum([
  "SEMANTIC_NECESSITY",
  "OPERATIONAL_NECESSITY",
  "COMMAND_VERB_AND_LEVEL",
  "PUBLIC_ASSESSMENT_CALIBRATION",
  "MULTIPLE_VALID_IMPLEMENTATIONS",
  "REPRESENTATIVE_EXEMPLAR_SELECTION",
  "OVERDEPTH_FORMALISM",
  "INSUFFICIENT_EVIDENCE",
]);
export type SemanticAdjudicationBasis = z.infer<typeof semanticAdjudicationBasisSchema>;

/**
 * Who/what performed the adjudication (CC-20 section 6). All three kinds
 * pass through the SAME mechanical validation -- an adjudicatorKind of
 * LLM_EVIDENCE_BOUND is never automatically trusted merely because of its
 * label; the required rationale/evidence fields exist so the decision can
 * be audited regardless of who made it.
 */
export const adjudicatorKindSchema = z.enum(["HUMAN_PROJECT_ARCHITECT", "LLM_EVIDENCE_BOUND", "RULE_ENGINE"]);
export type AdjudicatorKind = z.infer<typeof adjudicatorKindSchema>;

/**
 * A governed decision over an EXISTING CandidateFactRequirement proposal
 * (`targetCandidateKey` + `claimKey` must resolve to a real, already-
 * proposed fact requirement -- see rules.ts `validateSemanticAdjudications`).
 * May never introduce a new curriculum candidate, claimKey, subject, or
 * performance of its own.
 */
export interface SemanticAdjudication extends SourceProvenance {
  readonly qualificationId: string;
  readonly targetCandidateKey: string;
  readonly claimKey: string;
  readonly decision: SemanticAdjudicationDecision;
  readonly adjudicationBasis: readonly SemanticAdjudicationBasis[];
  readonly adjudicatorKind: AdjudicatorKind;
  /** Opaque pointer to the decision record/session this adjudication came from (e.g. a review ticket id or model-call id) -- audit trail, never interpreted by production logic. */
  readonly decisionRef: string;
  readonly rationale: string;
  /** Evidence this decision was actually bound to -- required so an adjudication can be audited, never accepted on rationale prose alone. */
  readonly supportingEvidenceRefs: readonly EvidenceRef[];
}

/**
 * CC-20 section 9: a REPRESENTATIVE_EXEMPLAR adjudication outcome, exposed
 * separately from requiredFactKeys/mastery so downstream course
 * construction can make a broad application teachable without ever
 * treating the chosen exemplar as uniquely mandated qualification mastery.
 */
export interface RepresentativeExemplarRecord {
  readonly candidateKey: string;
  readonly claimKey: string;
  readonly decisionRef: string;
  readonly adjudicatorKind: AdjudicatorKind;
  readonly rationale: string;
}

// ---------------------------------------------------------------------
// 18. Optional-calibration / legacy-diagnostic evidence. Never capable
// of influencing required scope -- no mandatory provenance burden
// imposed here since neither type is ever a standard-pipeline input.
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
// 19. Diagnostic comparison -- the ONLY thing optional-calibration/
// legacy-diagnostic evidence may ever produce: a read-only report, never
// a mutation and never a new required candidate.
// ---------------------------------------------------------------------

export interface DiagnosticComparisonEntry {
  readonly subject: string;
  readonly diagnosticRole: "OPTIONAL_CALIBRATION" | "LEGACY_DIAGNOSTIC";
  readonly claim: string;
  readonly matchesExistingCandidate: boolean;
  readonly matchingCandidateKeys: readonly string[];
}

// ---------------------------------------------------------------------
// 20. Standard-pipeline result.
// ---------------------------------------------------------------------

export interface StandardPipelineResult {
  readonly candidates: readonly KnowledgeCandidate[];
  readonly gaps: readonly GapRecord[];
  /** TECHNICAL_TRUTH-sourced factual claims that matched no candidate's requiredFactKeys -- recorded for transparency, never converted into scope. */
  readonly unmatchedTechnicalTruth: readonly SourceFactualClaim[];
  /** QualificationLevelEvidence that named no existing candidate -- recorded for transparency, never converted into scope. */
  readonly unmatchedQualificationLevel: readonly QualificationLevelEvidence[];
  /**
   * CC-20 section 10: complete, non-lossy audit trail of every ACTIVE
   * (validated, non-conflicted) SemanticAdjudication that influenced this
   * run, regardless of decision -- REQUIRED_CORE/REQUIRED_OPERATIONAL
   * alongside REPRESENTATIVE_EXEMPLAR/CONTEXT_ONLY/REJECT_OVERDEPTH/
   * REJECT_NOT_NECESSARY/UNRESOLVED. A technically valid fact considered
   * and deliberately excluded is recorded here, never silently lost.
   */
  readonly semanticAdjudicationOutcomes: readonly SemanticAdjudication[];
  /** CC-20 section 9: REPRESENTATIVE_EXEMPLAR adjudications only, in the shape downstream course construction needs -- never present in any candidate's requiredFactKeys, never increases scope/depth confidence. */
  readonly representativeExemplars: readonly RepresentativeExemplarRecord[];
}
