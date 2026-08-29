/**
 * CC-13B (Whole Learning-Package & V1 Pipeline Integrity Audit) --
 * READ-ONLY mechanical analysis of the real, bundled Unit 202 corpus
 * (release.unit202.v8, the same release MOBILE_BUNDLED_RELEASE_ID names).
 *
 * This script performs NO writes, NO content changes, and does not
 * regenerate the mobile projection. It reuses the same pure, already-
 * governed `buildMobileContentProjection` function the real generator
 * (scripts/content/generate-mobile-projection.ts) uses, purely to obtain
 * an in-memory resolved view of the corpus (real lesson objects + real
 * resolved assertion statement text), then computes structural statistics
 * for the CC-13B lesson-depth/fragmentation and visual-coverage registers.
 *
 * Run:  node scripts/audit/lesson-structure-audit.ts
 * Output: JSON to stdout (redirect to a file under reports/ if wanted).
 */

import {
  contentReleaseManifestSchema,
  knowledgeGraphManifestSchema,
  lessonPlanManifestSchema,
  pedagogyManifestSchema,
  type LessonPlan,
  type LessonStep,
} from "@alp/content-schema";

import { buildMobileContentProjection } from "../content/generate-mobile-projection.ts";
import { cc04Unit202ElectricalScience } from "../content/data/cc04-unit202-electrical-science.ts";
import { cc05aPedagogyUnit202 } from "../content/data/cc05a-pedagogy-unit202.ts";
import { contentReleases, MOBILE_BUNDLED_RELEASE_ID } from "../content/data/content-releases.ts";
import { lessons } from "../content/data/lessons.ts";

const releaseManifest = contentReleaseManifestSchema.parse(contentReleases);
const release = releaseManifest.releases.find((r) => r.id === MOBILE_BUNDLED_RELEASE_ID);
if (!release) throw new Error(`bundled release '${MOBILE_BUNDLED_RELEASE_ID}' not found`);

const projection = buildMobileContentProjection({
  release,
  allLessons: lessonPlanManifestSchema.parse({ lessons }).lessons,
  pedagogy: pedagogyManifestSchema.parse(cc05aPedagogyUnit202),
  knowledgeGraph: knowledgeGraphManifestSchema.parse(cc04Unit202ElectricalScience),
});

const assertionStatements = projection.assertionStatements;

function resolveBodyText(lesson: LessonPlan, step: LessonStep): string {
  const ids = [...step.teaches, ...step.reinforces, ...step.tests];
  const statements = [...new Set(ids.map((id) => assertionStatements[id]).filter((s): s is string => Boolean(s)))];
  if (statements.length > 0) return statements.join(" ");
  if (step.type === "orientation") return lesson.learnerFacingDescription;
  if (step.type === "exit_completion") return lesson.completionCriteria.exitSummary;
  return "";
}

interface StepStat {
  lessonId: string;
  stepId: string;
  index: number;
  type: string;
  requirement: string;
  bodyChars: number;
  bodyStatementCount: number;
  hasDiagram: boolean;
  hasVisualAid: boolean;
  hasWorkedExample: boolean;
  hasFormula: boolean;
  hasAnyVisual: boolean;
  hasQuestionBlueprint: boolean;
  completionCondition: string;
  contentMayScroll: boolean;
  isVeryShort: boolean; // candidate one-sentence fragmentation
  routePolicy: string | undefined;
}

const SHORT_CHAR_THRESHOLD = 90; // roughly one short sentence

