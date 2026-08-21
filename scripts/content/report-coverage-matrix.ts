/**
 * CC-09A/CC-09B.1: the Unit 202 Coverage & Assessment Matrix.
 *
 * A DERIVED report, never a second authored source of truth (approved
 * architecture decision, PROJECT-STATUS §CC-09A). It recomputes, from the
 * live governed manifests, the chain:
 *
 *   official curriculum requirement (curriculumNode, CV_KEY_R2)
 *   -> assertionCurriculumMapping -> governed assertion
 *   -> assertionFamily -> capability
 *   -> LessonPlan (targetCapabilityIds) -> mastery gate (opt-in)
 *   -> QuestionBlueprint (capabilityId)
 *   -> derived coverage status
 *
 * against the official AssessmentSpecification's per-Learning-Outcome
 * weighting, for every Assessment Criterion and Range item the current
 * curriculum version (CV_KEY_R2) declares.
 *
 * CC-09B.1 (independent Project-Architect audit correction): CC-09B's
 * report answered only "is at least one assertion mapped to this
 * requirement" -- REFERENTIAL coverage. That allowed false-green results:
 * a curriculum node could show non-zero coverage while the assertion(s)
 * behind it omitted material knowledge a learner would need, or leaned on
 * an assertion whose only provenance was the City & Guilds syllabus
 * itself (curriculum authority, not factual authority). This module now
 * computes THREE separate, never-collapsed dimensions (task brief section
 * 28 -- these must never be reported as one "coverage" number):
 *
 *  - REFERENTIAL COVERAGE: >=1 assertion mapped (the original CC-09A/B
 *    measure, `AcCoverage.tier` / `rangeItemsCovered`).
 *  - SEMANTIC KNOWLEDGE COMPLETENESS: every discrete knowledge obligation
 *    an AC imposes (declared in `./data/unit202-knowledge-obligations.ts`,
 *    an authoring/audit artefact, never learner content) is satisfied by a
 *    real governed assertion. An AC with no declared obligation set is
 *    INCOMPLETE by definition -- absence of decomposition is never read
 *    as completeness.
 *  - DIRECT FACTUAL PROVENANCE: whether a technical/factual assertion's
 *    provenance resolves to something beyond City & Guilds curriculum
 *    citation alone (directly, or via a genuine DERIVED_FROM chain to a
 *    directly-sourced assertion) -- curriculum provenance establishes
 *    WHAT must be taught, never the technical fact itself.
 *
 * Three different kinds of finding, deliberately kept separate:
 *
 *  - STRUCTURAL DEFECTS (`--check` gates on these, exit 1): the
 *    curriculum skeleton itself is wrong -- an official LO/AC/Range-item
 *    count mismatch, a malformed parent chain, an AssessmentSpecification
 *    referencing a Learning Outcome node that does not exist, or a
 *    knowledge obligation naming an assertion id that does not exist in
 *    the corpus. These can never legitimately be true and mean this
 *    package itself has a bug.
 *  - COVERAGE / SEMANTIC / PROVENANCE GAPS (never gate `--check`): a
 *    real, correctly-represented curriculum requirement has no
 *    assertion/capability/lesson/question-blueprint yet, or a real
 *    assertion still lacks independent factual provenance, or a
 *    knowledge obligation is unsatisfied. This is EXPECTED to be
 *    non-zero at times and is not a defect in this script -- it is the
 *    exact, mechanically-derived backlog later work closes. Reporting it
 *    honestly is this script's job; failing `--check` on it would defeat
 *    that job. (Semantic/provenance gaps are surfaced prominently in the
 *    formatted report precisely so they cannot be mistaken for "clean.")
 *  - LOCATOR MISMATCHES (never gate `--check`, always surfaced): a
 *    CURRICULUM_REQUIRES provenance link whose own locator names a
 *    different Assessment Criterion than the one the assertion is
 *    actually mapped to (the exact CC-09B defect class the audit found in
 *    EL-WAVEFORM-RMS-CALC-001/EL-WAVEFORM-FREQUENCY-CALC-001).
 *
 * Prerequisite/remediation health is not reimplemented here -- it already
 * has its own governed, tested algorithm (`ambiguousRemediationCandidates`
 * in validate-lesson-plan.ts); this report reuses that result rather than
 * duplicating governance logic (see `lessonPlanGovernanceClean` below).
 *
 * Usage:
 *   node scripts/content/report-coverage-matrix.ts            (print report)
 *   node scripts/content/report-coverage-matrix.ts --check     (exit 1 on any structural defect)
 */

import { fileURLToPath } from "node:url";

import {
  assessmentSpecificationManifestSchema,
  knowledgeGraphManifestSchema,
  lessonPlanManifestSchema,
  pedagogyManifestSchema,
  type KnowledgeGraphManifest,
} from "@alp/content-schema";

type CurriculumNodeManifest = KnowledgeGraphManifest["curriculumNodes"][number];

