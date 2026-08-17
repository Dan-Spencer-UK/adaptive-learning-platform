import { describe, expect, it } from "vitest";
import { resolvePrerequisiteCandidate } from "./prerequisite-resolution.ts";
import { AmbiguousPrerequisiteCandidatesError } from "./types.ts";
import {
  SYNTH_PREREQ_FAMILY,
  SYNTHETIC_MAIN_LESSON,
  SYNTHETIC_PREREQ_LESSON,
  SYNTHETIC_PREREQ_LESSON_DUPLICATE,
  SYNTHETIC_PREREQ_LESSON_OTHER_RELEASE,
} from "./test-fixtures.ts";

describe("resolvePrerequisiteCandidate", () => {
  it("returns unresolved when no lesson targets the family", () => {
    const result = resolvePrerequisiteCandidate(SYNTH_PREREQ_FAMILY, [SYNTHETIC_MAIN_LESSON], SYNTHETIC_MAIN_LESSON);
    expect(result).toEqual({ status: "unresolved" });
  });

  it("resolves the single unambiguous candidate", () => {
    const result = resolvePrerequisiteCandidate(
      SYNTH_PREREQ_FAMILY,
      [SYNTHETIC_MAIN_LESSON, SYNTHETIC_PREREQ_LESSON],
      SYNTHETIC_MAIN_LESSON,
    );
    expect(result).toEqual({ status: "resolved", lesson: SYNTHETIC_PREREQ_LESSON });
  });

  it("throws AmbiguousPrerequisiteCandidatesError when more than one lesson targets the family in the same content release", () => {
    expect(() =>
      resolvePrerequisiteCandidate(
        SYNTH_PREREQ_FAMILY,
        [SYNTHETIC_MAIN_LESSON, SYNTHETIC_PREREQ_LESSON, SYNTHETIC_PREREQ_LESSON_DUPLICATE],
        SYNTHETIC_MAIN_LESSON,
      ),
    ).toThrow(AmbiguousPrerequisiteCandidatesError);
  });

  it("never picks a 'first match' when ambiguous -- the error names every candidate", () => {
    let caught: unknown;
    try {
      resolvePrerequisiteCandidate(
        SYNTH_PREREQ_FAMILY,
        [SYNTHETIC_MAIN_LESSON, SYNTHETIC_PREREQ_LESSON, SYNTHETIC_PREREQ_LESSON_DUPLICATE],
        SYNTHETIC_MAIN_LESSON,
      );
    } catch (error) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(AmbiguousPrerequisiteCandidatesError);
    const ambiguous = caught as InstanceType<typeof AmbiguousPrerequisiteCandidatesError>;
    expect(ambiguous.assertionFamilyId).toBe(SYNTH_PREREQ_FAMILY);
    expect(ambiguous.candidateLessonIds).toEqual([SYNTHETIC_PREREQ_LESSON.id, SYNTHETIC_PREREQ_LESSON_DUPLICATE.id]);
  });

  it("never considers the lesson itself a candidate for its own prerequisite family", () => {
    const selfTargeting = { ...SYNTHETIC_PREREQ_LESSON, targetAssertionFamilyIds: [SYNTH_PREREQ_FAMILY], prerequisiteKnowledge: [SYNTH_PREREQ_FAMILY] };
    const result = resolvePrerequisiteCandidate(SYNTH_PREREQ_FAMILY, [selfTargeting], selfTargeting);
    expect(result).toEqual({ status: "unresolved" });
  });

  it("excludes candidates from a different content release", () => {
    const result = resolvePrerequisiteCandidate(
      SYNTH_PREREQ_FAMILY,
      [SYNTHETIC_MAIN_LESSON, SYNTHETIC_PREREQ_LESSON_OTHER_RELEASE],
      SYNTHETIC_MAIN_LESSON,
    );
    expect(result).toEqual({ status: "unresolved" });
  });
});
