/**
 * CC-23: generic knowledge-target -> technical-evidence-requirement planning
 * architecture.
 *
 * This package is the pipeline stage that sits immediately after
 * `@alp/qualification-pipeline` produces an APPROVED learner-knowledge
 * boundary (`KnowledgeCandidate` + `KnowledgeBoundaryCertification`,
 * `decision: "COMPLETE"`) and immediately before technical-evidence
 * ACQUISITION (source discovery, retrieval, factual verification -- not
 * implemented here, see §14 below).
 *
 * ARCHITECTURE DOCUMENT: docs/architecture/qualification-knowledge-
 * construction-pipeline.md §25 is the governing design this package
 * implements. Read it first.
 *
 * Independence (mirrors @alp/qualification-pipeline's own contract): this
 * package has zero dependency on any other workspace package and contains
 * no qualification-specific content or branching. Nothing here may name a
 * real subject, AC number, Range item, awarding organisation, or
 * qualification -- concrete subjects/topics are opaque strings supplied by
 * a `KnowledgeTarget` at call time, always produced by a qualification-
 * specific ADAPTER outside this package, never by this package itself.
 *
 * LOCKED SEPARATION OF AUTHORITIES (task CC-23 §4):
 *   QUALIFICATION EVIDENCE answers "What must the learner know/do?"
 *     -- that is `@alp/qualification-pipeline`'s job, already finished by
 *     the time a `KnowledgeTarget` reaches this package.
 *   TECHNICAL EVIDENCE answers "Is the technical/factual content correct?"
 *     -- that is the future acquisition engine's job (§14).
 *   EVIDENCE-REQUIREMENT PLANNING (this package) answers "What factual/
 *     procedural/source evidence must exist to support this ALREADY-
 *     APPROVED learner knowledge?" -- it can decompose, deduplicate, and
 *     describe a sourcing obligation, but it can never widen, deepen, or
 *     invent qualification scope: every `EvidenceRequirement` this package
 *     produces traces back to at least one `sourceKnowledgeTargetId` that
 *     was handed to it, never a proposition this package invented.
 */

import { z } from "zod";

// ---------------------------------------------------------------------
// 1. Knowledge-target classification (task §5/§6) -- the same locked
// four-class model used upstream by the qualification-specific PA
// reconciliation layer, re-declared here generically because this
// package must be able to consume it without depending on any
// qualification-specific package.
// ---------------------------------------------------------------------

export const knowledgeTargetClassificationSchema = z.enum([
  "REQUIRED_QUALIFICATION_KNOWLEDGE",
  "FOUNDATIONAL_PREREQUISITE",
  "CONTEXTUAL_TEACHING_SUPPORT",
  "OUT_OF_SCOPE",
]);
export type KnowledgeTargetClassification = z.infer<typeof knowledgeTargetClassificationSchema>;

// ---------------------------------------------------------------------
// 2. Knowledge-target semantic kind (task §2) -- generic semantic types,
// never a subject-specific branch. `BREADTH_TOPIC_COVERAGE` is itself one
// of the locked kinds, not a derived flag -- a qualification-specific
// adapter declares it explicitly when a target is a broad topic/procedure
// rather than an atomic proposition (task §8.D).
// ---------------------------------------------------------------------

export const knowledgeTargetKindSchema = z.enum([
  "CONCEPT_DEFINITION",
  "FACTUAL_PROPOSITION",
  "FORMULA_OR_RULE",
  "RELATIONSHIP",
  "PROCEDURE",
  "SYMBOL_OR_CONVENTION",
  "OPERATIONAL_USE_RULE",
  "OPERATING_PRINCIPLE",
  "RECOGNITION_REQUIREMENT",
  "APPLICATION_FUNCTION",
  "BREADTH_TOPIC_COVERAGE",
]);
export type KnowledgeTargetKind = z.infer<typeof knowledgeTargetKindSchema>;

// ---------------------------------------------------------------------
// 3. Coverage dimensions (task §9) -- reusable, extensible; not a closed
// electrical-only ontology. A qualification-specific adapter declares
// which dimensions a compound target actually needs (§8.B) -- this
// package never guesses dimensions from the target's own English text.
// ---------------------------------------------------------------------

