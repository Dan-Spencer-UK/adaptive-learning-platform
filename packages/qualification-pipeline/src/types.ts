/**
 * CC-18: generic qualification knowledge-construction pipeline -- types.
 *
 * This package is deliberately independent of any specific qualification.
 * Nothing here may name a real subject, AC number, Range item, or
 * qualification. Concrete subjects/topics are opaque strings supplied by
 * evidence records at call time; production logic in ./rules.ts must never
 * branch on their content. Subject-specific values belong only in test
 * fixtures (./rules.test.ts) and, later, in a qualification-specific data
 * package that constructs `Evidence*` records and calls these functions --
 * never in this package.
 *
 * ARCHITECTURE DOCUMENT: docs/architecture/qualification-knowledge-
 * construction-pipeline.md is the governing design document this package
 * implements. Read it first -- this file is the operational encoding of
 * that document's source-role hierarchy, disposition model, confidence
 * model and gap/conflict model, not an independent design.
 *
 * PIPELINE ORDER (task section 24, enforced structurally by which
 * functions accept which evidence roles -- see rules.ts):
 *
 *   raw qualification evidence
 *   -> normalized evidence roles                    (this file's types)
 *   -> learner-performance / knowledge candidates    (rules.ts generate*)
 *   -> evidence/confidence/gap analysis              (rules.ts attach-/detect-prefixed helpers, buildStandardPipeline)
 *   -> [STOP -- Project-Architect curriculum decision -- outside this package]
 *   -> governed course matrix / knowledge boundary
 *   -> reusable domain knowledge assertions
 *   -> course mappings
 *   -> canonical lesson/storyboard design
 *
 * This package produces candidates and gaps only. It never decides
 * curriculum scope, never writes a governed matrix, knowledge obligation,
 * assertion, or lesson, and never ingests OPTIONAL_CALIBRATION material as
 * a required-knowledge source in its standard mode (task section 18).
 */

import { z } from "zod";

// ---------------------------------------------------------------------
// 1. Evidence-role hierarchy (task section 2). Locked by the Product
// Owner / Project Architect -- this package implements it, never revises
// it.
// ---------------------------------------------------------------------

/**
 * - OFFICIAL_CURRICULUM: curriculum SCOPE authority.
 * - PUBLIC_ASSESSMENT: learner-performance discovery + depth/performance calibration.
 * - QUALIFICATION_LEVEL: depth constraint (level, command verbs, equivalent governed descriptors).
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

/** Evidence roles the STANDARD pipeline may consult to justify a required candidate (task section 18/19). */
export const STANDARD_MODE_CANDIDATE_ROLES: readonly EvidenceRole[] = [
  "OFFICIAL_CURRICULUM",
  "PUBLIC_ASSESSMENT",
  "QUALIFICATION_LEVEL",
  "TECHNICAL_TRUTH",
];

/** Evidence roles the standard pipeline must never use to justify a required candidate. */
export const DIAGNOSTIC_ONLY_ROLES: readonly EvidenceRole[] = ["OPTIONAL_CALIBRATION", "LEGACY_DIAGNOSTIC", "MODEL_KNOWLEDGE"];

// ---------------------------------------------------------------------
// 2. Learner-performance type (task section 10) -- first-class, never
// collapsed into a bare "knows topic X" proposition.
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
// 3. Candidate disposition (task section 9) -- deterministic pipeline
// outcomes, never a discretionary Project-Architect scope decision.
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

/** Dispositions that count as "required" (mastery) scope, as opposed to exemplar/context/gap/review outcomes. */
export const REQUIRED_DISPOSITIONS: readonly CandidateDisposition[] = ["REQUIRED_EXPLICIT_CURRICULUM", "REQUIRED_ASSESSMENT_EVIDENCED"];

// ---------------------------------------------------------------------
// 4. Confidence model (task section 16) -- scope, depth and technical-
// truth confidence are kept separate, never collapsed into one score.
// ---------------------------------------------------------------------

export const confidenceLevelSchema = z.enum(["HIGH", "MEDIUM", "LOW", "NONE"]);
export type ConfidenceLevel = z.infer<typeof confidenceLevelSchema>;

export interface ConfidenceProfile {
  readonly scopeConfidence: ConfidenceLevel;
  readonly depthConfidence: ConfidenceLevel;
  readonly technicalTruthConfidence: ConfidenceLevel;
}

// ---------------------------------------------------------------------
// 5. Gap / conflict model (task section 17).
// ---------------------------------------------------------------------

export const gapTypeSchema = z.enum([
  "SCOPE_BREADTH_GAP",
  "PERFORMANCE_DEPTH_GAP",
  "TECHNICAL_TRUTH_GAP",
  "CURRICULUM_TECHNICAL_CONFLICT",
  "ASSESSMENT_GENERALISATION_REVIEW",
]);
export type GapType = z.infer<typeof gapTypeSchema>;

