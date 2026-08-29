# Lesson Depth & Fragmentation Register (CC-13B)

**Scope:** mechanical, real-corpus analysis of every lesson in the currently-bundled release, `release.unit202.v8` (24 lessons, 270 steps — the exact set `MOBILE_BUNDLED_RELEASE_ID` resolves and the exact set the mobile app ships). Numbers in this file are computed, not estimated, by two new read-only audit scripts (kept for reproducibility, not part of production):

- `scripts/audit/lesson-structure-audit.ts` — main analysis, output saved verbatim at `reports/learning-package-pipeline-audit/lesson-depth-fragmentation-data.json` (this file's structured companion).
- `scripts/audit/lesson-structure-audit-supplement.ts` — character-length distribution / completion-condition breakdown used to calibrate the fragmentation threshold below and to find consecutive recap/completion pairs.

Both scripts reuse the real, already-governed `buildMobileContentProjection()` (`scripts/content/generate-mobile-projection.ts`) purely to obtain an in-memory resolved view of the real corpus (real `LessonPlan` objects + real resolved assertion-statement text) — no content was written, generated, or modified to produce these numbers.

Neither script counts against generic "word count" alone; both use structural signals (representation attachments, completion condition, step type) to locate candidates, and every headline claim below was then confirmed by reading the real lesson source file. Scrolling is not treated as a defect anywhere in this register, per the governing architecture.

## 1. Headline counts

| Metric | Value |
|---|---:|
| Lessons in bundled release | 24 |
| Total steps | 270 |
| Lessons with **zero** visual references (diagram + visual aid) anywhere in any step | **11 / 24 (45.8%)** |
| Steps carrying any diagram/visual-aid reference | 52 / 270 (19.3%) |
| Distinct diagram blueprint references across the whole corpus | 16 |
| Distinct visual-aid blueprint references across the whole corpus | 1 |
| Lessons declaring `routePolicy: "CANONICAL_FIXED_ROUTE"` | **0 / 24** |
| Lessons/steps populating any new CC-13A optional field (`semanticUnit`, `deliberateShortSectionReason`, `textOnlyJustification`, `mayRevealTargetAnswer`, `visualOpportunityAnalysisId`, `assessmentMappingIds`, `syllabusNodeIds`) | **0 / 24 lessons, 0 / 270 steps, every field** |
| Steps meeting a strict "one-sentence Continue fragmentation" test (see §2) | **0 / 270** |
| Lessons with a redundant consecutive **recap → exit_completion** step pair | **23 / 24 (95.8%)** |

## 2. Fragmentation: the classic "one-sentence Continue" failure mode is NOT measurably present

A step was flagged as candidate fragmentation only if it met **every** one of: resolved body text < 90 characters, no diagram, no visual aid, no worked example, no formula attachment, no question blueprint, **and** `completionCondition === "view_acknowledged"` (i.e. a bare Continue tap with no interaction). Under this test: **0 of 270 steps qualify**, and consequently there are no adjacent-short-step runs either.

Reading the actual character-length distribution (`bodyCharBuckets` in the supplement output) explains why: `view_acknowledged` steps (136/270, 50.4% of the corpus) are teaching/orientation/recap/completion steps, and `correct_answer_required` steps (133/270, 49.3%) are graded interactions. The shortest resolved-text steps in the whole corpus (55–66 characters, e.g. `"The weber (Wb) is the SI derived unit of magnetic flux."`, `"Calculate the total resistance of resistors connected in series."`) are almost all `guided_interaction`/`independent_question`/`retrieval_check`/`misconception_discrimination` steps requiring `correct_answer_required` — i.e. exactly the "a focused question or deliberate interaction" carve-out the architecture explicitly says is legitimate (`V1-LEARNING-ASSESSMENT-AND-GUIDED-REVISION-ARCHITECTURE.md` §4.2), not arbitrary viewport slicing. **Verdict: this specific, most-feared failure mode is not present in the real corpus.**

## 3. The real, more fundamental structural finding: there is no field for extended teaching prose at all

This is a root-cause finding, not a per-lesson symptom, and it explains why §2 comes back clean while the architecture docs still worry about "chunked explanation."

Tracing how a step's learner-visible body text is actually produced (`apps/mobile/src/lib/lesson-content/resolve-lesson-step.ts`, `resolveBodyStatements()`, lines 70-78):

```ts
function resolveBodyStatements(lesson: LessonPlan, step: LessonStep, lookup: ContentLookup): readonly string[] {
  const referencedIds = [...step.teaches, ...step.reinforces, ...step.tests];
  const statements = referencedIds.map((id) => lookup.assertionStatements[id]).filter((s): s is string => Boolean(s));
  if (statements.length > 0) return [...new Set(statements)];
  if (step.type === "orientation") return [lesson.learnerFacingDescription];
  if (step.type === "exit_completion") return [lesson.completionCriteria.exitSummary];
  return [];
}
```

A step's body copy is **exactly** the deduplicated set of one-sentence `statement` strings from the governed knowledge graph (`scripts/content/data/cc04-unit202-electrical-science.ts`) that its `teaches`/`reinforces`/`tests` arrays reference — e.g. `"In an equation, multiplying or dividing both sides by the same non-zero value preserves the equality between the two sides."` — or, for `orientation`/`exit_completion` only, the lesson's single `learnerFacingDescription`/`completionCriteria.exitSummary` string. There is **no field anywhere in `lessonStepSchema`** (`packages/content-schema/src/lesson-plan.ts`) for authored multi-sentence/multi-paragraph explanatory prose. The two content objects a step can additionally attach — `workedExampleBlueprintManifestSchema` and `visualAidBlueprintManifestSchema` (`packages/content-schema/src/pedagogy.ts` lines 394-419) — are also structured/parametric (a `steps` enum sequence of `show_formula`/`substitute_values`/etc., and an SVG `regions` label map), not prose containers either.

Consequence: a `concept_explanation` step teaching 2-3 atomic assertions produces roughly 2-3 short factual sentences of body copy, by construction — regardless of authoring intent, and regardless of how much "coherent teaching idea" depth a lesson storyboard might want to give it. The new architecture (`SYLLABUS-TO-LEARNING-PACKAGE-PRODUCTION-ARCHITECTURE.md` §5.1, `V1-LEARNING-ASSESSMENT-AND-GUIDED-REVISION-ARCHITECTURE.md` §4) explicitly calls for "concise explanatory paragraphs," "several coordinated content blocks," and material that "may extend beyond one phone viewport" — none of which the current schema/generator/runtime chain has a place to hold. This is why §2's mechanical fragmentation test comes back clean (nothing is being split short) while simultaneously nothing in the corpus could currently BE a "rich scrollable teaching section" even if an author tried, without a schema change first. **This is the actual upstream root cause behind the Product Owner's "under-explained" impression** — not viewport-driven splitting, but a content model with no container for explanatory depth.

Severity: **P0 (architecture-integrity defect)** — MACHINE-FIXABLE (schema addition) but requires HUMAN-REVIEW (a Project-Architect-approved new field/authoring convention, since it changes the authored-content contract), and content re-authoring is HUMAN-REVIEW-REQUIRED. See `REMEDIATION-PLAN.md`.

## 4. Confirmed, mechanically-provable finding: 23/24 lessons show triple-redundant lesson-completion messaging

`CC-12G` (see `PROJECT-STATUS.md` §CC-12G, commit `67b358d`) found and fixed exactly this defect for **one** lesson only, `lesson.electrical.ohms-law`, by deleting its `exit_completion` step object outright, with the explicit note: *"other lessons' own `exit_completion` steps are unaffected; this is not a schema/step-type change."* This audit mechanically confirms that note is accurate, and that the underlying defect is still live in every other lesson.

**Mechanism, traced end-to-end:**

1. Every lesson except Ohm's Law ends its `steps` array with `... → recap (view_acknowledged) → exit_completion (view_acknowledged)`. Confirmed by the supplement script's `consecutiveRecapOrCompletionPairs` output: **23 of 24 lessons** (every lesson except `lesson.electrical.ohms-law`) have a `recap` step immediately followed by an `exit_completion` step in `completionCriteria.requiredStepIds`/`steps`.
2. `resolve-lesson-step.ts`'s `SECTION_LABELS` maps `exit_completion` to the section label **"Lesson complete"**, and `resolveBodyStatements` resolves an `exit_completion` step's body to `lesson.completionCriteria.exitSummary` verbatim (lines 62, 76 of that file).
3. The dedicated post-step completion screen (`apps/mobile/src/components/lesson/LessonCompletionView.tsx` line 29) renders `{lesson.completionCriteria.exitSummary}` again, and is shown by `lesson-player.tsx` (`state.kind === "complete"`, set at lines 295/316) **only after every step in `stepSequence` — including the literal `exit_completion` step — has been completed** (confirmed: neither `LessonStepView.tsx` nor `lesson-player.tsx` special-case the `exit_completion` step type anywhere; it is rendered through the ordinary step pipeline like any other step).

Net learner experience for 23 of the 24 real, bundled lessons: **recap screen → a second screen literally labelled "Lesson complete" showing the exit summary → a third screen (`LessonCompletionView`) also labelled "Lesson complete" showing the same exit summary again** — three consecutive Continue-gated screens carrying the same "you're done" message. This is precisely the defect the Learning-Package Quality Gates pedagogy gate prohibits verbatim (`docs/governance/LEARNING-PACKAGE-QUALITY-GATES.md` §4: *"terminal completion is not redundantly pre-announced by a duplicate prior screen"*) and exactly the Product-Owner-known finding "duplicated recap/completion."

**Worked example** (`scripts/content/data/lesson-charge-and-current.ts`):
- `recap` step resolves to: *"Electric current equals the rate of flow of charge: I = Q divided by t."*
- `exit_completion` step **and** the subsequent `LessonCompletionView` both resolve to: *"The learner has related current to the rate of flow of charge and calculated both current and charge using I = Q / t."*

Severity: **P1 (blocks class-leading quality)** — this is a genuine, live, learner-visible defect in 95.8% of the shipped corpus, already root-caused and already fixed once for one lesson, never generalised. MACHINE-FIXABLE (delete the trailing `exit_completion` step object from the other 23 lessons' `steps`/`completionCriteria.requiredStepIds`, exactly as CC-12G did for Ohm's Law) — HUMAN-REVIEW not required for the mechanical fix itself, but a Product Owner should confirm no lesson relies on `exit_completion` for anything else first (none currently do; grep confirms every lesson's `exit_completion` step is a no-op completion-confirmation identical in shape to Ohm's Law's removed one).

## 5. Visual coverage detail

11 lessons carry **zero** diagram or visual-aid reference anywhere in any step:

| Lesson | Steps | Zero visuals |
|---|---:|---|
| `lesson.electrical.charge-and-current` | 7 | yes |
| `lesson.electrical.conductors-and-insulators` | 8 | yes |
| `lesson.electrical.core-quantities` | 6 | yes |
| `lesson.electrical.energy-and-efficiency` | 9 | yes |
| `lesson.electrical.fault-conditions-protection` | 9 | yes |
| `lesson.electrical.power` | 13 | yes |
| `lesson.electrical.si-units` | 9 | yes |
| `lesson.electrical.thermal-and-chemical-effects` | 6 | yes |
| `lesson.foundation.maths.formula-rearrangement` | 11 | yes |
| `lesson.foundation.physics.mass-and-weight` | 7 | yes |
| `lesson.foundation.physics.mechanics-force-work-energy-power` | 17 | yes |

None of these 11 lessons declares a `textOnlyJustification` (0/24 corpus-wide per §1) — there is no recorded pedagogical reason for the absence in any of them, whether or not one would be defensible.

**Read representative example** (`lesson.electrical.core-quantities`, "Voltage, Current and Resistance", 6 steps): teaches three genuinely spatial/relational physical quantities (voltage, current, resistance) — precisely the kind of conceptual, relationally-defined content the visual-planning architecture identifies as needing a diagram/comparative visual by default (`INSTRUCTIONAL-VISUAL-PLANNING-REFERENCE-AND-PRODUCTION-ARCHITECTURE.md` §1: "Is the concept spatial, physical, relational, directional or comparative?"). It has zero diagram/visual-aid attachments on any of its 6 steps and no `textOnlyJustification`. This is a real, representative instance of the "concept-heavy lesson with no meaningful visuals and no recorded justification" failure mode the architecture specifically calls out as a review failure (`docs/governance/LEARNING-PACKAGE-QUALITY-GATES.md` §5), not a hypothetical.

Severity: **P1** — HUMAN-REVIEW-REQUIRED (visual need/justification is a pedagogical judgement call, not a mechanical fix); see `VISUAL-GOVERNANCE-AND-COVERAGE-REGISTER.md` for the full authority-chain analysis of why this gap exists (upstream governance findings from the parallel visual-pipeline trace).

## 6. Contract adoption (lesson-plan-level fields only — see `CONTRACT-ADOPTION-MATRIX.md` for the full cross-layer table)

Every CC-13A `lessonStepSchema`/`lessonPlanSchema` optional field is present in the schema and absent from every one of the 270 real steps / 24 real lessons in the bundled corpus:

| Field | Level | Populated | Total | Omission currently passes validation? |
|---|---|---:|---:|---|
| `routePolicy` | lesson | 0 | 24 | Yes (optional) |
| `semanticUnit` | step | 0 | 270 | Yes (optional) |
| `deliberateShortSectionReason` | step | 0 | 270 | Yes (optional) |
| `textOnlyJustification` | lesson | 0 | 24 | Yes (optional) |
| `mayRevealTargetAnswer` | step | 0 | 270 | Yes (optional) |
| `visualOpportunityAnalysisId` | lesson | 0 | 24 | Yes (optional) |
| `assessmentMappingIds` | lesson | 0 | 24 | Yes (optional) |
| `syllabusNodeIds` | lesson (referenced as `LessonStoryboard.syllabusNodeIds` in governance contracts; not present on the real `lessonPlanSchema` at all — see note) | 0 | 24 | Yes |

Note: `LEARNING-PACKAGE-GOVERNANCE-CONTRACTS.md` §2 specifies a conceptual `LessonStoryboard.syllabusNodeIds` field; the real `lessonPlanSchema` in `packages/content-schema/src/lesson-plan.ts` has no field of that name (the closest real analogue is `targetAssertionFamilyIds`/`targetAssertionIdentifiers`/`prerequisiteKnowledge`, which are populated on every real lesson but predate CC-13A and are not the new governance-contract shape). This is itself a minor conceptual/implementation gap between the governance-contracts document and the real schema — flagged for `CONTRACT-ADOPTION-MATRIX.md`.

This confirms, with real corpus numbers, CC-13A's own stated expectation (`PROJECT-STATUS.md` §CC-13A point 5: *"an honest baseline, since re-authoring existing content under the new V1 fields is the next package's job, not this one's"*): **adoption is genuinely 0% across every new field, corpus-wide.** No field was silently defaulted to look adopted; the schema keeps every field truly optional and the corpus was not touched.

## 7. Severity summary

| Finding | Severity | Root cause / Symptom | Fix type |
|---|---|---|---|
| No schema field for extended explanatory prose (§3) | P0 | Root cause | BOTH (schema change machine-fixable; content re-authoring human-review-required) |
| 23/24 lessons carry triple-redundant completion messaging (§4) | P1 | Root cause already found once (CC-12G), not generalised | MACHINE-FIXABLE |
| 11/24 lessons (45.8%) have zero visual references, none justified (§5) | P1 | Symptom of the upstream visual-governance gap (see `VISUAL-GOVERNANCE-AND-COVERAGE-REGISTER.md`) | HUMAN-REVIEW-REQUIRED |
| 0% real-corpus adoption of every CC-13A governance field (§6) | P2 (expected/honest baseline, not itself a defect) | Root cause: re-authoring intentionally deferred to a later package | HUMAN-REVIEW-REQUIRED (content work) |
| Classic "one-sentence Continue" fragmentation | Not found | — | — |
