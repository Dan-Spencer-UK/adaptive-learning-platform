/**
 * CC-23: the generic EvidenceRequirementPlanner (task §6-§10). Consumes an
 * already-APPROVED, qualification-agnostic `KnowledgeEvidencePlanningInput`
 * and produces `EvidenceRequirement`s -- it never researches, browses, or
 * retrieves anything (task §13; mechanically proven in planner.test.ts).
 *
 * Every decomposition decision below is driven entirely by STRUCTURAL
 * fields on `KnowledgeTarget` (`kind`, `classification`,
 * `expectedCoverageDimensions`, `requiresMultipleIndependentClaims`,
 * `constituentKnowledgeTargetIds`, `childKnowledgeTargetIds`) -- never by
 * inspecting `targetText` content. A qualification-specific adapter
 * supplies those structural hints; this package only ever reacts to them.
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
  SourceAuthorityClass,
  SourceAuthorityPolicy,
  StructuralSatisfactionRecord,
} from "./types.ts";

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

function defaultDimensionsForKind(kind: KnowledgeTargetKind): readonly CoverageDimension[] {
  switch (kind) {
    case "PROCEDURE":
      return ["PROCEDURE", "CALCULATION_METHOD"];
    case "BREADTH_TOPIC_COVERAGE":
      return ["PROCEDURE"];
    case "RECOGNITION_REQUIREMENT":
      return ["RECOGNITION"];
    case "OPERATING_PRINCIPLE":
      return ["OPERATING_PRINCIPLE"];
    case "OPERATIONAL_USE_RULE":
      return ["SAFE_USE"];
    case "APPLICATION_FUNCTION":
      return ["APPLICATION_FUNCTION"];
    case "SYMBOL_OR_CONVENTION":
      return ["QUANTITY_SYMBOL"];
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
      return "OPERATIONAL_USE_RULE";
    case "DEFINITION":
    case "DISTINCTION":
      return "CONCEPT_DEFINITION";
  }
}

// ---------------------------------------------------------------------
// Task §12: generic acceptance policy, keyed on requirementMode only --
// never a universal "find one source that says it verbatim" rule, and
// never satisfied by a source title alone.
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

/** Task §11: a generic, reusable default authority policy. Any caller may pass its own `SourceAuthorityPolicy`; unset modes fall back to this. Every entry is a generic authority CLASS, never a named institution (task §11: those are later-discovered instances). */
export const DEFAULT_SOURCE_AUTHORITY_POLICY: SourceAuthorityPolicy = {
  allowedAuthorityClassesByMode: {
    EXACT_FACT: ["PRIMARY_STANDARDS_OR_METROLOGY_AUTHORITY", "GOVERNMENT_OR_REGULATOR", "UNIVERSITY_OR_OPEN_ACADEMIC_TEXT", "AUTHORITATIVE_TECHNICAL_MANUAL"],
    FORMULA_OR_RULE: ["PRIMARY_STANDARDS_OR_METROLOGY_AUTHORITY", "UNIVERSITY_OR_OPEN_ACADEMIC_TEXT", "AUTHORITATIVE_MATHEMATICS_REFERENCE", "PROFESSIONAL_ENGINEERING_INSTITUTION"],
    CONCEPT_DEFINITION: ["UNIVERSITY_OR_OPEN_ACADEMIC_TEXT", "PROFESSIONAL_ENGINEERING_INSTITUTION", "AUTHORITATIVE_TECHNICAL_MANUAL", "AUTHORITATIVE_MATHEMATICS_REFERENCE"],
    RELATIONSHIP: ["UNIVERSITY_OR_OPEN_ACADEMIC_TEXT", "PROFESSIONAL_ENGINEERING_INSTITUTION", "AUTHORITATIVE_TECHNICAL_MANUAL"],
    PROCEDURE_COVERAGE: ["UNIVERSITY_OR_OPEN_ACADEMIC_TEXT", "PROFESSIONAL_ENGINEERING_INSTITUTION", "AUTHORITATIVE_TECHNICAL_MANUAL", "AUTHORITATIVE_MATHEMATICS_REFERENCE"],
    OPERATING_PRINCIPLE: ["UNIVERSITY_OR_OPEN_ACADEMIC_TEXT", "ORIGINAL_COMPONENT_MANUFACTURER", "AUTHORITATIVE_TECHNICAL_MANUAL"],
    OPERATIONAL_USE_RULE: ["GOVERNMENT_OR_REGULATOR", "PROFESSIONAL_ENGINEERING_INSTITUTION", "AUTHORITATIVE_TECHNICAL_MANUAL", "ORIGINAL_COMPONENT_MANUFACTURER"],
    SYMBOL_OR_CONVENTION: ["PRIMARY_STANDARDS_OR_METROLOGY_AUTHORITY", "PROFESSIONAL_ENGINEERING_INSTITUTION", "AUTHORITATIVE_TECHNICAL_MANUAL"],
    SCHEMATIC_OR_DIAGRAM_RECOGNITION: ["ORIGINAL_COMPONENT_MANUFACTURER", "AUTHORITATIVE_TECHNICAL_MANUAL", "PROFESSIONAL_ENGINEERING_INSTITUTION"],
    APPLICATION_FUNCTION: ["ORIGINAL_COMPONENT_MANUFACTURER", "AUTHORITATIVE_TECHNICAL_MANUAL", "UNIVERSITY_OR_OPEN_ACADEMIC_TEXT"],
    TOPIC_BREADTH_COVERAGE: ["UNIVERSITY_OR_OPEN_ACADEMIC_TEXT", "AUTHORITATIVE_MATHEMATICS_REFERENCE", "PROFESSIONAL_ENGINEERING_INSTITUTION"],
  },
};

