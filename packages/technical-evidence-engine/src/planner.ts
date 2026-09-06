/**
 * CC-23/CC-23A/CC-23B: the generic EvidenceRequirementPlanner (task §6-§10;
 * CC-23A §2-§6 semantic-identity hardening, §11-§15 formula+rearrangement
 * rule; CC-23B §1-§3 known-claim/open-question separation, §10 identity
 * governance, §12 authority-class registration). Consumes an already-
 * APPROVED, qualification-agnostic `KnowledgeEvidencePlanningInput` and
 * produces `EvidenceRequirement`s -- it never researches, browses, or
 * retrieves anything (task §13; mechanically proven in planner.test.ts),
 * and it never requires the TECHNICAL ANSWER a requirement is meant to
 * establish (CC-23B §1) -- only the structural WHAT.
 *
 * Every decomposition decision below is driven entirely by STRUCTURAL
 * fields on `KnowledgeTarget` (`kind`, `classification`, `semanticIdentity`,
 * `specificationMode`, `expectedCoverageDimensions`,
 * `requiresMultipleIndependentClaims`, `constituentKnowledgeTargetIds`,
 * `reusesFoundationalProcedureIds`, `childKnowledgeTargetIds`) -- never by
 * inspecting `targetText` content or discovering identity/specification via
 * fuzzy/NLP text matching (CC-23A §6; CC-23B §1). A qualification-specific
 * adapter (or the generic semantic-handoff layer, see ./semantic-handoff.ts)
 * supplies those structural hints; this package only ever reacts to them.
 *
 * CC-23A §2-§4: canonical requirement identity is SEMANTIC, never display-
 * text-based. `KnowledgeTarget.semanticIdentity` (namespace + key) is the
 * basis for `canonicalRequirementKey`, combined with `requirementMode` (and
 * a coverage dimension, for compound sub-requirements) -- identical wording
 * with different semantic identity (a homonym) never collapses, and
 * different wording with equal semantic identity always reuses.
 *
 * CC-23B §10: a `PROVISIONAL_NON_REUSABLE` identity additionally scopes the
 * canonical key by `qualificationContextId`, so it can never accidentally
 * collide with -- or be merged into -- another qualification's identity; an
 * `UNRESOLVED` identity forces `SEMANTIC_DECOMPOSITION_REQUIRED`
 * unconditionally, before any other structural field is even considered.
 */

import type {
  AcquisitionPriority,
  CoverageDimension,
  DecompositionStatus,
  EvidenceRequirement,
  KnowledgeEvidencePlanResult,
  KnowledgeEvidencePlanningInput,
  KnowledgeTarget,
  KnowledgeTargetKind,
  RequirementMode,
  RequirementSpecificationMode,
  SourceAuthorityClass,
  SourceAuthorityPolicy,
  StructuralSatisfactionRecord,
  TechnicalSemanticIdentity,
} from "./types.ts";
import { STANDARD_AUTHORITY_CLASSES } from "./types.ts";

// ---------------------------------------------------------------------
// Kind -> default requirement mode (task §6/§8, classes A/C/D).
// ---------------------------------------------------------------------

function defaultRequirementModeForKind(kind: KnowledgeTargetKind): RequirementMode {
  switch (kind) {
    case "CONCEPT_DEFINITION":
      return "CONCEPT_DEFINITION";
    case "FACTUAL_PROPOSITION":
      return "EXACT_FACT";
    case "FORMULA_OR_RULE":
      return "FORMULA_OR_RULE";
    case "RELATIONSHIP":
      return "RELATIONSHIP";
    case "PROCEDURE":
      return "PROCEDURE_COVERAGE";
    case "SYMBOL_OR_CONVENTION":
      return "SYMBOL_OR_CONVENTION";
    case "OPERATIONAL_USE_RULE":
      return "OPERATIONAL_USE_RULE";
    case "OPERATING_PRINCIPLE":
      return "OPERATING_PRINCIPLE";
    case "RECOGNITION_REQUIREMENT":
      return "SCHEMATIC_OR_DIAGRAM_RECOGNITION";
    case "APPLICATION_FUNCTION":
      return "APPLICATION_FUNCTION";
    case "BREADTH_TOPIC_COVERAGE":
      return "TOPIC_BREADTH_COVERAGE";
  }
}

