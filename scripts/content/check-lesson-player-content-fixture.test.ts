/**
 * Mechanically proves that
 * apps/mobile/src/lib/lesson-content/lesson-ohms-law-content-fixture.ts
 * (the native Lesson Player's governed-content mirror -- see that file's
 * header comment for why apps/mobile cannot import scripts/content/data
 * directly) has not drifted from the real governed corpus: the CC-05A
 * pedagogy manifest, the CC-04 knowledge graph, and the CC-06 canonical
 * Ohm's Law LessonPlan itself. Mirrors check-cc05c-proving-fixture.test.ts's
 * exact pattern. This is content-authoring tooling (scripts/content),
 * allowed to import both the real corpus and the mobile fixture to
 * cross-check them; the dependency direction this guards is the other
 * one -- apps/mobile must never import scripts/content/data.
 */
import { describe, expect, it } from "vitest";
import { knowledgeGraphManifestSchema, pedagogyManifestSchema } from "@alp/content-schema";
import { cc04Unit202ElectricalScience } from "./data/cc04-unit202-electrical-science.ts";
import { cc05aPedagogyUnit202 } from "./data/cc05a-pedagogy-unit202.ts";
import { LESSON_OHMS_LAW as REAL_LESSON_OHMS_LAW } from "./data/lesson-ohms-law.ts";
import {
  ASSERTION_STATEMENTS,
  LESSON_OHMS_LAW,
  MISCONCEPTION_DESCRIPTIONS,
  QB_OHMS_LAW_DIAGNOSE_REARRANGEMENT_ERROR,
  QB_OHMS_LAW_DIAGNOSE_WRONG_OPERATION,
  QB_OHMS_LAW_MATCH_VARIABLES_UNITS,
  QB_OHMS_LAW_PLAUSIBILITY_CHECK,
  QB_OHMS_LAW_SELECT_REARRANGEMENT,
} from "../../apps/mobile/src/lib/lesson-content/lesson-ohms-law-content-fixture.ts";

function real<T extends { id: string }>(records: readonly T[], id: string): T {
  const found = records.find((r) => r.id === id);
  if (!found) throw new Error(`real corpus has no record with id "${id}" -- fixture references a stale id`);
  return found;
}

describe("Lesson Player content fixture matches the real governed corpus exactly", () => {
  const pedagogy = pedagogyManifestSchema.parse(cc05aPedagogyUnit202);
  const knowledgeGraph = knowledgeGraphManifestSchema.parse(cc04Unit202ElectricalScience);

  it("the five additional question blueprints are byte-identical to the real corpus", () => {
    expect(QB_OHMS_LAW_SELECT_REARRANGEMENT).toEqual(real(pedagogy.questionBlueprints, "ohms_law.select_rearrangement"));
    expect(QB_OHMS_LAW_MATCH_VARIABLES_UNITS).toEqual(real(pedagogy.questionBlueprints, "ohms_law.match_variables_units"));
    expect(QB_OHMS_LAW_DIAGNOSE_REARRANGEMENT_ERROR).toEqual(
      real(pedagogy.questionBlueprints, "ohms_law.diagnose_rearrangement_error"),
    );
    expect(QB_OHMS_LAW_DIAGNOSE_WRONG_OPERATION).toEqual(real(pedagogy.questionBlueprints, "ohms_law.diagnose_wrong_operation"));
    expect(QB_OHMS_LAW_PLAUSIBILITY_CHECK).toEqual(real(pedagogy.questionBlueprints, "ohms_law.plausibility_check"));
  });

  it("every mirrored assertion statement is verbatim from the real knowledge graph", () => {
    for (const [assertionIdentifier, statement] of Object.entries(ASSERTION_STATEMENTS)) {
      const realVersion = knowledgeGraph.assertionVersions.find((v) => v.assertionIdentifier === assertionIdentifier);
      if (!realVersion) throw new Error(`real knowledge graph has no assertionVersion for "${assertionIdentifier}"`);
      expect(statement).toBe(realVersion.statement);
    }
  });

  it("every mirrored misconception description is verbatim from the real knowledge graph", () => {
    for (const [misconceptionIdentifier, description] of Object.entries(MISCONCEPTION_DESCRIPTIONS)) {
      const realMisconception = knowledgeGraph.misconceptions.find((m) => m.identifier === misconceptionIdentifier);
      if (!realMisconception) throw new Error(`real knowledge graph has no misconception "${misconceptionIdentifier}"`);
      expect(description).toBe(realMisconception.description);
    }
  });

  it("the canonical Ohm's Law LessonPlan mirror is byte-identical to the real governed lesson", () => {
    expect(LESSON_OHMS_LAW).toEqual(REAL_LESSON_OHMS_LAW);
  });
});
