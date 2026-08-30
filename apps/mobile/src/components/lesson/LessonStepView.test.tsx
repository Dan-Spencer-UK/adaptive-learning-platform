import { fireEvent, render } from "@testing-library/react-native";
import { evaluateAnswer, type GeneratedQuestionInstance } from "@alp/calculation-engine";
import type { LessonPlan, LessonStep } from "@alp/content-schema";

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
    expect(getByLabelText("Cover voltage V")).toBeTruthy();
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

  describe("CC-12G: readOnly (previous-step review)", () => {
    it("never renders an interactive answer input for a graded step, showing a read-only notice instead", async () => {
      const resolved = resolveLessonStep(LESSON_OHMS_LAW, "guided_calculation_current", LOOKUP);
      const instance = instanceFor("ohms_law.solve_for_current", "guided_calculation_current");
      const { getByText, queryByLabelText } = await render(
        <LessonStepView resolved={resolved} questionInstance={instance} evaluation={null} revealCorrectAnswer={false} onSubmit={jest.fn()} onContinue={jest.fn()} readOnly />,
      );
      expect(getByText(resolved.questionBlueprint!.title)).toBeTruthy();
      expect(queryByLabelText("Your answer, in A")).toBeNull();
      expect(queryByLabelText("Submit answer")).toBeNull();
      expect(getByText(/Reviewing a completed step/)).toBeTruthy();
    });

    it("never renders a Continue affordance for a non-graded step -- the Lesson Player's own header controls review navigation instead", async () => {
      const resolved = resolveLessonStep(LESSON_OHMS_LAW, "introduce_relationship", LOOKUP);
      const { queryByLabelText } = await render(
        <LessonStepView resolved={resolved} questionInstance={null} evaluation={null} revealCorrectAnswer={false} onSubmit={jest.fn()} onContinue={jest.fn()} readOnly />,
      );
      expect(queryByLabelText("Continue")).toBeNull();
    });

    it("never renders a feedback panel, even if an evaluation happens to be passed in", async () => {
      const resolved = resolveLessonStep(LESSON_OHMS_LAW, "guided_calculation_current", LOOKUP);
      const instance = instanceFor("ohms_law.solve_for_current", "guided_calculation_current");
      const evaluation = evaluateAnswer(instance, instance.expected.value as number);
      const { queryByLabelText } = await render(
        <LessonStepView resolved={resolved} questionInstance={instance} evaluation={evaluation} revealCorrectAnswer readOnly onSubmit={jest.fn()} onContinue={jest.fn()} />,
      );
      expect(queryByLabelText(/^(Correct\.|Not quite\.)/)).toBeNull();
      expect(queryByLabelText("Try again")).toBeNull();
    });
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

  // CC-12G: the x/dot into/out-of-page diagram convention was previously
  // only ever shown, never explicitly taught -- a Product Owner review
  // finding. Taught once, before the first diagram that uses it
  // (concept_field_from_current), as a real governed assertion.
  describe("CC-12G: page-direction (x/dot) notation legend", () => {
    it("teaches the x/dot convention on concept_field_from_current, before either diagram that uses it", async () => {
      const resolved = resolveLessonStep(magnetismRecord.lesson, "concept_field_from_current", magnetismRecord.lookup);
      const legend = magnetismRecord.lookup.assertionStatements["EL-CONCEPT-PAGE-DIRECTION-NOTATION-001"]!;
      expect(legend).toMatch(/×.*into the page/);
      expect(legend).toMatch(/•.*out of the page/);
      const { getByText } = await render(
        <LessonStepView resolved={resolved} questionInstance={null} evaluation={null} revealCorrectAnswer={false} onSubmit={jest.fn()} onContinue={jest.fn()} />,
      );
      expect(getByText(legend)).toBeTruthy();
    });

    it("does not re-teach it on concept_force_on_conductor -- already taught once, earlier in the lesson", async () => {
      const resolved = resolveLessonStep(magnetismRecord.lesson, "concept_force_on_conductor", magnetismRecord.lookup);
      expect(resolved.step.teaches).not.toContain("EL-CONCEPT-PAGE-DIRECTION-NOTATION-001");
    });

    it("never appears in either graded direction-interpretation step's own body text -- the symbol meaning is taught, but the assessed direction is still for the learner to infer", async () => {
      const fieldStep = resolveLessonStep(magnetismRecord.lesson, "guided_interpret_field_direction", magnetismRecord.lookup);
      const forceStep = resolveLessonStep(magnetismRecord.lesson, "guided_interpret_force_direction", magnetismRecord.lookup);
      expect(fieldStep.step.teaches).not.toContain("EL-CONCEPT-PAGE-DIRECTION-NOTATION-001");
      expect(forceStep.step.teaches).not.toContain("EL-CONCEPT-PAGE-DIRECTION-NOTATION-001");
    });
  });

  describe("CC-12B: teaching vs assessment visual binding", () => {
    it("the right-hand-grip TEACHING step resolves to the governed premium master, not the old schematic diagram", async () => {
      const resolved = resolveLessonStep(magnetismRecord.lesson, "concept_field_from_current", magnetismRecord.lookup);
      const { getByLabelText, queryByLabelText } = await render(
        <LessonStepView resolved={resolved} questionInstance={null} evaluation={null} revealCorrectAnswer={false} onSubmit={jest.fn()} onContinue={jest.fn()} />,
      );
      expect(getByLabelText(/Right-hand grip rule\. A right hand grips/)).toBeTruthy();
      // The old schematic SVG's own accessibility text must NOT also be present.
      expect(queryByLabelText(/thumb points along the conductor/)).toBeNull();
    });

    it("the motor-principle TEACHING step resolves to the governed premium master, not the old schematic diagram", async () => {
      const resolved = resolveLessonStep(magnetismRecord.lesson, "concept_force_on_conductor", magnetismRecord.lookup);
      const { getByLabelText, queryByLabelText } = await render(
        <LessonStepView resolved={resolved} questionInstance={null} evaluation={null} revealCorrectAnswer={false} onSubmit={jest.fn()} onContinue={jest.fn()} />,
      );
      expect(getByLabelText(/A current-carrying conductor between a north pole on the left/)).toBeTruthy();
      // The old schematic SVG's own accessibility text must NOT also be present.
      expect(queryByLabelText(/North pole on the left, south pole on the right\./)).toBeNull();
    });

    // CC-13: `guided_interpret_field_direction` drives a REAL randomly-generated
    // instance (current_direction: into_page | out_of_page), and both states now
    // have a registered CC-13 withheld/revealed image pair -- the SVG's own
    // reveal/withhold pattern is fully superseded for this blueprint, not merely
    // duplicated. See DiagramRenderer.tsx's CANONICAL_ASSESSMENT_VISUALS.
    it("the field-direction ASSESSMENT step (unanswered) shows the CC-13 withheld state image for whichever current_direction this instance generated, never the field-rotation answer or the fixed-default teaching master", async () => {
      const resolved = resolveLessonStep(magnetismRecord.lesson, "guided_interpret_field_direction", magnetismRecord.lookup);
      const instance = instanceFor("magnetism.interpret_field_direction", "guided_interpret_field_direction", magnetismRecord.lookup);
      const { getByLabelText, queryByLabelText } = await render(
        <LessonStepView resolved={resolved} questionInstance={instance} evaluation={null} revealCorrectAnswer={false} onSubmit={jest.fn()} onContinue={jest.fn()} />,
      );
      expect(getByLabelText(/direction it circulates is not shown/)).toBeTruthy();
      expect(queryByLabelText(/circulates (clockwise|counterclockwise)/)).toBeNull();
    });

    it("the field-direction ASSESSMENT step reveals the field-rotation answer only AFTER submission, matching whichever current_direction this instance generated", async () => {
      const resolved = resolveLessonStep(magnetismRecord.lesson, "guided_interpret_field_direction", magnetismRecord.lookup);
      const instance = instanceFor("magnetism.interpret_field_direction", "guided_interpret_field_direction", magnetismRecord.lookup);
      const { getByLabelText } = await render(
        <LessonStepView
          resolved={resolved}
          questionInstance={instance}
          evaluation={{ correct: true, detail: "direction match" }}
          revealCorrectAnswer={true}
          onSubmit={jest.fn()}
          onContinue={jest.fn()}
        />,
      );
      expect(getByLabelText(new RegExp(`circulates ${String(instance.expected.value)}`))).toBeTruthy();
    });

    // CC-13: `guided_interpret_force_direction` randomises BOTH pole_labels and
    // current_direction. N_S_horizontal states have a registered CC-13
    // withheld/revealed pair; N_S_vertical states are deliberately NOT wired
    // (a known content defect in that asset family's own audit trail -- see
    // DiagramRenderer.tsx's CANONICAL_ASSESSMENT_VISUALS header comment) and
    // must keep falling through to the verified-correct SVG. Either way, the
    // force direction must never leak before submission.
    it("the force-direction ASSESSMENT step (unanswered) withholds the force answer regardless of which pole orientation this instance generated -- never the fixed-default premium teaching master", async () => {
      const resolved = resolveLessonStep(magnetismRecord.lesson, "guided_interpret_force_direction", magnetismRecord.lookup);
      const instance = instanceFor("magnetism.interpret_force_direction", "guided_interpret_force_direction", magnetismRecord.lookup);
      const poleLabels = instance.representation.diagram?.parameters.pole_labels;
      const { getByLabelText, queryByLabelText } = await render(
        <LessonStepView resolved={resolved} questionInstance={instance} evaluation={null} revealCorrectAnswer={false} onSubmit={jest.fn()} onContinue={jest.fn()} />,
      );
      // The diagram's own accessibility label is the reliable signal for its rendered content
      // (react-native-testing-library does not match text embedded inside react-native-svg
      // Text/TSpan nodes via getByText/queryByText the way it matches plain RN <Text>).
      if (poleLabels === "N_S_horizontal") {
        expect(getByLabelText(/resulting force on the conductor is not shown/)).toBeTruthy();
      } else {
        expect(getByLabelText(/Force direction not shown\./)).toBeTruthy();
      }
      expect(queryByLabelText(/shown acting (up|down|left|right)wards?\./)).toBeNull();
    });

    it("the force-direction ASSESSMENT step reveals the force direction only AFTER submission, matching whichever pole orientation/current direction this instance generated", async () => {
      const resolved = resolveLessonStep(magnetismRecord.lesson, "guided_interpret_force_direction", magnetismRecord.lookup);
      const instance = instanceFor("magnetism.interpret_force_direction", "guided_interpret_force_direction", magnetismRecord.lookup);
      const poleLabels = instance.representation.diagram?.parameters.pole_labels;
      const { getByLabelText } = await render(
        <LessonStepView
          resolved={resolved}
          questionInstance={instance}
          evaluation={{ correct: true, detail: "direction match" }}
          revealCorrectAnswer={true}
          onSubmit={jest.fn()}
          onContinue={jest.fn()}
        />,
      );
      const expected = String(instance.expected.value);
      if (poleLabels === "N_S_horizontal") {
        expect(getByLabelText(new RegExp(`shown acting ${expected}ward`))).toBeTruthy();
      } else {
        expect(getByLabelText(new RegExp(`Resulting force on the conductor acts ${expected}wards\\.`))).toBeTruthy();
      }
    });
  });

  // CC-12C: Product Owner emulator finding -- a force-calculation question
  // appeared to show inconsistent values for `l` between the displayed
  // givens and "the working/evaluation". Root cause turned out to be
  // representational (uppercase "I" and lowercase "l" render as visually
  // identical vertical strokes in this UI font, not a real value mismatch
  // -- see the promptLines clarity fix in cc05a-pedagogy-unit202.ts), but
  // this proves the underlying numeric path is, and stays, genuinely
  // single-sourced at the real lesson-resolution layer -- not merely
  // inside the calculation-engine's own generation helpers (already
  // covered by magnetism.test.ts) in isolation.
  describe("CC-12C: calculation integrity -- displayed givens, formula, and evaluation all derive from the SAME generated instance", () => {
    it("the rendered B/I/L givens for magnetism.calculate_force_on_conductor are exactly the instance's own parameters, and the expected answer is derivable from those same displayed numbers", async () => {
      const resolved = resolveLessonStep(magnetismRecord.lesson, "guided_calculate_force_on_conductor", magnetismRecord.lookup);
      const instance = instanceFor("magnetism.calculate_force_on_conductor", "guided_calculate_force_on_conductor", magnetismRecord.lookup);
      const { getByText } = await render(
        <LessonStepView resolved={resolved} questionInstance={instance} evaluation={null} revealCorrectAnswer={false} onSubmit={jest.fn()} onContinue={jest.fn()} />,
      );
      const { B, I, L } = instance.parameters as { B: number; I: number; L: number };
      // The rendered prompt lines must show the SAME numbers the instance carries -- no
      // separately-derived or hardcoded duplicate value set -- and the "(current)"/"(conductor
      // length)" clarity annotations plus the CC-12G I-vs-L notation fix (governed symbol
      // renamed from lowercase "l" to plain capital "L") that together disambiguate the
      // previously visually-identical "I"/"l" glyphs.
      expect(getByText(`B = ${B} T`)).toBeTruthy();
      expect(getByText(`I = ${I} A (current)`)).toBeTruthy();
      expect(getByText(`L = ${L} m (conductor length)`)).toBeTruthy();
      // What marking grades against (instance.expected.value) must be reproducible from those
      // SAME displayed B/I/L -- proving display and evaluation share one generated instance.
      expect(Number(instance.expected.value)).toBeCloseTo(B * I * L, 6);
    });

    it("submitting the value computed from the displayed givens is marked correct via the real evaluation path, for several independently-generated instances", async () => {
      for (const seedStepId of ["li1_t", "li2_t", "li3_t", "li4_t", "li5_t"]) {
        const instance = instanceFor("magnetism.calculate_force_on_conductor", seedStepId, magnetismRecord.lookup);
        const { B, I, L } = instance.parameters as { B: number; I: number; L: number };
        const givenFromDisplayedValues = B * I * L;
        const evaluation = evaluateAnswer(instance, givenFromDisplayedValues);
        expect(evaluation.correct).toBe(true);
      }
    });
  });
});

