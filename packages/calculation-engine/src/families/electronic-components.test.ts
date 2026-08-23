import { describe, expect, it } from "vitest";
import type { DiagramBlueprint, FormulaFamily, QuestionBlueprint, WorkedExampleBlueprint } from "@alp/content-schema";
import { markAnswer } from "../marking.ts";
import { createRngFromIdentity, type DeterministicIdentity } from "../seed.ts";
import { electronicComponentsExecutors, __internal } from "./electronic-components.ts";
import type { GenerationContext } from "./shared.ts";

/**
 * CC-11 (Workstream C): standalone proof for `electronic-components.ts`,
 * mirroring `magnetism.test.ts`'s pattern -- locally-constructed fixture
 * blueprints (never imported from scripts/content/data, per the
 * content -> engine dependency direction this package's other tests
 * already establish) exercised directly against the exported executor
 * map, proving generation is deterministic and every generated instance
 * marks correctly via the real `markAnswer` grading path.
 */

function fixtureBlueprint(id: string, capabilityId: string, options: readonly string[]): QuestionBlueprint {
  return {
    id,
    assertionFamilyId: "electrical.electronic_components",
    capabilityId,
    title: id,
    representation: {},
    variantDimensions: {},
    parameterGenerators: [],
    answer: { type: "multiple_choice", options: [...options] },
    marking: { type: "exact" },
    evidence: {
      primaryCapabilityId: capabilityId,
      familyId: "electrical.electronic_components",
      assertionIdentifiers: ["EL-TEST-001"],
      supportingCapabilityIds: [],
      representationDependency: [],
      misconceptionTargets: [],
    },
    difficultyBand: "intermediate",
  };
}

function contextFor(blueprint: QuestionBlueprint, identity: DeterministicIdentity): GenerationContext {
  const formulaFamilies: FormulaFamily[] = [];
  const diagramBlueprints: DiagramBlueprint[] = [];
  const workedExampleBlueprints: WorkedExampleBlueprint[] = [];
  return {
    blueprint,
    formulaFamiliesById: new Map(formulaFamilies.map((f) => [f.id, f])),
    diagramBlueprintsById: new Map(diagramBlueprints.map((d) => [d.id, d])),
    workedExampleBlueprintsById: new Map(workedExampleBlueprints.map((w) => [w.id, w])),
    identity,
    rng: createRngFromIdentity(identity),
  };
}

function identity(blueprintId: string, seed: number): DeterministicIdentity {
  return { blueprintId, blueprintVersion: 1, contentRelease: "test", seed };
}

describe("electronics.recognise_capacitor_behaviour", () => {
  const capabilityId = "cap.electronic_components.recognise_principle";
  const bp = fixtureBlueprint("electronics.recognise_capacitor_behaviour", capabilityId, [
    "gradual_exponential_change",
    "instant_step_change",
  ]);

  it("always answers gradual_exponential_change (the governed contrast to the instantaneous misconception), for both charging and discharging scenarios", () => {
    const seenScenarios = new Set<string>();
    for (let seed = 0; seed < 20; seed++) {
      const instance = electronicComponentsExecutors["electronics.recognise_capacitor_behaviour"]!(contextFor(bp, identity(bp.id, seed)));
      expect(instance.expected.value).toBe("gradual_exponential_change");
      expect(["charging", "discharging"]).toContain(instance.parameters.scenario);
      seenScenarios.add(instance.parameters.scenario as string);
      const marked = markAnswer(instance.marking, instance.expected.value, "gradual_exponential_change");
      expect(marked.correct).toBe(true);
      const markedWrong = markAnswer(instance.marking, instance.expected.value, "instant_step_change");
      expect(markedWrong.correct).toBe(false);
    }
    expect(seenScenarios.size).toBe(2); // both scenarios genuinely occur across seeds
  });

  it("is deterministic: same identity always regenerates an identical instance", () => {
    const id = identity(bp.id, 7);
    const first = electronicComponentsExecutors["electronics.recognise_capacitor_behaviour"]!(contextFor(bp, id));
    const second = electronicComponentsExecutors["electronics.recognise_capacitor_behaviour"]!(contextFor(bp, id));
    expect(second).toEqual(first);
  });
});

