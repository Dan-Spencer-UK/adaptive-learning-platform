/**
 * CC-08: single aggregation point for every governed LessonPlan in the
 * corpus. Content-authoring/proving scripts import `lessons` from here
 * (never from an individual `lesson-*.ts` file) so adding a new lesson
 * is a one-line addition here, not a scattered multi-file import change.
 *
 * CC-08A: `lesson.electrical.ohms-law`'s real, unmodified step content is
 * a genuine member of BOTH `release.unit202.v1` (its original CC-06D
 * release, frozen) and `release.unit202.v2` (the CC-08 four-lesson
 * expansion) -- a release is part of a lesson's own identity
 * (lessonPlanManifestSchema's duplicate check is keyed on id+version+
 * contentRelease), so this is one authored source of truth
 * (`LESSON_OHMS_LAW`, still exactly as authored, still claiming v1)
 * projected into a second, release-scoped membership entry via a plain
 * field override -- never a second copy of the actual instructional
 * content, and never a mutation of the v1-tagged original.
 */

import type { LessonPlan } from "@alp/content-schema";

import { LESSON_OHMS_LAW } from "./lesson-ohms-law.ts";
import { LESSON_FOUNDATION_FORMULA_REARRANGEMENT } from "./lesson-foundation-formula-rearrangement.ts";
import { LESSON_RESISTORS_SERIES } from "./lesson-resistors-series.ts";
import { LESSON_RESISTORS_PARALLEL } from "./lesson-resistors-parallel.ts";
import { RELEASE_UNIT202_V2 } from "./content-releases.ts";

/**
 * The same real Ohm's Law step content, addressed as a member of
 * release.unit202.v2 -- id and version unchanged (the lesson content
 * itself did not change merely because it participates in a second
 * release), only the release-membership field differs from the
 * v1-tagged `LESSON_OHMS_LAW`.
 */
export const LESSON_OHMS_LAW_UNIT202_V2: LessonPlan = { ...LESSON_OHMS_LAW, contentRelease: RELEASE_UNIT202_V2 };

export const lessons: LessonPlan[] = [
  LESSON_OHMS_LAW,
  LESSON_OHMS_LAW_UNIT202_V2,
  LESSON_FOUNDATION_FORMULA_REARRANGEMENT,
  LESSON_RESISTORS_SERIES,
  LESSON_RESISTORS_PARALLEL,
];

export {
  LESSON_OHMS_LAW,
  LESSON_FOUNDATION_FORMULA_REARRANGEMENT,
  LESSON_RESISTORS_SERIES,
  LESSON_RESISTORS_PARALLEL,
};
