import { describe, expect, it } from "vitest";
import type { DiagramBlueprint, FormulaFamily, QuestionBlueprint } from "@alp/content-schema";
import { generateQuestionInstance, evaluateAnswer } from "../engine.ts";
import type { DeterministicIdentity } from "../seed.ts";

/**
 * Self-contained fixtures mirroring CC-05A's real content exactly (see
 * scripts/content/data/cc05a-pedagogy-unit202.ts) -- this package's own
 * tests never import scripts/content/data (content -> engine only, never
 * the reverse; the full-manifest proof against the REAL content lives in
 * scripts/content/prove-cc05b-engine.test.ts).
 */

const RESISTIVITY_FORMULA: FormulaFamily = {
  id: "formula.resistivity",
  assertionFamilyId: "electrical.resistivity",
  canonicalTarget: "R",
  variables: [
    { symbol: "R", name: "resistance", quantity: "resistance", unitName: "ohm", unitSymbol: "Ω" },
    { symbol: "rho", name: "resistivity", quantity: "resistivity", unitName: "ohm-metre", unitSymbol: "Ω·m" },
    { symbol: "L", name: "conductor length", quantity: "length", unitName: "metre", unitSymbol: "m" },
    { symbol: "A", name: "cross-sectional area", quantity: "area", unitName: "square metre", unitSymbol: "m²" },
  ],
  forms: [
    {
      target: "R",
      expression: { operation: "divide", numerator: { operation: "multiply", operands: ["rho", "L"] }, denominator: "A" },
      instruction: "",
      requiresWorkedExample: true,
    },
  ],
  requiredTargets: ["R"],
};

const POWER_FORMULA: FormulaFamily = {
  id: "formula.electrical_power",
  assertionFamilyId: "electrical.power_relationships",
  canonicalTarget: "P",
  variables: [
    { symbol: "P", name: "power", quantity: "power", unitName: "watt", unitSymbol: "W" },
    { symbol: "V", name: "voltage", quantity: "voltage", unitName: "volt", unitSymbol: "V" },
    { symbol: "I", name: "current", quantity: "current", unitName: "ampere", unitSymbol: "A" },
    { symbol: "R", name: "resistance", quantity: "resistance", unitName: "ohm", unitSymbol: "Ω" },
  ],
  forms: [
    { target: "P", expression: { operation: "multiply", operands: ["V", "I"] }, instruction: "", requiresWorkedExample: true },
    { target: "V", expression: { operation: "divide", numerator: "P", denominator: "I" }, instruction: "", requiresWorkedExample: true },
    { target: "I", expression: { operation: "divide", numerator: "P", denominator: "V" }, instruction: "", requiresWorkedExample: true },
    {
      target: "P",
      expression: { operation: "multiply", operands: [{ operation: "square", operand: "I" }, "R"] },
      instruction: "",
      requiresWorkedExample: true,
    },
    {
      target: "P",
      expression: { operation: "divide", numerator: { operation: "square", operand: "V" }, denominator: "R" },
      instruction: "",
      requiresWorkedExample: true,
    },
  ],
  requiredTargets: ["P", "V", "I"],
};

const ENERGY_FORMULA: FormulaFamily = {
  id: "formula.electrical_energy",
  assertionFamilyId: "electrical.energy_and_efficiency",
  canonicalTarget: "E",
  variables: [
    { symbol: "E", name: "energy", quantity: "energy", unitName: "joule", unitSymbol: "J" },
    { symbol: "P", name: "power", quantity: "power", unitName: "watt", unitSymbol: "W" },
    { symbol: "t", name: "time", quantity: "time", unitName: "second", unitSymbol: "s" },
  ],
  forms: [
    { target: "E", expression: { operation: "multiply", operands: ["P", "t"] }, instruction: "", requiresWorkedExample: true },
    { target: "P", expression: { operation: "divide", numerator: "E", denominator: "t" }, instruction: "", requiresWorkedExample: true },
    { target: "t", expression: { operation: "divide", numerator: "E", denominator: "P" }, instruction: "", requiresWorkedExample: true },
  ],
  requiredTargets: ["E", "P", "t"],
};