/**
 * [Correction] These two kinds are NOT reached by `defaultDimensionsForKind`
 * when a target omits `expectedCoverageDimensions` -- the planner abstains
 * instead (see the `AMBIGUOUS_DEFAULT_DIMENSION_KINDS` guard in
 * `planEvidenceRequirements`), because each is genuinely multi-shaped and a
 * single guessed default silently created false evidence gaps/false-green
 * results: a `SYMBOL_OR_CONVENTION` may be a quantity symbol, a schematic
 * symbol, or a directional/page convention (previously always guessed
 * `QUANTITY_SYMBOL`, wrongly holding a schematic symbol or a page-direction
 * convention to a quantity-symbol acceptance bar it was never trying to
 * meet); an `OPERATIONAL_USE_RULE` may be a genuine safety rule or an
 * ordinary non-safety operational/directional rule (previously always
 * guessed `SAFE_USE`, wrongly marking a non-safety rule's evidence
 * satisfied by proving something it never needed to prove, or demanding
 * safety-specific sourcing an ordinary rule never needed). Retained here,
 * unreachable via the default path, purely so the switch stays exhaustive
 * and self-documenting; the real behaviour is the abstention.
 */
const AMBIGUOUS_DEFAULT_DIMENSION_KINDS: ReadonlySet<KnowledgeTargetKind> = new Set(["SYMBOL_OR_CONVENTION", "OPERATIONAL_USE_RULE"]);

function defaultDimensionsForKind(kind: KnowledgeTargetKind): readonly CoverageDimension[] {
  switch (kind) {
    case "PROCEDURE":
      // [Correction]: a procedure is not, by default, also a calculation --
      // callers must declare CALCULATION_METHOD explicitly via
      // expectedCoverageDimensions when the procedure genuinely computes a
      // numeric result (previously every PROCEDURE silently demanded
      // CALCULATION_METHOD evidence too, creating a false gap for
      // non-calculation procedures, e.g. a de-energisation safety
      // procedure with no calculation in it at all).
      return ["PROCEDURE"];
    case "BREADTH_TOPIC_COVERAGE":
      return ["PROCEDURE"];
    case "RECOGNITION_REQUIREMENT":
      return ["RECOGNITION"];
    case "OPERATING_PRINCIPLE":
      return ["OPERATING_PRINCIPLE"];
    case "OPERATIONAL_USE_RULE":
      return [];
    case "APPLICATION_FUNCTION":
      return ["APPLICATION_FUNCTION"];
    case "SYMBOL_OR_CONVENTION":
      return [];
    case "FORMULA_OR_RULE":
      return ["FORMULA"];
    case "RELATIONSHIP":
      return ["CONCEPTUAL_RELATIONSHIP"];
    case "FACTUAL_PROPOSITION":
      return ["DEFINITION"];
    case "CONCEPT_DEFINITION":
      return [];
  }
}

/** Task §8.B: which requirement mode a single requested coverage dimension resolves to, for compound `CONCEPT_DEFINITION` decomposition. */
function requirementModeForDimension(dim: CoverageDimension): RequirementMode {
  switch (dim) {
    case "QUANTITY_SYMBOL":
    case "UNIT_NAME":
    case "UNIT_SYMBOL":
    case "SCHEMATIC_SYMBOL":
      return "SYMBOL_OR_CONVENTION";
    case "FORMULA":
    case "FORMULA_INTERPRETATION":
    case "CALCULATION_METHOD":
      return "FORMULA_OR_RULE";
    case "PROCEDURE":
      return "PROCEDURE_COVERAGE";
    case "RECOGNITION":
      return "SCHEMATIC_OR_DIAGRAM_RECOGNITION";
    case "APPLICATION_FUNCTION":
      return "APPLICATION_FUNCTION";
    case "CONCEPTUAL_RELATIONSHIP":
    case "CAUSAL_MECHANISM":
      return "RELATIONSHIP";
    case "OPERATING_PRINCIPLE":
      return "OPERATING_PRINCIPLE";
    case "SAFE_USE":
    case "CONNECTION_TOPOLOGY":
    case "DIRECTIONAL_MAPPING":
    case "ROLE_MAPPING":
    case "CORRECT_USE_CONDITIONS":
      return "OPERATIONAL_USE_RULE";
    case "DEFINITION":
    case "DISTINCTION":
      return "CONCEPT_DEFINITION";
  }
}

// ---------------------------------------------------------------------
// Task §12: generic acceptance policy, keyed on requirementMode only --
// never a universal "find one source that says it verbatim" rule, and
// never satisfied by a source title alone. Identical wording works for
// both specification modes: for KNOWN_CLAIM_TO_VERIFY it governs
// verifying the stated claim; for OPEN_TECHNICAL_QUESTION it governs
// accepting whatever claim acquisition discovers -- an open question is
// never less authoritative (task §3).
// ---------------------------------------------------------------------

const TITLE_ALONE_CLAUSE = "A source title alone never satisfies this criterion -- the exact passage must be actually read and cited, never inferred.";

