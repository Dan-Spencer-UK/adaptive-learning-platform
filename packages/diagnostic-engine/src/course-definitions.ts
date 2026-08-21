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

export const UNIT202_ADAPTIVE_VERTICAL: CourseDefinition = {
  id: UNIT202_ADAPTIVE_VERTICAL_COURSE_ID,
  schemaVersion: 1,
  // CC-08A: release.unit202.v1 is the original, frozen CC-06D release
  // (Ohm's Law only) -- immutable, never grown. The four-lesson CC-08
  // adaptive vertical lives in release.unit202.v2 instead.
  contentRelease: "release.unit202.v2",
  nodes: [
    { id: "node.ohms-law", lessonId: "lesson.electrical.ohms-law", sequence: 1 },
    { id: "node.resistors-series", lessonId: "lesson.electrical.resistors-series", sequence: 2 },
    { id: "node.resistors-parallel", lessonId: "lesson.electrical.resistors-parallel", sequence: 3 },
  ],
};