const EFFICIENCY_FORMULA: FormulaFamily = {
  id: "formula.electrical_efficiency",
  assertionFamilyId: "electrical.energy_and_efficiency",
  canonicalTarget: "eta",
  variables: [
    { symbol: "eta", name: "efficiency", quantity: "efficiency", unitName: "percent", unitSymbol: "%" },
    { symbol: "Pout", name: "useful power output", quantity: "power", unitName: "watt", unitSymbol: "W" },
    { symbol: "Pin", name: "power input", quantity: "power", unitName: "watt", unitSymbol: "W" },
  ],
  forms: [
    {
      target: "eta",
      expression: { operation: "ratio_percentage", numerator: "Pout", denominator: "Pin" },
      instruction: "",
      requiresWorkedExample: true,
    },
  ],
  requiredTargets: ["eta"],
};

const CHARGE_FORMULA: FormulaFamily = {
  id: "formula.charge_current",
  assertionFamilyId: "electrical.charge_and_current",
  canonicalTarget: "I",
  variables: [
    { symbol: "I", name: "current", quantity: "current", unitName: "ampere", unitSymbol: "A" },
    { symbol: "Q", name: "charge", quantity: "charge", unitName: "coulomb", unitSymbol: "C" },
    { symbol: "t", name: "time", quantity: "time", unitName: "second", unitSymbol: "s" },
  ],
  forms: [
    { target: "I", expression: { operation: "divide", numerator: "Q", denominator: "t" }, instruction: "", requiresWorkedExample: true },
    { target: "Q", expression: { operation: "multiply", operands: ["I", "t"] }, instruction: "", requiresWorkedExample: true },
    { target: "t", expression: { operation: "divide", numerator: "Q", denominator: "I" }, instruction: "", requiresWorkedExample: false },
  ],
  requiredTargets: ["I", "Q"],
};

const WAVEFORM_FORMULA: FormulaFamily = {
  id: "formula.ac_waveform_relationships",
  assertionFamilyId: "electrical.ac_dc_waveforms",
  canonicalTarget: "rms",
  variables: [
    { symbol: "rms", name: "RMS value", quantity: "voltage_or_current", unitName: "volt or ampere", unitSymbol: "V/A" },
    { symbol: "peak", name: "peak value", quantity: "voltage_or_current", unitName: "volt or ampere", unitSymbol: "V/A" },
    { symbol: "f", name: "frequency", quantity: "frequency", unitName: "hertz", unitSymbol: "Hz" },
    { symbol: "T", name: "periodic time", quantity: "time", unitName: "second", unitSymbol: "s" },
  ],
  forms: [
    { target: "rms", expression: { operation: "divide", numerator: "peak", denominator: { operation: "sqrt", operand: 2 } }, instruction: "", requiresWorkedExample: true },
    { target: "peak", expression: { operation: "multiply", operands: ["rms", { operation: "sqrt", operand: 2 }] }, instruction: "", requiresWorkedExample: true },
    { target: "f", expression: { operation: "divide", numerator: 1, denominator: "T" }, instruction: "", requiresWorkedExample: true },
    { target: "T", expression: { operation: "divide", numerator: 1, denominator: "f" }, instruction: "", requiresWorkedExample: true },
  ],
  requiredTargets: ["rms", "peak", "f", "T"],
};

const MIXED_DIAGRAM: DiagramBlueprint = {
  id: "circuit.series_parallel_mixed",
  type: "electrical_circuit",
  renderer: "svg",
  parameters: [],
  accessibility: { semanticDescriptionRequired: true, colourOnlyEncodingProhibited: true, identifierLabelPattern: "R{index}" },
  valueEmbedding: "symbolic_only",
};

const CONNECTION_DIAGRAM: DiagramBlueprint = { ...MIXED_DIAGRAM, id: "instrument.measurement_connection", type: "instrument_connection" };
const WAVEFORM_DIAGRAM: DiagramBlueprint = { ...MIXED_DIAGRAM, id: "graph.waveform_sine", type: "waveform", valueEmbedding: "values_when_assessed" };

const ALL_FORMULA_FAMILIES = [RESISTIVITY_FORMULA, POWER_FORMULA, ENERGY_FORMULA, EFFICIENCY_FORMULA, CHARGE_FORMULA, WAVEFORM_FORMULA];
const ALL_DIAGRAM_BLUEPRINTS = [MIXED_DIAGRAM, CONNECTION_DIAGRAM, WAVEFORM_DIAGRAM];

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
      assertionIdentifiers: ["EL-TEST-001"],
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

