/**
 * Mechanical cross-reference/coverage validation for governed Lesson
 * Plans (@alp/content-schema's lesson-plan.ts) against the live CC-05A
 * pedagogical manifest and CC-04 knowledge graph. Mirrors
 * validate-pedagogy.ts's discipline exactly: never trust a lesson's own
 * claim that a reference is valid -- every id is independently looked up
 * in the real corpus. lessonPlanSchema/lessonPlanManifestSchema already
 * enforce *internal* structural integrity (duplicate ids, branch targets
 * existing within the same lesson, completion-criteria step references)
 * via their own `superRefine` -- this script is exactly the layer
 * pedagogy.ts leaves to validate-pedagogy.ts: cross-corpus reference
 * integrity content-schema itself must stay independent of.
 *
 * Usage:
 *   node scripts/content/validate-lesson-plan.ts            (print report)
 *   node scripts/content/validate-lesson-plan.ts --check     (exit 1 on any gate)
 */

import { fileURLToPath } from "node:url";

import { contentReleaseManifestSchema, knowledgeGraphManifestSchema, pedagogyManifestSchema, lessonPlanManifestSchema } from "@alp/content-schema";

import { CC04_KNOWLEDGE_CORPUS_ID, cc04Unit202ElectricalScience } from "./data/cc04-unit202-electrical-science.ts";
import { CC05A_PEDAGOGY_CORPUS_ID, cc05aPedagogyUnit202 } from "./data/cc05a-pedagogy-unit202.ts";
import { contentReleases } from "./data/content-releases.ts";
import { lessons } from "./data/lessons.ts";

interface LessonPlanReport {
  totalLessons: number;
  totalSteps: number;
  danglingAssertionFamilyRefs: string[];
  danglingAssertionIdentifierRefs: string[];
  danglingCapabilityRefs: string[];
  danglingQuestionBlueprintRefs: string[];
  danglingFormulaFamilyRefs: string[];
  danglingDiagramBlueprintRefs: string[];
  danglingWorkedExampleRefs: string[];
  danglingVisualAidRefs: string[];
  danglingMisconceptionRefs: string[];
  assessableStepsMissingAssessmentReference: string[];
  teachingStepsWithNoGovernedReference: string[];
  unreachableConditionalSteps: string[];
  circularRemediationRoutes: string[];
  lessonsWithNoExitStep: string[];
  ambiguousRemediationCandidates: string[];
  undeclaredContentReleaseRefs: string[];
  releaseMembershipMismatches: string[];
  releaseCorpusMismatches: string[];
  danglingMasteryGateCapabilityRefs: string[];
}

/**
 * A step needs a governed question-blueprint reference when it actually
 * requires deterministic marking of a correct answer -- not merely
 * because of its step `type`. An ungraded predictive/reflective DO (e.g.
 * `completionCondition: "answer_submitted"`, no right/wrong marking) is
 * legitimately assessable-shaped without a marking contract; forcing a
 * question-blueprint reference onto it would misrepresent it as scored.
 */
function requiresQuestionBlueprint(step: { completionCondition: string }): boolean {
  return step.completionCondition === "correct_answer_required";
}

/**
 * Builds the full governance report against the live corpus. `overrides`
 * exists ONLY for tests to inject deliberately-defective lesson/release
 * inputs and prove the mechanical gates fire; production/CLI use never
 * passes it.
 */
