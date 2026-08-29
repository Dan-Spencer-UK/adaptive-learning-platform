import { describe, expect, it } from "vitest";
import { lessonPlanSchema, lessonPlanManifestSchema, classifyV1StepRole, type LessonPlan, type LessonStep } from "./lesson-plan.ts";

function minimalStep(overrides: Partial<LessonStep> = {}): LessonStep {
  return {
    id: "step.orientation",
    type: "orientation",
    purpose: "Explain why this relationship matters.",
    requirement: "required",
    teaches: [],
    reinforces: [],
    tests: [],
    capabilityIds: [],
    misconceptionTargets: [],
    representation: {},
    presentation: { interactionRequired: false, answerReveal: "not_applicable", contentMayScroll: false, progressiveReveal: false },
    scaffoldingLevel: "guided",
    cognitiveDemand: "introductory",
    feedback: { mode: "immediate", explainWhy: true },
    completionCondition: "view_acknowledged",
    branchRoutes: [],
    evidenceEmitted: [],
    mayRevealTargetAnswer: false,
    ...overrides,
  };
}

function minimalLesson(overrides: Partial<LessonPlan> = {}): LessonPlan {
  return {
    id: "lesson.ohms-law",
    schemaVersion: 1,
    version: 1,
    title: "Ohm's Law",
    learnerFacingDescription: "Understand and apply V = I x R.",
    curriculumUnit: "City & Guilds 2365-02 Unit 202",
    prerequisiteKnowledge: [],
    targetAssertionFamilyIds: ["electrical.ohms_law"],
    targetAssertionIdentifiers: [],
    targetCapabilityIds: ["cap.ohms_law.recognise_relationship"],
    remediationEligibility: [],
    estimatedDurationMinutes: 15,
    instructionalStrategy: "Concept, then guided calculation, then independent application.",
    steps: [minimalStep()],
    misconceptionTargets: [],
    retrievalTags: [],
    completionCriteria: {
      requiredStepIds: ["step.orientation"],
      requiredCapabilityEvidence: ["cap.ohms_law.recognise_relationship"],
      masteryGateCapabilityIds: ["cap.ohms_law.recognise_relationship"],
      requiresRemediationClearance: true,
      exitSummary: "Learner has recognised the relationship.",
    },
    presentationModes: ["learn"],
    contentRelease: "release.synthetic-schema-test.v1",
    assessmentMappingIds: [],
    ...overrides,
  };
}

describe("lessonStepSchema (via lessonPlanSchema)", () => {
  it("accepts a minimal valid lesson", () => {
    expect(lessonPlanSchema.safeParse(minimalLesson()).success).toBe(true);
  });

  it("rejects a lesson with zero steps", () => {
    const result = lessonPlanSchema.safeParse(minimalLesson({ steps: [] }));
    expect(result.success).toBe(false);
  });

  it("rejects a lesson with zero target assertion families", () => {
    const result = lessonPlanSchema.safeParse(minimalLesson({ targetAssertionFamilyIds: [] }));
    expect(result.success).toBe(false);
  });

  it("rejects a lesson with zero target capabilities", () => {
    const result = lessonPlanSchema.safeParse(minimalLesson({ targetCapabilityIds: [] }));
    expect(result.success).toBe(false);
  });

  it("rejects an invalid step type", () => {
    const step = { ...minimalStep(), type: "blue_card_with_button" };
    const result = lessonPlanSchema.safeParse(minimalLesson({ steps: [step as never] }));
    expect(result.success).toBe(false);
  });

  it("accepts a lesson with no remediationEligibility declared (the default -- most lessons are not remediation candidates)", () => {
    const result = lessonPlanSchema.safeParse(minimalLesson());
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.remediationEligibility).toEqual([]);
  });

  it("accepts a lesson declaring itself remediation-eligible for a family", () => {
    const result = lessonPlanSchema.safeParse(
      minimalLesson({ remediationEligibility: [{ assertionFamilyId: "foundational.example", isDefaultRemediation: true }] }),
    );
    expect(result.success).toBe(true);
  });

  it("rejects duplicate remediationEligibility entries for the same assertion family within one lesson", () => {
    const result = lessonPlanSchema.safeParse(
      minimalLesson({
        remediationEligibility: [
          { assertionFamilyId: "foundational.example", isDefaultRemediation: true },
          { assertionFamilyId: "foundational.example", isDefaultRemediation: false },
        ],
      }),
    );
    expect(result.success).toBe(false);
  });

  it("defaults answerReveal to not_applicable and contentMayScroll/progressiveReveal to false", () => {
    const lesson = minimalLesson({
      steps: [
        {
          ...minimalStep(),
          presentation: { interactionRequired: false } as never,
        },
      ],
    });
    const result = lessonPlanSchema.parse(lesson);
    expect(result.steps[0]!.presentation.answerReveal).toBe("not_applicable");
    expect(result.steps[0]!.presentation.contentMayScroll).toBe(false);
  });
});