const stepStats: StepStat[] = [];
const lessonSummaries: Array<{
  lessonId: string;
  title: string;
  version: number;
  contentRelease: string;
  routePolicy: string | undefined;
  stepCount: number;
  totalVisualRefs: number; // diagram + visualAid across all steps
  distinctDiagramIds: string[];
  distinctVisualAidIds: string[];
  veryShortStepCount: number;
  veryShortStepRuns: Array<{ startIndex: number; endIndex: number; length: number; stepIds: string[] }>;
  hasZeroVisuals: boolean;
  recapAndCompletionSimilarity: { recapText: string; completionText: string; jaccardSimilarity: number } | null;
  semanticUnitPopulated: number;
  deliberateShortSectionReasonPopulated: number;
  textOnlyJustificationPopulated: boolean;
  mayRevealTargetAnswerCount: number;
  visualOpportunityAnalysisId: string | undefined;
  assessmentMappingIds: string[] | undefined;
  syllabusNodeIds: string[] | undefined;
  capabilityIds: string[] | undefined;
  prerequisiteCapabilityIds: string[] | undefined;
}> = [];

function jaccard(a: string, b: string): number {
  const wa = new Set(a.toLowerCase().split(/\W+/).filter(Boolean));
  const wb = new Set(b.toLowerCase().split(/\W+/).filter(Boolean));
  if (wa.size === 0 && wb.size === 0) return 0;
  const intersection = [...wa].filter((w) => wb.has(w)).length;
  const union = new Set([...wa, ...wb]).size;
  return union === 0 ? 0 : intersection / union;
}

