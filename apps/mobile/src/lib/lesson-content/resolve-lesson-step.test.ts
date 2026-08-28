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
