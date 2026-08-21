/**
 * CC-08: single aggregation point for every governed LessonPlan in the
 * corpus. Content-authoring/proving scripts import `lessons` from here
 * (never from an individual `lesson-*.ts` file) so adding a new lesson
 * is a one-line addition here, not a scattered multi-file import change.
 */

import type { LessonPlan } from "@alp/content-schema";

import { LESSON_OHMS_LAW } from "./lesson-ohms-law.ts";
import { LESSON_FOUNDATION_FORMULA_REARRANGEMENT } from "./lesson-foundation-formula-rearrangement.ts";
import { LESSON_RESISTORS_SERIES } from "./lesson-resistors-series.ts";
import { LESSON_RESISTORS_PARALLEL } from "./lesson-resistors-parallel.ts";

export const lessons: LessonPlan[] = [
  LESSON_OHMS_LAW,
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