for (const lesson of projection.lessons) {
  const diagramIds = new Set<string>();
  const visualAidIds = new Set<string>();
  let veryShortStepCount = 0;
  const veryShortFlags: boolean[] = [];
  let semanticUnitPopulated = 0;
  let deliberateShortSectionReasonPopulated = 0;
  let mayRevealTargetAnswerCount = 0;

  lesson.steps.forEach((step: LessonStep, index: number) => {
    const bodyText = resolveBodyText(lesson, step);
    const hasDiagram = Boolean(step.representation?.diagramBlueprintId);
    const hasVisualAid = Boolean(step.representation?.visualAidBlueprintId);
    const hasWorkedExample = Boolean(step.representation?.workedExampleBlueprintId);
    const hasFormula = Boolean(step.representation?.formulaFamilyId);
    const hasQuestionBlueprint = Boolean((step as unknown as { questionBlueprintId?: string }).questionBlueprintId);
    if (hasDiagram) diagramIds.add(step.representation!.diagramBlueprintId!);
    if (hasVisualAid) visualAidIds.add(step.representation!.visualAidBlueprintId!);

    // candidate "one-sentence fragmentation": short/no body text, no visual/worked-example/formula
    // attachment, and the step merely requires a Continue tap (view_acknowledged) rather than being
    // a deliberately short focused question/interaction.
    const isVeryShort =
      bodyText.length > 0 &&
      bodyText.length < SHORT_CHAR_THRESHOLD &&
      !hasDiagram &&
      !hasVisualAid &&
      !hasWorkedExample &&
      !hasFormula &&
      !hasQuestionBlueprint &&
      step.completionCondition === "view_acknowledged";

    if (isVeryShort) veryShortStepCount++;
    veryShortFlags.push(isVeryShort);

    const semanticUnit = (step as unknown as { semanticUnit?: string }).semanticUnit;
    const deliberateShortSectionReason = (step as unknown as { deliberateShortSectionReason?: string }).deliberateShortSectionReason;
    const mayRevealTargetAnswer = (step as unknown as { mayRevealTargetAnswer?: boolean }).mayRevealTargetAnswer;
    if (semanticUnit) semanticUnitPopulated++;
    if (deliberateShortSectionReason) deliberateShortSectionReasonPopulated++;
    if (mayRevealTargetAnswer) mayRevealTargetAnswerCount++;

    stepStats.push({
      lessonId: lesson.id,
      stepId: step.id,
      index,
      type: step.type,
      requirement: step.requirement,
      bodyChars: bodyText.length,
      bodyStatementCount: bodyText ? bodyText.split(". ").length : 0,
      hasDiagram,
      hasVisualAid,
      hasWorkedExample,
      hasFormula,
      hasAnyVisual: hasDiagram || hasVisualAid,
      hasQuestionBlueprint,
      completionCondition: step.completionCondition,
      contentMayScroll: step.presentation.contentMayScroll,
      isVeryShort,
      routePolicy: (lesson as unknown as { routePolicy?: string }).routePolicy,
    });
  });

  // find runs of consecutive very-short steps (length >= 2)
  const runs: Array<{ startIndex: number; endIndex: number; length: number; stepIds: string[] }> = [];
  let runStart: number | null = null;
  for (let i = 0; i <= veryShortFlags.length; i++) {
    const flag = i < veryShortFlags.length ? veryShortFlags[i] : false;
    if (flag && runStart === null) runStart = i;
    if (!flag && runStart !== null) {
      const length = i - runStart;
      if (length >= 2) {
        runs.push({
          startIndex: runStart,
          endIndex: i - 1,
          length,
          stepIds: lesson.steps.slice(runStart, i).map((s: LessonStep) => s.id),
        });
      }
      runStart = null;
    }
  }

  // recap vs completion similarity: find last RECAP-type step and the EXIT_COMPLETION resolved text
  // (this lesson corpus may have no exit_completion step at all -- CC-12G removed it from Ohm's Law;
  // completion is otherwise shown by lesson.completionCriteria.exitSummary regardless).
  const recapStep = [...lesson.steps].reverse().find((s: LessonStep) => s.type === "recap");
  let recapAndCompletionSimilarity: { recapText: string; completionText: string; jaccardSimilarity: number } | null = null;
  if (recapStep) {
    const recapText = resolveBodyText(lesson, recapStep);
    const completionText = lesson.completionCriteria.exitSummary;
    recapAndCompletionSimilarity = { recapText, completionText, jaccardSimilarity: jaccard(recapText, completionText) };
  }

  lessonSummaries.push({
    lessonId: lesson.id,
    title: lesson.title,
    version: lesson.version,
    contentRelease: lesson.contentRelease,
    routePolicy: (lesson as unknown as { routePolicy?: string }).routePolicy,
    stepCount: lesson.steps.length,
    totalVisualRefs: diagramIds.size + visualAidIds.size,
    distinctDiagramIds: [...diagramIds],
    distinctVisualAidIds: [...visualAidIds],
    veryShortStepCount,
    veryShortStepRuns: runs,
    hasZeroVisuals: diagramIds.size === 0 && visualAidIds.size === 0,
    recapAndCompletionSimilarity,
    semanticUnitPopulated,
    deliberateShortSectionReasonPopulated,
    textOnlyJustificationPopulated: Boolean((lesson as unknown as { textOnlyJustification?: string }).textOnlyJustification),
    mayRevealTargetAnswerCount,
    visualOpportunityAnalysisId: (lesson as unknown as { visualOpportunityAnalysisId?: string }).visualOpportunityAnalysisId,
    assessmentMappingIds: (lesson as unknown as { assessmentMappingIds?: string[] }).assessmentMappingIds,
    syllabusNodeIds: (lesson as unknown as { syllabusNodeIds?: string[] }).syllabusNodeIds,
    capabilityIds: (lesson as unknown as { capabilityIds?: string[] }).capabilityIds ?? lesson.targetCapabilityIds,
    prerequisiteCapabilityIds: (lesson as unknown as { prerequisiteCapabilityIds?: string[] }).prerequisiteCapabilityIds,
  });
}

const totalLessons = lessonSummaries.length;
const lessonsWithZeroVisuals = lessonSummaries.filter((l) => l.hasZeroVisuals);
const lessonsWithRoutePolicy = lessonSummaries.filter((l) => l.routePolicy === "CANONICAL_FIXED_ROUTE");
const totalSteps = stepStats.length;
const veryShortSteps = stepStats.filter((s) => s.isVeryShort);
const stepsWithAnyVisual = stepStats.filter((s) => s.hasAnyVisual);
const lessonsWithFragmentationRuns = lessonSummaries.filter((l) => l.veryShortStepRuns.length > 0);

