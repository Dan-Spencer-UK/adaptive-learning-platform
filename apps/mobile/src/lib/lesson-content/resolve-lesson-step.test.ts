import type { LessonPlan, LessonStep } from "@alp/content-schema";

import { bundledContentReleaseId, getLocalLesson } from "./local-content-registry";
import { resolveLessonStep } from "./resolve-lesson-step";

const record = getLocalLesson({ lessonId: "lesson.electrical.ohms-law", contentRelease: bundledContentReleaseId() });
const LESSON_OHMS_LAW = record.lesson;
const LOOKUP = record.lookup;

const seriesRecord = getLocalLesson({ lessonId: "lesson.electrical.resistors-series", contentRelease: bundledContentReleaseId() });
const LESSON_RESISTORS_SERIES = seriesRecord.lesson;

describe("resolveLessonStep -- diagram resolution (CC-11, the Lesson Player diagram runtime fix)", () => {
  it("resolves a step's representation.diagramBlueprintId to the real governed DiagramBlueprint, not just preserving the id", () => {
    const resolved = resolveLessonStep(LESSON_RESISTORS_SERIES, "concept_series_structure", seriesRecord.lookup);
    expect(resolved.diagram?.id).toBe("circuit.series_resistors");
    expect(resolved.diagram?.type).toBe("electrical_circuit");
  });

  it("resolves diagram to null for a step with no diagramBlueprintId reference", () => {
    const resolved = resolveLessonStep(LESSON_OHMS_LAW, "orientation", LOOKUP);
    expect(resolved.diagram).toBeNull();
  });
});

describe("resolveLessonStep (against the real Ohm's Law lesson, resolved from the generated projection)", () => {
  it("resolves orientation to the lesson's own learnerFacingDescription, never step.purpose", () => {
    const resolved = resolveLessonStep(LESSON_OHMS_LAW, "orientation", LOOKUP);
    expect(resolved.bodyStatements).toEqual([LESSON_OHMS_LAW.learnerFacingDescription]);
    expect(resolved.bodyStatements[0]).not.toBe(resolved.step.purpose);
  });

  // CC-12G: lesson.electrical.ohms-law no longer has an in-sequence
  // exit_completion step (it duplicated the Lesson Player's own
  // dedicated completion screen -- see that lesson's own header
  // comment), so this generic-resolver behaviour is proven against
  // lesson.electrical.resistors-series, which still has one.
  it("resolves exit_completion to the governed completion criteria's exitSummary", () => {
    const resolved = resolveLessonStep(LESSON_RESISTORS_SERIES, "exit_completion", seriesRecord.lookup);
    expect(resolved.bodyStatements).toEqual([LESSON_RESISTORS_SERIES.completionCriteria.exitSummary]);
  });

  it("resolves introduce_relationship to the real EL-OHM-RELATIONSHIP-001 assertion statement", () => {
    const resolved = resolveLessonStep(LESSON_OHMS_LAW, "introduce_relationship", LOOKUP);
    expect(resolved.bodyStatements).toEqual([LOOKUP.assertionStatements["EL-OHM-RELATIONSHIP-001"]]);
    expect(resolved.formulaFamily?.id).toBe("formula.ohms_law");
  });

  it("resolves formula_and_mnemonic_representation to both the formula family and the VIR-triangle visual aid", () => {
    const resolved = resolveLessonStep(LESSON_OHMS_LAW, "formula_and_mnemonic_representation", LOOKUP);
    expect(resolved.formulaFamily?.id).toBe("formula.ohms_law");
    expect(resolved.visualAid?.id).toBe("mnemonic.vir_triangle");
  });

  it("resolves worked_example_solve_voltage to its governed worked-example blueprint, which carries governed teaching values", () => {
    const resolved = resolveLessonStep(LESSON_OHMS_LAW, "worked_example_solve_voltage", LOOKUP);
    expect(resolved.workedExample?.id).toBe("worked.ohms_law.solve_voltage");
    expect(resolved.workedExample?.teachingValues).toEqual({ I: 4, R: 6 });
  });

  it("resolves misconception_check_wrong_operation to its real question blueprint", () => {
    const resolved = resolveLessonStep(LESSON_OHMS_LAW, "misconception_check_wrong_operation", LOOKUP);
    expect(resolved.questionBlueprint?.id).toBe("ohms_law.diagnose_wrong_operation");
  });

  it("carries the governed misconception descriptions for feedback resolution", () => {
    const resolved = resolveLessonStep(LESSON_OHMS_LAW, "misconception_check_wrong_operation", LOOKUP);
    expect(resolved.misconceptionDescriptions["MIS-EL-OHM-WRONG-OPERATION-001"]).toMatch(/wrong arithmetic operation/i);
  });

  // CC-12G: this lesson's own exit_completion step was removed -- it
  // duplicated the Lesson Player's separate, always-shown completion
  // screen (LessonCompletionView.tsx), producing two back-to-back,
  // near-identical "Lesson complete" screens (a Product Owner emulator
  // finding). completionCriteria.exitSummary is independently
  // schema-required and still drives that one remaining completion
  // screen -- see this lesson's own header comment.
  describe("CC-12G: no in-sequence exit_completion step; the completion message is plain learner-facing language", () => {
    it("has 15 steps, none of type exit_completion", () => {
      expect(LESSON_OHMS_LAW.steps).toHaveLength(15);
      expect(LESSON_OHMS_LAW.steps.some((s) => s.type === "exit_completion")).toBe(false);
      expect(LESSON_OHMS_LAW.completionCriteria.requiredStepIds).not.toContain("exit_completion");
      expect(LESSON_OHMS_LAW.steps.at(-1)?.id).toBe("recap");
    });

    it("the completion summary avoids internal-engine terminology, translated into plain language", () => {
      const exitSummary = LESSON_OHMS_LAW.completionCriteria.exitSummary;
      expect(exitSummary).not.toMatch(/governed misconception|cleared the remediation route|\bplausibility\b/i);
    });
  });

  it("every step resolves without throwing and has a non-empty section label", () => {
    for (const step of LESSON_OHMS_LAW.steps) {
      const resolved = resolveLessonStep(LESSON_OHMS_LAW, step.id, LOOKUP);
      expect(resolved.sectionLabel.length).toBeGreaterThan(0);
    }
  });

  it("throws for an unknown step id rather than silently returning something empty", () => {
    expect(() => resolveLessonStep(LESSON_OHMS_LAW, "no-such-step", LOOKUP)).toThrow();
  });
});

