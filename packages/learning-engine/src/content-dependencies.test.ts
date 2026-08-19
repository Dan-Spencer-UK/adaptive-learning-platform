import { describe, expect, it } from "vitest";
import { computeLessonContentDependencies } from "./content-dependencies.ts";
import { SYNTHETIC_MAIN_LESSON, SYNTH_CORE_CAPABILITY, SYNTH_MISCONCEPTION_ID, SYNTH_PREREQ_FAMILY } from "./test-fixtures.ts";

describe("computeLessonContentDependencies", () => {
  const manifest = computeLessonContentDependencies(SYNTHETIC_MAIN_LESSON);

  it("carries the lesson's own identity through", () => {
    expect(manifest.lessonId).toBe(SYNTHETIC_MAIN_LESSON.id);
    expect(manifest.lessonVersion).toBe(SYNTHETIC_MAIN_LESSON.version);
    expect(manifest.contentRelease).toBe(SYNTHETIC_MAIN_LESSON.contentRelease);
  });

  it("collects assertion families from targetAssertionFamilyIds and prerequisiteKnowledge", () => {
    expect(manifest.assertionFamilyIds).toContain("synth.target_skill");
    expect(manifest.assertionFamilyIds).toContain(SYNTH_PREREQ_FAMILY);
  });

  it("collects capabilities from targetCapabilityIds and step-level capabilityIds/evidenceEmitted", () => {
    expect(manifest.capabilityIds).toContain(SYNTH_CORE_CAPABILITY);
  });

  it("only collects misconception identifiers from misconceptionTargets, not from branch-route metadata", () => {
    // SYNTHETIC_MAIN_LESSON's misconception id appears only inside a
    // branchRoute, not any step's or the lesson's own misconceptionTargets
    // array -- the dependency manifest deliberately only walks governed
    // CONTENT reference fields, not branch-route metadata, so it must not
    // appear here even though the engine still routes on it correctly.
    expect(manifest.misconceptionIdentifiers).not.toContain(SYNTH_MISCONCEPTION_ID);
  });

  it("is deterministic: computing twice from the same lesson produces identical output", () => {
    const again = computeLessonContentDependencies(SYNTHETIC_MAIN_LESSON);
    expect(again).toEqual(manifest);
  });

  it("every category is sorted and deduplicated", () => {
    for (const category of [
      manifest.assertionFamilyIds,
      manifest.assertionIdentifiers,
      manifest.capabilityIds,
      manifest.questionBlueprintIds,
      manifest.formulaFamilyIds,
      manifest.workedExampleBlueprintIds,
      manifest.visualAidBlueprintIds,
      manifest.diagramBlueprintIds,
      manifest.misconceptionIdentifiers,
    ]) {
      expect(category).toEqual([...category].sort((a, b) => a.localeCompare(b)));
      expect(new Set(category).size).toBe(category.length);
    }
  });

  it("does not mutate the input lesson", () => {
    const snapshot = JSON.parse(JSON.stringify(SYNTHETIC_MAIN_LESSON));
    computeLessonContentDependencies(SYNTHETIC_MAIN_LESSON);
    expect(SYNTHETIC_MAIN_LESSON).toEqual(snapshot);
  });

  it("round-trips through JSON with no loss (plain serializable data)", () => {
    const roundTripped = JSON.parse(JSON.stringify(manifest));
    expect(roundTripped).toEqual(manifest);
  });
});
