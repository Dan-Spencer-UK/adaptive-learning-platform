/**
 * Deterministic content-dependency resolution for a canonical LessonPlan
 * (task brief §25C: "getLessonContentDependencies(...) -> stable
 * dependency manifest"). Pure, synchronous, no I/O -- this module only
 * answers "what governed content ids does this lesson reference", never
 * "is that content actually stored locally" (a mobile/storage concern,
 * deliberately left to the caller; see apps/mobile's local content-
 * library store). Mirrors this package's existing "pure function over
 * governed content in, deterministic data out" discipline
 * (./assembler.ts, ./prerequisite-resolution.ts).
 *
 * Every category walked here corresponds to a real reference field on
 * `LessonPlan`/`LessonStep` (@alp/content-schema's lesson-plan.ts) --
 * nothing here invents a new reference kind.
 */

import type { LessonPlan, LessonStep } from "@alp/content-schema";

export interface LessonContentDependencyManifest {
  readonly lessonId: string;
  readonly lessonVersion: number;
  readonly contentRelease: string;
  readonly assertionFamilyIds: readonly string[];
  readonly assertionIdentifiers: readonly string[];
  readonly capabilityIds: readonly string[];
  readonly questionBlueprintIds: readonly string[];
  readonly formulaFamilyIds: readonly string[];
  readonly workedExampleBlueprintIds: readonly string[];
  readonly visualAidBlueprintIds: readonly string[];
  readonly diagramBlueprintIds: readonly string[];
  readonly misconceptionIdentifiers: readonly string[];
}

function sortedUnique(ids: Iterable<string>): readonly string[] {
  return [...new Set(ids)].sort((a, b) => a.localeCompare(b));
}

function stepContributions(step: LessonStep) {
  const assertionFamilyIds = step.assertionFamilyId ? [step.assertionFamilyId] : [];
  const assertionIdentifiers = [...step.teaches, ...step.reinforces, ...step.tests];
  const capabilityIds = [...step.capabilityIds, ...step.evidenceEmitted];
  const questionBlueprintIds = step.questionBlueprintId ? [step.questionBlueprintId] : [];
  const formulaFamilyIds = step.representation.formulaFamilyId ? [step.representation.formulaFamilyId] : [];
  const workedExampleBlueprintIds = step.representation.workedExampleBlueprintId ? [step.representation.workedExampleBlueprintId] : [];
  const visualAidBlueprintIds = step.representation.visualAidBlueprintId ? [step.representation.visualAidBlueprintId] : [];
  const diagramBlueprintIds = step.representation.diagramBlueprintId ? [step.representation.diagramBlueprintId] : [];
  const misconceptionIdentifiers = step.misconceptionTargets.map((m) => m.misconceptionIdentifier);
  return {
    assertionFamilyIds,
    assertionIdentifiers,
    capabilityIds,
    questionBlueprintIds,
    formulaFamilyIds,
    workedExampleBlueprintIds,
    visualAidBlueprintIds,
    diagramBlueprintIds,
    misconceptionIdentifiers,
  };
}

/**
 * Walks every governed reference field on the lesson and its steps and
 * returns a stable, deduplicated, sorted manifest of the content ids
 * required to execute it. Determinism: same lesson always produces the
 * same manifest, regardless of iteration/object-key order (categories
 * are sorted, never insertion-ordered).
 */
export function computeLessonContentDependencies(lesson: LessonPlan): LessonContentDependencyManifest {
  const perStep = lesson.steps.map(stepContributions);

  return {
    lessonId: lesson.id,
    lessonVersion: lesson.version,
    contentRelease: lesson.contentRelease,
    assertionFamilyIds: sortedUnique([
      ...lesson.targetAssertionFamilyIds,
      ...lesson.prerequisiteKnowledge,
      ...lesson.remediationEligibility.map((e) => e.assertionFamilyId),
      ...perStep.flatMap((s) => s.assertionFamilyIds),
    ]),
    assertionIdentifiers: sortedUnique([...lesson.targetAssertionIdentifiers, ...perStep.flatMap((s) => s.assertionIdentifiers)]),
    capabilityIds: sortedUnique([
      ...lesson.targetCapabilityIds,
      ...lesson.completionCriteria.requiredCapabilityEvidence,
      ...perStep.flatMap((s) => s.capabilityIds),
    ]),
    questionBlueprintIds: sortedUnique(perStep.flatMap((s) => s.questionBlueprintIds)),
    formulaFamilyIds: sortedUnique(perStep.flatMap((s) => s.formulaFamilyIds)),
    workedExampleBlueprintIds: sortedUnique(perStep.flatMap((s) => s.workedExampleBlueprintIds)),
    visualAidBlueprintIds: sortedUnique(perStep.flatMap((s) => s.visualAidBlueprintIds)),
    diagramBlueprintIds: sortedUnique(perStep.flatMap((s) => s.diagramBlueprintIds)),
    misconceptionIdentifiers: sortedUnique([
      ...lesson.misconceptionTargets.map((m) => m.misconceptionIdentifier),
      ...perStep.flatMap((s) => s.misconceptionIdentifiers),
    ]),
  };
}
