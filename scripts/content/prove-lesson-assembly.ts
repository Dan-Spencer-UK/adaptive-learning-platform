/**
 * Proves @alp/learning-engine's deterministic lesson assembler against
 * the REAL, live governed Ohm's Law lesson wherever the real lesson can
 * exercise the mechanism, and against small, explicitly-labelled
 * SYNTHETIC fixtures wherever it cannot (task brief §19/§20: "Clearly
 * separate REAL OHM'S LAW PROOF from SYNTHETIC ENGINE-CAPABILITY PROOF.
 * Do not add fake governed production lessons merely to make tests
 * green.").
 *
 * This file is allowed to import both @alp/learning-engine (the engine)
 * and scripts/content/data (the content) precisely because it is
 * content-authoring/proving tooling, not learner-runtime engine code --
 * the dependency only ever runs content -> engine here, never the
 * reverse (mirrors scripts/content/prove-cc05b-engine.ts's own header
 * comment and scripts/content/README.md's stated boundary). The
 * engine package's OWN unit tests never import this real content --
 * see packages/learning-engine/src/test-fixtures.ts's header comment.
 *
 * Real-content coverage (the live corpus has exactly one lesson, no
 * conditional_skip_if_mastered step, and no foundational remediation
 * lesson yet -- see REAL_CONTENT_GAPS below):
 *   A - new learner: proven for real.
 *   C - wrong-operation misconception: proven for real (within-session
 *       branch routing against the real branchRoutes).
 *   D - rearrangement misconception: proven for real (ditto).
 *   E - prerequisite weakness: the "zero candidate -> unresolved,
 *       never silently proceed" half is proven for real (the real
 *       lesson's real prerequisite families genuinely have no governed
 *       remediation lesson yet); the "resolves to an actual remediation
 *       lesson" half needs a synthetic remediation lesson, since none
 *       exists in the corpus.
 *   G - same-input replay: proven for real.
 *   B - skip-if-mastered: SYNTHETIC ONLY -- the real lesson has no
 *       conditional_skip_if_mastered step (task brief §7 explicitly
 *       permits this: "do not distort the real Ohm's Law lesson just to
 *       exercise an engine feature").
 *   F - retrieval due: SYNTHETIC ONLY -- the real lesson's
 *       retrieval_check step is unconditionally `required` (deliberate
 *       distributed-practice design, not conditional/spaced retrieval),
 *       so due/not-due participation cannot be exercised against it.
 *
 * Usage:
 *   node scripts/content/prove-lesson-assembly.ts            (print report)
 *   node scripts/content/prove-lesson-assembly.ts --check     (exit 1 on any failure)
 */

import { fileURLToPath } from "node:url";

import {
  ASSEMBLY_POLICY_VERSION,
  assembleLessonInstance,
  resolveWithinSessionBranch,
  type AssemblyContext,
  type LearnerEvidenceSnapshot,
} from "@alp/learning-engine";
import type { LessonPlan } from "@alp/content-schema";

import { LESSON_OHMS_LAW, LESSON_OHMS_LAW_UNIT202_V2, lessons as realLessons } from "./data/lessons.ts";

export interface ScenarioResult {
  readonly scenarioId: string;
  readonly label: string;
  readonly contentSource: "real" | "synthetic";
  readonly passed: boolean;
  readonly detail: string;
}

export interface LessonAssemblyProvingReport {
  readonly scenarios: readonly ScenarioResult[];
  readonly realContentGaps: readonly string[];
}

export const REAL_CONTENT_GAPS = [
  // CC-08 closes this gap for foundational.algebraic_technique specifically
  // (lesson.foundation.maths.formula-rearrangement is now a real,
  // remediationEligibility-declared candidate -- see scenario E's real
  // half). The remaining prerequisite families still have no governed
  // remediation lesson.
  "No governed lesson yet targets lesson.electrical.ohms-law's other real prerequisite families (foundational.arithmetic_technique, foundational.proportion_and_units, electrical.si_units, electrical.core_quantities) -- prerequisite-remediation routing for these remains proven only against a synthetic remediation lesson, not real content.",
  "The real Ohm's Law lesson has no conditional_skip_if_mastered step -- skip-on-mastery is proven only against a synthetic lesson below.",
  "The real Ohm's Law lesson's retrieval_check step is deliberately `required` (unconditional distributed practice), not conditional_skip_if_mastered -- due/not-due retrieval participation is proven only against a synthetic lesson below.",
];

