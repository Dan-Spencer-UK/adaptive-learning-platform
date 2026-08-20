/**
 * Governed Content Release manifest (CC-06D, Correction A) -- the
 * controlled, human-authored declaration of which content releases
 * exist, typed against @alp/content-schema's `contentReleaseManifestSchema`.
 *
 * A release is a stable identity for one coherent snapshot of governed
 * learner content: which LessonPlan (id, version) pairs belong to it,
 * which governed corpus snapshot it references, and which
 * question-blueprint version executes within it. Every LessonPlan's
 * `contentRelease` field must name a release declared here, and must
 * appear in that release's membership -- enforced mechanically by
 * scripts/content/validate-lesson-plan.ts (`npm run lesson:validate:check`).
 *
 * Release ids are stable typed identities, never timestamps.
 */

import type { ContentReleaseManifest } from "@alp/content-schema";

import { CC04_KNOWLEDGE_CORPUS_ID } from "./cc04-unit202-electrical-science.ts";
import { CC05A_PEDAGOGY_CORPUS_ID } from "./cc05a-pedagogy-unit202.ts";

/**
 * The single current proving/product release: the real canonical Ohm's
 * Law lesson and its governed Unit 202 dependencies. Replaces the
 * previous inconsistent free-form strings ("lesson-plan-pilot-v1",
 * "cc05c-proving-slice-fixture-v1") that described this same actual
 * governed snapshot.
 */
export const RELEASE_UNIT202_V1 = "release.unit202.v1" as const;

/** The release whose generated learner-runtime projection is bundled into the mobile app (scripts/content/generate-mobile-projection.ts). */
export const MOBILE_BUNDLED_RELEASE_ID = RELEASE_UNIT202_V1;

export const contentReleases: ContentReleaseManifest = {
  releases: [
    {
      id: RELEASE_UNIT202_V1,
      schemaVersion: 1,
      lessons: [{ lessonId: "lesson.electrical.ohms-law", lessonVersion: 1 }],
      knowledgeCorpusId: CC04_KNOWLEDGE_CORPUS_ID,
      pedagogyCorpusId: CC05A_PEDAGOGY_CORPUS_ID,
      questionBlueprintVersion: 1,
    },
  ],
};