export const coverageDimensionSchema = z.enum([
  "DEFINITION",
  "QUANTITY_SYMBOL",
  "UNIT_NAME",
  "UNIT_SYMBOL",
  "DISTINCTION",
  "FORMULA",
  "FORMULA_INTERPRETATION",
  "PROCEDURE",
  "CONNECTION_TOPOLOGY",
  "SAFE_USE",
  "CAUSAL_MECHANISM",
  "OPERATING_PRINCIPLE",
  "SCHEMATIC_SYMBOL",
  "APPLICATION_FUNCTION",
  "CALCULATION_METHOD",
  "RECOGNITION",
  "CONCEPTUAL_RELATIONSHIP",
]);
export type CoverageDimension = z.infer<typeof coverageDimensionSchema>;

// ---------------------------------------------------------------------
// 4. Knowledge target (task §5) -- learner-facing semantic knowledge/
// performance. NOT 1:1 with EvidenceRequirement (§6). Every field here is
// either structurally generic or an opaque string the adapter supplies;
// this package's own logic (planner.ts) never branches on the CONTENT of
// `targetText`, only on the declared structural fields below.
// ---------------------------------------------------------------------

export interface KnowledgeTarget {
  /** Globally unique across every call site that may ever be merged together (e.g. "qual-a::PA-014", "synthetic-domain-b::T-3") -- opaque to this package. */
  readonly knowledgeTargetId: string;
  readonly targetText: string;
  readonly kind: KnowledgeTargetKind;
  readonly classification: KnowledgeTargetClassification;
  /**
   * Compound-decomposition hint (task §8.B) -- only meaningful for
   * `CONCEPT_DEFINITION` targets. When populated with more than one
   * dimension, the planner emits one `EvidenceRequirement` per requested
   * dimension (a genuine compound target). When absent (or a bare single
   * dimension) on a `CONCEPT_DEFINITION` target, the planner cannot
   * safely tell atomic from compound and abstains
   * (`SEMANTIC_DECOMPOSITION_REQUIRED`, task §8.G) rather than guessing.
   */
  readonly expectedCoverageDimensions?: readonly CoverageDimension[];
  /**
   * Integration-target signal (task §8.E) -- true only for a `RELATIONSHIP`
   * target whose truth is jointly established by several already-
   * sourceable constituent facts (e.g. "force, work, energy, power and
   * efficiency are related" once force/work/energy/power/efficiency are
   * each independently sourced). Requires `constituentKnowledgeTargetIds`
   * to resolve; otherwise the planner abstains (§8.G).
   */
  readonly requiresMultipleIndependentClaims?: boolean;
  /** `knowledgeTargetId`s of the already-sourceable constituent targets an integration target (above) can be satisfied by, instead of manufacturing a redundant combined source proposition. */
  readonly constituentKnowledgeTargetIds?: readonly string[];
  /**
   * Structural/parent-target signal (task §8.F) -- `knowledgeTargetId`s of
   * governed child targets whose own evidence requirements already
   * exhaust this target's technical evidence need. A structural target
   * with populated children emits zero evidence requirements of its own.
   */
  readonly childKnowledgeTargetIds?: readonly string[];
  /** True only when this exact target was selected as a representative exemplar of a broader application (task §18 "representative exemplars remain semantically distinct" -- never merged away by dedup logic that would erase the distinction). */
  readonly isRepresentativeExemplar?: boolean;
  /** Opaque, adapter-supplied descriptor of the calibrated learner performance this target supports (e.g. a depth/assessment calibration note) -- carried through verbatim, never interpreted. */
  readonly calibratedSupportingPerformance?: string;
}

// ---------------------------------------------------------------------
// 5. Requirement mode (task §6) -- LOCKED enum. Every acceptance rule
// (§12/acceptance.ts) is keyed on this, never on requirement free text.
// ---------------------------------------------------------------------

export const requirementModeSchema = z.enum([
  "EXACT_FACT",
  "CONCEPT_DEFINITION",
  "RELATIONSHIP",
  "FORMULA_OR_RULE",
  "PROCEDURE_COVERAGE",
  "SYMBOL_OR_CONVENTION",
  "OPERATING_PRINCIPLE",
  "OPERATIONAL_USE_RULE",
  "SCHEMATIC_OR_DIAGRAM_RECOGNITION",
  "APPLICATION_FUNCTION",
  "TOPIC_BREADTH_COVERAGE",
]);
export type RequirementMode = z.infer<typeof requirementModeSchema>;

