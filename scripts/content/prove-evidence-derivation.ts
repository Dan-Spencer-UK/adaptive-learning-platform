/**
 * Proves @alp/evidence-engine's deterministic mastery derivation against
 * the REAL governed Ohm's Law content (CC-07 task brief §32) and proves
 * the misconception-safety contract mechanically (§33).
 *
 * The full real chain exercised here is the production one:
 *
 *   real governed blueprint (+ release identity)
 *     -> @alp/calculation-engine generateQuestionInstance (real question)
 *     -> real evaluateAnswer on a submitted value
 *     -> LearnerAttemptRecord (what the mobile outbox durably records)
 *     -> @alp/evidence-engine deriveLearnerState
 *     -> toLearnerEvidenceSnapshot
 *     -> @alp/learning-engine assembleLessonInstance (real lesson assembly)
 *
 * REAL vs SYNTHETIC: all scenarios run against the real governed lesson/
 * blueprints/families and the real calculation engine. The attempt
 * HISTORIES are necessarily synthesized (no real learners exist yet) --
 * each scenario states exactly what history it fabricates. The PERF
 * scenario is labelled synthetic because its volume (not its content) is
 * fabricated. No real cross-lesson remediation evidence is claimed: the
 * foundational remediation lesson does not exist yet (see
 * REAL_CONTENT_GAPS).
 *
 * Usage:
 *   node scripts/content/prove-evidence-derivation.ts          (print report)
 *   node scripts/content/prove-evidence-derivation.ts --check  (exit 1 on any failure)
 */

import { fileURLToPath } from "node:url";

import {
  evaluateAnswer,
  fnv1a32,
  generateQuestionInstance,
  type AnswerValue,
  type DeterministicIdentity,
  type GeneratedQuestionInstance,
} from "@alp/calculation-engine";
import {
  deriveLearnerState,
  toLearnerEvidenceSnapshot,
  MASTERY_POLICY_VERSION,
  type EvidenceContentContext,
  type LearnerAttemptRecord,
} from "@alp/evidence-engine";
import { ASSEMBLY_POLICY_VERSION, assembleLessonInstance, type AssemblyContext } from "@alp/learning-engine";
import { pedagogyManifestSchema, type QuestionBlueprint } from "@alp/content-schema";

import { cc05aPedagogyUnit202 } from "./data/cc05a-pedagogy-unit202.ts";
import { contentReleases, RELEASE_UNIT202_V1 } from "./data/content-releases.ts";
import { LESSON_OHMS_LAW, lessons as realLessons } from "./data/lesson-ohms-law.ts";

export interface ScenarioResult {
  readonly scenarioId: string;
  readonly label: string;
  readonly contentSource: "real" | "synthetic";
  readonly passed: boolean;
  readonly detail: string;
}

export interface EvidenceDerivationProvingReport {
  readonly scenarios: readonly ScenarioResult[];
  readonly realContentGaps: readonly string[];
}

export const REAL_CONTENT_GAPS = [
  "No governed foundational remediation lesson exists yet, so no real CROSS-LESSON remediation/retest/transfer evidence chain can be proven -- the mini-unit owns that. Within-lesson evidence interpretation is proven for real below.",
  "The real Ohm's Law lesson visits each graded step once per session, so multi-independent-success states (PROVISIONALLY_SECURE / TRANSFER_SECURE) require synthesized multi-session histories over the real content -- honest, but not yet observed from a real learner.",
  "No real numeric wrong-value analysis (predicted wrong-operation values etc.) is implemented: an arbitrary wrong numeric answer stays generic incorrect evidence by design (task brief §7.3 -- false negatives preferred over false diagnosis).",
];

const LEARNER = "learner.proving";
const INSTANCE = "li1_proving_instance";
const pedagogy = pedagogyManifestSchema.parse(cc05aPedagogyUnit202);
const release = contentReleases.releases.find((r) => r.id === RELEASE_UNIT202_V1)!;

