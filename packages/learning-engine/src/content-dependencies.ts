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

/**
 * CC-13C.2B: the `contentBlocks` counterpart of the legacy
 * `representation.*` single-reference fields above -- a step's rich
 * teaching content may reference formula/worked-example/diagram/visual-aid
 * governed content just like `representation` does, and those references
 * must contribute to the SAME dependency categories (never a second,
 * parallel dependency shape). Only the 4 governed-content-bearing block
 * types (`formula`/`worked_example`/`visual`) contribute anything here --
 * `paragraph`/`list`/`callout` carry no id references by design (CC-13C.2B
 * task brief §9: section-level `teaches`/`reinforces`/`tests` remain the
 * grounding authority, never a per-paragraph mapping).
 */
function contentBlockContributions(step: LessonStep) {
  const formulaFamilyIds: string[] = [];
  const workedExampleBlueprintIds: string[] = [];
  const visualAidBlueprintIds: string[] = [];
  const diagramBlueprintIds: string[] = [];
  for (const block of step.contentBlocks ?? []) {
    if (block.type === "formula") {
      formulaFamilyIds.push(block.formulaFamilyId);
    } else if (block.type === "worked_example") {
      workedExampleBlueprintIds.push(block.workedExampleBlueprintId);
    } else if (block.type === "visual") {
      if (block.source.kind === "diagram") diagramBlueprintIds.push(block.source.diagramBlueprintId);
      else visualAidBlueprintIds.push(block.source.visualAidBlueprintId);
    }
  }
  return { formulaFamilyIds, workedExampleBlueprintIds, visualAidBlueprintIds, diagramBlueprintIds };
}

function stepContributions(step: LessonStep) {
  const assertionFamilyIds = step.assertionFamilyId ? [step.assertionFamilyId] : [];
  const assertionIdentifiers = [...step.teaches, ...step.reinforces, ...step.tests];
  const capabilityIds = [...step.capabilityIds, ...step.evidenceEmitted];
  const questionBlueprintIds = step.questionBlueprintId ? [step.questionBlueprintId] : [];
  const blockDependencies = contentBlockContributions(step);
  const formulaFamilyIds = [...(step.representation.formulaFamilyId ? [step.representation.formulaFamilyId] : []), ...blockDependencies.formulaFamilyIds];
  const workedExampleBlueprintIds = [
    ...(step.representation.workedExampleBlueprintId ? [step.representation.workedExampleBlueprintId] : []),
    ...blockDependencies.workedExampleBlueprintIds,
  ];
  const visualAidBlueprintIds = [
    ...(step.representation.visualAidBlueprintId ? [step.representation.visualAidBlueprintId] : []),
    ...blockDependencies.visualAidBlueprintIds,
  ];
  const diagramBlueprintIds = [...(step.representation.diagramBlueprintId ? [step.representation.diagramBlueprintId] : []), ...blockDependencies.diagramBlueprintIds];
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