// ---------------------------------------------------------------------
// 6. Source-authority classes (task §11) -- generic, requirement-
// dependent authority model. No real institution/standards body is
// hard-coded anywhere in this package; those are later-discovered
// INSTANCES of these classes, supplied by the acquisition engine (§14),
// never by this package.
// ---------------------------------------------------------------------

export const sourceAuthorityClassSchema = z.enum([
  "PRIMARY_STANDARDS_OR_METROLOGY_AUTHORITY",
  "GOVERNMENT_OR_REGULATOR",
  "UNIVERSITY_OR_OPEN_ACADEMIC_TEXT",
  "PROFESSIONAL_ENGINEERING_INSTITUTION",
  "ORIGINAL_COMPONENT_MANUFACTURER",
  "AUTHORITATIVE_TECHNICAL_MANUAL",
  "AUTHORITATIVE_MATHEMATICS_REFERENCE",
]);
export type SourceAuthorityClass = z.infer<typeof sourceAuthorityClassSchema>;

/** Requirement-dependent authority policy (task §11/§12) -- which authority classes are acceptable for each requirement mode. A caller MAY supply its own; `DEFAULT_SOURCE_AUTHORITY_POLICY` (planner.ts) is a generic, reusable default, never a qualification-specific one. */
export interface SourceAuthorityPolicy {
  readonly allowedAuthorityClassesByMode: Readonly<Partial<Record<RequirementMode, readonly SourceAuthorityClass[]>>>;
}

// ---------------------------------------------------------------------
// 7. Acquisition priority / decomposition status (task §6).
// ---------------------------------------------------------------------

export const acquisitionPrioritySchema = z.enum(["REQUIRED", "OPTIONAL_CONTEXT"]);
export type AcquisitionPriority = z.infer<typeof acquisitionPrioritySchema>;

export const decompositionStatusSchema = z.enum(["READY", "SEMANTIC_DECOMPOSITION_REQUIRED"]);
export type DecompositionStatus = z.infer<typeof decompositionStatusSchema>;

// ---------------------------------------------------------------------
// 8. Evidence requirement (task §6) -- a sourceable evidential obligation
// needed to support one or more KnowledgeTargets. `canonicalRequirementKey`
// is DOMAIN-oriented (task §10): two structurally-identical requirements
// derived from two different qualifications collapse to the same key and
// merge their `sourceKnowledgeTargetIds`, never duplicated per
// qualification unless the underlying proposition genuinely differs.
// ---------------------------------------------------------------------

export interface EvidenceRequirement {
  readonly evidenceRequirementId: string;
  readonly canonicalRequirementKey: string;
  readonly sourceKnowledgeTargetIds: readonly string[];
  readonly requirementMode: RequirementMode;
  readonly requirementText: string;
  readonly requiredCoverageDimensions: readonly CoverageDimension[];
  readonly sourceAuthorityClasses: readonly SourceAuthorityClass[];
  readonly acquisitionPriority: AcquisitionPriority;
  readonly representativeExemplar: boolean;
  readonly calibratedSupportingPerformance: string | null;
  readonly deduplicationBasis: string;
  readonly decompositionStatus: DecompositionStatus;
  readonly decompositionReason: string | null;
  readonly acceptanceCriteria: string;
}

// ---------------------------------------------------------------------
// 9. Structural outcomes the planner records for targets that emit NO
// evidence requirement of their own (task §8.E/§8.F) -- never silently
// dropped; always traceable to why.
// ---------------------------------------------------------------------

export const structuralSatisfactionKindSchema = z.enum(["STRUCTURAL_PARENT_DECOMPOSED", "INTEGRATION_SATISFIED_BY_CONSTITUENTS", "OUT_OF_SCOPE_EXCLUDED"]);
export type StructuralSatisfactionKind = z.infer<typeof structuralSatisfactionKindSchema>;