describe("lessonPlanSchema -- structural (superRefine) validation", () => {
  it("rejects duplicate step ids within one lesson", () => {
    const lesson = minimalLesson({
      steps: [minimalStep({ id: "step.a" }), minimalStep({ id: "step.a" })],
      completionCriteria: {
        requiredStepIds: ["step.a"],
        requiredCapabilityEvidence: ["cap.ohms_law.recognise_relationship"],
      masteryGateCapabilityIds: ["cap.ohms_law.recognise_relationship"],
        requiresRemediationClearance: true,
        exitSummary: "x",
      },
    });
    const result = lessonPlanSchema.safeParse(lesson);
    expect(result.success).toBe(false);
  });

  it("rejects a branch route targeting an unknown step id", () => {
    const lesson = minimalLesson({
      steps: [
        minimalStep({
          id: "step.a",
          branchRoutes: [{ trigger: "capability_not_evidenced", destinationStepId: "step.does-not-exist", description: "route to nowhere" }],
        }),
      ],
    });
    const result = lessonPlanSchema.safeParse(lesson);
    expect(result.success).toBe(false);
  });

  it("rejects a branch route that targets itself", () => {
    const lesson = minimalLesson({
      steps: [
        minimalStep({
          id: "step.a",
          branchRoutes: [{ trigger: "below_tolerance", destinationStepId: "step.a", description: "self-loop" }],
        }),
      ],
      completionCriteria: {
        requiredStepIds: ["step.a"],
        requiredCapabilityEvidence: ["cap.ohms_law.recognise_relationship"],
      masteryGateCapabilityIds: ["cap.ohms_law.recognise_relationship"],
        requiresRemediationClearance: true,
        exitSummary: "x",
      },
    });
    const result = lessonPlanSchema.safeParse(lesson);
    expect(result.success).toBe(false);
  });

  it("rejects a misconception_detected branch trigger with no misconceptionIdentifier", () => {
    const lesson = minimalLesson({
      steps: [
        minimalStep({ id: "step.a" }),
        minimalStep({
          id: "step.b",
          branchRoutes: [{ trigger: "misconception_detected", destinationStepId: "step.a", description: "missing id" }],
        }),
      ],
      completionCriteria: {
        requiredStepIds: ["step.a", "step.b"],
        requiredCapabilityEvidence: ["cap.ohms_law.recognise_relationship"],
      masteryGateCapabilityIds: ["cap.ohms_law.recognise_relationship"],
        requiresRemediationClearance: true,
        exitSummary: "x",
      },
    });
    const result = lessonPlanSchema.safeParse(lesson);
    expect(result.success).toBe(false);
  });

  it("accepts a valid misconception_detected branch route with an identifier, pointing at a real other step", () => {
    const lesson = minimalLesson({
      steps: [
        minimalStep({ id: "step.a" }),
        minimalStep({
          id: "step.b",
          branchRoutes: [
            { trigger: "misconception_detected", misconceptionIdentifier: "MIS-EL-OHM-WRONG-OPERATION-001", destinationStepId: "step.a", description: "remediate" },
          ],
        }),
      ],
      completionCriteria: {
        requiredStepIds: ["step.a", "step.b"],
        requiredCapabilityEvidence: ["cap.ohms_law.recognise_relationship"],
      masteryGateCapabilityIds: ["cap.ohms_law.recognise_relationship"],
        requiresRemediationClearance: true,
        exitSummary: "x",
      },
    });
    expect(lessonPlanSchema.safeParse(lesson).success).toBe(true);
  });

  it("rejects completionCriteria.requiredStepIds referencing an unknown step id", () => {
    const lesson = minimalLesson({
      completionCriteria: {
        requiredStepIds: ["step.does-not-exist"],
        requiredCapabilityEvidence: ["cap.ohms_law.recognise_relationship"],
      masteryGateCapabilityIds: ["cap.ohms_law.recognise_relationship"],
        requiresRemediationClearance: true,
        exitSummary: "x",
      },
    });
    const result = lessonPlanSchema.safeParse(lesson);
    expect(result.success).toBe(false);
  });
});

