import { describe, expect, it } from "vitest";
import { guidedRevisionPlanSchema, buildGuidedRevisionPlan, selectLatestSubmittedResultInScope } from "./guided-revision.ts";
import type { SubmittedAssessmentResult } from "./assessment-instance.ts";

function submittedResult(overrides: Partial<SubmittedAssessmentResult> = {}): SubmittedAssessmentResult {
  return {
    assessmentInstanceId: "attempt.001",
    scopeId: "unit202",
    submittedAt: "2026-08-29T09:20:05.000Z",
    itemResults: [
      { questionInstanceId: "q.001", capabilityIds: ["cap.ohms_law.solve_for_current"], revisionLessonIds: ["lesson.ohms-law"], correct: false },
      { questionInstanceId: "q.002", capabilityIds: ["cap.resistors_parallel.calculate_total"], revisionLessonIds: ["lesson.resistors-parallel"], correct: false },
      { questionInstanceId: "q.003", capabilityIds: ["cap.resistors_parallel.calculate_total"], revisionLessonIds: ["lesson.resistors-parallel"], correct: false },
      { questionInstanceId: "q.004", capabilityIds: ["cap.si_units.identify"], revisionLessonIds: ["lesson.si-units"], correct: true },
    ],
    ...overrides,
  };
}

describe("guidedRevisionPlanSchema structural gates", () => {
  const basePlan = {
    planId: "plan.001",
    scopeId: "unit202",
    sourceAssessmentInstanceId: "attempt.001",
    sourceAssessmentSubmittedAt: "2026-08-29T09:20:05.000Z",
    generatedAt: "2026-08-29T09:20:06.000Z",
    policyVersion: "guided-revision-v1",
  };

  it("accepts a well-formed plan with contiguous ranks in array order", () => {
    const result = guidedRevisionPlanSchema.safeParse({
      ...basePlan,
      items: [
        { rank: 1, lessonId: "lesson.a", priorityBand: "HIGH", reason: "x", contributingCapabilityIds: ["cap.a"] },
        { rank: 2, lessonId: "lesson.b", priorityBand: "LOW", reason: "y", contributingCapabilityIds: ["cap.b"] },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects a plan with duplicate lesson mappings", () => {
    const result = guidedRevisionPlanSchema.safeParse({
      ...basePlan,
      items: [
        { rank: 1, lessonId: "lesson.a", priorityBand: "HIGH", reason: "x", contributingCapabilityIds: ["cap.a"] },
        { rank: 2, lessonId: "lesson.a", priorityBand: "LOW", reason: "y", contributingCapabilityIds: ["cap.b"] },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a plan whose rank sequence does not match array order", () => {
    const result = guidedRevisionPlanSchema.safeParse({
      ...basePlan,
      items: [
        { rank: 2, lessonId: "lesson.a", priorityBand: "HIGH", reason: "x", contributingCapabilityIds: ["cap.a"] },
        { rank: 1, lessonId: "lesson.b", priorityBand: "LOW", reason: "y", contributingCapabilityIds: ["cap.b"] },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("accepts an empty plan (a submitted assessment with no weaknesses exposed)", () => {
    expect(guidedRevisionPlanSchema.safeParse({ ...basePlan, items: [] }).success).toBe(true);
  });
});

describe("buildGuidedRevisionPlan (deterministic weakness aggregation)", () => {
  it("ranks lesson.resistors-parallel above lesson.ohms-law (2 incorrect items vs 1) and excludes lesson.si-units (its only item was correct)", () => {
    const plan = buildGuidedRevisionPlan(submittedResult(), { planId: "plan.001", generatedAt: "2026-08-29T09:20:06.000Z", policyVersion: "v1" });
    expect(plan.items.map((i) => i.lessonId)).toEqual(["lesson.resistors-parallel", "lesson.ohms-law"]);
    expect(plan.items[0]!.rank).toBe(1);
    expect(plan.items[1]!.rank).toBe(2);
  });

  it("is a pure function: identical input always produces an identical plan (modulo the supplied options)", () => {
    const options = { planId: "plan.001", generatedAt: "2026-08-29T09:20:06.000Z", policyVersion: "v1" };
    const planA = buildGuidedRevisionPlan(submittedResult(), options);
    const planB = buildGuidedRevisionPlan(submittedResult(), options);
    expect(planA).toEqual(planB);
  });

  it("never regenerates weakness from correct items", () => {
    const onlyCorrect = submittedResult({
      itemResults: [{ questionInstanceId: "q.001", capabilityIds: ["cap.a"], revisionLessonIds: ["lesson.a"], correct: true }],
    });
    const plan = buildGuidedRevisionPlan(onlyCorrect, { planId: "plan.001", generatedAt: "2026-08-29T09:20:06.000Z", policyVersion: "v1" });
    expect(plan.items).toEqual([]);
  });

  it("carries sourceAssessmentInstanceId/sourceAssessmentSubmittedAt straight from the submitted result", () => {
    const plan = buildGuidedRevisionPlan(submittedResult(), { planId: "plan.001", generatedAt: "2026-08-29T09:20:06.000Z", policyVersion: "v1" });
    expect(plan.sourceAssessmentInstanceId).toBe("attempt.001");
    expect(plan.sourceAssessmentSubmittedAt).toBe("2026-08-29T09:20:05.000Z");
  });

  it("deduplicates a lesson mapped by more than one incorrect item into exactly one plan item, aggregating its contributing capabilities/questions", () => {
    const plan = buildGuidedRevisionPlan(submittedResult(), { planId: "plan.001", generatedAt: "2026-08-29T09:20:06.000Z", policyVersion: "v1" });
    const resistorsItem = plan.items.find((i) => i.lessonId === "lesson.resistors-parallel")!;
    expect(resistorsItem).toBeDefined();
    expect(resistorsItem.contributingCapabilityIds).toEqual(["cap.resistors_parallel.calculate_total"]);
  });
});

describe("selectLatestSubmittedResultInScope", () => {
  it("returns the result with the latest submittedAt within the given scope", () => {
    const earlier = submittedResult({ assessmentInstanceId: "attempt.earlier", submittedAt: "2026-08-01T09:00:00.000Z" });
    const later = submittedResult({ assessmentInstanceId: "attempt.later", submittedAt: "2026-08-29T09:20:05.000Z" });
    expect(selectLatestSubmittedResultInScope([earlier, later], "unit202")?.assessmentInstanceId).toBe("attempt.later");
  });

  it("ignores results outside the requested scope", () => {
    const otherScope = submittedResult({ assessmentInstanceId: "attempt.other-scope", scopeId: "unit203", submittedAt: "2026-08-30T09:00:00.000Z" });
    const inScope = submittedResult({ assessmentInstanceId: "attempt.in-scope" });
    expect(selectLatestSubmittedResultInScope([otherScope, inScope], "unit202")?.assessmentInstanceId).toBe("attempt.in-scope");
  });

  it("returns undefined when no result exists in scope", () => {
    expect(selectLatestSubmittedResultInScope([], "unit202")).toBeUndefined();
  });
});
