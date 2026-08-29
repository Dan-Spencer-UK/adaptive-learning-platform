# Assessment Submission Integrity Register (CC-13B)

**Top-line verdict: MISSING ENTIRELY as a runtime feature.** No formative/mock assessment-taking screen, route, or wired attempt-state code exists anywhere in `apps/mobile/src` today. Schema/pure-function foundations exist and are genuinely well-built, but are completely unreachable from any running code path.

## 1. Runtime feature search — confirmed absent

Exhaustive search of `apps/mobile/src` for assessment/formative/mock-taking UI. Real routes under `apps/mobile/src/app/(app)/`: `index.tsx`, `dev-lesson-qa.tsx`, `dev-proof.tsx`, `dev-proving-visuals.tsx`, and `learn/` (`index.tsx`, `lesson-player.tsx`, `[family]/index.tsx`, `[family]/practice.tsx`). None is an assessment-taking screen.

`learn/[family]/practice.tsx` is explicitly headed `LEGACY_RETIRED (CC-12D)` — a pre-Lesson-Player single-question practice loop, unlinked from any in-app navigation, superseded by `lesson-player.tsx`, with no submission-boundary/attempt-state concept at all. This is not a formative assessment and should not be mistaken for one.

`FormativeAssessmentInstance`/`SubmittedAssessmentResult`/`buildSubmittedAssessmentResult` (`packages/content-schema/src/assessment-instance.ts`) have **zero references anywhere outside `packages/content-schema`** (grepped `apps/`, all of `packages/`). Note: Expo Router's auto-generated `apps/mobile/.expo/types/router.d.ts` lists these module paths as typed-route strings purely because Expo's router scans all `.ts`/`.test.ts` files in the monorepo for typegen — this is tooling noise, not real navigable screens; there is no screen component behind any of them.

This directly confirms CC-13A's own explicit exclusion (`PROJECT-STATUS.md` §CC-13A point 8: "no Unit 202 formative/mock assessment built").

## 2. The schema/pure-function foundation is real and well-built, not a stub

`buildSubmittedAssessmentResult` (`assessment-instance.ts` lines 148-163) is the sole sanctioned constructor and throws for any non-`SUBMITTED` instance:

```ts
if (instance.status !== "SUBMITTED" || !instance.submittedAt) {
  throw new Error(`Cannot build a SubmittedAssessmentResult from assessment instance '${instance.assessmentInstanceId}': status is '${instance.status}', not SUBMITTED. Incomplete/unsubmitted assessments must never produce a Guided Revision trigger (ADR-0006).`);
}
```

This is a real, structurally-enforced submission boundary — not merely a documented convention. Independently re-run test suite: `assessment-instance.test.ts` — part of **33/33 passing** across the three new ADR-0006 test files (see `GUIDED-REVISION-INTEGRITY-REGISTER.md` §2 for the combined count).

## 3. `mayRevealTargetAnswer` (embedded-check answer-leak gate) — real, correct, unexercised

`lesson-plan.ts` line 293 declares `mayRevealTargetAnswer: z.boolean().optional()`; the enforcing `superRefine` (lines 546-569) correctly cross-references every earlier step marked `mayRevealTargetAnswer` against every later graded (`correct_answer_required`) step testing overlapping `teaches`/`reinforces`/`capabilityIds` targets, and raises an issue on any overlap. Grepped the real corpus: **0 real lesson steps declare `mayRevealTargetAnswer`** anywhere. The mechanism is real and correctly implemented but, like the CANONICAL_FIXED_ROUTE gate, has never been exercised against real content because no step has adopted the field.

## 4. Question authoring contract adoption — real corpus numbers

`questionBlueprintManifestSchema` (`pedagogy.ts` lines 206-593) declares `requiredKnowledgeIds`, `v1PedagogicalRole`, `revisionLessonIds` (all `.optional()`), plus a `superRefine` requiring every `FORMATIVE_MOCK`-classified blueprint to have ≥1 `revisionLessonId`. Real corpus: **114 question blueprints total** (`scripts/content/data/cc05a-pedagogy-unit202.ts`, confirmed both by the schema's own `.length` and by a 0-hit grep for the three field names).

| Field | Populated | Total | Omission passes validation? |
|---|---:|---:|---|
| `requiredKnowledgeIds` | 0 | 114 | Yes |
| `v1PedagogicalRole` | 0 | 114 | Yes |
| `revisionLessonIds` | 0 | 114 | Yes |

Since 0/114 blueprints declare `v1PedagogicalRole: "FORMATIVE_MOCK"`, the `FORMATIVE_MOCK`-requires-`revisionLessonIds` `superRefine` can never fire against real data — exercised only by synthetic test fixtures.

## 5. Live validator run confirms 0-adoption baseline is still current

`npm run v1-package:report` (real script, run read-only against the live corpus):

```
Lessons: 140 (0 declare a V1 routePolicy)
Question blueprints: 114 (0 classified with a v1PedagogicalRole, 0 FORMATIVE_MOCK)
Off-syllabus required knowledge (never taught anywhere) (target 0): 0
Required knowledge from an undeclared other lesson (target 0): 0
Dangling FORMATIVE_MOCK revisionLessonIds (target 0): 0
POST_V1_ADAPTIVE step types inside a CANONICAL_FIXED_ROUTE lesson (target 0): 0
PASS: all V1 learning-package governance gates are zero.
```

This "PASS" is a **vacuous pass** — every count is 0 because nothing has adopted the fields, not because the pipeline has been proven against real adopted content. This should not be read as evidence of learner-readiness.

## 6. Severity summary

| Finding | Severity | Root cause / Symptom | Fix type |
|---|---|---|---|
| No formative/mock assessment runtime feature exists at all | P0 | Root cause (explicitly deferred by CC-13A's own scope) | HUMAN-REVIEW-REQUIRED (full feature build) |
| Submission-boundary pure functions are real/well-tested but unreachable from any UI/storage | P1 | Root cause | HUMAN-REVIEW-REQUIRED (wiring + storage layer design) |
| `mayRevealTargetAnswer` gate real but 0/270 real steps adopt it | P2 (expected baseline) | Root cause: content re-authoring deferred | HUMAN-REVIEW-REQUIRED |
| Question-authoring contract fields (requiredKnowledgeIds/v1PedagogicalRole/revisionLessonIds) 0/114 adopted | P2 (expected baseline) | Root cause: content re-authoring deferred | HUMAN-REVIEW-REQUIRED |
| `v1-package:report` "PASS" is vacuous (0 adoption, not proof of correctness) | P1 (interpretation risk) | Symptom — risk that this gets misread as a green light | HUMAN-REVIEW-REQUIRED (report labelling / PROJECT-STATUS.md honesty, addressed in this audit's own PROJECT-STATUS.md update) |
