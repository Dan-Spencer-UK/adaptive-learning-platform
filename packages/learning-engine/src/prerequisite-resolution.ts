/**
 * Deterministic prerequisite-remediation candidate resolution (task
 * brief §8, corrected by the Package B "bounded architecture
 * correction" brief §2-§7). An earlier revision of this module enforced
 * "at most one lesson per content release may target a given assertion
 * family" globally via `targetAssertionFamilyIds` -- that was wrong at
 * scale: many ordinary lessons (an introduction, a refresher, exam
 * revision, retrieval practice, ...) legitimately share the same target
 * family with no ambiguity at all, and the platform must never prohibit
 * that overlap.
 *
 * The corrected rule resolves candidates from the SEPARATE, narrower,
 * opt-in `remediationEligibility` relationship
 * (@alp/content-schema's lesson-plan.ts) instead of
 * `targetAssertionFamilyIds`: a lesson only becomes a remediation
 * candidate for a family by explicitly declaring itself eligible for
 * it. Zero candidates -> unresolved. Exactly one candidate -> resolved,
 * regardless of any default flag (nothing to disambiguate). More than
 * one candidate -> resolved only if exactly one of them declares itself
 * `isDefaultRemediation` for that family (the deterministic tiebreak);
 * otherwise this throws rather than guessing (never "first match",
 * never insertion order) -- see
 * scripts/content/validate-lesson-plan.ts's `ambiguousRemediationCandidates`
 * gate, which mechanically enforces the same invariant at
 * content-authoring time so a valid manifest should never reach the
 * throwing path here; this module re-verifies defensively rather than
 * trusting that upstream gate ran.
 */

import type { LessonPlan } from "@alp/content-schema";
import { AmbiguousPrerequisiteCandidatesError } from "./types.ts";

export type PrerequisiteResolution =
  | { readonly status: "resolved"; readonly lesson: LessonPlan }
  | { readonly status: "unresolved" };

function isEligibleFor(lesson: LessonPlan, assertionFamilyId: string): boolean {
  return lesson.remediationEligibility.some((entry) => entry.assertionFamilyId === assertionFamilyId);
}

function isDefaultFor(lesson: LessonPlan, assertionFamilyId: string): boolean {
  return lesson.remediationEligibility.some((entry) => entry.assertionFamilyId === assertionFamilyId && entry.isDefaultRemediation);
}

/**
 * Only candidates sharing `forLesson.contentRelease` are considered --
 * a lesson from a different content release is never an eligible
 * remediation target, regardless of what `allLessons` contains. This is
 * enforced directly in the candidate filter below, not merely assumed
 * of the caller -- `allLessons` is safe to pass as the full multi-release
 * manifest.
 */
export function resolvePrerequisiteCandidate(
  assertionFamilyId: string,
  allLessons: readonly LessonPlan[],
  forLesson: LessonPlan,
): PrerequisiteResolution {
  const candidates = allLessons.filter(
    (lesson) => lesson.id !== forLesson.id && lesson.contentRelease === forLesson.contentRelease && isEligibleFor(lesson, assertionFamilyId),
  );

  if (candidates.length === 0) {
    return { status: "unresolved" };
  }
  if (candidates.length === 1) {
    return { status: "resolved", lesson: candidates[0]! };
  }

  const defaultCandidates = candidates.filter((lesson) => isDefaultFor(lesson, assertionFamilyId));
  if (defaultCandidates.length === 1) {
    return { status: "resolved", lesson: defaultCandidates[0]! };
  }

  throw new AmbiguousPrerequisiteCandidatesError(
    assertionFamilyId,
    candidates.map((c) => c.id),
  );
}