// CC-13C.2B: synthetic fixtures only -- no real Unit 202 lesson gains
// contentBlocks. `LOOKUP` (bound to the whole bundled content-release
// projection, not just lesson.electrical.ohms-law) already carries every
// governed formula/worked-example/diagram/visual-aid blueprint referenced
// anywhere in the release, so real governed ids can be referenced from a
// synthetic step/lesson object without editing scripts/content/data.
describe("resolveLessonStep -- CC-13C.2B contentBlocks resolution", () => {
  const richStep: LessonStep = {
    id: "step.rich",
    type: "concept_explanation",
    purpose: "Synthetic CC-13C.2B rich teaching step fixture.",
    requirement: "required",
    teaches: [],
    reinforces: [],
    tests: [],
    capabilityIds: [],
    misconceptionTargets: [],
    representation: {},
    learnerFacingHeading: "Voltage, current and resistance",
    contentBlocks: [
      { type: "paragraph", text: "Voltage, current and resistance are the three core electrical quantities." },
      { type: "paragraph", text: "Voltage drives current around a circuit; resistance opposes that flow." },
      { type: "visual", source: { kind: "diagram", diagramBlueprintId: "circuit.series_resistors" } },
      { type: "paragraph", text: "The relationship between them is fixed and can be expressed as a formula." },
      { type: "formula", formulaFamilyId: "formula.ohms_law" },
      { type: "worked_example", workedExampleBlueprintId: "worked.ohms_law.solve_voltage" },
      { type: "callout", variant: "key_point", text: "Doubling voltage doubles current for a fixed resistance." },
    ],
    presentation: { interactionRequired: false, answerReveal: "not_applicable", contentMayScroll: false, progressiveReveal: false },
    scaffoldingLevel: "guided",
    cognitiveDemand: "introductory",
    feedback: { mode: "immediate", explainWhy: true },
    completionCondition: "view_acknowledged",
    branchRoutes: [],
    evidenceEmitted: [],
    mayRevealTargetAnswer: false,
  };

  const checkStep: LessonStep = {
    ...richStep,
    id: "step.check",
    type: "independent_question",
    learnerFacingHeading: undefined,
    contentBlocks: undefined,
    questionBlueprintId: "ohms_law.solve_for_current",
    completionCondition: "correct_answer_required",
    mayRevealTargetAnswer: false,
  };

  const listAndVisualAidStep: LessonStep = {
    ...richStep,
    id: "step.list-and-visual-aid",
    contentBlocks: [
      { type: "list", style: "ordered", items: ["Identify voltage.", "Identify current.", "Identify resistance."] },
      { type: "visual", source: { kind: "visual_aid", visualAidBlueprintId: "mnemonic.vir_triangle" } },
    ],
  };

  const syntheticLesson: LessonPlan = { ...LESSON_OHMS_LAW, steps: [richStep, checkStep, listAndVisualAidStep] };

  it("resolves contentBlocks in EXACTLY the authored order, never sorted/regrouped by type", () => {
    const resolved = resolveLessonStep(syntheticLesson, "step.rich", LOOKUP);
    expect(resolved.contentBlocks?.map((b) => b.type)).toEqual(["paragraph", "paragraph", "visual", "paragraph", "formula", "worked_example", "callout"]);
  });

  it("does NOT resolve legacy bodyStatements when contentBlocks is present -- the two paths never both render for the same step", () => {
    const resolved = resolveLessonStep(syntheticLesson, "step.rich", LOOKUP);
    expect(resolved.bodyStatements).toEqual([]);
  });

  it("does NOT populate the legacy formula/workedExample/visualAid/diagram fields when contentBlocks is present", () => {
    const resolved = resolveLessonStep(syntheticLesson, "step.rich", LOOKUP);
    expect(resolved.formulaFamily).toBeNull();
    expect(resolved.workedExample).toBeNull();
    expect(resolved.visualAid).toBeNull();
    expect(resolved.diagram).toBeNull();
  });

  it("resolves learnerFacingHeading verbatim", () => {
    const resolved = resolveLessonStep(syntheticLesson, "step.rich", LOOKUP);
    expect(resolved.learnerFacingHeading).toBe("Voltage, current and resistance");
  });

  it("a legacy step (no learnerFacingHeading) resolves it to null, unaffected by this package", () => {
    const resolved = resolveLessonStep(LESSON_OHMS_LAW, "orientation", LOOKUP);
    expect(resolved.learnerFacingHeading).toBeNull();
  });

  it("resolves a formula content block to the real governed FormulaFamily", () => {
    const resolved = resolveLessonStep(syntheticLesson, "step.rich", LOOKUP);
    const formulaBlock = resolved.contentBlocks?.find((b) => b.type === "formula");
    expect(formulaBlock?.type).toBe("formula");
    if (formulaBlock?.type === "formula") expect(formulaBlock.formulaFamily.id).toBe("formula.ohms_law");
  });

  it("resolves a worked_example content block to the real governed WorkedExampleBlueprint AND its own formula family", () => {
    const resolved = resolveLessonStep(syntheticLesson, "step.rich", LOOKUP);
    const workedBlock = resolved.contentBlocks?.find((b) => b.type === "worked_example");
    expect(workedBlock?.type).toBe("worked_example");
    if (workedBlock?.type === "worked_example") {
      expect(workedBlock.workedExample.id).toBe("worked.ohms_law.solve_voltage");
      expect(workedBlock.formulaFamily.id).toBe("formula.ohms_law");
    }
  });

  it("resolves a diagram-source visual content block to the real governed DiagramBlueprint", () => {
    const resolved = resolveLessonStep(syntheticLesson, "step.rich", LOOKUP);
    const visualBlock = resolved.contentBlocks?.find((b) => b.type === "visual");
    expect(visualBlock?.type).toBe("visual");
    if (visualBlock?.type === "visual" && visualBlock.source.kind === "diagram") {
      expect(visualBlock.source.diagram.id).toBe("circuit.series_resistors");
    } else {
      throw new Error("expected a diagram-source visual block");
    }
  });

  it("resolves a visual_aid-source visual content block to the real governed VisualAidBlueprint AND its own formula family", () => {
    const resolved = resolveLessonStep(syntheticLesson, "step.list-and-visual-aid", LOOKUP);
    const visualBlock = resolved.contentBlocks?.find((b) => b.type === "visual");
    expect(visualBlock?.type).toBe("visual");
    if (visualBlock?.type === "visual" && visualBlock.source.kind === "visual_aid") {
      expect(visualBlock.source.visualAid.id).toBe("mnemonic.vir_triangle");
      expect(visualBlock.source.formulaFamily.id).toBe("formula.ohms_law");
    } else {
      throw new Error("expected a visual_aid-source visual block");
    }
  });

  it("resolves a list content block verbatim, preserving style and item order", () => {
    const resolved = resolveLessonStep(syntheticLesson, "step.list-and-visual-aid", LOOKUP);
    const listBlock = resolved.contentBlocks?.find((b) => b.type === "list");
    expect(listBlock).toEqual({ type: "list", style: "ordered", items: ["Identify voltage.", "Identify current.", "Identify resistance."] });
  });

  it("resolves a callout content block verbatim, including its variant", () => {
    const resolved = resolveLessonStep(syntheticLesson, "step.rich", LOOKUP);
    const calloutBlock = resolved.contentBlocks?.find((b) => b.type === "callout");
    expect(calloutBlock).toEqual({ type: "callout", variant: "key_point", text: "Doubling voltage doubles current for a fixed resistance." });
  });

  it("the separate graded/check step remains separate: it resolves questionBlueprint normally and carries no contentBlocks", () => {
    const resolved = resolveLessonStep(syntheticLesson, "step.check", LOOKUP);
    expect(resolved.contentBlocks).toBeNull();
    expect(resolved.questionBlueprint?.id).toBe("ohms_law.solve_for_current");
  });

  it("a synthetic rich step can carry substantially more resolved content than any single legacy step (proving the container, without touching scroll/player architecture)", () => {
    const resolved = resolveLessonStep(syntheticLesson, "step.rich", LOOKUP);
    expect(resolved.contentBlocks).toHaveLength(7);
  });
});