const ACCEPTANCE_CRITERIA_BY_MODE: Readonly<Record<RequirementMode, string>> = {
  EXACT_FACT: `At least one authoritative source whose exact locator/passage explicitly states this fact. ${TITLE_ALONE_CLAUSE}`,
  FORMULA_OR_RULE: `At least one authoritative source whose exact locator/passage states an exact, or mathematically/logically equivalent, form of this formula or rule. ${TITLE_ALONE_CLAUSE}`,
  CONCEPT_DEFINITION: `At least one authoritative source whose exact locator/passage explicitly defines or explains this concept. ${TITLE_ALONE_CLAUSE}`,
  RELATIONSHIP: `At least one authoritative source whose exact locator/passage explicitly states this relationship. ${TITLE_ALONE_CLAUSE}`,
  PROCEDURE_COVERAGE: `At least one authoritative source that actually teaches or describes the real procedure -- a sentence merely containing the topic name never satisfies this. ${TITLE_ALONE_CLAUSE}`,
  OPERATING_PRINCIPLE: `At least one authoritative source whose exact locator/passage explains the relevant operating behaviour. ${TITLE_ALONE_CLAUSE}`,
  OPERATIONAL_USE_RULE: `At least one authoritative source whose exact locator/passage states this explicit operational/safety/use rule. ${TITLE_ALONE_CLAUSE}`,
  SYMBOL_OR_CONVENTION: `At least one authoritative source in which the actual symbol/convention is shown or unambiguously defined. ${TITLE_ALONE_CLAUSE}`,
  SCHEMATIC_OR_DIAGRAM_RECOGNITION: `At least one authoritative source providing exact visual/symbol coverage sufficient for recognition. ${TITLE_ALONE_CLAUSE}`,
  APPLICATION_FUNCTION: `At least one authoritative source whose exact locator/passage explicitly states this application/function relationship. ${TITLE_ALONE_CLAUSE}`,
  TOPIC_BREADTH_COVERAGE: `Substantive authoritative coverage of the required topic breadth/procedure, not a single illustrative sentence. ${TITLE_ALONE_CLAUSE}`,
};

/**
 * CC-23B §3: generic, mode-templated OPEN QUESTION phrasing -- never the
 * answer. `{topic}` is filled with the target's own `targetText`, which
 * for an `OPEN_TECHNICAL_QUESTION` target is, by construction, answer-free
 * (it names a concept/rule/device, never its technical content).
 */
const EVIDENCE_QUESTION_TEMPLATE_BY_MODE: Readonly<Record<RequirementMode, (topic: string) => string>> = {
  EXACT_FACT: (topic) => `What authoritative fact establishes: ${topic}?`,
  FORMULA_OR_RULE: (topic) => `What is the exact formula or rule (and the meaning of its variables) for: ${topic}?`,
  CONCEPT_DEFINITION: (topic) => `What is the definition/meaning (and any associated symbol/unit/distinction) of: ${topic}?`,
  RELATIONSHIP: (topic) => `What is the exact relationship between the quantities/concepts named in: ${topic}?`,
  PROCEDURE_COVERAGE: (topic) => `What is the authoritative step-by-step procedure for: ${topic}?`,
  OPERATING_PRINCIPLE: (topic) => `What is the operating principle (mechanism of action) of: ${topic}?`,
  OPERATIONAL_USE_RULE: (topic) => `What is the correct directional/role mapping and correct-use conditions for: ${topic}?`,
  SYMBOL_OR_CONVENTION: (topic) => `What is the standard symbol/convention for: ${topic}?`,
  SCHEMATIC_OR_DIAGRAM_RECOGNITION: (topic) => `What is the standard schematic symbol/visual recognition pattern for: ${topic}?`,
  APPLICATION_FUNCTION: (topic) => `What is the application/function relationship for: ${topic}?`,
  TOPIC_BREADTH_COVERAGE: (topic) => `What is the substantive authoritative coverage (definitions, rules, procedures) required for the topic: ${topic}?`,
};