export interface StructuralSatisfactionRecord {
  readonly knowledgeTargetId: string;
  readonly kind: StructuralSatisfactionKind;
  readonly satisfiedByKnowledgeTargetIds: readonly string[];
  readonly explanation: string;
}

// ---------------------------------------------------------------------
// 10. Generic planner input/output contract (task §7).
// ---------------------------------------------------------------------

export interface KnowledgeEvidencePlanningQualificationContext {
  readonly qualificationContextId: string;
  readonly description: string;
}

export interface KnowledgeEvidencePlanningInput {
  readonly qualificationContext: KnowledgeEvidencePlanningQualificationContext;
  readonly knowledgeTargets: readonly KnowledgeTarget[];
  readonly sourceAuthorityPolicy: SourceAuthorityPolicy;
}

export interface KnowledgeEvidencePlanResult {
  readonly requirements: readonly EvidenceRequirement[];
  readonly structuralSatisfactions: readonly StructuralSatisfactionRecord[];
}

// ---------------------------------------------------------------------
// 11. Future technical-evidence acquisition contract (task §14). Defined
// as a schema/interface only -- this package must never implement
// acquisition (browse/search/retrieve), see planner.ts's own guard test.
// ---------------------------------------------------------------------

export interface AcquisitionPolicy {
  readonly allowLiveWebResearch: boolean;
  readonly requireExactLocator: boolean;
  readonly maxCandidateSourcesPerRequirement: number;
}

export interface TechnicalEvidenceAcquisitionRequest {
  readonly evidenceRequirements: readonly EvidenceRequirement[];
  readonly sourceAuthorityPolicy: SourceAuthorityPolicy;
  readonly acquisitionPolicy: AcquisitionPolicy;
}

export const verificationStatusSchema = z.enum(["VERIFIED", "PARTIALLY_VERIFIED", "SOURCE_GAP", "CONFLICTED", "NOT_ATTEMPTED"]);
export type VerificationStatus = z.infer<typeof verificationStatusSchema>;

export interface CandidateSourceRecord {
  readonly sourceId: string;
  readonly authorityClass: SourceAuthorityClass;
  readonly sourceRef: string;
  readonly sourceLocator: string;
  readonly retrievedPassage: string;
}

export interface NormalizedTechnicalClaim {
  readonly claimText: string;
  readonly sourceId: string;
}

export interface AcquisitionConflictRecord {
  readonly description: string;
  readonly conflictingClaims: readonly NormalizedTechnicalClaim[];
}

export interface AcquisitionGapRecord {
  readonly description: string;
  readonly reason: string;
}

export interface TechnicalEvidenceAcquisitionResult {
  readonly evidenceRequirementId: string;
  readonly candidateSources: readonly CandidateSourceRecord[];
  readonly normalizedClaims: readonly NormalizedTechnicalClaim[];
  readonly verificationStatus: VerificationStatus;
  readonly conflicts: readonly AcquisitionConflictRecord[];
  readonly gaps: readonly AcquisitionGapRecord[];
}

// ---------------------------------------------------------------------
// 12. Generic local-input isolation / experiment access-guard model
// (task §15/§21). One reusable utility; a qualification's own allowlist
// is one CONFIGURATION of it, never bespoke access-control code.
// ---------------------------------------------------------------------

export const localInputMatchKindSchema = z.enum(["EXACT_PATH", "GLOB"]);
export type LocalInputMatchKind = z.infer<typeof localInputMatchKindSchema>;

export interface AllowedLocalInput {
  readonly rule: string;
  readonly matchKind: LocalInputMatchKind;
  readonly pathOrGlob: string;
  readonly requiredHash?: string;
  readonly note?: string;
}

export interface LocalAccessGuardConfig {
  readonly experimentId: string;
  readonly allowedInputs: readonly AllowedLocalInput[];
}

export const accessOutcomeSchema = z.enum(["ALLOWED", "DENIED"]);
export type AccessOutcome = z.infer<typeof accessOutcomeSchema>;

export interface AccessAuditRecord {
  readonly canonicalPath: string;
  readonly contentHash: string | null;
  readonly reason: string;
  readonly matchedRule: string | null;
  readonly outcome: AccessOutcome;
  readonly recordedAt: string;
}
