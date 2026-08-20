import { fireEvent, render } from "@testing-library/react-native";
import type { GeneratedQuestionInstance } from "@alp/calculation-engine";

import { generateLessonQuestion } from "@/lib/lesson-content/generate-lesson-question";
import { bundledContentReleaseId, getLocalLesson } from "@/lib/lesson-content/local-content-registry";
import { resolveLessonStep } from "@/lib/lesson-content/resolve-lesson-step";
import { LessonStepView } from "./LessonStepView";

const record = getLocalLesson({ lessonId: "lesson.electrical.ohms-law", contentRelease: bundledContentReleaseId() });
const LESSON_OHMS_LAW = record.lesson;
const LOOKUP = record.lookup;

function instanceFor(blueprintId: string, stepId: string): GeneratedQuestionInstance {
  const blueprint = LOOKUP.questionBlueprints.find((b) => b.id === blueprintId);
  if (!blueprint) throw new Error(`missing governed blueprint ${blueprintId}`);
  return generateLessonQuestion({
    blueprint,
    formulaFamilies: LOOKUP.formulaFamilies,
    contentRelease: record.contentRelease,
    blueprintVersion: record.questionBlueprintVersion,
    instanceId: "li1_t",
    stepId,
  });
}

describe("LessonStepView", () => {
  it("renders a real governed assertion statement for a concept step, and a Continue affordance (non-graded step)", async () => {
    const resolved = resolveLessonStep(LESSON_OHMS_LAW, "introduce_relationship", LOOKUP);
    const onContinue = jest.fn();
    const { getByText, getByLabelText } = await render(
      <LessonStepView resolved={resolved} questionInstance={null} evaluation={null} revealCorrectAnswer={false} onSubmit={jest.fn()} onContinue={onContinue} />,
    );
    expect(getByText(LOOKUP.assertionStatements["EL-OHM-RELATIONSHIP-001"]!)).toBeTruthy();
    await fireEvent.press(getByLabelText("Continue"));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it("renders the governed question prompt lines and answer input for a graded step with no evaluation yet", async () => {
    const resolved = resolveLessonStep(LESSON_OHMS_LAW, "guided_calculation_current", LOOKUP);
    const instance = instanceFor("ohms_law.solve_for_current", "guided_calculation_current");
    const { getByText, getByLabelText } = await render(
      <LessonStepView resolved={resolved} questionInstance={instance} evaluation={null} revealCorrectAnswer={false} onSubmit={jest.fn()} onContinue={jest.fn()} />,
    );
    expect(getByText(resolved.questionBlueprint!.title)).toBeTruthy();
    // Governed presentation: "V = {V} V" rendered with the instance's own parameter.
    expect(getByText(`V = ${String(instance.parameters.V)} V`)).toBeTruthy();
    expect(getByLabelText("Your answer, in A")).toBeTruthy();
  });

  it("calls onSubmit with the given answer from the dispatched input", async () => {
    const resolved = resolveLessonStep(LESSON_OHMS_LAW, "guided_calculation_current", LOOKUP);
    const instance = instanceFor("ohms_law.solve_for_current", "guided_calculation_current");
    const onSubmit = jest.fn();
    const { getByLabelText } = await render(
      <LessonStepView resolved={resolved} questionInstance={instance} evaluation={null} revealCorrectAnswer={false} onSubmit={onSubmit} onContinue={jest.fn()} />,
    );
    await fireEvent.changeText(getByLabelText("Your answer, in A"), "4");
    await fireEvent.press(getByLabelText("Submit answer"));
    expect(onSubmit).toHaveBeenCalledWith(4);
  });

  it("renders FeedbackPanel once an evaluation is provided, and hides the answer input", async () => {
    const resolved = resolveLessonStep(LESSON_OHMS_LAW, "guided_calculation_current", LOOKUP);
    const instance = instanceFor("ohms_law.solve_for_current", "guided_calculation_current");
    const { getByLabelText, queryByLabelText } = await render(
      <LessonStepView
        resolved={resolved}
        questionInstance={instance}
        evaluation={{ correct: true, detail: "exact match" }}
        revealCorrectAnswer={true}
        onSubmit={jest.fn()}
        onContinue={jest.fn()}
      />,
    );
    expect(getByLabelText(/^Correct\./)).toBeTruthy();
    expect(queryByLabelText("Your answer, in A")).toBeNull();
  });

  it("withholds the correct answer and offers Try again when revealCorrectAnswer is false (retry pending -- CC-06D Correction G)", async () => {
    const resolved = resolveLessonStep(LESSON_OHMS_LAW, "guided_calculation_current", LOOKUP);
    const instance = instanceFor("ohms_law.solve_for_current", "guided_calculation_current");
    const { getByLabelText, queryByText } = await render(
      <LessonStepView
        resolved={resolved}
        questionInstance={instance}
        evaluation={{ correct: false, detail: "outside tolerance", evidenceStrength: "generic" }}
        revealCorrectAnswer={false}
        onSubmit={jest.fn()}
        onContinue={jest.fn()}
      />,
    );
    expect(queryByText(new RegExp(`Correct answer: ${String(instance.expected.value)}`))).toBeNull();
    expect(getByLabelText("Try again")).toBeTruthy();
  });

  it("reveals the correct answer when revealCorrectAnswer is true (step is advancing)", async () => {
    const resolved = resolveLessonStep(LESSON_OHMS_LAW, "misconception_check_wrong_operation", LOOKUP);
    const instance = instanceFor("ohms_law.diagnose_wrong_operation", "misconception_check_wrong_operation");
    const { getByText } = await render(
      <LessonStepView
        resolved={resolved}
        questionInstance={instance}
        evaluation={{ correct: false, detail: "not matched", misconceptionIdentifier: "MIS-EL-OHM-WRONG-OPERATION-001", evidenceStrength: "direct" }}
        revealCorrectAnswer={true}
        onSubmit={jest.fn()}
        onContinue={jest.fn()}
      />,
    );
    expect(getByText(new RegExp(`Correct answer: ${String(instance.expected.value)}`))).toBeTruthy();
  });

  it("shows the GOVERNED misconception description when the evaluation carries a governed misconception id", async () => {
    const resolved = resolveLessonStep(LESSON_OHMS_LAW, "misconception_check_wrong_operation", LOOKUP);
    const instance = instanceFor("ohms_law.diagnose_wrong_operation", "misconception_check_wrong_operation");
    const { getByText } = await render(
      <LessonStepView
        resolved={resolved}
        questionInstance={instance}
        evaluation={{ correct: false, detail: "not matched", misconceptionIdentifier: "MIS-EL-OHM-WRONG-OPERATION-001", evidenceStrength: "direct" }}
        revealCorrectAnswer={true}
        onSubmit={jest.fn()}
        onContinue={jest.fn()}
      />,
    );
    expect(getByText(LOOKUP.misconceptionDescriptions["MIS-EL-OHM-WRONG-OPERATION-001"]!)).toBeTruthy();
  });

  it("renders the VIR-triangle mnemonic and formula representation together for the representation step", async () => {
    const resolved = resolveLessonStep(LESSON_OHMS_LAW, "formula_and_mnemonic_representation", LOOKUP);
    const { getByLabelText } = await render(
      <LessonStepView resolved={resolved} questionInstance={null} evaluation={null} revealCorrectAnswer={false} onSubmit={jest.fn()} onContinue={jest.fn()} />,
    );
    expect(getByLabelText("V region of the VIR triangle")).toBeTruthy();
    expect(getByLabelText("V equals I times R")).toBeTruthy();
  });

  it("renders the worked example from the blueprint's own GOVERNED teaching values (no app-side value constants)", async () => {
    const resolved = resolveLessonStep(LESSON_OHMS_LAW, "worked_example_solve_voltage", LOOKUP);
    const { getByText } = await render(
      <LessonStepView resolved={resolved} questionInstance={null} evaluation={null} revealCorrectAnswer={false} onSubmit={jest.fn()} onContinue={jest.fn()} />,
    );
    // Governed teachingValues { I: 4, R: 6 } -> V = 24, rendered by the worked substitution.
    expect(getByText(/24/)).toBeTruthy();
  });
});
