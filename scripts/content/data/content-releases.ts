/**
 * Governed Content Release manifest (CC-06D, Correction A) -- the
 * controlled, human-authored declaration of which content releases
 * exist, typed against @alp/content-schema's `contentReleaseManifestSchema`.
 *
 * A release is a stable identity for one coherent, IMMUTABLE snapshot of
 * governed learner content: which LessonPlan (id, version) pairs belong
 * to it, which governed corpus snapshot it references, and which
 * question-blueprint version executes within it. Every LessonPlan's
 * `contentRelease` field must name a release declared here, and must
 * appear in that release's membership -- enforced mechanically by
 * scripts/content/validate-lesson-plan.ts (`npm run lesson:validate:check`).
 *
 * Release ids are stable typed identities, never timestamps.
 *
 * IMMUTABILITY (CC-08A correction): once declared, a release's
 * membership is never grown, shrunk or redefined -- exactly the same
 * principle already established for evidence provenance ("releases are
 * immutable governed snapshots, so (contentRelease, blueprintId) +
 * release-level questionBlueprintVersion already identify blueprint
 * semantics unambiguously for durable attempts", PROJECT-STATUS.md
 * §CC-07). CC-08 briefly violated this by additively extending
 * `release.unit202.v1`'s membership in place; that was wrong and has
 * been reverted here. `release.unit202.v1` is restored to its original,
 * exact CC-06D shape (Ohm's Law only) and a NEW release,
 * `release.unit202.v2`, carries the CC-08 four-lesson expansion instead.
 * A lesson may legitimately be a member of more than one release without
 * being "duplicated" (see lessonPlanManifestSchema's own comment) --
 * `lesson.electrical.ohms-law`'s real, unmodified step content is a
 * genuine member of both v1 and v2, addressed twice (once per release)
 * rather than moved.
 */

import type { ContentReleaseManifest } from "@alp/content-schema";

import { CC04_KNOWLEDGE_CORPUS_ID } from "./cc04-unit202-electrical-science.ts";
import { CC05A_PEDAGOGY_CORPUS_ID } from "./cc05a-pedagogy-unit202.ts";

/**
 * The original CC-06D release: the real canonical Ohm's Law lesson and
 * its governed Unit 202 dependencies. Frozen exactly as first declared --
 * never grown, never redefined. Superseded as the bundled/proving
 * release by `release.unit202.v2` (below), but remains valid, resolvable
 * and unchanged for anything that already names it.
 */
export const RELEASE_UNIT202_V1 = "release.unit202.v1" as const;

/**
 * CC-08: the four-lesson cross-lesson adaptive-vertical release --
 * `release.unit202.v1`'s real Ohm's Law lesson (same, unmodified step
 * content; a new membership entry, not a move) plus the three new real
 * lessons (foundational formula-rearrangement, resistors-series,
 * resistors-parallel). This is the release the CC-08 adaptive loop and
 * the bundled mobile app actually use.
 */
export const RELEASE_UNIT202_V2 = "release.unit202.v2" as const;

/**
 * CC-10: `release.unit202.v2`'s own membership is left exactly as CC-08
 * declared it -- immutable, per this file's own documented rule -- and a
 * NEW release, `release.unit202.v3`, carries the CC-10 nine-lesson
 * expansion instead (exactly the same "new release, not a mutation"
 * pattern v2 itself was created by). `lesson.electrical.ohms-law`'s real,
 * unmodified step content is a genuine member of v1, v2 AND v3 -- one
 * authored source, three release-scoped membership entries, never three
 * copies of the content.
 */
export const RELEASE_UNIT202_V3 = "release.unit202.v3" as const;

/** The release whose generated learner-runtime projection is bundled into the mobile app (scripts/content/generate-mobile-projection.ts). */
export const MOBILE_BUNDLED_RELEASE_ID = RELEASE_UNIT202_V3;

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
    {
      id: RELEASE_UNIT202_V2,
      schemaVersion: 1,
      lessons: [
        { lessonId: "lesson.electrical.ohms-law", lessonVersion: 1 },
        { lessonId: "lesson.foundation.maths.formula-rearrangement", lessonVersion: 1 },
        { lessonId: "lesson.electrical.resistors-series", lessonVersion: 1 },
        { lessonId: "lesson.electrical.resistors-parallel", lessonVersion: 1 },
      ],
      knowledgeCorpusId: CC04_KNOWLEDGE_CORPUS_ID,
      pedagogyCorpusId: CC05A_PEDAGOGY_CORPUS_ID,
      questionBlueprintVersion: 1,
    },
    {
      id: RELEASE_UNIT202_V3,
      schemaVersion: 1,
      lessons: [
        { lessonId: "lesson.electrical.ohms-law", lessonVersion: 1 },
        { lessonId: "lesson.foundation.maths.formula-rearrangement", lessonVersion: 1 },
        { lessonId: "lesson.electrical.resistors-series", lessonVersion: 1 },
        { lessonId: "lesson.electrical.resistors-parallel", lessonVersion: 1 },
        { lessonId: "lesson.electrical.core-quantities", lessonVersion: 1 },
        { lessonId: "lesson.electrical.si-units", lessonVersion: 1 },
        { lessonId: "lesson.electrical.instrumentation", lessonVersion: 1 },
        { lessonId: "lesson.electrical.charge-and-current", lessonVersion: 1 },
        { lessonId: "lesson.electrical.conductors-and-insulators", lessonVersion: 1 },
        { lessonId: "lesson.electrical.thermal-and-chemical-effects", lessonVersion: 1 },
        { lessonId: "lesson.electrical.resistivity", lessonVersion: 1 },
        { lessonId: "lesson.electrical.power", lessonVersion: 1 },
        { lessonId: "lesson.electrical.energy-and-efficiency", lessonVersion: 1 },
        { lessonId: "lesson.electrical.fault-conditions-protection", lessonVersion: 1 },
        { lessonId: "lesson.electrical.series-vs-parallel-comparison", lessonVersion: 1 },
      ],
      knowledgeCorpusId: CC04_KNOWLEDGE_CORPUS_ID,
      pedagogyCorpusId: CC05A_PEDAGOGY_CORPUS_ID,
      questionBlueprintVersion: 1,
    },
  ],
};