function evidence(overrides: Partial<LearnerEvidenceSnapshot> = {}): LearnerEvidenceSnapshot {
  return {
    learnerId: "learner.proving",
    capabilityStatus: new Map(),
    familyStatus: new Map(),
    misconceptionsEvidenced: new Set(),
    retrievalDueTags: new Set(),
    retrievalDueCapabilityIds: new Set(),
    ...overrides,
  };
}

function realContext(allLessons: readonly LessonPlan[] = realLessons): AssemblyContext {
  return { assemblyPolicyVersion: ASSEMBLY_POLICY_VERSION, allLessons };
}

function ok(scenarioId: string, label: string, contentSource: "real" | "synthetic", condition: boolean, detail: string): ScenarioResult {
  return { scenarioId, label, contentSource, passed: condition, detail };
}

// ---------------------------------------------------------------------
// A -- new learner, REAL content
// ---------------------------------------------------------------------
function scenarioA(): ScenarioResult {
  const result = assembleLessonInstance(LESSON_OHMS_LAW, evidence(), realContext());
  const expectedIncluded = LESSON_OHMS_LAW.steps.filter((s) => s.id !== "remediation_rearrangement").map((s) => s.id);
  const passed = result.status === "ready" && JSON.stringify(result.instance.includedStepIds) === JSON.stringify(expectedIncluded);
  return ok(
    "A",
    "New learner (no evidence): receives every required real step, remediation excluded pre-session",
    "real",
    passed,
    result.status === "ready" ? `included ${result.instance.includedStepIds.length}/${LESSON_OHMS_LAW.steps.length} steps` : `unexpected status '${result.status}'`,
  );
}

// ---------------------------------------------------------------------
// C -- wrong-operation misconception, REAL content, within-session branch
// ---------------------------------------------------------------------
function scenarioC(): ScenarioResult {
  const toRemediation = resolveWithinSessionBranch(LESSON_OHMS_LAW, "misconception_check_wrong_operation", {
    trigger: "misconception_detected",
    misconceptionIdentifier: "MIS-EL-OHM-WRONG-OPERATION-001",
  });
  const backToMain = resolveWithinSessionBranch(LESSON_OHMS_LAW, "remediation_rearrangement", { trigger: "remediation_cleared" });
  const noRouteOnPlainWrongAnswer = resolveWithinSessionBranch(LESSON_OHMS_LAW, "misconception_check_wrong_operation", {
    trigger: "misconception_detected",
  });
  const passed = toRemediation === "remediation_rearrangement" && backToMain === "plausibility_check_transfer" && noRouteOnPlainWrongAnswer === null;
  return ok(
    "C",
    "Wrong-operation misconception evidenced: routes to remediation_rearrangement, then remediation_cleared resumes at plausibility_check_transfer; a wrong answer alone (no misconception id) does not route",
    "real",
    passed,
    `-> ${toRemediation}, cleared -> ${backToMain}, plain-wrong -> ${noRouteOnPlainWrongAnswer}`,
  );
}

// ---------------------------------------------------------------------
// D -- rearrangement misconception, REAL content, within-session branch
// ---------------------------------------------------------------------
function scenarioD(): ScenarioResult {
  const toRemediation = resolveWithinSessionBranch(LESSON_OHMS_LAW, "misconception_check_rearrangement", {
    trigger: "misconception_detected",
    misconceptionIdentifier: "MIS-EL-OHM-REARRANGE-ERROR-001",
  });
  const wrongMisconceptionId = resolveWithinSessionBranch(LESSON_OHMS_LAW, "misconception_check_rearrangement", {
    trigger: "misconception_detected",
    misconceptionIdentifier: "MIS-EL-OHM-WRONG-OPERATION-001",
  });
  const passed = toRemediation === "remediation_rearrangement" && wrongMisconceptionId === null;
  return ok(
    "D",
    "Rearrangement misconception evidenced: routes to the same shared remediation_rearrangement step; a different misconception id on the same step does not route",
    "real",
    passed,
    `-> ${toRemediation}, different-id -> ${wrongMisconceptionId}`,
  );
}