const CONTENT: EvidenceContentContext = {
  lessons: realLessons,
  questionBlueprints: pedagogy.questionBlueprints,
  assertionFamilies: pedagogy.assertionFamilies.map((f) => ({
    id: f.id,
    requiredCapabilityIds: f.completeness.requiredCapabilityIds,
  })),
};

function blueprintFor(stepId: string): QuestionBlueprint {
  const step = LESSON_OHMS_LAW.steps.find((s) => s.id === stepId);
  if (!step?.questionBlueprintId) throw new Error(`real lesson step '${stepId}' has no question blueprint`);
  const blueprint = pedagogy.questionBlueprints.find((b) => b.id === step.questionBlueprintId);
  if (!blueprint) throw new Error(`blueprint '${step.questionBlueprintId}' not in governed pedagogy corpus`);
  return blueprint;
}

/** Generates the REAL deterministic question the player would show for this step (same seed derivation as apps/mobile's generate-lesson-question.ts). */
function realQuestion(stepId: string, sessionSalt = ""): GeneratedQuestionInstance {
  const blueprint = blueprintFor(stepId);
  const identity: DeterministicIdentity = {
    blueprintId: blueprint.id,
    blueprintVersion: release.questionBlueprintVersion,
    contentRelease: RELEASE_UNIT202_V1,
    seed: fnv1a32(`${INSTANCE}${sessionSalt}::${stepId}`),
  };
  return generateQuestionInstance({
    blueprint,
    formulaFamilies: pedagogy.formulaFamilies,
    diagramBlueprints: pedagogy.diagramBlueprints,
    workedExampleBlueprints: pedagogy.workedExampleBlueprints,
    identity,
  });
}

let clock = 0;

function submit(args: {
  readonly stepId: string;
  readonly given: AnswerValue;
  readonly sessionKey: string;
  readonly attemptIndex?: number;
  readonly answerRevealedBeforeAttempt?: boolean;
}): { attempt: LearnerAttemptRecord; evaluation: ReturnType<typeof evaluateAnswer> } {
  clock += 1;
  const question = realQuestion(args.stepId, args.sessionKey);
  const evaluation = evaluateAnswer(question, args.given);
  const attempt: LearnerAttemptRecord = {
    learnerId: LEARNER,
    instanceId: INSTANCE,
    sessionKey: args.sessionKey,
    lessonId: LESSON_OHMS_LAW.id,
    lessonVersion: LESSON_OHMS_LAW.version,
    contentRelease: RELEASE_UNIT202_V1,
    stepId: args.stepId,
    attemptIndex: args.attemptIndex ?? 1,
    answerRevealedBeforeAttempt: args.answerRevealedBeforeAttempt ?? false,
    questionBlueprintId: question.identity.blueprintId,
    correct: evaluation.correct,
    recordedAt: `2026-08-20T12:${String(Math.floor(clock / 60)).padStart(2, "0")}:${String(clock % 60).padStart(2, "0")}Z`,
  };
  return { attempt, evaluation };
}

function correctAnswer(stepId: string, sessionKey: string): AnswerValue {
  return realQuestion(stepId, sessionKey).expected.value;
}

function wrongNumeric(stepId: string, sessionKey: string): number {
  const expected = realQuestion(stepId, sessionKey).expected.value;
  if (typeof expected !== "number") throw new Error(`step '${stepId}' is not numeric`);
  // An ARBITRARY wrong value: deliberately not a predicted misconception
  // value (not the wrong-operation result, not a factor error) -- the
  // §33 contract is that this proves nothing about any named misconception.
  return expected + Math.max(1, Math.abs(expected)) * 0.5 + 7;
}

function wrongClassification(stepId: string, sessionKey: string): string {
  const question = realQuestion(stepId, sessionKey);
  const options = blueprintFor(stepId).answer.options ?? ["wrong_operation", "rearrangement_error", "unrelated_symbols", "no_error"];
  const wrong = options.find((o) => o !== question.expected.value);
  if (!wrong) throw new Error(`no wrong option available for '${stepId}'`);
  return wrong;
}

function derive(attempts: readonly LearnerAttemptRecord[]) {
  return deriveLearnerState({ learnerId: LEARNER, attempts, content: CONTENT });
}

