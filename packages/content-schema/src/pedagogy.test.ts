import { describe, expect, it } from "vitest";
import { pedagogyManifestSchema, type PedagogyManifest } from "./pedagogy.ts";

function minimalValidManifest(): PedagogyManifest {
  return {
    assertionFamilies: [
      {
        id: "family.ohms_law",
        title: "Ohm's Law",
        learningIntent: "Understand and apply the relationship between voltage, current and resistance.",
        teachFamilyTogether: true,
        completeness: { requiredCapabilityIds: ["cap.ohms_law.solve_for_voltage"] },
        assessmentRequirement: "assessable",
      },
    ],
    assertionFamilyMemberships: [
      {
        familyId: "family.ohms_law",
        assertionIdentifier: "EL-OHM-RELATIONSHIP-001",
        role: "canonical_form",
      },
    ],
    standaloneAssertions: [
      { assertionIdentifier: "EL-UNIT-OHM-001", reason: "Standalone SI-unit fact, not part of a taught relationship." },
    ],
    capabilities: [
      {
        id: "cap.ohms_law.solve_for_voltage",
        familyId: "family.ohms_law",
        operationType: "calculate",
        description: "Calculate voltage from known current and resistance.",
      },
    ],
    familyTeachingRepresentations: [
      {
        familyId: "family.ohms_law",
        representationType: "display_formula",
        requirement: "required",
      },
    ],
    formulaFamilies: [
      {
        id: "formula.ohms_law",
        assertionFamilyId: "family.ohms_law",
        canonicalTarget: "V",
        variables: [
          { symbol: "V", name: "voltage", quantity: "voltage", unitName: "volt", unitSymbol: "V" },
          { symbol: "I", name: "current", quantity: "current", unitName: "ampere", unitSymbol: "A" },
          { symbol: "R", name: "resistance", quantity: "resistance", unitName: "ohm", unitSymbol: "Ω" },
        ],
        forms: [
          {
            target: "V",
            expression: { operation: "multiply", operands: ["I", "R"] },
            instruction: "To find voltage, multiply current by resistance.",
            requiresWorkedExample: true,
          },
          {
            target: "I",
            expression: { operation: "divide", numerator: "V", denominator: "R" },
            instruction: "To find current, divide voltage by resistance.",
            requiresWorkedExample: true,
          },
          {
            target: "R",
            expression: { operation: "divide", numerator: "V", denominator: "I" },
            instruction: "To find resistance, divide voltage by current.",
            requiresWorkedExample: true,
          },
        ],
        requiredTargets: ["V", "I", "R"],
      },
    ],
    workedExampleBlueprints: [
      {
        id: "worked.ohms_law.solve_voltage",
        formulaFamilyId: "formula.ohms_law",
        target: "V",
        knownVariables: ["I", "R"],
        steps: ["show_formula", "substitute_values", "calculate", "show_answer_with_unit"],
      },
    ],
    visualAidBlueprints: [],
    diagramBlueprints: [],
    questionBlueprints: [
      {
        id: "ohms_law.solve_for_voltage",
        assertionFamilyId: "family.ohms_law",
        capabilityId: "cap.ohms_law.solve_for_voltage",
        title: "Solve for voltage given current and resistance",
        representation: {},
        variantDimensions: {},
        parameterGenerators: [],
        answer: { type: "quantity", quantity: "voltage", canonicalUnit: "volt" },
        marking: { type: "numeric_tolerance", tolerancePercent: 1 },
        evidence: {
          primaryCapabilityId: "cap.ohms_law.solve_for_voltage",
          familyId: "family.ohms_law",
          assertionIdentifiers: ["EL-OHM-SOLVE-V-001"],
          supportingCapabilityIds: [],
          representationDependency: [],
          misconceptionTargets: [],
        },
        difficultyBand: "introductory",
      },
    ],
  };
}

