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
import { LESSON_MASS_AND_WEIGHT } from "./lesson-mass-and-weight.ts";
import { LESSON_SIMPLE_MACHINES } from "./lesson-simple-machines.ts";
import { LESSON_MECHANICS_FORCE_WORK_ENERGY_POWER } from "./lesson-mechanics-force-work-energy-power.ts";
import { LESSON_MAGNETISM_FUNDAMENTALS } from "./lesson-magnetism-fundamentals.ts";
import { LESSON_MAGNETIC_EFFECTS_OF_CURRENT } from "./lesson-magnetic-effects-of-current.ts";
import { LESSON_AC_GENERATION_PRINCIPLES } from "./lesson-ac-generation-principles.ts";
import {
  LESSON_MAGNETISM_FUNDAMENTALS_V4_HISTORICAL,
  LESSON_MAGNETIC_EFFECTS_OF_CURRENT_V4_HISTORICAL,
  LESSON_AC_GENERATION_PRINCIPLES_V4_HISTORICAL,
} from "./lesson-lo5-v4-historical-snapshot.ts";
import { LESSON_CONDUCTORS_AND_INSULATORS_V3_V5_HISTORICAL } from "./lesson-conductors-and-insulators-v3-v5-historical-snapshot.ts";
import { LESSON_AC_DC_AND_SINE_WAVE_QUANTITIES } from "./lesson-ac-dc-and-sine-wave-quantities.ts";
import { LESSON_ELECTRONIC_COMPONENTS_PASSIVE } from "./lesson-electronic-components-passive.ts";
import { LESSON_ELECTRONIC_COMPONENTS_SWITCHING_CONTROL } from "./lesson-electronic-components-switching-control.ts";
import { RELEASE_UNIT202_V2, RELEASE_UNIT202_V3, RELEASE_UNIT202_V4, RELEASE_UNIT202_V5, RELEASE_UNIT202_V6 } from "./content-releases.ts";

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

/**
 * CC-11: all 15 lessons already in `release.unit202.v3` (4 re-addressed
 * v1-authored lessons + 11 CC-10 lessons natively authored for v3), each
 * addressed as a member of `release.unit202.v4` too -- id/version
 * unchanged, only the release-membership field differs, exactly the same
 * pattern CC-10 established for v3 above. `release.unit202.v3`'s own
 * membership is untouched (still frozen to its original CC-10 fifteen
 * lessons).
 */
export const LESSON_OHMS_LAW_UNIT202_V4: LessonPlan = { ...LESSON_OHMS_LAW, contentRelease: RELEASE_UNIT202_V4 };
export const LESSON_FOUNDATION_FORMULA_REARRANGEMENT_UNIT202_V4: LessonPlan = {
  ...LESSON_FOUNDATION_FORMULA_REARRANGEMENT,
  contentRelease: RELEASE_UNIT202_V4,
};
export const LESSON_RESISTORS_SERIES_UNIT202_V4: LessonPlan = { ...LESSON_RESISTORS_SERIES, contentRelease: RELEASE_UNIT202_V4 };
export const LESSON_RESISTORS_PARALLEL_UNIT202_V4: LessonPlan = { ...LESSON_RESISTORS_PARALLEL, contentRelease: RELEASE_UNIT202_V4 };
export const LESSON_CORE_QUANTITIES_UNIT202_V4: LessonPlan = { ...LESSON_CORE_QUANTITIES, contentRelease: RELEASE_UNIT202_V4 };
export const LESSON_SI_UNITS_UNIT202_V4: LessonPlan = { ...LESSON_SI_UNITS, contentRelease: RELEASE_UNIT202_V4 };
export const LESSON_INSTRUMENTATION_UNIT202_V4: LessonPlan = { ...LESSON_INSTRUMENTATION, contentRelease: RELEASE_UNIT202_V4 };
export const LESSON_CHARGE_AND_CURRENT_UNIT202_V4: LessonPlan = { ...LESSON_CHARGE_AND_CURRENT, contentRelease: RELEASE_UNIT202_V4 };
// CC-11.2: sourced from the frozen pre-CC-11.2 snapshot, not the live
// (now release.unit202.v6-tagged) lesson object -- see that snapshot
// file's own header comment.
export const LESSON_CONDUCTORS_AND_INSULATORS_UNIT202_V4: LessonPlan = {
  ...LESSON_CONDUCTORS_AND_INSULATORS_V3_V5_HISTORICAL,
  contentRelease: RELEASE_UNIT202_V4,
};
export const LESSON_THERMAL_AND_CHEMICAL_EFFECTS_UNIT202_V4: LessonPlan = { ...LESSON_THERMAL_AND_CHEMICAL_EFFECTS, contentRelease: RELEASE_UNIT202_V4 };
export const LESSON_RESISTIVITY_UNIT202_V4: LessonPlan = { ...LESSON_RESISTIVITY, contentRelease: RELEASE_UNIT202_V4 };
export const LESSON_ELECTRICAL_POWER_UNIT202_V4: LessonPlan = { ...LESSON_ELECTRICAL_POWER, contentRelease: RELEASE_UNIT202_V4 };
export const LESSON_ELECTRICAL_ENERGY_EFFICIENCY_UNIT202_V4: LessonPlan = { ...LESSON_ELECTRICAL_ENERGY_EFFICIENCY, contentRelease: RELEASE_UNIT202_V4 };
export const LESSON_FAULT_CONDITIONS_PROTECTION_UNIT202_V4: LessonPlan = { ...LESSON_FAULT_CONDITIONS_PROTECTION, contentRelease: RELEASE_UNIT202_V4 };
export const LESSON_SERIES_VS_PARALLEL_COMPARISON_UNIT202_V4: LessonPlan = { ...LESSON_SERIES_VS_PARALLEL_COMPARISON, contentRelease: RELEASE_UNIT202_V4 };

