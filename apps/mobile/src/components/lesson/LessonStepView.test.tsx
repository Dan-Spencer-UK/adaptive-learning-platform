import { fireEvent, render } from "@testing-library/react-native";

import { generateLessonQuestion } from "@/lib/lesson-content/generate-lesson-question";
import { LESSON_OHMS_LAW, ASSERTION_STATEMENTS, LESSON_QUESTION_BLUEPRINTS, FORMULA_OHMS_LAW, MNEMONIC_VIR_TRIANGLE, WORKED_OHMS_LAW_SOLVE_VOLTAGE } from "@/lib/lesson-content/lesson-ohms-law-content-fixture";
import { resolveLessonStep, type ContentLookup } from "@/lib/lesson-content/resolve-lesson-step";
import { LessonStepView } from "./LessonStepView";

const LOOKUP: ContentLookup = {
  questionBlueprints: LESSON_QUESTION_BLUEPRINTS,
  formulaFamilies: [FORMULA_OHMS_LAW],
  workedExampleBlueprints: [WORKED_OHMS_LAW_SOLVE_VOLTAGE],
  visualAidBlueprints: [MNEMONIC_VIR_TRIANGLE],
  assertionStatements: ASSERTION_STATEMENTS,
};

describe("LessonStepView", () => {
  it("renders a real governed assertion statement for a concept step, and a Continue affordance (non-graded step)", async () => {
    const resolved = resolveLessonStep(LESSON_OHMS_LAW, "introduce_relationship", LOOKUP);
    const onContinue = jest.fn();
    const { getByText, getByLabelText } = await render(
      <LessonStepView resolved={resolved} questionInstance={null} evaluation={null} onSubmit={jest.fn()} onContinue={onContinue} />,
    );
    expect(getByText(ASSERTION_STATEMENTS["EL-OHM-RELATIONSHIP-001"]!)).toBeTruthy();
    await fireEvent.press(getByLabelText("Continue"));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it("renders the question prompt and answer input for a graded step with no evaluation yet", async () => {
    const resolved = resolveLessonStep(LESSON_OHMS_LAW, "guided_calculation_current", LOOKUP);
    const instance = generateLessonQuestion({ blueprintId: "ohms_law.solve_for_current", instanceId: "li1_t", stepId: "guided_calculation_current" });
    const { getByText, getByLabelText } = await render(
      <LessonStepView resolved={resolved} questionInstance={instance} evaluation={null} onSubmit={jest.fn()} onContinue={jest.fn()} />,
    );
    expect(getByText(resolved.questionBlueprint!.title)).toBeTruthy();
    expect(getByLabelText("Your answer, in A")).toBeTruthy();
  });

  it("calls onSubmit with the given answer from the dispatched input", async () => {
    const resolved = resolveLessonStep(LESSON_OHMS_LAW, "guided_calculation_current", LOOKUP);
    const instance = generateLessonQuestion({ blueprintId: "ohms_law.solve_for_current", instanceId: "li1_t", stepId: "guided_calculation_current" });
    const onSubmit = jest.fn();
    const { getByLabelText } = await render(
      <LessonStepView resolved={resolved} questionInstance={instance} evaluation={null} onSubmit={onSubmit} onContinue={jest.fn()} />,
    );
    await fireEvent.changeText(getByLabelText("Your answer, in A"), "4");
    await fireEvent.press(getByLabelText("Submit answer"));
    expect(onSubmit).toHaveBeenCalledWith(4);
  });

  it("renders FeedbackPanel once an evaluation is provided, and hides the answer input", async () => {
    const resolved = resolveLessonStep(LESSON_OHMS_LAW, "guided_calculation_current", LOOKUP);
    const instance = generateLessonQuestion({ blueprintId: "ohms_law.solve_for_current", instanceId: "li1_t", stepId: "guided_calculation_current" });
    const { getByLabelText, queryByLabelText } = await render(
      <LessonStepView
        resolved={resolved}
        questionInstance={instance}
        evaluation={{ correct: true, detail: "exact match" }}
        onSubmit={jest.fn()}
        onContinue={jest.fn()}
      />,
    );
    expect(getByLabelText(/^Correct\./)).toBeTruthy();
    expect(queryByLabelText("Your answer, in A")).toBeNull();
  });

  it("shows the misconception-specific message when the evaluation carries a governed misconception id", async () => {
    const resolved = resolveLessonStep(LESSON_OHMS_LAW, "misconception_check_wrong_operation", LOOKUP);
    const instance = generateLessonQuestion({ blueprintId: "ohms_law.diagnose_wrong_operation", instanceId: "li1_t", stepId: "misconception_check_wrong_operation" });
    const { getByText } = await render(
      <LessonStepView
        resolved={resolved}
        questionInstance={instance}
        evaluation={{ correct: false, detail: "not matched", misconceptionIdentifier: "MIS-EL-OHM-WRONG-OPERATION-001", evidenceStrength: "direct" }}
        onSubmit={jest.fn()}
        onContinue={jest.fn()}
      />,
    );
    expect(getByText(/wrong operation was used/i)).toBeTruthy();
  });

  it("renders the VIR-triangle mnemonic and formula representation together for the representation step", async () => {
    const resolved = resolveLessonStep(LESSON_OHMS_LAW, "formula_and_mnemonic_representation", LOOKUP);
    const { getByLabelText } = await render(
      <LessonStepView resolved={resolved} questionInstance={null} evaluation={null} onSubmit={jest.fn()} onContinue={jest.fn()} />,
    );
    // The VIR triangle's own tappable regions confirm the mnemonic mounted; the formula equation's accessibility label confirms the real formula rendered alongside it.
    expect(getByLabelText("V region of the VIR triangle")).toBeTruthy();
    expect(getByLabelText("V equals I times R")).toBeTruthy();
  });
});