// ---------------------------------------------------------------------
// E -- prerequisite weakness: REAL half (zero candidates -> unresolved)
// plus SYNTHETIC half (exactly one candidate -> prerequisite_required)
// ---------------------------------------------------------------------
export const SYNTHETIC_PREREQ_REMEDIATION: LessonPlan = {
  id: "lesson.synthetic.prove-lesson-assembly.algebraic-technique-remediation",
  schemaVersion: 1,
  version: 1,
  title: "SYNTHETIC -- algebraic technique remediation (proving fixture only)",
  learnerFacingDescription: "SYNTHETIC fixture: not a real governed lesson.",
  curriculumUnit: "synthetic.proving-fixtures",
  prerequisiteKnowledge: [],
  targetAssertionFamilyIds: ["foundational.algebraic_technique"],
  // Declares itself eligible to remediate the family (the SEPARATE,
  // narrower relationship prerequisite-resolution.ts actually resolves
  // against -- targetAssertionFamilyIds alone is not enough).
  remediationEligibility: [{ assertionFamilyId: "foundational.algebraic_technique", isDefaultRemediation: true }],
  targetAssertionIdentifiers: [],
  targetCapabilityIds: ["cap.synthetic.algebraic_technique"],
  estimatedDurationMinutes: 5,
  instructionalStrategy: "synthetic fixture",
  steps: [
    {
      id: "start",
      type: "orientation",
      purpose: "synthetic fixture step",
      requirement: "required",
      teaches: [],
      reinforces: [],
      tests: [],
      capabilityIds: [],
      misconceptionTargets: [],
      representation: {},
      presentation: { interactionRequired: false, answerReveal: "not_applicable", contentMayScroll: false, progressiveReveal: false },
      scaffoldingLevel: "guided",
      cognitiveDemand: "introductory",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "view_acknowledged",
      branchRoutes: [],
      evidenceEmitted: [],
    },
    {
      id: "end",
      type: "exit_completion",
      purpose: "synthetic fixture step",
      requirement: "required",
      teaches: [],
      reinforces: [],
      tests: [],
      capabilityIds: [],
      misconceptionTargets: [],
      representation: {},
      presentation: { interactionRequired: false, answerReveal: "not_applicable", contentMayScroll: false, progressiveReveal: false },
      scaffoldingLevel: "guided",
      cognitiveDemand: "introductory",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "view_acknowledged",
      branchRoutes: [],
      evidenceEmitted: [],
    },
  ],
  misconceptionTargets: [],
  retrievalTags: [],
  completionCriteria: { requiredStepIds: ["start", "end"], requiredCapabilityEvidence: ["cap.synthetic.algebraic_technique"], masteryGateCapabilityIds: ["cap.synthetic.algebraic_technique"], requiresRemediationClearance: true, exitSummary: "synthetic fixture" },
  presentationModes: ["learn"],
  contentRelease: LESSON_OHMS_LAW.contentRelease,
};

