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
  /** CC-23B §5.B/§13: a directional/spatial mapping is required (e.g. a hand rule), without stating what the mapping IS -- that is exactly what acquisition discovers. */
  "DIRECTIONAL_MAPPING",
  /** CC-23B §5.B/§13: which named role (a finger, a terminal, a pole) corresponds to which physical quantity, without stating the correspondence itself. */
  "ROLE_MAPPING",
  /** CC-23B §5.B/§13: the conditions under which a rule/procedure/device is correctly applied, without stating those conditions. */
  "CORRECT_USE_CONDITIONS",
]);
export type CoverageDimension = z.infer<typeof coverageDimensionSchema>;

// ---------------------------------------------------------------------
// 3A. Technical semantic identity (CC-23A §2-§6; CC-23B §6/§10 governance
// hardening). Identical human-readable wording does NOT guarantee
// identical technical meaning ("range" in statistics vs. "range" in
// measurement; "power" in mechanics vs. an electrical quantity) --
// canonical reuse must never be decided from display text alone.
// `semanticNamespace` names the domain/subject area a technical truth
// belongs to (qualification-independent, portable across awarding
// organisations and course structures -- never a curriculum location such
// as an AC/unit number); `semanticKey` names the specific truth within
// that namespace. Both are supplied by the party that approves learner
// knowledge (the upstream semantic-construction step, or a qualification-
// specific adapter standing in for it during regression testing) -- this
// package never derives them from free text itself (task §6: "Do NOT make
// the generic planner discover semantic identity using fuzzy NLP or word
// matching").
//
// CC-23B §6: semantic identity identifies WHAT technical concept/
// obligation is being discussed -- it never asserts the technical answer
// itself. "electromagnetic-rules :: fleming-left-hand-rule" is a semantic
// identity; the finger/current/field/force mapping is technical CONTENT
// and belongs to source acquisition (or to qualification evidence, if and
// only if qualification evidence explicitly supplied it).
//
// CC-23B §10: `governanceState` makes explicit how much TRUST this
// identity carries for CROSS-QUALIFICATION reuse -- the planner must never
// be forced to guess a reusable identity merely to proceed:
//   CANONICAL              -- safe for cross-qualification/domain evidence
//                              reuse (task §CT).
//   PROVISIONAL_NON_REUSABLE -- sufficiently structured to plan acquisition
//                              for THIS learner target, but never merged
//                              with another qualification's identity (task
//                              §CS) -- the planner scopes its canonical key
//                              by `qualificationContextId` while in this
//                              state, so a local opaque identity can never
//                              collide with, or be mistaken for, another
//                              qualification's domain truth. Reuse WITHIN
//                              the same qualification (the same
//                              `qualificationContextId`) still occurs
//                              normally -- the restriction is cross-
//                              qualification only.
//   UNRESOLVED              -- not sufficiently structured even to plan
//                              acquisition safely; the planner abstains
//                              with `SEMANTIC_DECOMPOSITION_REQUIRED`
//                              regardless of any other field (task §CU).
// ---------------------------------------------------------------------

export const semanticIdentityGovernanceStateSchema = z.enum(["CANONICAL", "PROVISIONAL_NON_REUSABLE", "UNRESOLVED"]);
export type SemanticIdentityGovernanceState = z.infer<typeof semanticIdentityGovernanceStateSchema>;

export interface TechnicalSemanticIdentity {
  readonly semanticNamespace: string;
  readonly semanticKey: string;
  readonly governanceState: SemanticIdentityGovernanceState;
}