// CC-13C.2B: synthetic fixture only -- no real Unit 202 lesson gains
// contentBlocks. Real governed ids are referenced from a synthetic step
// object (LOOKUP already carries every blueprint the whole bundled release
// references, per resolve-lesson-step.test.ts's own header comment).
describe("LessonStepView -- CC-13C.2B rich teaching content blocks", () => {
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
      { type: "list", style: "unordered", items: ["Identify voltage.", "Identify current.", "Identify resistance."] },
      { type: "formula", formulaFamilyId: "formula.ohms_law" },
      { type: "worked_example", workedExampleBlueprintId: "worked.ohms_law.solve_voltage" },
      { type: "callout", variant: "caution", text: "Do not confuse resistance with resistivity." },
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
  const syntheticLesson: LessonPlan = { ...LESSON_OHMS_LAW, steps: [richStep] };

  it("renders the learnerFacingHeading with heading accessibility semantics", async () => {
    const resolved = resolveLessonStep(syntheticLesson, "step.rich", LOOKUP);
    const { getByRole } = await render(
      <LessonStepView resolved={resolved} questionInstance={null} evaluation={null} revealCorrectAnswer={false} onSubmit={jest.fn()} onContinue={jest.fn()} />,
    );
    expect(getByRole("header", { name: "Voltage, current and resistance" })).toBeTruthy();
  });

  it("renders every paragraph block's text", async () => {
    const resolved = resolveLessonStep(syntheticLesson, "step.rich", LOOKUP);
    const { getByText } = await render(
      <LessonStepView resolved={resolved} questionInstance={null} evaluation={null} revealCorrectAnswer={false} onSubmit={jest.fn()} onContinue={jest.fn()} />,
    );
    expect(getByText("Voltage, current and resistance are the three core electrical quantities.")).toBeTruthy();
    expect(getByText("Voltage drives current around a circuit; resistance opposes that flow.")).toBeTruthy();
  });

  it("renders the list block's items with list accessibility semantics", async () => {
    const resolved = resolveLessonStep(syntheticLesson, "step.rich", LOOKUP);
    const { getByText, getByTestId } = await render(
      <LessonStepView resolved={resolved} questionInstance={null} evaluation={null} revealCorrectAnswer={false} onSubmit={jest.fn()} onContinue={jest.fn()} />,
    );
    expect(getByTestId("content-block-list").props.accessibilityRole).toBe("list");
    expect(getByText("Identify voltage.")).toBeTruthy();
    expect(getByText("Identify current.")).toBeTruthy();
    expect(getByText("Identify resistance.")).toBeTruthy();
  });

  it("renders the callout block with its variant communicated in the accessible label, not colour alone", async () => {
    const resolved = resolveLessonStep(syntheticLesson, "step.rich", LOOKUP);
    const { getByLabelText } = await render(
      <LessonStepView resolved={resolved} questionInstance={null} evaluation={null} revealCorrectAnswer={false} onSubmit={jest.fn()} onContinue={jest.fn()} />,
    );
    expect(getByLabelText(/^Caution: Do not confuse resistance with resistivity\.$/)).toBeTruthy();
  });

  it("renders the formula block's forms via the real FormulaEquation component", async () => {
    const resolved = resolveLessonStep(syntheticLesson, "step.rich", LOOKUP);
    const { getAllByLabelText } = await render(
      <LessonStepView resolved={resolved} questionInstance={null} evaluation={null} revealCorrectAnswer={false} onSubmit={jest.fn()} onContinue={jest.fn()} />,
    );
    // "V equals I times R" legitimately appears twice: once as the standalone
    // formula block's own raw-form display, and again as the FIRST row of the
    // separate worked_example block's substitution (its own governed formula
    // display before substituting values) -- both are real, distinct governed
    // content blocks, not a rendering bug.
    expect(getAllByLabelText("V equals I times R").length).toBeGreaterThanOrEqual(1);
    expect(getAllByLabelText("I equals V divided by R")).toHaveLength(1);
    expect(getAllByLabelText("R equals V divided by I")).toHaveLength(1);
  });

  it("renders the worked_example block's substitution from the blueprint's own governed teaching values", async () => {
    const resolved = resolveLessonStep(syntheticLesson, "step.rich", LOOKUP);
    const { getByText } = await render(
      <LessonStepView resolved={resolved} questionInstance={null} evaluation={null} revealCorrectAnswer={false} onSubmit={jest.fn()} onContinue={jest.fn()} />,
    );
    // Governed teachingValues { I: 4, R: 6 } -> V = 24 (same worked example blueprint as the legacy-representation test above).
    expect(getByText(/24/)).toBeTruthy();
  });

  it("renders the diagram-source visual block via the real DiagramRenderer", async () => {
    const resolved = resolveLessonStep(syntheticLesson, "step.rich", LOOKUP);
    const { getByLabelText } = await render(
      <LessonStepView resolved={resolved} questionInstance={null} evaluation={null} revealCorrectAnswer={false} onSubmit={jest.fn()} onContinue={jest.fn()} />,
    );
    expect(getByLabelText(/Series circuit diagram with/)).toBeTruthy();
  });

  it("does NOT render any legacy body-statement text for a step with contentBlocks (no double-rendering)", async () => {
    const resolved = resolveLessonStep(syntheticLesson, "step.rich", LOOKUP);
    const { queryByText } = await render(
      <LessonStepView resolved={resolved} questionInstance={null} evaluation={null} revealCorrectAnswer={false} onSubmit={jest.fn()} onContinue={jest.fn()} />,
    );
    // A real assertion statement this fixture never references -- proves resolveBodyStatements() was never consulted.
    expect(queryByText(LOOKUP.assertionStatements["EL-OHM-RELATIONSHIP-001"]!)).toBeNull();
  });

  it("legacy step (no learnerFacingHeading, no contentBlocks) renders exactly as before -- no heading, only sectionLabel and legacy body copy", async () => {
    const resolved = resolveLessonStep(LESSON_OHMS_LAW, "introduce_relationship", LOOKUP);
    const { queryByRole, getByText } = await render(
      <LessonStepView resolved={resolved} questionInstance={null} evaluation={null} revealCorrectAnswer={false} onSubmit={jest.fn()} onContinue={jest.fn()} />,
    );
    expect(queryByRole("header", { name: /Voltage, current and resistance/ })).toBeNull();
    expect(getByText(LOOKUP.assertionStatements["EL-OHM-RELATIONSHIP-001"]!)).toBeTruthy();
  });
});
