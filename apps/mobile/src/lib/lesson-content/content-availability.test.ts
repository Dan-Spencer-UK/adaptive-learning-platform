import type { LessonContentDependencyManifest } from "@alp/learning-engine";
import { findMissingDependencies, type LocalContentInventory } from "./content-availability";

function manifest(overrides: Partial<LessonContentDependencyManifest> = {}): LessonContentDependencyManifest {
  return {
    lessonId: "lesson.test",
    lessonVersion: 1,
    contentRelease: "release.1",
    assertionFamilyIds: [],
    assertionIdentifiers: [],
    capabilityIds: [],
    questionBlueprintIds: [],
    formulaFamilyIds: [],
    workedExampleBlueprintIds: [],
    visualAidBlueprintIds: [],
    diagramBlueprintIds: [],
    misconceptionIdentifiers: [],
    ...overrides,
  };
}

function inventory(overrides: Partial<LocalContentInventory> = {}): LocalContentInventory {
  return {
    questionBlueprintIds: new Set(),
    formulaFamilyIds: new Set(),
    workedExampleBlueprintIds: new Set(),
    visualAidBlueprintIds: new Set(),
    diagramBlueprintIds: new Set(),
    assertionIdentifiersWithStatements: new Set(),
    misconceptionIdentifiersWithDescriptions: new Set(),
    ...overrides,
  };
}

describe("findMissingDependencies", () => {
  it("returns an empty list when every required id is present in the inventory", () => {
    const m = manifest({ questionBlueprintIds: ["qb.a"], formulaFamilyIds: ["formula.a"] });
    const inv = inventory({ questionBlueprintIds: new Set(["qb.a"]), formulaFamilyIds: new Set(["formula.a"]) });
    expect(findMissingDependencies(m, inv)).toEqual([]);
  });

  it("reports a missing question blueprint by id and category", () => {
    const m = manifest({ questionBlueprintIds: ["qb.a", "qb.b"] });
    const inv = inventory({ questionBlueprintIds: new Set(["qb.a"]) });
    expect(findMissingDependencies(m, inv)).toEqual([{ category: "questionBlueprint", id: "qb.b" }]);
  });

  it("reports missing dependencies across every category, not just the first", () => {
    const m = manifest({
      questionBlueprintIds: ["qb.a"],
      formulaFamilyIds: ["formula.a"],
      workedExampleBlueprintIds: ["worked.a"],
      visualAidBlueprintIds: ["visual.a"],
      diagramBlueprintIds: ["diagram.a"],
      assertionIdentifiers: ["ASSERT-001"],
      misconceptionIdentifiers: ["MIS-001"],
    });
    const missing = findMissingDependencies(m, inventory());
    expect(missing).toEqual([
      { category: "questionBlueprint", id: "qb.a" },
      { category: "formulaFamily", id: "formula.a" },
      { category: "workedExampleBlueprint", id: "worked.a" },
      { category: "visualAidBlueprint", id: "visual.a" },
      { category: "diagramBlueprint", id: "diagram.a" },
      { category: "assertionStatement", id: "ASSERT-001" },
      { category: "misconceptionDescription", id: "MIS-001" },
    ]);
  });

  it("is deterministic for identical inputs", () => {
    const m = manifest({ questionBlueprintIds: ["qb.a"] });
    const inv = inventory();
    expect(findMissingDependencies(m, inv)).toEqual(findMissingDependencies(m, inv));
  });
});