describe("electronics.recognise_thermistor_type", () => {
  const capabilityId = "cap.electronic_components.recognise_principle";
  const bp = fixtureBlueprint("electronics.recognise_thermistor_type", capabilityId, ["ntc_thermistor", "ptc_thermistor"]);

  it("generates exactly one of the two thermistor types, with a matching clue, and marks correctly", () => {
    for (let seed = 0; seed < 20; seed++) {
      const instance = electronicComponentsExecutors["electronics.recognise_thermistor_type"]!(contextFor(bp, identity(bp.id, seed)));
      const value = instance.expected.value as keyof typeof __internal.THERMISTOR_TYPE_CLUES;
      expect(Object.keys(__internal.THERMISTOR_TYPE_CLUES)).toContain(value);
      expect(instance.parameters.thermistor_type_clue).toBe(__internal.THERMISTOR_TYPE_CLUES[value]);
      expect(markAnswer(instance.marking, instance.expected.value, value).correct).toBe(true);
      const wrong = value === "ntc_thermistor" ? "ptc_thermistor" : "ntc_thermistor";
      expect(markAnswer(instance.marking, instance.expected.value, wrong).correct).toBe(false);
    }
  });

  it("covers both thermistor types across enough seeds", () => {
    const seen = new Set<string>();
    for (let seed = 0; seed < 20; seed++) {
      const instance = electronicComponentsExecutors["electronics.recognise_thermistor_type"]!(contextFor(bp, identity(bp.id, seed)));
      seen.add(instance.expected.value as string);
    }
    expect(seen).toEqual(new Set(["ntc_thermistor", "ptc_thermistor"]));
  });
});

describe("electronics.recognise_rectifier_type", () => {
  const capabilityId = "cap.electronic_components.recognise_principle";
  const bp = fixtureBlueprint("electronics.recognise_rectifier_type", capabilityId, ["half_wave_rectifier", "full_wave_rectifier", "inverter"]);

  it("generates exactly one of the three governed rectifier/inverter types, with a matching clue, and marks correctly", () => {
    for (let seed = 0; seed < 30; seed++) {
      const instance = electronicComponentsExecutors["electronics.recognise_rectifier_type"]!(contextFor(bp, identity(bp.id, seed)));
      const value = instance.expected.value as keyof typeof __internal.RECTIFIER_TYPE_CLUES;
      expect(Object.keys(__internal.RECTIFIER_TYPE_CLUES)).toContain(value);
      expect(instance.parameters.rectifier_type_clue).toBe(__internal.RECTIFIER_TYPE_CLUES[value]);
      expect(markAnswer(instance.marking, instance.expected.value, value).correct).toBe(true);
      for (const wrong of Object.keys(__internal.RECTIFIER_TYPE_CLUES).filter((k) => k !== value)) {
        expect(markAnswer(instance.marking, instance.expected.value, wrong).correct).toBe(false);
      }
    }
  });

  it("covers all three types across enough seeds (distinguishes half-wave from full-wave from inverter)", () => {
    const seen = new Set<string>();
    for (let seed = 0; seed < 40; seed++) {
      const instance = electronicComponentsExecutors["electronics.recognise_rectifier_type"]!(contextFor(bp, identity(bp.id, seed)));
      seen.add(instance.expected.value as string);
    }
    expect(seen).toEqual(new Set(["half_wave_rectifier", "full_wave_rectifier", "inverter"]));
  });
});

describe("electronics.recognise_diode_family", () => {
  const capabilityId = "cap.electronic_components.recognise_principle";
  const bp = fixtureBlueprint("electronics.recognise_diode_family", capabilityId, ["diode", "zener_diode", "led", "photodiode"]);

  it("generates exactly one of the four diode-family terms, with a matching clue, and marks correctly", () => {
    for (let seed = 0; seed < 30; seed++) {
      const instance = electronicComponentsExecutors["electronics.recognise_diode_family"]!(contextFor(bp, identity(bp.id, seed)));
      const value = instance.expected.value as keyof typeof __internal.DIODE_FAMILY_CLUES;
      expect(Object.keys(__internal.DIODE_FAMILY_CLUES)).toContain(value);
      expect(instance.parameters.diode_family_clue).toBe(__internal.DIODE_FAMILY_CLUES[value]);
      expect(markAnswer(instance.marking, instance.expected.value, value).correct).toBe(true);
    }
  });

  it("covers all four diode-family terms across enough seeds", () => {
    const seen = new Set<string>();
    for (let seed = 0; seed < 50; seed++) {
      const instance = electronicComponentsExecutors["electronics.recognise_diode_family"]!(contextFor(bp, identity(bp.id, seed)));
      seen.add(instance.expected.value as string);
    }
    expect(seen).toEqual(new Set(["diode", "zener_diode", "led", "photodiode"]));
  });
});