// ---------------------------------------------------------------------
// 3B. Requirement specification mode (CC-23B §1-§3) -- the central
// distinction this package closes: evidence PLANNING must know WHAT
// technical evidence to discover, never the technical ANSWER that
// evidence is supposed to establish.
//
//   KNOWN_CLAIM_TO_VERIFY  -- the approved qualification/knowledge
//                             evidence already supplies the actual
//                             technical proposition (e.g. "R = ρL/A" is
//                             literally stated) -- the requirement asks
//                             acquisition to find authoritative evidence
//                             VERIFYING an already-known claim.
//   OPEN_TECHNICAL_QUESTION -- the approved evidence establishes that a
//                             concept/rule/device/function is required,
//                             but does NOT supply the technical content
//                             needed to teach it (e.g. "Fleming's left-
//                             hand rule" names the rule, not the finger/
//                             field/current/force mapping) -- the
//                             requirement asks acquisition to DISCOVER and
//                             normalize the actual technical claim. An
//                             open question is never less authoritative:
//                             it still requires exact source/locator
//                             verification before a discovered claim can
//                             govern (task §3).
// ---------------------------------------------------------------------

export const requirementSpecificationModeSchema = z.enum(["KNOWN_CLAIM_TO_VERIFY", "OPEN_TECHNICAL_QUESTION"]);
export type RequirementSpecificationMode = z.infer<typeof requirementSpecificationModeSchema>;

