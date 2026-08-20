/**
 * Governed Content Release entity (CC-06D, Correction A).
 *
 * `contentRelease` participates in LessonPlan identity, LessonInstance
 * identity, prerequisite remediation resolution, local-content keys,
 * question identity/provenance, evidence provenance and session
 * restoration -- yet until this module it was a load-bearing free-form
 * string with no governed definition. This module makes a release a
 * first-class governed entity: a stable identity plus a mechanical
 * description of the governed content snapshot it names.
 *
 * Deliberately the SMALLEST durable contract the current architecture
 * needs -- this is NOT a CDN package format, a publication service, or a
 * download manifest (all explicitly out of CC-06D scope). It answers,
 * mechanically:
 *
 *   - what is this release's stable id;
 *   - which LessonPlan (id, version) pairs belong to it;
 *   - which governed knowledge/pedagogy corpus snapshot it references;
 *   - which question-blueprint version identity executes within it
 *     (QuestionBlueprints carry no per-blueprint version field yet --
 *     see PROJECT-STATUS's recorded deferral "add governed blueprint
 *     version before first real blueprint revision"; until then the
 *     release declares the single blueprint version of its snapshot,
 *     so generic runtime code never embeds a bare version constant).
 *
 * No decorative metadata, no timestamps as identity (a release id is a
 * stable typed identity, not a build time).
 *
 * Cross-corpus existence of member lesson ids/versions is verified by
 * scripts/content/validate-lesson-plan.ts (the established "schema
 * validates internal shape, a separate script recomputes cross-reference
 * integrity against the live corpus" split) -- this file stays
 * corpus-independent.
 */

import { z } from "zod";

const stableId = z.string().min(1);

export const contentReleaseLessonMembershipSchema = z.object({
  lessonId: stableId,
  lessonVersion: z.number().int().min(1),
});
export type ContentReleaseLessonMembership = z.infer<typeof contentReleaseLessonMembershipSchema>;

export const contentReleaseSchema = z
  .object({
    /** Stable release identity -- the exact string every member LessonPlan's `contentRelease` field must carry. */
    id: stableId,
    /** Version of this release-manifest schema itself, so a future manifest-shape migration is distinguishable. */
    schemaVersion: z.literal(1),
    /** Every (lessonId, lessonVersion) belonging to this release. A lesson claiming this release without appearing here is a validation failure, and vice versa. */
    lessons: z.array(contentReleaseLessonMembershipSchema).min(1),
    /** Stable id of the governed knowledge-graph corpus snapshot this release references (e.g. the CC-04 Unit 202 manifest module id). */
    knowledgeCorpusId: stableId,
    /** Stable id of the governed pedagogy corpus snapshot this release references (e.g. the CC-05A Unit 202 pedagogy manifest module id). */
    pedagogyCorpusId: stableId,
    /** The question-blueprint version identity all deterministic question generation within this release uses (see module header). */
    questionBlueprintVersion: z.number().int().min(1),
  })
  .superRefine((release, ctx) => {
    const seen = new Set<string>();
    for (const [index, member] of release.lessons.entries()) {
      if (seen.has(member.lessonId)) {
        ctx.addIssue({
          code: "custom",
          path: ["lessons", index, "lessonId"],
          message: `duplicate membership for lesson '${member.lessonId}' within release '${release.id}' -- a release names exactly one version of a lesson`,
        });
      }
      seen.add(member.lessonId);
    }
  });
export type ContentRelease = z.infer<typeof contentReleaseSchema>;

export const contentReleaseManifestSchema = z
  .object({
    releases: z.array(contentReleaseSchema).min(1),
  })
  .superRefine((manifest, ctx) => {
    const seen = new Set<string>();
    for (const [index, release] of manifest.releases.entries()) {
      if (seen.has(release.id)) {
        ctx.addIssue({ code: "custom", path: ["releases", index, "id"], message: `duplicate content release id '${release.id}'` });
      }
      seen.add(release.id);
    }
  });
export type ContentReleaseManifest = z.infer<typeof contentReleaseManifestSchema>;