import { CV_KEY_R2, cc04Unit202ElectricalScience } from "./data/cc04-unit202-electrical-science.ts";
import { cc05aPedagogyUnit202 } from "./data/cc05a-pedagogy-unit202.ts";
import { AC_OBLIGATIONS } from "./data/unit202-knowledge-obligations.ts";
import { lessons } from "./data/lessons.ts";
import { unit202AssessmentSpecification } from "./data/unit202-assessment-specification.ts";
import { buildReport as buildLessonPlanReport, isReportClean as isLessonPlanReportClean } from "./validate-lesson-plan.ts";

const EXPECTED_LO_COUNT = 6;
const EXPECTED_AC_COUNT = 23;
const EXPECTED_RANGE_ITEM_COUNT = 58;

type SemanticStatus = "INCOMPLETE" | "COMPLETE_PENDING_VERIFICATION";

interface ObligationResult {
  id: string;
  description: string;
  satisfied: boolean;
}

interface AcSemantic {
  acNumber: string;
  status: SemanticStatus;
  obligationsDeclared: boolean;
  obligations: ObligationResult[];
  unresolvedObligationIds: string[];
}

interface ProvenanceAudit {
  /** Assertions with zero provenance links at all. Target 0. */
  noProvenance: string[];
  /** Technical/factual assertions whose only provenance is City & Guilds CURRICULUM_REQUIRES, with no DERIVED_FROM chain to a directly-sourced assertion. Target 0. */
  syllabusOnlyTechnical: string[];
  /** A CURRICULUM_REQUIRES locator names a different AC than the assertion is actually mapped to. Target 0. */
  mismatchedLocators: string[];
  /** DERIVED_FROM targets that do not resolve to a real corpus assertion. Structural defect (folded into structuralDefects, listed here too for visibility). */
  unresolvedDerivations: string[];
  /** CC-09B.2: DERIVED_FROM edges whose declared (or missing) derivationKind is EMPIRICAL_APPLICATION/INVALID_UNCLEAR/undeclared -- these can never satisfy provenance. Target 0. */
  invalidDerivationKinds: string[];
  /** CC-09B.2: assertions with at least one explicitly classified (supportType set) provenance link where every classified link is PARTIAL, none DIRECT -- reported for transparency, never a failure (a deliberate multi-source PARTIAL combination, e.g. EL-CONCEPT-POWER-FACTOR-001, is a valid pattern per task section 11.A, not a defect). */
  partialSupportOnly: string[];
  /** CC-09B.2: count of assertions with >=1 provenance link carrying an explicit supportType -- i.e. assertions this package's bounded entailment audit actually classified (task sections 25/26 plus the specific named corrections), never claimed to be the whole corpus. See this module's header and PROJECT-STATUS.md CC-09B.2 for the audit's explicit scope boundary. */
  entailmentClassifiedCount: number;
  /** Assertions citing at least one source whose sourceVersion.verificationStatus is not VERIFIED. Reported, never a failure -- independent verification is a separate, later step (ADR-0002). */
  unverifiedSourceCount: number;
}

/**
 * How far a single Assessment Criterion's coverage reaches. Deliberately
 * NOT a strict linear pipeline where every stage is mandatory for every
 * AC -- `hasMasteryGate` is reported as its own flag, never folded into
 * this tier, because @alp/content-schema's own lesson-plan.ts documents
 * that several real governed capabilities can structurally never be a
 * course-advancement mastery gate (guided-only evidence) without that
 * being a defect.
 */
type CoverageTier = "NONE" | "ASSERTION_ONLY" | "TAUGHT" | "ASSESSABLE";

interface AcCoverage {
  nodeKey: string;
  code: string;
  title: string;
  loNumber: number;
  assertionCount: number;
  capabilityIds: string[];
  hasLesson: boolean;
  hasMasteryGate: boolean;
  hasQuestionBlueprint: boolean;
  tier: CoverageTier;
  rangeItemsTotal: number;
  rangeItemsCovered: number;
}

interface LoReadiness {
  number: number;
  title: string;
  acTotal: number;
  acAssessable: number;
  rangeItemsTotal: number;
  rangeItemsCovered: number;
  officialQuestionCount: number | null;
  officialQuestionPercentage: number | null;
  examReady: boolean;
}

interface CoverageMatrixReport {
  structuralDefects: string[];
  acCoverage: AcCoverage[];
  loReadiness: LoReadiness[];
  acSemantic: AcSemantic[];
  provenanceAudit: ProvenanceAudit;
  totals: {
    loCount: number;
    acCount: number;
    rangeItemCount: number;
    acAssessable: number;
    acWithNoCoverage: number;
    rangeItemsCovered: number;
    acSemanticComplete: number;
    rangeItemsSemanticComplete: number;
  };
  lessonPlanGovernanceClean: boolean;
}

