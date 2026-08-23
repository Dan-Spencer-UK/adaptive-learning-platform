import { describe, expect, it } from "vitest";
import type { FormulaFamily, QuestionBlueprint } from "@alp/content-schema";
import { evaluateAnswer } from "../engine.ts";
import { createRngFromIdentity, type DeterministicIdentity } from "../seed.ts";
import { foundationalMechanicsExecutors, __internal } from "./foundational-mechanics.ts";
import type { GenerationContext } from "./shared.ts";

/**
 * CC-11 (Workstream A): proves the new foundational-mechanics executors
 * (mass/weight, levers/gears/pulleys, general mechanics) generate, mark
 * correct/incorrect answers, and reproduce deterministically -- against
 * minimal, self-contained local fixtures matching the EXACT shape of the
 * new blueprints/formula families this package proposes for
 * cc05a-pedagogy-unit202.ts (not yet applied there -- see this package's
 * final report). Mirrors magnetism.test.ts's own direct-executor-
 * invocation style (bypassing engine.ts's EXECUTORS registry, which this
 * package does not edit) and new-families.test.ts's local-fixture style
 * for formula-family-driven calculation blueprints.
 */

// ---------------------------------------------------------------------
// Local formula-family fixtures -- byte-identical in shape to the real
// formula families this package's final report proposes adding to
// cc05a-pedagogy-unit202.ts's `formulaFamilies` array.
// ---------------------------------------------------------------------

const LEVER_BALANCE_FORMULA: FormulaFamily = {
  id: "formula.lever_balance",
  assertionFamilyId: "foundational.levers_mechanical_advantage",
  canonicalTarget: "Fe",
  variables: [
    { symbol: "Fe", name: "effort force", quantity: "force", unitName: "newton", unitSymbol: "N" },
    { symbol: "de", name: "effort-to-pivot distance", quantity: "length", unitName: "metre", unitSymbol: "m" },
    { symbol: "Fl", name: "load force", quantity: "force", unitName: "newton", unitSymbol: "N" },
    { symbol: "dl", name: "load-to-pivot distance", quantity: "length", unitName: "metre", unitSymbol: "m" },
  ],
  forms: [
    {
      target: "Fe",
      expression: { operation: "divide", numerator: { operation: "multiply", operands: ["Fl", "dl"] }, denominator: "de" },
      instruction: "",
      requiresWorkedExample: true,
    },
    {
      target: "Fl",
      expression: { operation: "divide", numerator: { operation: "multiply", operands: ["Fe", "de"] }, denominator: "dl" },
      instruction: "",
      requiresWorkedExample: true,
    },
  ],
  requiredTargets: ["Fe", "Fl"],
};

const MECHANICS_WORK_FORMULA: FormulaFamily = {
  id: "formula.mechanics_work",
  assertionFamilyId: "foundational.mechanics_work_energy_power",
  canonicalTarget: "W",
  variables: [
    { symbol: "W", name: "work done", quantity: "work", unitName: "joule", unitSymbol: "J" },
    { symbol: "F", name: "force", quantity: "force", unitName: "newton", unitSymbol: "N" },
    { symbol: "d", name: "distance moved", quantity: "length", unitName: "metre", unitSymbol: "m" },
  ],
  forms: [{ target: "W", expression: { operation: "multiply", operands: ["F", "d"] }, instruction: "", requiresWorkedExample: true }],
  requiredTargets: ["W"],
};

const MECHANICS_KINETIC_ENERGY_FORMULA: FormulaFamily = {
  id: "formula.mechanics_kinetic_energy",
  assertionFamilyId: "foundational.mechanics_work_energy_power",
  canonicalTarget: "KE",
  variables: [
    { symbol: "KE", name: "kinetic energy", quantity: "energy", unitName: "joule", unitSymbol: "J" },
    { symbol: "m", name: "mass", quantity: "mass", unitName: "kilogram", unitSymbol: "kg" },
    { symbol: "v", name: "speed", quantity: "speed", unitName: "metre per second", unitSymbol: "m/s" },
  ],
  forms: [
    {
      target: "KE",
      expression: { operation: "multiply", operands: [0.5, "m", { operation: "square", operand: "v" }] },
      instruction: "",
      requiresWorkedExample: true,
    },
  ],
  requiredTargets: ["KE"],
};

