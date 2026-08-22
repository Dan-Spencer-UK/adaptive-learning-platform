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
 * CC-09C (COURSE EVIDENCE, CORPUS CONFIDENCE & RELEASE-GATE ARCHITECTURE)
 * adds two things on top of the above, both purely derived from dimensions
 * this module already computes -- never a new authored source of truth:
 *
 *  - The curriculum/scope-interpretation-vs-factual source split that
 *    CC-09A through CC-09B.6 decided by comparing a locator's source key
 *    against the hardcoded string `"src-cg-2365-02"` is now driven by the
 *    generic, governed `sourceRole` field (`@alp/content-schema`'s
 *    `sourceRoleSchema`) -- `isNonFactualAuthoritySource()` below excludes
 *    every non-factual role (NORMATIVE_CURRICULUM,
 *    AWARDING_BODY_SCOPE_INTERPRETATION, OFFICIAL_ASSESSMENT,
 *    OFFICIAL_PERFORMANCE_FEEDBACK, SME_ADJUDICATION), not just the one
 *    role Unit 202 happens to use today. City & Guilds' handbook is the
 *    one source in this corpus classified `NORMATIVE_CURRICULUM`; a second
 *    qualification/awarding body onboarded later needs no code change
 *    here, only its own sources classified the same way.
 *  - `releaseConfidence` (`ReleaseConfidenceAssessment`): a fourth,
 *    independently-derived dimension answering "can we credibly release this
 *    course, and if not, what MATERIAL uncertainty blocks us?" -- distinct
 *    from FORMAL COVERAGE and SEMANTIC KNOWLEDGE COMPLETENESS above (a
 *    corpus can be 100% formally covered and semantically complete while
 *    this is still LIMITED, if a MATERIAL `scopeUnresolved` question
 *    remains -- see unit202-knowledge-obligations.ts's `materiality`
 *    field). See ReleaseConfidenceAssessment's own doc comment for the
 *    full HIGH/GOOD/LIMITED rule and PROJECT-STATUS.md's CC-09C section
 *    for the architecture rationale.
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

/**
 * CC-09B.3 (task section 5): the ASSERTION-level entailment result,
 * distinct from PROVENANCE-LINK-level `supportType` (DIRECT/PARTIAL,
 * unchanged -- multiple PARTIAL links legitimately covering different
 * clauses is normal and expected at the link level). This is the
 * assertion-level synthesis of those links plus any DERIVED_FROM chain:
 *
 *  - FULLY_SUPPORTED_SINGLE_SOURCE: exactly one classified factual link,
 *    and it is DIRECT.
 *  - FULLY_SUPPORTED_MULTI_SOURCE: more than one classified factual link,
 *    and either every one is DIRECT, or the assertion's own
 *    `multiSourceFullyCovered` flag records that an author actually
 *    re-inspected the combination and confirmed it covers the whole
 *    statement (task section 6: never inferred merely from "more than one
 *    PARTIAL link exists").
 *  - FULLY_SUPPORTED_DERIVED: no direct factual link, but a valid
 *    MATHEMATICAL/LOGICAL_DEFINITIONAL DERIVED_FROM chain reaches a
 *    directly-sourced assertion.
 *  - PARTIALLY_SUPPORTED: classified factual link(s) exist, at least one
 *    is PARTIAL, and multi-source full coverage has not been confirmed --
 *    a genuine, unresolved gap. Per task section 6, an assertion here must
 *    NOT satisfy a semantic knowledge obligation.
 *  - UNSUPPORTED: no factual provenance at all (curriculum-only or none),
 *    and no valid derivation chain either.
 *  - PENDING_REVIEW: factual provenance exists but has not yet been
 *    classified (no link carries a `supportType`) -- this package's
 *    entailment audit is deliberately bounded (never a full-corpus
 *    re-audit, see the module header), so the vast majority of the corpus
 *    is honestly PENDING_REVIEW, not PARTIALLY_SUPPORTED -- and PENDING_
 *    REVIEW assertions are NOT blocked from satisfying an obligation
 *    (only a confirmed PARTIALLY_SUPPORTED result blocks one).
 */
type EntailmentStatus =
  | "FULLY_SUPPORTED_SINGLE_SOURCE"
  | "FULLY_SUPPORTED_MULTI_SOURCE"
  | "FULLY_SUPPORTED_DERIVED"
  | "PARTIALLY_SUPPORTED"
  | "UNSUPPORTED"
  | "PENDING_REVIEW";

