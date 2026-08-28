import { evaluateAnswer, resolvePromptLines, resolveShownWorkingLines } from "@alp/calculation-engine";
import { deriveStepSeed, generateLessonQuestion } from "./generate-lesson-question";
import { bundledContentReleaseId, getLocalLesson, getQuestionBlueprintFrom } from "./local-content-registry";
import { MOBILE_CONTENT_PROJECTION } from "./generated/mobile-content-projection";

const record = getLocalLesson({ lessonId: "lesson.electrical.ohms-law", contentRelease: bundledContentReleaseId() });

function generate(blueprintId: string, instanceId: string, stepId: string) {
  return generateLessonQuestion({
    blueprint: getQuestionBlueprintFrom(MOBILE_CONTENT_PROJECTION, blueprintId),
    formulaFamilies: record.lookup.formulaFamilies,
    contentRelease: record.contentRelease,
    blueprintVersion: record.questionBlueprintVersion,
    instanceId,
    stepId,
  });
}

describe("deriveStepSeed", () => {
  it("is deterministic for the same (instanceId, stepId) pair", () => {
    expect(deriveStepSeed("li1_a", "step.1")).toBe(deriveStepSeed("li1_a", "step.1"));
  });

  it("differs across steps and across instances", () => {
    expect(deriveStepSeed("li1_a", "step.1")).not.toBe(deriveStepSeed("li1_a", "step.2"));
    expect(deriveStepSeed("li1_a", "step.1")).not.toBe(deriveStepSeed("li1_b", "step.1"));
  });
});

describe("generateLessonQuestion (generic -- content resolved from the local release, no lesson fixture binding)", () => {
  it("generates a real, gradeable instance for a governed Ohm's Law blueprint", () => {
    const instance = generate("ohms_law.solve_for_voltage", "li1_a", "worked_example_solve_voltage");
    expect(instance.identity.blueprintId).toBe("ohms_law.solve_for_voltage");
    expect(instance.identity.contentRelease).toBe(record.contentRelease);
    expect(typeof instance.expected.value).toBe("number");
    const correct = evaluateAnswer(instance, instance.expected.value);
    expect(correct.correct).toBe(true);
  });

  it("is deterministic: regenerating for the same instance/step produces a byte-identical instance", () => {
    const a = generate("ohms_law.plausibility_check", "li1_a", "plausibility_check_transfer");
    const b = generate("ohms_law.plausibility_check", "li1_a", "plausibility_check_transfer");
    expect(a).toEqual(b);
  });

  it("throws for a blueprint id outside the local release's governed set", () => {
    expect(() => getQuestionBlueprintFrom(MOBILE_CONTENT_PROJECTION, "not.a.real.blueprint")).toThrow(/not.a.real.blueprint/);
  });

  it("generates a working instance for every one of the 8 real question blueprints this lesson references", () => {
    const blueprintIds = [
      "ohms_law.solve_for_voltage",
      "ohms_law.solve_for_current",
      "ohms_law.solve_for_resistance",
      "ohms_law.select_rearrangement",
      "ohms_law.match_variables_units",
      "ohms_law.diagnose_rearrangement_error",
      "ohms_law.diagnose_wrong_operation",
      "ohms_law.plausibility_check",
    ];
    for (const blueprintId of blueprintIds) {
      const instance = generate(blueprintId, "li1_a", blueprintId);
      const evaluation = evaluateAnswer(instance, instance.expected.value);
      expect(evaluation.correct).toBe(true);
    }
  });
});

// CC-12F: a Product Owner emulator finding -- the unanswered "match each
// Ohm's-law variable to its correct SI unit" formative check (ARCH-003
// §17.2 -- an evidence-bearing formative check, answer must be withheld
// before response) displayed exactly the mapping it was measuring
// ("V = 301 V", "I = 7 A", "R = 43 Ω") before the learner had answered.
// Fixed by removing the leaking promptLines entirely. This test proves
// it against the REAL governed blueprint/content, not a synthetic
// fixture, so a future content edit that reintroduces a unit-bearing
// promptLine here fails loudly.
describe("CC-12F: ohms_law.match_variables_units withholds the unit mapping it measures", () => {
  it("resolved prompt lines never contain a unit symbol/name for any of several independently-generated instances", () => {
    const blueprint = getQuestionBlueprintFrom(MOBILE_CONTENT_PROJECTION, "ohms_law.match_variables_units");
    for (const instanceId of ["li1_a", "li1_b", "li1_c", "li1_d", "li1_e"]) {
      const instance = generate("ohms_law.match_variables_units", instanceId, "interpret_variables_and_units");
      const promptLines = resolvePromptLines(blueprint, instance);
      const joined = promptLines.join(" ");
      // Neither the unit symbols (V/A/Ω) nor their names (volt/ampere/ohm)
      // may appear, and no numeric V/I/R value may appear either -- the
      // single governed prompt line restates the task only.
      expect(promptLines).toEqual(["Match each quantity to its correct SI unit."]);
      expect(joined).not.toMatch(/volt|ampere|ohm|Ω/i);
    }
  });
});