function authorityClassesFor(mode: RequirementMode, policy: SourceAuthorityPolicy): readonly SourceAuthorityClass[] {
  return policy.allowedAuthorityClassesByMode[mode] ?? DEFAULT_SOURCE_AUTHORITY_POLICY.allowedAuthorityClassesByMode[mode] ?? [];
}

// ---------------------------------------------------------------------
// Task §10: domain-oriented canonical identity -- normalized text +
// requirement mode (+ coverage dimension, for compound sub-requirements).
// Qualification location is never part of this identity.
// ---------------------------------------------------------------------

function normalizeRequirementText(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function canonicalRequirementKey(requirementText: string, mode: RequirementMode, dimension?: CoverageDimension): string {
  const base = `${mode.toLowerCase()}::${normalizeRequirementText(requirementText)}`;
  return dimension ? `${base}::${dimension.toLowerCase()}` : base;
}

// ---------------------------------------------------------------------
// Requirement construction.
// ---------------------------------------------------------------------

interface BuildRequirementParams {
  readonly target: KnowledgeTarget;
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

function buildRequirement(p: BuildRequirementParams): EvidenceRequirement {
  const key = canonicalRequirementKey(p.requirementText, p.mode, p.dimensionSuffix);
  return {
    evidenceRequirementId: `ER::${key}`,
    canonicalRequirementKey: key,
    sourceKnowledgeTargetIds: [p.target.knowledgeTargetId],
    requirementMode: p.mode,
    requirementText: p.requirementText,
    requiredCoverageDimensions: p.dimensions,
    sourceAuthorityClasses: authorityClassesFor(p.mode, p.policy),
    acquisitionPriority: priorityFor(p.target),
    representativeExemplar: p.target.isRepresentativeExemplar === true,
    calibratedSupportingPerformance: p.target.calibratedSupportingPerformance ?? null,
    deduplicationBasis: p.deduplicationBasis,
    decompositionStatus: p.decompositionStatus,
    decompositionReason: p.decompositionReason,
    acceptanceCriteria: p.decompositionStatus === "READY" ? ACCEPTANCE_CRITERIA_BY_MODE[p.mode] : "Not yet determinable -- semantic decomposition required before an acceptance criterion can be stated (task §8.G); return to Project Architect.",
  };
}

// ---------------------------------------------------------------------
// Merge/dedup across calls (task §10, §16.F cross-qualification reuse):
// two requirements sharing a `canonicalRequirementKey` -- whether from
// the same planning call or two separate calls passed in via
// `existingRequirements` -- collapse into one, union-merging their
// `sourceKnowledgeTargetIds`.
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
    byKey.set(r.canonicalRequirementKey, {
      ...prior,
      sourceKnowledgeTargetIds: mergedTargetIds,
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
// The planner itself (task §7/§8). Deterministic, order-independent
// output: `requirements` is always sorted by `canonicalRequirementKey`.
// ---------------------------------------------------------------------

export function planEvidenceRequirements(input: KnowledgeEvidencePlanningInput, existingRequirements: readonly EvidenceRequirement[] = []): KnowledgeEvidencePlanResult {
  const { knowledgeTargets, sourceAuthorityPolicy } = input;
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

    // Task §8.E: integration target.
    if (target.kind === "RELATIONSHIP" && target.requiresMultipleIndependentClaims === true) {
      if (target.constituentKnowledgeTargetIds && target.constituentKnowledgeTargetIds.length >= 2) {
        structuralSatisfactions.push({
          knowledgeTargetId: target.knowledgeTargetId,
          kind: "INTEGRATION_SATISFIED_BY_CONSTITUENTS",
          satisfiedByKnowledgeTargetIds: target.constituentKnowledgeTargetIds,
          explanation: "Integration target -- jointly satisfied by its already-sourceable constituent evidence requirements rather than a manufactured combined-relationship source proposition (task §8.E).",
        });
        continue;
      }
      freshRequirements.push(
        buildRequirement({
          target,
          mode: "RELATIONSHIP",
          requirementText: target.targetText,
          dimensions: [],
          policy: sourceAuthorityPolicy,
          decompositionStatus: "SEMANTIC_DECOMPOSITION_REQUIRED",
          decompositionReason: "Multi-claim relationship target requires explicit constituentKnowledgeTargetIds (>=2) to determine whether it can be satisfied by existing constituent evidence requirements, or genuinely needs its own combined-relationship source; none were supplied (task §8.G).",
          deduplicationBasis: "under-specified integration target -- not yet deduplicated",
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
              mode: requirementModeForDimension(dim),
              requirementText: `${target.targetText} [${dim}]`,
              dimensions: [dim],
              dimensionSuffix: dim,
              policy: sourceAuthorityPolicy,
              decompositionStatus: "READY",
              decompositionReason: null,
              deduplicationBasis: "normalized requirement text + requirement mode + coverage dimension",
            }),
          );
        }
        continue;
      }
      freshRequirements.push(
        buildRequirement({
          target,
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

    // Classes A/C/D and single-claim RELATIONSHIP: one requirement, kind-derived mode.
    const mode = defaultRequirementModeForKind(target.kind);
    const dims = target.expectedCoverageDimensions ?? defaultDimensionsForKind(target.kind);
    freshRequirements.push(
      buildRequirement({
        target,
        mode,
        requirementText: target.targetText,
        dimensions: dims,
        policy: sourceAuthorityPolicy,
        decompositionStatus: "READY",
        decompositionReason: null,
        deduplicationBasis: "normalized requirement text + requirement mode",
      }),
    );
  }

  return { requirements: mergeRequirements(existingRequirements, freshRequirements), structuralSatisfactions };
}