/** Directional/spatial/operational mapping entry (task §17-§19 CH) -- generic enough for any domain's directional rule (a compass bearing, a rotation sense, a hand-rule), never named after a specific domain's own vocabulary. */
export interface DirectionalMappingEntry {
  readonly role: string;
  readonly meaning: string;
}

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
   * CC-23A §3-§4: mandatory structured semantic identity -- the SOLE basis
   * for `canonicalRequirementKey` (never display text). Two targets whose
   * `semanticIdentity` is equal are the same reusable technical truth,
   * regardless of qualification, wording, or curriculum location; two
   * targets whose wording is equal but `semanticIdentity` differs (a
   * homonym) are never merged.
   */
  readonly semanticIdentity: TechnicalSemanticIdentity;
  /**
   * CC-23B §1-§3: mandatory -- does the qualification/knowledge evidence
   * behind this target already supply the technical answer
   * (`KNOWN_CLAIM_TO_VERIFY`), or only the obligation to teach a concept
   * whose technical content remains to be discovered
   * (`OPEN_TECHNICAL_QUESTION`)? Never inferred by this package from
   * `targetText` content -- an adapter (or the semantic-handoff layer,
   * see ./semantic-handoff.ts) must declare it explicitly, exactly like
   * `semanticIdentity`.
   */
  readonly specificationMode: RequirementSpecificationMode;
  /**
   * CC-23B §3: an OPTIONAL, adapter-supplied override of the generic,
   * mode-templated evidence QUESTION the planner would otherwise compose
   * for an `OPEN_TECHNICAL_QUESTION` target. Meaningless for
   * `KNOWN_CLAIM_TO_VERIFY`. This field exists ONLY to improve question
   * PHRASING -- task §9/§CQ: it must never be trusted, compared against,
   * or read as an established technical fact; the planner never uses it
   * to satisfy `acceptanceCriteria` or to change `specificationMode`.
   */
  readonly evidenceQuestionOverride?: string;
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
   * (or, CC-23A: `FORMULA_OR_RULE`) target whose truth is jointly
   * established by several already-sourceable constituent facts (e.g.
   * "force, work, energy, power and efficiency are related" once each is
   * independently sourced), OR whose non-formula "use/rearrangement"
   * dimension is satisfied by an existing foundational procedure (see
   * `reusesFoundationalProcedureIds` below). Requires one of those two
   * hints to resolve; otherwise the planner abstains (§8.G).
   */
  readonly requiresMultipleIndependentClaims?: boolean;
  /** `knowledgeTargetId`s of the already-sourceable constituent targets an integration target (above) can be satisfied by, instead of manufacturing a redundant combined source proposition. */
  readonly constituentKnowledgeTargetIds?: readonly string[];
  /**
   * CC-23A §11-§15: the generic formula+rearrangement rule. When a target
   * requires a TECHNICAL FORMULA/RELATIONSHIP plus REARRANGEMENT/
   * SUBSTITUTION/USE, this names the `knowledgeTargetId`(s) of an already-
   * approved FOUNDATIONAL procedural capability (e.g. generic formula
   * transposition/calculation) that satisfies the rearrangement/use
   * dimension. The planner still emits a READY requirement for the
   * formula/relationship itself (establishing the authoritative formula
   * and the meaning of its variables) -- it never invents a SECOND
   * technical-domain source requirement merely to prove ordinary algebraic
   * manipulation. A domain-specific procedural constraint beyond ordinary
   * algebra is a DIFFERENT target with its own evidence requirement, never
   * folded into this reuse.
   */
  readonly reusesFoundationalProcedureIds?: readonly string[];
  /**
   * Structural/parent-target signal (task §8.F) -- `knowledgeTargetId`s of
   * governed child targets whose own evidence requirements already
   * exhaust this target's technical evidence need. A structural target
   * with populated children emits zero evidence requirements of its own.
   */
  readonly childKnowledgeTargetIds?: readonly string[];
  /**
   * CC-23A §17-§19: generic structured representation of a directional/
   * spatial/operational rule (a hand rule, a rotation-sense rule, a
   * polarity rule) -- carried through as audit/provenance data, never
   * interpreted or branched on by this package's own logic. Proves a
   * domain can express directional knowledge without a domain-specific
   * production field (task §CH).
   */
  readonly directionalMapping?: readonly DirectionalMappingEntry[];
  /** True only when this exact target was selected as a representative exemplar of a broader application (task §18 "representative exemplars remain semantically distinct" -- never merged away by dedup logic that would erase the distinction). */
  readonly isRepresentativeExemplar?: boolean;
  /**
   * [Correction: underspecified-exemplar detection] Meaningful ONLY when
   * `isRepresentativeExemplar` is true. An exemplar target names a
   * specified OBJECT ("an exact circuit", "exact component values") that
   * is a genuinely different kind of obligation from ordinary technical
   * evidence: the object itself must be determinately identified by a
   * governed reference/locator/exemplar identity before acquisition can
   * even begin, or acquisition silently invents/selects one and calls it
   * "the" answer. `"GOVERNED_REFERENCE_RESOLVED"` means a qualification-
   * approved reference/locator already determinately identifies the exact
   * object (safe to plan as an ordinary READY requirement); any other
   * value (or omission) means the object is not yet determinately
   * identified, and the planner refuses READY status for this target
   * (see `buildRequirement` in planner.ts) rather than silently treating
   * "a row was researched" as proof "the row is the right canonical
   * object" -- this is a STRUCTURAL check on this one field, never fuzzy
   * inspection of `targetText` content.
   */
  readonly exemplarObjectIdentity?: "GOVERNED_REFERENCE_RESOLVED" | "UNDETERMINED";
  /** Opaque, adapter-supplied descriptor of the calibrated learner performance this target supports (e.g. a depth/assessment calibration note) -- carried through verbatim, never interpreted. */
  readonly calibratedSupportingPerformance?: string;
  /**
   * [Correction: cross-batch/cross-run structural satisfaction] Opaque
   * identifiers of an already-approved, previously-produced teaching
   * outcome (e.g. a frozen learning point from an earlier acquisition
   * batch or an earlier qualification run) that already exhausts this
   * target's technical evidence need. Distinct from
   * `reusesFoundationalProcedureIds` (which reuses a FOUNDATIONAL
   * PROCEDURE, always still requiring its own formula/relationship
   * requirement) and from `childKnowledgeTargetIds` (governed children
   * WITHIN the same planning run) -- this covers reuse of an outcome
   * produced entirely OUTSIDE this planning run. This package never
   * resolves, validates, or interprets these identifiers -- it only
   * records the structural satisfaction and carries the IDs through
   * verbatim (task: a requirement being satisfied by prior mastery is
   * reported, never silently dropped, and never re-verified as if new).
   */
  readonly satisfiedByExistingLearningPointIds?: readonly string[];
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
// 6. Source-authority classes (task §11; CC-23A §7 extensibility
// correction). Generic, requirement-dependent authority model. No real
// institution/standards body is hard-coded anywhere in this package;
// those are later-discovered INSTANCES of these classes, supplied by the
// acquisition engine (§14), never by this package.
//
// CC-23A §7: the taxonomy must be extensible through POLICY, never through
// a production-code change every time a new domain needs a legitimate
// authority class this list did not anticipate (construction, plumbing,
// automotive, healthcare, laboratory science, legal/regulatory training,
// computing, ...). `SourceAuthorityClass` is therefore an OPEN string type
// -- `STANDARD_AUTHORITY_CLASSES` are useful, domain-neutral defaults a
// caller may rely on, never an exhaustive closed set. A domain policy may
// introduce any additional class string of its own (task §7/§CI) without
// touching this package's production code.
// ---------------------------------------------------------------------