/** One structured gap: what is unresolved, what evidence exists already, and which evidence ROLE could legitimately resolve it. */
export interface GapRecord {
  readonly gapType: GapType;
  readonly candidateKey: string;
  readonly evidenceAvailable: readonly string[];
  readonly unresolved: string;
  /** The evidence role that could legitimately resolve this gap -- e.g. a technical-truth gap can only be resolved by TECHNICAL_TRUTH evidence, never by re-reading curriculum wording. */
  readonly legitimateResolverRole: EvidenceRole;
  readonly notes?: string;
}

// ---------------------------------------------------------------------
// 6. Candidate identity. Keyed by (subject, performanceType) so that,
// per task section 10, a single subject can carry MULTIPLE distinct
// performance requirements (e.g. STATE an operating principle vs.
// SCHEMATIC_RECOGNITION of its symbol) without collapsing into one
// generic "knows topic X" proposition.
// ---------------------------------------------------------------------

export function candidateKey(subject: string, performanceType: LearnerPerformanceType): string {
  return `${subject}::${performanceType}`;
}

export interface EvidenceRef {
  readonly role: EvidenceRole;
  readonly evidenceId: string;
}

/** The pipeline's own output unit -- never a final curriculum decision (task section 9's own closing note). */
export interface KnowledgeCandidate {
  readonly candidateKey: string;
  readonly subject: string;
  readonly performanceType: LearnerPerformanceType;
  readonly disposition: CandidateDisposition;
  readonly confidence: ConfidenceProfile;
  /** Non-empty for every candidate -- why the pipeline produced this disposition. */
  readonly rationale: string;
  readonly evidenceRefs: readonly EvidenceRef[];
  /** The technical-truth-sourced factual statement for this subject, if any TechnicalTruthEvidence attached (task section 13 -- never the curriculum's own wording when they conflict). */
  readonly factualStatement?: string;
  /** For a REPRESENTATIVE_EXEMPLAR candidate, the broader required category it illustrates. */
  readonly exemplarOfCategory?: string;
  /** For an ASSESSMENT_PATTERN_CANDIDATE (task section 11): the family this pattern spans and the distinct members it was observed on. */
  readonly assessmentPattern?: {
    readonly familyKey: string;
    readonly evidencedMembers: readonly string[];
  };
}

// ---------------------------------------------------------------------
// 7. Evidence record types -- one per evidence role that can generate or
// attach to a candidate. Each is a plain, generic, JSON-serialisable
// record; the `subject` (and every other string field) is an opaque
// label supplied by the caller, never interpreted by production logic.
// ---------------------------------------------------------------------

/**
 * Curriculum evidence (task section 5/6): a subject named either
 * directly in an AC/LO's own primary wording, or by a Range item.
 *
 * A Range item that `refines` another subject supplements that subject's
 * DEPTH but never gates whether a separately AC-named subject counts as
 * scope -- AC primary wording and standalone Range items are independent
 * sources of top-level required scope (task section 5's own regression
 * case, proved generically in rules.test.ts).
 *
 * A Range item with no `refines` stands as its own top-level category
 * subject -- task section 6: that establishes the CATEGORY only, never
 * any internal implementation detail of it.
 */
export interface CurriculumEvidence {
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
   * False (the honest default for a bare, un-enumerated Range label) unless
   * this evidence record's own subject's internal breadth is genuinely
   * fully enumerated by curriculum evidence (e.g. every sub-item has its
   * own Range row). Drives SCOPE_BREADTH_GAP / OPEN_SCOPE_GAP production
   * (task section 7) -- never inferred, always declared by the evidence.
   */
  readonly breadthFullyEnumerated?: boolean;
}

/**
 * Assessment evidence (task section 3/4): the POSITIVE target only --
 * the performance actually required by the item and its established
 * correct answer. `distractorSubjects` is captured for provenance and
 * adversarial testing but MUST NEVER be read by candidate generation.
 */
export interface AssessmentEvidence {
  readonly role: "PUBLIC_ASSESSMENT";
  readonly evidenceId: string;
  /** Source assessment identifier (paper/series). */
  readonly assessmentSource: string;
  /** Item/question identifier within that source. */
  readonly itemId: string;
  /** LO/AC (or equivalent) this item is mapped to. Required non-empty -- an item with no valid qualification mapping is not legitimate evidence (task section 9's own REQUIRED_ASSESSMENT_EVIDENCED definition). */
  readonly mappedCurriculumUnitId: string;
  /** The question stem or target-concept reference, kept for provenance. */
  readonly questionStemRef: string;
  /** Exactly what the established correct answer requires -- the positive target. */
  readonly correctAnswerTarget: string;
  readonly subject: string;
  readonly performanceType: LearnerPerformanceType;
  /**
   * The broader, standalone curriculum-category subject this item is a
   * narrower sub-case of, if any (task section 7) -- drives
   * SCOPE_BREADTH_GAP detection for under-specified curriculum labels
   * (e.g. an item whose subject is "category-mean" with
   * `underCategory: "category"`). Omit when this item's own subject IS
   * the top-level category, or is unrelated to any broad label.
   */
  readonly underCategory?: string;
  /**
   * Distractor-only content from the same item. NEVER read by candidate
   * generation (task section 4) -- present only so adversarial tests can
   * prove that.
   */
  readonly distractorSubjects?: readonly string[];
  /**
   * Optional family-grouping key for pattern-generalisation detection
   * (task section 11) -- e.g. every schematic-symbol-recognition item
   * across one Range's component family shares a familyKey.
   */
  readonly familyKey?: string;
}

