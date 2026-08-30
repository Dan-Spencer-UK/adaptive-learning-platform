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

/**
 * CC-13C.2B: one resolved rich teaching content block -- everything a
 * native component needs to render it, with every governed-content
 * reference already resolved to the real object (never left as a bare id
 * for a component to look up itself, matching this module's own "React
 * components consume this, never search raw corpus structures ad hoc"
 * discipline). A discriminated union on `type` mirrors the governed
 * `LessonStepContentBlock` union exactly.
 */
export type ResolvedContentBlock =
  | { readonly type: "paragraph"; readonly text: string }
  | { readonly type: "list"; readonly style: "ordered" | "unordered"; readonly items: readonly string[] }
  | {
      readonly type: "visual";
      readonly source:
        | { readonly kind: "diagram"; readonly diagram: DiagramBlueprint; readonly diagramParameters?: Readonly<Record<string, string | number | boolean>> }
        | { readonly kind: "visual_aid"; readonly visualAid: VisualAidBlueprint; readonly formulaFamily: FormulaFamily };
    }
  | { readonly type: "formula"; readonly formulaFamily: FormulaFamily }
  | { readonly type: "worked_example"; readonly workedExample: WorkedExampleBlueprint; readonly formulaFamily: FormulaFamily }
  | { readonly type: "callout"; readonly variant: "key_point" | "definition" | "caution"; readonly text: string };

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
  /** CC-13C.2B: this step's authored learner-facing section heading (`step.learnerFacingHeading`), or null for a legacy step that has none -- DIFFERENT from `sectionLabel` above, which is always-present structural microcopy, never a factual/authored claim. */
  readonly learnerFacingHeading: string | null;
  /** Real governed learner-facing text: assertion statements this step teaches/reinforces/tests, or the lesson's own learnerFacingDescription/exitSummary for steps with no direct assertion references. Empty when `contentBlocks` is present -- the two paths never both render for the same step. */
  readonly bodyStatements: readonly string[];
  /** CC-13C.2B: this step's resolved, ordered rich teaching content blocks, or null when `step.contentBlocks` is absent (the legacy `bodyStatements` + `representation` path is authoritative instead). Never both non-empty/non-null for the same step. */
  readonly contentBlocks: readonly ResolvedContentBlock[] | null;
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

/**
 * Looks up a governed content id and FAILS LOUDLY if it does not resolve --
 * matching this codebase's established "the learner runtime fails loudly
 * rather than falling back to app-side constants" discipline (CC-06D,
 * Correction C) for content that is REQUIRED for a `contentBlocks` block
 * to mean anything. By the time this runs on-device the id has already
 * been proven to exist by `generate-mobile-projection.ts`'s own
 * fail-loudly `pickAll()` at build time -- a failure here means the
 * resolved `ContentLookup` passed in is itself incomplete/wrong, not that
 * the governed corpus is missing the content.
 */
function mustFind<T extends { id: string }>(records: readonly T[], id: string, kind: string): T {
  const record = records.find((r) => r.id === id);
  if (!record) throw new Error(`content block references unknown ${kind} '${id}' -- not present in the resolved content lookup`);
  return record;
}

/**
 * CC-13C.2B: resolves `step.contentBlocks` (if present) into the ordered
 * collection of `ResolvedContentBlock`s a native component renders --
 * paragraph/list/callout text passes through verbatim; formula resolves
 * through the existing `FormulaFamily` lookup; worked_example through the
 * existing `WorkedExampleBlueprint` lookup (and its OWN declared
 * `formulaFamilyId`, exactly as the legacy worked-example representation
 * already requires both to render); diagram-source visual through the
 * existing `DiagramBlueprint` lookup; visual_aid-source visual through the
 * existing `VisualAidBlueprint` lookup (and its OWN declared
 * `formulaFamilyId`, exactly as the legacy `VirTriangle` rendering already
 * requires both). Block order is preserved EXACTLY -- never sorted/
 * regrouped by type. Returns null when `step.contentBlocks` is absent
 * (the legacy path is authoritative instead) -- deliberately checked with
 * `!== undefined`, never `?.length`, so a schema-invalid empty array (which
 * should never reach this function in practice, since the schema already
 * rejects it) is never silently reinterpreted as "absent".
 */
