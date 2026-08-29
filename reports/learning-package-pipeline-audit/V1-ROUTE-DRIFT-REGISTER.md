# V1 Route-Drift Register (CC-13B)

**Question:** can a `CANONICAL_FIXED_ROUTE`-flagged V1 lesson still have its route altered by mastery/evidence/branching engines?

**Top-line verdict: HAS-A-GAP.** The schema gate is real, tested, and correctly enforces one half of the ADR-0006 invariant. It does not enforce the other half. The gap is currently inert only because zero real lessons declare `routePolicy` at all.

**Remediation status (CC-13C.1): §2's `branchRoutes` gap is CLOSED.** `packages/content-schema/src/lesson-plan.ts`'s `CANONICAL_FIXED_ROUTE` `superRefine` now also rejects any step with a non-empty `branchRoutes` array, closing BP-1 below. This finding (the historical audit record) is preserved unedited below for the record; it describes the state of the repository as found, before this fix. See the CC-13C.1 commit immediately following the CC-13B/13B.1/13B.2 commits in `PROJECT-STATUS.md` for detail. §3's separate, lower-severity "no runtime defense-in-depth" finding (`assembler.ts`/`branching.ts` have no independent `routePolicy` awareness) is **not** addressed by this package and remains open, per CC-13C.1's deliberately narrow scope.

## 1. What the schema gate actually does (verified by direct read, not by the prior claim alone)

`packages/content-schema/src/lesson-plan.ts` lines 534-544, inside `lessonPlanSchema`'s `superRefine`:

```ts
if (lesson.routePolicy === "CANONICAL_FIXED_ROUTE") {
  for (const [index, step] of lesson.steps.entries()) {
    if (step.requirement !== "required") {
      ctx.addIssue({
        code: "custom",
        path: ["steps", index, "requirement"],
        message: `lesson '${lesson.id}' declares routePolicy 'CANONICAL_FIXED_ROUTE' but step '${step.id}' has requirement '${step.requirement}' -- ...`,
      });
    }
  }
}
```

This is real and correctly rejects any non-`required` step in a lesson declaring `CANONICAL_FIXED_ROUTE`. `packages/content-schema/src/lesson-plan.test.ts` lines 336-364 has 3 real, passing tests for exactly this behaviour (accept-all-required, reject-conditional-step, no-effect-without-routePolicy). Independently re-run: **30/30 `lesson-plan.test.ts` tests pass.**

## 2. The gap: `branchRoutes` is not covered by the same gate

The `superRefine` above checks `step.requirement` only. It never checks `step.branchRoutes` (default `[]`, but not forced empty when `routePolicy === "CANONICAL_FIXED_ROUTE"`). A step can be `requirement: "required"` — satisfying the gate — while still declaring a non-empty `branchRoutes` entry (e.g. `trigger: "incorrect_answer"` routing to another step). Nothing in the schema forbids this combination today.

Confirmed: the only other place in the repo that inspects `branchRoutes.length` is `scripts/content/generate-lesson-review.ts` (a reporting tool, not a validation gate), and `scripts/content/validate-v1-learning-package.ts`'s `postV1StepTypesInCanonicalRoute` check only looks at `classifyV1StepRole(step.type)`, never `branchRoutes`. No test exists for "a `CANONICAL_FIXED_ROUTE` lesson with a `required` step that also carries `branchRoutes`" — consistent with the gap being both unenforced and untested.

**Runtime consequence if the gap were ever exercised**: `packages/learning-engine/src/branching.ts`'s `resolveWithinSessionBranch` iterates `step.branchRoutes` for a trigger/misconception match with **zero reference to `lesson.routePolicy`** anywhere in the function. `apps/mobile/src/lib/lesson-session/lesson-controller.ts`'s `resolveBranchDestination` calls it unconditionally on every graded-step submission, for every lesson, with no `routePolicy` check in the call chain either. If a `CANONICAL_FIXED_ROUTE` lesson ever had a `required` step with `branchRoutes` populated (schema-legal today), the runtime would branch it exactly as it branches the 4 known non-V1 branching lessons.

Severity: **P0 (architecture-integrity defect)** — the ADR-0006 invariant "the ordered canonical sections list must not change for evidence/mastery reasons" is enforced for step *inclusion* but not for within-session *branch destination*. MACHINE-FIXABLE: extend the same `superRefine` loop to also reject non-empty `branchRoutes` (and `masteryGateCapabilityId`, if applicable) on any step when `lesson.routePolicy === "CANONICAL_FIXED_ROUTE"`.

## 3. `assembler.ts` / `branching.ts` — comment-only, no runtime routePolicy awareness (defense-in-depth gap)

`packages/learning-engine/src/assembler.ts`'s `decideStep` (lines 43-46) does short-circuit to unconditional inclusion for `requirement: "required"` steps — real code, not just a comment:

```ts
function decideStep(lesson: LessonPlan, step: LessonStep, evidence: LearnerEvidenceSnapshot): AssembledStepDecision {
  if (step.requirement === "required") {
    return { stepId: step.id, included: true, reason: "required", detail: "Step is unconditionally required by the canonical plan." };
  }
  ...
```

But it never reads `lesson.routePolicy` at all — the "degeneration" described in `PROJECT-STATUS.md` §CC-13A point 7 is an *emergent consequence* of the schema invariant holding upstream, not an explicit runtime check. There is no defense-in-depth: if a malformed/legacy object ever reached this function with `routePolicy: "CANONICAL_FIXED_ROUTE"` and a non-`"required"` step (bypassing schema validation some other way), `decideStep` would branch it exactly as normal.

