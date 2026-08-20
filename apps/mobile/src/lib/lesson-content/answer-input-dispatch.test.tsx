import { fireEvent, render } from "@testing-library/react-native";
import type { GeneratedQuestionInstance } from "@alp/calculation-engine";

import { bundledContentReleaseId, getLocalLesson } from "./local-content-registry";

const record = getLocalLesson({ lessonId: "lesson.electrical.ohms-law", contentRelease: bundledContentReleaseId() });
const FORMULA_OHMS_LAW = record.lookup.formulaFamilies.find((f) => f.id === "formula.ohms_law")!;
import { generateLessonQuestion } from "./generate-lesson-question";
import { AnswerInputDispatch } from "./answer-input-dispatch";

function blueprintFor(id: string) {
  const blueprint = record.lookup.questionBlueprints.find((b) => b.id === id);
  if (!blueprint) throw new Error(`missing governed blueprint ${id}`);
  return blueprint;
}

function instanceFor(id: string): GeneratedQuestionInstance {
  return generateLessonQuestion({
    blueprint: blueprintFor(id),
    formulaFamilies: record.lookup.formulaFamilies,
    contentRelease: record.contentRelease,
    blueprintVersion: record.questionBlueprintVersion,
    instanceId: "li1_t",
    stepId: id,
  });
}

describe("AnswerInputDispatch", () => {
  it("renders a numeric input for a 'quantity' answer type and submits a number", async () => {
    const onSubmit = jest.fn();
    const blueprint = blueprintFor("ohms_law.solve_for_voltage");
    const { getByLabelText } = await render(
      <AnswerInputDispatch blueprint={blueprint} instance={instanceFor(blueprint.id)} formulaFamily={FORMULA_OHMS_LAW} onSubmit={onSubmit} />,
    );
    await fireEvent.changeText(getByLabelText("Your answer, in V"), "12");
    await fireEvent.press(getByLabelText("Submit answer"));
    expect(onSubmit).toHaveBeenCalledWith(12);
  });

  it("renders multiple-choice options for a 'multiple_choice' answer type", async () => {
    const onSubmit = jest.fn();
    const blueprint = blueprintFor("ohms_law.plausibility_check");
    const { getByLabelText } = await render(
      <AnswerInputDispatch blueprint={blueprint} instance={instanceFor(blueprint.id)} formulaFamily={FORMULA_OHMS_LAW} onSubmit={onSubmit} />,
    );
    await fireEvent.press(getByLabelText("Plausible"));
    expect(onSubmit).toHaveBeenCalledWith("plausible");
  });

  it("renders V/I/R choices derived from the formula family for a 'formula_selection' answer type", async () => {
    const onSubmit = jest.fn();
    const blueprint = blueprintFor("ohms_law.select_rearrangement");
    const { getByLabelText } = await render(
      <AnswerInputDispatch blueprint={blueprint} instance={instanceFor(blueprint.id)} formulaFamily={FORMULA_OHMS_LAW} onSubmit={onSubmit} />,
    );
    await fireEvent.press(getByLabelText("V (voltage)"));
    expect(onSubmit).toHaveBeenCalledWith("V");
  });

  it("renders a match row per formula-family variable for a 'multi_select' answer type", async () => {
    const onSubmit = jest.fn();
    const blueprint = blueprintFor("ohms_law.match_variables_units");
    const { getByLabelText } = await render(
      <AnswerInputDispatch blueprint={blueprint} instance={instanceFor(blueprint.id)} formulaFamily={FORMULA_OHMS_LAW} onSubmit={onSubmit} />,
    );
    await fireEvent.press(getByLabelText("V (voltage): V"));
    await fireEvent.press(getByLabelText("I (current): A"));
    await fireEvent.press(getByLabelText("R (resistance): Ω"));
    await fireEvent.press(getByLabelText("Submit answer"));
    expect(onSubmit).toHaveBeenCalledWith(["V:V", "I:A", "R:Ω"]);
  });

  it("renders shown-working classification choices for a 'worked_error_classification' answer type", async () => {
    const onSubmit = jest.fn();
    const blueprint = blueprintFor("ohms_law.diagnose_wrong_operation");
    const { getByLabelText } = await render(
      <AnswerInputDispatch blueprint={blueprint} instance={instanceFor(blueprint.id)} formulaFamily={FORMULA_OHMS_LAW} onSubmit={onSubmit} />,
    );
    await fireEvent.press(getByLabelText("Used the wrong operation (multiplied instead of divided, or vice versa)"));
    expect(onSubmit).toHaveBeenCalledWith("wrong_operation");
  });
});