function nodesByType(
  nodes: readonly CurriculumNodeManifest[],
  curriculumVersionKey: string,
): {
  qualification: CurriculumNodeManifest[];
  unit: CurriculumNodeManifest[];
  lo: CurriculumNodeManifest[];
  ac: CurriculumNodeManifest[];
  rangeItem: CurriculumNodeManifest[];
} {
  const scoped = nodes.filter((n) => n.curriculumVersionKey === curriculumVersionKey);
  return {
    qualification: scoped.filter((n) => n.nodeType === "QUALIFICATION"),
    unit: scoped.filter((n) => n.nodeType === "UNIT"),
    lo: scoped.filter((n) => n.nodeType === "LEARNING_OUTCOME"),
    ac: scoped.filter((n) => n.nodeType === "ASSESSMENT_CRITERION"),
    rangeItem: scoped.filter((n) => n.nodeType === "RANGE_ITEM"),
  };
}

/**
 * Builds the full coverage matrix against the live corpus. `overrides`
 * exists ONLY for tests to inject a deliberately-defective node/spec set
 * and prove the structural gates fire; production/CLI use never passes
 * it (mirrors validate-lesson-plan.ts's own `buildReport(overrides?)`
 * convention).
 */
function buildReport(overrides?: {
  readonly curriculum?: typeof cc04Unit202ElectricalScience;
  readonly assessmentSpecification?: typeof unit202AssessmentSpecification;
  readonly obligations?: typeof AC_OBLIGATIONS;
}): CoverageMatrixReport {
  const corpus = knowledgeGraphManifestSchema.parse(overrides?.curriculum ?? cc04Unit202ElectricalScience);
  const pedagogy = pedagogyManifestSchema.parse(cc05aPedagogyUnit202);
  const lessonManifest = lessonPlanManifestSchema.parse({ lessons });
  const specManifest = assessmentSpecificationManifestSchema.parse(overrides?.assessmentSpecification ?? unit202AssessmentSpecification);
  const obligationSets = overrides?.obligations ?? AC_OBLIGATIONS;

  const structuralDefects: string[] = [];

  const { lo: loNodes, ac: acNodes, rangeItem: rangeNodes } = nodesByType(corpus.curriculumNodes, CV_KEY_R2);
  const nodesByKey = new Map(corpus.curriculumNodes.map((n) => [n.key, n]));

  // ---- Structural gate 1: the transcribed skeleton has exactly the
  // official official LO/AC/Range-item counts. ---------------------------
  if (loNodes.length !== EXPECTED_LO_COUNT) {
    structuralDefects.push(`CV_KEY_R2 has ${loNodes.length} LEARNING_OUTCOME nodes, expected exactly ${EXPECTED_LO_COUNT}`);
  }
  if (acNodes.length !== EXPECTED_AC_COUNT) {
    structuralDefects.push(`CV_KEY_R2 has ${acNodes.length} ASSESSMENT_CRITERION nodes, expected exactly ${EXPECTED_AC_COUNT}`);
  }
  if (rangeNodes.length !== EXPECTED_RANGE_ITEM_COUNT) {
    structuralDefects.push(`CV_KEY_R2 has ${rangeNodes.length} RANGE_ITEM nodes, expected exactly ${EXPECTED_RANGE_ITEM_COUNT}`);
  }

  // ---- Structural gate 2: every AC's parent is a real LO in the same
  // version; every Range item's parent is a real AC in the same version.
  // ------------------------------------------------------------------
  for (const ac of acNodes) {
    const parent = ac.parentKey ? nodesByKey.get(ac.parentKey) : undefined;
    if (!parent || parent.nodeType !== "LEARNING_OUTCOME" || parent.curriculumVersionKey !== CV_KEY_R2) {
      structuralDefects.push(`ASSESSMENT_CRITERION '${ac.key}' does not have a LEARNING_OUTCOME parent within CV_KEY_R2`);
    }
  }
  for (const item of rangeNodes) {
    const parent = item.parentKey ? nodesByKey.get(item.parentKey) : undefined;
    if (!parent || parent.nodeType !== "ASSESSMENT_CRITERION" || parent.curriculumVersionKey !== CV_KEY_R2) {
      structuralDefects.push(`RANGE_ITEM '${item.key}' does not have an ASSESSMENT_CRITERION parent within CV_KEY_R2`);
    }
  }

  // ---- Structural gate 3: the official AssessmentSpecification's outcome
  // allocations resolve to real CV_KEY_R2 Learning Outcome nodes. --------
  const loNodesByKey = new Map(loNodes.map((n) => [n.key, n]));
  const spec = specManifest.specifications.find((s) => s.curriculumVersionKey === CV_KEY_R2);
  if (!spec) {
    structuralDefects.push(`no AssessmentSpecification declares curriculumVersionKey '${CV_KEY_R2}'`);
  } else {
    for (const allocation of spec.outcomeAllocations) {
      const node = loNodesByKey.get(allocation.learningOutcomeNodeKey);
      if (!node) {
        structuralDefects.push(
          `AssessmentSpecification '${spec.id}' outcome allocation for LO${allocation.outcomeNumber} references unknown Learning Outcome node '${allocation.learningOutcomeNodeKey}'`,
        );
      }
    }
  }

  // ---- Coverage chain lookups -------------------------------------------
  const familyIdByAssertion = new Map(pedagogy.assertionFamilyMemberships.map((m) => [m.assertionIdentifier, m.familyId]));
  const capabilitiesByFamily = new Map<string, string[]>();
  for (const capability of pedagogy.capabilities) {
    if (!capabilitiesByFamily.has(capability.familyId)) capabilitiesByFamily.set(capability.familyId, []);
    capabilitiesByFamily.get(capability.familyId)!.push(capability.id);
  }
  const assertionIdsByNodeKey = new Map<string, string[]>();
  for (const mapping of corpus.assertionCurriculumMappings) {
    if (!assertionIdsByNodeKey.has(mapping.curriculumNodeKey)) assertionIdsByNodeKey.set(mapping.curriculumNodeKey, []);
    assertionIdsByNodeKey.get(mapping.curriculumNodeKey)!.push(mapping.assertionIdentifier);
  }
  const lessonCapabilityIds = new Set(lessonManifest.lessons.flatMap((l) => l.targetCapabilityIds));
  const masteryGateCapabilityIds = new Set(lessonManifest.lessons.flatMap((l) => l.completionCriteria.masteryGateCapabilityIds));
  const questionBlueprintCapabilityIds = new Set(pedagogy.questionBlueprints.map((q) => q.capabilityId));

  function capabilitiesForAssertions(assertionIds: readonly string[]): string[] {
    const capabilityIds = new Set<string>();
    for (const assertionId of assertionIds) {
      const familyId = familyIdByAssertion.get(assertionId);
      if (!familyId) continue; // standalone assertion: no capability path (by design, not a defect).
      for (const capabilityId of capabilitiesByFamily.get(familyId) ?? []) capabilityIds.add(capabilityId);
    }
    return [...capabilityIds];
  }

  const rangeNodesByParent = new Map<string, CurriculumNodeManifest[]>();
  for (const item of rangeNodes) {
    if (!item.parentKey) continue;
    if (!rangeNodesByParent.has(item.parentKey)) rangeNodesByParent.set(item.parentKey, []);
    rangeNodesByParent.get(item.parentKey)!.push(item);
  }

  const loNumberByAcKey = new Map<string, number>();
  for (const lo of loNodes) {
    const loNumberMatch = /^202-LO(\d+)$/.exec(lo.code);
    const loNumber = loNumberMatch ? Number(loNumberMatch[1]) : Number.NaN;
    for (const ac of acNodes) {
      if (ac.parentKey === lo.key) loNumberByAcKey.set(ac.key, loNumber);
    }
  }

  const acCoverage: AcCoverage[] = acNodes.map((ac) => {
    const assertionIds = assertionIdsByNodeKey.get(ac.key) ?? [];
    const capabilityIds = capabilitiesForAssertions(assertionIds);
    const hasLesson = capabilityIds.some((id) => lessonCapabilityIds.has(id));
    const hasMasteryGate = capabilityIds.some((id) => masteryGateCapabilityIds.has(id));
    const hasQuestionBlueprint = capabilityIds.some((id) => questionBlueprintCapabilityIds.has(id));

    let tier: CoverageTier = "NONE";
    if (assertionIds.length > 0) tier = "ASSERTION_ONLY";
    if (capabilityIds.length > 0 && hasLesson) tier = "TAUGHT";
    if (tier === "TAUGHT" && hasQuestionBlueprint) tier = "ASSESSABLE";

    const rangeChildren = rangeNodesByParent.get(ac.key) ?? [];
    const rangeItemsCovered = rangeChildren.filter((item) => (assertionIdsByNodeKey.get(item.key) ?? []).length > 0).length;

    return {
      nodeKey: ac.key,
      code: ac.code,
      title: ac.title,
      loNumber: loNumberByAcKey.get(ac.key) ?? Number.NaN,
      assertionCount: assertionIds.length,
      capabilityIds,
      hasLesson,
      hasMasteryGate,
      hasQuestionBlueprint,
      tier,
      rangeItemsTotal: rangeChildren.length,
      rangeItemsCovered,
    };
  });

  const loReadiness: LoReadiness[] = loNodes
    .map((lo) => {
      const loNumberMatch = /^202-LO(\d+)$/.exec(lo.code);
      const loNumber = loNumberMatch ? Number(loNumberMatch[1]) : Number.NaN;
      const acsForLo = acCoverage.filter((ac) => ac.loNumber === loNumber);
      const allocation = spec?.outcomeAllocations.find((a) => a.learningOutcomeNodeKey === lo.key);
      const rangeItemsTotal = acsForLo.reduce((sum, ac) => sum + ac.rangeItemsTotal, 0);
      const rangeItemsCovered = acsForLo.reduce((sum, ac) => sum + ac.rangeItemsCovered, 0);
      return {
        number: loNumber,
        title: lo.title,
        acTotal: acsForLo.length,
        acAssessable: acsForLo.filter((ac) => ac.tier === "ASSESSABLE").length,
        rangeItemsTotal,
        rangeItemsCovered,
        officialQuestionCount: allocation?.questionCount ?? null,
        officialQuestionPercentage: allocation?.questionPercentage ?? null,
        examReady: acsForLo.length > 0 && acsForLo.every((ac) => ac.tier === "ASSESSABLE") && rangeItemsCovered === rangeItemsTotal,
      };
    })
    .sort((a, b) => a.number - b.number);

  const lessonPlanGovernanceClean = isLessonPlanReportClean(buildLessonPlanReport());

  // =====================================================================
  // CC-09B.1: semantic knowledge completeness (never inferred from
  // assertion/mapping counts -- see the module header's "false-green"
  // rationale). Cross-checks every declared obligation's satisfiedBy
  // assertion ids against the real corpus: an obligation naming an id
  // that does not exist is a structural defect (this package's own bug),
  // never silently treated as unsatisfied.
  // =====================================================================
  const realAssertionIds = new Set(corpus.assertions.map((a) => a.identifier));
  const obligationsByAc = new Map(obligationSets.map((set) => [set.acNumber, set.obligations]));

  const acSemantic: AcSemantic[] = acNodes.map((ac) => {
    const acNumberMatch = /-AC(\d+\.\d+)$/.exec(ac.code);
    const acNumber = acNumberMatch?.[1] ?? ac.code;
    const declared = obligationsByAc.get(acNumber);
    const unresolvedObligationIds: string[] = [];

    if (!declared) {
      return { acNumber, status: "INCOMPLETE", obligationsDeclared: false, obligations: [], unresolvedObligationIds };
    }

    const obligations: ObligationResult[] = declared.map((obligation) => {
      const resolvedIds = obligation.satisfiedBy.filter((id) => realAssertionIds.has(id));
      const unknownIds = obligation.satisfiedBy.filter((id) => !realAssertionIds.has(id));
      if (unknownIds.length > 0) {
        structuralDefects.push(
          `knowledge obligation '${acNumber}:${obligation.id}' names unknown assertion id(s): ${unknownIds.join(", ")}`,
        );
        unresolvedObligationIds.push(obligation.id);
      }
      return { id: obligation.id, description: obligation.description, satisfied: resolvedIds.length > 0 };
    });

    const status: SemanticStatus = obligations.length > 0 && obligations.every((o) => o.satisfied) ? "COMPLETE_PENDING_VERIFICATION" : "INCOMPLETE";
    return { acNumber, status, obligationsDeclared: true, obligations, unresolvedObligationIds };
  });
  const semanticStatusByAcNumber = new Map(acSemantic.map((s) => [s.acNumber, s.status]));

  function acNumberForNode(node: CurriculumNodeManifest): string | undefined {
    const direct = /-AC(\d+\.\d+)$/.exec(node.code);
    if (direct) return direct[1];
    if (node.nodeType === "RANGE_ITEM" && node.parentKey) {
      const parent = nodesByKey.get(node.parentKey);
      if (parent) return acNumberForNode(parent);
    }
    return undefined;
  }

  let rangeItemsSemanticComplete = 0;
  for (const item of rangeNodes) {
    const acNumber = acNumberForNode(item);
    const acStatus = acNumber ? semanticStatusByAcNumber.get(acNumber) : undefined;
    const referentiallyCovered = (assertionIdsByNodeKey.get(item.key) ?? []).length > 0;
    if (referentiallyCovered && acStatus === "COMPLETE_PENDING_VERIFICATION") rangeItemsSemanticComplete++;
  }

  // =====================================================================
  // CC-09B.1: direct factual-provenance audit (task brief section 20).
  // =====================================================================
  const sourceKeyBySourceVersionKey = new Map(corpus.sourceVersions.map((sv) => [sv.key, sv.sourceKey]));
  const sourceVersionKeyByLocatorKey = new Map(corpus.sourceLocators.map((sl) => [sl.key, sl.sourceVersionKey]));
  const verificationStatusBySourceVersionKey = new Map(corpus.sourceVersions.map((sv) => [sv.key, sv.verificationStatus]));
  const provenanceByAssertion = new Map<string, typeof corpus.assertionProvenanceLinks>();
  for (const link of corpus.assertionProvenanceLinks) {
    if (!provenanceByAssertion.has(link.assertionIdentifier)) provenanceByAssertion.set(link.assertionIdentifier, []);
    provenanceByAssertion.get(link.assertionIdentifier)!.push(link);
  }
  const derivedFromByAssertion = new Map<string, string[]>();
  const unresolvedDerivations: string[] = [];
  // CC-09B.2 (source-first evidence hardening, task section 27/28): only
  // MATHEMATICAL/LOGICAL_DEFINITIONAL derivations may substitute for an
  // assertion's own direct provenance. `validKindByEdge` tracks which
  // edges qualify; `invalidDerivationKinds` records any that do not (the
  // content-schema-level superRefine already forces every DERIVED_FROM
  // edge to declare SOME kind, so this is a second, independent
  // structural check -- if a future edit ever adds an EMPIRICAL_APPLICATION
  // or INVALID_UNCLEAR edge, it is caught here rather than silently
  // trusted as provenance).
  const validKindByEdge = new Map<string, boolean>();
  const invalidDerivationKinds: string[] = [];
  for (const rel of corpus.assertionRelationships) {
    if (rel.relationshipType !== "DERIVED_FROM") continue;
    if (!realAssertionIds.has(rel.toIdentifier)) {
      unresolvedDerivations.push(`${rel.fromIdentifier} DERIVED_FROM unknown assertion '${rel.toIdentifier}'`);
      structuralDefects.push(`DERIVED_FROM relationship on '${rel.fromIdentifier}' references unknown assertion '${rel.toIdentifier}'`);
      continue;
    }
    if (!derivedFromByAssertion.has(rel.fromIdentifier)) derivedFromByAssertion.set(rel.fromIdentifier, []);
    derivedFromByAssertion.get(rel.fromIdentifier)!.push(rel.toIdentifier);
    const edgeKey = `${rel.fromIdentifier}->${rel.toIdentifier}`;
    const isValidKind = rel.derivationKind === "MATHEMATICAL" || rel.derivationKind === "LOGICAL_DEFINITIONAL";
    validKindByEdge.set(edgeKey, isValidKind);
    if (!isValidKind) {
      invalidDerivationKinds.push(`${rel.fromIdentifier} DERIVED_FROM ${rel.toIdentifier} (${rel.derivationKind ?? "undeclared"})`);
    }
  }

  /** True once a chain of DERIVED_FROM edges (bounded depth against cycles, and only through MATHEMATICAL/LOGICAL_DEFINITIONAL edges -- an EMPIRICAL_APPLICATION or INVALID_UNCLEAR edge never confers provenance, CC-09B.2) reaches an assertion with real non-curriculum provenance. */
  function derivesFromSourcedAssertion(assertionId: string, seen = new Set<string>()): boolean {
    if (seen.has(assertionId)) return false;
    seen.add(assertionId);
    for (const targetId of derivedFromByAssertion.get(assertionId) ?? []) {
      if (!validKindByEdge.get(`${assertionId}->${targetId}`)) continue;
      if (hasDirectTechnicalProvenance(targetId) || derivesFromSourcedAssertion(targetId, seen)) return true;
    }
    return false;
  }
  function hasDirectTechnicalProvenance(assertionId: string): boolean {
    const links = provenanceByAssertion.get(assertionId) ?? [];
    return links.some((link) => {
      const svKey = sourceVersionKeyByLocatorKey.get(link.sourceLocatorKey);
      const srcKey = svKey ? sourceKeyBySourceVersionKey.get(svKey) : undefined;
      return srcKey !== "src-cg-2365-02";
    });
  }

  const noProvenance: string[] = [];
  const syllabusOnlyTechnical: string[] = [];
  const mismatchedLocators: string[] = [];
  let unverifiedSourceCount = 0;

  // CV_KEY_R2 node key -> the AC number it belongs to (AC itself, or its Range-item children).
  const acNumberByR2NodeKey = new Map<string, string>();
  for (const ac of acNodes) {
    const num = acNumberForNode(ac);
    if (num) acNumberByR2NodeKey.set(ac.key, num);
  }
  for (const item of rangeNodes) {
    const num = acNumberForNode(item);
    if (num) acNumberByR2NodeKey.set(item.key, num);
  }
  const r2NodeKeysByAssertion = new Map<string, string[]>();
  for (const mapping of corpus.assertionCurriculumMappings) {
    if (!acNumberByR2NodeKey.has(mapping.curriculumNodeKey)) continue;
    if (!r2NodeKeysByAssertion.has(mapping.assertionIdentifier)) r2NodeKeysByAssertion.set(mapping.assertionIdentifier, []);
    r2NodeKeysByAssertion.get(mapping.assertionIdentifier)!.push(mapping.curriculumNodeKey);
  }

  const partialSupportOnly: string[] = [];
  let entailmentClassifiedCount = 0;
  for (const assertion of corpus.assertions) {
    const links = provenanceByAssertion.get(assertion.identifier) ?? [];
    if (links.length === 0) {
      noProvenance.push(assertion.identifier);
      continue;
    }

    if (!hasDirectTechnicalProvenance(assertion.identifier) && !derivesFromSourcedAssertion(assertion.identifier)) {
      syllabusOnlyTechnical.push(assertion.identifier);
    }

    // CC-09B.2: entailment classification (task section 30) -- a
    // deliberately bounded, honestly-scoped transparency metric, not a
    // retroactive re-audit of every pre-existing provenance link.
    const classifiedLinks = links.filter((link) => link.supportType !== undefined);
    if (classifiedLinks.length > 0) {
      entailmentClassifiedCount++;
      if (classifiedLinks.every((link) => link.supportType === "PARTIAL")) {
        partialSupportOnly.push(assertion.identifier);
      }
    }

    const mappedAcNumbers = new Set(
      (r2NodeKeysByAssertion.get(assertion.identifier) ?? []).map((key) => acNumberByR2NodeKey.get(key)).filter((n): n is string => !!n),
    );
    for (const link of links) {
      if (link.provenanceRole !== "CURRICULUM_REQUIRES") continue;
      const acMatch = /^loc-cg-ac(\d+\.\d+)/.exec(link.sourceLocatorKey);
      if (!acMatch) continue;
      const locatorAcNumber = acMatch[1]!;
      if (mappedAcNumbers.size > 0 && !mappedAcNumbers.has(locatorAcNumber)) {
        mismatchedLocators.push(
          `${assertion.identifier}: locator '${link.sourceLocatorKey}' cites AC${locatorAcNumber}, but this assertion is mapped to AC ${[...mappedAcNumbers].join(", ")}`,
        );
      }
    }

    if (links.some((link) => {
      const svKey = sourceVersionKeyByLocatorKey.get(link.sourceLocatorKey);
      return svKey ? verificationStatusBySourceVersionKey.get(svKey) !== "VERIFIED" : false;
    })) {
      unverifiedSourceCount++;
    }
  }

  const provenanceAudit: ProvenanceAudit = {
    noProvenance,
    syllabusOnlyTechnical,
    mismatchedLocators,
    unresolvedDerivations,
    invalidDerivationKinds,
    partialSupportOnly,
    entailmentClassifiedCount,
    unverifiedSourceCount,
  };

  return {
    structuralDefects,
    acCoverage,
    loReadiness,
    acSemantic,
    provenanceAudit,
    totals: {
      loCount: loNodes.length,
      acCount: acNodes.length,
      rangeItemCount: rangeNodes.length,
      acAssessable: acCoverage.filter((ac) => ac.tier === "ASSESSABLE").length,
      acWithNoCoverage: acCoverage.filter((ac) => ac.tier === "NONE").length,
      rangeItemsCovered: acCoverage.reduce((sum, ac) => sum + ac.rangeItemsCovered, 0),
      acSemanticComplete: acSemantic.filter((s) => s.status === "COMPLETE_PENDING_VERIFICATION").length,
      rangeItemsSemanticComplete,
    },
    lessonPlanGovernanceClean,
  };
}

