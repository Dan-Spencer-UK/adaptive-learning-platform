/**
 * Published learner-runtime content projection (CC-06D, Correction B).
 *
 * docs/architecture/MOBILE-ARCHITECTURE.md §2 requires that governed
 * authoring data is never shipped directly to learner devices; instead a
 * "published learner-runtime projection" carries ONLY what a lesson/
 * question session needs, with explicit content-release identity. This
 * schema is that projection's governed shape.
 *
 * It is DERIVED DATA: scripts/content/generate-mobile-projection.ts
 * deterministically generates it from the governed corpus for one
 * declared ContentRelease (./content-release.ts); the generated module in
 * apps/mobile is never hand-edited and is CI-gated for currency
 * (`npm run content:mobile:check`). It deliberately excludes authoring/
 * governance/provenance data (sources, curriculum mappings, review
 * state, normalisation notes are the authoring corpus's concern --
 * question blueprints are carried whole because the deterministic
 * engine executes their full governed contract at runtime).
 *
 * Today the projection is bundled with the app; the same shape is
 * designed to later arrive as a downloaded versioned package (with
 * integrity verification, out of CC-06D scope) without the Lesson
 * Player changing.
 */

import { z } from "zod";
import {
  diagramBlueprintManifestSchema,
  formulaFamilyManifestSchema,
  questionBlueprintManifestSchema,
  visualAidBlueprintManifestSchema,
  workedExampleBlueprintManifestSchema,
} from "./pedagogy.ts";
import { lessonPlanSchema } from "./lesson-plan.ts";

const stableId = z.string().min(1);

export const mobileContentProjectionSchema = z
  .object({
    /** Version of the projection shape itself. */
    schemaVersion: z.literal(1),
    /** The single governed ContentRelease this projection was generated from. */
    contentRelease: z.object({
      id: stableId,
      questionBlueprintVersion: z.number().int().min(1),
    }),
    /** Every canonical LessonPlan in the release, verbatim (the runtime needs the full governed plan for assembly/branching/rendering). */
    lessons: z.array(lessonPlanSchema).min(1),
    /** Governed content the release's lessons reference, restricted to what the deterministic runtime actually consumes. */
    questionBlueprints: z.array(questionBlueprintManifestSchema),
    formulaFamilies: z.array(formulaFamilyManifestSchema),
    workedExampleBlueprints: z.array(workedExampleBlueprintManifestSchema),
    visualAidBlueprints: z.array(visualAidBlueprintManifestSchema),
    diagramBlueprints: z.array(diagramBlueprintManifestSchema),
    /** Learner-facing assertion statement text, keyed by assertion identifier -- only the assertions the release's lessons reference. */
    assertionStatements: z.record(stableId, z.string().min(1)),
    /** Learner-facing misconception description text, keyed by misconception identifier -- only the misconceptions the release's lessons reference. */
    misconceptionDescriptions: z.record(stableId, z.string().min(1)),
  })
  .superRefine((projection, ctx) => {
    for (const [index, lesson] of projection.lessons.entries()) {
      if (lesson.contentRelease !== projection.contentRelease.id) {
        ctx.addIssue({
          code: "custom",
          path: ["lessons", index, "contentRelease"],
          message: `lesson '${lesson.id}' claims content release '${lesson.contentRelease}' but this projection carries release '${projection.contentRelease.id}'`,
        });
      }
    }
  });
export type MobileContentProjection = z.infer<typeof mobileContentProjectionSchema>;
