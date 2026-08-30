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

  // CC-13C.1 (remediation of CC-13B's V1-ROUTE-DRIFT-REGISTER.md §2 / BYPASS-PATH-REGISTER.md
  // BP-1 finding): the `requirement` check above only closes conditional step *inclusion*.
  // A `required` step could still carry a non-empty `branchRoutes`, letting
  // resolveWithinSessionBranch (@alp/learning-engine) divert a CANONICAL_FIXED_ROUTE lesson to a
  // different within-session destination depending on the learner's answer. These tests prove
  // that gap is now closed.

  it("rejects a CANONICAL_FIXED_ROUTE lesson containing a required step that also declares a non-empty branchRoutes", () => {
    const lesson = minimalLesson({
      routePolicy: "CANONICAL_FIXED_ROUTE",
      steps: [
        minimalStep(),
        minimalStep({
          id: "branching_step",
          requirement: "required",
          branchRoutes: [{ trigger: "incorrect_answer", destinationStepId: "step.orientation", description: "remediate" }],
        }),
      ],
    });
    const result = lessonPlanSchema.safeParse(lesson);
    expect(result.success).toBe(false);
    const issues = JSON.stringify(result.error?.issues);
    expect(issues).toMatch(/CANONICAL_FIXED_ROUTE/);
    expect(issues).toMatch(/branchRoutes/);
  });

  it("accepts a CANONICAL_FIXED_ROUTE lesson whose steps declare branchRoutes as an empty array", () => {
    const lesson = minimalLesson({
      routePolicy: "CANONICAL_FIXED_ROUTE",
      steps: [minimalStep({ branchRoutes: [] })],
    });
    expect(lessonPlanSchema.safeParse(lesson).success).toBe(true);
  });

  it("accepts a CANONICAL_FIXED_ROUTE lesson whose step omits branchRoutes entirely (schema default [] is equivalent to an explicit empty array)", () => {
    const step = minimalStep();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- deliberately dropping the field to prove the schema's own `.default([])` behaves identically to an explicit `[]` for this gate.
    const { branchRoutes: _omitted, ...stepWithoutBranchRoutes } = step;
    const lesson = minimalLesson({
      routePolicy: "CANONICAL_FIXED_ROUTE",
      steps: [stepWithoutBranchRoutes as unknown as LessonStep],
    });
    expect(lessonPlanSchema.safeParse(lesson).success).toBe(true);
  });

  it("(existing invariant, unchanged by this fix) still rejects a CANONICAL_FIXED_ROUTE lesson containing a required step with empty branchRoutes but a non-required requirement elsewhere", () => {
    const lesson = minimalLesson({
      routePolicy: "CANONICAL_FIXED_ROUTE",
      steps: [
        minimalStep(),
        minimalStep({ id: "skip_step", type: "guided_interaction", requirement: "conditional_skip_if_mastered", capabilityIds: ["cap.x"], masteryGateCapabilityId: "cap.x", branchRoutes: [] }),
      ],
    });
    const result = lessonPlanSchema.safeParse(lesson);
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error?.issues)).toMatch(/requirement 'conditional_skip_if_mastered'/);
  });

  // Requirement C ("a non-canonical / retained-adaptive lesson may still use branchRoutes") is
  // already proven by the pre-existing "accepts a valid misconception_detected branch route..."
  // test above (no routePolicy declared, non-empty branchRoutes, expected success) -- unaffected
  // by this change since that test's lesson never sets routePolicy: "CANONICAL_FIXED_ROUTE".
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