const MECHANICS_POTENTIAL_ENERGY_FORMULA: FormulaFamily = {
  id: "formula.mechanics_potential_energy",
  assertionFamilyId: "foundational.mechanics_work_energy_power",
  canonicalTarget: "PE",
  variables: [
    { symbol: "PE", name: "gravitational potential energy", quantity: "energy", unitName: "joule", unitSymbol: "J" },
    { symbol: "m", name: "mass", quantity: "mass", unitName: "kilogram", unitSymbol: "kg" },
    { symbol: "h", name: "height", quantity: "length", unitName: "metre", unitSymbol: "m" },
  ],
  forms: [{ target: "PE", expression: { operation: "multiply", operands: ["m", 9.81, "h"] }, instruction: "", requiresWorkedExample: true }],
  requiredTargets: ["PE"],
};

const MECHANICS_POWER_FORMULA: FormulaFamily = {
  id: "formula.mechanics_power",
  assertionFamilyId: "foundational.mechanics_work_energy_power",
  canonicalTarget: "P",
  variables: [
    { symbol: "P", name: "power", quantity: "power", unitName: "watt", unitSymbol: "W" },
    { symbol: "W", name: "work done (or energy transferred)", quantity: "work_or_energy", unitName: "joule", unitSymbol: "J" },
    { symbol: "t", name: "time taken", quantity: "time", unitName: "second", unitSymbol: "s" },
  ],
  forms: [{ target: "P", expression: { operation: "divide", numerator: "W", denominator: "t" }, instruction: "", requiresWorkedExample: true }],
  requiredTargets: ["P"],
};

const MECHANICS_EFFICIENCY_FORMULA: FormulaFamily = {
  id: "formula.mechanics_efficiency",
  assertionFamilyId: "foundational.mechanics_work_energy_power",
  canonicalTarget: "eta",
  variables: [
    { symbol: "eta", name: "efficiency", quantity: "efficiency", unitName: "percent", unitSymbol: "%" },
    { symbol: "Eout", name: "useful output", quantity: "energy_or_power", unitName: "joule or watt", unitSymbol: "J/W" },
    { symbol: "Ein", name: "total input", quantity: "energy_or_power", unitName: "joule or watt", unitSymbol: "J/W" },
  ],
  forms: [
    { target: "eta", expression: { operation: "ratio_percentage", numerator: "Eout", denominator: "Ein" }, instruction: "", requiresWorkedExample: true },
  ],
  requiredTargets: ["eta"],
};

const ALL_FORMULA_FAMILIES = [
  LEVER_BALANCE_FORMULA,
  MECHANICS_WORK_FORMULA,
  MECHANICS_KINETIC_ENERGY_FORMULA,
  MECHANICS_POTENTIAL_ENERGY_FORMULA,
  MECHANICS_POWER_FORMULA,
  MECHANICS_EFFICIENCY_FORMULA,
];

function blueprint(overrides: Partial<QuestionBlueprint> & Pick<QuestionBlueprint, "id" | "assertionFamilyId" | "capabilityId">): QuestionBlueprint {
  return {
    title: overrides.id,
    representation: {},
    variantDimensions: {},
    parameterGenerators: [],
    answer: { type: "quantity", quantity: "x", canonicalUnit: "x" },
    marking: { type: "numeric_tolerance", tolerancePercent: 2 },
    evidence: {
      primaryCapabilityId: overrides.capabilityId,
      familyId: overrides.assertionFamilyId,
      assertionIdentifiers: ["FP-TEST-001"],
      supportingCapabilityIds: [],
      representationDependency: [],
      misconceptionTargets: [],
    },
    difficultyBand: "introductory",
    ...overrides,
  };
}

function identity(blueprintId: string, seed: number): DeterministicIdentity {
  return { blueprintId, blueprintVersion: 1, contentRelease: "test", seed };
}

function contextFor(bp: QuestionBlueprint, seed: number): GenerationContext {
  const id = identity(bp.id, seed);
  return {
    blueprint: bp,
    formulaFamiliesById: new Map(ALL_FORMULA_FAMILIES.map((f) => [f.id, f])),
    diagramBlueprintsById: new Map(),
    workedExampleBlueprintsById: new Map(),
    identity: id,
    rng: createRngFromIdentity(id),
  };
}

function generate(bp: QuestionBlueprint, seed: number) {
  const executor = foundationalMechanicsExecutors[bp.id];
  if (!executor) throw new Error(`no foundationalMechanicsExecutors entry for "${bp.id}"`);
  return executor(contextFor(bp, seed));
}

