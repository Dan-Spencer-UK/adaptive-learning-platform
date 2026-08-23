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

/**
 * CC-11: `release.unit202.v3`'s own membership is left exactly as CC-10
 * declared it -- immutable, per this file's own documented rule -- and a
 * NEW release, `release.unit202.v4`, carries the CC-11 nine-lesson
 * expansion (LO3 remainder, LO5, LO6) instead, exactly the same pattern
 * v2/v3 themselves were created by. Every pre-existing lesson's real,
 * unmodified step content is a genuine member of v4 too -- one authored
 * source, a fourth release-scoped membership entry, never a fourth copy
 * of the content.
 */
export const RELEASE_UNIT202_V4 = "release.unit202.v4" as const;

/**
 * CC-11.1: three of `release.unit202.v4`'s own 9 newly-authored lessons
 * (`lesson.magnetism.fundamentals`, `lesson.magnetism.effects-of-current`,
 * `lesson.emf.ac-generation-principles`) needed genuine STEP-CONTENT
 * corrections within hours of v4's own creation -- CC-11's own LO5
 * workstream found three real Unit 202 AC5.1/AC5.3 assessment-obligation
 * gaps (see PROJECT-STATUS.md §CC-11.1), and closing them required adding
 * real new teaching/practice steps to those three lessons, not merely a
 * new release-scoped membership entry reusing unmodified content. Per
 * this file's own documented immutability rule, that content correction
 * cannot be applied to `release.unit202.v4` in place -- so
 * `release.unit202.v5` carries it instead, exactly the same "new
 * release, not a mutation" pattern v2/v3/v4 were each created by.
 *
 * Honest scope note (this is a narrower case than v2/v3/v4's own
 * creation): `release.unit202.v4`'s own declared membership list below is
 * left byte-identical, per the immutability rule -- but because those
 * three lessons' underlying `LessonPlan` objects are single-sourced (each
 * has exactly one authored form, changed in place to fix the genuine
 * gaps, with no preserved historical copy of the pre-fix step content),
 * their own `contentRelease` field now reads `release.unit202.v5`, not
 * `v4`. A resolver that specifically requests `release.unit202.v4` for
 * one of those three lesson ids will correctly, loudly fail
 * (`UnknownLessonError`) rather than silently serve the corrected
 * content under the old release's name -- a safe failure mode, not a
 * silent mutation. `release.unit202.v4` was never bundled to a real
 * learner (superseded by v5 the same development session it was cut) and
 * should be treated as historical/non-resolvable for those three members
 * specifically; the other 21 v4 members remain fully resolvable exactly
 * as declared. `release.unit202.v5` is the first release where all 24
 * members are consistently resolvable.
 */
export const RELEASE_UNIT202_V5 = "release.unit202.v5" as const;

/**
 * CC-11.2: closes the last known Unit 202 evidence gap -- AC4.1's own
 * "electron-theory-of-current" obligation was taught
 * (`lesson.electrical.conductors-and-insulators`) but never directly
 * assessed. Same pattern as v5's own creation: `release.unit202.v5`'s
 * own declared membership below is left byte-identical (immutable), and
 * because `lesson.electrical.conductors-and-insulators` is single-
 * sourced, its `contentRelease` field now reads `release.unit202.v6`,
 * not `v5`. That lesson's pre-CC-11.2 step content is preserved,
 * byte-identical, in
 * `lesson-conductors-and-insulators-v3-v5-historical-snapshot.ts` and
 * referenced from v3/v4/v5's own membership blocks below so all three
 * remain fully resolvable -- a resolver requesting `release.unit202.v5`
 * (or v4, or v3) for this lesson id correctly gets the pre-CC-11.2
 * content, never the corrected content silently substituted in. The
 * other 23 v5 members are unaffected and remain resolvable exactly as
 * v5 declared them. `release.unit202.v6` is the first release where
 * every Unit 202 required-obligation evidence route exists (0 tracked
 * exceptions, not just 0 untracked gaps).
 */
export const RELEASE_UNIT202_V6 = "release.unit202.v6" as const;