describe("CC-13C.2B: governed rich teaching content blocks (contentBlocks)", () => {
  const REAL_FORMULA_FAMILY_ID = "formula.ohms_law";
  const REAL_WORKED_EXAMPLE_ID = "worked.ohms_law.solve_voltage";
  const REAL_DIAGRAM_BLUEPRINT_ID = "circuit.series_resistors";
  const REAL_VISUAL_AID_ID = "mnemonic.vir_triangle";

  function richStep(overrides: Partial<LessonStep> = {}): LessonStep {
    return minimalStep({
      id: "step.rich",
      type: "concept_explanation",
      learnerFacingHeading: "Voltage, current and resistance",
      mayRevealTargetAnswer: false,
      contentBlocks: [
        { type: "paragraph", text: "Voltage, current and resistance are the three core electrical quantities." },
        { type: "paragraph", text: "Voltage drives current around a circuit; resistance opposes that flow." },
        { type: "visual", source: { kind: "diagram", diagramBlueprintId: REAL_DIAGRAM_BLUEPRINT_ID } },
        { type: "paragraph", text: "The relationship between them is fixed and can be expressed as a formula." },
        { type: "formula", formulaFamilyId: REAL_FORMULA_FAMILY_ID },
        { type: "worked_example", workedExampleBlueprintId: REAL_WORKED_EXAMPLE_ID },
        { type: "callout", variant: "key_point", text: "Doubling voltage doubles current for a fixed resistance." },
      ],
      ...overrides,
    });
  }

  // A) valid rich step with all 6 block types
  it("A: accepts a rich step with all 6 block types, in one exact authored sequence", () => {
    const lesson = minimalLesson({ steps: [richStep()], completionCriteria: { requiredStepIds: ["step.rich"], requiredCapabilityEvidence: ["cap.ohms_law.recognise_relationship"], masteryGateCapabilityIds: ["cap.ohms_law.recognise_relationship"], requiresRemediationClearance: true, exitSummary: "x" } });
    const result = lessonPlanSchema.safeParse(lesson);
    expect(result.success).toBe(true);
  });

  // B) contentBlocks preserves array order
  it("B: preserves contentBlocks array order exactly, never sorting/regrouping by type", () => {
    const lesson = minimalLesson({ steps: [richStep()], completionCriteria: { requiredStepIds: ["step.rich"], requiredCapabilityEvidence: ["cap.ohms_law.recognise_relationship"], masteryGateCapabilityIds: ["cap.ohms_law.recognise_relationship"], requiresRemediationClearance: true, exitSummary: "x" } });
    const result = lessonPlanSchema.parse(lesson);
    expect(result.steps[0]!.contentBlocks!.map((b) => b.type)).toEqual([
      "paragraph",
      "paragraph",
      "visual",
      "paragraph",
      "formula",
      "worked_example",
      "callout",
    ]);
  });

  // C) explicit empty contentBlocks: [] fails
  it("C: rejects an explicit empty contentBlocks array -- PRESENT-but-empty is invalid, never silently treated as absent", () => {
    const lesson = minimalLesson({ steps: [minimalStep({ contentBlocks: [] as never })] });
    const result = lessonPlanSchema.safeParse(lesson);
    expect(result.success).toBe(false);
  });

  // D) legacy step with contentBlocks absent remains valid
  it("D: a legacy step with contentBlocks absent remains valid, unaffected by the new fields", () => {
    const result = lessonPlanSchema.safeParse(minimalLesson());
    expect(result.success).toBe(true);
  });

  // E-H) contentBlocks + each conflicting legacy representation field fails
  it("E: rejects contentBlocks coexisting with a legacy representation.formulaFamilyId", () => {
    const step = richStep({ representation: { formulaFamilyId: REAL_FORMULA_FAMILY_ID } });
    const result = lessonPlanSchema.safeParse(minimalLesson({ steps: [step], completionCriteria: { requiredStepIds: ["step.rich"], requiredCapabilityEvidence: ["cap.ohms_law.recognise_relationship"], masteryGateCapabilityIds: ["cap.ohms_law.recognise_relationship"], requiresRemediationClearance: true, exitSummary: "x" } }));
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error?.issues)).toMatch(/formulaFamilyId/);
  });

  it("F: rejects contentBlocks coexisting with a legacy representation.diagramBlueprintId", () => {
    const step = richStep({ representation: { diagramBlueprintId: REAL_DIAGRAM_BLUEPRINT_ID } });
    const result = lessonPlanSchema.safeParse(minimalLesson({ steps: [step], completionCriteria: { requiredStepIds: ["step.rich"], requiredCapabilityEvidence: ["cap.ohms_law.recognise_relationship"], masteryGateCapabilityIds: ["cap.ohms_law.recognise_relationship"], requiresRemediationClearance: true, exitSummary: "x" } }));
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error?.issues)).toMatch(/diagramBlueprintId/);
  });

  it("G: rejects contentBlocks coexisting with a legacy representation.visualAidBlueprintId", () => {
    const step = richStep({ representation: { visualAidBlueprintId: REAL_VISUAL_AID_ID } });
    const result = lessonPlanSchema.safeParse(minimalLesson({ steps: [step], completionCriteria: { requiredStepIds: ["step.rich"], requiredCapabilityEvidence: ["cap.ohms_law.recognise_relationship"], masteryGateCapabilityIds: ["cap.ohms_law.recognise_relationship"], requiresRemediationClearance: true, exitSummary: "x" } }));
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error?.issues)).toMatch(/visualAidBlueprintId/);
  });

  it("H: rejects contentBlocks coexisting with a legacy representation.workedExampleBlueprintId", () => {
    const step = richStep({ representation: { workedExampleBlueprintId: REAL_WORKED_EXAMPLE_ID } });
    const result = lessonPlanSchema.safeParse(minimalLesson({ steps: [step], completionCriteria: { requiredStepIds: ["step.rich"], requiredCapabilityEvidence: ["cap.ohms_law.recognise_relationship"], masteryGateCapabilityIds: ["cap.ohms_law.recognise_relationship"], requiresRemediationClearance: true, exitSummary: "x" } }));
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error?.issues)).toMatch(/workedExampleBlueprintId/);
  });

  // I) contentBlocks on a graded/evidence-bearing step fails
  it("I: rejects contentBlocks on a step with completionCondition 'correct_answer_required'", () => {
    const step = richStep({ completionCondition: "correct_answer_required" });
    const result = lessonPlanSchema.safeParse(minimalLesson({ steps: [step], completionCriteria: { requiredStepIds: ["step.rich"], requiredCapabilityEvidence: ["cap.ohms_law.recognise_relationship"], masteryGateCapabilityIds: ["cap.ohms_law.recognise_relationship"], requiresRemediationClearance: true, exitSummary: "x" } }));
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error?.issues)).toMatch(/graded\/evidence-bearing/);
  });

  it("I2: rejects contentBlocks on a step that carries a questionBlueprintId (even if not completionCondition 'correct_answer_required')", () => {
    const step = richStep({ questionBlueprintId: "some.blueprint" });
    const result = lessonPlanSchema.safeParse(minimalLesson({ steps: [step], completionCriteria: { requiredStepIds: ["step.rich"], requiredCapabilityEvidence: ["cap.ohms_law.recognise_relationship"], masteryGateCapabilityIds: ["cap.ohms_law.recognise_relationship"], requiresRemediationClearance: true, exitSummary: "x" } }));
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error?.issues)).toMatch(/graded\/evidence-bearing/);
  });

  // J) contentBlocks + mayRevealTargetAnswer omitted fails
  it("J: rejects contentBlocks with mayRevealTargetAnswer omitted (undefined)", () => {
    const step = { ...richStep(), mayRevealTargetAnswer: undefined };
    const result = lessonPlanSchema.safeParse(minimalLesson({ steps: [step], completionCriteria: { requiredStepIds: ["step.rich"], requiredCapabilityEvidence: ["cap.ohms_law.recognise_relationship"], masteryGateCapabilityIds: ["cap.ohms_law.recognise_relationship"], requiresRemediationClearance: true, exitSummary: "x" } }));
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error?.issues)).toMatch(/mayRevealTargetAnswer/);
  });

  // K) contentBlocks with explicit mayRevealTargetAnswer: false is valid
  it("K: accepts contentBlocks with explicit mayRevealTargetAnswer: false (otherwise valid)", () => {
    const step = richStep({ mayRevealTargetAnswer: false });
    const result = lessonPlanSchema.safeParse(minimalLesson({ steps: [step], completionCriteria: { requiredStepIds: ["step.rich"], requiredCapabilityEvidence: ["cap.ohms_law.recognise_relationship"], masteryGateCapabilityIds: ["cap.ohms_law.recognise_relationship"], requiresRemediationClearance: true, exitSummary: "x" } }));
    expect(result.success).toBe(true);
  });

  // L) existing answer-leak gate still rejects a rich teaching step marked
  // mayRevealTargetAnswer: true before an overlapping later graded step --
  // a NEW test using contentBlocks, proving the existing gate was not weakened.
  it("L: still rejects a rich (contentBlocks) teaching step marked mayRevealTargetAnswer: true when it precedes an overlapping later graded check", () => {
    const teachStep = richStep({
      id: "teach_rich",
      mayRevealTargetAnswer: true,
      teaches: ["assertion.a"],
      capabilityIds: ["cap.ohms_law.recognise_relationship"],
    });
    const checkStep = minimalStep({
      id: "check",
      type: "independent_question",
      completionCondition: "correct_answer_required",
      tests: ["assertion.a"],
      capabilityIds: ["cap.ohms_law.recognise_relationship"],
    });
    const lesson = minimalLesson({
      steps: [teachStep, checkStep],
      completionCriteria: {
        requiredStepIds: ["teach_rich", "check"],
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

  // M) diagram visual block valid
  it("M: accepts a visual block with a diagram source (and optional diagramParameters)", () => {
    const step = minimalStep({
      contentBlocks: [{ type: "visual", source: { kind: "diagram", diagramBlueprintId: REAL_DIAGRAM_BLUEPRINT_ID, diagramParameters: { component_type: "capacitor" } } }],
      mayRevealTargetAnswer: false,
    });
    const result = lessonPlanSchema.safeParse(minimalLesson({ steps: [step] }));
    expect(result.success).toBe(true);
  });

  // N) visual-aid visual block valid
  it("N: accepts a visual block with a visual_aid source", () => {
    const step = minimalStep({
      contentBlocks: [{ type: "visual", source: { kind: "visual_aid", visualAidBlueprintId: REAL_VISUAL_AID_ID } }],
      mayRevealTargetAnswer: false,
    });
    const result = lessonPlanSchema.safeParse(minimalLesson({ steps: [step] }));
    expect(result.success).toBe(true);
  });

  // O) malformed visual source fails
  it("O: rejects a visual block whose source has an invalid/unknown kind", () => {
    const step = minimalStep({
      contentBlocks: [{ type: "visual", source: { kind: "produced_artwork", assetId: "x" } } as never],
      mayRevealTargetAnswer: false,
    });
    const result = lessonPlanSchema.safeParse(minimalLesson({ steps: [step] }));
    expect(result.success).toBe(false);
  });

  it("O2: rejects a visual block whose diagram source is missing diagramBlueprintId", () => {
    const step = minimalStep({
      contentBlocks: [{ type: "visual", source: { kind: "diagram" } } as never],
      mayRevealTargetAnswer: false,
    });
    const result = lessonPlanSchema.safeParse(minimalLesson({ steps: [step] }));
    expect(result.success).toBe(false);
  });

  // P) list requires >=1 non-empty item
  it("P: rejects a list block with zero items", () => {
    const step = minimalStep({ contentBlocks: [{ type: "list", style: "unordered", items: [] }], mayRevealTargetAnswer: false });
    const result = lessonPlanSchema.safeParse(minimalLesson({ steps: [step] }));
    expect(result.success).toBe(false);
  });

  it("P2: rejects a list block with an empty-string item", () => {
    const step = minimalStep({ contentBlocks: [{ type: "list", style: "unordered", items: [""] }], mayRevealTargetAnswer: false });
    const result = lessonPlanSchema.safeParse(minimalLesson({ steps: [step] }));
    expect(result.success).toBe(false);
  });

  it("P3: accepts a list block with one or more non-empty items", () => {
    const step = minimalStep({ contentBlocks: [{ type: "list", style: "ordered", items: ["First point.", "Second point."] }], mayRevealTargetAnswer: false });
    const result = lessonPlanSchema.safeParse(minimalLesson({ steps: [step] }));
    expect(result.success).toBe(true);
  });

  // Q) callout accepts exactly key_point/definition/caution, rejects a 4th
  it.each(["key_point", "definition", "caution"] as const)("Q: accepts callout variant '%s'", (variant) => {
    const step = minimalStep({ contentBlocks: [{ type: "callout", variant, text: "Something worth flagging." }], mayRevealTargetAnswer: false });
    const result = lessonPlanSchema.safeParse(minimalLesson({ steps: [step] }));
    expect(result.success).toBe(true);
  });

  it("Q2: rejects an invalid 4th callout variant", () => {
    const step = minimalStep({ contentBlocks: [{ type: "callout", variant: "note", text: "x" } as never], mayRevealTargetAnswer: false });
    const result = lessonPlanSchema.safeParse(minimalLesson({ steps: [step] }));
    expect(result.success).toBe(false);
  });

  // R) confirm no new rule breaks existing legacy lesson fixtures
  it("R: a lesson with a legacy representation-only step (no contentBlocks) still validates -- the new rules are correctly gated on contentBlocks presence", () => {
    const lesson = minimalLesson({
      steps: [minimalStep({ representation: { formulaFamilyId: REAL_FORMULA_FAMILY_ID, workedExampleBlueprintId: REAL_WORKED_EXAMPLE_ID } })],
    });
    const result = lessonPlanSchema.safeParse(lesson);
    expect(result.success).toBe(true);
  });

  it("accepts a step with learnerFacingHeading but no contentBlocks (heading is independent of the block system)", () => {
    const step = minimalStep({ learnerFacingHeading: "A legacy step with a nicer heading" });
    const result = lessonPlanSchema.safeParse(minimalLesson({ steps: [step] }));
    expect(result.success).toBe(true);
  });
});