/** Extracts a guaranteed numeric parameter value (Record access is `| undefined` under noUncheckedIndexedAccess). */
function num(params: Record<string, number | string>, key: string): number {
  const value = params[key];
  if (typeof value !== "number") throw new Error(`expected numeric parameter "${key}", got ${JSON.stringify(value)}`);
  return value;
}

describe("mass_weight.recognise_relationship", () => {
  const bp = blueprint({
    id: "mass_weight.recognise_relationship",
    assertionFamilyId: "foundational.mass_weight",
    capabilityId: "cap.foundational.mass_weight.recognise",
    answer: { type: "multiple_choice", options: ["mass", "weight"] },
    marking: { type: "exact" },
  });

  it("always answers mass or weight, with a clue matching the governed CLUES table (and never leaking the answer word itself)", () => {
    for (let seed = 0; seed < 20; seed++) {
      const instance = generate(bp, seed);
      const value = instance.expected.value as "mass" | "weight";
      expect(["mass", "weight"]).toContain(value);
      expect(instance.parameters.concept_clue).toBe(__internal.MASS_WEIGHT_CLUES[value]);
      expect(String(instance.parameters.concept_clue)).not.toMatch(new RegExp(`\\b${value}\\b`));
    }
  });

  it("marks a correct answer correct and a wrong answer incorrect", () => {
    const instance = generate(bp, 0);
    const correct = instance.expected.value as string;
    const wrong = correct === "mass" ? "weight" : "mass";
    expect(evaluateAnswer(instance, correct).correct).toBe(true);
    expect(evaluateAnswer(instance, wrong).correct).toBe(false);
  });

  it("is deterministic: same identity -> same instance", () => {
    expect(generate(bp, 7)).toEqual(generate(bp, 7));
  });
});

describe("levers.identify_class", () => {
  const bp = blueprint({
    id: "levers.identify_class",
    assertionFamilyId: "foundational.levers_mechanical_advantage",
    capabilityId: "cap.foundational.levers.recognise",
    answer: { type: "multiple_choice", options: ["class_I", "class_II", "class_III"] },
    marking: { type: "exact" },
  });

  it("always answers a real lever class, with a clue matching the governed pivot/effort/load table", () => {
    for (let seed = 0; seed < 20; seed++) {
      const instance = generate(bp, seed);
      const value = instance.expected.value as "class_I" | "class_II" | "class_III";
      expect(["class_I", "class_II", "class_III"]).toContain(value);
      expect(instance.parameters.arrangement_clue).toBe(__internal.LEVER_CLASS_CLUES[value]);
    }
  });
});

describe("gears.recognise_ratio_tradeoff", () => {
  const bp = blueprint({
    id: "gears.recognise_ratio_tradeoff",
    assertionFamilyId: "foundational.levers_mechanical_advantage",
    capabilityId: "cap.foundational.gears.recognise",
    answer: { type: "multiple_choice", options: ["torque_increases", "speed_increases"] },
    marking: { type: "exact" },
  });

  it("a larger driven gear always increases torque; a smaller driven gear always increases speed (FP-REL-GEAR-RATIO-001, MA = driven/driving radius)", () => {
    for (let seed = 0; seed < 20; seed++) {
      const instance = generate(bp, seed);
      const clue = instance.parameters.scenario_clue as string;
      const scenario = clue === __internal.GEAR_SCENARIO_CLUES.driven_larger ? "driven_larger" : "driven_smaller";
      expect(__internal.GEAR_SCENARIO_CLUES[scenario]).toBe(clue);
      expect(instance.expected.value).toBe(__internal.GEAR_TRADEOFF_OUTCOME[scenario]);
    }
  });
});

describe("pulleys.recognise_force_distance_tradeoff", () => {
  const bp = blueprint({
    id: "pulleys.recognise_force_distance_tradeoff",
    assertionFamilyId: "foundational.levers_mechanical_advantage",
    capabilityId: "cap.foundational.pulleys.recognise",
    answer: { type: "multiple_choice", options: ["effort_force_decreases", "effort_force_increases"] },
    marking: { type: "exact" },
  });

  it("more supporting rope sections always decreases effort force; fewer always increases it (FP-REL-PULLEY-FORCE-DISTANCE-TRADEOFF-001)", () => {
    for (let seed = 0; seed < 20; seed++) {
      const instance = generate(bp, seed);
      const clue = instance.parameters.scenario_clue as string;
      const scenario = clue === __internal.PULLEY_SCENARIO_CLUES.more_supporting_sections ? "more_supporting_sections" : "fewer_supporting_sections";
      expect(__internal.PULLEY_SCENARIO_CLUES[scenario]).toBe(clue);
      expect(instance.expected.value).toBe(__internal.PULLEY_TRADEOFF_OUTCOME[scenario]);
    }
  });
});