/**
 * CC-11.1: `release.unit202.v5` carries the same 24-lesson membership as
 * v4 (see content-releases.ts's own RELEASE_UNIT202_V5 doc comment for
 * why v4 itself could not simply be grown in place). 21 of these 24
 * lessons' step content is genuinely unchanged from v4 -- re-addressed
 * here via the same plain-field-override pattern as every release
 * before it. The remaining 3
 * (LESSON_MAGNETISM_FUNDAMENTALS/LESSON_MAGNETIC_EFFECTS_OF_CURRENT/
 * LESSON_AC_GENERATION_PRINCIPLES) are referenced directly, unwrapped,
 * below -- their own native `contentRelease` field now reads v5 (their
 * step content was genuinely corrected, so v5 is their first, and only,
 * true release identity; see lesson-magnetism-fundamentals.ts /
 * lesson-magnetic-effects-of-current.ts / lesson-ac-generation-
 * principles.ts's own CC-11.1 header comments for exactly what changed).
 */
export const LESSON_OHMS_LAW_UNIT202_V5: LessonPlan = { ...LESSON_OHMS_LAW, contentRelease: RELEASE_UNIT202_V5 };
export const LESSON_FOUNDATION_FORMULA_REARRANGEMENT_UNIT202_V5: LessonPlan = {
  ...LESSON_FOUNDATION_FORMULA_REARRANGEMENT,
  contentRelease: RELEASE_UNIT202_V5,
};
export const LESSON_RESISTORS_SERIES_UNIT202_V5: LessonPlan = { ...LESSON_RESISTORS_SERIES, contentRelease: RELEASE_UNIT202_V5 };
export const LESSON_RESISTORS_PARALLEL_UNIT202_V5: LessonPlan = { ...LESSON_RESISTORS_PARALLEL, contentRelease: RELEASE_UNIT202_V5 };
export const LESSON_CORE_QUANTITIES_UNIT202_V5: LessonPlan = { ...LESSON_CORE_QUANTITIES, contentRelease: RELEASE_UNIT202_V5 };
export const LESSON_SI_UNITS_UNIT202_V5: LessonPlan = { ...LESSON_SI_UNITS, contentRelease: RELEASE_UNIT202_V5 };
export const LESSON_INSTRUMENTATION_UNIT202_V5: LessonPlan = { ...LESSON_INSTRUMENTATION, contentRelease: RELEASE_UNIT202_V5 };
export const LESSON_CHARGE_AND_CURRENT_UNIT202_V5: LessonPlan = { ...LESSON_CHARGE_AND_CURRENT, contentRelease: RELEASE_UNIT202_V5 };
// CC-11.2: sourced from the frozen pre-CC-11.2 snapshot -- see the same
// note on the v4 override above.
export const LESSON_CONDUCTORS_AND_INSULATORS_UNIT202_V5: LessonPlan = {
  ...LESSON_CONDUCTORS_AND_INSULATORS_V3_V5_HISTORICAL,
  contentRelease: RELEASE_UNIT202_V5,
};
export const LESSON_THERMAL_AND_CHEMICAL_EFFECTS_UNIT202_V5: LessonPlan = { ...LESSON_THERMAL_AND_CHEMICAL_EFFECTS, contentRelease: RELEASE_UNIT202_V5 };
export const LESSON_RESISTIVITY_UNIT202_V5: LessonPlan = { ...LESSON_RESISTIVITY, contentRelease: RELEASE_UNIT202_V5 };
export const LESSON_ELECTRICAL_POWER_UNIT202_V5: LessonPlan = { ...LESSON_ELECTRICAL_POWER, contentRelease: RELEASE_UNIT202_V5 };
export const LESSON_ELECTRICAL_ENERGY_EFFICIENCY_UNIT202_V5: LessonPlan = { ...LESSON_ELECTRICAL_ENERGY_EFFICIENCY, contentRelease: RELEASE_UNIT202_V5 };
export const LESSON_FAULT_CONDITIONS_PROTECTION_UNIT202_V5: LessonPlan = { ...LESSON_FAULT_CONDITIONS_PROTECTION, contentRelease: RELEASE_UNIT202_V5 };
export const LESSON_SERIES_VS_PARALLEL_COMPARISON_UNIT202_V5: LessonPlan = { ...LESSON_SERIES_VS_PARALLEL_COMPARISON, contentRelease: RELEASE_UNIT202_V5 };
export const LESSON_MASS_AND_WEIGHT_UNIT202_V5: LessonPlan = { ...LESSON_MASS_AND_WEIGHT, contentRelease: RELEASE_UNIT202_V5 };
export const LESSON_SIMPLE_MACHINES_UNIT202_V5: LessonPlan = { ...LESSON_SIMPLE_MACHINES, contentRelease: RELEASE_UNIT202_V5 };
export const LESSON_MECHANICS_FORCE_WORK_ENERGY_POWER_UNIT202_V5: LessonPlan = {
  ...LESSON_MECHANICS_FORCE_WORK_ENERGY_POWER,
  contentRelease: RELEASE_UNIT202_V5,
};
export const LESSON_AC_DC_AND_SINE_WAVE_QUANTITIES_UNIT202_V5: LessonPlan = { ...LESSON_AC_DC_AND_SINE_WAVE_QUANTITIES, contentRelease: RELEASE_UNIT202_V5 };
export const LESSON_ELECTRONIC_COMPONENTS_PASSIVE_UNIT202_V5: LessonPlan = { ...LESSON_ELECTRONIC_COMPONENTS_PASSIVE, contentRelease: RELEASE_UNIT202_V5 };
export const LESSON_ELECTRONIC_COMPONENTS_SWITCHING_CONTROL_UNIT202_V5: LessonPlan = {
  ...LESSON_ELECTRONIC_COMPONENTS_SWITCHING_CONTROL,
  contentRelease: RELEASE_UNIT202_V5,
};

