/**
 * CC-05B2: mechanically exercises @alp/calculation-engine against EVERY
 * governed question blueprint in the live CC-05A Unit 202 manifest (not
 * a family-filtered subset) -- the "implemented proving blueprint with
 * no execution path = 0" gate, expanded from CC-05B's original 36-
 * blueprint proving-slice gate to full current-corpus coverage. Follows
 * the exact same pattern scripts/content/validate-pedagogy.ts already
 * established for CC-05A's own coverage gate: never trust a claim,
 * recompute from the live package + content.
 *
 * This file is allowed to import both @alp/calculation-engine (the
 * engine) and scripts/content/data (the content) precisely because it is
 * content-authoring/proving tooling, not learner-runtime engine code --
 * the dependency only ever runs content -> engine here, never the
 * reverse (see scripts/content/README.md).
 *
 * Usage:
 *   node scripts/content/prove-cc05b-engine.ts            (print report)
 *   node scripts/content/prove-cc05b-engine.ts --check     (exit 1 on any gap)
 */

import {
  emitEvidence,
  evaluateAnswer,
  generateQuestionInstance,
  isBlueprintSupported,
  SUPPORTED_BLUEPRINT_IDS,
  type AnswerValue,
  type DeterministicIdentity,
  type GeneratedQuestionInstance,
} from "@alp/calculation-engine";
import { pedagogyManifestSchema, type QuestionBlueprint } from "@alp/content-schema";
import { fileURLToPath } from "node:url";
import { cc05aPedagogyUnit202 } from "./data/cc05a-pedagogy-unit202.ts";

export interface BlueprintProofResult {
  readonly blueprintId: string;
  readonly familyId: string;
  readonly supported: boolean;
  readonly generated: boolean;
  readonly serialisable: boolean;
  readonly correctAnswerGradesCorrect: boolean;
  readonly wrongAnswerGradesIncorrect: boolean;
  readonly deterministicAcrossRepeat: boolean;
  readonly representationContractOk: boolean;
  readonly evidenceContractOk: boolean;
  readonly error?: string;
}

export interface ProvingReport {
  readonly totalGovernedBlueprints: number;
  readonly supportedCount: number;
  readonly results: readonly BlueprintProofResult[];
  readonly unsupportedBlueprints: readonly string[];
  readonly generationFailures: readonly string[];
  readonly correctAnswerGradingFailures: readonly string[];
  readonly incorrectAnswerGradingFailures: readonly string[];
  readonly serialisationFailures: readonly string[];
  readonly determinismFailures: readonly string[];
  readonly representationContractFailures: readonly string[];
  readonly evidenceContractFailures: readonly string[];
}

/** A value guaranteed to differ from `expected` regardless of its shape, without knowing blueprint-specific semantics. */
function makeDeliberatelyWrongValue(expected: AnswerValue): AnswerValue {
  if (typeof expected === "number") return expected + 1_000_000;
  if (typeof expected === "string") return `${expected}__DELIBERATELY_WRONG__`;
  return [];
}

/**
 * Checks that a generated instance actually satisfies the blueprint's own
 * declared representation requirements: a required diagram must be
 * present and reference the exact blueprint id declared; a required
 * formula must be present and reference the exact formula family id
 * declared. Optional (`required: false`) representations are not
 * required to be present -- omitting them is not a failure.
 */
function checkRepresentationContract(blueprint: QuestionBlueprint, instance: GeneratedQuestionInstance): boolean {
  const rep = blueprint.representation;
  if (rep.diagram?.required) {
    if (!instance.representation.diagram) return false;
    if (rep.diagram.blueprintId && instance.representation.diagram.blueprintId !== rep.diagram.blueprintId) return false;
  }
  if (rep.formula?.required) {
    if (!instance.representation.formula) return false;
    if (rep.formula.formulaFamilyId && instance.representation.formula.formulaFamilyId !== rep.formula.formulaFamilyId) return false;
  }
  return true;
}