describe("levers.calculate_effort_or_load", () => {
  const bp = blueprint({
    id: "levers.calculate_effort_or_load",
    assertionFamilyId: "foundational.levers_mechanical_advantage",
    capabilityId: "cap.foundational.levers.calculate",
    representation: { formula: { required: true, formulaFamilyId: "formula.lever_balance" } },
    variantDimensions: { target_variable: { allowed: ["Fe", "Fl"] } },
  });

  it("effort x effort-arm = load x load-arm holds for both solve directions, across many seeds", () => {
    let sawEffort = false;
    let sawLoad = false;
    for (let seed = 0; seed < 30; seed++) {
      const instance = generate(bp, seed);
      const params = instance.parameters as Record<string, number | string>;
      if (params.target_variable === "Fe") {
        sawEffort = true;
        const Fl = num(params, "Fl");
        const dl = num(params, "dl");
        const de = num(params, "de");
        expect(instance.expected.value).toBeCloseTo((Fl * dl) / de, 5);
        // Moment balance holds: effort x effort-arm == load x load-arm.
        expect((instance.expected.value as number) * de).toBeCloseTo(Fl * dl, 4);
      } else {
        sawLoad = true;
        const Fe = num(params, "Fe");
        const de = num(params, "de");
        const dl = num(params, "dl");
        expect(instance.expected.value).toBeCloseTo((Fe * de) / dl, 5);
        expect((instance.expected.value as number) * dl).toBeCloseTo(Fe * de, 4);
      }
    }
    expect(sawEffort).toBe(true);
    expect(sawLoad).toBe(true);
  });

  it("marks a numerically correct answer within tolerance as correct", () => {
    const instance = generate(bp, 3);
    expect(evaluateAnswer(instance, instance.expected.value as number).correct).toBe(true);
    expect(evaluateAnswer(instance, (instance.expected.value as number) * 5 + 1000).correct).toBe(false);
  });
});

describe("mechanics.recognise_concept", () => {
  const bp = blueprint({
    id: "mechanics.recognise_concept",
    assertionFamilyId: "foundational.mechanics_work_energy_power",
    capabilityId: "cap.foundational.mechanics.recognise",
    answer: { type: "multiple_choice", options: ["force", "work", "energy", "power", "efficiency"] },
    marking: { type: "exact" },
  });

  it("always answers one of the five concepts, with a clue matching the governed CLUES table", () => {
    for (let seed = 0; seed < 25; seed++) {
      const instance = generate(bp, seed);
      const value = instance.expected.value as keyof typeof __internal.MECHANICS_CONCEPT_CLUES;
      expect(["force", "work", "energy", "power", "efficiency"]).toContain(value);
      expect(instance.parameters.concept_clue).toBe(__internal.MECHANICS_CONCEPT_CLUES[value]);
    }
  });
});

describe("mechanics.calculate_work: W = F x d", () => {
  const bp = blueprint({
    id: "mechanics.calculate_work",
    assertionFamilyId: "foundational.mechanics_work_energy_power",
    capabilityId: "cap.foundational.mechanics.calculate",
    representation: { formula: { required: true, formulaFamilyId: "formula.mechanics_work" } },
  });

  it("computes W = F x d via the real formula", () => {
    for (let seed = 0; seed < 15; seed++) {
      const instance = generate(bp, seed);
      const params = instance.parameters as Record<string, number>;
      expect(instance.expected.value).toBeCloseTo(num(params, "F") * num(params, "d"), 5);
    }
  });
});

describe("mechanics.calculate_kinetic_energy: KE = 1/2 m v^2", () => {
  const bp = blueprint({
    id: "mechanics.calculate_kinetic_energy",
    assertionFamilyId: "foundational.mechanics_work_energy_power",
    capabilityId: "cap.foundational.mechanics.calculate",
    representation: { formula: { required: true, formulaFamilyId: "formula.mechanics_kinetic_energy" } },
  });

  it("computes KE = 0.5 x m x v^2 via the real formula", () => {
    for (let seed = 0; seed < 15; seed++) {
      const instance = generate(bp, seed);
      const params = instance.parameters as Record<string, number>;
      const m = num(params, "m");
      const v = num(params, "v");
      expect(instance.expected.value).toBeCloseTo(0.5 * m * v * v, 5);
    }
  });
});