/**
 * CC-11.3: closes the whole-course instructional-visual-completeness and
 * -correctness gate. Same pattern as v5/v6's own creation:
 * `release.unit202.v6`'s own declared membership below is left byte-
 * identical (immutable), and because 7 lessons are single-sourced
 * (`lesson.foundation.physics.simple-machines`,
 * `lesson.electrical.resistivity`,
 * `lesson.electrical.electronic-components-passive`,
 * `lesson.electrical.electronic-components-switching-control`,
 * `lesson.magnetism.fundamentals`, `lesson.magnetism.effects-of-current`,
 * `lesson.emf.ac-generation-principles`), each gaining REQUIRED
 * instructional-visual integration (new diagrams wired into their own
 * concept/practice steps) plus, for `lesson.emf.ac-generation-
 * principles`, a genuine correctness fix (the wrongly-reused static
 * motor-principle diagram replaced with a real rotating-loop generator
 * diagram), their `contentRelease` field now reads `release.unit202.v7`,
 * not their previous value. Each lesson's pre-CC-11.3 step content is
 * preserved, byte-identical, in `lesson-cc11-3-historical-snapshot.ts`
 * and referenced from every past release block that previously resolved
 * it (v3/v4/v5/v6, whichever apply per lesson -- see that snapshot
 * file's own naming convention) so all of them remain fully resolvable.
 * The other 17 v6 members are unaffected and remain resolvable exactly
 * as v6 declared them. `release.unit202.v7` is the first release where
 * every part of Unit 202 that materially benefits from instructional
 * imagery has a real, governed, rendered and lesson-integrated visual
 * (see PROJECT-STATUS.md §CC-11.3 for the full completeness/correctness
 * account).
 */
export const RELEASE_UNIT202_V7 = "release.unit202.v7" as const;

