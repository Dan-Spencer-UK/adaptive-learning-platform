import { describe, expect, it } from "vitest";
import { assessmentSpecificationManifestSchema, assessmentSpecificationSchema } from "./assessment-specification.ts";

function spec(overrides: Record<string, unknown> = {}) {
  return {
    id: "assessment-spec.test.v1",
    schemaVersion: 1,
    curriculumVersionKey: "cv-test",
    qualificationCode: "TEST-01",
    unitNumber: "202",
    unitTitle: "Test Unit",
    assessmentNumber: "602",
    method: "ONLINE_MULTIPLE_CHOICE_TEST",
    durationMinutes: 90,
    totalQuestionCount: 10,
    permittedMaterials: { closedBook: true, calculator: "non_programmable" },
    approximatePassPercentage: 50,
    sourceVersionKey: "sv-test",
    outcomeAllocations: [
      { learningOutcomeNodeKey: "node-lo1", outcomeNumber: 1, questionCount: 4, questionPercentage: 40 },
      { learningOutcomeNodeKey: "node-lo2", outcomeNumber: 2, questionCount: 6, questionPercentage: 60 },
    ],
    ...overrides,
  };
}

describe("assessmentSpecificationSchema", () => {
  it("accepts a valid specification whose allocations sum to the total question count", () => {
    const parsed = assessmentSpecificationSchema.parse(spec());
    expect(parsed.outcomeAllocations).toHaveLength(2);
  });

  it("rejects allocations whose question counts do not sum to totalQuestionCount", () => {
    expect(() =>
      assessmentSpecificationSchema.parse(
        spec({ outcomeAllocations: [{ learningOutcomeNodeKey: "node-lo1", outcomeNumber: 1, questionCount: 4, questionPercentage: 40 }] }),
      ),
    ).toThrow(/sum to/);
  });

  it("rejects a duplicate outcome number", () => {
    expect(() =>
      assessmentSpecificationSchema.parse(
        spec({
          totalQuestionCount: 10,
          outcomeAllocations: [
            { learningOutcomeNodeKey: "node-lo1", outcomeNumber: 1, questionCount: 5, questionPercentage: 50 },
            { learningOutcomeNodeKey: "node-lo1-dup", outcomeNumber: 1, questionCount: 5, questionPercentage: 50 },
          ],
        }),
      ),
    ).toThrow(/duplicate outcome allocation/);
  });

  it("rejects an empty outcomeAllocations array", () => {
    expect(() => assessmentSpecificationSchema.parse(spec({ outcomeAllocations: [] }))).toThrow();
  });

  it("rejects an unknown assessment method", () => {
    expect(() => assessmentSpecificationSchema.parse(spec({ method: "ESSAY" }))).toThrow();
  });
});

describe("assessmentSpecificationManifestSchema", () => {
  it("accepts multiple specifications", () => {
    const parsed = assessmentSpecificationManifestSchema.parse({
      specifications: [spec(), spec({ id: "assessment-spec.test.v2" })],
    });
    expect(parsed.specifications).toHaveLength(2);
  });
});
