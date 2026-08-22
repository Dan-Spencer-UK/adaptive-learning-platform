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
import { LESSON_CORE_QUANTITIES } from "./lesson-core-quantities.ts";
import { LESSON_SI_UNITS } from "./lesson-si-units.ts";
import { LESSON_INSTRUMENTATION } from "./lesson-instrumentation.ts";
import { LESSON_CHARGE_AND_CURRENT } from "./lesson-charge-and-current.ts";
import { LESSON_CONDUCTORS_AND_INSULATORS } from "./lesson-conductors-and-insulators.ts";
import { LESSON_THERMAL_AND_CHEMICAL_EFFECTS } from "./lesson-thermal-and-chemical-effects.ts";
import { LESSON_RESISTIVITY } from "./lesson-resistivity.ts";
import { LESSON_ELECTRICAL_POWER } from "./lesson-electrical-power.ts";
import { LESSON_ELECTRICAL_ENERGY_EFFICIENCY } from "./lesson-electrical-energy-efficiency.ts";
import { LESSON_FAULT_CONDITIONS_PROTECTION } from "./lesson-fault-conditions-protection.ts";
import { LESSON_SERIES_VS_PARALLEL_COMPARISON } from "./lesson-series-vs-parallel-comparison.ts";
import { RELEASE_UNIT202_V2, RELEASE_UNIT202_V3 } from "./content-releases.ts";

/**
 * The same real Ohm's Law step content, addressed as a member of
 * release.unit202.v2 -- id and version unchanged (the lesson content
 * itself did not change merely because it participates in a second
 * release), only the release-membership field differs from the
 * v1-tagged `LESSON_OHMS_LAW`.
 */
export const LESSON_OHMS_LAW_UNIT202_V2: LessonPlan = { ...LESSON_OHMS_LAW, contentRelease: RELEASE_UNIT202_V2 };

/**
 * CC-10: the same four pre-existing lessons' real, unmodified step content,
 * each addressed as a member of `release.unit202.v3` too -- id/version
 * unchanged, only the release-membership field differs, exactly the same
 * pattern as `LESSON_OHMS_LAW_UNIT202_V2` above. `release.unit202.v2`'s own
 * membership is untouched (still frozen to its original CC-08 four lessons).
 */
export const LESSON_OHMS_LAW_UNIT202_V3: LessonPlan = { ...LESSON_OHMS_LAW, contentRelease: RELEASE_UNIT202_V3 };
export const LESSON_FOUNDATION_FORMULA_REARRANGEMENT_UNIT202_V3: LessonPlan = {
  ...LESSON_FOUNDATION_FORMULA_REARRANGEMENT,
  contentRelease: RELEASE_UNIT202_V3,
};
export const LESSON_RESISTORS_SERIES_UNIT202_V3: LessonPlan = { ...LESSON_RESISTORS_SERIES, contentRelease: RELEASE_UNIT202_V3 };
export const LESSON_RESISTORS_PARALLEL_UNIT202_V3: LessonPlan = { ...LESSON_RESISTORS_PARALLEL, contentRelease: RELEASE_UNIT202_V3 };

export const lessons: LessonPlan[] = [
  LESSON_OHMS_LAW,
  LESSON_OHMS_LAW_UNIT202_V2,
  LESSON_FOUNDATION_FORMULA_REARRANGEMENT,
  LESSON_RESISTORS_SERIES,
  LESSON_RESISTORS_PARALLEL,
  // CC-10: complete Unit 202 course production -- LO2 (units/measurement)
  // in full, plus LO4's remaining small/medium assessable families. All
  // nine new lessons, plus the four pre-existing ones (re-addressed, never
  // moved), are release.unit202.v3 members.
  LESSON_OHMS_LAW_UNIT202_V3,
  LESSON_FOUNDATION_FORMULA_REARRANGEMENT_UNIT202_V3,
  LESSON_RESISTORS_SERIES_UNIT202_V3,
  LESSON_RESISTORS_PARALLEL_UNIT202_V3,
  LESSON_CORE_QUANTITIES,
  LESSON_SI_UNITS,
  LESSON_INSTRUMENTATION,
  LESSON_CHARGE_AND_CURRENT,
  LESSON_CONDUCTORS_AND_INSULATORS,
  LESSON_THERMAL_AND_CHEMICAL_EFFECTS,
  LESSON_RESISTIVITY,
  LESSON_ELECTRICAL_POWER,
  LESSON_ELECTRICAL_ENERGY_EFFICIENCY,
  LESSON_FAULT_CONDITIONS_PROTECTION,
  LESSON_SERIES_VS_PARALLEL_COMPARISON,
];

export {
  LESSON_OHMS_LAW,
  LESSON_FOUNDATION_FORMULA_REARRANGEMENT,
  LESSON_RESISTORS_SERIES,
  LESSON_RESISTORS_PARALLEL,
  LESSON_CORE_QUANTITIES,
  LESSON_SI_UNITS,
  LESSON_INSTRUMENTATION,
  LESSON_CHARGE_AND_CURRENT,
  LESSON_CONDUCTORS_AND_INSULATORS,
  LESSON_THERMAL_AND_CHEMICAL_EFFECTS,
  LESSON_RESISTIVITY,
  LESSON_ELECTRICAL_POWER,
  LESSON_ELECTRICAL_ENERGY_EFFICIENCY,
  LESSON_FAULT_CONDITIONS_PROTECTION,
  LESSON_SERIES_VS_PARALLEL_COMPARISON,
};