const out = {
  release: release.id,
  totalLessonsInRelease: totalLessons,
  totalSteps,
  visualCoverage: {
    lessonsWithZeroVisualRefs: lessonsWithZeroVisuals.map((l) => ({ lessonId: l.lessonId, title: l.title, stepCount: l.stepCount })),
    lessonsWithZeroVisualRefsCount: lessonsWithZeroVisuals.length,
    stepsWithAnyVisualCount: stepsWithAnyVisual.length,
    stepsWithAnyVisualPct: Number(((stepsWithAnyVisual.length / totalSteps) * 100).toFixed(1)),
    totalDistinctDiagramRefs: new Set(lessonSummaries.flatMap((l) => l.distinctDiagramIds)).size,
    totalDistinctVisualAidRefs: new Set(lessonSummaries.flatMap((l) => l.distinctVisualAidIds)).size,
  },
  fragmentation: {
    veryShortStepThresholdChars: SHORT_CHAR_THRESHOLD,
    veryShortStepsCount: veryShortSteps.length,
    veryShortStepsPctOfTotal: Number(((veryShortSteps.length / totalSteps) * 100).toFixed(1)),
    lessonsWithAdjacentShortStepRuns: lessonsWithFragmentationRuns.map((l) => ({
      lessonId: l.lessonId,
      title: l.title,
      runs: l.veryShortStepRuns,
    })),
    lessonsWithAdjacentShortStepRunsCount: lessonsWithFragmentationRuns.length,
  },
  recapCompletionDuplication: lessonSummaries
    .filter((l) => l.recapAndCompletionSimilarity && l.recapAndCompletionSimilarity.jaccardSimilarity > 0.35)
    .map((l) => ({ lessonId: l.lessonId, ...l.recapAndCompletionSimilarity })),
  routePolicyAdoption: {
    lessonsDeclaringCanonicalFixedRoute: lessonsWithRoutePolicy.length,
    totalLessons,
  },
  contractAdoption: {
    semanticUnit: {
      stepsWithField: lessonSummaries.reduce((sum, l) => sum + l.semanticUnitPopulated, 0),
      totalSteps,
    },
    deliberateShortSectionReason: {
      stepsWithField: lessonSummaries.reduce((sum, l) => sum + l.deliberateShortSectionReasonPopulated, 0),
      totalSteps,
    },
    textOnlyJustification: {
      lessonsWithField: lessonSummaries.filter((l) => l.textOnlyJustificationPopulated).length,
      totalLessons,
    },
    mayRevealTargetAnswer: {
      stepsWithField: lessonSummaries.reduce((sum, l) => sum + l.mayRevealTargetAnswerCount, 0),
      totalSteps,
    },
    visualOpportunityAnalysisId: {
      lessonsWithField: lessonSummaries.filter((l) => Boolean(l.visualOpportunityAnalysisId)).length,
      totalLessons,
    },
    assessmentMappingIds: {
      lessonsWithField: lessonSummaries.filter((l) => l.assessmentMappingIds && l.assessmentMappingIds.length > 0).length,
      totalLessons,
    },
    syllabusNodeIds: {
      lessonsWithField: lessonSummaries.filter((l) => l.syllabusNodeIds && l.syllabusNodeIds.length > 0).length,
      totalLessons,
    },
  },
  perLessonSummary: lessonSummaries.map((l) => ({
    lessonId: l.lessonId,
    title: l.title,
    stepCount: l.stepCount,
    totalVisualRefs: l.totalVisualRefs,
    veryShortStepCount: l.veryShortStepCount,
    fragmentationRunCount: l.veryShortStepRuns.length,
    hasZeroVisuals: l.hasZeroVisuals,
    routePolicy: l.routePolicy ?? null,
  })),
};

console.log(JSON.stringify(out, null, 2));