describe("lessonPlanManifestSchema", () => {
  it("accepts a manifest with one valid lesson", () => {
    const result = lessonPlanManifestSchema.safeParse({ lessons: [minimalLesson()] });
    expect(result.success).toBe(true);
  });

  it("rejects a manifest with two lessons sharing the same id and version", () => {
    const result = lessonPlanManifestSchema.safeParse({ lessons: [minimalLesson(), minimalLesson()] });
    expect(result.success).toBe(false);
  });

  it("accepts two lessons with the same id but different versions", () => {
    const result = lessonPlanManifestSchema.safeParse({ lessons: [minimalLesson(), minimalLesson({ version: 2 })] });
    expect(result.success).toBe(true);
  });
});

describe("masteryGateCapabilityId placement (CC-06D, Correction F §10.3)", () => {
  it("REQUIRES the field on a non-retrieval conditional_skip_if_mastered step", () => {
    const lesson = minimalLesson({
      steps: [
        minimalStep({
          id: "skip_step",
          type: "guided_interaction",
          requirement: "conditional_skip_if_mastered",
          capabilityIds: ["cap.x"],
          evidenceEmitted: ["cap.x"],
        }),
        minimalStep(),
      ],
    });
    const result = lessonPlanSchema.safeParse(lesson);
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error?.issues)).toMatch(/masteryGateCapabilityId/);
  });

  it("accepts an explicit masteryGateCapabilityId on a conditional_skip_if_mastered step", () => {
    const lesson = minimalLesson({
      steps: [
        minimalStep({
          id: "skip_step",
          type: "guided_interaction",
          requirement: "conditional_skip_if_mastered",
          capabilityIds: ["cap.x"],
          masteryGateCapabilityId: "cap.x",
        }),
        minimalStep(),
      ],
    });
    expect(lessonPlanSchema.safeParse(lesson).success).toBe(true);
  });

  it("does NOT require the field on a conditional_skip_if_mastered retrieval_check step (gated by retrieval dueness, not capability mastery)", () => {
    const lesson = minimalLesson({
      steps: [
        minimalStep({ id: "retrieval", type: "retrieval_check", requirement: "conditional_skip_if_mastered", capabilityIds: ["cap.x"] }),
        minimalStep(),
      ],
    });
    expect(lessonPlanSchema.safeParse(lesson).success).toBe(true);
  });

  it("REJECTS the field where it has no semantic purpose (a required step)", () => {
    const lesson = minimalLesson({
      steps: [minimalStep({ id: "ordinary", masteryGateCapabilityId: "cap.x" })],
      completionCriteria: {
        requiredStepIds: ["ordinary"],
        requiredCapabilityEvidence: ["cap.ohms_law.recognise_relationship"],
      masteryGateCapabilityIds: ["cap.ohms_law.recognise_relationship"],
        requiresRemediationClearance: true,
        exitSummary: "s",
      },
    });
    const result = lessonPlanSchema.safeParse(lesson);
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error?.issues)).toMatch(/no semantic purpose/);
  });
});

describe("classifyV1StepRole (ADR-0006 V1/post-V1 step-type classification)", () => {
  it("classifies ordinary teaching/interaction/completion step types as V1_ORDINARY", () => {
    for (const type of [
      "orientation",
      "concept_explanation",
      "visual_explanation",
      "worked_example",
      "guided_interaction",
      "independent_question",
      "retrieval_check",
      "recap",
      "exit_completion",
    ] as const) {
      expect(classifyV1StepRole(type)).toBe("V1_ORDINARY");
    }
  });

  it("classifies diagnostic/remediation/transfer step types as POST_V1_ADAPTIVE", () => {
    expect(classifyV1StepRole("misconception_discrimination")).toBe("POST_V1_ADAPTIVE");
    expect(classifyV1StepRole("remediation")).toBe("POST_V1_ADAPTIVE");
    expect(classifyV1StepRole("transfer_application")).toBe("POST_V1_ADAPTIVE");
  });
});

