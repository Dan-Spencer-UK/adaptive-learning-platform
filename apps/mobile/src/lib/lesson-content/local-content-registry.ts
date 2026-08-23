/**
 * Local content registry (CC-06D, Correction D): the single typed lookup
 * through which the Lesson Player resolves governed lessons and their
 * content from the generated local content projection
 * (./generated/mobile-content-projection.ts).
 *
 * Components never search raw generated arrays ad hoc, and there is no
 * implicit "first lesson" fallback: unknown lesson identity, an unknown
 * release, or a version mismatch fails explicitly with
 * `UnknownLessonError` (product invariant: fail loudly, never guess).
 *
 * The pure `*From(projection, ...)` variants exist so tests can prove
 * multi-lesson genericity against a synthetic projection; the plain
 * variants bind the real bundled projection.
 */
import type { FormulaFamily, LessonPlan, MobileContentProjection, QuestionBlueprint } from "@alp/content-schema";

import type { LocalContentInventory } from "./content-availability.ts";
import type { ContentLookup } from "./resolve-lesson-step.ts";
import { MOBILE_CONTENT_PROJECTION } from "./generated/mobile-content-projection.ts";

export class UnknownLessonError extends Error {
  constructor(detail: string) {
    super(`Unknown lesson identity: ${detail}. Lessons resolve only by explicit (lessonId, contentRelease[, version]) -- there is no default/first-lesson fallback.`);
    this.name = "UnknownLessonError";
  }
}

export interface LocalLessonRecord {
  readonly lesson: LessonPlan;
  readonly contentRelease: string;
  readonly questionBlueprintVersion: number;
  /** Content lookup for resolve-lesson-step (rendering). */
  readonly lookup: ContentLookup;
  /** Inventory of locally available content ids, for the LOCAL READY completeness check. */
  readonly inventory: LocalContentInventory;
}

/** The content release the bundled projection carries -- the default release for lesson resolution until downloaded releases exist. */
export function bundledContentReleaseId(): string {
  return MOBILE_CONTENT_PROJECTION.contentRelease.id;
}

function lookupFrom(projection: MobileContentProjection): ContentLookup {
  return {
    questionBlueprints: projection.questionBlueprints,
    formulaFamilies: projection.formulaFamilies,
    workedExampleBlueprints: projection.workedExampleBlueprints,
    visualAidBlueprints: projection.visualAidBlueprints,
    diagramBlueprints: projection.diagramBlueprints,
    assertionStatements: projection.assertionStatements,
    misconceptionDescriptions: projection.misconceptionDescriptions,
  };
}

function inventoryFrom(projection: MobileContentProjection): LocalContentInventory {
  return {
    questionBlueprintIds: new Set(projection.questionBlueprints.map((b) => b.id)),
    formulaFamilyIds: new Set(projection.formulaFamilies.map((f) => f.id)),
    workedExampleBlueprintIds: new Set(projection.workedExampleBlueprints.map((w) => w.id)),
    visualAidBlueprintIds: new Set(projection.visualAidBlueprints.map((v) => v.id)),
    diagramBlueprintIds: new Set(projection.diagramBlueprints.map((d) => d.id)),
    assertionIdentifiersWithStatements: new Set(Object.keys(projection.assertionStatements)),
    misconceptionIdentifiersWithDescriptions: new Set(Object.keys(projection.misconceptionDescriptions)),
  };
}

export function getLocalLessonFrom(
  projection: MobileContentProjection,
  args: { readonly lessonId: string; readonly contentRelease: string; readonly version?: number },
): LocalLessonRecord {
  if (projection.contentRelease.id !== args.contentRelease) {
    throw new UnknownLessonError(
      `content release '${args.contentRelease}' is not available locally (local projection carries release '${projection.contentRelease.id}')`,
    );
  }
  const lesson = projection.lessons.find((l) => l.id === args.lessonId);
  if (!lesson) {
    throw new UnknownLessonError(`lesson '${args.lessonId}' does not exist in local content release '${projection.contentRelease.id}'`);
  }
  if (args.version !== undefined && lesson.version !== args.version) {
    throw new UnknownLessonError(
      `lesson '${args.lessonId}' version ${args.version} is not available locally (release '${projection.contentRelease.id}' carries version ${lesson.version})`,
    );
  }
  return {
    lesson,
    contentRelease: projection.contentRelease.id,
    questionBlueprintVersion: projection.contentRelease.questionBlueprintVersion,
    lookup: lookupFrom(projection),
    inventory: inventoryFrom(projection),
  };
}

/** Every lesson in one locally available release -- the assembler's `allLessons` input for prerequisite-candidate resolution. */
export function getLocalReleaseLessonsFrom(projection: MobileContentProjection, contentRelease: string): readonly LessonPlan[] {
  if (projection.contentRelease.id !== contentRelease) {
    throw new UnknownLessonError(`content release '${contentRelease}' is not available locally (local projection carries release '${projection.contentRelease.id}')`);
  }
  return projection.lessons;
}

export function getQuestionBlueprintFrom(projection: MobileContentProjection, blueprintId: string): QuestionBlueprint {
  const blueprint = projection.questionBlueprints.find((b) => b.id === blueprintId);
  if (!blueprint) {
    throw new UnknownLessonError(`question blueprint '${blueprintId}' does not exist in local content release '${projection.contentRelease.id}'`);
  }
  return blueprint;
}

export function getFormulaFamiliesFrom(projection: MobileContentProjection): readonly FormulaFamily[] {
  return projection.formulaFamilies;
}

// ---------------------------------------------------------------------
// Real bundled-projection bindings.
// ---------------------------------------------------------------------

export function getLocalLesson(args: { readonly lessonId: string; readonly contentRelease: string; readonly version?: number }): LocalLessonRecord {
  return getLocalLessonFrom(MOBILE_CONTENT_PROJECTION, args);
}

export function getLocalReleaseLessons(contentRelease: string): readonly LessonPlan[] {
  return getLocalReleaseLessonsFrom(MOBILE_CONTENT_PROJECTION, contentRelease);
}