/** Task §11 (CC-23A §7: extensible authority classes). A generic, reusable default authority policy. Any caller may pass its own `SourceAuthorityPolicy`, including classes this default never anticipated; unset modes fall back to this. Every entry is a generic authority CLASS, never a named institution (task §11: those are later-discovered instances). */
export const DEFAULT_SOURCE_AUTHORITY_POLICY: SourceAuthorityPolicy = {
  allowedAuthorityClassesByMode: {
    EXACT_FACT: ["PRIMARY_NORMATIVE_OR_STANDARDS_BODY", "GOVERNMENT_OR_REGULATOR", "ACADEMIC_OR_RESEARCH_INSTITUTION", "AUTHORITATIVE_TECHNICAL_REFERENCE"],
    FORMULA_OR_RULE: ["PRIMARY_NORMATIVE_OR_STANDARDS_BODY", "ACADEMIC_OR_RESEARCH_INSTITUTION", "AUTHORITATIVE_EDUCATIONAL_REFERENCE", "PROFESSIONAL_BODY"],
    CONCEPT_DEFINITION: ["ACADEMIC_OR_RESEARCH_INSTITUTION", "PROFESSIONAL_BODY", "AUTHORITATIVE_TECHNICAL_REFERENCE", "AUTHORITATIVE_EDUCATIONAL_REFERENCE"],
    RELATIONSHIP: ["ACADEMIC_OR_RESEARCH_INSTITUTION", "PROFESSIONAL_BODY", "AUTHORITATIVE_TECHNICAL_REFERENCE"],
    PROCEDURE_COVERAGE: ["ACADEMIC_OR_RESEARCH_INSTITUTION", "PROFESSIONAL_BODY", "AUTHORITATIVE_TECHNICAL_REFERENCE", "AUTHORITATIVE_EDUCATIONAL_REFERENCE"],
    OPERATING_PRINCIPLE: ["ACADEMIC_OR_RESEARCH_INSTITUTION", "ORIGINAL_MANUFACTURER_OR_VENDOR", "AUTHORITATIVE_TECHNICAL_REFERENCE"],
    OPERATIONAL_USE_RULE: ["GOVERNMENT_OR_REGULATOR", "PROFESSIONAL_BODY", "AUTHORITATIVE_TECHNICAL_REFERENCE", "ORIGINAL_MANUFACTURER_OR_VENDOR"],
    SYMBOL_OR_CONVENTION: ["PRIMARY_NORMATIVE_OR_STANDARDS_BODY", "PROFESSIONAL_BODY", "AUTHORITATIVE_TECHNICAL_REFERENCE"],
    SCHEMATIC_OR_DIAGRAM_RECOGNITION: ["ORIGINAL_MANUFACTURER_OR_VENDOR", "AUTHORITATIVE_TECHNICAL_REFERENCE", "PROFESSIONAL_BODY"],
    APPLICATION_FUNCTION: ["ORIGINAL_MANUFACTURER_OR_VENDOR", "AUTHORITATIVE_TECHNICAL_REFERENCE", "ACADEMIC_OR_RESEARCH_INSTITUTION"],
    TOPIC_BREADTH_COVERAGE: ["ACADEMIC_OR_RESEARCH_INSTITUTION", "AUTHORITATIVE_EDUCATIONAL_REFERENCE", "PROFESSIONAL_BODY"],
  },
};

function authorityClassesFor(mode: RequirementMode, policy: SourceAuthorityPolicy): readonly SourceAuthorityClass[] {
  return policy.allowedAuthorityClassesByMode[mode] ?? DEFAULT_SOURCE_AUTHORITY_POLICY.allowedAuthorityClassesByMode[mode] ?? [];
}

/**
 * CC-23B §12: extensibility does not mean an undeclared string is silently
 * trusted. Every authority class referenced anywhere in `policy` (its own
 * `allowedAuthorityClassesByMode`) must be either a `STANDARD_AUTHORITY_CLASSES`
 * member or explicitly listed in `policy.registeredCustomAuthorityClasses`
 * -- otherwise this throws a structured configuration-gap error naming the
 * exact undeclared class(es). This is a policy-level (not per-item) check:
 * a misconfigured policy fails loudly at plan time, before any requirement
 * is built, rather than silently trusting a typo.
 */
export function validateSourceAuthorityPolicy(policy: SourceAuthorityPolicy): void {
  const standard = new Set<string>(STANDARD_AUTHORITY_CLASSES);
  const registered = new Set(policy.registeredCustomAuthorityClasses ?? []);
  const referenced = new Set(Object.values(policy.allowedAuthorityClassesByMode).flat());
  const undeclared = [...referenced].filter((c) => !standard.has(c) && !registered.has(c));
  if (undeclared.length > 0) {
    throw new Error(
      `SourceAuthorityPolicy validation failure: undeclared custom authority class(es) referenced but not registered: ${undeclared.join(", ")}. A custom authority class must appear in registeredCustomAuthorityClasses -- an undeclared string (e.g. a typo) is never silently trusted (task §12).`,
    );
  }
}

// ---------------------------------------------------------------------
// CC-23A §2-§4 / CC-23B §10: domain-oriented canonical identity -- SEMANTIC
// identity (namespace + key) + requirement mode (+ coverage dimension, for
// compound sub-requirements). A `PROVISIONAL_NON_REUSABLE` identity
// additionally scopes the key by `qualificationContextId`, so it can never
// collide with, or be merged into, another qualification's identity while
// still merging normally with other targets sharing the SAME
// `qualificationContextId` (task §10 -- "the restriction is cross-
// qualification only"). An `UNRESOLVED` identity never reaches this
// function at all (see the top-of-loop guard in `planEvidenceRequirements`).
// Neither qualification location nor display text is ever part of a
// CANONICAL identity's key (task §4).
// ---------------------------------------------------------------------