describe("ADR-0006 routePolicy: CANONICAL_FIXED_ROUTE invariance gate", () => {
  it("accepts a CANONICAL_FIXED_ROUTE lesson where every step is required", () => {
    const lesson = minimalLesson({ routePolicy: "CANONICAL_FIXED_ROUTE" });
    expect(lessonPlanSchema.safeParse(lesson).success).toBe(true);
  });

  it("rejects a CANONICAL_FIXED_ROUTE lesson containing a conditional_skip_if_mastered step", () => {
    const lesson = minimalLesson({
      routePolicy: "CANONICAL_FIXED_ROUTE",
      steps: [
        minimalStep(),
        minimalStep({ id: "skip_step", type: "guided_interaction", requirement: "conditional_skip_if_mastered", capabilityIds: ["cap.x"], masteryGateCapabilityId: "cap.x" }),
      ],
    });
    const result = lessonPlanSchema.safeParse(lesson);
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error?.issues)).toMatch(/CANONICAL_FIXED_ROUTE/);
  });

  it("does NOT flag conditional steps on a lesson that declares no routePolicy at all (retained platform capability remains valid)", () => {
    const lesson = minimalLesson({
      steps: [
        minimalStep(),
        minimalStep({ id: "skip_step", type: "guided_interaction", requirement: "conditional_skip_if_mastered", capabilityIds: ["cap.x"], masteryGateCapabilityId: "cap.x" }),
      ],
    });
    expect(lessonPlanSchema.safeParse(lesson).success).toBe(true);
  });
});

describe("ADR-0005 embedded-check answer-leak gate (mayRevealTargetAnswer)", () => {
  it("rejects a teaching step marked mayRevealTargetAnswer that precedes a graded check on the same capability", () => {
    const lesson = minimalLesson({
      steps: [
        minimalStep({ id: "teach", type: "worked_example", mayRevealTargetAnswer: true, teaches: ["assertion.a"], capabilityIds: ["cap.ohms_law.recognise_relationship"] }),
        minimalStep({ id: "check", type: "independent_question", completionCondition: "correct_answer_required", tests: ["assertion.a"], capabilityIds: ["cap.ohms_law.recognise_relationship"] }),
      ],
      completionCriteria: {
        requiredStepIds: ["teach", "check"],
        requiredCapabilityEvidence: ["cap.ohms_law.recognise_relationship"],
        masteryGateCapabilityIds: ["cap.ohms_law.recognise_relationship"],
        requiresRemediationClearance: true,
        exitSummary: "x",
      },
    });
    const result = lessonPlanSchema.safeParse(lesson);
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error?.issues)).toMatch(/answer-bearing/);
  });

  it("accepts the same shape when mayRevealTargetAnswer is false (the default)", () => {
    const lesson = minimalLesson({
      steps: [
        minimalStep({ id: "teach", type: "worked_example", teaches: ["assertion.a"], capabilityIds: ["cap.ohms_law.recognise_relationship"] }),
        minimalStep({ id: "check", type: "independent_question", completionCondition: "correct_answer_required", tests: ["assertion.a"], capabilityIds: ["cap.ohms_law.recognise_relationship"] }),
      ],
      completionCriteria: {
        requiredStepIds: ["teach", "check"],
        requiredCapabilityEvidence: ["cap.ohms_law.recognise_relationship"],
        masteryGateCapabilityIds: ["cap.ohms_law.recognise_relationship"],
        requiresRemediationClearance: true,
        exitSummary: "x",
      },
    });
    expect(lessonPlanSchema.safeParse(lesson).success).toBe(true);
  });

  it("accepts mayRevealTargetAnswer on a step with no LATER overlapping graded check (e.g. a worked example after the only check, or on an unrelated capability)", () => {
    const lesson = minimalLesson({
      steps: [
        minimalStep({ id: "check", type: "independent_question", completionCondition: "correct_answer_required", tests: ["assertion.a"], capabilityIds: ["cap.ohms_law.recognise_relationship"] }),
        minimalStep({ id: "teach", type: "worked_example", mayRevealTargetAnswer: true, teaches: ["assertion.a"], capabilityIds: ["cap.ohms_law.recognise_relationship"] }),
      ],
      completionCriteria: {
        requiredStepIds: ["check", "teach"],
        requiredCapabilityEvidence: ["cap.ohms_law.recognise_relationship"],
        masteryGateCapabilityIds: ["cap.ohms_law.recognise_relationship"],
        requiresRemediationClearance: true,
        exitSummary: "x",
      },
    });
    expect(lessonPlanSchema.safeParse(lesson).success).toBe(true);
  });
});
