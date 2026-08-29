/**
 * CC-13B supplement to lesson-structure-audit.ts -- READ-ONLY. Produces a
 * character-length distribution and completionCondition breakdown for
 * every real step in release.unit202.v8, to sanity-check/calibrate the
 * "very short step" fragmentation threshold used in the main script
 * (which found 0 hits under its strict combined definition) against the
 * raw distribution, and to separately report duplicate/near-duplicate
 * recap-vs-completion pairs and duplicate consecutive RECAP steps.
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
const release = releaseManifest.releases.find((r) => r.id === MOBILE_BUNDLED_RELEASE_ID)!;
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

const buckets: Record<string, number> = { "0": 0, "1-49": 0, "50-89": 0, "90-149": 0, "150-249": 0, "250+": 0 };
const byCompletionCondition: Record<string, number> = {};
const byType: Record<string, number> = {};
const shortestSteps: Array<{ lessonId: string; stepId: string; type: string; completionCondition: string; chars: number; text: string }> = [];

for (const lesson of projection.lessons) {
  for (const step of lesson.steps as LessonStep[]) {
    const text = resolveBodyText(lesson, step);
    const chars = text.length;
    if (chars === 0) buckets["0"]++;
    else if (chars < 50) buckets["1-49"]++;
    else if (chars < 90) buckets["50-89"]++;
    else if (chars < 150) buckets["90-149"]++;
    else if (chars < 250) buckets["150-249"]++;
    else buckets["250+"]++;

    byCompletionCondition[step.completionCondition] = (byCompletionCondition[step.completionCondition] ?? 0) + 1;
    byType[step.type] = (byType[step.type] ?? 0) + 1;

    shortestSteps.push({ lessonId: lesson.id, stepId: step.id, type: step.type, completionCondition: step.completionCondition, chars, text });
  }
}

shortestSteps.sort((a, b) => a.chars - b.chars);

// consecutive RECAP-type steps in the same lesson (should basically never happen, but check)
const consecutiveRecapOrCompletionPairs: Array<{ lessonId: string; pair: string[] }> = [];
for (const lesson of projection.lessons) {
  for (let i = 0; i < lesson.steps.length - 1; i++) {
    const a = lesson.steps[i] as LessonStep;
    const b = lesson.steps[i + 1] as LessonStep;
    if ((a.type === "recap" || a.type === "exit_completion") && (b.type === "recap" || b.type === "exit_completion")) {
      consecutiveRecapOrCompletionPairs.push({ lessonId: lesson.id, pair: [a.id, b.id] });
    }
  }
}

console.log(
  JSON.stringify(
    {
      totalSteps: shortestSteps.length,
      bodyCharBuckets: buckets,
      byCompletionCondition,
      byType,
      shortest20Steps: shortestSteps.slice(0, 20),
      consecutiveRecapOrCompletionPairs,
    },
    null,
    2,
  ),
);