function scenarioE(): ScenarioResult {
  const weakEvidence = evidence({ familyStatus: new Map([["foundational.algebraic_technique", "WEAK"]]) });

  // CC-08 closes the real-content gap this scenario used to document: the
  // real corpus now contains lesson.foundation.maths.formula-rearrangement,
  // a real, governed remediationEligibility-declared default candidate for
  // foundational.algebraic_technique -- so a WEAK prerequisite now resolves
  // to prerequisite_required against REAL content, not merely "unresolved".
  // CC-08A: this is proven against LESSON_OHMS_LAW_UNIT202_V2 specifically
  // -- release.unit202.v1's own Ohm's Law entry is immutable and remains
  // exactly as originally shipped (no remediation candidate exists under
  // v1, since the foundation lesson is a v2-only member); the real
  // remediation relationship holds for the v2 release, where all four
  // CC-08 lessons genuinely coexist.
  const realResult = assembleLessonInstance(LESSON_OHMS_LAW_UNIT202_V2, weakEvidence, realContext());
  const realHalfPassed =
    realResult.status === "prerequisite_required" &&
    realResult.prerequisiteInstance.lessonId === "lesson.foundation.maths.formula-rearrangement" &&
    realResult.mainLessonPending.id === LESSON_OHMS_LAW_UNIT202_V2.id &&
    realResult.unmetFamilyId === "foundational.algebraic_technique";

  // A family with genuinely zero remediation candidates anywhere in the
  // corpus still resolves to prerequisite_unresolved rather than silently
  // proceeding or guessing -- proven with a synthetic family id no real or
  // synthetic lesson declares itself eligible for.
  const noRemediationEvidence = evidence({ familyStatus: new Map([["synthetic.family_with_no_remediation_lesson", "WEAK"]]) });
  const syntheticLessonTargetingUnresolvableFamily: LessonPlan = {
    ...LESSON_OHMS_LAW,
    id: "lesson.synthetic.prove-lesson-assembly.targets-unresolvable-family",
    prerequisiteKnowledge: ["synthetic.family_with_no_remediation_lesson"],
    remediationEligibility: [],
  };
  const syntheticResult = assembleLessonInstance(
    syntheticLessonTargetingUnresolvableFamily,
    noRemediationEvidence,
    realContext([...realLessons, syntheticLessonTargetingUnresolvableFamily]),
  );
  const syntheticHalfPassed =
    syntheticResult.status === "prerequisite_unresolved" &&
    syntheticResult.unresolved.length === 1 &&
    syntheticResult.unresolved[0]!.assertionFamilyId === "synthetic.family_with_no_remediation_lesson";

  // CC-08A: release.unit202.v1's OWN Ohm's Law entry -- the original,
  // immutable, un-extended release -- must still resolve exactly as it
  // did before CC-08 ever existed: zero remediation candidates, because
  // the foundation lesson was never added to v1 (it is a v2-only
  // member). This is the mechanical proof that v1 was not mutated.
  const v1Result = assembleLessonInstance(LESSON_OHMS_LAW, weakEvidence, realContext());
  const v1ImmutabilityHalfPassed = v1Result.status === "prerequisite_unresolved" && v1Result.unresolved.length === 1 && v1Result.unresolved[0]!.assertionFamilyId === "foundational.algebraic_technique";

  return ok(
    "E",
    "Prerequisite weakness: a WEAK foundational.algebraic_technique prerequisite resolves to prerequisite_required against the REAL formula-rearrangement lesson under release.unit202.v2 [REAL]; a family with genuinely zero remediation candidates still resolves to prerequisite_unresolved rather than guessing [SYNTHETIC]; release.unit202.v1's own unextended Ohm's Law entry still has zero candidates, proving v1 was not mutated [REAL]",
    "real",
    realHalfPassed && syntheticHalfPassed && v1ImmutabilityHalfPassed,
    `v2-half status='${realResult.status}' (passed=${realHalfPassed}), synthetic-half status='${syntheticResult.status}' (passed=${syntheticHalfPassed}), v1-immutability-half status='${v1Result.status}' (passed=${v1ImmutabilityHalfPassed})`,
  );
}

// ---------------------------------------------------------------------
// G -- same-input replay, REAL content
// ---------------------------------------------------------------------
function scenarioG(): ScenarioResult {
  const first = assembleLessonInstance(LESSON_OHMS_LAW, evidence({ learnerId: "learner.replay" }), realContext());
  const second = assembleLessonInstance(LESSON_OHMS_LAW, evidence({ learnerId: "learner.replay" }), realContext());
  const passed = first.status === "ready" && second.status === "ready" && JSON.stringify(first) === JSON.stringify(second);
  return ok(
    "G",
    "Same-input replay: two independent assemblies of the real lesson with identical evidence produce byte-identical instances (same instanceId, same decisions)",
    "real",
    passed,
    passed && first.status === "ready" ? `instanceId=${first.instance.instanceId}` : "instances diverged",
  );
}