function resolveContentBlocks(step: LessonStep, lookup: ContentLookup): readonly ResolvedContentBlock[] | null {
  if (step.contentBlocks === undefined) return null;

  return step.contentBlocks.map((block): ResolvedContentBlock => {
    switch (block.type) {
      case "paragraph":
        return { type: "paragraph", text: block.text };
      case "list":
        return { type: "list", style: block.style, items: block.items };
      case "callout":
        return { type: "callout", variant: block.variant, text: block.text };
      case "formula":
        return { type: "formula", formulaFamily: mustFind(lookup.formulaFamilies, block.formulaFamilyId, "formula family") };
      case "worked_example": {
        const workedExample = mustFind(lookup.workedExampleBlueprints, block.workedExampleBlueprintId, "worked example blueprint");
        const formulaFamily = mustFind(lookup.formulaFamilies, workedExample.formulaFamilyId, "formula family");
        return { type: "worked_example", workedExample, formulaFamily };
      }
      case "visual":
        if (block.source.kind === "diagram") {
          return {
            type: "visual",
            source: {
              kind: "diagram",
              diagram: mustFind(lookup.diagramBlueprints, block.source.diagramBlueprintId, "diagram blueprint"),
              diagramParameters: block.source.diagramParameters,
            },
          };
        }
        {
          const visualAid = mustFind(lookup.visualAidBlueprints, block.source.visualAidBlueprintId, "visual aid blueprint");
          const formulaFamily = mustFind(lookup.formulaFamilies, visualAid.formulaFamilyId, "formula family");
          return { type: "visual", source: { kind: "visual_aid", visualAid, formulaFamily } };
        }
    }
  });
}

/** Resolves one governed LessonStep against the given lesson and local content lookup into everything a native component needs to render it. */
export function resolveLessonStep(lesson: LessonPlan, stepId: string, lookup: ContentLookup): RenderableLessonStep {
  const step = lesson.steps.find((s) => s.id === stepId);
  if (!step) throw new Error(`Lesson '${lesson.id}' has no step '${stepId}'`);

  // CC-13C.2B migration rule: presence of contentBlocks is the sole
  // authoritative rendering path for the step -- the legacy bodyStatements/
  // representation resolution is never ALSO computed/rendered for the same
  // step (the schema's own superRefine already makes this mutually
  // exclusive by construction: a step with contentBlocks cannot also
  // declare a conflicting legacy representation field).
  const resolvedContentBlocks = resolveContentBlocks(step, lookup);

  return {
    step,
    sectionLabel: SECTION_LABELS[step.type],
    learnerFacingHeading: step.learnerFacingHeading ?? null,
    bodyStatements: resolvedContentBlocks ? [] : resolveBodyStatements(lesson, step, lookup),
    contentBlocks: resolvedContentBlocks,
    formulaFamily: resolvedContentBlocks ? null : find(lookup.formulaFamilies, step.representation.formulaFamilyId),
    workedExample: resolvedContentBlocks ? null : find(lookup.workedExampleBlueprints, step.representation.workedExampleBlueprintId),
    visualAid: resolvedContentBlocks ? null : find(lookup.visualAidBlueprints, step.representation.visualAidBlueprintId),
    diagram: resolvedContentBlocks ? null : find(lookup.diagramBlueprints, step.representation.diagramBlueprintId),
    questionBlueprint: find(lookup.questionBlueprints, step.questionBlueprintId),
    misconceptionDescriptions: lookup.misconceptionDescriptions,
  };
}
