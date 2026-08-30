import { describe, expect, it } from "vitest";
import type { LessonStep } from "@alp/content-schema";
import { computeLessonContentDependencies } from "./content-dependencies.ts";
import { buildLesson, buildStep, SYNTHETIC_MAIN_LESSON, SYNTH_CORE_CAPABILITY, SYNTH_MISCONCEPTION_ID, SYNTH_PREREQ_FAMILY } from "./test-fixtures.ts";

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

describe("computeLessonContentDependencies -- CC-13C.2B contentBlocks references", () => {
  const richStep: LessonStep = buildStep({
    id: "rich",
    type: "concept_explanation",
    mayRevealTargetAnswer: false,
    contentBlocks: [
      { type: "paragraph", text: "Some governed teaching prose." },
      { type: "formula", formulaFamilyId: "synth.formula_family" },
      { type: "worked_example", workedExampleBlueprintId: "synth.worked_example" },
      { type: "visual", source: { kind: "diagram", diagramBlueprintId: "synth.diagram" } },
      { type: "visual", source: { kind: "visual_aid", visualAidBlueprintId: "synth.visual_aid" } },
      { type: "callout", variant: "key_point", text: "A key point." },
    ],
  });
  const lessonWithRichStep = buildLesson({
    id: "lesson.synthetic.rich-blocks",
    targetAssertionFamilyIds: ["synth.target_skill"],
    targetCapabilityIds: [SYNTH_CORE_CAPABILITY],
    steps: [richStep, buildStep({ id: "end", type: "exit_completion" })],
    completionCriteria: {
      requiredStepIds: ["rich", "end"],
      requiredCapabilityEvidence: [SYNTH_CORE_CAPABILITY],
      masteryGateCapabilityIds: [SYNTH_CORE_CAPABILITY],
      requiresRemediationClearance: true,
      exitSummary: "synthetic rich-blocks completion",
    },
  });

  it("includes the formula family referenced by a formula content block", () => {
    const manifest = computeLessonContentDependencies(lessonWithRichStep);
    expect(manifest.formulaFamilyIds).toContain("synth.formula_family");
  });

  it("includes the worked-example blueprint referenced by a worked_example content block", () => {
    const manifest = computeLessonContentDependencies(lessonWithRichStep);
    expect(manifest.workedExampleBlueprintIds).toContain("synth.worked_example");
  });

  it("includes the diagram blueprint referenced by a visual content block's diagram source", () => {
    const manifest = computeLessonContentDependencies(lessonWithRichStep);
    expect(manifest.diagramBlueprintIds).toContain("synth.diagram");
  });

  it("includes the visual-aid blueprint referenced by a visual content block's visual_aid source", () => {
    const manifest = computeLessonContentDependencies(lessonWithRichStep);
    expect(manifest.visualAidBlueprintIds).toContain("synth.visual_aid");
  });

  it("each contentBlocks reference appears exactly once (deduplicated), even though the legacy SYNTHETIC_MAIN_LESSON fixture also exercises the same categories via representation", () => {
    const manifest = computeLessonContentDependencies(lessonWithRichStep);
    expect(manifest.formulaFamilyIds.filter((id) => id === "synth.formula_family")).toHaveLength(1);
  });

  it("does not change legacy representation dependency behaviour: the pre-existing SYNTHETIC_MAIN_LESSON fixture (no contentBlocks anywhere) resolves identically to before", () => {
    const manifest = computeLessonContentDependencies(SYNTHETIC_MAIN_LESSON);
    expect(manifest.formulaFamilyIds).toEqual([]);
    expect(manifest.workedExampleBlueprintIds).toEqual([]);
    expect(manifest.visualAidBlueprintIds).toEqual([]);
    expect(manifest.diagramBlueprintIds).toEqual([]);
  });
});
