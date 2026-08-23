/**
 * Content resolution boundary (task brief §5): resolves a governed
 * `LessonStep` into a `RenderableLessonStep` -- everything a native
 * component needs to render it, with every piece of learner-facing copy
 * traced to real governed content. React components consume this, never
 * search raw corpus structures themselves (task brief §5: "Do not make
 * React components search raw corpus structures ad hoc").
 *
 * Deliberately never uses `LessonStep.purpose` as learner copy (task
 * brief §6 -- `purpose` describes pedagogical intent, not polished
 * learner-facing prose). Every string surfaced here is either:
 *  - a real governed assertion statement/question-blueprint title, or
 *  - the LessonPlan's own explicitly learner-facing fields
 *    (`learnerFacingDescription`, `completionCriteria.exitSummary`),
 *    which exist in the schema precisely for this purpose, or
 *  - pure non-factual interface microcopy (a section label like
 *    "Recap", never a factual claim) -- exactly what task brief §6
 *    explicitly allows.
 */
import type { DiagramBlueprint, FormulaFamily, LessonPlan, LessonStep, QuestionBlueprint, VisualAidBlueprint, WorkedExampleBlueprint } from "@alp/content-schema";

export interface ContentLookup {
  readonly questionBlueprints: readonly QuestionBlueprint[];
  readonly formulaFamilies: readonly FormulaFamily[];
  readonly workedExampleBlueprints: readonly WorkedExampleBlueprint[];
  readonly visualAidBlueprints: readonly VisualAidBlueprint[];
  /** CC-11: the missing link in the Lesson Player diagram runtime gap (task brief §7) -- without this, `step.representation.diagramBlueprintId` had nothing to resolve against. */
  readonly diagramBlueprints: readonly DiagramBlueprint[];
  readonly assertionStatements: Readonly<Record<string, string>>;
  /** Governed learner-facing misconception descriptions -- the feedback panel's misconception copy resolves from here, never from app-side strings (CC-06D, Correction C). */
  readonly misconceptionDescriptions: Readonly<Record<string, string>>;
}

export interface RenderableLessonStep {
  readonly step: LessonStep;
  /** Pure UI microcopy describing the step's structural role -- never a factual claim. */
  readonly sectionLabel: string;
  /** Real governed learner-facing text: assertion statements this step teaches/reinforces/tests, or the lesson's own learnerFacingDescription/exitSummary for steps with no direct assertion references. */
  readonly bodyStatements: readonly string[];
  readonly formulaFamily: FormulaFamily | null;
  readonly workedExample: WorkedExampleBlueprint | null;
  readonly visualAid: VisualAidBlueprint | null;
  /** CC-11: the resolved governed diagram blueprint for this step's `representation.diagramBlueprintId`, if any -- see `@/components/diagrams/DiagramRenderer`. */
  readonly diagram: DiagramBlueprint | null;
  readonly questionBlueprint: QuestionBlueprint | null;
  /** Governed learner-facing misconception descriptions available to this step's feedback (CC-06D, Correction C). */
  readonly misconceptionDescriptions: Readonly<Record<string, string>>;
}

const SECTION_LABELS: Readonly<Record<LessonStep["type"], string>> = {
  orientation: "Introduction",
  concept_explanation: "Concept",
  visual_explanation: "How it works",
  worked_example: "Worked example",
  guided_interaction: "Try it",
  independent_question: "Your turn",
  misconception_discrimination: "Check your understanding",
  retrieval_check: "Quick recall",
  remediation: "Let's revisit this",
  transfer_application: "Apply it",
  recap: "Recap",
  exit_completion: "Lesson complete",
};

function find<T extends { id: string }>(records: readonly T[], id: string | undefined): T | null {
  if (!id) return null;
  return records.find((r) => r.id === id) ?? null;
}

function resolveBodyStatements(lesson: LessonPlan, step: LessonStep, lookup: ContentLookup): readonly string[] {
  const referencedIds = [...step.teaches, ...step.reinforces, ...step.tests];
  const statements = referencedIds.map((id) => lookup.assertionStatements[id]).filter((s): s is string => Boolean(s));
  if (statements.length > 0) return [...new Set(statements)];

  if (step.type === "orientation") return [lesson.learnerFacingDescription];
  if (step.type === "exit_completion") return [lesson.completionCriteria.exitSummary];
  return [];
}

/** Resolves one governed LessonStep against the given lesson and local content lookup into everything a native component needs to render it. */
export function resolveLessonStep(lesson: LessonPlan, stepId: string, lookup: ContentLookup): RenderableLessonStep {
  const step = lesson.steps.find((s) => s.id === stepId);
  if (!step) throw new Error(`Lesson '${lesson.id}' has no step '${stepId}'`);

  return {
    step,
    sectionLabel: SECTION_LABELS[step.type],
    bodyStatements: resolveBodyStatements(lesson, step, lookup),
    formulaFamily: find(lookup.formulaFamilies, step.representation.formulaFamilyId),
    workedExample: find(lookup.workedExampleBlueprints, step.representation.workedExampleBlueprintId),
    visualAid: find(lookup.visualAidBlueprints, step.representation.visualAidBlueprintId),
    diagram: find(lookup.diagramBlueprints, step.representation.diagramBlueprintId),
    questionBlueprint: find(lookup.questionBlueprints, step.questionBlueprintId),
    misconceptionDescriptions: lookup.misconceptionDescriptions,
  };
}