function buildReport(overrides?: {
  readonly lessons?: typeof lessons;
  readonly releases?: typeof contentReleases;
}): LessonPlanReport {
  const corpus = knowledgeGraphManifestSchema.parse(cc04Unit202ElectricalScience);
  const pedagogy = pedagogyManifestSchema.parse(cc05aPedagogyUnit202);
  const lessonInputs = overrides?.lessons ?? lessons;
  const manifest = lessonPlanManifestSchema.parse({ lessons: lessonInputs });
  const releaseManifest = contentReleaseManifestSchema.parse(overrides?.releases ?? contentReleases);

  const realAssertionIds = new Set(corpus.assertions.map((a) => a.identifier));
  const realMisconceptionIds = new Set(corpus.misconceptions.map((m) => m.identifier));
  const realFamilyIds = new Set(pedagogy.assertionFamilies.map((f) => f.id));
  const realCapabilityIds = new Set(pedagogy.capabilities.map((c) => c.id));
  const realQuestionBlueprintIds = new Set(pedagogy.questionBlueprints.map((q) => q.id));
  const realFormulaFamilyIds = new Set(pedagogy.formulaFamilies.map((f) => f.id));
  const realDiagramBlueprintIds = new Set(pedagogy.diagramBlueprints.map((d) => d.id));
  const realWorkedExampleIds = new Set(pedagogy.workedExampleBlueprints.map((w) => w.id));
  const realVisualAidIds = new Set(pedagogy.visualAidBlueprints.map((v) => v.id));

  const danglingAssertionFamilyRefs: string[] = [];
  const danglingAssertionIdentifierRefs: string[] = [];
  const danglingCapabilityRefs: string[] = [];
  const danglingQuestionBlueprintRefs: string[] = [];
  const danglingFormulaFamilyRefs: string[] = [];
  const danglingDiagramBlueprintRefs: string[] = [];
  const danglingWorkedExampleRefs: string[] = [];
  const danglingVisualAidRefs: string[] = [];
  const danglingMisconceptionRefs: string[] = [];
  const assessableStepsMissingAssessmentReference: string[] = [];
  const teachingStepsWithNoGovernedReference: string[] = [];
  const unreachableConditionalSteps: string[] = [];
  const circularRemediationRoutes: string[] = [];
  const lessonsWithNoExitStep: string[] = [];
  const ambiguousRemediationCandidates: string[] = [];
  const undeclaredContentReleaseRefs: string[] = [];
  const releaseMembershipMismatches: string[] = [];
  const releaseCorpusMismatches: string[] = [];
  const danglingMasteryGateCapabilityRefs: string[] = [];

  // ---- Content-release gates (CC-06D, Correction A) -------------------
  // A lesson's `contentRelease` claim is never trusted: the release must
  // be declared in the governed release manifest, the (lessonId, version)
  // pair must appear in that release's own membership, every declared
  // member must actually exist in the lesson manifest, and the release's
  // corpus references must name the exact corpus snapshots this validator
  // is running against.
  const releasesById = new Map(releaseManifest.releases.map((r) => [r.id, r]));
  for (const lesson of lessonInputs) {
    const release = releasesById.get(lesson.contentRelease);
    if (!release) {
      undeclaredContentReleaseRefs.push(`${lesson.id}: contentRelease '${lesson.contentRelease}' is not a declared governed content release`);
      continue;
    }
    const membership = release.lessons.find((m) => m.lessonId === lesson.id);
    if (!membership) {
      releaseMembershipMismatches.push(`${lesson.id}@${lesson.version} claims release '${release.id}' but is not in that release's membership`);
    } else if (membership.lessonVersion !== lesson.version) {
      releaseMembershipMismatches.push(
        `${lesson.id}@${lesson.version} claims release '${release.id}' but that release declares version ${membership.lessonVersion} of this lesson`,
      );
    }
  }
  for (const release of releaseManifest.releases) {
    for (const member of release.lessons) {
      // CC-08A: matched on (id, version, contentRelease===release.id), never
      // id alone -- the same immutable lesson content may legitimately be a
      // member of more than one release (see lessonPlanManifestSchema's
      // duplicate-detection comment), so an id-only lookup could silently
      // resolve to the WRONG release's entry when more than one exists.
      const lesson = lessonInputs.find((l) => l.id === member.lessonId && l.version === member.lessonVersion && l.contentRelease === release.id);
      if (!lesson) {
        releaseMembershipMismatches.push(`release '${release.id}' declares member '${member.lessonId}@${member.lessonVersion}' but no lesson manifest entry has that id/version and claims contentRelease '${release.id}'`);
      }
    }
    if (release.knowledgeCorpusId !== CC04_KNOWLEDGE_CORPUS_ID) {
      releaseCorpusMismatches.push(`release '${release.id}' references knowledge corpus '${release.knowledgeCorpusId}' but the live corpus is '${CC04_KNOWLEDGE_CORPUS_ID}'`);
    }
    if (release.pedagogyCorpusId !== CC05A_PEDAGOGY_CORPUS_ID) {
      releaseCorpusMismatches.push(`release '${release.id}' references pedagogy corpus '${release.pedagogyCorpusId}' but the live corpus is '${CC05A_PEDAGOGY_CORPUS_ID}'`);
    }
  }

  let totalSteps = 0;

  for (const lesson of manifest.lessons) {
    const checkFamily = (id: string, where: string) => {
      if (!realFamilyIds.has(id)) danglingAssertionFamilyRefs.push(`${where}: unknown assertion family '${id}'`);
    };
    const checkAssertion = (id: string, where: string) => {
      if (!realAssertionIds.has(id)) danglingAssertionIdentifierRefs.push(`${where}: unknown assertion identifier '${id}'`);
    };
    const checkCapability = (id: string, where: string) => {
      if (!realCapabilityIds.has(id)) danglingCapabilityRefs.push(`${where}: unknown capability '${id}'`);
    };
    const checkMisconception = (id: string, where: string) => {
      if (!realMisconceptionIds.has(id)) danglingMisconceptionRefs.push(`${where}: unknown misconception '${id}'`);
    };

    for (const familyId of lesson.targetAssertionFamilyIds) checkFamily(familyId, `${lesson.id}.targetAssertionFamilyIds`);
    for (const assertionId of lesson.targetAssertionIdentifiers) checkAssertion(assertionId, `${lesson.id}.targetAssertionIdentifiers`);
    for (const capabilityId of lesson.targetCapabilityIds) checkCapability(capabilityId, `${lesson.id}.targetCapabilityIds`);
    for (const familyId of lesson.prerequisiteKnowledge) checkFamily(familyId, `${lesson.id}.prerequisiteKnowledge`);
    for (const entry of lesson.remediationEligibility) checkFamily(entry.assertionFamilyId, `${lesson.id}.remediationEligibility`);
    for (const m of lesson.misconceptionTargets) checkMisconception(m.misconceptionIdentifier, `${lesson.id}.misconceptionTargets`);
    for (const capabilityId of lesson.completionCriteria.requiredCapabilityEvidence) {
      checkCapability(capabilityId, `${lesson.id}.completionCriteria.requiredCapabilityEvidence`);
    }
    // CC-08A: independently re-verified against the real corpus, never
    // trusted merely because the schema already enforces
    // masteryGateCapabilityIds ⊆ requiredCapabilityEvidence.
    for (const capabilityId of lesson.completionCriteria.masteryGateCapabilityIds) {
      checkCapability(capabilityId, `${lesson.id}.completionCriteria.masteryGateCapabilityIds`);
    }

    if (!lesson.steps.some((s) => s.type === "exit_completion")) {
      lessonsWithNoExitStep.push(lesson.id);
    }

    const conditionalStepIds = new Set(lesson.steps.filter((s) => s.requirement !== "required").map((s) => s.id));
    const branchTargets = new Set<string>();
    // Remediation-trigger edges only (excludes "remediation_cleared", the intentional exit-the-remediation edge) for cycle detection.
    const remediationEdges = new Map<string, Set<string>>();

    for (const step of lesson.steps) {
      totalSteps++;
      const where = `${lesson.id}.${step.id}`;

      if (step.assertionFamilyId) checkFamily(step.assertionFamilyId, where);
      for (const id of step.teaches) checkAssertion(id, `${where}.teaches`);
      for (const id of step.reinforces) checkAssertion(id, `${where}.reinforces`);
      for (const id of step.tests) checkAssertion(id, `${where}.tests`);
      for (const id of step.capabilityIds) checkCapability(id, `${where}.capabilityIds`);
      for (const id of step.evidenceEmitted) checkCapability(id, `${where}.evidenceEmitted`);
      if (step.masteryGateCapabilityId && !realCapabilityIds.has(step.masteryGateCapabilityId)) {
        danglingMasteryGateCapabilityRefs.push(`${where}.masteryGateCapabilityId: unknown capability '${step.masteryGateCapabilityId}'`);
      }
      for (const m of step.misconceptionTargets) checkMisconception(m.misconceptionIdentifier, `${where}.misconceptionTargets`);

      if (step.representation.formulaFamilyId && !realFormulaFamilyIds.has(step.representation.formulaFamilyId)) {
        danglingFormulaFamilyRefs.push(`${where}: unknown formula family '${step.representation.formulaFamilyId}'`);
      }
      if (step.representation.diagramBlueprintId && !realDiagramBlueprintIds.has(step.representation.diagramBlueprintId)) {
        danglingDiagramBlueprintRefs.push(`${where}: unknown diagram blueprint '${step.representation.diagramBlueprintId}'`);
      }
      if (step.representation.workedExampleBlueprintId && !realWorkedExampleIds.has(step.representation.workedExampleBlueprintId)) {
        danglingWorkedExampleRefs.push(`${where}: unknown worked-example blueprint '${step.representation.workedExampleBlueprintId}'`);
      }
      if (step.representation.visualAidBlueprintId && !realVisualAidIds.has(step.representation.visualAidBlueprintId)) {
        danglingVisualAidRefs.push(`${where}: unknown visual-aid blueprint '${step.representation.visualAidBlueprintId}'`);
      }
      if (step.questionBlueprintId && !realQuestionBlueprintIds.has(step.questionBlueprintId)) {
        danglingQuestionBlueprintRefs.push(`${where}: unknown question blueprint '${step.questionBlueprintId}'`);
      }

      if (requiresQuestionBlueprint(step) && !step.questionBlueprintId) {
        assessableStepsMissingAssessmentReference.push(`${where} (type '${step.type}') requires a correct answer but has no questionBlueprintId`);
      }

      if (step.teaches.length > 0 && step.capabilityIds.length === 0 && Object.keys(step.representation).length === 0) {
        teachingStepsWithNoGovernedReference.push(`${where} teaches ${JSON.stringify(step.teaches)} but references no capability or representation`);
      }

      for (const route of step.branchRoutes) {
        branchTargets.add(route.destinationStepId);
        if (route.trigger !== "remediation_cleared") {
          if (!remediationEdges.has(step.id)) remediationEdges.set(step.id, new Set());
          remediationEdges.get(step.id)!.add(route.destinationStepId);
        }
      }
    }

    for (const conditionalId of conditionalStepIds) {
      if (!branchTargets.has(conditionalId)) {
        unreachableConditionalSteps.push(`${lesson.id}.${conditionalId} is conditional but is never the destination of any branch route`);
      }
    }

    // Cycle detection over remediation-trigger edges only (DFS, small graphs).
    const visiting = new Set<string>();
    const visited = new Set<string>();
    const detectCycle = (nodeId: string, path: string[]): boolean => {
      if (visiting.has(nodeId)) {
        circularRemediationRoutes.push(`${lesson.id}: circular remediation route ${[...path, nodeId].join(" -> ")}`);
        return true;
      }
      if (visited.has(nodeId)) return false;
      visiting.add(nodeId);
      for (const next of remediationEdges.get(nodeId) ?? []) {
        if (detectCycle(next, [...path, nodeId])) return true;
      }
      visiting.delete(nodeId);
      visited.add(nodeId);
      return false;
    };
    for (const step of lesson.steps) detectCycle(step.id, []);
  }

  // Deterministic remediation-selection invariant (@alp/learning-engine's
  // resolvePrerequisiteCandidate resolution rule, see
  // packages/learning-engine/src/prerequisite-resolution.ts). This is
  // NOT about targetAssertionFamilyIds -- many ordinary lessons (an
  // introduction, a refresher, exam revision, retrieval practice, ...)
  // may freely share the same target family with no ambiguity at all,
  // and that overlap must never be flagged here. It is about the
  // separate, narrower, opt-in `remediationEligibility` relationship: for
  // a given (contentRelease, assertionFamilyId), zero or one eligible
  // lesson resolves trivially; two or more eligible lessons require
  // EXACTLY ONE of them to be marked `isDefaultRemediation` for that
  // family, or the assembler has no deterministic way to choose. This
  // mirrors (recomputes independently of, never trusts) the engine's own
  // resolution algorithm so authoring-time feedback matches runtime
  // behaviour exactly.
  const remediationCandidatesByReleaseAndFamily = new Map<string, Array<{ lessonId: string; isDefault: boolean }>>();
  for (const lesson of manifest.lessons) {
    for (const entry of lesson.remediationEligibility) {
      const key = `${lesson.contentRelease}::${entry.assertionFamilyId}`;
      if (!remediationCandidatesByReleaseAndFamily.has(key)) remediationCandidatesByReleaseAndFamily.set(key, []);
      remediationCandidatesByReleaseAndFamily.get(key)!.push({ lessonId: lesson.id, isDefault: entry.isDefaultRemediation });
    }
  }
  for (const [key, candidates] of remediationCandidatesByReleaseAndFamily) {
    if (candidates.length < 2) continue;
    const [contentRelease, familyId] = key.split("::");
    const defaults = candidates.filter((c) => c.isDefault);
    if (defaults.length > 1) {
      ambiguousRemediationCandidates.push(
        `content release '${contentRelease}': assertion family '${familyId}' has ${defaults.length} lessons marked as the default remediation candidate (${defaults.map((d) => d.lessonId).join(", ")}) -- exactly one default is required when multiple lessons are remediation-eligible for this family`,
      );
    } else if (defaults.length === 0) {
      ambiguousRemediationCandidates.push(
        `content release '${contentRelease}': assertion family '${familyId}' has ${candidates.length} remediation-eligible lessons (${candidates.map((c) => c.lessonId).join(", ")}) but none is designated the default -- deterministic selection requires exactly one default when more than one candidate exists`,
      );
    }
  }

  return {
    totalLessons: manifest.lessons.length,
    totalSteps,
    danglingAssertionFamilyRefs,
    danglingAssertionIdentifierRefs,
    danglingCapabilityRefs,
    danglingQuestionBlueprintRefs,
    danglingFormulaFamilyRefs,
    danglingDiagramBlueprintRefs,
    danglingWorkedExampleRefs,
    danglingVisualAidRefs,
    danglingMisconceptionRefs,
    assessableStepsMissingAssessmentReference,
    teachingStepsWithNoGovernedReference,
    unreachableConditionalSteps,
    circularRemediationRoutes,
    lessonsWithNoExitStep,
    ambiguousRemediationCandidates,
    undeclaredContentReleaseRefs,
    releaseMembershipMismatches,
    releaseCorpusMismatches,
    danglingMasteryGateCapabilityRefs,
  };
}