function ok(scenarioId: string, label: string, contentSource: "real" | "synthetic", passed: boolean, detail: string): ScenarioResult {
  return { scenarioId, label, contentSource, passed, detail };
}

// ---------------------------------------------------------------------
// NEW -- new learner, no evidence (task brief §32)
// ---------------------------------------------------------------------
function scenarioNew(): ScenarioResult {
  const derived = derive([]);
  const snapshot = toLearnerEvidenceSnapshot(derived);
  const context: AssemblyContext = { assemblyPolicyVersion: ASSEMBLY_POLICY_VERSION, allLessons: realLessons };
  const assembly = assembleLessonInstance(LESSON_OHMS_LAW, snapshot, context);
  const passed =
    derived.capabilities.length === 0 &&
    derived.families.length === 0 &&
    derived.misconceptions.length === 0 &&
    derived.masteryPolicyVersion === MASTERY_POLICY_VERSION &&
    assembly.status === "ready";
  return ok(
    "NEW",
    "New learner: zero attempts derive an empty (NOT_ASSESSED) state whose snapshot still assembles the real lesson",
    "real",
    passed,
    `capabilities=${derived.capabilities.length}, families=${derived.families.length}, assembly=${assembly.status}`,
  );
}

// ---------------------------------------------------------------------
// ONE -- one independent correct real Ohm answer
// ---------------------------------------------------------------------
function scenarioOne(): ScenarioResult {
  const { attempt } = submit({ stepId: "independent_question_resistance", given: correctAnswer("independent_question_resistance", "s1"), sessionKey: "s1" });
  const derived = derive([attempt]);
  const cap = derived.capabilities.find((c) => c.capabilityId === "cap.ohms_law.solve_for_resistance");
  const family = derived.families.find((f) => f.assertionFamilyId === "electrical.ohms_law");
  const passed = attempt.correct && cap?.state === "EMERGING" && family?.state === "EMERGING";
  return ok(
    "ONE",
    "One independent correct real Ohm answer: EMERGING (one correct answer is never mastery), family EMERGING",
    "real",
    passed,
    `cap.ohms_law.solve_for_resistance=${cap?.state}, electrical.ohms_law=${family?.state}`,
  );
}

// ---------------------------------------------------------------------
// REPEAT -- repeated legitimate correct evidence (two session occurrences)
// ---------------------------------------------------------------------
function scenarioRepeat(): ScenarioResult {
  const a = submit({ stepId: "independent_question_resistance", given: correctAnswer("independent_question_resistance", "s1"), sessionKey: "s1" }).attempt;
  const b = submit({ stepId: "independent_question_resistance", given: correctAnswer("independent_question_resistance", "s2"), sessionKey: "s2" }).attempt;
  const derived = derive([a, b]);
  const cap = derived.capabilities.find((c) => c.capabilityId === "cap.ohms_law.solve_for_resistance");
  const family = derived.families.find((f) => f.assertionFamilyId === "electrical.ohms_law");
  const passed = cap?.state === "PROVISIONALLY_SECURE" && family?.state === "EMERGING";
  return ok(
    "REPEAT",
    "Repeated independent success across two sessions: PROVISIONALLY_SECURE; the family stays EMERGING (other required capabilities unassessed -- no false family confidence)",
    "real",
    passed,
    `capability=${cap?.state}, family=${family?.state} via ${family?.ruleApplied}`,
  );
}