**Schema validation is confirmed build-time only** in the real mobile path: `scripts/content/generate-mobile-projection.ts` calls `lessonPlanManifestSchema.parse({ lessons })` once, at content-generation time (`npm run content:mobile:generate`), producing the committed `apps/mobile/src/lib/lesson-content/generated/mobile-content-projection.ts`. `apps/mobile/src/lib/lesson-content/local-content-registry.ts` has zero `.parse(`/`safeParse`/`Schema` occurrences — it returns typed objects from the generated file with no runtime re-validation. `lesson-player.tsx` calls `assembleLessonInstance` directly on that build-time-validated object. So a schema violation would fail `content:mobile:generate` and never reach the shipped bundle today — but the runtime code itself provides no independent guarantee.

## 4. `select-next-activity.ts` — one factual inaccuracy in PROJECT-STATUS.md

`PROJECT-STATUS.md` §CC-13A point 7 claims all three files (`assembler.ts`, `branching.ts`, `packages/diagnostic-engine/src/select-next-activity.ts`) "each gained a header-comment addendum stating the ADR-0006 status verbatim and explaining mechanically why the code is safe as-is (`decideStep` degenerates to unconditional inclusion...)". This is accurate for `assembler.ts`/`branching.ts` (verified verbatim) but **inaccurate for `select-next-activity.ts`**: its header addendum discusses ADR-0006/CC-13A status in different terms (course-level next-activity selection is not the V1 path) and contains zero occurrences of `decideStep`, `degenerat`, `CANONICAL_FIXED_ROUTE`, or `routePolicy`. This file operates at course/lesson level and has no step-level `decideStep`-equivalent to degenerate — the underlying "safe as-is" conclusion is not disproven, but the specific sentence in PROJECT-STATUS.md overstates what that file's own comment says. Severity: **P2 (cleanup)** — a documentation-accuracy correction, HUMAN-REVIEW-REQUIRED (a one-line PROJECT-STATUS.md wording fix, out of scope for this audit to make itself).

## 5. Real-corpus adoption: zero lessons exercise the protection either way

Confirmed independently by two methods — a direct grep of `scripts/content/data/**/*.ts` for the literal strings `routePolicy`/`CANONICAL_FIXED_ROUTE` (zero hits), and `scripts/audit/lesson-structure-audit.ts`'s own computed count (`routePolicyAdoption.lessonsDeclaringCanonicalFixedRoute: 0` out of 24 lessons in `release.unit202.v8`; the full 140-lesson historical corpus is also 0/140 per the H-M agent's `v1-package:report` run). **This mechanism — sound half, gapped half — is completely unexercised by real content today.** That is itself a finding, not proof the mechanism works end-to-end: nothing in the real product has yet tested the CANONICAL_FIXED_ROUTE contract against a real lesson.

## 6. The 4 known branching lessons are correctly NOT mislabeled

`lesson.electrical.ohms-law`, `lesson.electrical.resistors-parallel`, `lesson.magnetism.effects-of-current`, `lesson.waveforms.ac-dc-and-sine-wave-quantities` each genuinely use non-empty `branchRoutes` and `requirement: "conditional_remediation_only"` steps, and **none declares `routePolicy` at all**. This is exactly the ADR-0006-compliant categorisation the architecture calls for: legitimate retained post-V1/platform-capability branching, correctly not mislabeled as a V1 canonical fixed route. No finding here — this is confirmed-correct.

`packages/diagnostic-engine/src/select-next-activity.ts` operates only at course/lesson-selection level and cannot be invoked mid-lesson to alter a `CANONICAL_FIXED_ROUTE` lesson's own step sequence — confirmed by absence of any step-level entry point in that file.

`packages/evidence-engine` (CC-07) has no step-sequencing logic of its own; it computes `DerivedLearnerState` and feeds it as an *input* to `assembleLessonInstance` via `apps/mobile/src/lib/evidence-sync/derived-snapshot.ts`. It is a correctly-separated input, not an independent bypass — but it is real and live (imported by `lesson-player.tsx` and `apps/mobile/src/lib/course/next-activity.ts`), so once the `branchRoutes` gap in §2 is closed, this input feed does not itself need to change.

## 7. Severity summary

| Finding | Severity | Root cause / Symptom | Fix type | Status |
|---|---|---|---|---|
| `branchRoutes` not covered by the CANONICAL_FIXED_ROUTE superRefine gate (§2) | P0 | Root cause | MACHINE-FIXABLE | **CLOSED (CC-13C.1)** |
| No runtime (assembler/branching) defense-in-depth independent of build-time schema validation (§3) | P1 | Root cause | MACHINE-FIXABLE (add an explicit routePolicy-aware guard) but architecturally optional if §2 is closed and the build-time gate is trusted as the sole enforcement point — Project Architect judgement call | Open |
| PROJECT-STATUS.md overstates `select-next-activity.ts`'s header comment content (§4) | P2 | Symptom (documentation accuracy) | HUMAN-REVIEW-REQUIRED (doc correction) | Open |
| 0/140 real lessons (all releases) declare `routePolicy` at all (§5) | P2 (expected baseline, not itself a defect) | Root cause: re-authoring deferred to a later package | HUMAN-REVIEW-REQUIRED (content work) | Open (by design — deferred to Package 13) |
| 4 known branching lessons correctly unlabeled as V1 canonical (§6) | — (confirmed correct, no finding) | — | — | — |
