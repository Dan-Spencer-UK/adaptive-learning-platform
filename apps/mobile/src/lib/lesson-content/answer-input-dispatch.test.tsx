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

function instanceFor(id: string, instanceId = "li1_t"): GeneratedQuestionInstance {
  return generateLessonQuestion({
    blueprint: blueprintFor(id),
    formulaFamilies: record.lookup.formulaFamilies,
    contentRelease: record.contentRelease,
    blueprintVersion: record.questionBlueprintVersion,
    instanceId,
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

/** The rendered choice buttons' accessibility labels, in render order -- used to observe display ORDER. */
function choiceLabels(screen: { getAllByRole: (role: string) => readonly { props: { accessibilityLabel?: string } }[] }): string[] {
  return screen.getAllByRole("button").map((el) => el.props.accessibilityLabel ?? "");
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

  // CC-12G: options are the actual rearranged equations, not bare
  // variable names -- a Product Owner finding that "V (voltage)" never
  // actually told the learner which equation to use (task brief §4).
  it("renders the rearranged equation for each variable for a 'formula_selection' answer type, keyed on the variable symbol", async () => {
    const onSubmit = jest.fn();
    const blueprint = blueprintFor("ohms_law.select_rearrangement");
    const { getByLabelText, queryByLabelText } = await render(
      <AnswerInputDispatch blueprint={blueprint} instance={instanceFor(blueprint.id)} formulaFamily={FORMULA_OHMS_LAW} onSubmit={onSubmit} />,
    );
    expect(queryByLabelText("V (voltage)")).toBeNull();
    await fireEvent.press(getByLabelText("V = I × R"));
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
    // CC-12G: row order is now deterministically shuffled per instance
    // (task brief §2), so only the submitted VALUE SET (never row
    // position) is asserted -- marking is set_equality, order-independent.
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect([...(onSubmit.mock.calls[0]![0] as readonly string[])].sort()).toEqual(["I:A", "R:Ω", "V:V"]);
  });

  // CC-12G: row and choice order must vary between independently
  // generated instances but stay stable for the SAME instance (task
  // brief §3 A/B), and correctness (§9's value-keyed submission, proven
  // above) is unaffected by whichever order actually rendered.
  // Each render lives in its own `it()` block, relying on RNTL's own
  // automatic between-test cleanup, rather than rendering more than once
  // inside a single test -- found to leave later renders in this file
  // unable to find anything at all (a real RNTL hazard, distinct from
  // and in addition to the "never fire a synthetic layout event" one
  // documented elsewhere in this repo). Results are compared via
  // module-scoped variables, since Jest runs `it()`s within one
  // `describe` sequentially by default.
  describe("CC-12G: 'multi_select' (SI-unit matching) row/choice order is deterministically shuffled per instance", () => {
    const blueprint = blueprintFor("ohms_law.match_variables_units");
    let stableA: string[] = [];
    let stableB: string[] = [];
    let varietyA: string[] = [];
    let varietyB: string[] = [];

    it("A1: renders one instance once", async () => {
      const rendered = await render(
        <AnswerInputDispatch blueprint={blueprint} instance={instanceFor(blueprint.id, "review_stability_check")} formulaFamily={FORMULA_OHMS_LAW} onSubmit={jest.fn()} />,
      );
      stableA = choiceLabels(rendered);
      expect(stableA.length).toBeGreaterThan(0);
    });

    it("A2 (stability): rendering the SAME instance again reproduces the exact same order", async () => {
      const rendered = await render(
        <AnswerInputDispatch blueprint={blueprint} instance={instanceFor(blueprint.id, "review_stability_check")} formulaFamily={FORMULA_OHMS_LAW} onSubmit={jest.fn()} />,
      );
      stableB = choiceLabels(rendered);
      expect(stableB).toEqual(stableA);
    });

    it("B1: renders a first independently generated instance", async () => {
      const rendered = await render(
        <AnswerInputDispatch blueprint={blueprint} instance={instanceFor(blueprint.id, "variety_0")} formulaFamily={FORMULA_OHMS_LAW} onSubmit={jest.fn()} />,
      );
      varietyA = choiceLabels(rendered);
      expect(varietyA.length).toBeGreaterThan(0);
    });

    it("B2 (variability): a second, differently generated instance observes a different order", async () => {
      const rendered = await render(
        <AnswerInputDispatch blueprint={blueprint} instance={instanceFor(blueprint.id, "variety_1")} formulaFamily={FORMULA_OHMS_LAW} onSubmit={jest.fn()} />,
      );
      varietyB = choiceLabels(rendered);
      expect(varietyB).not.toEqual(varietyA);
    });
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