/** Extracts a guaranteed numeric parameter value (test-only convenience; noUncheckedIndexedAccess makes Record access `| undefined`). */
function num(params: Record<string, number | string>, key: string): number {
  const value = params[key];
  if (typeof value !== "number") throw new Error(`expected numeric parameter "${key}", got ${JSON.stringify(value)}`);
  return value;
}

function generate(bp: QuestionBlueprint, seed: number) {
  return generateQuestionInstance({
    blueprint: bp,
    formulaFamilies: ALL_FORMULA_FAMILIES,
    diagramBlueprints: ALL_DIAGRAM_BLUEPRINTS,
    identity: identity(bp.id, seed),
  });
}

describe("resistivity.calculate_resistance", () => {
  const bp = blueprint({
    id: "resistivity.calculate_resistance",
    assertionFamilyId: "electrical.resistivity",
    capabilityId: "cap.resistivity.calculate",
    representation: { formula: { required: true, formulaFamilyId: "formula.resistivity" } },
  });

  it("computes R = (rho x L) / A via the real formula, matching a hand-computed value", () => {
    for (let seed = 0; seed < 20; seed++) {
      const instance = generate(bp, seed);
      const params = instance.parameters as Record<string, number>;
      const expected = (num(params, "rho") * num(params, "L")) / num(params, "A");
      expect(instance.expected.value).toBeCloseTo(expected, 5);
      expect(evaluateAnswer(instance, instance.expected.value).correct).toBe(true);
    }
  });
});

describe("power calculation blueprints", () => {
  it("calculate_from_vi: P = V x I", () => {
    const bp = blueprint({
      id: "power.calculate_from_vi",
      assertionFamilyId: "electrical.power_relationships",
      capabilityId: "cap.power.calculate_from_vi",
      representation: { formula: { required: true, formulaFamilyId: "formula.electrical_power" } },
    });
    for (let seed = 0; seed < 15; seed++) {
      const instance = generate(bp, seed);
      const params = instance.parameters as Record<string, number>;
      expect(instance.expected.value).toBeCloseTo(num(params, "V") * num(params, "I"), 5);
    }
  });

  it("calculate_from_ir: P = I^2 x R", () => {
    const bp = blueprint({
      id: "power.calculate_from_ir",
      assertionFamilyId: "electrical.power_relationships",
      capabilityId: "cap.power.calculate_from_ir",
      representation: { formula: { required: true, formulaFamilyId: "formula.electrical_power" } },
    });
    for (let seed = 0; seed < 15; seed++) {
      const instance = generate(bp, seed);
      const params = instance.parameters as Record<string, number>;
      const I = num(params, "I");
      expect(instance.expected.value).toBeCloseTo(I * I * num(params, "R"), 5);
    }
  });

  it("calculate_from_vr: P = V^2 / R", () => {
    const bp = blueprint({
      id: "power.calculate_from_vr",
      assertionFamilyId: "electrical.power_relationships",
      capabilityId: "cap.power.calculate_from_vr",
      representation: { formula: { required: true, formulaFamilyId: "formula.electrical_power" } },
    });
    for (let seed = 0; seed < 15; seed++) {
      const instance = generate(bp, seed);
      const params = instance.parameters as Record<string, number>;
      const V = num(params, "V");
      expect(instance.expected.value).toBeCloseTo((V * V) / num(params, "R"), 4);
    }
  });

  it("calculate_total: sum of individual component powers, via the generic evaluator's add", () => {
    const bp = blueprint({
      id: "power.calculate_total",
      assertionFamilyId: "electrical.power_relationships",
      capabilityId: "cap.power.calculate_total",
    });
    for (let seed = 0; seed < 15; seed++) {
      const instance = generate(bp, seed);
      const values = Object.values(instance.parameters as Record<string, number>);
      expect(instance.expected.value).toBeCloseTo(values.reduce((a, b) => a + b, 0), 5);
    }
  });
});