describe("pedagogyManifestSchema", () => {
  it("accepts a minimal, internally-consistent manifest", () => {
    const result = pedagogyManifestSchema.safeParse(minimalValidManifest());
    expect(result.success).toBe(true);
  });

  it("rejects a membership referencing an unknown family", () => {
    const manifest = minimalValidManifest();
    manifest.assertionFamilyMemberships[0]!.familyId = "family.does_not_exist";
    const result = pedagogyManifestSchema.safeParse(manifest);
    expect(result.success).toBe(false);
  });

  it("rejects an assertion classified as both family member and standalone", () => {
    const manifest = minimalValidManifest();
    manifest.standaloneAssertions.push({
      assertionIdentifier: "EL-OHM-RELATIONSHIP-001",
      reason: "conflicting classification",
    });
    const result = pedagogyManifestSchema.safeParse(manifest);
    expect(result.success).toBe(false);
  });

  it("rejects a formula family whose canonicalTarget is not a defined variable", () => {
    const manifest = minimalValidManifest();
    manifest.formulaFamilies[0]!.canonicalTarget = "Z";
    const result = pedagogyManifestSchema.safeParse(manifest);
    expect(result.success).toBe(false);
  });

  it("rejects a formula family missing a form for a required teaching target", () => {
    const manifest = minimalValidManifest();
    manifest.formulaFamilies[0]!.requiredTargets = ["V", "I", "R", "P"];
    const result = pedagogyManifestSchema.safeParse(manifest);
    expect(result.success).toBe(false);
  });

  it("rejects a formula expression referencing an undefined variable", () => {
    const manifest = minimalValidManifest();
    manifest.formulaFamilies[0]!.forms[0]!.expression = {
      operation: "multiply",
      operands: ["I", "UNDEFINED"],
    };
    const result = pedagogyManifestSchema.safeParse(manifest);
    expect(result.success).toBe(false);
  });

  it("rejects a worked example targeting a variable its formula family has no form for", () => {
    const manifest = minimalValidManifest();
    manifest.workedExampleBlueprints[0]!.target = "P";
    const result = pedagogyManifestSchema.safeParse(manifest);
    expect(result.success).toBe(false);
  });

  it("rejects a question blueprint requiring a diagram but naming no blueprint id", () => {
    const manifest = minimalValidManifest();
    manifest.questionBlueprints[0]!.representation = { diagram: { required: true } };
    const result = pedagogyManifestSchema.safeParse(manifest);
    expect(result.success).toBe(false);
  });

  it("rejects a question blueprint referencing an unknown diagram blueprint", () => {
    const manifest = minimalValidManifest();
    manifest.questionBlueprints[0]!.representation = {
      diagram: { required: true, blueprintId: "diagram.does_not_exist" },
    };
    const result = pedagogyManifestSchema.safeParse(manifest);
    expect(result.success).toBe(false);
  });

  it("accepts a question blueprint whose required diagram blueprint is defined", () => {
    const manifest = minimalValidManifest();
    manifest.diagramBlueprints.push({
      id: "circuit.example",
      type: "electrical_circuit",
      renderer: "svg",
      parameters: [],
      accessibility: {
        semanticDescriptionRequired: true,
        colourOnlyEncodingProhibited: true,
        identifierLabelPattern: "R{index}",
      },
      valueEmbedding: "symbolic_only",
    });
    manifest.questionBlueprints[0]!.representation = {
      diagram: { required: true, blueprintId: "circuit.example" },
    };
    const result = pedagogyManifestSchema.safeParse(manifest);
    expect(result.success).toBe(true);
  });

  it("rejects a question blueprint whose evidence.familyId does not match its own family", () => {
    const manifest = minimalValidManifest();
    manifest.questionBlueprints[0]!.evidence.familyId = "family.does_not_exist";
    const result = pedagogyManifestSchema.safeParse(manifest);
    expect(result.success).toBe(false);
  });

  it("rejects duplicate assertion family ids", () => {
    const manifest = minimalValidManifest();
    manifest.assertionFamilies.push({ ...manifest.assertionFamilies[0]! });
    const result = pedagogyManifestSchema.safeParse(manifest);
    expect(result.success).toBe(false);
  });

  it("rejects a family completeness rule referencing an unknown capability", () => {
    const manifest = minimalValidManifest();
    manifest.assertionFamilies[0]!.completeness.requiredCapabilityIds.push("cap.does_not_exist");
    const result = pedagogyManifestSchema.safeParse(manifest);
    expect(result.success).toBe(false);
  });

  it("rejects a mnemonic visual aid referencing an unknown formula family", () => {
    const manifest = minimalValidManifest();
    manifest.visualAidBlueprints.push({
      id: "mnemonic.vir_triangle",
      type: "mnemonic",
      formulaFamilyId: "formula.does_not_exist",
      renderer: "svg",
      regions: { top: "V", bottom_left: "I", bottom_right: "R" },
      accessibleDescription: "A triangle divided into three regions labelled V, I and R.",
    });
    const result = pedagogyManifestSchema.safeParse(manifest);
    expect(result.success).toBe(false);
  });
});