function slug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function canonicalRequirementKey(identity: TechnicalSemanticIdentity, mode: RequirementMode, qualificationContextId: string, dimension?: CoverageDimension): string {
  const identityPart =
    identity.governanceState === "CANONICAL"
      ? `${slug(identity.semanticNamespace)}::${slug(identity.semanticKey)}`
      : `provisional::${slug(qualificationContextId)}::${slug(identity.semanticNamespace)}::${slug(identity.semanticKey)}`;
  const base = `${identityPart}::${mode}`;
  return dimension ? `${base}::${dimension}` : base;
}

// ---------------------------------------------------------------------
// Requirement construction.
// ---------------------------------------------------------------------

interface BuildRequirementParams {
  readonly target: KnowledgeTarget;
  readonly qualificationContextId: string;
  readonly mode: RequirementMode;
  readonly requirementText: string;
  readonly dimensions: readonly CoverageDimension[];
  readonly dimensionSuffix?: CoverageDimension;
  readonly policy: SourceAuthorityPolicy;
  readonly decompositionStatus: DecompositionStatus;
  readonly decompositionReason: string | null;
  readonly deduplicationBasis: string;
}

function priorityFor(target: KnowledgeTarget): AcquisitionPriority {
  return target.classification === "CONTEXTUAL_TEACHING_SUPPORT" ? "OPTIONAL_CONTEXT" : "REQUIRED";
}

/** CC-23B §3: composes the generic open-question text -- never an answer. `evidenceQuestionOverride` re-phrases but is never trusted as fact (task §9/§CQ: it flows through as text only, never compared, never used to satisfy acceptance). */
function evidenceQuestionFor(target: KnowledgeTarget, mode: RequirementMode, requirementText: string): string {
  return target.evidenceQuestionOverride?.trim() || EVIDENCE_QUESTION_TEMPLATE_BY_MODE[mode](requirementText);
}

const UNDERSPECIFIED_EXEMPLAR_REASON =
  "This target is a representative exemplar (isRepresentativeExemplar) naming a specified object (e.g. an exact circuit or exact component values) that is not yet determinately identified by a governed reference/locator/exemplar identity (exemplarObjectIdentity !== 'GOVERNED_REFERENCE_RESOLVED'). A row being researched does not by itself prove the researched object is the right canonical exemplar -- this is never READY until a governed reference resolves it, distinct from an ordinary technical-evidence gap [Correction: underspecified-exemplar detection].";

function buildRequirement(p: BuildRequirementParams): EvidenceRequirement {
  const key = canonicalRequirementKey(p.target.semanticIdentity, p.mode, p.qualificationContextId, p.dimensionSuffix);
  const specificationMode: RequirementSpecificationMode = p.target.specificationMode;
  // [Correction: underspecified-exemplar detection] An exemplar target whose
  // specified object is not determinately identified can never be READY,
  // regardless of what decomposition status the caller otherwise computed --
  // this is a structural override, not a fuzzy inspection of requirementText.
  const exemplarUnresolved = p.target.isRepresentativeExemplar === true && p.target.exemplarObjectIdentity !== "GOVERNED_REFERENCE_RESOLVED";
  const decompositionStatus: DecompositionStatus = exemplarUnresolved ? "SEMANTIC_DECOMPOSITION_REQUIRED" : p.decompositionStatus;
  const decompositionReason = exemplarUnresolved ? UNDERSPECIFIED_EXEMPLAR_REASON : p.decompositionReason;
  return {
    evidenceRequirementId: `ER::${key}`,
    canonicalRequirementKey: key,
    sourceKnowledgeTargetIds: [p.target.knowledgeTargetId],
    requirementMode: p.mode,
    specificationMode,
    requirementText: p.requirementText,
    evidenceQuestion: specificationMode === "OPEN_TECHNICAL_QUESTION" && decompositionStatus === "READY" ? evidenceQuestionFor(p.target, p.mode, p.requirementText) : null,
    requiredCoverageDimensions: p.dimensions,
    sourceAuthorityClasses: authorityClassesFor(p.mode, p.policy),
    acquisitionPriority: priorityFor(p.target),
    representativeExemplar: p.target.isRepresentativeExemplar === true,
    calibratedSupportingPerformance: p.target.calibratedSupportingPerformance ?? null,
    deduplicationBasis: p.deduplicationBasis,
    decompositionStatus,
    decompositionReason,
    acceptanceCriteria: decompositionStatus === "READY" ? ACCEPTANCE_CRITERIA_BY_MODE[p.mode] : "Not yet determinable -- semantic decomposition required before an acceptance criterion can be stated (task §8.G); return to Project Architect.",
  };
}