// ---------------------------------------------------------------------
// RETRY -- wrong then legitimate retry on the real guided step
// ---------------------------------------------------------------------
function scenarioRetry(): ScenarioResult {
  const wrong = submit({ stepId: "guided_calculation_current", given: wrongNumeric("guided_calculation_current", "s1"), sessionKey: "s1" }).attempt;
  const right = submit({ stepId: "guided_calculation_current", given: correctAnswer("guided_calculation_current", "s1"), sessionKey: "s1", attemptIndex: 2 }).attempt;
  const derived = derive([wrong, right]);
  const cap = derived.capabilities.find((c) => c.capabilityId === "cap.ohms_law.solve_for_current");
  const passed =
    !wrong.correct &&
    right.correct &&
    cap?.state === "INSUFFICIENT_EVIDENCE" &&
    cap.counts.retrySuccesses === 1 &&
    cap.counts.meaningfulFailures === 0 &&
    cap.counts.independentSuccesses === 0;
  return ok(
    "RETRY",
    "Wrong then un-revealed retry on the real guided step: one recovered visit (retry success), no meaningful failure, no independent success -- honest, weaker evidence",
    "real",
    passed,
    `state=${cap?.state}, counts=${JSON.stringify(cap?.counts)}`,
  );
}

// ---------------------------------------------------------------------
// MIS-A / MIS-B / MIS-C -- misconception safety proof (task brief §33)
// ---------------------------------------------------------------------
function scenarioMisconceptionSafety(): ScenarioResult[] {
  // A: arbitrary wrong numeric value on a real numeric Ohm question.
  const wrongNumericSubmission = submit({ stepId: "independent_question_resistance", given: wrongNumeric("independent_question_resistance", "s1"), sessionKey: "s1" });
  const derivedA = derive([wrongNumericSubmission.attempt]);
  const capA = derivedA.capabilities.find((c) => c.capabilityId === "cap.ohms_law.solve_for_resistance");
  const aPassed =
    !wrongNumericSubmission.evaluation.correct &&
    derivedA.misconceptions.length === 0 &&
    capA?.counts.meaningfulFailures === 1;
  const misA = ok(
    "MIS-A",
    "An arbitrary wrong numeric answer creates ZERO specific misconception evidence -- only generic incorrect capability evidence",
    "real",
    aPassed,
    `evaluation.misconceptionIdentifier=${String(wrongNumericSubmission.evaluation.misconceptionIdentifier)}, derived misconceptions=${derivedA.misconceptions.length}, failures=${capA?.counts.meaningfulFailures}`,
  );

  // B: the real governed error-classification instrument CAN discriminate.
  const wrongClassify = submit({ stepId: "misconception_check_wrong_operation", given: wrongClassification("misconception_check_wrong_operation", "s1"), sessionKey: "s1" });
  const derivedB = derive([wrongClassify.attempt]);
  const misEntry = derivedB.misconceptions.find((m) => m.misconceptionId === "MIS-EL-OHM-WRONG-OPERATION-001");
  const bPassed =
    !wrongClassify.evaluation.correct &&
    wrongClassify.evaluation.misconceptionIdentifier === "MIS-EL-OHM-WRONG-OPERATION-001" &&
    misEntry?.currentlyEvidenced === true &&
    misEntry.events[0]?.basis === "error_classification_incorrect";
  const misB = ok(
    "MIS-B",
    "The real governed misconception-discrimination instrument (worked_error_classification, direct strength) creates specific misconception evidence with an explicit basis",
    "real",
    bPassed,
    `misconception=${misEntry?.misconceptionId}, basis=${misEntry?.events[0]?.basis}, currentlyEvidenced=${misEntry?.currentlyEvidenced}`,
  );

  // C: a later correct discriminating interaction clears currency; history stays.
  const rightClassify = submit({ stepId: "misconception_check_wrong_operation", given: correctAnswer("misconception_check_wrong_operation", "s2"), sessionKey: "s2" }).attempt;
  const derivedC = derive([wrongClassify.attempt, rightClassify]);
  const clearedEntry = derivedC.misconceptions.find((m) => m.misconceptionId === "MIS-EL-OHM-WRONG-OPERATION-001");
  const snapshotC = toLearnerEvidenceSnapshot(derivedC);
  const cPassed =
    clearedEntry?.currentlyEvidenced === false &&
    clearedEntry.events.length === 1 &&
    !snapshotC.misconceptionsEvidenced.has("MIS-EL-OHM-WRONG-OPERATION-001");
  const misC = ok(
    "MIS-C",
    "A later correct discriminating interaction clears the misconception's currency without erasing the historical evidence",
    "real",
    cPassed,
    `currentlyEvidenced=${clearedEntry?.currentlyEvidenced}, historicalEvents=${clearedEntry?.events.length}`,
  );

  return [misA, misB, misC];
}

