/**
 * CC-09A: the Unit 202 Coverage & Assessment Matrix.
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
 * Two different kinds of finding, deliberately kept separate:
 *
 *  - STRUCTURAL DEFECTS (`--check` gates on these, exit 1): the
 *    curriculum skeleton itself is wrong -- an official LO/AC/Range-item
 *    count mismatch, a malformed parent chain, or an AssessmentSpecification
 *    referencing a Learning Outcome node that does not exist. These can
 *    never legitimately be true and mean this package itself has a bug.
 *  - COVERAGE GAPS (never gate `--check`): a real, correctly-represented
 *    curriculum requirement has no assertion/capability/lesson/question-
 *    blueprint yet. At CC-09A this is EXPECTED and is not a defect in
 *    this package -- it is the exact, mechanically-derived backlog later
 *    Sonnet batches populate. Reporting it honestly is this script's job;
 *    failing on it would defeat that job.
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
import { lessons } from "./data/lessons.ts";
import { unit202AssessmentSpecification } from "./data/unit202-assessment-specification.ts";
import { buildReport as buildLessonPlanReport, isReportClean as isLessonPlanReportClean } from "./validate-lesson-plan.ts";

const EXPECTED_LO_COUNT = 6;
const EXPECTED_AC_COUNT = 23;
const EXPECTED_RANGE_ITEM_COUNT = 58;

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
  totals: {
    loCount: number;
    acCount: number;
    rangeItemCount: number;
    acAssessable: number;
    acWithNoCoverage: number;
    rangeItemsCovered: number;
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
}): CoverageMatrixReport {
  const corpus = knowledgeGraphManifestSchema.parse(overrides?.curriculum ?? cc04Unit202ElectricalScience);
  const pedagogy = pedagogyManifestSchema.parse(cc05aPedagogyUnit202);
  const lessonManifest = lessonPlanManifestSchema.parse({ lessons });
  const specManifest = assessmentSpecificationManifestSchema.parse(overrides?.assessmentSpecification ?? unit202AssessmentSpecification);

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

  return {
    structuralDefects,
    acCoverage,
    loReadiness,
    totals: {
      loCount: loNodes.length,
      acCount: acNodes.length,
      rangeItemCount: rangeNodes.length,
      acAssessable: acCoverage.filter((ac) => ac.tier === "ASSESSABLE").length,
      acWithNoCoverage: acCoverage.filter((ac) => ac.tier === "NONE").length,
      rangeItemsCovered: acCoverage.reduce((sum, ac) => sum + ac.rangeItemsCovered, 0),
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
  lines.push(
    `Totals: ${report.totals.loCount} LOs, ${report.totals.acCount} ACs, ${report.totals.rangeItemCount} Range items -- ` +
      `${report.totals.acAssessable}/${report.totals.acCount} ACs fully ASSESSABLE, ${report.totals.acWithNoCoverage}/${report.totals.acCount} ACs with NO coverage, ` +
      `${report.totals.rangeItemsCovered}/${report.totals.rangeItemCount} Range items covered`,
  );
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
  lines.push("Per-Assessment-Criterion coverage (backlog list):");
  for (const ac of report.acCoverage) {
    lines.push(
      `  ${ac.code} [${ac.tier}] assertions=${ac.assertionCount} capabilities=${ac.capabilityIds.length} lesson=${ac.hasLesson} masteryGate=${ac.hasMasteryGate} questionBlueprint=${ac.hasQuestionBlueprint} range=${ac.rangeItemsCovered}/${ac.rangeItemsTotal} -- ${ac.title}`,
    );
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
export type { AcCoverage, CoverageMatrixReport, LoReadiness };

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
