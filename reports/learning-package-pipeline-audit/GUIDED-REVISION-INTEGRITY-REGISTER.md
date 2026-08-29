# Guided Revision Integrity Register (CC-13B)

**Top-line verdict: SCHEMA + PURE-FUNCTION ONLY.** `buildGuidedRevisionPlan()` and its supporting types are real, deterministic, well-tested pure functions — but have zero callers, zero persistence layer, and zero learner-facing UI anywhere in the repository outside `packages/content-schema` and its own tests.

## 1. Runtime/storage wiring search — confirmed absent

`buildGuidedRevisionPlan`/`GuidedRevisionPlan`/the string "guided-revision" have zero real (non-test, non-comment) usages in `apps/` or elsewhere in `packages/`, except one **comment** (not code) in `packages/diagnostic-engine/src/select-next-activity.ts`:

```
* deterministic Guided Revision plan (@alp/content-schema's
* guided-revision.ts) ranking full canonical lessons -- not by this
```

No import, no call. **No persistence layer exists anywhere** for `GuidedRevisionPlan` or `FormativeAssessmentInstance`/`SubmittedAssessmentResult` — grepped broadly across `apps/`, `packages/`. There is no backend/API directory in this repository at all (the mobile app talks directly to Supabase for outbox sync; no server-side code was found). No AsyncStorage/SQLite key, no Supabase table reference — nothing. This is consistent with, and confirms, CC-13A's own scope claim that these are storage/UI-free schema types.

## 2. The pure functions themselves are genuinely well-built, not thin stubs

Read `packages/content-schema/src/guided-revision.ts` and `assessment-instance.ts` in full.

`buildGuidedRevisionPlan` (`guided-revision.ts` lines 127-171):
- aggregates only `!item.correct` results, grouped by `revisionLessonIds`;
- sums `evidenceWeight ?? 1` per lesson to produce a `priorityScore`;
- sorts deterministically (`priorityScore` descending, tiebreak `lessonId.localeCompare`);
- assigns contiguous 1..n ranks and thirds-split `HIGH`/`MEDIUM`/`LOW` priority bands (`computePriorityBand`, lines 98-104);
- validates its own output against `guidedRevisionPlanSchema`'s `superRefine` (duplicate-lesson and rank-contiguity checks, lines 74-93) before returning.

No clock/RNG/network reads inside the function; `generatedAt`/`planId`/`policyVersion` are caller-supplied inputs — matching the module's own determinism claim, and matching ADR-0006 §8's requirement that ranking "must not use opaque runtime AI or ML."

`selectLatestSubmittedResultInScope()` (also in `guided-revision.ts`) is the function responsible for the "latest submitted assessment in scope" rule (V1-LEARNING-ASSESSMENT-AND-GUIDED-REVISION-ARCHITECTURE.md §8) — present and real, but likewise has zero real callers.

Independently re-run test suites (read-only):

```
npx vitest run packages/content-schema/src/guided-revision.test.ts packages/content-schema/src/assessment-instance.test.ts packages/content-schema/src/learning-package-gate.test.ts
Test Files  3 passed (3)
     Tests  33 passed (33)
```

Matches `PROJECT-STATUS.md`'s claimed 10 + 12 + 11 = 33 new tests for these three files. **Assessment: these are real, non-trivial, correctly-specified pure functions** — the risk here is not code quality, it is that none of it is reachable.

## 3. Publication gates (`isPublicationReady`) — also schema-only, uncalled

`packages/content-schema/src/learning-package-gate.ts` defines `GateName` (9 gates including `FORMATIVE_ASSESSMENT`/`GUIDED_REVISION`), `LearningPackageGateResult` (own `superRefine`: WAIVED needs a waiver, FAIL needs failures listed, PASS can't carry failures), and:

```ts
export function isPublicationReady(results: readonly LearningPackageGateResult[], mandatoryGates: readonly GateName[]): boolean {
  return mandatoryGates.every((gate) => results.some((result) => result.gate === gate && (result.status === "PASS" || result.status === "WAIVED")));
}
```

Grepped the entire repo (`scripts/`, `package.json`, no CI config beyond npm scripts) for `isPublicationReady`: the only hits are inside `learning-package-gate.test.ts` (import + 5 `expect()` calls). **No validator script, no `package.json` script, and no CI workflow calls it.** There is currently no mechanical way for the repository to actually compute or enforce "is this lesson/package learner-ready" — the gate model exists, but nothing produces or consumes real `LearningPackageGateResult` records.

## 4. Contrast: CC-07 evidence/mastery is genuinely live, unlike this whole layer

`packages/evidence-engine/src/` is imported and called from real production code: `apps/mobile/src/lib/evidence-sync/derived-snapshot.ts` (`deriveLearnerState`, `toLearnerEvidenceSnapshot`), consumed by `apps/mobile/src/app/(app)/learn/lesson-player.tsx` (line 213) and `apps/mobile/src/lib/course/next-activity.ts` (line 17, `computeNextCourseActivity`). This is a genuine, useful architectural contrast worth stating plainly: **the pre-ADR-0006 evidence/mastery machinery is live and driving the shipping app today; the new ADR-0006 assessment→weakness→Guided-Revision layer that is supposed to be V1's actual adaptive surface has no equivalent wiring at all.** V1 currently has neither its intended adaptive surface (Guided Revision) nor a UI expression of it — only the older, richer, retained-but-not-V1-required machinery is actually running.

## 5. Severity summary

| Finding | Severity | Root cause / Symptom | Fix type |
|---|---|---|---|
| No caller, no persistence, no UI for `GuidedRevisionPlan` anywhere | P0 | Root cause (explicitly deferred by CC-13A's own scope) | HUMAN-REVIEW-REQUIRED (full feature build: storage + UI + wiring to a real submitted-assessment source, which does not exist either — see `ASSESSMENT-SUBMISSION-INTEGRITY-REGISTER.md`) |
| `isPublicationReady()`/gate model uncalled outside its own test | P1 | Root cause | HUMAN-REVIEW-REQUIRED (a real release-check script/CI step needs to be built and wired) |
| Pure functions themselves are correct/well-tested | — (confirmed correct, no finding) | — | — |
| V1's intended adaptive surface (Guided Revision) has zero runtime presence while the older CC-07/CC-08 adaptive machinery remains live and driving the app | P1 (product-risk framing, not a code defect) | Symptom — worth surfacing explicitly for Product Owner awareness | HUMAN-REVIEW-REQUIRED |