// ---------------------------------------------------------------------
// TRANSFER -- real governed transfer_application evidence
// ---------------------------------------------------------------------
function scenarioTransfer(): ScenarioResult {
  const a = submit({ stepId: "select_rearrangement_transfer", given: correctAnswer("select_rearrangement_transfer", "s1"), sessionKey: "s1" }).attempt;
  const b = submit({ stepId: "select_rearrangement_transfer", given: correctAnswer("select_rearrangement_transfer", "s2"), sessionKey: "s2" }).attempt;
  const derived = derive([a, b]);
  const cap = derived.capabilities.find((c) => c.capabilityId === "cap.ohms_law.select_rearrangement");

  // Contrast: repeated success on the real GUIDED step must never reach a secure state.
  const g1 = submit({ stepId: "guided_calculation_current", given: correctAnswer("guided_calculation_current", "s1"), sessionKey: "s1" }).attempt;
  const g2 = submit({ stepId: "guided_calculation_current", given: correctAnswer("guided_calculation_current", "s2"), sessionKey: "s2" }).attempt;
  const guidedCap = derive([g1, g2]).capabilities.find((c) => c.capabilityId === "cap.ohms_law.solve_for_current");

  const passed = cap?.state === "TRANSFER_SECURE" && cap.counts.transferSuccesses === 2 && guidedCap?.state === "EMERGING";
  return ok(
    "TRANSFER",
    "Repeated success on the real governed transfer_application step: TRANSFER_SECURE; repeated success on the real guided step stays EMERGING (scaffolded, never silently secure)",
    "real",
    passed,
    `transfer capability=${cap?.state} (transferSuccesses=${cap?.counts.transferSuccesses}); guided capability=${guidedCap?.state}`,
  );
}

// ---------------------------------------------------------------------
// CONVERGE -- offline/server convergence determinism (task brief §25)
// ---------------------------------------------------------------------
function scenarioConverge(): ScenarioResult {
  const synced: LearnerAttemptRecord[] = [
    submit({ stepId: "interpret_variables_and_units", given: correctAnswer("interpret_variables_and_units", "s1"), sessionKey: "s1" }).attempt,
    submit({ stepId: "guided_calculation_current", given: correctAnswer("guided_calculation_current", "s1"), sessionKey: "s1" }).attempt,
    submit({ stepId: "misconception_check_wrong_operation", given: wrongClassification("misconception_check_wrong_operation", "s1"), sessionKey: "s1" }).attempt,
  ];
  const offline: LearnerAttemptRecord[] = [
    submit({ stepId: "independent_question_resistance", given: correctAnswer("independent_question_resistance", "s1"), sessionKey: "s1" }).attempt,
    submit({ stepId: "select_rearrangement_transfer", given: correctAnswer("select_rearrangement_transfer", "s1"), sessionKey: "s1" }).attempt,
    submit({ stepId: "retrieval_check", given: correctAnswer("retrieval_check", "s1"), sessionKey: "s1" }).attempt,
  ];

  // Device view: synced history + offline tail. Server view after sync:
  // the union arrives in a different order and with one duplicated upload.
  const deviceView = derive([...synced, ...offline]);
  const serverView = derive([offline[2]!, synced[1]!, offline[0]!, synced[2]!, offline[1]!, synced[0]!, { ...offline[1]! }]);

  const snapshotDevice = toLearnerEvidenceSnapshot(deviceView);
  const context: AssemblyContext = { assemblyPolicyVersion: ASSEMBLY_POLICY_VERSION, allLessons: realLessons };
  const assembly = assembleLessonInstance(LESSON_OHMS_LAW, snapshotDevice, context);
  const assemblyAgain = assembleLessonInstance(LESSON_OHMS_LAW, toLearnerEvidenceSnapshot(serverView), context);

  const equal = JSON.stringify({ ...deviceView, ignoredAttempts: [] }) === JSON.stringify({ ...serverView, ignoredAttempts: [] });
  const passed =
    equal &&
    assembly.status === "ready" &&
    assemblyAgain.status === "ready" &&
    assembly.instance.instanceId === assemblyAgain.instance.instanceId;
  return ok(
    "CONVERGE",
    "Device derivation (synced + offline tail) and server derivation (reordered union with a duplicated upload) converge to the identical state, and both drive identical real LessonInstance assembly",
    "real",
    passed,
    `derivations equal=${equal}, instanceId match=${assembly.status === "ready" && assemblyAgain.status === "ready" && assembly.instance.instanceId === assemblyAgain.instance.instanceId}`,
  );
}