/**
 * CC-09B.5 (SYLLABUS-SCOPE FIDELITY AND DEPTH CONTROL, task sections 2/10):
 * a SECOND, independent admissibility axis alongside EntailmentStatus.
 * EntailmentStatus answers "is this true according to inspected evidence?";
 * ScopeStatus answers "does the learner need this at this depth for the
 * governed curriculum?" -- passing one never substitutes for the other
 * (task section 2's two-axis rule). Derived, not separately authored: an
 * assertion's scope status follows from the strongest `basis`
 * (unit202-knowledge-obligations.ts) of any obligation it satisfies --
 * EXPLICIT/RANGE obligations make an assertion IN_SCOPE_REQUIRED;
 * NECESSARY_PREREQUISITE makes an EL assertion IN_SCOPE_SUPPORTING and an
 * FM/FP assertion FOUNDATIONAL_PREREQUISITE (task section 8's foundation-
 * layer distinction); SCOPE_UNRESOLVED obligations make their assertions
 * SCOPE_UNRESOLVED. An assertion that carries a real Unit 202 curriculum
 * mapping but is named by no obligation at all is ENRICHMENT_NOT_REQUIRED
 * -- referentially mapped, but never decomposed as a genuine syllabus
 * necessity (task section 20's explicit "the source contained this
 * interesting fact" prohibition). An assertion with no Unit 202 curriculum
 * mapping at all is out of scope of this classification entirely (pure
 * reusable horizontal foundation, task section 8.B) and is left
 * unclassified (`undefined`), never OUT_OF_SCOPE by default -- OUT_OF_SCOPE
 * is reserved for a Unit-202-mapped assertion an authoring review has
 * actively found does not belong (none currently, after this package's
 * corrections; see PROJECT-STATUS.md CC-09B.5).
 */
type ScopeStatus =
  | "IN_SCOPE_REQUIRED"
  | "IN_SCOPE_SUPPORTING"
  | "FOUNDATIONAL_PREREQUISITE"
  | "ENRICHMENT_NOT_REQUIRED"
  | "OUT_OF_SCOPE"
  | "SCOPE_UNRESOLVED";

interface ObligationResult {
  id: string;
  description: string;
  satisfied: boolean;
  /** CC-09B.4 (task section 15): carried through from the obligation's own `scopeUnresolved` note when present -- an explicit, surfaced curriculum-scope-interpretation flag, never a semantic-completeness gate on its own (the obligation may still be `satisfied` -- its assertions are genuinely sourced; only the BREADTH of the official Range item is unresolved). */
  scopeUnresolvedNote?: string;
  /** CC-09C (task sections 15-16): carried through from the obligation's own `scopeUnresolved.materiality` -- feeds the release-confidence assessment's material/non-material split. Present whenever `scopeUnresolvedNote` is. */
  scopeUnresolvedMateriality?: "MATERIAL" | "NON_MATERIAL";
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
  /** CC-09B.3: every assertion carrying a confirmed PARTIALLY_SUPPORTED entailment status (see EntailmentStatus) -- must be 0 for the corpus to be considered clean; a non-empty list is a genuine, named backlog item, never a --check failure by itself (structural defects remain the only --check gate) but always surfaced. */
  assertionLevelPartiallySupported: string[];
  /** Assertions citing at least one source whose sourceVersion.verificationStatus is not VERIFIED. Reported, never a failure -- independent verification is a separate, later step (ADR-0002). */
  unverifiedSourceCount: number;
}

/**
 * CC-09C (task sections 14-17): the derived, evidence-aware course/corpus
 * confidence state -- deliberately categorical, never a fabricated
 * percentage (task section 16 explicitly bans "93.7% confidence"-style
 * false precision; there is no mathematically defensible model for that
 * here). Distinct from, and never substitutable for, FORMAL COVERAGE and
 * SEMANTIC KNOWLEDGE COMPLETENESS above -- a corpus can show 100% formal
 * coverage while this assessment is LIMITED (task section 14's central
 * example).
 *
 *  - HIGH: GOOD, plus every source backing an IN_SCOPE_REQUIRED assertion
 *    is independently VERIFIED (ADR-0002) -- not yet reachable by the real
 *    Unit 202 corpus today (only the handbook itself is VERIFIED, and it
 *    is excluded from "factual" sourcing by design), which is an honest
 *    result, not a defect (task section 16: "do NOT make HIGH a universal
 *    release requirement").
 *  - GOOD: formal coverage complete, semantic knowledge complete, entailment
 *    clean (no UNSUPPORTED/PARTIALLY_SUPPORTED assertion among Unit-202-
 *    mapped knowledge), syllabus-scope-fidelity clean (no OUT_OF_SCOPE/
 *    ENRICHMENT_NOT_REQUIRED/SCOPE_UNRESOLVED assertion), and zero MATERIAL
 *    unresolved uncertainty. A valid, releaseable commercial-quality target
 *    (task section 17) -- perfection/verification is NOT required for GOOD.
 *  - LIMITED: any of the above GOOD criteria is unmet. Not a failure state
 *    -- may be entirely appropriate for internal development, research,
 *    beta or a course not yet ready for a strong alignment claim.
 */
type ReleaseConfidenceLevel = "HIGH" | "GOOD" | "LIMITED";

/** A single MATERIAL or NON_MATERIAL unresolved knowledge-obligation question, surfaced for human (targeted SME) adjudication -- see task section 18: the architecture must not require free-text archaeology to find these. */
interface MaterialUncertainty {
  acNumber: string;
  obligationId: string;
  note: string;
  materiality: "MATERIAL" | "NON_MATERIAL";
}

