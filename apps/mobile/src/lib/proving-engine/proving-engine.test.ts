/**
 * CC-05C: proves the proving-slice engine binding is wired correctly
 * against the real @alp/calculation-engine (CC-05B) for every blueprint
 * this proving slice uses -- generation, determinism, correct/incorrect
 * marking and evidence emission. This does not re-prove CC-05B's own
 * generic machinery (that is scripts/content/prove-cc05b-engine.ts's job)
 * -- it proves this package's fixture + wrapper are wired correctly.
 */
import { emitProvingEvidence, generateProvingQuestion, markProvingAnswer } from "./proving-engine";
import { PROVING_FAMILIES } from "@/lib/proving-content/unit202-proving-fixture";

const ALL_BLUEPRINT_IDS = PROVING_FAMILIES.flatMap((f) => f.questionBlueprints.map((q) => ({ familyId: f.id, blueprintId: q.id })));

describe("proving-engine", () => {
  it("generates a valid instance for every blueprint in the proving-slice fixture across a small seed sweep", () => {
    for (const { familyId, blueprintId } of ALL_BLUEPRINT_IDS) {
      for (const seed of [1, 2, 3, 17, 99]) {
        const instance = generateProvingQuestion({ familyId, blueprintId, seed });
        expect(instance.identity.blueprintId).toBe(blueprintId);
        expect(instance.expected.value).toBeDefined();

        const correct = markProvingAnswer(instance, instance.expected.value);
        expect(correct.correct).toBe(true);

        const evidence = emitProvingEvidence(instance, correct);
        expect(evidence.questionBlueprintId).toBe(blueprintId);
        expect(evidence.correct).toBe(true);
      }
    }
  });

  it("is deterministic: the same (family, blueprint, seed) always regenerates a byte-identical instance", () => {
    const a = generateProvingQuestion({ familyId: "electrical.ohms_law", blueprintId: "ohms_law.solve_for_voltage", seed: 7 });
    const b = generateProvingQuestion({ familyId: "electrical.ohms_law", blueprintId: "ohms_law.solve_for_voltage", seed: 7 });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it("a different seed produces a different (but still valid) instance", () => {
    const a = generateProvingQuestion({ familyId: "electrical.ohms_law", blueprintId: "ohms_law.solve_for_voltage", seed: 1 });
    const b = generateProvingQuestion({ familyId: "electrical.ohms_law", blueprintId: "ohms_law.solve_for_voltage", seed: 2 });
    expect(JSON.stringify(a)).not.toBe(JSON.stringify(b));
  });

  it("survives a JSON round trip with zero semantic loss", () => {
    const instance = generateProvingQuestion({ familyId: "electrical.parallel_circuits", blueprintId: "parallel.calculate_total", seed: 5 });
    const roundTripped: unknown = JSON.parse(JSON.stringify(instance));
    expect(roundTripped).toEqual(instance);
  });

  it("grades an incorrect numeric answer as incorrect with a generic (undeclared-misconception) evidence strength", () => {
    const instance = generateProvingQuestion({ familyId: "electrical.ohms_law", blueprintId: "ohms_law.solve_for_voltage", seed: 3 });
    const wrong = markProvingAnswer(instance, (instance.expected.value as number) + 1000);
    expect(wrong.correct).toBe(false);
    expect(wrong.misconceptionIdentifier).toBeUndefined();
    expect(wrong.evidenceStrength).toBe("generic");
  });

  it("attributes a declared, suggestive-strength misconception for a wrong magnetism force-direction answer", () => {
    const instance = generateProvingQuestion({
      familyId: "electrical.magnetism_and_electromagnetism",
      blueprintId: "magnetism.interpret_force_direction",
      seed: 4,
    });
    const wrongDirection = (["up", "down", "left", "right"] as const).find((d) => d !== instance.expected.value)!;
    const wrong = markProvingAnswer(instance, wrongDirection);
    expect(wrong.correct).toBe(false);
    expect(wrong.misconceptionIdentifier).toBe("MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001");
    expect(wrong.evidenceStrength).toBe("suggestive");
  });

  it("throws for a family outside this proving slice's fixture", () => {
    expect(() => generateProvingQuestion({ familyId: "electrical.energy_and_efficiency", blueprintId: "x", seed: 1 })).toThrow();
  });

  it("throws for a blueprint not governed within a real proving-slice family", () => {
    expect(() =>
      generateProvingQuestion({ familyId: "electrical.ohms_law", blueprintId: "ohms_law.nonexistent", seed: 1 }),
    ).toThrow();
  });
});
