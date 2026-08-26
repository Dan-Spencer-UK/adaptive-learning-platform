import { describe, expect, it } from "vitest";
import type { DiagramBlueprint, FormulaFamily, QuestionBlueprint } from "@alp/content-schema";
import { emitEvidence, evaluateAnswer, generateQuestionInstance, isBlueprintSupported, SUPPORTED_BLUEPRINT_IDS } from "./engine.ts";
import type { DeterministicIdentity } from "./seed.ts";
import { UnsupportedBlueprintError } from "./types.ts";

const OHMS_LAW_FORMULA_FAMILY: FormulaFamily = {
  id: "formula.ohms_law",
  assertionFamilyId: "electrical.ohms_law",
  canonicalTarget: "V",
  variables: [
    { symbol: "V", name: "voltage", quantity: "voltage", unitName: "volt", unitSymbol: "V" },
    { symbol: "I", name: "current", quantity: "current", unitName: "ampere", unitSymbol: "A" },
    { symbol: "R", name: "resistance", quantity: "resistance", unitName: "ohm", unitSymbol: "Ω" },
  ],
  forms: [
    { target: "V", expression: { operation: "multiply", operands: ["I", "R"] }, instruction: "", requiresWorkedExample: true },
    { target: "I", expression: { operation: "divide", numerator: "V", denominator: "R" }, instruction: "", requiresWorkedExample: true },
    { target: "R", expression: { operation: "divide", numerator: "V", denominator: "I" }, instruction: "", requiresWorkedExample: true },
  ],
  requiredTargets: ["V", "I", "R"],
};

const DIAGRAM_BLUEPRINTS: DiagramBlueprint[] = [];

function ohmsLawBlueprint(id: string): QuestionBlueprint {
  return {
    id,
    assertionFamilyId: "electrical.ohms_law",
    capabilityId: "cap.ohms_law.solve_for_voltage",
    title: id,
    representation: { formula: { required: true, formulaFamilyId: "formula.ohms_law" } },
    variantDimensions: {},
    parameterGenerators: [],
    answer: { type: "quantity", quantity: "voltage", canonicalUnit: "volt" },
    marking: { type: "numeric_tolerance", tolerancePercent: 1 },
    evidence: {
      primaryCapabilityId: "cap.ohms_law.solve_for_voltage",
      familyId: "electrical.ohms_law",
      assertionIdentifiers: ["EL-OHM-SOLVE-V-001"],
      supportingCapabilityIds: ["cap.ohms_law.apply_substitution"],
      representationDependency: [],
      misconceptionTargets: [],
    },
    difficultyBand: "introductory",
  };
}

function identityFor(blueprintId: string, seed = 1): DeterministicIdentity {
  return { blueprintId, blueprintVersion: 1, contentRelease: "2026.08.001", seed };
}

describe("isBlueprintSupported / SUPPORTED_BLUEPRINT_IDS", () => {
  it("recognises all 114 governed blueprint ids (CC-05B2: full Unit 202 coverage; CC-08 adds 2 for foundational.algebraic_technique; CC-09E adds 5 for electrical.ac_reactive_quantities/magnetism/emf_and_generation archetypes; CC-09E.1 adds 1 for magnetism.identify_flux_unit; CC-11 adds 11 for foundational.mass_weight/levers_mechanical_advantage/mechanics_work_energy_power and 6 for electrical.electronic_components; CC-11.1 adds 3 for magnetism.recognise_attraction_repulsion/magnetism.calculate_force_on_conductor/emf.calculate_motional_emf; CC-11.2 adds 1 for conductors.recognise_electron_theory; CC-12 adds 1 for magnetism.diagnose_current_convention)", () => {
    expect(SUPPORTED_BLUEPRINT_IDS.length).toBe(114);
    expect(isBlueprintSupported("ohms_law.solve_for_voltage")).toBe(true);
    expect(isBlueprintSupported("parallel.calculate_total")).toBe(true);
    expect(isBlueprintSupported("magnetism.interpret_force_direction")).toBe(true);
    expect(isBlueprintSupported("power.calculate_from_vi")).toBe(true);
    expect(isBlueprintSupported("waveform.calculate_rms_from_peak")).toBe(true);
  });

  it("does not claim support for a blueprint id outside the governed manifest", () => {
    expect(isBlueprintSupported("nonexistent_family.nonexistent_blueprint")).toBe(false);
  });
});