function formatReport(report: LessonPlanReport): string {
  const lines: string[] = [];
  lines.push("Lesson Plan governance report");
  lines.push("==============================");
  lines.push(`Lessons: ${report.totalLessons}, total steps: ${report.totalSteps}`);
  const gateGroups: Array<[string, string[]]> = [
    ["Dangling assertion-family references", report.danglingAssertionFamilyRefs],
    ["Dangling assertion-identifier references", report.danglingAssertionIdentifierRefs],
    ["Dangling capability references", report.danglingCapabilityRefs],
    ["Dangling question-blueprint references", report.danglingQuestionBlueprintRefs],
    ["Dangling formula-family references", report.danglingFormulaFamilyRefs],
    ["Dangling diagram-blueprint references", report.danglingDiagramBlueprintRefs],
    ["Dangling worked-example references", report.danglingWorkedExampleRefs],
    ["Dangling visual-aid references", report.danglingVisualAidRefs],
    ["Dangling misconception references", report.danglingMisconceptionRefs],
    ["Assessable steps missing a question-blueprint reference", report.assessableStepsMissingAssessmentReference],
    ["Teaching steps with no governed reference at all", report.teachingStepsWithNoGovernedReference],
    ["Unreachable conditional steps", report.unreachableConditionalSteps],
    ["Circular remediation routes", report.circularRemediationRoutes],
    ["Lessons with no exit_completion step", report.lessonsWithNoExitStep],
    ["Ambiguous remediation candidates (no unique default among multiple eligible lessons)", report.ambiguousRemediationCandidates],
    ["Undeclared content-release references", report.undeclaredContentReleaseRefs],
    ["Release membership mismatches", report.releaseMembershipMismatches],
    ["Release corpus mismatches", report.releaseCorpusMismatches],
    ["Dangling mastery-gate capability references", report.danglingMasteryGateCapabilityRefs],
  ];
  for (const [label, items] of gateGroups) {
    lines.push(`${label} (target 0): ${items.length}`);
    if (items.length) lines.push(`    ${items.join("; ")}`);
  }
  return lines.join("\n");
}