/** Checks the emitted evidence carries the blueprint's own governed family/capability/assertion identity through unchanged. */
function checkEvidenceContract(blueprint: QuestionBlueprint, instance: GeneratedQuestionInstance): boolean {
  const evaluation = evaluateAnswer(instance, instance.expected.value);
  const evidence = emitEvidence(instance, evaluation);
  return (
    evidence.assertionFamilyId === blueprint.assertionFamilyId &&
    evidence.capabilityId === blueprint.capabilityId &&
    evidence.questionBlueprintId === blueprint.id &&
    evidence.assertionIdentifiers.length === blueprint.evidence.assertionIdentifiers.length &&
    evidence.assertionIdentifiers.every((id, i) => id === blueprint.evidence.assertionIdentifiers[i])
  );
}

function proveBlueprint(blueprint: QuestionBlueprint, seed: number, contentRelease: string): BlueprintProofResult {
  const base = { blueprintId: blueprint.id, familyId: blueprint.assertionFamilyId };

  if (!isBlueprintSupported(blueprint.id)) {
    return {
      ...base,
      supported: false,
      generated: false,
      serialisable: false,
      correctAnswerGradesCorrect: false,
      wrongAnswerGradesIncorrect: false,
      deterministicAcrossRepeat: false,
      representationContractOk: false,
      evidenceContractOk: false,
    };
  }

  const identity: DeterministicIdentity = { blueprintId: blueprint.id, blueprintVersion: 1, contentRelease, seed };
  const generationInputs = {
    blueprint,
    formulaFamilies: cc05aPedagogyUnit202.formulaFamilies,
    diagramBlueprints: cc05aPedagogyUnit202.diagramBlueprints,
    workedExampleBlueprints: cc05aPedagogyUnit202.workedExampleBlueprints,
    identity,
  };

  try {
    const instance = generateQuestionInstance(generationInputs);

    const roundTripped: unknown = JSON.parse(JSON.stringify(instance));
    const serialisable =
      typeof roundTripped === "object" && roundTripped !== null && JSON.stringify(roundTripped) === JSON.stringify(instance);

    const correctEvaluation = evaluateAnswer(instance, instance.expected.value);
    const wrongEvaluation = evaluateAnswer(instance, makeDeliberatelyWrongValue(instance.expected.value));

    const repeat = generateQuestionInstance(generationInputs);

    return {
      ...base,
      supported: true,
      generated: true,
      serialisable,
      correctAnswerGradesCorrect: correctEvaluation.correct === true,
      wrongAnswerGradesIncorrect: wrongEvaluation.correct === false,
      deterministicAcrossRepeat: JSON.stringify(repeat) === JSON.stringify(instance),
      representationContractOk: checkRepresentationContract(blueprint, instance),
      evidenceContractOk: checkEvidenceContract(blueprint, instance),
    };
  } catch (error) {
    return {
      ...base,
      supported: true,
      generated: false,
      serialisable: false,
      correctAnswerGradesCorrect: false,
      wrongAnswerGradesIncorrect: false,
      deterministicAcrossRepeat: false,
      representationContractOk: false,
      evidenceContractOk: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export function buildProvingReport(seed = 424242, contentRelease = "2026.08.001-proving"): ProvingReport {
  const pedagogy = pedagogyManifestSchema.parse(cc05aPedagogyUnit202);
  const governedBlueprints = pedagogy.questionBlueprints;

  const results = governedBlueprints.map((blueprint) => proveBlueprint(blueprint, seed, contentRelease));

  const idsWhere = (predicate: (r: BlueprintProofResult) => boolean) => results.filter(predicate).map((r) => r.blueprintId);

  return {
    totalGovernedBlueprints: governedBlueprints.length,
    supportedCount: results.filter((r) => r.supported).length,
    results,
    unsupportedBlueprints: idsWhere((r) => !r.supported),
    generationFailures: idsWhere((r) => r.supported && !r.generated),
    correctAnswerGradingFailures: idsWhere((r) => r.supported && r.generated && !r.correctAnswerGradesCorrect),
    incorrectAnswerGradingFailures: idsWhere((r) => r.supported && r.generated && !r.wrongAnswerGradesIncorrect),
    serialisationFailures: idsWhere((r) => r.supported && r.generated && !r.serialisable),
    determinismFailures: idsWhere((r) => r.supported && r.generated && !r.deterministicAcrossRepeat),
    representationContractFailures: idsWhere((r) => r.supported && r.generated && !r.representationContractOk),
    evidenceContractFailures: idsWhere((r) => r.supported && r.generated && !r.evidenceContractOk),
  };
}

export function isProvingReportClean(report: ProvingReport): boolean {
  return (
    report.unsupportedBlueprints.length === 0 &&
    report.generationFailures.length === 0 &&
    report.correctAnswerGradingFailures.length === 0 &&
    report.incorrectAnswerGradingFailures.length === 0 &&
    report.serialisationFailures.length === 0 &&
    report.determinismFailures.length === 0 &&
    report.representationContractFailures.length === 0 &&
    report.evidenceContractFailures.length === 0
  );
}

function formatReport(report: ProvingReport): string {
  const lines: string[] = [];
  lines.push("CC-05B engine proving report -- FULL governed Unit 202 question-blueprint inventory");
  lines.push("========================================================================================");
  lines.push(`Total governed question blueprints: ${report.totalGovernedBlueprints}`);
  lines.push(`Engine-supported: ${report.supportedCount} (registry total: ${SUPPORTED_BLUEPRINT_IDS.length})`);
  lines.push(`Unsupported (target 0): ${report.unsupportedBlueprints.length}`);
  if (report.unsupportedBlueprints.length) lines.push(`  ${report.unsupportedBlueprints.join(", ")}`);
  lines.push(`Generation failures (target 0): ${report.generationFailures.length}`);
  if (report.generationFailures.length) lines.push(`  ${report.generationFailures.join(", ")}`);
  lines.push(`Correct-answer grading failures (target 0): ${report.correctAnswerGradingFailures.length}`);
  if (report.correctAnswerGradingFailures.length) lines.push(`  ${report.correctAnswerGradingFailures.join(", ")}`);
  lines.push(`Incorrect-answer grading failures where applicable (target 0): ${report.incorrectAnswerGradingFailures.length}`);
  if (report.incorrectAnswerGradingFailures.length) lines.push(`  ${report.incorrectAnswerGradingFailures.join(", ")}`);
  lines.push(`Serialisation failures (target 0): ${report.serialisationFailures.length}`);
  if (report.serialisationFailures.length) lines.push(`  ${report.serialisationFailures.join(", ")}`);
  lines.push(`Determinism failures (target 0): ${report.determinismFailures.length}`);
  if (report.determinismFailures.length) lines.push(`  ${report.determinismFailures.join(", ")}`);
  lines.push(`Representation-contract failures (target 0): ${report.representationContractFailures.length}`);
  if (report.representationContractFailures.length) lines.push(`  ${report.representationContractFailures.join(", ")}`);
  lines.push(`Evidence-contract failures (target 0): ${report.evidenceContractFailures.length}`);
  if (report.evidenceContractFailures.length) lines.push(`  ${report.evidenceContractFailures.join(", ")}`);
  lines.push("");
  const byFamily = new Map<string, { pass: number; total: number }>();
  for (const r of report.results) {
    const entry = byFamily.get(r.familyId) ?? { pass: 0, total: 0 };
    entry.total++;
    const pass =
      r.supported && r.generated && r.serialisable && r.correctAnswerGradesCorrect && r.wrongAnswerGradesIncorrect &&
      r.deterministicAcrossRepeat && r.representationContractOk && r.evidenceContractOk;
    if (pass) entry.pass++;
    byFamily.set(r.familyId, entry);
  }
  lines.push("By family:");
  for (const [family, { pass, total }] of [...byFamily.entries()].sort()) {
    lines.push(`  ${pass === total ? "PASS" : "FAIL"} ${family}: ${pass}/${total}`);
  }
  return lines.join("\n");
}

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return fileURLToPath(import.meta.url) === entryPoint;
}

if (isMainModule()) {
  const report = buildProvingReport();
  console.log(formatReport(report));
  const clean = isProvingReportClean(report);
  console.log("");
  console.log(clean ? "PASS: every governed question blueprint has a working execution path." : "FAIL: see above.");
  if (process.argv.includes("--check") && !clean) {
    process.exit(1);
  }
}
