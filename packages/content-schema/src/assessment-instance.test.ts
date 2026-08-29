import { describe, expect, it } from "vitest";
import {
  formativeAssessmentInstanceSchema,
  submittedAssessmentResultSchema,
  buildSubmittedAssessmentResult,
  type FormativeAssessmentInstance,
} from "./assessment-instance.ts";

function inProgressInstance(overrides: Partial<FormativeAssessmentInstance> = {}): FormativeAssessmentInstance {
  return {
    assessmentInstanceId: "attempt.001",
    assessmentDefinitionId: "assessment.unit202-mock-v1",
    scopeId: "unit202",
    contentReleaseId: "release.v1",
    questionInstanceIds: ["q.001", "q.002"],
    status: "IN_PROGRESS",
    startedAt: "2026-08-29T09:00:00.000Z",
    ...overrides,
  };
}

describe("formativeAssessmentInstanceSchema", () => {
  it("accepts a well-formed NOT_STARTED/IN_PROGRESS instance with no completedAt/submittedAt", () => {
    expect(formativeAssessmentInstanceSchema.safeParse(inProgressInstance()).success).toBe(true);
    expect(formativeAssessmentInstanceSchema.safeParse(inProgressInstance({ status: "NOT_STARTED", startedAt: undefined })).success).toBe(true);
  });

  it("accepts a well-formed SUBMITTED instance with completedAt before submittedAt", () => {
    const result = formativeAssessmentInstanceSchema.safeParse(
      inProgressInstance({
        status: "SUBMITTED",
        completedAt: "2026-08-29T09:20:00.000Z",
        submittedAt: "2026-08-29T09:20:05.000Z",
      }),
    );
    expect(result.success).toBe(true);
  });

  it("rejects submittedAt present with a non-SUBMITTED status", () => {
    const result = formativeAssessmentInstanceSchema.safeParse(
      inProgressInstance({ status: "COMPLETED_AWAITING_SUBMISSION", completedAt: "2026-08-29T09:20:00.000Z", submittedAt: "2026-08-29T09:20:05.000Z" }),
    );
    expect(result.success).toBe(false);
  });

  it("rejects status SUBMITTED with no submittedAt", () => {
    const result = formativeAssessmentInstanceSchema.safeParse(inProgressInstance({ status: "SUBMITTED", completedAt: "2026-08-29T09:20:00.000Z" }));
    expect(result.success).toBe(false);
  });

  it("rejects status SUBMITTED with no completedAt", () => {
    const result = formativeAssessmentInstanceSchema.safeParse(inProgressInstance({ status: "SUBMITTED", submittedAt: "2026-08-29T09:20:05.000Z" }));
    expect(result.success).toBe(false);
  });

  it("rejects completedAt present on an IN_PROGRESS instance", () => {
    const result = formativeAssessmentInstanceSchema.safeParse(inProgressInstance({ completedAt: "2026-08-29T09:20:00.000Z" }));
    expect(result.success).toBe(false);
  });

  it("rejects submittedAt strictly before completedAt", () => {
    const result = formativeAssessmentInstanceSchema.safeParse(
      inProgressInstance({ status: "SUBMITTED", completedAt: "2026-08-29T09:20:05.000Z", submittedAt: "2026-08-29T09:20:00.000Z" }),
    );
    expect(result.success).toBe(false);
  });
});

describe("buildSubmittedAssessmentResult", () => {
  const submitted = inProgressInstance({
    status: "SUBMITTED",
    completedAt: "2026-08-29T09:20:00.000Z",
    submittedAt: "2026-08-29T09:20:05.000Z",
  });
  const items = [{ questionInstanceId: "q.001", capabilityIds: ["cap.a"], revisionLessonIds: ["lesson.a"], correct: false }];

  it("builds a valid SubmittedAssessmentResult from a SUBMITTED instance", () => {
    const result = buildSubmittedAssessmentResult(submitted, items);
    expect(submittedAssessmentResultSchema.safeParse(result).success).toBe(true);
    expect(result.submittedAt).toBe("2026-08-29T09:20:05.000Z");
  });

  it("throws (never silently coerces) for an IN_PROGRESS instance -- incomplete assessments must never produce a Guided Revision trigger", () => {
    expect(() => buildSubmittedAssessmentResult(inProgressInstance(), items)).toThrow(/not SUBMITTED/);
  });

  it("throws for a COMPLETED_AWAITING_SUBMISSION instance", () => {
    const completedNotSubmitted = inProgressInstance({ status: "COMPLETED_AWAITING_SUBMISSION", completedAt: "2026-08-29T09:20:00.000Z" });
    expect(() => buildSubmittedAssessmentResult(completedNotSubmitted, items)).toThrow();
  });
});
