import { evaluateAnswer } from "@alp/calculation-engine";
import { deriveStepSeed, generateLessonQuestion } from "./generate-lesson-question";

describe("deriveStepSeed", () => {
  it("is deterministic for the same (instanceId, stepId) pair", () => {
    expect(deriveStepSeed("li1_a", "step.1")).toBe(deriveStepSeed("li1_a", "step.1"));
  });

  it("differs across steps and across instances", () => {
    expect(deriveStepSeed("li1_a", "step.1")).not.toBe(deriveStepSeed("li1_a", "step.2"));
    expect(deriveStepSeed("li1_a", "step.1")).not.toBe(deriveStepSeed("li1_b", "step.1"));
  });
});

describe("generateLessonQuestion", () => {
  it("generates a real, gradeable instance for a governed Ohm's Law blueprint", () => {
    const instance = generateLessonQuestion({ blueprintId: "ohms_law.solve_for_voltage", instanceId: "li1_a", stepId: "worked_example_solve_voltage" });
    expect(instance.identity.blueprintId).toBe("ohms_law.solve_for_voltage");
    expect(typeof instance.expected.value).toBe("number");
    const correct = evaluateAnswer(instance, instance.expected.value);
    expect(correct.correct).toBe(true);
  });

  it("is deterministic: regenerating for the same instance/step produces a byte-identical instance", () => {
    const a = generateLessonQuestion({ blueprintId: "ohms_law.plausibility_check", instanceId: "li1_a", stepId: "plausibility_check_transfer" });
    const b = generateLessonQuestion({ blueprintId: "ohms_law.plausibility_check", instanceId: "li1_a", stepId: "plausibility_check_transfer" });
    expect(a).toEqual(b);
  });

  it("throws for a blueprint id outside this lesson's governed set", () => {
    expect(() => generateLessonQuestion({ blueprintId: "not.a.real.blueprint", instanceId: "li1_a", stepId: "x" })).toThrow();
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
      const instance = generateLessonQuestion({ blueprintId, instanceId: "li1_a", stepId: blueprintId });
      const evaluation = evaluateAnswer(instance, instance.expected.value);
      expect(evaluation.correct).toBe(true);
    }
  });
});