/**
 * CC-11.2: `release.unit202.v6` carries the same 24-lesson membership as
 * v5 (see content-releases.ts's own RELEASE_UNIT202_V6 doc comment for
 * why v5 itself could not simply be grown in place). 23 of these 24
 * lessons' step content is genuinely unchanged from v5 -- re-addressed
 * here via the same plain-field-override pattern as every release before
 * it. The remaining 1 (`LESSON_CONDUCTORS_AND_INSULATORS`) is referenced
 * directly, unwrapped, below -- its own native `contentRelease` field
 * now reads v6 (its step content was genuinely corrected, so v6 is its
 * first, and only, true release identity; see
 * lesson-conductors-and-insulators.ts's own CC-11.2 header comment for
 * exactly what changed).
 */
export const LESSON_OHMS_LAW_UNIT202_V6: LessonPlan = { ...LESSON_OHMS_LAW, contentRelease: RELEASE_UNIT202_V6 };
export const LESSON_FOUNDATION_FORMULA_REARRANGEMENT_UNIT202_V6: LessonPlan = {
  ...LESSON_FOUNDATION_FORMULA_REARRANGEMENT,
  contentRelease: RELEASE_UNIT202_V6,
};
export const LESSON_RESISTORS_SERIES_UNIT202_V6: LessonPlan = { ...LESSON_RESISTORS_SERIES, contentRelease: RELEASE_UNIT202_V6 };
export const LESSON_RESISTORS_PARALLEL_UNIT202_V6: LessonPlan = { ...LESSON_RESISTORS_PARALLEL, contentRelease: RELEASE_UNIT202_V6 };
export const LESSON_CORE_QUANTITIES_UNIT202_V6: LessonPlan = { ...LESSON_CORE_QUANTITIES, contentRelease: RELEASE_UNIT202_V6 };
export const LESSON_SI_UNITS_UNIT202_V6: LessonPlan = { ...LESSON_SI_UNITS, contentRelease: RELEASE_UNIT202_V6 };
export const LESSON_INSTRUMENTATION_UNIT202_V6: LessonPlan = { ...LESSON_INSTRUMENTATION, contentRelease: RELEASE_UNIT202_V6 };
export const LESSON_CHARGE_AND_CURRENT_UNIT202_V6: LessonPlan = { ...LESSON_CHARGE_AND_CURRENT, contentRelease: RELEASE_UNIT202_V6 };
export const LESSON_THERMAL_AND_CHEMICAL_EFFECTS_UNIT202_V6: LessonPlan = { ...LESSON_THERMAL_AND_CHEMICAL_EFFECTS, contentRelease: RELEASE_UNIT202_V6 };
export const LESSON_RESISTIVITY_UNIT202_V6: LessonPlan = { ...LESSON_RESISTIVITY, contentRelease: RELEASE_UNIT202_V6 };
export const LESSON_ELECTRICAL_POWER_UNIT202_V6: LessonPlan = { ...LESSON_ELECTRICAL_POWER, contentRelease: RELEASE_UNIT202_V6 };
export const LESSON_ELECTRICAL_ENERGY_EFFICIENCY_UNIT202_V6: LessonPlan = { ...LESSON_ELECTRICAL_ENERGY_EFFICIENCY, contentRelease: RELEASE_UNIT202_V6 };
export const LESSON_FAULT_CONDITIONS_PROTECTION_UNIT202_V6: LessonPlan = { ...LESSON_FAULT_CONDITIONS_PROTECTION, contentRelease: RELEASE_UNIT202_V6 };
export const LESSON_SERIES_VS_PARALLEL_COMPARISON_UNIT202_V6: LessonPlan = { ...LESSON_SERIES_VS_PARALLEL_COMPARISON, contentRelease: RELEASE_UNIT202_V6 };
export const LESSON_MASS_AND_WEIGHT_UNIT202_V6: LessonPlan = { ...LESSON_MASS_AND_WEIGHT, contentRelease: RELEASE_UNIT202_V6 };
export const LESSON_SIMPLE_MACHINES_UNIT202_V6: LessonPlan = { ...LESSON_SIMPLE_MACHINES, contentRelease: RELEASE_UNIT202_V6 };
export const LESSON_MECHANICS_FORCE_WORK_ENERGY_POWER_UNIT202_V6: LessonPlan = {
  ...LESSON_MECHANICS_FORCE_WORK_ENERGY_POWER,
  contentRelease: RELEASE_UNIT202_V6,
};
export const LESSON_MAGNETISM_FUNDAMENTALS_UNIT202_V6: LessonPlan = { ...LESSON_MAGNETISM_FUNDAMENTALS, contentRelease: RELEASE_UNIT202_V6 };
export const LESSON_MAGNETIC_EFFECTS_OF_CURRENT_UNIT202_V6: LessonPlan = { ...LESSON_MAGNETIC_EFFECTS_OF_CURRENT, contentRelease: RELEASE_UNIT202_V6 };
export const LESSON_AC_GENERATION_PRINCIPLES_UNIT202_V6: LessonPlan = { ...LESSON_AC_GENERATION_PRINCIPLES, contentRelease: RELEASE_UNIT202_V6 };
export const LESSON_AC_DC_AND_SINE_WAVE_QUANTITIES_UNIT202_V6: LessonPlan = { ...LESSON_AC_DC_AND_SINE_WAVE_QUANTITIES, contentRelease: RELEASE_UNIT202_V6 };
export const LESSON_ELECTRONIC_COMPONENTS_PASSIVE_UNIT202_V6: LessonPlan = { ...LESSON_ELECTRONIC_COMPONENTS_PASSIVE, contentRelease: RELEASE_UNIT202_V6 };
export const LESSON_ELECTRONIC_COMPONENTS_SWITCHING_CONTROL_UNIT202_V6: LessonPlan = {
  ...LESSON_ELECTRONIC_COMPONENTS_SWITCHING_CONTROL,
  contentRelease: RELEASE_UNIT202_V6,
};

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
  // CC-11.2: sourced from the frozen pre-CC-11.2 snapshot, not the live
  // (now release.unit202.v6-tagged) lesson object -- this lesson was
  // natively authored for v3, so the snapshot's own native contentRelease
  // (also v3) resolves it directly, bare, exactly as before.
  LESSON_CONDUCTORS_AND_INSULATORS_V3_V5_HISTORICAL,
  LESSON_THERMAL_AND_CHEMICAL_EFFECTS,
  LESSON_RESISTIVITY,
  LESSON_ELECTRICAL_POWER,
  LESSON_ELECTRICAL_ENERGY_EFFICIENCY,
  LESSON_FAULT_CONDITIONS_PROTECTION,
  LESSON_SERIES_VS_PARALLEL_COMPARISON,
  // CC-11: complete Unit 202 course production -- LO3 remainder, LO5 and
  // LO6. All 15 pre-existing release.unit202.v3 lessons (re-addressed,
  // never moved) plus 9 genuinely new lessons are release.unit202.v4
  // members.
  LESSON_OHMS_LAW_UNIT202_V4,
  LESSON_FOUNDATION_FORMULA_REARRANGEMENT_UNIT202_V4,
  LESSON_RESISTORS_SERIES_UNIT202_V4,
  LESSON_RESISTORS_PARALLEL_UNIT202_V4,
  LESSON_CORE_QUANTITIES_UNIT202_V4,
  LESSON_SI_UNITS_UNIT202_V4,
  LESSON_INSTRUMENTATION_UNIT202_V4,
  LESSON_CHARGE_AND_CURRENT_UNIT202_V4,
  LESSON_CONDUCTORS_AND_INSULATORS_UNIT202_V4,
  LESSON_THERMAL_AND_CHEMICAL_EFFECTS_UNIT202_V4,
  LESSON_RESISTIVITY_UNIT202_V4,
  LESSON_ELECTRICAL_POWER_UNIT202_V4,
  LESSON_ELECTRICAL_ENERGY_EFFICIENCY_UNIT202_V4,
  LESSON_FAULT_CONDITIONS_PROTECTION_UNIT202_V4,
  LESSON_SERIES_VS_PARALLEL_COMPARISON_UNIT202_V4,
  // CC-11 new lessons (release.unit202.v4 -- 21 of these 24 are also
  // release.unit202.v5 members, re-addressed below; the 3 CC-11.1-
  // corrected lessons' CURRENT native contentRelease now reads v5, so
  // frozen historical snapshots of their original v4 content stand in
  // here instead -- see lesson-lo5-v4-historical-snapshot.ts and
  // content-releases.ts's RELEASE_UNIT202_V5 doc comment):
  LESSON_MASS_AND_WEIGHT,
  LESSON_SIMPLE_MACHINES,
  LESSON_MECHANICS_FORCE_WORK_ENERGY_POWER,
  LESSON_MAGNETISM_FUNDAMENTALS_V4_HISTORICAL,
  LESSON_MAGNETIC_EFFECTS_OF_CURRENT_V4_HISTORICAL,
  LESSON_AC_GENERATION_PRINCIPLES_V4_HISTORICAL,
  LESSON_AC_DC_AND_SINE_WAVE_QUANTITIES,
  LESSON_ELECTRONIC_COMPONENTS_PASSIVE,
  LESSON_ELECTRONIC_COMPONENTS_SWITCHING_CONTROL,
  // CC-11.1: release.unit202.v5 -- 21 lessons re-addressed unchanged,
  // plus the 3 CC-11.1-corrected lessons referenced directly (their own
  // native contentRelease already reads v5).
  LESSON_OHMS_LAW_UNIT202_V5,
  LESSON_FOUNDATION_FORMULA_REARRANGEMENT_UNIT202_V5,
  LESSON_RESISTORS_SERIES_UNIT202_V5,
  LESSON_RESISTORS_PARALLEL_UNIT202_V5,
  LESSON_CORE_QUANTITIES_UNIT202_V5,
  LESSON_SI_UNITS_UNIT202_V5,
  LESSON_INSTRUMENTATION_UNIT202_V5,
  LESSON_CHARGE_AND_CURRENT_UNIT202_V5,
  LESSON_CONDUCTORS_AND_INSULATORS_UNIT202_V5,
  LESSON_THERMAL_AND_CHEMICAL_EFFECTS_UNIT202_V5,
  LESSON_RESISTIVITY_UNIT202_V5,
  LESSON_ELECTRICAL_POWER_UNIT202_V5,
  LESSON_ELECTRICAL_ENERGY_EFFICIENCY_UNIT202_V5,
  LESSON_FAULT_CONDITIONS_PROTECTION_UNIT202_V5,
  LESSON_SERIES_VS_PARALLEL_COMPARISON_UNIT202_V5,
  LESSON_MASS_AND_WEIGHT_UNIT202_V5,
  LESSON_SIMPLE_MACHINES_UNIT202_V5,
  LESSON_MECHANICS_FORCE_WORK_ENERGY_POWER_UNIT202_V5,
  LESSON_MAGNETISM_FUNDAMENTALS,
  LESSON_MAGNETIC_EFFECTS_OF_CURRENT,
  LESSON_AC_GENERATION_PRINCIPLES,
  LESSON_AC_DC_AND_SINE_WAVE_QUANTITIES_UNIT202_V5,
  LESSON_ELECTRONIC_COMPONENTS_PASSIVE_UNIT202_V5,
  LESSON_ELECTRONIC_COMPONENTS_SWITCHING_CONTROL_UNIT202_V5,
  // CC-11.2: release.unit202.v6 -- 23 lessons re-addressed unchanged,
  // plus LESSON_CONDUCTORS_AND_INSULATORS referenced directly (its own
  // native contentRelease already reads v6, the AC4.1 electron-theory
  // gap closed).
  LESSON_OHMS_LAW_UNIT202_V6,
  LESSON_FOUNDATION_FORMULA_REARRANGEMENT_UNIT202_V6,
  LESSON_RESISTORS_SERIES_UNIT202_V6,
  LESSON_RESISTORS_PARALLEL_UNIT202_V6,
  LESSON_CORE_QUANTITIES_UNIT202_V6,
  LESSON_SI_UNITS_UNIT202_V6,
  LESSON_INSTRUMENTATION_UNIT202_V6,
  LESSON_CHARGE_AND_CURRENT_UNIT202_V6,
  LESSON_CONDUCTORS_AND_INSULATORS,
  LESSON_THERMAL_AND_CHEMICAL_EFFECTS_UNIT202_V6,
  LESSON_RESISTIVITY_UNIT202_V6,
  LESSON_ELECTRICAL_POWER_UNIT202_V6,
  LESSON_ELECTRICAL_ENERGY_EFFICIENCY_UNIT202_V6,
  LESSON_FAULT_CONDITIONS_PROTECTION_UNIT202_V6,
  LESSON_SERIES_VS_PARALLEL_COMPARISON_UNIT202_V6,
  LESSON_MASS_AND_WEIGHT_UNIT202_V6,
  LESSON_SIMPLE_MACHINES_UNIT202_V6,
  LESSON_MECHANICS_FORCE_WORK_ENERGY_POWER_UNIT202_V6,
  LESSON_MAGNETISM_FUNDAMENTALS_UNIT202_V6,
  LESSON_MAGNETIC_EFFECTS_OF_CURRENT_UNIT202_V6,
  LESSON_AC_GENERATION_PRINCIPLES_UNIT202_V6,
  LESSON_AC_DC_AND_SINE_WAVE_QUANTITIES_UNIT202_V6,
  LESSON_ELECTRONIC_COMPONENTS_PASSIVE_UNIT202_V6,
  LESSON_ELECTRONIC_COMPONENTS_SWITCHING_CONTROL_UNIT202_V6,
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
  LESSON_MASS_AND_WEIGHT,
  LESSON_SIMPLE_MACHINES,
  LESSON_MECHANICS_FORCE_WORK_ENERGY_POWER,
  LESSON_MAGNETISM_FUNDAMENTALS,
  LESSON_MAGNETIC_EFFECTS_OF_CURRENT,
  LESSON_AC_GENERATION_PRINCIPLES,
  LESSON_AC_DC_AND_SINE_WAVE_QUANTITIES,
  LESSON_ELECTRONIC_COMPONENTS_PASSIVE,
  LESSON_ELECTRONIC_COMPONENTS_SWITCHING_CONTROL,
};
