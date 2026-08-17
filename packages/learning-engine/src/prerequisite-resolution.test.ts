import { describe, expect, it } from "vitest";
import { resolvePrerequisiteCandidate } from "./prerequisite-resolution.ts";
import { AmbiguousPrerequisiteCandidatesError } from "./types.ts";
import {
  SYNTH_PREREQ_FAMILY,
  SYNTHETIC_MAIN_LESSON,
  SYNTHETIC_ORDINARY_LESSON_A,
  SYNTHETIC_ORDINARY_LESSON_B,
  SYNTHETIC_PREREQ_LESSON,
  SYNTHETIC_PREREQ_LESSON_CONFLICTING_DEFAULT_A,
  SYNTHETIC_PREREQ_LESSON_CONFLICTING_DEFAULT_B,
  SYNTHETIC_PREREQ_LESSON_DEFAULT,
  SYNTHETIC_PREREQ_LESSON_DUPLICATE,
  SYNTHETIC_PREREQ_LESSON_NONDEFAULT_CANDIDATE,
  SYNTHETIC_PREREQ_LESSON_OTHER_RELEASE,
} from "./test-fixtures.ts";

describe("resolvePrerequisiteCandidate", () => {
  it("returns unresolved when no lesson is remediation-eligible for the family", () => {
    const result = resolvePrerequisiteCandidate(SYNTH_PREREQ_FAMILY, [SYNTHETIC_MAIN_LESSON], SYNTHETIC_MAIN_LESSON);
    expect(result).toEqual({ status: "unresolved" });
  });

  it("resolves the single unambiguous candidate even though it is not marked default (default is irrelevant with only one candidate)", () => {
    const result = resolvePrerequisiteCandidate(
      SYNTH_PREREQ_FAMILY,
      [SYNTHETIC_MAIN_LESSON, SYNTHETIC_PREREQ_LESSON],
      SYNTHETIC_MAIN_LESSON,
    );
    expect(result).toEqual({ status: "resolved", lesson: SYNTHETIC_PREREQ_LESSON });
  });

  it("[B] resolves to the uniquely-designated default when multiple candidates are eligible", () => {
    const result = resolvePrerequisiteCandidate(
      SYNTH_PREREQ_FAMILY,
      [SYNTHETIC_MAIN_LESSON, SYNTHETIC_PREREQ_LESSON_DEFAULT, SYNTHETIC_PREREQ_LESSON_NONDEFAULT_CANDIDATE],
      SYNTHETIC_MAIN_LESSON,
    );
    expect(result).toEqual({ status: "resolved", lesson: SYNTHETIC_PREREQ_LESSON_DEFAULT });
  });

  it("[D] throws AmbiguousPrerequisiteCandidatesError when two candidates are BOTH marked default for the same family/content release", () => {
    expect(() =>
      resolvePrerequisiteCandidate(
        SYNTH_PREREQ_FAMILY,
        [SYNTHETIC_MAIN_LESSON, SYNTHETIC_PREREQ_LESSON_CONFLICTING_DEFAULT_A, SYNTHETIC_PREREQ_LESSON_CONFLICTING_DEFAULT_B],
        SYNTHETIC_MAIN_LESSON,
      ),
    ).toThrow(AmbiguousPrerequisiteCandidatesError);
  });

  it("throws AmbiguousPrerequisiteCandidatesError when multiple candidates are eligible and NONE is marked default", () => {
    expect(() =>
      resolvePrerequisiteCandidate(
        SYNTH_PREREQ_FAMILY,
        [SYNTHETIC_MAIN_LESSON, SYNTHETIC_PREREQ_LESSON, SYNTHETIC_PREREQ_LESSON_DUPLICATE],
        SYNTHETIC_MAIN_LESSON,
      ),
    ).toThrow(AmbiguousPrerequisiteCandidatesError);
  });

  it("never picks a 'first match' when ambiguous -- the error names every eligible candidate, not just the conflicting defaults", () => {
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
    const selfTargeting = {
      ...SYNTHETIC_PREREQ_LESSON,
      prerequisiteKnowledge: [SYNTH_PREREQ_FAMILY],
      remediationEligibility: [{ assertionFamilyId: SYNTH_PREREQ_FAMILY, isDefaultRemediation: true }],
    };
    const result = resolvePrerequisiteCandidate(SYNTH_PREREQ_FAMILY, [selfTargeting], selfTargeting);
    expect(result).toEqual({ status: "unresolved" });
  });

  it("[F] excludes candidates from a different content release even when eligible and marked default", () => {
    const result = resolvePrerequisiteCandidate(
      SYNTH_PREREQ_FAMILY,
      [SYNTHETIC_MAIN_LESSON, SYNTHETIC_PREREQ_LESSON_OTHER_RELEASE],
      SYNTHETIC_MAIN_LESSON,
    );
    expect(result).toEqual({ status: "unresolved" });
  });

  it("[A/C] two ORDINARY lessons targeting the same family (general instructional overlap, no remediationEligibility) never create ambiguity -- they are simply not candidates at all", () => {
    const result = resolvePrerequisiteCandidate(
      SYNTH_PREREQ_FAMILY,
      [SYNTHETIC_MAIN_LESSON, SYNTHETIC_ORDINARY_LESSON_A, SYNTHETIC_ORDINARY_LESSON_B],
      SYNTHETIC_MAIN_LESSON,
    );
    expect(result).toEqual({ status: "unresolved" });
  });

  it("ordinary target-overlap lessons present alongside a real remediation candidate still resolve cleanly to the one true candidate", () => {
    const result = resolvePrerequisiteCandidate(
      SYNTH_PREREQ_FAMILY,
      [SYNTHETIC_MAIN_LESSON, SYNTHETIC_ORDINARY_LESSON_A, SYNTHETIC_ORDINARY_LESSON_B, SYNTHETIC_PREREQ_LESSON],
      SYNTHETIC_MAIN_LESSON,
    );
    expect(result).toEqual({ status: "resolved", lesson: SYNTHETIC_PREREQ_LESSON });
  });
});