/** Technical-truth evidence (task section 13/14): factual authority only, never scope authority. */
export interface TechnicalTruthEvidence {
  readonly role: "TECHNICAL_TRUTH";
  readonly evidenceId: string;
  readonly subject: string;
  readonly correctStatement: string;
  /**
   * What the curriculum/provider material claims for the SAME subject,
   * where it genuinely diverges from `correctStatement`. Presence of
   * this field is what triggers a CURRICULUM_TECHNICAL_CONFLICT record
   * -- the pipeline never silently reconciles the two.
   */
  readonly conflictingCurriculumStatement?: string;
}

/**
 * Prerequisite necessity evidence (task section 8). `necessityKind`
 * structurally gates whether this can ever become FOUNDATIONAL_PREREQUISITE:
 * only OPERATIONALLY_NECESSARY_FOR_STATED_PROCEDURE can. A generic
 * "useful background" claim is mechanically capped at
 * CONTEXTUAL_TEACHING_SUPPORT regardless of how the justification prose
 * reads -- this is what prevents the rule becoming a scope-creep loophole.
 */
export const prerequisiteNecessityKindSchema = z.enum(["OPERATIONALLY_NECESSARY_FOR_STATED_PROCEDURE", "BACKGROUND_OR_CONTEXTUAL"]);
export type PrerequisiteNecessityKind = z.infer<typeof prerequisiteNecessityKindSchema>;

export interface PrerequisiteEvidence {
  readonly role: "QUALIFICATION_LEVEL";
  readonly evidenceId: string;
  readonly subject: string;
  readonly performanceType: LearnerPerformanceType;
  /** The subject::performanceType candidate this is claimed necessary for -- must reference an existing required candidate. */
  readonly necessaryForCandidateKey: string;
  readonly necessityKind: PrerequisiteNecessityKind;
  /** Required, non-empty -- the minimal-depth justification, preserved verbatim, never expanded by the pipeline. */
  readonly minimalDepthJustification: string;
}

/**
 * Exemplar evidence (task section 12): a technically valid worked example
 * used to TEACH an already-required broad category, kept structurally
 * distinct from mastery. `implementationDetailSubjects` is recorded for
 * transparency only -- the pipeline never promotes any of them to their
 * own required candidate.
 */
export interface ExemplarEvidence {
  readonly role: "TECHNICAL_TRUTH" | "PUBLIC_ASSESSMENT" | "OPTIONAL_CALIBRATION";
  readonly evidenceId: string;
  /** The required category subject this exemplar illustrates. */
  readonly exemplarOfCategory: string;
  /** The specific implementation/example subject. */
  readonly exemplarSubject: string;
  readonly implementationDetailSubjects?: readonly string[];
}

/** Optional-calibration evidence (task section 18): recorded, never a standard-mode candidate source. */
export interface OptionalCalibrationEvidence {
  readonly role: "OPTIONAL_CALIBRATION";
  readonly evidenceId: string;
  readonly subject: string;
  readonly claim: string;
}

/** Legacy-diagnostic evidence (task section 19): recorded, never a standard-mode candidate source. */
export interface LegacyDiagnosticEvidence {
  readonly role: "LEGACY_DIAGNOSTIC";
  readonly evidenceId: string;
  readonly subject: string;
  readonly claim: string;
}

export type AnyEvidence =
  | CurriculumEvidence
  | AssessmentEvidence
  | TechnicalTruthEvidence
  | PrerequisiteEvidence
  | ExemplarEvidence
  | OptionalCalibrationEvidence
  | LegacyDiagnosticEvidence;

// ---------------------------------------------------------------------
// 8. Diagnostic comparison (task section 18) -- the ONLY thing optional-
// calibration/legacy-diagnostic evidence may ever produce: a read-only
// report comparing it against already-generated standard-mode candidates,
// never a mutation of those candidates and never a new one.
// ---------------------------------------------------------------------

export interface DiagnosticComparisonEntry {
  readonly subject: string;
  readonly diagnosticRole: "OPTIONAL_CALIBRATION" | "LEGACY_DIAGNOSTIC";
  readonly claim: string;
  /** Whether a standard-mode candidate already exists for this exact subject. */
  readonly matchesExistingCandidate: boolean;
  readonly matchingCandidateKeys: readonly string[];
}

// ---------------------------------------------------------------------
// 9. Standard-pipeline result -- candidates, gaps, and diagnostic-only
// comparison, kept in clearly separate buckets so nothing diagnostic can
// be mistaken for a required outcome.
// ---------------------------------------------------------------------

export interface StandardPipelineResult {
  readonly candidates: readonly KnowledgeCandidate[];
  readonly gaps: readonly GapRecord[];
  /** Technical-truth evidence that matched no existing candidate -- recorded for transparency, never converted into scope (task section 14). */
  readonly unmatchedTechnicalTruth: readonly TechnicalTruthEvidence[];
}
