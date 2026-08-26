/**
 * Proves @alp/diagnostic-engine's deterministic course-orchestration
 * (`selectNextActivity`) against REAL governed content across all four
 * real lessons (task brief §31): the real chain exercised here is the
 * production one --
 *
 *   real governed blueprint (+ release identity)
 *     -> @alp/calculation-engine generateQuestionInstance (real question)
 *     -> real evaluateAnswer on a submitted value
 *     -> LearnerAttemptRecord (what the mobile outbox durably records)
 *     -> @alp/evidence-engine deriveLearnerState / toLearnerEvidenceSnapshot
 *     -> @alp/diagnostic-engine selectNextActivity (real course definition,
 *        real lessons, real remediationEligibility resolution)
 *
 * REAL vs SYNTHETIC: every scenario runs against the real governed
 * course/lessons/blueprints/families and the real calculation and
 * evidence engines. The attempt HISTORIES are necessarily synthesized
 * (no real learners exist yet) -- each scenario states exactly what
 * history it fabricates. Acceptance of the CC-08 cross-lesson adaptive
 * vertical depends on real governed content, not synthetic fixtures
 * (task brief §4.6/§31).
 *
 * Usage:
 *   node scripts/content/prove-course-orchestration.ts          (print report)
 *   node scripts/content/prove-course-orchestration.ts --check  (exit 1 on any failure)
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
  type EvidenceContentContext,
  type LearnerAttemptRecord,
} from "@alp/evidence-engine";
import type { LessonPlan, QuestionBlueprint } from "@alp/content-schema";
import { pedagogyManifestSchema } from "@alp/content-schema";
import {
  selectNextActivity,
  ACTIVITY_SELECTION_POLICY_VERSION,
  UNIT202_ADAPTIVE_VERTICAL,
  type ActivityDecision,
  type RecentCompletionContext,
} from "@alp/diagnostic-engine";

import { cc05aPedagogyUnit202 } from "./data/cc05a-pedagogy-unit202.ts";
import { contentReleases, RELEASE_UNIT202_V2, RELEASE_UNIT202_V8 } from "./data/content-releases.ts";
import {
  LESSON_OHMS_LAW_UNIT202_V2 as LESSON_OHMS_LAW,
  LESSON_FOUNDATION_FORMULA_REARRANGEMENT,
  LESSON_RESISTORS_SERIES,
  LESSON_RESISTORS_PARALLEL,
  LESSON_MAGNETIC_EFFECTS_OF_CURRENT,
  lessons as realLessons,
} from "./data/lessons.ts";

export interface ScenarioResult {
  readonly scenarioId: string;
  readonly label: string;
  readonly contentSource: "real" | "synthetic";
  readonly passed: boolean;
  readonly detail: string;
}

export interface CourseOrchestrationProvingReport {
  readonly scenarios: readonly ScenarioResult[];
  readonly realContentGaps: readonly string[];
}

export const REAL_CONTENT_GAPS = [
  "COMPLETE_SLICE is proven against the real four-node course (Ohm's Law, resistors-series, resistors-parallel, magnetism/effects-of-current, CC-12) -- the representative ~8-9 lesson mini-unit itself remains out of CC-08/CC-12 scope, so a longer real course sequence is not exercised here.",
  "The real parallel lesson's within-lesson misconception branch (remediation_reciprocal_technique) is exercised by @alp/learning-engine's own assembly/branching layer, not by this course-level orchestration script -- MISCONCEPTION-SAFE below proves the course-level decision ignores misconceptionsEvidenced, not the within-lesson branch itself (that is proven separately by lesson-assembly/evidence-derivation proving scripts).",
];

const pedagogy = pedagogyManifestSchema.parse(cc05aPedagogyUnit202);
const release = contentReleases.releases.find((r) => r.id === RELEASE_UNIT202_V2)!;

const CONTENT: EvidenceContentContext = {
  lessons: realLessons,
  questionBlueprints: pedagogy.questionBlueprints,
  assertionFamilies: pedagogy.assertionFamilies.map((f) => ({
    id: f.id,
    requiredCapabilityIds: f.completeness.requiredCapabilityIds,
  })),
};

const LEARNER = "learner.proving.course-orchestration";

function blueprintFor(lesson: LessonPlan, stepId: string): QuestionBlueprint {
  const step = lesson.steps.find((s) => s.id === stepId);
  if (!step?.questionBlueprintId) throw new Error(`lesson '${lesson.id}' step '${stepId}' has no question blueprint`);
  const blueprint = pedagogy.questionBlueprints.find((b) => b.id === step.questionBlueprintId);
  if (!blueprint) throw new Error(`blueprint '${step.questionBlueprintId}' not in governed pedagogy corpus`);
  return blueprint;
}

function realQuestion(lesson: LessonPlan, instanceId: string, stepId: string, sessionSalt: string): GeneratedQuestionInstance {
  const blueprint = blueprintFor(lesson, stepId);
  const identity: DeterministicIdentity = {
    blueprintId: blueprint.id,
    blueprintVersion: release.questionBlueprintVersion,
    contentRelease: RELEASE_UNIT202_V2,
    seed: fnv1a32(`${instanceId}${sessionSalt}::${stepId}`),
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
  readonly lesson: LessonPlan;
  readonly instanceId: string;
  readonly stepId: string;
  readonly given: AnswerValue;
  readonly sessionKey: string;
  readonly attemptIndex?: number;
  // CC-12: `deriveLearnerState` resolves a `LearnerAttemptRecord`'s step
  // definition by matching (lessonId, lessonVersion, contentRelease)
  // against `CONTENT.lessons` -- the pre-existing lessons here (Ohm's Law/
  // series/parallel/foundation-rearrangement) all happen to have a real
  // release.unit202.v2-tagged entry available, so the hardcoded default
  // below has always resolved for them, but `lesson.magnetism.effects-of-
  // current` was only ever added starting at v4/v5 -- attempts against it
  // must stamp a `contentRelease` that a real matching lesson entry
  // actually exists under (its own native release.unit202.v8 tag, or any
  // release its content is re-addressed under).
  readonly contentRelease?: string;
}): LearnerAttemptRecord {
  clock += 1;
  const question = realQuestion(args.lesson, args.instanceId, args.stepId, args.sessionKey);
  const evaluation = evaluateAnswer(question, args.given);
  return {
    learnerId: LEARNER,
    instanceId: args.instanceId,
    sessionKey: args.sessionKey,
    lessonId: args.lesson.id,
    lessonVersion: args.lesson.version,
    contentRelease: args.contentRelease ?? RELEASE_UNIT202_V2,
    stepId: args.stepId,
    attemptIndex: args.attemptIndex ?? 1,
    answerRevealedBeforeAttempt: false,
    questionBlueprintId: question.identity.blueprintId,
    correct: evaluation.correct,
    recordedAt: `2026-08-21T09:${String(Math.floor(clock / 60)).padStart(2, "0")}:${String(clock % 60).padStart(2, "0")}Z`,
  };
}

function correctAnswer(lesson: LessonPlan, instanceId: string, stepId: string, sessionKey: string): AnswerValue {
  return realQuestion(lesson, instanceId, stepId, sessionKey).expected.value;
}

function wrongNumeric(lesson: LessonPlan, instanceId: string, stepId: string, sessionKey: string): number {
  const expected = realQuestion(lesson, instanceId, stepId, sessionKey).expected.value;
  if (typeof expected !== "number") throw new Error(`step '${stepId}' is not numeric`);
  return expected + Math.max(1, Math.abs(expected)) * 0.5 + 7;
}

function deriveSnapshot(attempts: readonly LearnerAttemptRecord[]) {
  const derived = deriveLearnerState({ learnerId: LEARNER, attempts, content: CONTENT });
  return toLearnerEvidenceSnapshot(derived);
}

function select(snap: ReturnType<typeof deriveSnapshot>, recentCompletionContext?: RecentCompletionContext): ActivityDecision {
  return selectNextActivity({
    courseDefinition: UNIT202_ADAPTIVE_VERTICAL,
    learnerEvidenceSnapshot: snap,
    recentCompletionContext,
    availableContent: { allLessons: realLessons },
    policyVersion: ACTIVITY_SELECTION_POLICY_VERSION,
  });
}

function ok(scenarioId: string, label: string, contentSource: "real" | "synthetic", passed: boolean, detail: string): ScenarioResult {
  return { scenarioId, label, contentSource, passed, detail };
}

const FOUNDATION = LESSON_FOUNDATION_FORMULA_REARRANGEMENT;
const FOUNDATION_INSTANCE = "li1_proving_foundation";
const OHMS_INSTANCE = "li1_proving_ohms";

// ---------------------------------------------------------------------
// NEW -- new learner selects the correct initial activity
// ---------------------------------------------------------------------
function scenarioNew(): ScenarioResult {
  const snap = deriveSnapshot([]);
  const decision = select(snap);
  const passed = decision.decisionType === "START_TARGET" && decision.lessonId === LESSON_OHMS_LAW.id;
  return ok("NEW", "New learner selects the correct initial activity: START_TARGET at the real Ohm's Law lesson", "real", passed, `decisionType=${decision.decisionType}, lessonId=${decision.lessonId}`);
}

// ---------------------------------------------------------------------
// VOCATIONAL -- learner reaches/continues the vocational target
// ---------------------------------------------------------------------
function scenarioVocational(): ScenarioResult {
  const attempt = submit({
    lesson: LESSON_OHMS_LAW,
    instanceId: OHMS_INSTANCE,
    stepId: "independent_question_resistance",
    given: correctAnswer(LESSON_OHMS_LAW, OHMS_INSTANCE, "independent_question_resistance", "s1"),
    sessionKey: "s1",
  });
  const snap = deriveSnapshot([attempt]);
  const decision = select(snap);
  const passed = decision.decisionType === "CONTINUE_TARGET" && decision.lessonId === LESSON_OHMS_LAW.id;
  return ok("VOCATIONAL", "Learner reaches and continues the real vocational target (Ohm's Law) once real evidence exists but is not yet complete", "real", passed, `decisionType=${decision.decisionType}`);
}

// ---------------------------------------------------------------------
// WEAK-FOUNDATION -- genuine evidence produces foundational weakness
// ---------------------------------------------------------------------
function weakFoundationAttempts(): LearnerAttemptRecord[] {
  return [
    submit({ lesson: FOUNDATION, instanceId: FOUNDATION_INSTANCE, stepId: "guided_rearrange_multiplicative", given: wrongNumeric(FOUNDATION, FOUNDATION_INSTANCE, "guided_rearrange_multiplicative", "s1"), sessionKey: "s1" }),
    submit({ lesson: FOUNDATION, instanceId: FOUNDATION_INSTANCE, stepId: "guided_rearrange_additive", given: wrongNumeric(FOUNDATION, FOUNDATION_INSTANCE, "guided_rearrange_additive", "s1"), sessionKey: "s1" }),
  ];
}

function scenarioWeakFoundation(): ScenarioResult {
  const attempts = weakFoundationAttempts();
  const snap = deriveSnapshot(attempts);
  const status = snap.familyStatus.get("foundational.algebraic_technique");
  const passed = attempts.every((a) => !a.correct) && status === "WEAK";
  return ok("WEAK-FOUNDATION", "Two real, genuinely wrong guided attempts on the real foundational lesson's own blueprints produce a real WEAK foundational.algebraic_technique family state", "real", passed, `familyStatus=${status}`);
}

// ---------------------------------------------------------------------
// REMEDIATE -- deterministic course decision selects the real
// formula-rearrangement lesson
// ---------------------------------------------------------------------
function scenarioRemediate(): ScenarioResult {
  const snap = deriveSnapshot(weakFoundationAttempts());
  const decision = select(snap);
  const passed = decision.decisionType === "REMEDIATE_FOUNDATION" && decision.lessonId === FOUNDATION.id && decision.reason === "prerequisite_family_weak";
  return ok("REMEDIATE", "WEAK foundational evidence deterministically selects the real foundation.maths.formula-rearrangement lesson (via @alp/learning-engine's real remediationEligibility resolution)", "real", passed, `decisionType=${decision.decisionType}, lessonId=${decision.lessonId}, reason=${decision.reason}`);
}

// ---------------------------------------------------------------------
// RETEST-FOUNDATION -- remediation alone is not enough; real retest
// evidence is required
// ---------------------------------------------------------------------
function scenarioRetestFoundation(): ScenarioResult {
  const snap = deriveSnapshot(weakFoundationAttempts());
  const decision = select(snap, { lessonId: FOUNDATION.id, lessonInstanceId: FOUNDATION_INSTANCE });
  const passed = decision.decisionType === "RETEST_FOUNDATION" && decision.lessonId === FOUNDATION.id;
  return ok(
    "RETEST-FOUNDATION",
    "Having just completed the real remediation lesson but with the family STILL WEAK (completion of remediation content alone never clears weakness), the course routes back for a genuine retest rather than assuming clearance",
    "real",
    passed,
    `decisionType=${decision.decisionType}, reason=${decision.reason}`,
  );
}

// ---------------------------------------------------------------------
// RETURN -- improved foundational state causes deterministic return to
// vocational context
// ---------------------------------------------------------------------
function improvedFoundationAttempts(): LearnerAttemptRecord[] {
  return [
    ...weakFoundationAttempts(),
    submit({ lesson: FOUNDATION, instanceId: FOUNDATION_INSTANCE, stepId: "independent_rearrange_multiplicative", given: correctAnswer(FOUNDATION, FOUNDATION_INSTANCE, "independent_rearrange_multiplicative", "s2"), sessionKey: "s2" }),
    submit({ lesson: FOUNDATION, instanceId: FOUNDATION_INSTANCE, stepId: "independent_rearrange_additive", given: correctAnswer(FOUNDATION, FOUNDATION_INSTANCE, "independent_rearrange_additive", "s2"), sessionKey: "s2" }),
  ];
}

function scenarioReturn(): ScenarioResult {
  const snap = deriveSnapshot(improvedFoundationAttempts());
  const status = snap.familyStatus.get("foundational.algebraic_technique");
  const decision = select(snap, { lessonId: FOUNDATION.id, lessonInstanceId: FOUNDATION_INSTANCE });
  const passed = status === "PROVISIONALLY_SECURE" && decision.decisionType === "RETURN_TO_VOCATIONAL_TRANSFER" && decision.lessonId === LESSON_OHMS_LAW.id;
  return ok(
    "RETURN",
    "Two genuine independent-attempt successes on the real foundational lesson (across both rearrangement patterns) clear the family to PROVISIONALLY_SECURE, and the course deterministically returns the learner to the real Ohm's Law vocational transfer",
    "real",
    passed,
    `familyStatus=${status}, decisionType=${decision.decisionType}, lessonId=${decision.lessonId}`,
  );
}

// ---------------------------------------------------------------------
// TRANSFER -- learner completes vocational transfer evidence, changing
// derived state
// ---------------------------------------------------------------------
function transferAttempts(): LearnerAttemptRecord[] {
  return [
    submit({ lesson: LESSON_OHMS_LAW, instanceId: OHMS_INSTANCE, stepId: "select_rearrangement_transfer", given: correctAnswer(LESSON_OHMS_LAW, OHMS_INSTANCE, "select_rearrangement_transfer", "s1"), sessionKey: "s1" }),
    submit({ lesson: LESSON_OHMS_LAW, instanceId: OHMS_INSTANCE, stepId: "select_rearrangement_transfer", given: correctAnswer(LESSON_OHMS_LAW, OHMS_INSTANCE, "select_rearrangement_transfer", "s2"), sessionKey: "s2" }),
  ];
}

function scenarioTransfer(): ScenarioResult {
  const snap = deriveSnapshot(transferAttempts());
  const cap = snap.capabilityStatus.get("cap.ohms_law.select_rearrangement");
  const passed = cap === "TRANSFER_SECURE";
  return ok("TRANSFER", "Two independent correct attempts on the real Ohm's Law transfer_application step generate real TRANSFER_SECURE vocational transfer evidence", "real", passed, `cap.ohms_law.select_rearrangement=${cap}`);
}

// ---------------------------------------------------------------------
// ADVANCE -- state is sufficient to select the next appropriate activity
//
// CC-08A correction: the real Ohm's Law lesson declares FOUR mastery
// gates (masteryGateCapabilityIds: solve_for_voltage, solve_for_resistance,
// select_rearrangement, check_plausibility) -- cap.ohms_law.solve_for_current
// is completion-required but deliberately excluded from the gate set
// because its only evidence-emitting step (guided_calculation_current) is
// guided-only and could never reach a secure mastery tier. Advancing now
// requires EVERY declared gate to independently reach a secure tier
// (PROVISIONALLY_SECURE or TRANSFER_SECURE), not just one -- so each
// gate's real, single evidence-emitting step is submitted correctly
// across two real sessions.
// ---------------------------------------------------------------------
function everyGateSecureAttempts(): LearnerAttemptRecord[] {
  return [
    ...transferAttempts(), // cap.ohms_law.select_rearrangement -> TRANSFER_SECURE
    submit({ lesson: LESSON_OHMS_LAW, instanceId: OHMS_INSTANCE, stepId: "retrieval_check", given: correctAnswer(LESSON_OHMS_LAW, OHMS_INSTANCE, "retrieval_check", "s1"), sessionKey: "s1" }),
    submit({ lesson: LESSON_OHMS_LAW, instanceId: OHMS_INSTANCE, stepId: "retrieval_check", given: correctAnswer(LESSON_OHMS_LAW, OHMS_INSTANCE, "retrieval_check", "s2"), sessionKey: "s2" }), // cap.ohms_law.solve_for_voltage -> PROVISIONALLY_SECURE
    submit({ lesson: LESSON_OHMS_LAW, instanceId: OHMS_INSTANCE, stepId: "independent_question_resistance", given: correctAnswer(LESSON_OHMS_LAW, OHMS_INSTANCE, "independent_question_resistance", "s1"), sessionKey: "s1" }),
    submit({ lesson: LESSON_OHMS_LAW, instanceId: OHMS_INSTANCE, stepId: "independent_question_resistance", given: correctAnswer(LESSON_OHMS_LAW, OHMS_INSTANCE, "independent_question_resistance", "s2"), sessionKey: "s2" }), // cap.ohms_law.solve_for_resistance -> PROVISIONALLY_SECURE
    submit({ lesson: LESSON_OHMS_LAW, instanceId: OHMS_INSTANCE, stepId: "plausibility_check_transfer", given: correctAnswer(LESSON_OHMS_LAW, OHMS_INSTANCE, "plausibility_check_transfer", "s1"), sessionKey: "s1" }),
    submit({ lesson: LESSON_OHMS_LAW, instanceId: OHMS_INSTANCE, stepId: "plausibility_check_transfer", given: correctAnswer(LESSON_OHMS_LAW, OHMS_INSTANCE, "plausibility_check_transfer", "s2"), sessionKey: "s2" }), // cap.ohms_law.check_plausibility -> TRANSFER_SECURE
    submit({ lesson: LESSON_OHMS_LAW, instanceId: OHMS_INSTANCE, stepId: "guided_calculation_current", given: correctAnswer(LESSON_OHMS_LAW, OHMS_INSTANCE, "guided_calculation_current", "s1"), sessionKey: "s1" }), // cap.ohms_law.solve_for_current -- completion evidence only, NOT a mastery gate
  ];
}

function advanceAttempts(): LearnerAttemptRecord[] {
  return everyGateSecureAttempts();
}

function scenarioAdvance(): ScenarioResult {
  const snap = deriveSnapshot(advanceAttempts());
  const gateStatuses = ["cap.ohms_law.select_rearrangement", "cap.ohms_law.solve_for_voltage", "cap.ohms_law.solve_for_resistance", "cap.ohms_law.check_plausibility"].map(
    (id) => `${id}=${snap.capabilityStatus.get(id)}`,
  );
  const decision = select(snap);
  const passed = decision.decisionType === "ADVANCE" && decision.lessonId === LESSON_RESISTORS_SERIES.id;
  return ok(
    "ADVANCE",
    "Once every real, declared Ohm's Law mastery gate (select_rearrangement, solve_for_voltage, solve_for_resistance, check_plausibility) independently reaches a secure tier, the course deterministically advances to the real second vocational lesson (resistors-series) -- the excluded, guided-only solve_for_current capability plays no part",
    "real",
    passed,
    `decisionType=${decision.decisionType}, lessonId=${decision.lessonId}, ${gateStatuses.join(", ")}`,
  );
}

// ---------------------------------------------------------------------
// ADVANCE-BLOCK-WEAK / ADVANCE-BLOCK-CONFLICTING -- CC-08A advancement
// integrity: a required real mastery gate that is WEAK or CONFLICTING
// must prevent ADVANCE even while every OTHER real gate (including a
// genuinely TRANSFER_SECURE one) is secure.
// ---------------------------------------------------------------------
function advanceBlockWeakAttempts(): LearnerAttemptRecord[] {
  return [
    ...transferAttempts(), // cap.ohms_law.select_rearrangement -> TRANSFER_SECURE (secure gate)
    submit({ lesson: LESSON_OHMS_LAW, instanceId: OHMS_INSTANCE, stepId: "retrieval_check", given: correctAnswer(LESSON_OHMS_LAW, OHMS_INSTANCE, "retrieval_check", "s1"), sessionKey: "s1" }),
    submit({ lesson: LESSON_OHMS_LAW, instanceId: OHMS_INSTANCE, stepId: "retrieval_check", given: correctAnswer(LESSON_OHMS_LAW, OHMS_INSTANCE, "retrieval_check", "s2"), sessionKey: "s2" }), // solve_for_voltage -> PROVISIONALLY_SECURE (secure gate)
    submit({ lesson: LESSON_OHMS_LAW, instanceId: OHMS_INSTANCE, stepId: "plausibility_check_transfer", given: correctAnswer(LESSON_OHMS_LAW, OHMS_INSTANCE, "plausibility_check_transfer", "s1"), sessionKey: "s1" }),
    submit({ lesson: LESSON_OHMS_LAW, instanceId: OHMS_INSTANCE, stepId: "plausibility_check_transfer", given: correctAnswer(LESSON_OHMS_LAW, OHMS_INSTANCE, "plausibility_check_transfer", "s2"), sessionKey: "s2" }), // check_plausibility -> TRANSFER_SECURE (secure gate)
    // solve_for_resistance: two genuinely wrong real independent attempts,
    // zero successes -> WEAK (task brief weak.v1 rule). This is the ONE
    // required mastery gate left insecure.
    submit({ lesson: LESSON_OHMS_LAW, instanceId: OHMS_INSTANCE, stepId: "independent_question_resistance", given: wrongNumeric(LESSON_OHMS_LAW, OHMS_INSTANCE, "independent_question_resistance", "s1"), sessionKey: "s1" }),
    submit({ lesson: LESSON_OHMS_LAW, instanceId: OHMS_INSTANCE, stepId: "independent_question_resistance", given: wrongNumeric(LESSON_OHMS_LAW, OHMS_INSTANCE, "independent_question_resistance", "s2"), sessionKey: "s2" }),
  ];
}

function scenarioAdvanceBlockWeak(): ScenarioResult {
  const snap = deriveSnapshot(advanceBlockWeakAttempts());
  const gateStatus = snap.capabilityStatus.get("cap.ohms_law.solve_for_resistance");
  const transferGateStatus = snap.capabilityStatus.get("cap.ohms_law.select_rearrangement");
  const decision = select(snap);
  const passed = gateStatus === "WEAK" && transferGateStatus === "TRANSFER_SECURE" && decision.decisionType !== "ADVANCE" && decision.decisionType === "CONTINUE_TARGET" && decision.lessonId === LESSON_OHMS_LAW.id;
  return ok(
    "ADVANCE-BLOCK-WEAK",
    "A real, genuinely WEAK required mastery gate (solve_for_resistance) prevents ADVANCE even though three other real gates -- including a TRANSFER_SECURE one (select_rearrangement) -- are secure: one secure gate can never mask another that is not",
    "real",
    passed,
    `cap.ohms_law.solve_for_resistance=${gateStatus}, cap.ohms_law.select_rearrangement=${transferGateStatus}, decisionType=${decision.decisionType}, reason=${decision.reason}`,
  );
}

function advanceBlockConflictingAttempts(): LearnerAttemptRecord[] {
  return [
    ...transferAttempts(), // cap.ohms_law.select_rearrangement -> TRANSFER_SECURE (secure gate)
    submit({ lesson: LESSON_OHMS_LAW, instanceId: OHMS_INSTANCE, stepId: "retrieval_check", given: correctAnswer(LESSON_OHMS_LAW, OHMS_INSTANCE, "retrieval_check", "s1"), sessionKey: "s1" }),
    submit({ lesson: LESSON_OHMS_LAW, instanceId: OHMS_INSTANCE, stepId: "retrieval_check", given: correctAnswer(LESSON_OHMS_LAW, OHMS_INSTANCE, "retrieval_check", "s2"), sessionKey: "s2" }), // solve_for_voltage -> PROVISIONALLY_SECURE (secure gate)
    submit({ lesson: LESSON_OHMS_LAW, instanceId: OHMS_INSTANCE, stepId: "plausibility_check_transfer", given: correctAnswer(LESSON_OHMS_LAW, OHMS_INSTANCE, "plausibility_check_transfer", "s1"), sessionKey: "s1" }),
    submit({ lesson: LESSON_OHMS_LAW, instanceId: OHMS_INSTANCE, stepId: "plausibility_check_transfer", given: correctAnswer(LESSON_OHMS_LAW, OHMS_INSTANCE, "plausibility_check_transfer", "s2"), sessionKey: "s2" }), // check_plausibility -> TRANSFER_SECURE (secure gate)
    // solve_for_resistance: two genuine real independent successes, THEN
    // two genuine real independent failures -- independentSuccesses >= 2,
    // meaningfulFailures >= 2, failuresAfterFirstIndependentSuccess >= 1
    // -> CONFLICTING (task brief conflicting.v1 rule).
    submit({ lesson: LESSON_OHMS_LAW, instanceId: OHMS_INSTANCE, stepId: "independent_question_resistance", given: correctAnswer(LESSON_OHMS_LAW, OHMS_INSTANCE, "independent_question_resistance", "s3"), sessionKey: "s3" }),
    submit({ lesson: LESSON_OHMS_LAW, instanceId: OHMS_INSTANCE, stepId: "independent_question_resistance", given: correctAnswer(LESSON_OHMS_LAW, OHMS_INSTANCE, "independent_question_resistance", "s4"), sessionKey: "s4" }),
    submit({ lesson: LESSON_OHMS_LAW, instanceId: OHMS_INSTANCE, stepId: "independent_question_resistance", given: wrongNumeric(LESSON_OHMS_LAW, OHMS_INSTANCE, "independent_question_resistance", "s5"), sessionKey: "s5" }),
    submit({ lesson: LESSON_OHMS_LAW, instanceId: OHMS_INSTANCE, stepId: "independent_question_resistance", given: wrongNumeric(LESSON_OHMS_LAW, OHMS_INSTANCE, "independent_question_resistance", "s6"), sessionKey: "s6" }),
  ];
}

function scenarioAdvanceBlockConflicting(): ScenarioResult {
  const snap = deriveSnapshot(advanceBlockConflictingAttempts());
  const gateStatus = snap.capabilityStatus.get("cap.ohms_law.solve_for_resistance");
  const decision = select(snap);
  const passed = gateStatus === "CONFLICTING" && decision.decisionType !== "ADVANCE" && decision.decisionType === "CONTINUE_TARGET" && decision.lessonId === LESSON_OHMS_LAW.id;
  return ok(
    "ADVANCE-BLOCK-CONFLICTING",
    "A real, genuinely CONFLICTING required mastery gate (solve_for_resistance -- two real independent successes followed by two real independent failures) prevents ADVANCE even though every other real gate is secure",
    "real",
    passed,
    `cap.ohms_law.solve_for_resistance=${gateStatus}, decisionType=${decision.decisionType}, reason=${decision.reason}`,
  );
}

// ---------------------------------------------------------------------
// SHARED-PREREQUISITE -- more than one vocational lesson (Ohm's Law,
// resistors-series) shares the same real foundational prerequisite
// ---------------------------------------------------------------------
function scenarioSharedPrerequisite(): ScenarioResult {
  const snap = deriveSnapshot([...advanceAttempts(), ...weakFoundationAttempts()]);
  const decision = select(snap);
  const passed = decision.decisionType === "REMEDIATE_FOUNDATION" && decision.lessonId === FOUNDATION.id && decision.evidenceBasis.courseNodeId === "node.resistors-series";
  return ok(
    "SHARED-PREREQUISITE",
    "After advancing past Ohm's Law, a WEAK foundational.algebraic_technique family also blocks the real resistors-series lesson (its own real, declared prerequisite) and resolves to the SAME real remediation lesson -- a genuinely shared cross-lesson prerequisite, not per-lesson-duplicated content",
    "real",
    passed,
    `decisionType=${decision.decisionType}, lessonId=${decision.lessonId}, courseNodeId=${decision.evidenceBasis.courseNodeId}`,
  );
}

// ---------------------------------------------------------------------
// MISCONCEPTION-SAFE -- generic wrong evidence does not generate
// misconception-specific routing
// ---------------------------------------------------------------------
function scenarioMisconceptionSafe(): ScenarioResult {
  const genericWrong = submit({
    lesson: LESSON_OHMS_LAW,
    instanceId: OHMS_INSTANCE,
    stepId: "independent_question_resistance",
    given: wrongNumeric(LESSON_OHMS_LAW, OHMS_INSTANCE, "independent_question_resistance", "s1"),
    sessionKey: "s1",
  });
  const snap = deriveSnapshot([genericWrong]);
  const withoutMisconception = select(snap);
  // Structural proof: manually inject a REAL, named, direct-strength
  // misconception id into the snapshot's misconceptionsEvidenced set --
  // selectNextActivity must produce the IDENTICAL decision, proving the
  // orchestrator never even reads this field for routing (task brief
  // §26/§O/§P). This is a whitebox proof of the mechanism, layered on
  // top of the real fact that a generic wrong numeric answer produces
  // zero misconception evidence in the first place (proven by
  // scripts/content/prove-evidence-derivation.ts's own MIS-A scenario).
  const tampered = { ...snap, misconceptionsEvidenced: new Set(["MIS-EL-OHM-WRONG-OPERATION-001"]) };
  const withMisconception = select(tampered);
  const noRealMisconceptionEvidence = snap.misconceptionsEvidenced.size === 0;
  const decisionsIdentical = JSON.stringify(withoutMisconception) === JSON.stringify(withMisconception);
  const passed = noRealMisconceptionEvidence && decisionsIdentical;
  return ok(
    "MISCONCEPTION-SAFE",
    "A generic wrong real answer produces zero misconception evidence, and selectNextActivity's decision is byte-identical whether or not misconceptionsEvidenced is populated -- course-level routing structurally never consumes it",
    "real",
    passed,
    `noRealMisconceptionEvidence=${noRealMisconceptionEvidence}, decisionsIdentical=${decisionsIdentical}`,
  );
}

// ---------------------------------------------------------------------
// CONVERGE -- offline local evidence union and synchronized equivalent
// history yield identical next-activity decision
// ---------------------------------------------------------------------
function scenarioConverge(): ScenarioResult {
  const a = weakFoundationAttempts();
  const b = [
    submit({ lesson: FOUNDATION, instanceId: FOUNDATION_INSTANCE, stepId: "independent_rearrange_multiplicative", given: correctAnswer(FOUNDATION, FOUNDATION_INSTANCE, "independent_rearrange_multiplicative", "s2"), sessionKey: "s2" }),
    submit({ lesson: FOUNDATION, instanceId: FOUNDATION_INSTANCE, stepId: "independent_rearrange_additive", given: correctAnswer(FOUNDATION, FOUNDATION_INSTANCE, "independent_rearrange_additive", "s2"), sessionKey: "s2" }),
  ];

  const deviceView = deriveSnapshot([...a, ...b]);
  // Server view after sync: reordered union with one duplicated upload.
  const serverView = deriveSnapshot([b[1]!, a[0]!, b[0]!, a[1]!, { ...a[0]! }]);

  const deviceDecision = select(deviceView, { lessonId: FOUNDATION.id, lessonInstanceId: FOUNDATION_INSTANCE });
  const serverDecision = select(serverView, { lessonId: FOUNDATION.id, lessonInstanceId: FOUNDATION_INSTANCE });
  const passed = JSON.stringify(deviceDecision) === JSON.stringify(serverDecision) && deviceDecision.decisionType === "RETURN_TO_VOCATIONAL_TRANSFER";
  return ok(
    "CONVERGE",
    "Offline local evidence (synced + offline tail, real foundation-lesson attempts) and a reordered/duplicated server-equivalent union converge to the identical real course decision",
    "real",
    passed,
    `deviceDecision=${deviceDecision.decisionType}, serverDecision=${serverDecision.decisionType}, identical=${JSON.stringify(deviceDecision) === JSON.stringify(serverDecision)}`,
  );
}

// ---------------------------------------------------------------------
// COMPLETE_SLICE -- every course node mastered ends the proving slice
// ---------------------------------------------------------------------
const SERIES_INSTANCE = "li1_proving_series";
const PARALLEL_INSTANCE = "li1_proving_parallel";

function seriesCompletionAttempts(): LearnerAttemptRecord[] {
  const lesson = LESSON_RESISTORS_SERIES;
  const id = SERIES_INSTANCE;
  return [
    submit({ lesson, instanceId: id, stepId: "guided_interpret_diagram", given: correctAnswer(lesson, id, "guided_interpret_diagram", "s1"), sessionKey: "s1" }),
    submit({ lesson, instanceId: id, stepId: "guided_calculate_total_resistance", given: correctAnswer(lesson, id, "guided_calculate_total_resistance", "s1"), sessionKey: "s1" }),
    submit({ lesson, instanceId: id, stepId: "guided_calculate_supply_current", given: correctAnswer(lesson, id, "guided_calculate_supply_current", "s1"), sessionKey: "s1" }),
    // cap.series.check_plausibility's declared mastery gate needs a second
    // real independent transfer success (CC-08A: one is only EMERGING).
    submit({ lesson, instanceId: id, stepId: "transfer_plausibility_check", given: correctAnswer(lesson, id, "transfer_plausibility_check", "s1"), sessionKey: "s1" }),
    submit({ lesson, instanceId: id, stepId: "transfer_plausibility_check", given: correctAnswer(lesson, id, "transfer_plausibility_check", "s2"), sessionKey: "s2" }),
    submit({ lesson, instanceId: id, stepId: "transfer_solve_missing_component", given: correctAnswer(lesson, id, "transfer_solve_missing_component", "s1"), sessionKey: "s1" }),
    submit({ lesson, instanceId: id, stepId: "transfer_solve_missing_component", given: correctAnswer(lesson, id, "transfer_solve_missing_component", "s2"), sessionKey: "s2" }),
    // cap.series.calculate_total_resistance's mastery gate is never
    // independently evidenced by the guided-only
    // guided_calculate_total_resistance step -- its real independent
    // evidence comes solely from the lesson's own retrieval_check step
    // (CC-08A).
    submit({ lesson, instanceId: id, stepId: "retrieval_check", given: correctAnswer(lesson, id, "retrieval_check", "s1"), sessionKey: "s1" }),
    submit({ lesson, instanceId: id, stepId: "retrieval_check", given: correctAnswer(lesson, id, "retrieval_check", "s2"), sessionKey: "s2" }),
  ];
}

function parallelCompletionAttempts(): LearnerAttemptRecord[] {
  const lesson = LESSON_RESISTORS_PARALLEL;
  const id = PARALLEL_INSTANCE;
  return [
    submit({ lesson, instanceId: id, stepId: "guided_identify_topology", given: correctAnswer(lesson, id, "guided_identify_topology", "s1"), sessionKey: "s1" }),
    submit({ lesson, instanceId: id, stepId: "guided_calculate_total_resistance", given: correctAnswer(lesson, id, "guided_calculate_total_resistance", "s1"), sessionKey: "s1" }),
    submit({ lesson, instanceId: id, stepId: "guided_calculate_branch_current", given: correctAnswer(lesson, id, "guided_calculate_branch_current", "s1"), sessionKey: "s1" }),
    // cap.parallel.check_plausibility's declared mastery gate needs a
    // second real independent transfer success (CC-08A: one is only
    // EMERGING).
    submit({ lesson, instanceId: id, stepId: "transfer_plausibility_check", given: correctAnswer(lesson, id, "transfer_plausibility_check", "s1"), sessionKey: "s1" }),
    submit({ lesson, instanceId: id, stepId: "transfer_plausibility_check", given: correctAnswer(lesson, id, "transfer_plausibility_check", "s2"), sessionKey: "s2" }),
    submit({ lesson, instanceId: id, stepId: "transfer_solve_missing_branch", given: correctAnswer(lesson, id, "transfer_solve_missing_branch", "s1"), sessionKey: "s1" }),
    submit({ lesson, instanceId: id, stepId: "transfer_solve_missing_branch", given: correctAnswer(lesson, id, "transfer_solve_missing_branch", "s2"), sessionKey: "s2" }),
    // cap.parallel.calculate_total_resistance's mastery gate is never
    // independently evidenced by the guided-only
    // guided_calculate_total_resistance step -- its real independent
    // evidence comes solely from the lesson's own retrieval_check step
    // (CC-08A).
    submit({ lesson, instanceId: id, stepId: "retrieval_check", given: correctAnswer(lesson, id, "retrieval_check", "s1"), sessionKey: "s1" }),
    submit({ lesson, instanceId: id, stepId: "retrieval_check", given: correctAnswer(lesson, id, "retrieval_check", "s2"), sessionKey: "s2" }),
  ];
}

// CC-12: `lesson.magnetism.effects-of-current`'s own declared mastery gate
// (see its own completionCriteria comment) is exactly
// cap.emf.recognise_emf_terminal_voltage, independently evidenced by its
// misconception_check_emf_terminal_voltage step (standard scaffolding) and
// its own retrieval_check step (independent scaffolding) -- two real
// correct, independently-scaffolded attempts across those two steps reach
// PROVISIONALLY_SECURE, mirroring seriesCompletionAttempts'/
// parallelCompletionAttempts' own two-independent-attempt pattern above.
const MAGNETISM_INSTANCE = "li1_proving_magnetism";

function magnetismCompletionAttempts(): LearnerAttemptRecord[] {
  const lesson = LESSON_MAGNETIC_EFFECTS_OF_CURRENT;
  const id = MAGNETISM_INSTANCE;
  return [
    submit({
      lesson,
      instanceId: id,
      stepId: "misconception_check_emf_terminal_voltage",
      given: correctAnswer(lesson, id, "misconception_check_emf_terminal_voltage", "s1"),
      sessionKey: "s1",
      contentRelease: RELEASE_UNIT202_V8,
    }),
    submit({
      lesson,
      instanceId: id,
      stepId: "retrieval_check",
      given: correctAnswer(lesson, id, "retrieval_check", "s2"),
      sessionKey: "s2",
      contentRelease: RELEASE_UNIT202_V8,
    }),
  ];
}

function scenarioAdvanceToMagnetism(): ScenarioResult {
  const attempts = [...advanceAttempts(), ...seriesCompletionAttempts(), ...parallelCompletionAttempts()];
  const snap = deriveSnapshot(attempts);
  const decision = select(snap);
  // CC-12: adding the magnetism/effects-of-current node means completing
  // the original three-node vocational sequence now correctly ADVANCEs
  // into it, rather than reporting COMPLETE_SLICE early -- proving the
  // course definition change actually took effect end to end.
  const passed = decision.decisionType === "ADVANCE" && decision.lessonId === LESSON_MAGNETIC_EFFECTS_OF_CURRENT.id;
  return ok(
    "ADVANCE-TO-MAGNETISM",
    "Once Ohm's Law, resistors-series and resistors-parallel are all complete, the course deterministically advances to the real fourth vocational node -- magnetism/effects-of-current (CC-12) -- rather than reporting COMPLETE_SLICE early",
    "real",
    passed,
    `decisionType=${decision.decisionType}, lessonId=${decision.lessonId}`,
  );
}

function scenarioCompleteSlice(): ScenarioResult {
  const attempts = [...advanceAttempts(), ...seriesCompletionAttempts(), ...parallelCompletionAttempts(), ...magnetismCompletionAttempts()];
  const snap = deriveSnapshot(attempts);
  const decision = select(snap);
  const passed = decision.decisionType === "COMPLETE_SLICE" && decision.lessonId === undefined;
  return ok(
    "COMPLETE-SLICE",
    "Once every real course node's completion capabilities are evidenced and transfer-secure (Ohm's Law, resistors-series, resistors-parallel, magnetism/effects-of-current), the course deterministically reports COMPLETE_SLICE with no further activity",
    "real",
    passed,
    `decisionType=${decision.decisionType}, reason=${decision.reason}`,
  );
}

export function buildReport(): CourseOrchestrationProvingReport {
  clock = 0;
  return {
    scenarios: [
      scenarioNew(),
      scenarioVocational(),
      scenarioWeakFoundation(),
      scenarioRemediate(),
      scenarioRetestFoundation(),
      scenarioReturn(),
      scenarioTransfer(),
      scenarioAdvance(),
      scenarioAdvanceBlockWeak(),
      scenarioAdvanceBlockConflicting(),
      scenarioSharedPrerequisite(),
      scenarioMisconceptionSafe(),
      scenarioConverge(),
      scenarioAdvanceToMagnetism(),
      scenarioCompleteSlice(),
    ],
    realContentGaps: REAL_CONTENT_GAPS,
  };
}

export function isReportClean(report: CourseOrchestrationProvingReport): boolean {
  return report.scenarios.every((s) => s.passed);
}

export function formatReport(report: CourseOrchestrationProvingReport): string {
  const lines: string[] = [];
  lines.push(`Course orchestration proving report -- real cross-lesson adaptive vertical, policy v${ACTIVITY_SELECTION_POLICY_VERSION}`);
  lines.push("====================================================================================================");
  for (const scenario of report.scenarios) {
    lines.push(`${scenario.passed ? "PASS" : "FAIL"} [${scenario.scenarioId}] (${scenario.contentSource}) ${scenario.label}`);
    lines.push(`     ${scenario.detail}`);
  }
  lines.push("");
  lines.push("Real-content gaps:");
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
