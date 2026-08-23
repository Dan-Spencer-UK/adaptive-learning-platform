import { describe, expect, it } from "vitest";
import { lessonPlanSchema } from "@alp/content-schema";
import { LESSON_MASS_AND_WEIGHT } from "./lesson-mass-and-weight.ts";
import { LESSON_SIMPLE_MACHINES } from "./lesson-simple-machines.ts";
import { LESSON_MECHANICS_FORCE_WORK_ENERGY_POWER } from "./lesson-mechanics-force-work-energy-power.ts";

/**
 * CC-11 (Workstream A) self-check: proves the three new Unit 202 LO3
 * lesson files are structurally valid against the REAL, authoritative
 * `lessonPlanSchema` (packages/content-schema/src/lesson-plan.ts) --
 * duplicate step ids, dangling branch-route/completion-criteria step
 * references, masteryGateCapabilityIds subset-of-requiredCapabilityEvidence,
 * and every other structural rule that schema's own `superRefine` enforces.
 *
 * This package could not add these three lessons to
 * scripts/content/data/lessons.ts (a shared file owned by the main
 * integrator during concurrent Workstream A/C development), so the
 * normal `validate-lesson-plan.ts` / `lesson:validate:check` full-manifest
 * gate (which reads from lessons.ts) never sees them yet. This test is
 * the standalone substitute: it validates the same schema directly
 * against each lesson's own exported object. It does NOT replace
 * `lesson:validate:check`'s cross-corpus checks (that every referenced
 * assertion/capability/questionBlueprint id genuinely exists in
 * cc05a-pedagogy-unit202.ts) -- those require the corpus edits this
 * package's final report hands to the integrator un-applied.
 */

describe("CC-11 LO3 lesson files validate against the real lessonPlanSchema", () => {
  const cases = [
    ["LESSON_MASS_AND_WEIGHT", LESSON_MASS_AND_WEIGHT],
    ["LESSON_SIMPLE_MACHINES", LESSON_SIMPLE_MACHINES],
    ["LESSON_MECHANICS_FORCE_WORK_ENERGY_POWER", LESSON_MECHANICS_FORCE_WORK_ENERGY_POWER],
  ] as const;

  for (const [name, lesson] of cases) {
    it(`${name} parses cleanly`, () => {
      const result = lessonPlanSchema.safeParse(lesson);
      if (!result.success) {
        throw new Error(`${name} failed lessonPlanSchema validation: ${JSON.stringify(result.error.issues, null, 2)}`);
      }
      expect(result.success).toBe(true);
    });

    it(`${name} has unique step ids and every completionCriteria.requiredStepIds entry resolves to a real step`, () => {
      const stepIds = new Set(lesson.steps.map((s) => s.id));
      expect(stepIds.size).toBe(lesson.steps.length);
      for (const id of lesson.completionCriteria.requiredStepIds) {
        expect(stepIds.has(id)).toBe(true);
      }
    });

    it(`${name}'s masteryGateCapabilityIds is a non-empty subset of requiredCapabilityEvidence`, () => {
      const required = new Set(lesson.completionCriteria.requiredCapabilityEvidence);
      expect(lesson.completionCriteria.masteryGateCapabilityIds.length).toBeGreaterThan(0);
      for (const capId of lesson.completionCriteria.masteryGateCapabilityIds) {
        expect(required.has(capId)).toBe(true);
      }
    });

    it(`${name}'s targetCapabilityIds are all evidenced by at least one step's evidenceEmitted`, () => {
      const emitted = new Set(lesson.steps.flatMap((s) => s.evidenceEmitted));
      for (const capId of lesson.targetCapabilityIds) {
        expect(emitted.has(capId)).toBe(true);
      }
    });

    it(`${name} declares contentRelease "release.unit202.v4" (retargeted by the main integrator from the authoring-time v3 placeholder) and presentationModes learn+review`, () => {
      expect(lesson.contentRelease).toBe("release.unit202.v4");
      expect(lesson.presentationModes).toEqual(["learn", "review"]);
    });
  }

  it("the three lessons have distinct ids", () => {
    const ids = cases.map(([, lesson]) => lesson.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
