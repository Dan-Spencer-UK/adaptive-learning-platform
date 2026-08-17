/**
 * Deterministic prerequisite-remediation candidate resolution (task
 * brief §8). Package A (@alp/content-schema's lesson-plan.ts)
 * deliberately does not store a brittle `remediationLessonId` pointer
 * on `prerequisiteKnowledge` -- the resolution rule adopted here is
 * "manifest uniqueness invariant" (the brief's option A): for a given
 * content release, at most one governed lesson may declare a given
 * assertion family among its `targetAssertionFamilyIds`. That
 * invariant is mechanically enforced at content-authoring time by
 * scripts/content/validate-lesson-plan.ts's
 * `ambiguousPrimaryFamilyTargets` gate, so by the time content reaches
 * this engine, resolution is unique by construction -- but this module
 * re-verifies defensively rather than trusting that upstream gate ran,
 * and throws rather than guessing if it ever finds more than one
 * candidate (never "first match", never insertion order).
 */

import type { LessonPlan } from "@alp/content-schema";
import { AmbiguousPrerequisiteCandidatesError } from "./types.ts";

export type PrerequisiteResolution =
  | { readonly status: "resolved"; readonly lesson: LessonPlan }
  | { readonly status: "unresolved" };

/**
 * Only candidates sharing `forLesson.contentRelease` are considered --
 * a lesson from a different content release is never an eligible
 * remediation target, regardless of what `allLessons` contains.
 */
export function resolvePrerequisiteCandidate(
  assertionFamilyId: string,
  allLessons: readonly LessonPlan[],
  forLesson: LessonPlan,
): PrerequisiteResolution {
  const candidates = allLessons.filter(
    (lesson) =>
      lesson.id !== forLesson.id &&
      lesson.contentRelease === forLesson.contentRelease &&
      lesson.targetAssertionFamilyIds.includes(assertionFamilyId),
  );

  if (candidates.length === 0) {
    return { status: "unresolved" };
  }
  if (candidates.length > 1) {
    throw new AmbiguousPrerequisiteCandidatesError(
      assertionFamilyId,
      candidates.map((c) => c.id),
    );
  }
  return { status: "resolved", lesson: candidates[0]! };
}