export const STANDARD_AUTHORITY_CLASSES = [
  "PRIMARY_NORMATIVE_OR_STANDARDS_BODY",
  "GOVERNMENT_OR_REGULATOR",
  "ACADEMIC_OR_RESEARCH_INSTITUTION",
  "PROFESSIONAL_BODY",
  "ORIGINAL_MANUFACTURER_OR_VENDOR",
  "AUTHORITATIVE_TECHNICAL_REFERENCE",
  "AUTHORITATIVE_EDUCATIONAL_REFERENCE",
] as const;
export type StandardAuthorityClass = (typeof STANDARD_AUTHORITY_CLASSES)[number];

/** Open extensible authority-class identity (CC-23A §7): any of the standard defaults, or a domain-policy-defined class string. Validate with `sourceAuthorityClassSchema` (any non-empty string) -- `standardAuthorityClassSchema` remains available where a caller specifically wants to restrict to the recommended defaults. */
export type SourceAuthorityClass = StandardAuthorityClass | (string & {});

export const standardAuthorityClassSchema = z.enum(STANDARD_AUTHORITY_CLASSES);
export const sourceAuthorityClassSchema = z.string().min(1);

/**
 * Requirement-dependent authority policy (task §11/§12) -- which authority
 * classes are acceptable for each requirement mode. A caller MAY supply
 * its own, including classes `DEFAULT_SOURCE_AUTHORITY_POLICY` (planner.ts)
 * never anticipated (CC-23A §7/§CI) -- this type places no restriction on
 * which class strings a domain policy may introduce.
 *
 * CC-23A §8/§CJ: this policy selects ACCEPTABLE EVIDENCE AUTHORITY only.
 * It structurally cannot create learner knowledge, expand qualification
 * scope, set curriculum depth, or promote contextual material -- it has no
 * field capable of expressing any of those, and the planner never reads
 * `sourceAuthorityPolicy` when computing `classification`,
 * `acquisitionPriority`, or `decompositionStatus` (see planner.test.ts's
 * dedicated regression, task §CJ).
 *
 * CC-23B §12: extensibility does not mean an undeclared string is silently
 * trusted. Any authority class used in `allowedAuthorityClassesByMode`
 * that is NOT one of `STANDARD_AUTHORITY_CLASSES` MUST also appear in
 * `registeredCustomAuthorityClasses`, or `validateSourceAuthorityPolicy`
 * (planner.ts) reports it as a configuration gap -- a typo (e.g.
 * "MARITIME_CLASSIFICATON_SOCIETY") is caught, never silently promoted to
 * a new trusted class. This is still not a closed global enum: a domain
 * registers whatever custom classes it needs, in its OWN policy, with no
 * change to this package's production code.
 */