function formatReport(report: CoverageMatrixReport): string {
  const lines: string[] = [];
  lines.push("Unit 202 Coverage & Assessment Matrix");
  lines.push("======================================");
  lines.push("");
  lines.push(`Structural defects (target 0): ${report.structuralDefects.length}`);
  if (report.structuralDefects.length) lines.push(`    ${report.structuralDefects.join("; ")}`);
  lines.push("");
  lines.push("CURRICULUM STRUCTURE:");
  lines.push(`  ${report.totals.loCount} LOs / ${report.totals.acCount} ACs / ${report.totals.rangeItemCount} Range items`);
  lines.push("");
  lines.push("REFERENTIAL COVERAGE (>=1 assertion mapped -- never confuse with semantic completeness below):");
  lines.push(
    `  ${report.totals.acCount - report.totals.acWithNoCoverage}/${report.totals.acCount} ACs (${report.totals.acAssessable}/${report.totals.acCount} fully ASSESSABLE), ` +
      `${report.totals.rangeItemsCovered}/${report.totals.rangeItemCount} Range items`,
  );
  lines.push("");
  lines.push("SEMANTIC KNOWLEDGE COMPLETENESS (every declared knowledge obligation satisfied -- see ./data/unit202-knowledge-obligations.ts):");
  lines.push(`  ${report.totals.acSemanticComplete}/${report.totals.acCount} ACs, ${report.totals.rangeItemsSemanticComplete}/${report.totals.rangeItemCount} Range items`);
  lines.push("");
  lines.push("DIRECT FACTUAL PROVENANCE:");
  lines.push(`  unsupported (no provenance at all): ${report.provenanceAudit.noProvenance.length}`);
  lines.push(`  syllabus-only technical (City & Guilds is the sole factual grounding): ${report.provenanceAudit.syllabusOnlyTechnical.length}`);
  lines.push(`  mismatched locators (CURRICULUM_REQUIRES cites a different AC than mapped): ${report.provenanceAudit.mismatchedLocators.length}`);
  lines.push(`  unresolved DERIVED_FROM targets: ${report.provenanceAudit.unresolvedDerivations.length}`);
  lines.push(`  invalid derivation kinds (EMPIRICAL_APPLICATION/INVALID_UNCLEAR/undeclared -- can never satisfy provenance): ${report.provenanceAudit.invalidDerivationKinds.length}`);
  if (report.provenanceAudit.noProvenance.length) lines.push(`    no provenance: ${report.provenanceAudit.noProvenance.join(", ")}`);
  if (report.provenanceAudit.syllabusOnlyTechnical.length) lines.push(`    syllabus-only: ${report.provenanceAudit.syllabusOnlyTechnical.join(", ")}`);
  if (report.provenanceAudit.mismatchedLocators.length) lines.push(`    mismatched: ${report.provenanceAudit.mismatchedLocators.join("; ")}`);
  if (report.provenanceAudit.invalidDerivationKinds.length) lines.push(`    invalid derivations: ${report.provenanceAudit.invalidDerivationKinds.join("; ")}`);
  lines.push("");
  lines.push("ENTAILMENT CLASSIFICATION (CC-09B.2 -- a bounded audit of the specific assertions/sources this package corrected or newly authored, never a full-corpus re-audit; see module header):");
  lines.push(`  assertions with >=1 explicitly classified (DIRECT/PARTIAL) provenance link: ${report.provenanceAudit.entailmentClassifiedCount}`);
  lines.push(`  PARTIAL-only support (every classified link is PARTIAL, none DIRECT -- expected for deliberate multi-source combinations, not itself a failure): ${report.provenanceAudit.partialSupportOnly.length}`);
  if (report.provenanceAudit.partialSupportOnly.length) lines.push(`    partial-only: ${report.provenanceAudit.partialSupportOnly.join(", ")}`);
  lines.push("");
  lines.push("INDEPENDENT VERIFICATION:");
  lines.push(`  assertions citing at least one still-UNVERIFIED source: ${report.provenanceAudit.unverifiedSourceCount} (reported, never a --check failure -- see ADR-0002)`);
  lines.push("");
  lines.push(`Underlying lesson-plan governance (validate-lesson-plan.ts): ${report.lessonPlanGovernanceClean ? "CLEAN" : "HAS ISSUES -- run npm run lesson:validate for detail"}`);
  lines.push("");
  lines.push("Per-Learning-Outcome exam-readiness (against the official 602 assessment specification):");
  for (const lo of report.loReadiness) {
    const pct = lo.officialQuestionPercentage !== null ? `${lo.officialQuestionPercentage}%` : "n/a";
    lines.push(
      `  LO${lo.number} (${lo.acAssessable}/${lo.acTotal} ACs assessable, ${lo.rangeItemsCovered}/${lo.rangeItemsTotal} range items covered, official ${lo.officialQuestionCount ?? "?"} questions / ${pct}): ${lo.examReady ? "READY" : "NOT READY"}`,
    );
  }
  lines.push("");
  const semanticByAcNumber = new Map(report.acSemantic.map((s) => [s.acNumber, s]));
  lines.push("Per-Assessment-Criterion coverage (backlog list) -- REFERENTIAL [tier] vs SEMANTIC [status]:");
  for (const ac of report.acCoverage) {
    const acNumberMatch = /-AC(\d+\.\d+)$/.exec(ac.code);
    const acNumber = acNumberMatch?.[1] ?? ac.code;
    const semantic = semanticByAcNumber.get(acNumber);
    const unsatisfied = semantic?.obligations.filter((o) => !o.satisfied).map((o) => o.id) ?? [];
    lines.push(
      `  ${ac.code} referential=[${ac.tier}] semantic=[${semantic?.status ?? "INCOMPLETE"}] assertions=${ac.assertionCount} capabilities=${ac.capabilityIds.length} lesson=${ac.hasLesson} masteryGate=${ac.hasMasteryGate} questionBlueprint=${ac.hasQuestionBlueprint} range=${ac.rangeItemsCovered}/${ac.rangeItemsTotal} -- ${ac.title}`,
    );
    if (!semantic?.obligationsDeclared) lines.push(`      (no knowledge-obligation decomposition declared -- semantic status forced INCOMPLETE)`);
    else if (unsatisfied.length) lines.push(`      unsatisfied obligations: ${unsatisfied.join(", ")}`);
  }
  return lines.join("\n");
}

function isReportClean(report: CoverageMatrixReport): boolean {
  // Deliberately ONLY structural defects -- coverage gaps are the
  // expected, honestly-reported backlog this report exists to surface,
  // never a `--check` failure (see module header).
  return report.structuralDefects.length === 0;
}

export { buildReport, formatReport, isReportClean };
export type { AcCoverage, AcSemantic, CoverageMatrixReport, LoReadiness, ProvenanceAudit, SemanticStatus };

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return fileURLToPath(import.meta.url) === entryPoint;
}

if (isMainModule()) {
  const report = buildReport();
  console.log(formatReport(report));
  const clean = isReportClean(report);
  console.log("");
  console.log(clean ? "PASS: no structural defects in the Unit 202 coverage matrix." : "FAIL: one or more structural defects in the Unit 202 coverage matrix.");
  if (process.argv.includes("--check") && !clean) {
    process.exit(1);
  }
}
