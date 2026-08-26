/**
 * CC-08: the one real, governed course definition this proving vertical
 * needs -- the smallest credible cross-lesson adaptive sequence, not a
 * general course-catalogue/CMS (task brief §12/§44). Main-sequence
 * vocational nodes only; the foundational remediation lesson is
 * deliberately NOT listed as a node -- it is discovered dynamically via
 * `resolvePrerequisiteCandidate`/`remediationEligibility` whenever a
 * node's prerequisite family is evidenced weak, never hardcoded as a
 * fixed course step.
 */

import type { CourseDefinition } from "./types.ts";

export const UNIT202_ADAPTIVE_VERTICAL_COURSE_ID = "course.unit202.adaptive-vertical.v1" as const;

/**
 * CC-12: `contentRelease` moved from `release.unit202.v2` to
 * `release.unit202.v8`. This closes a real, pre-existing, previously
 * undetected regression -- `selectNextActivity` resolves course-node
 * lessons only from the lessons whose OWN `contentRelease` field equals
 * this course's declared release (CC-08A's `releaseScopedLessons`), and
 * the mobile app's bundled projection (`MOBILE_BUNDLED_RELEASE_ID`) had
 * advanced to v7 (CC-11.3) with nothing ever bumping this course
 * definition's own release to match -- every lesson in the bundled
 * projection carried `contentRelease: "release.unit202.v7"`, none
 * `"release.unit202.v2"`, so `computeNextCourseActivity()` would have
 * thrown `UnknownCourseActivityError` on its very first course-node
 * lookup for any real learner reaching the real Learn hub. `Ohm's Law`/
 * `resistors-series`/`resistors-parallel`'s own step content is
 * unaffected -- v8 carries their exact v7 content, re-addressed via the
 * same plain-field-override pattern every prior release used (see
 * `scripts/content/data/lessons.ts`).
 */
export const UNIT202_ADAPTIVE_VERTICAL: CourseDefinition = {
  id: UNIT202_ADAPTIVE_VERTICAL_COURSE_ID,
  schemaVersion: 1,
  contentRelease: "release.unit202.v8",
  nodes: [
    { id: "node.ohms-law", lessonId: "lesson.electrical.ohms-law", sequence: 1 },
    { id: "node.resistors-series", lessonId: "lesson.electrical.resistors-series", sequence: 2 },
    { id: "node.resistors-parallel", lessonId: "lesson.electrical.resistors-parallel", sequence: 3 },
    // CC-12: the magnetism/effects-of-current vertical slice -- magnetic
    // field around a current-carrying conductor, the right-hand grip
    // rule, force on a conductor (the motor principle), and Fleming's
    // left-hand rule, plus this lesson's own pre-existing electromagnetism
    // and EMF/terminal-voltage content. Not `lesson.magnetism.fundamentals`
    // (static attraction/repulsion) -- that lesson is now this node's
    // resolvable remediation target instead (see its own
    // `remediationEligibility` declaration), reached only if
    // `electrical.magnetism_and_electromagnetism` is ever evidenced
    // WEAK/CONFLICTING, never forced into every learner's default path.
    { id: "node.magnetism-effects-of-current", lessonId: "lesson.magnetism.effects-of-current", sequence: 4 },
  ],
};