describe("generateQuestionInstance", () => {
  it("throws UnsupportedBlueprintError for a blueprint id with no registered executor", () => {
    const blueprint = ohmsLawBlueprint("nonexistent_family.nonexistent_blueprint");
    expect(() =>
      generateQuestionInstance({
        blueprint,
        formulaFamilies: [OHMS_LAW_FORMULA_FAMILY],
        diagramBlueprints: DIAGRAM_BLUEPRINTS,
        identity: identityFor("nonexistent_family.nonexistent_blueprint"),
      }),
    ).toThrow(UnsupportedBlueprintError);
  });

  it("is deterministic: identical identity tuples produce byte-for-byte identical instances", () => {
    const blueprint = ohmsLawBlueprint("ohms_law.solve_for_voltage");
    const identity = identityFor("ohms_law.solve_for_voltage", 555);
    const a = generateQuestionInstance({ blueprint, formulaFamilies: [OHMS_LAW_FORMULA_FAMILY], diagramBlueprints: DIAGRAM_BLUEPRINTS, identity });
    const b = generateQuestionInstance({ blueprint, formulaFamilies: [OHMS_LAW_FORMULA_FAMILY], diagramBlueprints: DIAGRAM_BLUEPRINTS, identity });
    expect(a).toEqual(b);
  });

  it("different seeds produce different (but each individually valid) instances", () => {
    const blueprint = ohmsLawBlueprint("ohms_law.solve_for_voltage");
    const results = Array.from({ length: 10 }, (_, seed) =>
      generateQuestionInstance({
        blueprint,
        formulaFamilies: [OHMS_LAW_FORMULA_FAMILY],
        diagramBlueprints: DIAGRAM_BLUEPRINTS,
        identity: identityFor("ohms_law.solve_for_voltage", seed),
      }),
    );
    const uniqueParameterSets = new Set(results.map((r) => JSON.stringify(r.parameters)));
    expect(uniqueParameterSets.size).toBeGreaterThan(1);
    for (const r of results) {
      expect(r.representation.formula?.result).toBe((r.parameters.I as number) * (r.parameters.R as number));
    }
  });

  it("survives a JSON.stringify/parse round trip with no semantic loss", () => {
    const blueprint = ohmsLawBlueprint("ohms_law.solve_for_voltage");
    const instance = generateQuestionInstance({
      blueprint,
      formulaFamilies: [OHMS_LAW_FORMULA_FAMILY],
      diagramBlueprints: DIAGRAM_BLUEPRINTS,
      identity: identityFor("ohms_law.solve_for_voltage", 9),
    });
    const roundTripped = JSON.parse(JSON.stringify(instance));
    expect(roundTripped).toEqual(instance);
  });
});

describe("evaluateAnswer / emitEvidence", () => {
  const blueprint = ohmsLawBlueprint("ohms_law.solve_for_voltage");
  const instance = generateQuestionInstance({
    blueprint,
    formulaFamilies: [OHMS_LAW_FORMULA_FAMILY],
    diagramBlueprints: DIAGRAM_BLUEPRINTS,
    identity: identityFor("ohms_law.solve_for_voltage", 42),
  });

  it("grades the exact expected value as correct", () => {
    const result = evaluateAnswer(instance, instance.expected.value);
    expect(result.correct).toBe(true);
  });

  it("grades a wildly wrong value as incorrect, with generic evidence strength when no misconception is declared", () => {
    const result = evaluateAnswer(instance, (instance.expected.value as number) + 999);
    expect(result.correct).toBe(false);
    expect(result.evidenceStrength).toBe("generic");
    expect(result.misconceptionIdentifier).toBeUndefined();
  });

  it("emitEvidence carries the blueprint identity, family/capability, assertions and correctness through", () => {
    const evaluation = evaluateAnswer(instance, instance.expected.value);
    const evidence = emitEvidence(instance, evaluation);
    expect(evidence.questionBlueprintId).toBe("ohms_law.solve_for_voltage");
    expect(evidence.assertionFamilyId).toBe("electrical.ohms_law");
    expect(evidence.capabilityId).toBe("cap.ohms_law.solve_for_voltage");
    expect(evidence.assertionIdentifiers).toEqual(["EL-OHM-SOLVE-V-001"]);
    expect(evidence.supportingCapabilityIds).toEqual(["cap.ohms_law.apply_substitution"]);
    expect(evidence.correct).toBe(true);
    expect(evidence.generatedInstanceIdentity).toEqual(identityFor("ohms_law.solve_for_voltage", 42));
  });

  it("attaches the blueprint-declared misconception when one is declared and the answer is wrong", () => {
    const diagnosticBlueprint: QuestionBlueprint = {
      ...blueprint,
      id: "ohms_law.diagnose_wrong_operation",
      answer: { type: "worked_error_classification" },
      marking: { type: "enum" },
      evidence: {
        ...blueprint.evidence,
        misconceptionTargets: [{ misconceptionIdentifier: "MIS-EL-OHM-WRONG-OPERATION-001", evidenceStrength: "direct" }],
      },
    };
    const diagnosticInstance = generateQuestionInstance({
      blueprint: diagnosticBlueprint,
      formulaFamilies: [OHMS_LAW_FORMULA_FAMILY],
      diagramBlueprints: DIAGRAM_BLUEPRINTS,
      identity: identityFor("ohms_law.diagnose_wrong_operation", 3),
    });
    const wrongAnswer = "__DEFINITELY_NOT_THE_EXPECTED_CLASSIFICATION__";
    const evaluation = evaluateAnswer(diagnosticInstance, wrongAnswer);
    expect(evaluation.correct).toBe(false);
    expect(evaluation.misconceptionIdentifier).toBe("MIS-EL-OHM-WRONG-OPERATION-001");
    expect(evaluation.evidenceStrength).toBe("direct");
  });
});