describe("energy_and_efficiency calculation blueprints", () => {
  it("calculate_energy: E = P x t", () => {
    const bp = blueprint({
      id: "energy.calculate_energy",
      assertionFamilyId: "electrical.energy_and_efficiency",
      capabilityId: "cap.energy.calculate_energy",
      representation: { formula: { required: true, formulaFamilyId: "formula.electrical_energy" } },
    });
    for (let seed = 0; seed < 15; seed++) {
      const instance = generate(bp, seed);
      const params = instance.parameters as Record<string, number>;
      expect(instance.expected.value).toBeCloseTo(num(params, "P") * num(params, "t"), 5);
    }
  });

  it("calculate_efficiency: eta = Pout/Pin x 100, and Pout is always < Pin (physically sensible, <100%)", () => {
    const bp = blueprint({
      id: "energy.calculate_efficiency",
      assertionFamilyId: "electrical.energy_and_efficiency",
      capabilityId: "cap.energy.calculate_efficiency",
      representation: { formula: { required: true, formulaFamilyId: "formula.electrical_efficiency" } },
    });
    for (let seed = 0; seed < 30; seed++) {
      const instance = generate(bp, seed);
      const params = instance.parameters as Record<string, number>;
      const Pout = num(params, "Pout");
      const Pin = num(params, "Pin");
      expect(Pout).toBeLessThan(Pin);
      const eta = instance.expected.value as number;
      expect(eta).toBeGreaterThan(0);
      expect(eta).toBeLessThan(100);
      expect(eta).toBeCloseTo((Pout / Pin) * 100, 5);
    }
  });
});

describe("charge.calculate", () => {
  const bp = blueprint({
    id: "charge.calculate",
    assertionFamilyId: "electrical.charge_and_current",
    capabilityId: "cap.charge.calculate",
    representation: { formula: { required: true, formulaFamilyId: "formula.charge_current" } },
    variantDimensions: { target_variable: { allowed: ["I", "Q"] } },
  });

  it("Q = I x t and I = Q / t are both internally consistent across many seeds", () => {
    for (let seed = 0; seed < 30; seed++) {
      const instance = generate(bp, seed);
      const params = instance.parameters as Record<string, number | string>;
      if (params.target_variable === "Q") {
        expect(instance.expected.value).toBeCloseTo((params.I as number) * (params.t as number), 5);
      } else {
        expect(instance.expected.value).toBeCloseTo((params.Q as number) / (params.t as number), 5);
      }
    }
  });
});

describe("waveform calculation blueprints", () => {
  it("calculate_rms_from_peak: rms = peak / sqrt(2), peak = rms x sqrt(2)", () => {
    const bp = blueprint({
      id: "waveform.calculate_rms_from_peak",
      assertionFamilyId: "electrical.ac_dc_waveforms",
      capabilityId: "cap.waveform.calculate_rms_peak",
      representation: { formula: { required: true, formulaFamilyId: "formula.ac_waveform_relationships" } },
      variantDimensions: { target_variable: { allowed: ["rms", "peak"] } },
    });
    for (let seed = 0; seed < 20; seed++) {
      const instance = generate(bp, seed);
      const params = instance.parameters as Record<string, number | string>;
      if (params.target_variable === "rms") {
        expect(instance.expected.value).toBeCloseTo((params.peak as number) / Math.SQRT2, 4);
      } else {
        expect(instance.expected.value).toBeCloseTo((params.rms as number) * Math.SQRT2, 4);
      }
    }
  });

  it("calculate_frequency_from_period: f = 1/T, T = 1/f", () => {
    const bp = blueprint({
      id: "waveform.calculate_frequency_from_period",
      assertionFamilyId: "electrical.ac_dc_waveforms",
      capabilityId: "cap.waveform.calculate_frequency_period",
      representation: { formula: { required: true, formulaFamilyId: "formula.ac_waveform_relationships" } },
      variantDimensions: { target_variable: { allowed: ["f", "T"] } },
    });
    for (let seed = 0; seed < 20; seed++) {
      const instance = generate(bp, seed);
      const params = instance.parameters as Record<string, number | string>;
      if (params.target_variable === "T") {
        expect(instance.expected.value).toBeCloseTo(1 / (params.f as number), 4);
      } else {
        expect(instance.expected.value).toBeCloseTo(1 / (params.T as number), 4);
      }
    }
  });

  it("identify_characteristic emits a required diagram instance", () => {
    const bp = blueprint({
      id: "waveform.identify_characteristic",
      assertionFamilyId: "electrical.ac_dc_waveforms",
      capabilityId: "cap.waveform.identify_characteristic",
      answer: { type: "multiple_choice", options: ["periodic_time", "amplitude", "peak_to_peak", "rms", "average_value"] },
      marking: { type: "exact" },
      representation: { diagram: { required: true, blueprintId: "graph.waveform_sine" } },
    });
    const instance = generate(bp, 1);
    expect(instance.representation.diagram?.blueprintId).toBe("graph.waveform_sine");
  });
});