// ---------------------------------------------------------------------
// Merge/dedup across calls (task §10, §16.F cross-qualification reuse):
// two requirements sharing a `canonicalRequirementKey` -- whether from
// the same planning call or two separate calls passed in via
// `existingRequirements` -- collapse into one, union-merging their
// `sourceKnowledgeTargetIds`. Because the key is semantic-identity-based
// (CC-23A §2-§4) and governance-scoped (CC-23B §10), two requirements only
// ever share a key when their source targets' `semanticIdentity`,
// `requirementMode` (and coverage dimension), and -- for a provisional
// identity -- `qualificationContextId` genuinely agree.
//
// CC-23B §14: if EITHER contributing target's specification is
// KNOWN_CLAIM_TO_VERIFY, the merged requirement is KNOWN_CLAIM_TO_VERIFY
// (once any contributing qualification evidence explicitly supplies the
// answer, the merged requirement is already substantiated and no longer
// needs to be phrased as an open question) -- `evidenceQuestion` is
// re-nulled in that case.
// ---------------------------------------------------------------------

function mergeRequirements(existing: readonly EvidenceRequirement[], fresh: readonly EvidenceRequirement[]): EvidenceRequirement[] {
  const byKey = new Map<string, EvidenceRequirement>();
  for (const r of existing) byKey.set(r.canonicalRequirementKey, r);
  for (const r of fresh) {
    const prior = byKey.get(r.canonicalRequirementKey);
    if (!prior) {
      byKey.set(r.canonicalRequirementKey, r);
      continue;
    }
    const mergedTargetIds = Array.from(new Set([...prior.sourceKnowledgeTargetIds, ...r.sourceKnowledgeTargetIds]));
    const stillUnderSpecified = prior.decompositionStatus === "SEMANTIC_DECOMPOSITION_REQUIRED";
    const mergedSpecificationMode: RequirementSpecificationMode = prior.specificationMode === "KNOWN_CLAIM_TO_VERIFY" || r.specificationMode === "KNOWN_CLAIM_TO_VERIFY" ? "KNOWN_CLAIM_TO_VERIFY" : "OPEN_TECHNICAL_QUESTION";
    byKey.set(r.canonicalRequirementKey, {
      ...prior,
      sourceKnowledgeTargetIds: mergedTargetIds,
      specificationMode: mergedSpecificationMode,
      evidenceQuestion: mergedSpecificationMode === "KNOWN_CLAIM_TO_VERIFY" ? null : (prior.evidenceQuestion ?? r.evidenceQuestion),
      requiredCoverageDimensions: Array.from(new Set([...prior.requiredCoverageDimensions, ...r.requiredCoverageDimensions])),
      sourceAuthorityClasses: Array.from(new Set([...prior.sourceAuthorityClasses, ...r.sourceAuthorityClasses])),
      acquisitionPriority: prior.acquisitionPriority === "REQUIRED" || r.acquisitionPriority === "REQUIRED" ? "REQUIRED" : "OPTIONAL_CONTEXT",
      representativeExemplar: prior.representativeExemplar || r.representativeExemplar,
      calibratedSupportingPerformance: prior.calibratedSupportingPerformance ?? r.calibratedSupportingPerformance,
      decompositionStatus: stillUnderSpecified ? prior.decompositionStatus : r.decompositionStatus,
      decompositionReason: stillUnderSpecified ? prior.decompositionReason : r.decompositionReason,
      deduplicationBasis: mergedTargetIds.length > prior.sourceKnowledgeTargetIds.length ? `${prior.deduplicationBasis} (canonical requirement reused across ${mergedTargetIds.length} knowledge targets)` : prior.deduplicationBasis,
    });
  }
  return Array.from(byKey.values()).sort((a, b) => a.canonicalRequirementKey.localeCompare(b.canonicalRequirementKey));
}

// ---------------------------------------------------------------------
// The planner itself (task §7/§8; CC-23A §11-§15; CC-23B §1-§3/§10).
// Deterministic, order-independent output: `requirements` is always
// sorted by `canonicalRequirementKey`.
// ---------------------------------------------------------------------