describe("electronics.recognise_switching_family", () => {
  const capabilityId = "cap.electronic_components.recognise_principle";
  const bp = fixtureBlueprint("electronics.recognise_switching_family", capabilityId, ["diac", "triac", "thyristor_scr", "transistor"]);

  it("generates exactly one of the four switching-family terms, with a matching clue, and marks correctly", () => {
    for (let seed = 0; seed < 30; seed++) {
      const instance = electronicComponentsExecutors["electronics.recognise_switching_family"]!(contextFor(bp, identity(bp.id, seed)));
      const value = instance.expected.value as keyof typeof __internal.SWITCHING_FAMILY_CLUES;
      expect(Object.keys(__internal.SWITCHING_FAMILY_CLUES)).toContain(value);
      expect(instance.parameters.switching_family_clue).toBe(__internal.SWITCHING_FAMILY_CLUES[value]);
      expect(markAnswer(instance.marking, instance.expected.value, value).correct).toBe(true);
    }
  });

  it("covers all four switching-family terms across enough seeds", () => {
    const seen = new Set<string>();
    for (let seed = 0; seed < 50; seed++) {
      const instance = electronicComponentsExecutors["electronics.recognise_switching_family"]!(contextFor(bp, identity(bp.id, seed)));
      seen.add(instance.expected.value as string);
    }
    expect(seen).toEqual(new Set(["diac", "triac", "thyristor_scr", "transistor"]));
  });
});

describe("electronics.identify_application", () => {
  const capabilityId = "cap.electronic_components.identify_application";
  const bp = fixtureBlueprint("electronics.identify_application", capabilityId, ["triac", "thyristor_scr", "thermistor", "transistor", "capacitor", "resistor"]);

  it("generates a scenario clue whose answer matches the governed scenario-to-component mapping, and marks correctly", () => {
    for (let seed = 0; seed < 40; seed++) {
      const instance = electronicComponentsExecutors["electronics.identify_application"]!(contextFor(bp, identity(bp.id, seed)));
      const clue = instance.parameters.application_clue as string;
      expect(typeof clue).toBe("string");
      expect(clue.length).toBeGreaterThan(0);
      const value = instance.expected.value as string;
      expect(Object.values(__internal.APPLICATION_SCENARIO_ANSWER)).toContain(value);
      expect(markAnswer(instance.marking, instance.expected.value, value).correct).toBe(true);
    }
  });

  it("splits the two-component security-alarm and telephone-master-socket assertions into independent single-answer scenarios (atomicity)", () => {
    // security alarm: break-detection (transistor) and latching (thyristor_scr)
    // are two DIFFERENT scenario keys with two DIFFERENT correct answers --
    // never a single instance whose one answer certifies both roles at once.
    expect(__internal.APPLICATION_SCENARIO_ANSWER.security_alarm_break_detection).toBe("transistor");
    expect(__internal.APPLICATION_SCENARIO_ANSWER.security_alarm_latch).toBe("thyristor_scr");
    // telephone master socket: ringing-coupling (capacitor) and test-load
    // (resistor) are likewise two independent scenario keys.
    expect(__internal.APPLICATION_SCENARIO_ANSWER.telephone_ringing_coupling).toBe("capacitor");
    expect(__internal.APPLICATION_SCENARIO_ANSWER.telephone_test_load).toBe("resistor");
  });

  it("covers all 7 scenarios across enough seeds", () => {
    const seenAnswers = new Set<string>();
    for (let seed = 0; seed < 80; seed++) {
      const instance = electronicComponentsExecutors["electronics.identify_application"]!(contextFor(bp, identity(bp.id, seed)));
      seenAnswers.add(instance.parameters.application_clue as string);
    }
    expect(seenAnswers.size).toBe(7);
  });

  it("is deterministic: same identity always regenerates an identical instance", () => {
    const id = identity(bp.id, 3);
    const first = electronicComponentsExecutors["electronics.identify_application"]!(contextFor(bp, id));
    const second = electronicComponentsExecutors["electronics.identify_application"]!(contextFor(bp, id));
    expect(second).toEqual(first);
  });
});
