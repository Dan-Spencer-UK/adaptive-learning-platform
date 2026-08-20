import { evaluateAnswer } from "@alp/calculation-engine";
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