// ---------------------------------------------------------------------
// B -- skip-if-mastered, SYNTHETIC (task brief §7/§20: do not distort
// the real lesson to exercise a mechanism it doesn't have)
// ---------------------------------------------------------------------
export function buildSyntheticSkipLesson(): LessonPlan {
  const practiceStep = {
    id: "practice",
    type: "guided_interaction" as const,
    purpose: "synthetic fixture step",
    requirement: "conditional_skip_if_mastered" as const,
    teaches: [],
    reinforces: [],
    tests: [],
    capabilityIds: ["cap.synthetic.skip_target"],
    misconceptionTargets: [],
    representation: {},
    presentation: { interactionRequired: true, answerReveal: "after_submission" as const, contentMayScroll: false, progressiveReveal: false },
    scaffoldingLevel: "standard" as const,
    cognitiveDemand: "intermediate" as const,
    feedback: { mode: "immediate" as const, explainWhy: true },
    completionCondition: "correct_answer_required" as const,
    branchRoutes: [],
    evidenceEmitted: ["cap.synthetic.skip_target"],
    masteryGateCapabilityId: "cap.synthetic.skip_target",
  };
  const exitStep = {
    id: "end",
    type: "exit_completion" as const,
    purpose: "synthetic fixture step",
    requirement: "required" as const,
    teaches: [],
    reinforces: [],
    tests: [],
    capabilityIds: [],
    misconceptionTargets: [],
    representation: {},
    presentation: { interactionRequired: false, answerReveal: "not_applicable" as const, contentMayScroll: false, progressiveReveal: false },
    scaffoldingLevel: "guided" as const,
    cognitiveDemand: "introductory" as const,
    feedback: { mode: "immediate" as const, explainWhy: true },
    completionCondition: "view_acknowledged" as const,
    branchRoutes: [],
    evidenceEmitted: [],
  };
  return {
    id: "lesson.synthetic.prove-lesson-assembly.skip-if-mastered",
    schemaVersion: 1,
    version: 1,
    title: "SYNTHETIC -- skip-if-mastered proving fixture",
    learnerFacingDescription: "SYNTHETIC fixture: not a real governed lesson.",
    curriculumUnit: "synthetic.proving-fixtures",
    prerequisiteKnowledge: [],
    targetAssertionFamilyIds: ["synthetic.skip_family"],
    remediationEligibility: [],
    targetAssertionIdentifiers: [],
    targetCapabilityIds: ["cap.synthetic.skip_target"],
    estimatedDurationMinutes: 5,
    instructionalStrategy: "synthetic fixture",
    steps: [practiceStep, exitStep],
    misconceptionTargets: [],
    retrievalTags: [],
    completionCriteria: { requiredStepIds: ["end"], requiredCapabilityEvidence: ["cap.synthetic.skip_target"], masteryGateCapabilityIds: ["cap.synthetic.skip_target"], requiresRemediationClearance: true, exitSummary: "synthetic fixture" },
    presentationModes: ["learn"],
    contentRelease: "synthetic-proving-fixtures.1",
  };
}

function scenarioB(): ScenarioResult {
  const lesson = buildSyntheticSkipLesson();
  const context: AssemblyContext = { assemblyPolicyVersion: ASSEMBLY_POLICY_VERSION, allLessons: [lesson] };

  const strongReturning = assembleLessonInstance(lesson, evidence({ capabilityStatus: new Map([["cap.synthetic.skip_target", "TRANSFER_SECURE"]]) }), context);
  const notYetMastered = assembleLessonInstance(lesson, evidence({ capabilityStatus: new Map([["cap.synthetic.skip_target", "EMERGING"]]) }), context);

  const passed =
    strongReturning.status === "ready" &&
    !strongReturning.instance.includedStepIds.includes("practice") &&
    notYetMastered.status === "ready" &&
    notYetMastered.instance.includedStepIds.includes("practice");

  return ok(
    "B",
    "[SYNTHETIC] Strong returning learner (TRANSFER_SECURE) skips a conditional_skip_if_mastered step; a not-yet-mastered learner still receives it",
    "synthetic",
    passed,
    `strong-returning includes practice=${strongReturning.status === "ready" ? strongReturning.instance.includedStepIds.includes("practice") : "n/a"}, not-yet-mastered includes practice=${notYetMastered.status === "ready" ? notYetMastered.instance.includedStepIds.includes("practice") : "n/a"}`,
  );
}

