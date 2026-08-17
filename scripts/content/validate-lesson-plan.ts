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

import { knowledgeGraphManifestSchema, pedagogyManifestSchema, lessonPlanManifestSchema } from "@alp/content-schema";

import { cc04Unit202ElectricalScience } from "./data/cc04-unit202-electrical-science.ts";
import { cc05aPedagogyUnit202 } from "./data/cc05a-pedagogy-unit202.ts";
import { lessons } from "./data/lesson-ohms-law.ts";

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
  ambiguousPrimaryFamilyTargets: string[];
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

function buildReport(): LessonPlanReport {
  const corpus = knowledgeGraphManifestSchema.parse(cc04Unit202ElectricalScience);
  const pedagogy = pedagogyManifestSchema.parse(cc05aPedagogyUnit202);
  const manifest = lessonPlanManifestSchema.parse({ lessons });

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
  const ambiguousPrimaryFamilyTargets: string[] = [];

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
    for (const m of lesson.misconceptionTargets) checkMisconception(m.misconceptionIdentifier, `${lesson.id}.misconceptionTargets`);
    for (const capabilityId of lesson.completionCriteria.requiredCapabilityEvidence) {
      checkCapability(capabilityId, `${lesson.id}.completionCriteria.requiredCapabilityEvidence`);
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

  // Manifest uniqueness invariant (@alp/learning-engine's
  // resolvePrerequisiteCandidate resolution rule, see
  // packages/learning-engine/src/prerequisite-resolution.ts): for a
  // given content release, at most one lesson may declare a given
  // assertion family among its targetAssertionFamilyIds -- otherwise a
  // learner whose evidence shows that family as weak has no
  // deterministic single remediation lesson to route to. The engine
  // re-verifies this defensively at runtime and throws rather than
  // guessing, but a valid manifest should never reach that path.
  const familyTargetsByReleaseAndFamily = new Map<string, string[]>();
  for (const lesson of manifest.lessons) {
    for (const familyId of lesson.targetAssertionFamilyIds) {
      const key = `${lesson.contentRelease}::${familyId}`;
      if (!familyTargetsByReleaseAndFamily.has(key)) familyTargetsByReleaseAndFamily.set(key, []);
      familyTargetsByReleaseAndFamily.get(key)!.push(lesson.id);
    }
  }
  for (const [key, lessonIds] of familyTargetsByReleaseAndFamily) {
    if (lessonIds.length > 1) {
      const [contentRelease, familyId] = key.split("::");
      ambiguousPrimaryFamilyTargets.push(
        `content release '${contentRelease}': assertion family '${familyId}' is targeted by ${lessonIds.length} lessons (${lessonIds.join(", ")}) -- must be at most 1 for deterministic prerequisite-remediation resolution`,
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
    ambiguousPrimaryFamilyTargets,
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
    ["Ambiguous primary family targets (prerequisite-resolution uniqueness)", report.ambiguousPrimaryFamilyTargets],
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
    report.ambiguousPrimaryFamilyTargets.length === 0
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