export function isReportClean(report: LessonPlanReport): boolean {
  return (
    report.danglingAssertionFamilyRefs.length === 0 &&
    report.danglingAssertionIdentifierRefs.length === 0 &&
    report.danglingCapabilityRefs.length === 0 &&
    report.danglingQuestionBlueprintRefs.length === 0 &&
    report.danglingFormulaFamilyRefs.length === 0 &&
    report.danglingDiagramBlueprintRefs.length === 0 &&
    report.danglingWorkedExampleRefs.length === 0 &&
    report.danglingVisualAidRefs.length === 0 &&
    report.danglingMisconceptionRefs.length === 0 &&
    report.assessableStepsMissingAssessmentReference.length === 0 &&
    report.teachingStepsWithNoGovernedReference.length === 0 &&
    report.unreachableConditionalSteps.length === 0 &&
    report.circularRemediationRoutes.length === 0 &&
    report.lessonsWithNoExitStep.length === 0 &&
    report.ambiguousRemediationCandidates.length === 0 &&
    report.undeclaredContentReleaseRefs.length === 0 &&
    report.releaseMembershipMismatches.length === 0 &&
    report.releaseCorpusMismatches.length === 0 &&
    report.danglingMasteryGateCapabilityRefs.length === 0
  );
}

export { buildReport, formatReport };
export type { LessonPlanReport };

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
  console.log(clean ? "PASS: all lesson-plan governance gates are zero." : "FAIL: one or more lesson-plan governance gates are non-zero.");
  if (process.argv.includes("--check") && !clean) {
    process.exit(1);
  }
}
