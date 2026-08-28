import { fireEvent, render } from "@testing-library/react-native";
import type { GeneratedQuestionInstance } from "@alp/calculation-engine";

import { bundledContentReleaseId, getLocalLesson } from "./local-content-registry";

const record = getLocalLesson({ lessonId: "lesson.electrical.ohms-law", contentRelease: bundledContentReleaseId() });
const FORMULA_OHMS_LAW = record.lookup.formulaFamilies.find((f) => f.id === "formula.ohms_law")!;
const magnetismRecord = getLocalLesson({ lessonId: "lesson.magnetism.effects-of-current", contentRelease: bundledContentReleaseId() });
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

function magnetismBlueprintFor(id: string) {
  const blueprint = magnetismRecord.lookup.questionBlueprints.find((b) => b.id === id);
  if (!blueprint) throw new Error(`missing governed blueprint ${id}`);
  return blueprint;
}

function magnetismInstanceFor(id: string): GeneratedQuestionInstance {
  return generateLessonQuestion({
    blueprint: magnetismBlueprintFor(id),
    formulaFamilies: magnetismRecord.lookup.formulaFamilies,
    diagramBlueprints: magnetismRecord.lookup.diagramBlueprints,
    workedExampleBlueprints: magnetismRecord.lookup.workedExampleBlueprints,
    contentRelease: magnetismRecord.contentRelease,
    blueprintVersion: magnetismRecord.questionBlueprintVersion,
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
    // CC-12F: label text now describes this blueprint's own shown working
    // specifically ("Multiplied V and R instead of dividing V by R"), not
    // a generic shared label -- see cc05a-pedagogy-unit202.ts's own
    // comment for why (a Product Owner-found diagnostic-ambiguity defect).
    await fireEvent.press(getByLabelText("Multiplied V and R instead of dividing V by R"));
    expect(onSubmit).toHaveBeenCalledWith("wrong_operation");
  });

  // CC-12A: real-emulator acceptance found this blueprint permanently
  // unanswerable -- its answer domain is clockwise/counterclockwise (see
  // @alp/calculation-engine's interpretFieldDirection executor), but this
  // dispatch's generic "direction" case rendered DirectionAnswerInput
  // (up/down/left/right), a disjoint value domain, so every submission
  // failed marking regardless of which button the learner pressed.
  it("renders a rotation input (not the up/down/left/right one) for magnetism.interpret_field_direction, whose answer domain is clockwise/counterclockwise", async () => {
    const onSubmit = jest.fn();
    const blueprint = magnetismBlueprintFor("magnetism.interpret_field_direction");
    const { getByLabelText, queryByLabelText } = await render(
      <AnswerInputDispatch blueprint={blueprint} instance={magnetismInstanceFor(blueprint.id)} formulaFamily={null} onSubmit={onSubmit} />,
    );
    expect(queryByLabelText("Force acts Up")).toBeNull();
    await fireEvent.press(getByLabelText("Field direction: Clockwise"));
    expect(onSubmit).toHaveBeenCalledWith("clockwise");
  });

  it("still renders the up/down/left/right input for magnetism.interpret_force_direction", async () => {
    const onSubmit = jest.fn();
    const blueprint = magnetismBlueprintFor("magnetism.interpret_force_direction");
    const { getByLabelText } = await render(
      <AnswerInputDispatch blueprint={blueprint} instance={magnetismInstanceFor(blueprint.id)} formulaFamily={null} onSubmit={onSubmit} />,
    );
    await fireEvent.press(getByLabelText("Force acts Up"));
    expect(onSubmit).toHaveBeenCalledWith("up");
  });
});
