/**
 * CC-05B: proves the deterministic calculation/question engine
 * (@alp/calculation-engine) actually resolves and executes real
 * generation/marking/evidence logic from inside the Expo/React Native
 * application -- not merely that it compiles under `tsc` or passes under
 * Node/Vitest (docs/architecture/MOBILE-ARCHITECTURE.md §8's tier
 * distinction, the same one CC-04N's shared-packages.ts proof already
 * established for the packageId-only proof).
 *
 * This file deliberately does NOT import scripts/content/data (the real
 * CC-05A governed corpus) -- apps/mobile only ever depends on published
 * @alp/* packages, never on content-authoring tooling. Instead it defines
 * a small, self-contained synthetic Ohm's-law-shaped fixture (mirroring
 * the real formula.ohms_law structure exactly) sufficient to exercise
 * every stage of the real engine: structured formula evaluation,
 * deterministic seeded generation, answer marking, and evidence
 * emission. No CC-05 learner content or UI is added by this file.
 */
import {
  emitEvidence,
  evaluateAnswer,
  generateQuestionInstance,
  type DeterministicIdentity,
} from "@alp/calculation-engine";
import type { DiagramBlueprint, FormulaFamily, QuestionBlueprint } from "@alp/content-schema";

export type EngineProofResult = {
  readonly step: string;
  readonly pass: boolean;
  readonly detail: string;
};

const FIXTURE_FORMULA_FAMILY: FormulaFamily = {
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

const FIXTURE_DIAGRAM_BLUEPRINTS: readonly DiagramBlueprint[] = [];

const FIXTURE_BLUEPRINT: QuestionBlueprint = {
  id: "ohms_law.solve_for_voltage",
  assertionFamilyId: "electrical.ohms_law",
  capabilityId: "cap.ohms_law.solve_for_voltage",
  title: "dev-proof: solve for voltage given current and resistance",
  representation: { formula: { required: true, formulaFamilyId: "formula.ohms_law" } },
  variantDimensions: {},
  parameterGenerators: [],
  answer: { type: "quantity", quantity: "voltage", canonicalUnit: "volt" },
  marking: { type: "numeric_tolerance", tolerancePercent: 1 },
  evidence: {
    primaryCapabilityId: "cap.ohms_law.solve_for_voltage",
    familyId: "electrical.ohms_law",
    assertionIdentifiers: ["EL-OHM-SOLVE-V-001"],
    supportingCapabilityIds: [],
    representationDependency: [],
    misconceptionTargets: [],
  },
  difficultyBand: "introductory",
};

const FIXTURE_IDENTITY: DeterministicIdentity = {
  blueprintId: "ohms_law.solve_for_voltage",
  blueprintVersion: 1,
  contentRelease: "dev-proof",
  seed: 7,
};

/**
 * Runs the full engine pipeline (generate -> evaluate -> emit evidence)
 * plus a determinism re-generation and a JSON round trip, and returns a
 * structured, individually inspectable result per step. Pure function:
 * no I/O, safe to call from a Jest test or a dev-only diagnostics screen.
 */
export function runEngineProof(): readonly EngineProofResult[] {
  const results: EngineProofResult[] = [];

  const instance = generateQuestionInstance({
    blueprint: FIXTURE_BLUEPRINT,
    formulaFamilies: [FIXTURE_FORMULA_FAMILY],
    diagramBlueprints: FIXTURE_DIAGRAM_BLUEPRINTS,
    identity: FIXTURE_IDENTITY,
  });
  const generatedCorrectly =
    typeof instance.representation.formula?.result === "number" &&
    instance.representation.formula.result === (instance.parameters.I as number) * (instance.parameters.R as number);
  results.push({
    step: "generateQuestionInstance",
    pass: generatedCorrectly,
    detail: generatedCorrectly
      ? `generated V=${instance.representation.formula?.result} from I=${instance.parameters.I}, R=${instance.parameters.R}`
      : `unexpected instance shape: ${JSON.stringify(instance)}`,
  });

  const repeat = generateQuestionInstance({
    blueprint: FIXTURE_BLUEPRINT,
    formulaFamilies: [FIXTURE_FORMULA_FAMILY],
    diagramBlueprints: FIXTURE_DIAGRAM_BLUEPRINTS,
    identity: FIXTURE_IDENTITY,
  });
  const deterministic = JSON.stringify(repeat) === JSON.stringify(instance);
  results.push({
    step: "determinism (same identity regenerated)",
    pass: deterministic,
    detail: deterministic ? "identical instance reproduced from the same identity tuple" : "regeneration diverged",
  });

  const correctEvaluation = evaluateAnswer(instance, instance.expected.value);
  results.push({
    step: "evaluateAnswer (correct)",
    pass: correctEvaluation.correct === true,
    detail: correctEvaluation.detail,
  });

  const wrongEvaluation = evaluateAnswer(instance, (instance.expected.value as number) + 1000);
  results.push({
    step: "evaluateAnswer (incorrect)",
    pass: wrongEvaluation.correct === false,
    detail: wrongEvaluation.detail,
  });

  const evidence = emitEvidence(instance, correctEvaluation);
  const evidenceOk =
    evidence.questionBlueprintId === FIXTURE_BLUEPRINT.id &&
    evidence.assertionFamilyId === "electrical.ohms_law" &&
    evidence.correct === true;
  results.push({
    step: "emitEvidence",
    pass: evidenceOk,
    detail: evidenceOk ? `evidence emitted for ${evidence.questionBlueprintId}` : `unexpected evidence: ${JSON.stringify(evidence)}`,
  });

  let serialisable = false;
  try {
    const roundTripped: unknown = JSON.parse(JSON.stringify(instance));
    serialisable = JSON.stringify(roundTripped) === JSON.stringify(instance);
  } catch {
    serialisable = false;
  }
  results.push({
    step: "JSON serialisability",
    pass: serialisable,
    detail: serialisable ? "instance survives JSON.stringify/parse with no semantic loss" : "serialisation round trip failed",
  });

  return results;
}
