import { fireEvent, render } from "@testing-library/react-native";
import type { GeneratedQuestionInstance } from "@alp/calculation-engine";

import { generateLessonQuestion } from "@/lib/lesson-content/generate-lesson-question";
import { bundledContentReleaseId, getLocalLesson } from "@/lib/lesson-content/local-content-registry";
import { resolveLessonStep } from "@/lib/lesson-content/resolve-lesson-step";
import { LessonStepView } from "./LessonStepView";

const record = getLocalLesson({ lessonId: "lesson.electrical.ohms-law", contentRelease: bundledContentReleaseId() });
const LESSON_OHMS_LAW = record.lesson;
const LOOKUP = record.lookup;

const seriesRecord = getLocalLesson({ lessonId: "lesson.electrical.resistors-series", contentRelease: bundledContentReleaseId() });
const magnetismRecord = getLocalLesson({ lessonId: "lesson.magnetism.effects-of-current", contentRelease: bundledContentReleaseId() });

function instanceFor(blueprintId: string, stepId: string, lookup: typeof LOOKUP = LOOKUP): GeneratedQuestionInstance {
  const blueprint = lookup.questionBlueprints.find((b) => b.id === blueprintId);
  if (!blueprint) throw new Error(`missing governed blueprint ${blueprintId}`);
  return generateLessonQuestion({
    blueprint,
    formulaFamilies: lookup.formulaFamilies,
    // CC-12 fix: previously omitted here too -- see
    // generate-lesson-question.ts's own header comment. Several real
    // magnetism blueprints require a diagram blueprint to be present in
    // the generation context (requireDiagramBlueprint) even though the
    // rendered diagram itself is resolved separately by resolveLessonStep.
    diagramBlueprints: lookup.diagramBlueprints,
    workedExampleBlueprints: lookup.workedExampleBlueprints,
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

  it("CC-11: renders the referenced governed diagram for a pure teaching step (no generated question instance driving it)", async () => {
    const resolved = resolveLessonStep(seriesRecord.lesson, "concept_series_structure", seriesRecord.lookup);
    const { getByLabelText } = await render(
      <LessonStepView resolved={resolved} questionInstance={null} evaluation={null} revealCorrectAnswer={false} onSubmit={jest.fn()} onContinue={jest.fn()} />,
    );
    expect(getByLabelText(/Series circuit diagram with/)).toBeTruthy();
  });

  it("renders the worked example from the blueprint's own GOVERNED teaching values (no app-side value constants)", async () => {
    const resolved = resolveLessonStep(LESSON_OHMS_LAW, "worked_example_solve_voltage", LOOKUP);
    const { getByText } = await render(
      <LessonStepView resolved={resolved} questionInstance={null} evaluation={null} revealCorrectAnswer={false} onSubmit={jest.fn()} onContinue={jest.fn()} />,
    );
    // Governed teachingValues { I: 4, R: 6 } -> V = 24, rendered by the worked substitution.
    expect(getByText(/24/)).toBeTruthy();
  });

  describe("CC-12: layered (Quick/Explain/Deeper) feedback", () => {
    it("renders the plain FeedbackPanel (no Explain toggle) for a step with progressiveReveal: false, unchanged from before CC-12", async () => {
      const resolved = resolveLessonStep(LESSON_OHMS_LAW, "guided_calculation_current", LOOKUP);
      const instance = instanceFor("ohms_law.solve_for_current", "guided_calculation_current");
      const { queryByLabelText } = await render(
        <LessonStepView
          resolved={resolved}
          questionInstance={instance}
          evaluation={{ correct: true, detail: "exact match" }}
          revealCorrectAnswer={true}
          onSubmit={jest.fn()}
          onContinue={jest.fn()}
        />,
      );
      expect(queryByLabelText("Explain why")).toBeNull();
    });

    it("renders LayeredFeedbackPanel with a real governed Explain layer for the real magnetism force-direction step (progressiveReveal: true)", async () => {
      const resolved = resolveLessonStep(magnetismRecord.lesson, "guided_interpret_force_direction", magnetismRecord.lookup);
      const instance = instanceFor("magnetism.interpret_force_direction", "guided_interpret_force_direction", magnetismRecord.lookup);
      const { getByLabelText, getAllByText } = await render(
        <LessonStepView
          resolved={resolved}
          questionInstance={instance}
          evaluation={{ correct: true, detail: "matches" }}
          revealCorrectAnswer={true}
          onSubmit={jest.fn()}
          onContinue={jest.fn()}
        />,
      );
      await fireEvent.press(getByLabelText("Explain why"));
      // The same governed statement legitimately appears twice: once as the
      // step's own lead-in body text (rendered unconditionally, above the
      // question), and again inside the opened Explain layer -- a
      // deliberate reinforcement at the point of feedback, not a bug.
      expect(getAllByText(magnetismRecord.lookup.assertionStatements["EL-CONCEPT-FORCE-ON-CONDUCTOR-001"]!)).toHaveLength(2);
    });

    it("reveals the Fleming finger-assignment deeperNote, framed as a related mix-up rather than a confirmed diagnosis, once the current-convention diagnostic is answered correctly", async () => {
      const resolved = resolveLessonStep(magnetismRecord.lesson, "diagnose_force_direction_error", magnetismRecord.lookup);
      const instance = instanceFor("magnetism.diagnose_current_convention", "diagnose_force_direction_error", magnetismRecord.lookup);
      const { getByLabelText, getByText } = await render(
        <LessonStepView
          resolved={resolved}
          questionInstance={instance}
          evaluation={{ correct: true, detail: "correct -- conventional current confirmed" }}
          revealCorrectAnswer={true}
          onSubmit={jest.fn()}
          onContinue={jest.fn()}
        />,
      );
      await fireEvent.press(getByLabelText("Show my weakness"));
      expect(getByText(/A common related mix-up:/)).toBeTruthy();
      expect(getByText(new RegExp(magnetismRecord.lookup.misconceptionDescriptions["MIS-EL-FLEMING-FINGER-ASSIGNMENT-CONFUSION-001"]!.slice(0, 20)))).toBeTruthy();
    });

    it("does NOT show the Fleming finger-assignment deeperNote when the current-convention diagnostic is answered incorrectly (that IS the confirmed cause instead)", async () => {
      const resolved = resolveLessonStep(magnetismRecord.lesson, "diagnose_force_direction_error", magnetismRecord.lookup);
      const instance = instanceFor("magnetism.diagnose_current_convention", "diagnose_force_direction_error", magnetismRecord.lookup);
      const { getByLabelText, getByText, queryByText } = await render(
        <LessonStepView
          resolved={resolved}
          questionInstance={instance}
          evaluation={{ correct: false, detail: "not matched", misconceptionIdentifier: "MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001", evidenceStrength: "direct" }}
          revealCorrectAnswer={true}
          onSubmit={jest.fn()}
          onContinue={jest.fn()}
        />,
      );
      // The Deeper toggle exists (a real, confirmed misconceptionMessage IS present) and shows
      // it -- but never the unrelated finger-assignment deeperNote too (that hypothesis was
      // ruled out, not merely unconfirmed, by this specific wrong answer).
      await fireEvent.press(getByLabelText("Show my weakness"));
      expect(getByText(magnetismRecord.lookup.misconceptionDescriptions["MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001"]!)).toBeTruthy();
      expect(queryByText(/A common related mix-up:/)).toBeNull();
    });
  });
});