export function planEvidenceRequirements(input: KnowledgeEvidencePlanningInput, existingRequirements: readonly EvidenceRequirement[] = []): KnowledgeEvidencePlanResult {
  validateSourceAuthorityPolicy(input.sourceAuthorityPolicy);
  const { knowledgeTargets, sourceAuthorityPolicy, qualificationContext } = input;
  const qualificationContextId = qualificationContext.qualificationContextId;
  const freshRequirements: EvidenceRequirement[] = [];
  const structuralSatisfactions: StructuralSatisfactionRecord[] = [];

  for (const target of knowledgeTargets) {
    // Task §4: technical evidence never sources OUT_OF_SCOPE knowledge.
    if (target.classification === "OUT_OF_SCOPE") {
      structuralSatisfactions.push({
        knowledgeTargetId: target.knowledgeTargetId,
        kind: "OUT_OF_SCOPE_EXCLUDED",
        satisfiedByKnowledgeTargetIds: [],
        explanation: "OUT_OF_SCOPE knowledge targets are never sourced -- the acquisition system only searches for evidence needed by an already-authorised knowledge boundary (task §4).",
      });
      continue;
    }

    // CC-23B §10/§CU: an UNRESOLVED semantic identity is not sufficiently
    // structured even to plan acquisition safely -- abstain unconditionally,
    // before any other structural field (constituents, dimensions, mode) is
    // even considered.
    if (target.semanticIdentity.governanceState === "UNRESOLVED") {
      freshRequirements.push(
        buildRequirement({
          target,
          qualificationContextId,
          mode: defaultRequirementModeForKind(target.kind),
          requirementText: target.targetText,
          dimensions: [],
          policy: sourceAuthorityPolicy,
          decompositionStatus: "SEMANTIC_DECOMPOSITION_REQUIRED",
          decompositionReason: "Semantic identity governanceState is UNRESOLVED -- not sufficiently structured to plan acquisition safely (task §10); return to Project Architect for proper semantic structuring before evidence planning can proceed.",
          deduplicationBasis: "unresolved semantic identity -- not yet deduplicated",
        }),
      );
      continue;
    }

    // Task §8.F: structural/parent target -- children already exhaust the need.
    if (target.childKnowledgeTargetIds && target.childKnowledgeTargetIds.length > 0) {
      structuralSatisfactions.push({
        knowledgeTargetId: target.knowledgeTargetId,
        kind: "STRUCTURAL_PARENT_DECOMPOSED",
        satisfiedByKnowledgeTargetIds: target.childKnowledgeTargetIds,
        explanation: "Structural/parent target -- governed child targets already exhaust this target's technical evidence need (task §8.F); no independent evidence requirement is emitted.",
      });
      continue;
    }

    // [Correction: cross-batch/cross-run structural satisfaction] An
    // already-approved teaching outcome produced OUTSIDE this planning run
    // (e.g. a frozen learning point from an earlier acquisition batch)
    // already exhausts this target's technical evidence need -- reported,
    // never silently dropped, and never re-verified as if new.
    if (target.satisfiedByExistingLearningPointIds && target.satisfiedByExistingLearningPointIds.length > 0) {
      structuralSatisfactions.push({
        knowledgeTargetId: target.knowledgeTargetId,
        kind: "SATISFIED_BY_EXISTING_LEARNING_POINT",
        satisfiedByKnowledgeTargetIds: target.satisfiedByExistingLearningPointIds,
        explanation: "Already satisfied by an existing, already-approved teaching outcome produced outside this planning run (e.g. a frozen learning point from an earlier acquisition batch) -- no independent evidence requirement is emitted [Correction].",
      });
      continue;
    }

    // Task §8.E / CC-23A §11-§15 [Correction: extended to PROCEDURE]: a
    // RELATIONSHIP, FORMULA_OR_RULE, or PROCEDURE target declaring multiple
    // independent claims is resolved one of two ways -- never guessed,
    // never left compound. PROCEDURE is included because a compound
    // procedure genuinely built from several already-sourceable
    // constituent steps/relationships (e.g. "appropriate sine-wave
    // conversions" built from already-verified individual conversion
    // relationships plus a foundational calculation capability) is
    // structurally identical to a compound relationship -- it must not be
    // treated as demanding one omnibus source it was never going to find.
    if ((target.kind === "RELATIONSHIP" || target.kind === "FORMULA_OR_RULE" || target.kind === "PROCEDURE") && target.requiresMultipleIndependentClaims === true) {
      // (a) Integration target (§8.E): satisfied entirely by already-sourceable siblings.
      if (target.constituentKnowledgeTargetIds && target.constituentKnowledgeTargetIds.length >= 2) {
        structuralSatisfactions.push({
          knowledgeTargetId: target.knowledgeTargetId,
          kind: "INTEGRATION_SATISFIED_BY_CONSTITUENTS",
          satisfiedByKnowledgeTargetIds: target.constituentKnowledgeTargetIds,
          explanation: "Integration target -- jointly satisfied by its already-sourceable constituent evidence requirements rather than a manufactured combined-relationship source proposition (task §8.E).",
        });
        continue;
      }
      // (b) CC-23A §11-§15: formula/relationship + rearrangement-use, where the
      // rearrangement dimension reuses an already-approved foundational
      // procedure. The formula/relationship dimension STILL gets its own
      // READY requirement (establishing the authoritative formula and the
      // meaning of its variables) -- only the algebraic-manipulation
      // dimension is satisfied structurally.
      if (target.reusesFoundationalProcedureIds && target.reusesFoundationalProcedureIds.length >= 1) {
        const mode = defaultRequirementModeForKind(target.kind);
        freshRequirements.push(
          buildRequirement({
            target,
            qualificationContextId,
            mode,
            requirementText: target.targetText,
            dimensions: ["FORMULA", "FORMULA_INTERPRETATION"],
            policy: sourceAuthorityPolicy,
            decompositionStatus: "READY",
            decompositionReason: null,
            deduplicationBasis: "semantic identity + requirement mode",
          }),
        );
        structuralSatisfactions.push({
          knowledgeTargetId: target.knowledgeTargetId,
          kind: "REARRANGEMENT_SATISFIED_BY_FOUNDATIONAL_PROCEDURE",
          satisfiedByKnowledgeTargetIds: target.reusesFoundationalProcedureIds,
          explanation:
            "The formula/relationship itself is a READY evidence requirement (establishing the authoritative formula and the meaning of its variables); its rearrangement/substitution/use dimension is satisfied by an already-approved foundational procedural capability, never a second technical-domain source for ordinary algebraic manipulation (task §11-§15).",
        });
        continue;
      }
      // (c) Neither hint supplied -- abstain (§8.G).
      freshRequirements.push(
        buildRequirement({
          target,
          qualificationContextId,
          mode: defaultRequirementModeForKind(target.kind),
          requirementText: target.targetText,
          dimensions: [],
          policy: sourceAuthorityPolicy,
          decompositionStatus: "SEMANTIC_DECOMPOSITION_REQUIRED",
          decompositionReason:
            "Multi-claim relationship/formula/procedure target requires explicit constituentKnowledgeTargetIds (>=2, integration) or reusesFoundationalProcedureIds (>=1, formula+rearrangement) to determine how it can be satisfied; neither was supplied (task §8.G).",
          deduplicationBasis: "under-specified multi-claim target -- not yet deduplicated",
        }),
      );
      continue;
    }

    // Task §8.B/§8.G: compound concept-definition decomposition.
    if (target.kind === "CONCEPT_DEFINITION") {
      const dims = target.expectedCoverageDimensions ?? [];
      if (dims.length > 1) {
        for (const dim of dims) {
          freshRequirements.push(
            buildRequirement({
              target,
              qualificationContextId,
              mode: requirementModeForDimension(dim),
              requirementText: `${target.targetText} [${dim}]`,
              dimensions: [dim],
              dimensionSuffix: dim,
              policy: sourceAuthorityPolicy,
              decompositionStatus: "READY",
              decompositionReason: null,
              deduplicationBasis: "semantic identity + requirement mode + coverage dimension",
            }),
          );
        }
        continue;
      }
      freshRequirements.push(
        buildRequirement({
          target,
          qualificationContextId,
          mode: "CONCEPT_DEFINITION",
          requirementText: target.targetText,
          dimensions: [],
          policy: sourceAuthorityPolicy,
          decompositionStatus: "SEMANTIC_DECOMPOSITION_REQUIRED",
          decompositionReason: "CONCEPT_DEFINITION targets require explicit expectedCoverageDimensions (more than one) to determine whether this is a genuinely atomic definition or a compound meaning/symbol/unit/distinction target; none, or only one, were supplied (task §8.G).",
          deduplicationBasis: "under-specified concept-definition target -- not yet deduplicated",
        }),
      );
      continue;
    }

    // Classes A/C/D and single-claim RELATIONSHIP/FORMULA_OR_RULE: one requirement, kind-derived mode.
    const mode = defaultRequirementModeForKind(target.kind);

    // [Correction]: SYMBOL_OR_CONVENTION and OPERATIONAL_USE_RULE are each
    // genuinely multi-shaped (see AMBIGUOUS_DEFAULT_DIMENSION_KINDS above)
    // -- without an explicit expectedCoverageDimensions declaration, the
    // planner abstains rather than guessing a single dimension that may not
    // apply to this particular target.
    if (!target.expectedCoverageDimensions && AMBIGUOUS_DEFAULT_DIMENSION_KINDS.has(target.kind)) {
      freshRequirements.push(
        buildRequirement({
          target,
          qualificationContextId,
          mode,
          requirementText: target.targetText,
          dimensions: [],
          policy: sourceAuthorityPolicy,
          decompositionStatus: "SEMANTIC_DECOMPOSITION_REQUIRED",
          decompositionReason: `${target.kind} targets require an explicit expectedCoverageDimensions declaration -- several genuinely different dimensions are possible (e.g. a quantity symbol vs. a schematic symbol vs. a directional/page convention; a safety rule vs. an ordinary non-safety operational rule) and the planner never guesses which one applies [Correction].`,
          deduplicationBasis: "under-specified symbol/operational-use-rule target -- not yet deduplicated",
        }),
      );
      continue;
    }

    const dims = target.expectedCoverageDimensions ?? defaultDimensionsForKind(target.kind);
    freshRequirements.push(
      buildRequirement({
        target,
        qualificationContextId,
        mode,
        requirementText: target.targetText,
        dimensions: dims,
        policy: sourceAuthorityPolicy,
        decompositionStatus: "READY",
        decompositionReason: null,
        deduplicationBasis: "semantic identity + requirement mode",
      }),
    );
  }

  return { requirements: mergeRequirements(existingRequirements, freshRequirements), structuralSatisfactions };
}