// CC-12F: a Product Owner emulator finding -- `ohms_law.diagnose_wrong_operation`
// and `ohms_law.diagnose_rearrangement_error` previously shared byte-identical
// answerOptionLabels, so a learner shown "I = V x R" (wrong_operation's own
// stimulus) could defensibly pick either "used the wrong operation" or
// "rearranged the formula incorrectly" -- the options did not actually
// discriminate the hypothesis from its stated alternative (ARCH-003 §17.3:
// "a diagnostic check cannot infer two distinct misconceptions from
// behaviour that does not distinguish them"). Fixed by writing each
// blueprint's own option labels to describe exactly its own shown working.
describe("CC-12F: the two ohms_law diagnostic blueprints have distinguishable, non-overlapping option labels", () => {
  it("diagnose_wrong_operation's own shown working exhibits no division at all, so its 'rearrangement/swapped' option text does not apply to it", () => {
    const blueprint = getQuestionBlueprintFrom(MOBILE_CONTENT_PROJECTION, "ohms_law.diagnose_wrong_operation");
    const instance = generate("ohms_law.diagnose_wrong_operation", "li1_a", "misconception_check_wrong_operation");
    const shownWorking = resolveShownWorkingLines(blueprint, instance).join(" ");
    expect(shownWorking).toMatch(/x|×/); // multiplication shown
    expect(shownWorking).not.toMatch(/[÷/]/); // never division

    const labels = blueprint.presentation?.answerOptionLabels ?? {};
    expect(labels.wrong_operation).toMatch(/multipli.*divid/i);
    // The rearrangement_error option must describe a SWAPPED DIVISION --
    // a fact that is simply false of this blueprint's own multiplication
    // stimulus, so it can never be defensibly confused with the correct answer.
    expect(labels.rearrangement_error).toMatch(/divid.*wrong way round|swap/i);
  });

  it("diagnose_rearrangement_error's own shown working uses the correct operation (division), so its 'multiplied instead of divided' option text does not apply to it", () => {
    const blueprint = getQuestionBlueprintFrom(MOBILE_CONTENT_PROJECTION, "ohms_law.diagnose_rearrangement_error");
    const instance = generate("ohms_law.diagnose_rearrangement_error", "li1_a", "misconception_check_rearrangement");
    const shownWorking = resolveShownWorkingLines(blueprint, instance).join(" ");
    expect(shownWorking).toMatch(/\//); // division shown
    expect(shownWorking).not.toMatch(/x |×/); // never multiplication

    const labels = blueprint.presentation?.answerOptionLabels ?? {};
    expect(labels.rearrangement_error).toMatch(/wrong way round/i);
    expect(labels.wrong_operation).toMatch(/multipli/i);
  });

  it("the two blueprints' own option-label text for the same enum key differs -- proving they were actually rewritten per-blueprint, not left as one shared copy-pasted set", () => {
    const wrongOp = getQuestionBlueprintFrom(MOBILE_CONTENT_PROJECTION, "ohms_law.diagnose_wrong_operation");
    const rearrangement = getQuestionBlueprintFrom(MOBILE_CONTENT_PROJECTION, "ohms_law.diagnose_rearrangement_error");
    expect(wrongOp.presentation?.answerOptionLabels?.wrong_operation).not.toBe(rearrangement.presentation?.answerOptionLabels?.wrong_operation);
    expect(wrongOp.presentation?.answerOptionLabels?.rearrangement_error).not.toBe(rearrangement.presentation?.answerOptionLabels?.rearrangement_error);
  });
});

// CC-12G: a Product Owner emulator finding -- ohms_law.select_rearrangement's
// prompt ("Select the correct arrangement of V = I x R to use, based on
// which two quantities are known and which quantity is required") never
// actually stated which quantity this generated instance's own random
// target_variable was, while its answer options were just the bare
// variable names ("V (voltage)") -- neither the prompt nor the
// interaction actually asked "which equation should I use". Fixed by
// naming the target explicitly (target_variable_name, set by this
// blueprint's own executor) and switching the answer options (in
// answer-input-dispatch.tsx) to the actual rearranged equations.
describe("CC-12G: ohms_law.select_rearrangement's prompt names the actual target this instance generated", () => {
  it("the resolved prompt always names a real quantity word (voltage/current/resistance), matching this instance's own target_variable", () => {
    const blueprint = getQuestionBlueprintFrom(MOBILE_CONTENT_PROJECTION, "ohms_law.select_rearrangement");
    const targetNameByVariable: Record<string, string> = { V: "voltage", I: "current", R: "resistance" };
    for (const instanceId of ["li1_a", "li1_b", "li1_c", "li1_d", "li1_e", "li1_f"]) {
      const instance = generate("ohms_law.select_rearrangement", instanceId, "select_rearrangement_transfer");
      const target = instance.expected.value as string;
      const promptLines = resolvePromptLines(blueprint, instance);
      expect(promptLines).toEqual([`Which equation should you use to calculate ${targetNameByVariable[target]}?`]);
    }
  });

  it("the prompt never uses prose 'times' notation for the canonical relationship", () => {
    expect(getQuestionBlueprintFrom(MOBILE_CONTENT_PROJECTION, "ohms_law.select_rearrangement").title).not.toMatch(/\btimes\b/i);
  });
});