describe("mechanics.calculate_potential_energy: PE = m g h", () => {
  const bp = blueprint({
    id: "mechanics.calculate_potential_energy",
    assertionFamilyId: "foundational.mechanics_work_energy_power",
    capabilityId: "cap.foundational.mechanics.calculate",
    representation: { formula: { required: true, formulaFamilyId: "formula.mechanics_potential_energy" } },
  });

  it("computes PE = m x 9.81 x h via the real formula", () => {
    for (let seed = 0; seed < 15; seed++) {
      const instance = generate(bp, seed);
      const params = instance.parameters as Record<string, number>;
      const m = num(params, "m");
      const h = num(params, "h");
      expect(instance.expected.value).toBeCloseTo(m * 9.81 * h, 3);
    }
  });
});

describe("mechanics.calculate_power: P = W / t", () => {
  const bp = blueprint({
    id: "mechanics.calculate_power",
    assertionFamilyId: "foundational.mechanics_work_energy_power",
    capabilityId: "cap.foundational.mechanics.calculate",
    representation: { formula: { required: true, formulaFamilyId: "formula.mechanics_power" } },
  });

  it("computes P = W / t via the real formula", () => {
    for (let seed = 0; seed < 15; seed++) {
      const instance = generate(bp, seed);
      const params = instance.parameters as Record<string, number>;
      expect(instance.expected.value).toBeCloseTo(num(params, "W") / num(params, "t"), 5);
    }
  });
});

describe("mechanics.calculate_efficiency: eta = Eout/Ein x 100", () => {
  const bp = blueprint({
    id: "mechanics.calculate_efficiency",
    assertionFamilyId: "foundational.mechanics_work_energy_power",
    capabilityId: "cap.foundational.mechanics.calculate",
    answer: { type: "quantity", quantity: "efficiency", canonicalUnit: "percent" },
    representation: { formula: { required: true, formulaFamilyId: "formula.mechanics_efficiency" } },
  });

  it("computes eta = Eout/Ein x 100, and Eout is always < Ein (physically sensible, <100%)", () => {
    for (let seed = 0; seed < 30; seed++) {
      const instance = generate(bp, seed);
      const params = instance.parameters as Record<string, number>;
      const Eout = num(params, "Eout");
      const Ein = num(params, "Ein");
      expect(Eout).toBeLessThan(Ein);
      const eta = instance.expected.value as number;
      expect(eta).toBeGreaterThan(0);
      expect(eta).toBeLessThan(100);
      expect(eta).toBeCloseTo((Eout / Ein) * 100, 5);
    }
  });
});

/** Which formula family (if any) each blueprint id's executor requires via requireFormulaFamily. */
const FORMULA_FAMILY_BY_BLUEPRINT_ID: Readonly<Record<string, string | undefined>> = {
  "mass_weight.recognise_relationship": undefined,
  "levers.identify_class": undefined,
  "gears.recognise_ratio_tradeoff": undefined,
  "pulleys.recognise_force_distance_tradeoff": undefined,
  "levers.calculate_effort_or_load": "formula.lever_balance",
  "mechanics.recognise_concept": undefined,
  "mechanics.calculate_work": "formula.mechanics_work",
  "mechanics.calculate_kinetic_energy": "formula.mechanics_kinetic_energy",
  "mechanics.calculate_potential_energy": "formula.mechanics_potential_energy",
  "mechanics.calculate_power": "formula.mechanics_power",
  "mechanics.calculate_efficiency": "formula.mechanics_efficiency",
};

describe("every foundationalMechanicsExecutors entry is deterministic across repeated calls", () => {
  const ids = Object.keys(foundationalMechanicsExecutors);
  it("FORMULA_FAMILY_BY_BLUEPRINT_ID covers every registered executor (fixture-completeness self-check)", () => {
    expect(ids.sort()).toEqual(Object.keys(FORMULA_FAMILY_BY_BLUEPRINT_ID).sort());
  });

  for (const id of ids) {
    it(`${id}: identical identity -> identical instance`, () => {
      const formulaFamilyId = FORMULA_FAMILY_BY_BLUEPRINT_ID[id];
      const bp = blueprint({
        id,
        assertionFamilyId: "foundational.mechanics_work_energy_power",
        capabilityId: "cap.test",
        representation: formulaFamilyId ? { formula: { required: true, formulaFamilyId } } : {},
      });
      const a = generate(bp, 42);
      const b = generate(bp, 42);
      expect(a).toEqual(b);
    });
  }
});
