/**
 * Pure content-availability checking (task brief §25C/§25I): given a
 * lesson's governed content-dependency manifest (@alp/learning-engine's
 * `computeLessonContentDependencies`) and an inventory describing what is
 * actually stored locally, determines exactly which dependencies (if any)
 * are missing. No I/O, no SQLite -- see ./local-content-store.ts for the
 * persistence layer that calls this and records the result.
 *
 * "Downloaded content must not be assumed valid merely because bytes
 * exist locally" (task brief §25I) -- this is the real structural
 * completeness check that principle requires, not a hard-coded
 * always-true shortcut.
 */
import type { LessonContentDependencyManifest } from "@alp/learning-engine";

export interface LocalContentInventory {
  readonly questionBlueprintIds: ReadonlySet<string>;
  readonly formulaFamilyIds: ReadonlySet<string>;
  readonly workedExampleBlueprintIds: ReadonlySet<string>;
  readonly visualAidBlueprintIds: ReadonlySet<string>;
  readonly diagramBlueprintIds: ReadonlySet<string>;
  /** Assertion identifiers for which learner-facing statement text is available locally. */
  readonly assertionIdentifiersWithStatements: ReadonlySet<string>;
  /** Misconception identifiers for which learner-facing description text is available locally. */
  readonly misconceptionIdentifiersWithDescriptions: ReadonlySet<string>;
}

export type MissingDependencyCategory =
  | "questionBlueprint"
  | "formulaFamily"
  | "workedExampleBlueprint"
  | "visualAidBlueprint"
  | "diagramBlueprint"
  | "assertionStatement"
  | "misconceptionDescription";

export interface MissingDependency {
  readonly category: MissingDependencyCategory;
  readonly id: string;
}

function collectMissing(category: MissingDependencyCategory, required: readonly string[], available: ReadonlySet<string>): MissingDependency[] {
  return required.filter((id) => !available.has(id)).map((id) => ({ category, id }));
}

/**
 * Deterministic: same manifest + inventory always produces the same
 * (possibly empty) list, in a stable category-then-id order.
 */
export function findMissingDependencies(
  manifest: LessonContentDependencyManifest,
  inventory: LocalContentInventory,
): readonly MissingDependency[] {
  return [
    ...collectMissing("questionBlueprint", manifest.questionBlueprintIds, inventory.questionBlueprintIds),
    ...collectMissing("formulaFamily", manifest.formulaFamilyIds, inventory.formulaFamilyIds),
    ...collectMissing("workedExampleBlueprint", manifest.workedExampleBlueprintIds, inventory.workedExampleBlueprintIds),
    ...collectMissing("visualAidBlueprint", manifest.visualAidBlueprintIds, inventory.visualAidBlueprintIds),
    ...collectMissing("diagramBlueprint", manifest.diagramBlueprintIds, inventory.diagramBlueprintIds),
    ...collectMissing("assertionStatement", manifest.assertionIdentifiers, inventory.assertionIdentifiersWithStatements),
    ...collectMissing("misconceptionDescription", manifest.misconceptionIdentifiers, inventory.misconceptionIdentifiersWithDescriptions),
  ];
}