// ---------------------------------------------------------------------
// F -- retrieval due, SYNTHETIC (task brief §12/§20: the real lesson's
// retrieval_check is deliberately required, not conditional)
// ---------------------------------------------------------------------
export function buildSyntheticRetrievalLesson(): LessonPlan {
  const retrievalStep = {
    id: "retrieval",
    type: "retrieval_check" as const,
    purpose: "synthetic fixture step",
    requirement: "conditional_skip_if_mastered" as const,
    teaches: [],
    reinforces: [],
    tests: [],
    capabilityIds: ["cap.synthetic.retrieval_target"],
    misconceptionTargets: [],
    representation: {},
    presentation: { interactionRequired: true, answerReveal: "after_submission" as const, contentMayScroll: false, progressiveReveal: false },
    scaffoldingLevel: "independent" as const,
    cognitiveDemand: "intermediate" as const,
    feedback: { mode: "immediate" as const, explainWhy: true },
    completionCondition: "correct_answer_required" as const,
    branchRoutes: [],
    evidenceEmitted: ["cap.synthetic.retrieval_target"],
  };
  const exitStep = {
    id: "end",
    type: "exit_completion" as const,
    purpose: "synthetic fixture step",
    requirement: "required" as const,
    teaches: [],
    reinforces: [],
    tests: [],
    capabilityIds: [],
    misconceptionTargets: [],
    representation: {},
    presentation: { interactionRequired: false, answerReveal: "not_applicable" as const, contentMayScroll: false, progressiveReveal: false },
    scaffoldingLevel: "guided" as const,
    cognitiveDemand: "introductory" as const,
    feedback: { mode: "immediate" as const, explainWhy: true },
    completionCondition: "view_acknowledged" as const,
    branchRoutes: [],
    evidenceEmitted: [],
  };
  return {
    id: "lesson.synthetic.prove-lesson-assembly.retrieval-due",
    schemaVersion: 1,
    version: 1,
    title: "SYNTHETIC -- retrieval-due proving fixture",
    learnerFacingDescription: "SYNTHETIC fixture: not a real governed lesson.",
    curriculumUnit: "synthetic.proving-fixtures",
    prerequisiteKnowledge: [],
    targetAssertionFamilyIds: ["synthetic.retrieval_family"],
    remediationEligibility: [],
    targetAssertionIdentifiers: [],
    targetCapabilityIds: ["cap.synthetic.retrieval_target"],
    estimatedDurationMinutes: 5,
    instructionalStrategy: "synthetic fixture",
    steps: [retrievalStep, exitStep],
    misconceptionTargets: [],
    retrievalTags: ["synthetic.retrieval_tag"],
    completionCriteria: { requiredStepIds: ["end"], requiredCapabilityEvidence: ["cap.synthetic.retrieval_target"], masteryGateCapabilityIds: ["cap.synthetic.retrieval_target"], requiresRemediationClearance: true, exitSummary: "synthetic fixture" },
    presentationModes: ["learn"],
    contentRelease: "synthetic-proving-fixtures.1",
  };
}

function scenarioF(): ScenarioResult {
  const lesson = buildSyntheticRetrievalLesson();
  const context: AssemblyContext = { assemblyPolicyVersion: ASSEMBLY_POLICY_VERSION, allLessons: [lesson] };

  const due = assembleLessonInstance(lesson, evidence({ retrievalDueTags: new Set(["synthetic.retrieval_tag"]) }), context);
  const notDue = assembleLessonInstance(lesson, evidence(), context);

  const passed =
    due.status === "ready" &&
    due.instance.includedStepIds.includes("retrieval") &&
    notDue.status === "ready" &&
    !notDue.instance.includedStepIds.includes("retrieval");

  return ok(
    "F",
    "[SYNTHETIC] A due retrieval tag includes the retrieval_check step; nothing due omits it",
    "synthetic",
    passed,
    `due includes retrieval=${due.status === "ready" ? due.instance.includedStepIds.includes("retrieval") : "n/a"}, not-due includes retrieval=${notDue.status === "ready" ? notDue.instance.includedStepIds.includes("retrieval") : "n/a"}`,
  );
}

export function buildReport(): LessonAssemblyProvingReport {
  return {
    scenarios: [scenarioA(), scenarioB(), scenarioC(), scenarioD(), scenarioE(), scenarioF(), scenarioG()],
    realContentGaps: REAL_CONTENT_GAPS,
  };
}

export function isReportClean(report: LessonAssemblyProvingReport): boolean {
  return report.scenarios.every((s) => s.passed);
}

export function formatReport(report: LessonAssemblyProvingReport): string {
  const lines: string[] = [];
  lines.push("Lesson assembly engine proving report -- real Ohm's Law content + synthetic mechanism proofs");
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
  const clean = isReportClean(report);
  console.log("");
  console.log(clean ? "PASS: every lesson-assembly scenario resolved as expected." : "FAIL: see above.");
  if (process.argv.includes("--check") && !clean) {
    process.exit(1);
  }
}