// ---------------------------------------------------------------------
// PERF -- rough derivation cost over a larger synthetic history (§38)
// ---------------------------------------------------------------------
function scenarioPerf(): ScenarioResult {
  const attempts: LearnerAttemptRecord[] = [];
  const stepIds = ["independent_question_resistance", "guided_calculation_current", "select_rearrangement_transfer", "retrieval_check", "misconception_check_wrong_operation"];
  for (let i = 0; i < 2000; i += 1) {
    const stepId = stepIds[i % stepIds.length]!;
    attempts.push({
      learnerId: LEARNER,
      instanceId: INSTANCE,
      sessionKey: `perf-session-${Math.floor(i / stepIds.length)}`,
      lessonId: LESSON_OHMS_LAW.id,
      lessonVersion: LESSON_OHMS_LAW.version,
      contentRelease: RELEASE_UNIT202_V1,
      stepId,
      attemptIndex: 1,
      answerRevealedBeforeAttempt: false,
      questionBlueprintId: blueprintFor(stepId).id,
      correct: i % 3 !== 0,
      recordedAt: `2026-08-${String(1 + (i % 19)).padStart(2, "0")}T09:${String(Math.floor(i / 60) % 60).padStart(2, "0")}:${String(i % 60).padStart(2, "0")}Z`,
    });
  }
  const startedAt = performance.now();
  const derived = derive(attempts);
  const elapsedMs = performance.now() - startedAt;
  const passed = derived.attemptsConsidered === attempts.length && elapsedMs < 2000;
  return ok(
    "PERF",
    "[SYNTHETIC VOLUME] 2000-attempt derivation over real content completes in mobile-reasonable time",
    "synthetic",
    passed,
    `attemptsConsidered=${derived.attemptsConsidered}, elapsed=${elapsedMs.toFixed(1)}ms (threshold 2000ms)`,
  );
}

export function buildReport(): EvidenceDerivationProvingReport {
  clock = 0;
  return {
    scenarios: [scenarioNew(), scenarioOne(), scenarioRepeat(), scenarioRetry(), ...scenarioMisconceptionSafety(), scenarioTransfer(), scenarioConverge(), scenarioPerf()],
    realContentGaps: REAL_CONTENT_GAPS,
  };
}

export function isReportClean(report: EvidenceDerivationProvingReport): boolean {
  return report.scenarios.every((s) => s.passed);
}

export function formatReport(report: EvidenceDerivationProvingReport): string {
  const lines: string[] = [];
  lines.push(`Evidence derivation proving report -- real Ohm's Law content, mastery policy v${MASTERY_POLICY_VERSION}`);
  lines.push("====================================================================================================");
  for (const scenario of report.scenarios) {
    lines.push(`${scenario.passed ? "PASS" : "FAIL"} [${scenario.scenarioId}] (${scenario.contentSource}) ${scenario.label}`);
    lines.push(`     ${scenario.detail}`);
  }
  lines.push("");
  lines.push("Real-content gaps (mechanism proven, but not yet exercised by real governed content):");
  for (const gap of report.realContentGaps) lines.push(`  - ${gap}`);
  return lines.join("\n");
}

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return fileURLToPath(import.meta.url) === entryPoint;
}

if (isMainModule()) {
  const report = buildReport();
  console.log(formatReport(report));
  if (process.argv.includes("--check") && !isReportClean(report)) {
    process.exitCode = 1;
  }
}