describe("comparison.ts deterministic physics/maths constants", () => {
  it("compare_resistance always answers series_higher (mathematical certainty for >=2 positive resistors)", () => {
    const bp = blueprint({
      id: "comparison.compare_resistance",
      assertionFamilyId: "electrical.series_vs_parallel_comparison",
      capabilityId: "cap.comparison.compare_resistance",
      answer: { type: "multiple_choice", options: ["series_higher", "parallel_higher", "equal"] },
      marking: { type: "exact" },
    });
    for (let seed = 0; seed < 10; seed++) {
      expect(generate(bp, seed).expected.value).toBe("series_higher");
    }
  });

  it("compare_power_energy always answers parallel_higher (same supply voltage, lower R => higher power)", () => {
    const bp = blueprint({
      id: "comparison.compare_power_energy",
      assertionFamilyId: "electrical.series_vs_parallel_comparison",
      capabilityId: "cap.comparison.compare_power_energy",
      answer: { type: "multiple_choice", options: ["series_higher", "parallel_higher", "equal"] },
      marking: { type: "exact" },
    });
    for (let seed = 0; seed < 10; seed++) {
      expect(generate(bp, seed).expected.value).toBe("parallel_higher");
    }
  });

  it("identify_topology's dominant-topology mapping is internally consistent with the diagram's own branch_arrangement", () => {
    const bp = blueprint({
      id: "comparison.identify_topology",
      assertionFamilyId: "electrical.series_vs_parallel_comparison",
      capabilityId: "cap.comparison.identify_topology",
      answer: { type: "multiple_choice", options: ["series", "parallel"] },
      marking: { type: "exact" },
      representation: { diagram: { required: true, blueprintId: "circuit.series_parallel_mixed" } },
    });
    for (let seed = 0; seed < 20; seed++) {
      const instance = generate(bp, seed);
      const arrangement = instance.parameters.branch_arrangement;
      const expected = arrangement === "series_of_parallel" ? "series" : "parallel";
      expect(instance.expected.value).toBe(expected);
    }
  });
});

describe("instrumentation.ts governed connection/internal-resistance rules", () => {
  it("recognise_connection: voltmeter -> parallel, ammeter -> series, always", () => {
    const bp = blueprint({
      id: "instrumentation.recognise_connection",
      assertionFamilyId: "electrical.instrumentation",
      capabilityId: "cap.instrumentation.recognise_connection",
      answer: { type: "multiple_choice", options: ["series", "parallel"] },
      marking: { type: "exact" },
      representation: { diagram: { required: true, blueprintId: "instrument.measurement_connection" } },
    });
    for (let seed = 0; seed < 20; seed++) {
      const instance = generate(bp, seed);
      const expected = instance.parameters.instrument_type === "voltmeter" ? "parallel" : "series";
      expect(instance.expected.value).toBe(expected);
      expect(instance.representation.diagram?.blueprintId).toBe("instrument.measurement_connection");
    }
  });

  it("recognise_internal_resistance_property: voltmeter -> very_high, ammeter -> very_low, always", () => {
    const bp = blueprint({
      id: "instrumentation.recognise_internal_resistance_property",
      assertionFamilyId: "electrical.instrumentation",
      capabilityId: "cap.instrumentation.recognise_internal_resistance_property",
      answer: { type: "multiple_choice", options: ["very_high", "very_low"] },
      marking: { type: "exact" },
    });
    for (let seed = 0; seed < 20; seed++) {
      const instance = generate(bp, seed);
      const expected = instance.parameters.instrument_type === "voltmeter" ? "very_high" : "very_low";
      expect(instance.expected.value).toBe(expected);
    }
  });
});