export interface SourceAuthorityPolicy {
  readonly allowedAuthorityClassesByMode: Readonly<Partial<Record<RequirementMode, readonly SourceAuthorityClass[]>>>;
  readonly registeredCustomAuthorityClasses?: readonly SourceAuthorityClass[];
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
  /** CC-23B §3: which of the two shapes this requirement takes -- see `RequirementSpecificationMode`. */
  readonly specificationMode: RequirementSpecificationMode;
  readonly requirementText: string;
  /**
   * CC-23B §3: populated ONLY for `OPEN_TECHNICAL_QUESTION` (`null` for
   * `KNOWN_CLAIM_TO_VERIFY`, where `requirementText` already fully
   * specifies what to verify) -- a generic, mode-templated question that
   * names WHAT must be discovered, never the answer. Composed by the
   * planner from `requirementMode` + the target's own (answer-free)
   * `targetText`, optionally re-phrased via `evidenceQuestionOverride`
   * (phrasing only, never a source of truth).
   */
  readonly evidenceQuestion: string | null;
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
// 9. Structural outcomes the planner records for a target whose FULL
// evidence need, or one STRUCTURAL DIMENSION of it, is satisfied without
// a new requirement (task §8.E/§8.F; CC-23A §11-§15 extends this to a
// dimension-level satisfaction that coexists with a real requirement for
// the target's remaining dimension) -- never silently dropped; always
// traceable to why.
// ---------------------------------------------------------------------

export const structuralSatisfactionKindSchema = z.enum([
  "STRUCTURAL_PARENT_DECOMPOSED",
  "INTEGRATION_SATISFIED_BY_CONSTITUENTS",
  "OUT_OF_SCOPE_EXCLUDED",
  /** CC-23A §11-§15: the target's REARRANGEMENT/SUBSTITUTION/USE dimension is satisfied by an already-approved foundational procedure -- coexists with a real, separately-emitted EvidenceRequirement covering the target's own formula/relationship dimension (never a zero-requirement outcome by itself). */
  "REARRANGEMENT_SATISFIED_BY_FOUNDATIONAL_PROCEDURE",
  /** [Correction]: the target's technical evidence need is already exhausted by an already-approved teaching outcome produced OUTSIDE this planning run (e.g. a frozen learning point from an earlier acquisition batch) -- see `KnowledgeTarget.satisfiedByExistingLearningPointIds`. */
  "SATISFIED_BY_EXISTING_LEARNING_POINT",
]);
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

/**
 * CC-23B §20: consumes EITHER specification mode -- `evidenceRequirements`
 * is simply `EvidenceRequirement[]`, each already carrying its own
 * `specificationMode`. A `KNOWN_CLAIM_TO_VERIFY` requirement asks the
 * (future) acquirer to verify an existing claim; an
 * `OPEN_TECHNICAL_QUESTION` requirement asks it to discover and normalize
 * one. Nothing in this request shape changes between the two -- the
 * acquirer branches on `EvidenceRequirement.specificationMode`, never this
 * package.
 */
export interface TechnicalEvidenceAcquisitionRequest {
  readonly evidenceRequirements: readonly EvidenceRequirement[];
  readonly sourceAuthorityPolicy: SourceAuthorityPolicy;
  readonly acquisitionPolicy: AcquisitionPolicy;
}

/**
 * [Correction: one canonical status vocabulary] This is the SOLE
 * verification-status vocabulary for technical evidence acquisition --
 * every acquisition result, generator, report, and validator MUST use
 * these five values verbatim (never a shortened production alias such as
 * "PARTIAL" or "GAP"). A requirement is `VERIFIED` when every required
 * atomic claim or coverage dimension is explicitly supported by one or
 * more permitted authoritative sources and no material conflict remains
 * -- multiple-source composition is valid (a compound account may be
 * assembled from several sources), provided every constituent claim
 * retains its own exact source binding; `VERIFIED` is never downgraded
 * merely because no single passage states the whole compound account.
 * `PARTIALLY_VERIFIED` applies only when a required constituent or
 * dimension remains unsupported, inferential, materially ambiguous, or
 * unresolved.
 */
export const verificationStatusSchema = z.enum(["VERIFIED", "PARTIALLY_VERIFIED", "SOURCE_GAP", "CONFLICTED", "NOT_ATTEMPTED"]);
export type VerificationStatus = z.infer<typeof verificationStatusSchema>;

/**
 * [Correction: separate readiness concerns] A technical-evidence result
 * (`verificationStatus`) answers only "is the underlying fact/relationship
 * correctly evidenced?". It must never be conflated with whether a
 * REPRESENTATIVE EXEMPLAR still needs authoring/validation, or whether a
 * learner-facing RECOGNITION ASSET (e.g. a commissioned photograph or
 * schematic-symbol artwork) still needs producing -- a missing photograph
 * may block final lesson production without making the underlying
 * learning-point identity or technical fact unsupported. These are
 * reported as separate, explicit, non-blocking dependency flags on the
 * result, never smuggled into `verificationStatus` or `gaps` as if they
 * were the same kind of gap as an unresolved technical claim.
 */
export const outstandingProductionDependencyKindSchema = z.enum(["REPRESENTATIVE_EXEMPLAR_AUTHORING", "LEARNER_FACING_VISUAL_ASSET"]);
export type OutstandingProductionDependencyKind = z.infer<typeof outstandingProductionDependencyKindSchema>;

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

/**
 * CC-23B §20: for an `OPEN_TECHNICAL_QUESTION` requirement, this is where
 * the DISCOVERED technical claim(s) first appear -- never in
 * `EvidenceRequirement`/`KnowledgeTarget` themselves. `coverageDimensionsSatisfied`
 * and `unresolvedDimensions` partition `EvidenceRequirement.requiredCoverageDimensions`
 * so a partially-discovered open question (e.g. the directional mapping
 * found, the correct-use conditions not yet found) stays honestly visible
 * rather than collapsing to one boolean.
 */
export interface TechnicalEvidenceAcquisitionResult {
  readonly evidenceRequirementId: string;
  readonly candidateSources: readonly CandidateSourceRecord[];
  readonly normalizedClaims: readonly NormalizedTechnicalClaim[];
  readonly verificationStatus: VerificationStatus;
  readonly coverageDimensionsSatisfied: readonly CoverageDimension[];
  readonly unresolvedDimensions: readonly CoverageDimension[];
  readonly conflicts: readonly AcquisitionConflictRecord[];
  readonly gaps: readonly AcquisitionGapRecord[];
  /**
   * [Correction: cross-batch/cross-run structural satisfaction] Present
   * only when this requirement's technical evidence need is (wholly or
   * partly) satisfied by an already-approved teaching outcome produced
   * outside this acquisition run -- see
   * `KnowledgeTarget.satisfiedByExistingLearningPointIds`. Never implies
   * `verificationStatus` is VERIFIED by itself; the requirement still
   * carries its own genuinely-evaluated `verificationStatus`.
   */
  readonly satisfiedByExistingLearningPointIds?: readonly string[];
  /**
   * [Correction: separate readiness concerns] Non-blocking-for-evidence
   * production dependencies still outstanding for this requirement (see
   * `OutstandingProductionDependencyKind`) -- reported separately from,
   * and never allowed to lower, `verificationStatus`.
   */
  readonly outstandingProductionDependencies?: readonly OutstandingProductionDependencyKind[];
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

// ---------------------------------------------------------------------
// 13. Generic technical-semantic handoff contract (CC-23B §7-§11). Closes
// the SECOND missing generic handoff: CC-23A made `KnowledgeTarget.
// semanticIdentity` mandatory, but the Unit-202 adapter supplies it by
// hand. A future qualification must not need a hand-written, module-
// specific adapter merely to enter evidence planning.
//
// This is a DOWNSTREAM handoff owned entirely by this package (never by
// `@alp/qualification-pipeline`, preserving the locked dependency
// direction -- qualification-pipeline never imports this package, and
// this package never imports qualification-pipeline). The CALLER (an
// integration layer that already legitimately depends on both packages)
// is responsible for translating a real `KnowledgeCandidate` into the
// minimal `ApprovedKnowledgeTargetRef` shape below.
//
// `KnowledgeTechnicalSemanticsProposal` is NOT evidence, NOT curriculum
// authority, and cannot create a learner target or change its REQUIRED/
// CONTEXTUAL/OUT_OF_SCOPE classification (task §8) -- it only structures
// an EXISTING approved learner target for evidence planning. An LLM (or
// any other process) may PROPOSE structure (namespace/key, kind,
// dimensions, compound/constituent shape); it must never manufacture
// technical ANSWER content (task §9) -- the proposal shape below has
// structurally no field capable of asserting one; `technicalQuestionShape`
// exists ONLY to phrase a question, never to assert a fact (validated in
// semantic-handoff.test.ts's §CQ regression).
// ---------------------------------------------------------------------

/** The minimal, qualification-agnostic reference to an already-approved learner-knowledge target this handoff may annotate -- deliberately NOT `@alp/qualification-pipeline`'s own `KnowledgeCandidate` type (this package imports no workspace package); the caller maps `KnowledgeCandidate.candidateKey`/`disposition` into this shape. */
export interface ApprovedKnowledgeTargetRef {
  readonly targetCandidateKey: string;
  readonly qualificationContextId: string;
  readonly classification: KnowledgeTargetClassification;
}

export const proposalBasisSchema = z.enum(["EXPLICIT_QUALIFICATION_WORDING", "LLM_STRUCTURAL_INFERENCE", "ADAPTER_ASSIGNED"]);
export type ProposalBasis = z.infer<typeof proposalBasisSchema>;

/** An UNVALIDATED, UNGOVERNED proposal -- structure only, never a factual claim. Must be validated (`validateKnowledgeTechnicalSemanticsProposal`, semantic-handoff.ts) against a real `ApprovedKnowledgeTargetRef` before it can influence planning. */
export interface KnowledgeTechnicalSemanticsProposal {
  readonly targetCandidateKey: string;
  readonly semanticIdentityProposal: TechnicalSemanticIdentity | null;
  readonly evidencePlanningKind: KnowledgeTargetKind;
  readonly specificationMode: RequirementSpecificationMode;
  readonly coverageDimensionProposals: readonly CoverageDimension[];
  readonly constituentTargetRefs: readonly string[];
  readonly foundationalProcedureRefs: readonly string[];
  /** Phrasing aid ONLY for an `OPEN_TECHNICAL_QUESTION` -- never read as, compared against, or capable of establishing a technical fact (task §9/§CQ). */
  readonly technicalQuestionShape: string | null;
  readonly proposalBasis: ProposalBasis;
}

export const semanticHandoffValidationStatusSchema = z.enum(["VALID", "REJECTED"]);
export type SemanticHandoffValidationStatus = z.infer<typeof semanticHandoffValidationStatusSchema>;

/** The GOVERNED, validated result of a proposal -- safe to convert into a `KnowledgeTarget` (see `buildKnowledgeTargetFromSemantics`, semantic-handoff.ts) only when `provenance.validationStatus === "VALID"`. */
export interface KnowledgeTechnicalSemantics {
  readonly targetCandidateKey: string;
  readonly semanticIdentity: TechnicalSemanticIdentity | null;
  readonly evidencePlanningKind: KnowledgeTargetKind;
  readonly specificationMode: RequirementSpecificationMode;
  readonly coverageDimensions: readonly CoverageDimension[];
  readonly constituentTargetRefs: readonly string[];
  readonly foundationalProcedureRefs: readonly string[];
  readonly technicalQuestionOverride: string | null;
  readonly provenance: {
    readonly proposalBasis: ProposalBasis;
    readonly validationStatus: SemanticHandoffValidationStatus;
    readonly rejectionReason: string | null;
  };
}