/** The release whose generated learner-runtime projection is bundled into the mobile app (scripts/content/generate-mobile-projection.ts). */
export const MOBILE_BUNDLED_RELEASE_ID = RELEASE_UNIT202_V7;

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
    {
      id: RELEASE_UNIT202_V4,
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
        // CC-11: LO3 remainder (Workstream A).
        { lessonId: "lesson.foundation.physics.mass-and-weight", lessonVersion: 1 },
        { lessonId: "lesson.foundation.physics.simple-machines", lessonVersion: 1 },
        { lessonId: "lesson.foundation.physics.mechanics-force-work-energy-power", lessonVersion: 1 },
        // CC-11: LO5 (Workstream B).
        { lessonId: "lesson.magnetism.fundamentals", lessonVersion: 1 },
        { lessonId: "lesson.magnetism.effects-of-current", lessonVersion: 1 },
        { lessonId: "lesson.emf.ac-generation-principles", lessonVersion: 1 },
        { lessonId: "lesson.waveforms.ac-dc-and-sine-wave-quantities", lessonVersion: 1 },
        // CC-11: LO6 (Workstream C).
        { lessonId: "lesson.electrical.electronic-components-passive", lessonVersion: 1 },
        { lessonId: "lesson.electrical.electronic-components-switching-control", lessonVersion: 1 },
      ],
      knowledgeCorpusId: CC04_KNOWLEDGE_CORPUS_ID,
      pedagogyCorpusId: CC05A_PEDAGOGY_CORPUS_ID,
      questionBlueprintVersion: 1,
    },
    {
      // CC-11.1: closes the LO5 AC5.1/AC5.3 evidence gaps -- see
      // RELEASE_UNIT202_V5's own doc comment above. Same 24-lesson
      // membership as v4; 3 lessons' underlying content was genuinely
      // corrected (not merely re-addressed unchanged), the rest reused
      // exactly as v4 declared them.
      id: RELEASE_UNIT202_V5,
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
        { lessonId: "lesson.foundation.physics.mass-and-weight", lessonVersion: 1 },
        { lessonId: "lesson.foundation.physics.simple-machines", lessonVersion: 1 },
        { lessonId: "lesson.foundation.physics.mechanics-force-work-energy-power", lessonVersion: 1 },
        // CC-11.1: content genuinely corrected relative to v4 (AC5.1/AC5.3 gaps closed).
        { lessonId: "lesson.magnetism.fundamentals", lessonVersion: 1 },
        { lessonId: "lesson.magnetism.effects-of-current", lessonVersion: 1 },
        { lessonId: "lesson.emf.ac-generation-principles", lessonVersion: 1 },
        { lessonId: "lesson.waveforms.ac-dc-and-sine-wave-quantities", lessonVersion: 1 },
        { lessonId: "lesson.electrical.electronic-components-passive", lessonVersion: 1 },
        { lessonId: "lesson.electrical.electronic-components-switching-control", lessonVersion: 1 },
      ],
      knowledgeCorpusId: CC04_KNOWLEDGE_CORPUS_ID,
      pedagogyCorpusId: CC05A_PEDAGOGY_CORPUS_ID,
      questionBlueprintVersion: 1,
    },
    {
      // CC-11.2: closes the AC4.1 electron-theory-of-current evidence
      // gap -- see RELEASE_UNIT202_V6's own doc comment above. Same
      // 24-lesson membership as v5; 1 lesson's underlying content was
      // genuinely corrected (not merely re-addressed unchanged), the
      // rest reused exactly as v5 declared them.
      id: RELEASE_UNIT202_V6,
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
        // CC-11.2: content genuinely corrected relative to v5 (AC4.1 gap closed).
        { lessonId: "lesson.electrical.conductors-and-insulators", lessonVersion: 1 },
        { lessonId: "lesson.electrical.thermal-and-chemical-effects", lessonVersion: 1 },
        { lessonId: "lesson.electrical.resistivity", lessonVersion: 1 },
        { lessonId: "lesson.electrical.power", lessonVersion: 1 },
        { lessonId: "lesson.electrical.energy-and-efficiency", lessonVersion: 1 },
        { lessonId: "lesson.electrical.fault-conditions-protection", lessonVersion: 1 },
        { lessonId: "lesson.electrical.series-vs-parallel-comparison", lessonVersion: 1 },
        { lessonId: "lesson.foundation.physics.mass-and-weight", lessonVersion: 1 },
        { lessonId: "lesson.foundation.physics.simple-machines", lessonVersion: 1 },
        { lessonId: "lesson.foundation.physics.mechanics-force-work-energy-power", lessonVersion: 1 },
        { lessonId: "lesson.magnetism.fundamentals", lessonVersion: 1 },
        { lessonId: "lesson.magnetism.effects-of-current", lessonVersion: 1 },
        { lessonId: "lesson.emf.ac-generation-principles", lessonVersion: 1 },
        { lessonId: "lesson.waveforms.ac-dc-and-sine-wave-quantities", lessonVersion: 1 },
        { lessonId: "lesson.electrical.electronic-components-passive", lessonVersion: 1 },
        { lessonId: "lesson.electrical.electronic-components-switching-control", lessonVersion: 1 },
      ],
      knowledgeCorpusId: CC04_KNOWLEDGE_CORPUS_ID,
      pedagogyCorpusId: CC05A_PEDAGOGY_CORPUS_ID,
      questionBlueprintVersion: 1,
    },
    {
      // CC-11.3: closes the whole-course instructional-visual-completeness
      // and -correctness gate -- see RELEASE_UNIT202_V7's own doc comment
      // above. Same 24-lesson membership as v6; 7 lessons' underlying
      // content was genuinely corrected/extended (REQUIRED visual
      // integration, plus one real defect fix), the rest reused exactly
      // as v6 declared them.
      id: RELEASE_UNIT202_V7,
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
        // CC-11.3: content genuinely corrected/extended relative to v6 (REQUIRED visual integration).
        { lessonId: "lesson.electrical.resistivity", lessonVersion: 1 },
        { lessonId: "lesson.electrical.power", lessonVersion: 1 },
        { lessonId: "lesson.electrical.energy-and-efficiency", lessonVersion: 1 },
        { lessonId: "lesson.electrical.fault-conditions-protection", lessonVersion: 1 },
        { lessonId: "lesson.electrical.series-vs-parallel-comparison", lessonVersion: 1 },
        { lessonId: "lesson.foundation.physics.mass-and-weight", lessonVersion: 1 },
        // CC-11.3: content genuinely corrected/extended relative to v6 (REQUIRED visual integration).
        { lessonId: "lesson.foundation.physics.simple-machines", lessonVersion: 1 },
        { lessonId: "lesson.foundation.physics.mechanics-force-work-energy-power", lessonVersion: 1 },
        // CC-11.3: content genuinely corrected/extended relative to v6 (REQUIRED visual integration).
        { lessonId: "lesson.magnetism.fundamentals", lessonVersion: 1 },
        // CC-11.3: content genuinely corrected/extended relative to v6 (REQUIRED visual integration).
        { lessonId: "lesson.magnetism.effects-of-current", lessonVersion: 1 },
        // CC-11.3: content genuinely corrected relative to v6 (visual integration + the motor/generator-diagram defect fix).
        { lessonId: "lesson.emf.ac-generation-principles", lessonVersion: 1 },
        { lessonId: "lesson.waveforms.ac-dc-and-sine-wave-quantities", lessonVersion: 1 },
        // CC-11.3: content genuinely corrected/extended relative to v6 (REQUIRED visual integration).
        { lessonId: "lesson.electrical.electronic-components-passive", lessonVersion: 1 },
        // CC-11.3: content genuinely corrected/extended relative to v6 (REQUIRED visual integration).
        { lessonId: "lesson.electrical.electronic-components-switching-control", lessonVersion: 1 },
      ],
      knowledgeCorpusId: CC04_KNOWLEDGE_CORPUS_ID,
      pedagogyCorpusId: CC05A_PEDAGOGY_CORPUS_ID,
      questionBlueprintVersion: 1,
    },
  ],
};