interface ReleaseConfidenceAssessment {
  level: ReleaseConfidenceLevel;
  /** GOOD or HIGH -- task section 17's release gate: "as close to perfect as practicably achievable", never "perfect or never release". */
  releaseReady: boolean;
  materialUncertainties: MaterialUncertainty[];
  nonMaterialUncertainties: MaterialUncertainty[];
  /** Human-readable reasons the level is what it is -- which specific criterion failed, never a bare label. */
  reasons: string[];
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
  /** CC-09B.3: assertion-level EntailmentStatus for every real assertion in the corpus -- see EntailmentStatus for the full rule. */
  entailmentStatusByAssertion: Record<string, EntailmentStatus>;
  /** CC-09B.5: assertion-level ScopeStatus for every Unit-202-curriculum-mapped assertion (undefined/absent for pure reusable-foundation assertions with no Unit 202 mapping) -- see ScopeStatus for the full rule. */
  scopeStatusByAssertion: Record<string, ScopeStatus>;
  /** CC-09C: the derived, evidence-aware course/corpus confidence and release-gate assessment -- see ReleaseConfidenceAssessment for the full rule. */
  releaseConfidence: ReleaseConfidenceAssessment;
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

  // ---- Structural gate 4 (CC-09B.4, task section 20.D): at most one
  // CURRENT sourceVersion per source. A source revision migration (e.g.
  // Vishay's 2006-labelled metadata actually being 2021 bytes; Holtek's
  // superseded 2002 mirror vs. the current 2022 official revision) must
  // leave exactly one unambiguous CURRENT snapshot per source -- two
  // CURRENT versions of the same source would make "which snapshot is
  // authoritative" undecidable, silently, for every assertion citing it. --
  const currentVersionsBySource = new Map<string, string[]>();
  for (const sv of corpus.sourceVersions) {
    if (sv.status !== "CURRENT") continue;
    if (!currentVersionsBySource.has(sv.sourceKey)) currentVersionsBySource.set(sv.sourceKey, []);
    currentVersionsBySource.get(sv.sourceKey)!.push(sv.key);
  }
  for (const [sourceKey, versionKeys] of currentVersionsBySource) {
    if (versionKeys.length > 1) {
      structuralDefects.push(
        `source '${sourceKey}' has ${versionKeys.length} sourceVersions simultaneously marked CURRENT (${versionKeys.join(", ")}) -- exactly one CURRENT snapshot per source is required; supersede the older one(s) explicitly`,
      );
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
  // CC-09B.3: entailment-status machinery, computed BEFORE semantic
  // completeness (moved up from its CC-09B.1/B.2 position) because
  // obligation satisfaction (task section 6) must be able to check an
  // assertion's assertion-level entailment status, not merely whether its
  // id is named. `assertionVersionByIdentifier` reads the corpus's own
  // `multiSourceFullyCovered` authoring flag (never inferred).
  // =====================================================================
  const realAssertionIds = new Set(corpus.assertions.map((a) => a.identifier));
  const assertionVersionByIdentifier = new Map(corpus.assertionVersions.map((v) => [v.assertionIdentifier, v]));
  const sourceKeyBySourceVersionKey = new Map(corpus.sourceVersions.map((sv) => [sv.key, sv.sourceKey]));
  const sourceVersionKeyByLocatorKey = new Map(corpus.sourceLocators.map((sl) => [sl.key, sl.sourceVersionKey]));
  // CC-09C (task section 8/35.11): which sources are NOT valid factual
  // authority is now derived from the generic, governed `sourceRole` field
  // (see knowledge-graph.ts's sourceRoleSchema) instead of a hardcoded
  // Unit-202-specific source key -- the exact "has Unit 202/SmartScreen
  // terminology leaked into what should be a generic architecture?"
  // adversarial-review question (task section 35.11) this package exists
  // to close.
  //
  // NORMATIVE_CURRICULUM, AWARDING_BODY_SCOPE_INTERPRETATION,
  // OFFICIAL_ASSESSMENT, OFFICIAL_PERFORMANCE_FEEDBACK and SME_ADJUDICATION
  // are all, by this module's own governing rule (task section 6: "official
  // teaching intent does not override physical truth" / CC-09B.6's "official
  // teaching material resolves SCOPE only, never FACT"), never themselves
  // factual authority -- a link citing one of these can never satisfy
  // entailment on its own, regardless of how confidently it establishes
  // curriculum scope. An earlier version of this check excluded ONLY
  // NORMATIVE_CURRICULUM, which meant a source later classified
  // AWARDING_BODY_SCOPE_INTERPRETATION (e.g. an official teaching-scope
  // handout) would have silently started counting as factual evidence --
  // exactly the "official teaching material becomes factual truth by
  // accident" failure mode CC-09B.6 exists to prevent, caught by
  // independent adversarial review before any source was actually
  // reclassified this way. FACTUAL_AUTHORITY, ENDORSED_OR_ASSOCIATED and
  // EXTERNAL_DISCOVERY_OR_CORROBORATION sources, and every unclassified
  // source (the vast majority -- see task section 32's migration
  // discipline), continue to count as factual, matching this module's
  // pre-CC-09C behaviour for every source other than the one now
  // explicitly classified NORMATIVE_CURRICULUM.
  const NON_FACTUAL_SOURCE_ROLES = new Set([
    "NORMATIVE_CURRICULUM",
    "AWARDING_BODY_SCOPE_INTERPRETATION",
    "OFFICIAL_ASSESSMENT",
    "OFFICIAL_PERFORMANCE_FEEDBACK",
    "SME_ADJUDICATION",
  ]);
  const sourceRoleBySourceKey = new Map(corpus.sources.map((s) => [s.key, s.sourceRole]));
  function isNonFactualAuthoritySource(sourceKey: string | undefined): boolean {
    if (sourceKey === undefined) return false;
    const role = sourceRoleBySourceKey.get(sourceKey);
    return role !== undefined && NON_FACTUAL_SOURCE_ROLES.has(role);
  }
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
      return !isNonFactualAuthoritySource(srcKey);
    });
  }

  /** Only links to a genuine factual-authority source count as "factual" for entailment purposes -- a curriculum-authority, teaching-scope-interpretation, official-assessment, performance-feedback or SME-adjudication source establishes WHAT must be taught (or how confidently), never the technical fact itself. CC-09C: this is now the generic `sourceRole` classification (see NON_FACTUAL_SOURCE_ROLES above), not a hardcoded source key. */
  function factualLinks(assertionId: string) {
    const links = provenanceByAssertion.get(assertionId) ?? [];
    return links.filter((link) => {
      const svKey = sourceVersionKeyByLocatorKey.get(link.sourceLocatorKey);
      const srcKey = svKey ? sourceKeyBySourceVersionKey.get(svKey) : undefined;
      return !isNonFactualAuthoritySource(srcKey);
    });
  }

  /** CC-09B.3 (task sections 5-7): the assertion-level entailment synthesis -- see EntailmentStatus for the full rule. */
  function entailmentStatusFor(assertionId: string): EntailmentStatus {
    const links = factualLinks(assertionId);
    const classified = links.filter((link) => link.supportType !== undefined);

    if (links.length === 0) {
      return derivesFromSourcedAssertion(assertionId) ? "FULLY_SUPPORTED_DERIVED" : "UNSUPPORTED";
    }
    if (classified.length === 0) {
      return "PENDING_REVIEW";
    }
    if (classified.length === 1) {
      return classified[0]!.supportType === "DIRECT" ? "FULLY_SUPPORTED_SINGLE_SOURCE" : "PARTIALLY_SUPPORTED";
    }
    // Multiple classified links.
    if (classified.every((link) => link.supportType === "DIRECT")) {
      return "FULLY_SUPPORTED_MULTI_SOURCE";
    }
    const version = assertionVersionByIdentifier.get(assertionId);
    if (version?.multiSourceFullyCovered === true) {
      // CC-09B.4 (task section 20.E): a bare Boolean is never sufficient
      // on its own -- an assertion relying on multiSourceFullyCovered to
      // reach a fully-supported status must also carry an explicit,
      // auditable clause/evidence coverage record, or this is itself a
      // structural defect (the flag would be unverifiable trust-me
      // metadata, exactly what the task exists to prevent).
      if (!version.clauseCoverage || version.clauseCoverage.length === 0) {
        structuralDefects.push(
          `${assertionId} sets multiSourceFullyCovered but declares no clauseCoverage -- a bare Boolean is not sufficient auditable evidence of multi-source full coverage`,
        );
      }
      return "FULLY_SUPPORTED_MULTI_SOURCE";
    }
    return "PARTIALLY_SUPPORTED";
  }

  // =====================================================================
  // CC-09B.5 (SYLLABUS-SCOPE FIDELITY AND DEPTH CONTROL): the second,
  // independent admissibility axis (task section 2). Derived from
  // unit202-knowledge-obligations.ts's own `basis` field -- never
  // separately hand-classified per assertion, so there is exactly one
  // place a reviewer edits to change an assertion's scope justification.
  // =====================================================================
  const obligationBasisByAssertion = new Map<string, { basis: string; acNumber: string; obligationId: string }[]>();
  for (const set of obligationSets) {
    for (const obligation of set.obligations) {
      for (const id of obligation.satisfiedBy) {
        if (!obligationBasisByAssertion.has(id)) obligationBasisByAssertion.set(id, []);
        obligationBasisByAssertion.get(id)!.push({ basis: obligation.basis, acNumber: set.acNumber, obligationId: obligation.id });
      }
    }
  }
  const r2CurriculumNodeKeys = new Set(corpus.curriculumNodes.filter((n) => n.curriculumVersionKey === CV_KEY_R2).map((n) => n.key));
  const hasR2Mapping = new Set(
    corpus.assertionCurriculumMappings.filter((m) => r2CurriculumNodeKeys.has(m.curriculumNodeKey)).map((m) => m.assertionIdentifier),
  );
  // Whether an assertion carries a REQUIRED_FOR (not merely SUPPORTS/
  // EXEMPLIFIES) mapping to an R2 node -- a pre-existing, already-governed
  // CC-09A field, reused (never duplicated) as the fallback signal below.
  const hasRequiredForR2Mapping = new Set(
    corpus.assertionCurriculumMappings
      .filter((m) => r2CurriculumNodeKeys.has(m.curriculumNodeKey) && m.mappingType === "REQUIRED_FOR")
      .map((m) => m.assertionIdentifier),
  );
  const domainByAssertion = new Map(corpus.assertions.map((a) => [a.identifier, a.domainCode]));

  /** CC-09B.5 (task sections 2/10): undefined for an assertion with no Unit 202 curriculum mapping at all (pure reusable horizontal foundation is out of this classification's scope entirely, task section 8.B -- never defaulted to OUT_OF_SCOPE). */
  function scopeStatusFor(assertionId: string): ScopeStatus | undefined {
    if (!hasR2Mapping.has(assertionId)) return undefined;
    const bases = obligationBasisByAssertion.get(assertionId) ?? [];
    if (bases.length === 0) {
      if (!hasRequiredForR2Mapping.has(assertionId)) {
        // Curriculum-mapped only as SUPPORTS/EXEMPLIFIES (never claimed
        // REQUIRED_FOR) and not separately decomposed as its own knowledge
        // obligation -- the mapping type itself is the already-reviewed
        // CC-09A authoring judgment that this is legitimate supporting/
        // illustrative content, not a core required proposition. Spot-
        // checked against the real corpus (CC-09B.5): comparison/
        // prediction/interpretation/calculation-support assertions such as
        // motor-vs-generator comparison, oscilloscope-for-sine-waves, and
        // series/parallel fault-prediction all fall here and are genuinely
        // proportionate -- never "the source contained this interesting
        // fact" (task section 20), which is what ENRICHMENT_NOT_REQUIRED
        // is reserved for.
        const domain = domainByAssertion.get(assertionId);
        return domain === "FM" || domain === "FP" ? "FOUNDATIONAL_PREREQUISITE" : "IN_SCOPE_SUPPORTING";
      }
      // Claims REQUIRED_FOR an AC/Range item yet no knowledge obligation
      // anywhere names it -- a genuine decomposition gap (or, on individual
      // review, source-shaped over-scope). Never silently swept in as
      // required knowledge, and never silently swept out as enrichment
      // either -- both are unverified guesses until an obligation is
      // authored or the mapping itself is corrected.
      return "SCOPE_UNRESOLVED";
    }
    // CC-09B.6 (task section 22): OFFICIAL_TEACHING_INTERPRETATION is a
    // third, independent route to genuine curriculum-scope justification
    // (official teaching material resolving what the bare handbook
    // AC/Range wording alone could not) -- equally admissible as
    // EXPLICIT/RANGE for the Mandatory Knowledge Gate, never a lesser
    // tier. CC-09D (Unit 202 Official Public Assessment Calibration) adds
    // OFFICIAL_ASSESSMENT_EVIDENCE as a fourth, equally admissible route,
    // now that it is genuinely populated for the first time from real
    // official 2365-602 sample-assessment evidence (previously reserved-
    // but-unreachable per CC-09B.6/CC-09C) -- official assessment evidence
    // demonstrating a proposition is assessable is exactly as strong a
    // curriculum-scope justification as official teaching-scope evidence,
    // never a lesser tier.
    if (
      bases.some(
        (b) =>
          b.basis === "EXPLICIT" ||
          b.basis === "RANGE" ||
          b.basis === "OFFICIAL_TEACHING_INTERPRETATION" ||
          b.basis === "OFFICIAL_ASSESSMENT_EVIDENCE",
      )
    )
      return "IN_SCOPE_REQUIRED";
    if (bases.some((b) => b.basis === "NECESSARY_PREREQUISITE")) {
      const domain = domainByAssertion.get(assertionId);
      return domain === "FM" || domain === "FP" ? "FOUNDATIONAL_PREREQUISITE" : "IN_SCOPE_SUPPORTING";
    }
    return "SCOPE_UNRESOLVED";
  }

  // =====================================================================
  // CC-09B.1: semantic knowledge completeness (never inferred from
  // assertion/mapping counts -- see the module header's "false-green"
  // rationale). Cross-checks every declared obligation's satisfiedBy
  // assertion ids against the real corpus: an obligation naming an id
  // that does not exist is a structural defect (this package's own bug),
  // never silently treated as unsatisfied. CC-09B.3 additionally requires
  // (task section 6) that a satisfying assertion's entailment status is
  // not a confirmed PARTIALLY_SUPPORTED -- PENDING_REVIEW (the vast
  // majority of the corpus, never audited by this bounded package) still
  // counts, since "not yet classified" is not the same claim as "found
  // deficient".
  // =====================================================================
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
      const knownIds = obligation.satisfiedBy.filter((id) => realAssertionIds.has(id));
      // CC-09B.5 (task section 11, MANDATORY KNOWLEDGE GATE): an
      // obligation's own `basis` (EXPLICIT/RANGE/NECESSARY_PREREQUISITE)
      // already determines every one of its satisfiedBy assertions'
      // ScopeStatus by construction (never ENRICHMENT_NOT_REQUIRED/
      // OUT_OF_SCOPE/SCOPE_UNRESOLVED for an id genuinely named here) --
      // this filter is a defensive structural check, not the primary
      // mechanism, guarding against a future inconsistent edit.
      const resolvedIds = knownIds.filter((id) => {
        if (entailmentStatusFor(id) === "PARTIALLY_SUPPORTED") return false;
        const scope = scopeStatusFor(id);
        return scope === undefined || scope === "IN_SCOPE_REQUIRED" || scope === "IN_SCOPE_SUPPORTING" || scope === "FOUNDATIONAL_PREREQUISITE";
      });
      const unknownIds = obligation.satisfiedBy.filter((id) => !realAssertionIds.has(id));
      if (unknownIds.length > 0) {
        structuralDefects.push(
          `knowledge obligation '${acNumber}:${obligation.id}' names unknown assertion id(s): ${unknownIds.join(", ")}`,
        );
        unresolvedObligationIds.push(obligation.id);
      }
      return {
        id: obligation.id,
        description: obligation.description,
        satisfied: resolvedIds.length > 0,
        scopeUnresolvedNote: obligation.scopeUnresolved?.note,
        scopeUnresolvedMateriality: obligation.scopeUnresolved?.materiality,
      };
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
  // Reuses the entailment machinery computed above (CC-09B.3) rather than
  // redefining it a second time.
  // =====================================================================
  const verificationStatusBySourceVersionKey = new Map(corpus.sourceVersions.map((sv) => [sv.key, sv.verificationStatus]));

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
  const assertionLevelPartiallySupported: string[] = [];
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

    // CC-09B.2: link-level classification (task section 30) -- a
    // deliberately bounded, honestly-scoped transparency metric, not a
    // retroactive re-audit of every pre-existing provenance link. NOTE:
    // "every classified link is PARTIAL" is a LINK-level observation and
    // is NOT itself a defect (task section 5) -- it is normal whenever
    // several sources each cover one clause of a compound statement. The
    // ASSERTION-level question ("do they jointly cover the WHOLE
    // statement?") is answered separately by entailmentStatusFor() below.
    const classifiedLinks = links.filter((link) => link.supportType !== undefined);
    if (classifiedLinks.length > 0) {
      entailmentClassifiedCount++;
      if (classifiedLinks.every((link) => link.supportType === "PARTIAL")) {
        partialSupportOnly.push(assertion.identifier);
      }
    }
    // CC-09B.3 (task section 6): the assertion-level gate. Only a
    // confirmed PARTIALLY_SUPPORTED result lands here -- PENDING_REVIEW
    // (not yet classified at all) is deliberately excluded, since this
    // package's audit is bounded, not a full-corpus re-audit.
    if (entailmentStatusFor(assertion.identifier) === "PARTIALLY_SUPPORTED") {
      assertionLevelPartiallySupported.push(assertion.identifier);
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
    assertionLevelPartiallySupported,
    unverifiedSourceCount,
  };

  const entailmentStatusByAssertion: Record<string, EntailmentStatus> = {};
  const scopeStatusByAssertion: Record<string, ScopeStatus> = {};
  for (const assertion of corpus.assertions) {
    entailmentStatusByAssertion[assertion.identifier] = entailmentStatusFor(assertion.identifier);
    const scope = scopeStatusFor(assertion.identifier);
    if (scope !== undefined) scopeStatusByAssertion[assertion.identifier] = scope;
  }

  // =====================================================================
  // CC-09C (task sections 14-17): COURSE-EVIDENCE RELEASE CONFIDENCE. A
  // derived assessment, never a fourth authored source of truth -- purely
  // a function of the dimensions already computed above. See
  // ReleaseConfidenceAssessment for the full HIGH/GOOD/LIMITED rule.
  // =====================================================================
  const materialUncertainties: MaterialUncertainty[] = [];
  const nonMaterialUncertainties: MaterialUncertainty[] = [];
  for (const semantic of acSemantic) {
    for (const obligation of semantic.obligations) {
      if (!obligation.scopeUnresolvedNote) continue;
      const entry: MaterialUncertainty = {
        acNumber: semantic.acNumber,
        obligationId: obligation.id,
        note: obligation.scopeUnresolvedNote,
        // An unresolved question with no stated materiality is treated as
        // MATERIAL by default -- never silently downgraded to non-blocking
        // (task section 15: "the system should not hide material
        // uncertainty behind green coverage counts"). In practice
        // `materiality` is always set alongside `scopeUnresolved` (see
        // unit202-knowledge-obligations.ts's own type), so this default is
        // a defensive fallback, never the primary mechanism.
        materiality: obligation.scopeUnresolvedMateriality ?? "MATERIAL",
      };
      if (entry.materiality === "MATERIAL") materialUncertainties.push(entry);
      else nonMaterialUncertainties.push(entry);
    }
  }

  const formalCoverageComplete =
    structuralDefects.length === 0 &&
    loNodes.length === EXPECTED_LO_COUNT &&
    acNodes.length === EXPECTED_AC_COUNT &&
    rangeNodes.length === EXPECTED_RANGE_ITEM_COUNT;
  const semanticCompleteAll =
    acSemantic.every((s) => s.status === "COMPLETE_PENDING_VERIFICATION") && rangeItemsSemanticComplete === rangeNodes.length;
  const unitScopedEntailmentStatuses = Object.keys(scopeStatusByAssertion).map((id) => entailmentStatusByAssertion[id]);
  const entailmentClean = unitScopedEntailmentStatuses.every((status) => status !== "UNSUPPORTED" && status !== "PARTIALLY_SUPPORTED");
  const scopeClean = Object.values(scopeStatusByAssertion).every(
    (status) => status !== "OUT_OF_SCOPE" && status !== "ENRICHMENT_NOT_REQUIRED" && status !== "SCOPE_UNRESOLVED",
  );

  const releaseConfidenceReasons: string[] = [];
  if (!formalCoverageComplete) releaseConfidenceReasons.push("formal curriculum coverage is not complete (structural defect, or an LO/AC/Range-item count mismatch)");
  if (!semanticCompleteAll) releaseConfidenceReasons.push("semantic knowledge completeness is not 100% (some AC/Range item has an unsatisfied knowledge obligation)");
  if (!entailmentClean) releaseConfidenceReasons.push("at least one Unit-202-scoped assertion is UNSUPPORTED or PARTIALLY_SUPPORTED");
  if (!scopeClean) releaseConfidenceReasons.push("at least one Unit-202-scoped assertion is OUT_OF_SCOPE, ENRICHMENT_NOT_REQUIRED or SCOPE_UNRESOLVED");
  if (materialUncertainties.length > 0) {
    releaseConfidenceReasons.push(
      `${materialUncertainties.length} MATERIAL unresolved knowledge-obligation ${materialUncertainties.length === 1 ? "question remains" : "questions remain"} (task section 34 gate A: full formal coverage never overrides this)`,
    );
  }

  const goodCriteriaMet = formalCoverageComplete && semanticCompleteAll && entailmentClean && scopeClean && materialUncertainties.length === 0;
  let releaseConfidenceLevel: ReleaseConfidenceLevel;
  if (!goodCriteriaMet) {
    releaseConfidenceLevel = "LIMITED";
  } else {
    // HIGH additionally requires every source backing an IN_SCOPE_REQUIRED
    // assertion to be independently VERIFIED (ADR-0002) -- deliberately
    // NOT required for GOOD (task section 17: perfection is not a release
    // requirement; GOOD is a valid commercial-quality target).
    const requiredAssertionIds = Object.entries(scopeStatusByAssertion)
      .filter(([, status]) => status === "IN_SCOPE_REQUIRED")
      .map(([id]) => id);
    const allRequiredSourcesVerified = requiredAssertionIds.every((id) => {
      const links = factualLinks(id);
      // No direct factual link of its own (FULLY_SUPPORTED_DERIVED reaches
      // verification transitively through its DERIVED_FROM chain, already
      // proven non-UNSUPPORTED by entailmentClean above) -- nothing further
      // to check here.
      if (links.length === 0) return true;
      return links.every((link) => {
        const svKey = sourceVersionKeyByLocatorKey.get(link.sourceLocatorKey);
        return svKey ? verificationStatusBySourceVersionKey.get(svKey) === "VERIFIED" : false;
      });
    });
    if (!allRequiredSourcesVerified) {
      releaseConfidenceReasons.push(
        "not every source backing a required (IN_SCOPE_REQUIRED) assertion is independently VERIFIED per ADR-0002 -- GOOD, not yet HIGH",
      );
    }
    releaseConfidenceLevel = allRequiredSourcesVerified ? "HIGH" : "GOOD";
  }

  const releaseConfidence: ReleaseConfidenceAssessment = {
    level: releaseConfidenceLevel,
    releaseReady: releaseConfidenceLevel === "GOOD" || releaseConfidenceLevel === "HIGH",
    materialUncertainties,
    nonMaterialUncertainties,
    reasons: releaseConfidenceReasons,
  };

  return {
    structuralDefects,
    acCoverage,
    loReadiness,
    acSemantic,
    provenanceAudit,
    entailmentStatusByAssertion,
    scopeStatusByAssertion,
    releaseConfidence,
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
  const scopeUnresolved = report.acSemantic.flatMap((s) => s.obligations.filter((o) => o.scopeUnresolvedNote).map((o) => ({ acNumber: s.acNumber, obligation: o })));
  if (scopeUnresolved.length) {
    lines.push(`  CURRICULUM-SCOPE-UNRESOLVED obligations (task section 15 -- satisfied by genuinely sourced knowledge, but the official Range item's full intended BREADTH cannot be independently certified from available material; never a semantic-completeness gate on its own): ${scopeUnresolved.length}`);
    for (const { acNumber, obligation } of scopeUnresolved) {
      lines.push(`    AC${acNumber}:${obligation.id} -- ${obligation.scopeUnresolvedNote}`);
    }
  }
  lines.push("");
  lines.push("SYLLABUS-SCOPE FIDELITY (CC-09B.5, task section 2 -- the second, independent admissibility axis; passing evidence entailment above never substitutes for this):");
  {
    const scopeCounts: Record<ScopeStatus, number> = {
      IN_SCOPE_REQUIRED: 0,
      IN_SCOPE_SUPPORTING: 0,
      FOUNDATIONAL_PREREQUISITE: 0,
      ENRICHMENT_NOT_REQUIRED: 0,
      OUT_OF_SCOPE: 0,
      SCOPE_UNRESOLVED: 0,
    };
    for (const status of Object.values(report.scopeStatusByAssertion)) scopeCounts[status]++;
    lines.push(`  ${Object.values(report.scopeStatusByAssertion).length} R2-curriculum-mapped assertions classified:`);
    for (const key of Object.keys(scopeCounts) as ScopeStatus[]) {
      lines.push(`    ${key}: ${scopeCounts[key]}`);
    }
    const flaggedEnrichment = Object.entries(report.scopeStatusByAssertion).filter(([, s]) => s === "ENRICHMENT_NOT_REQUIRED").map(([id]) => id);
    const flaggedOutOfScope = Object.entries(report.scopeStatusByAssertion).filter(([, s]) => s === "OUT_OF_SCOPE").map(([id]) => id);
    const flaggedUnresolved = Object.entries(report.scopeStatusByAssertion).filter(([, s]) => s === "SCOPE_UNRESOLVED").map(([id]) => id);
    if (flaggedEnrichment.length) lines.push(`  ENRICHMENT_NOT_REQUIRED (source-shaped, may not enter Mandatory Knowledge Gate): ${flaggedEnrichment.join(", ")}`);
    if (flaggedOutOfScope.length) lines.push(`  OUT_OF_SCOPE: ${flaggedOutOfScope.join(", ")}`);
    if (flaggedUnresolved.length) lines.push(`  SCOPE_UNRESOLVED (needs obligation-decomposition or curriculum-mapping review): ${flaggedUnresolved.join(", ")}`);
  }
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
  lines.push("ENTAILMENT CLASSIFICATION (CC-09B.2/B.3 -- a bounded audit of the specific assertions/sources this package corrected or newly authored, never a full-corpus re-audit; see module header):");
  lines.push(`  assertions with >=1 explicitly classified (DIRECT/PARTIAL) provenance link: ${report.provenanceAudit.entailmentClassifiedCount}`);
  lines.push(`  LINK-level PARTIAL-only (every classified link is PARTIAL, none DIRECT -- normal/expected whenever multiple sources each cover one clause; NOT itself a defect, see CC-09B.3): ${report.provenanceAudit.partialSupportOnly.length}`);
  if (report.provenanceAudit.partialSupportOnly.length) lines.push(`    link-level partial-only: ${report.provenanceAudit.partialSupportOnly.join(", ")}`);
  lines.push(`  ASSERTION-level PARTIALLY_SUPPORTED (combined evidence confirmed to leave a material clause uncovered -- CANNOT satisfy a semantic obligation, task section 6): ${report.provenanceAudit.assertionLevelPartiallySupported.length}`);
  if (report.provenanceAudit.assertionLevelPartiallySupported.length) lines.push(`    assertion-level partial: ${report.provenanceAudit.assertionLevelPartiallySupported.join(", ")}`);
  lines.push("");
  lines.push("INDEPENDENT VERIFICATION:");
  lines.push(`  assertions citing at least one still-UNVERIFIED source: ${report.provenanceAudit.unverifiedSourceCount} (reported, never a --check failure -- see ADR-0002)`);
  lines.push("");
  lines.push("COURSE-EVIDENCE RELEASE CONFIDENCE (CC-09C, task sections 14-17 -- \"can we credibly release this course? if not, what MATERIAL uncertainty blocks us?\"):");
  lines.push(`  level: ${report.releaseConfidence.level} (release-ready: ${report.releaseConfidence.releaseReady ? "YES" : "NO"})`);
  if (report.releaseConfidence.reasons.length) {
    lines.push("  reasons:");
    for (const reason of report.releaseConfidence.reasons) lines.push(`    - ${reason}`);
  }
  lines.push(
    `  MATERIAL unresolved uncertainty (blocks GOOD/HIGH): ${report.releaseConfidence.materialUncertainties.length}` +
      (report.releaseConfidence.materialUncertainties.length
        ? ` -- ${report.releaseConfidence.materialUncertainties.map((u) => `AC${u.acNumber}:${u.obligationId}`).join(", ")}`
        : ""),
  );
  lines.push(
    `  NON_MATERIAL unresolved uncertainty (never blocks release on its own): ${report.releaseConfidence.nonMaterialUncertainties.length}` +
      (report.releaseConfidence.nonMaterialUncertainties.length
        ? ` -- ${report.releaseConfidence.nonMaterialUncertainties.map((u) => `AC${u.acNumber}:${u.obligationId}`).join(", ")}`
        : ""),
  );
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
export type {
  AcCoverage,
  AcSemantic,
  CoverageMatrixReport,
  EntailmentStatus,
  LoReadiness,
  MaterialUncertainty,
  ProvenanceAudit,
  ReleaseConfidenceAssessment,
  ReleaseConfidenceLevel,
  ScopeStatus,
  SemanticStatus,
};

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
