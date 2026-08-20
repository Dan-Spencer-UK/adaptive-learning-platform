import { bundledContentReleaseId, getLocalLesson } from "./local-content-registry";
import { resolveLessonStep } from "./resolve-lesson-step";

const record = getLocalLesson({ lessonId: "lesson.electrical.ohms-law", contentRelease: bundledContentReleaseId() });
const LESSON_OHMS_LAW = record.lesson;
const LOOKUP = record.lookup;

describe("resolveLessonStep (against the real Ohm's Law lesson, resolved from the generated projection)", () => {
  it("resolves orientation to the lesson's own learnerFacingDescription, never step.purpose", () => {
    const resolved = resolveLessonStep(LESSON_OHMS_LAW, "orientation", LOOKUP);
    expect(resolved.bodyStatements).toEqual([LESSON_OHMS_LAW.learnerFacingDescription]);
    expect(resolved.bodyStatements[0]).not.toBe(resolved.step.purpose);
  });

  it("resolves exit_completion to the governed completion criteria's exitSummary", () => {
    const resolved = resolveLessonStep(LESSON_OHMS_LAW, "exit_completion", LOOKUP);
    expect(resolved.bodyStatements).toEqual([LESSON_OHMS_LAW.completionCriteria.exitSummary]);
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
