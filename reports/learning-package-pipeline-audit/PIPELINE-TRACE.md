# Pipeline Trace (CC-13B)

Traces the real repository against the 18-stage canonical production sequence defined in `SYLLABUS-TO-LEARNING-PACKAGE-PRODUCTION-ARCHITECTURE.md` §2, and separately the full generated-projection → runtime consumer chain (audit layers H/N).

## Part 1 — the 18-stage canonical production sequence, real status

| # | Stage | Status | Evidence |
|---|---|---|---|
| 1 | Source and syllabus authority | **EXISTS** | `cc04-unit202-electrical-science.ts` — real handbook-derived curriculum nodes, self-documented single source of truth. |
| 2 | Curriculum decomposition and traceability | **EXISTS** | `AssertionCurriculumMapping`, `unit202-knowledge-obligations.ts`, `report-coverage-matrix.ts` (live: 23/23 LO/AC referentially+semantically complete, 0 structural defects). |
| 3 | Governed knowledge/capability model | **EXISTS** | `knowledge-graph.ts`/`pedagogy.ts` — 259 assertions, 29 families, 258 memberships, real integrity `superRefine`. |
| 4 | Learning dependency map | **EXISTS (narrow)** | `prerequisiteKnowledge` (lesson-level, 19/24 lessons populate it) and the new taught-before-tested validator (`validate-v1-learning-package.ts`) which derives dependency from a blueprint's `requiredKnowledgeIds` — but that field is 0/114 adopted, so the dependency check currently only exercises the coarser `prerequisiteKnowledge` path, not the fine-grained per-question one. |
| 5 | Canonical lesson architecture / storyboard | **PARTIAL** | The `LessonStoryboard`/`StoryboardSection` concept from `LEARNING-PACKAGE-GOVERNANCE-CONTRACTS.md` §2 has no direct schema equivalent — real lessons are authored directly as `LessonPlan`/`LessonStep` objects with no separate storyboard-review artefact or `semanticUnit` population (0/270 steps). The step model itself is real and structurally sound (`DO → RESPOND → FEEDBACK → NEXT`), but there is no distinct "storyboard reviewed before final copy" stage/artefact as the architecture specifies. |
| 6 | Visual opportunity analysis and Visual Requirements Catalogue | **SCHEMA ONLY** | `VisualOpportunityAnalysis`/`VisualRequirement` real in schema, zero real instances (`VISUAL-GOVERNANCE-AND-COVERAGE-REGISTER.md` §1). The *operative* visual planning that actually happened for Unit 202 used a structurally different, older system (`tools/visual-production-studio/catalogue.ts`). |
| 7 | Lesson-check plan | **PARTIAL** | Embedded lesson-check steps are real and functioning (`misconception_discrimination`, `retrieval_check`, etc., 270 real steps), but no distinct "lesson-check plan" artefact separate from the lesson authoring itself exists, and the new answer-leak gate (`mayRevealTargetAnswer`) is 0/270 adopted. |
| 8 | Formative/mock assessment plan and assessment-to-lesson mapping | **MISSING (no plan), SCHEMA ONLY (mapping)** | No formative assessment plan/content exists (0/114 blueprints `FORMATIVE_MOCK`). `revisionLessonIds`/`assessmentMappingIds` fields real, 0% adopted. |
| 9 | Reference research and approval | **EXISTS, but via the old ad hoc system, not the new schema** | Real, human-attributed reference handover (`reference-corrections.ts`), confirmed no autonomous selection by Claude (`REFERENCE-AUTHORITY-REGISTER.md`). The new `ReferenceDossier` mechanism has zero real instances. |
| 10 | Visual production brief and design-system binding | **PARTIAL** | Production happened (53 catalogued assets) but with no `designSystemVersion` binding anywhere in the real corpus (0 real bindings to `ALP-VDS-2026-08-29`). |
| 11 | Lesson content implementation | **EXISTS** | 24 lessons, 270 steps, real, validated, runtime-qualified content (CC-12H). |
| 12 | Visual production and integration | **PARTIAL, with a known integration gap** | 53 catalogued/produced assets, but only 21 actually integrated/shipped; 6 REQUIRED physical-component images produced and QA-PASS but never integrated (`REPRESENTATIVE-FAILURE-ROOT-CAUSE-TRACE.md` #3). |
| 13 | Assessment implementation | **MISSING** | No formative/mock assessment runtime feature exists at all (`ASSESSMENT-SUBMISSION-INTEGRITY-REGISTER.md`). |
| 14 | Automated quality gates | **PARTIAL** | Curriculum/pedagogy/lesson-plan/coverage-matrix gates are real, wired, and passing. The new ADR-0005/0006 gates (`validate-v1-learning-package.ts`) are real and wired but currently vacuous (0 adoption to check against). The publication-gate model (`isPublicationReady`) is schema-only, never called (`MISSING-OR-INACTIVE-VALIDATORS.md`). |
| 15 | Runtime qualification | **EXISTS** | CC-12H's genuine, real, on-device runtime walk of all 24 lessons — this remains valid and is not re-litigated by this audit; it proves runtime completeness, not learner-readiness (exactly the distinction this audit was commissioned to test). |
| 16 | Assessment → Guided Revision qualification | **MISSING** | No formative assessment, no submission boundary in use, no Guided Revision UI/storage — nothing to qualify yet. |
| 17 | Human Product Owner review | **PARTIAL** | The Product Owner has reviewed Unit 202 experientially (the six named findings that triggered ADR-0005/0006 in the first place) — real and valuable, but predates and is not itself gated by any of the new formal `PRODUCT_OWNER_REVIEWED` status machinery, which has no real instances. |
| 18 | Release readiness | **NOT REACHED** | No lesson/package has a real `LearningPackageGateResult` record of any kind; `isPublicationReady()` has never been called against real data. |

## Part 2 — generated-projection → runtime consumer chain (layers H/N)

Confirmed, real, and matching the expected shape, with one nuance corrected against the task brief's assumption:

```
scripts/content/data/*  (governed authoring content)
  -> scripts/content/generate-mobile-projection.ts  (buildMobileContentProjection, deterministic)
    -> apps/mobile/src/lib/lesson-content/generated/mobile-content-projection.ts  (generated, committed, CI-currency-gated via npm run content:mobile:check)
      -> apps/mobile/src/lib/lesson-content/local-content-registry.ts  (typed lookup, no runtime re-validation, UnknownLessonError on miss)
        -> apps/mobile/src/lib/lesson-content/resolve-lesson-step.ts  (governed LessonStep -> RenderableLessonStep; never uses `purpose` as learner copy)
          -> apps/mobile/src/components/lesson/LessonStepView.tsx  (DO -> RESPOND -> FEEDBACK -> NEXT render)
            -> apps/mobile/src/lib/lesson-content/answer-input-dispatch.tsx  (answer-type -> native input component)
              -> apps/mobile/src/app/(app)/learn/lesson-player.tsx  (orchestrates assembleLessonInstance, session state, evidence)
```

**Generator field-survival, verified directly (not assumed)**: `buildMobileContentProjection` projects `lessons: memberLessons` — the full, unmodified `LessonPlan` objects, validated against the *same* `lessonPlanSchema` used by authoring (`packages/content-schema/src/runtime-projection.ts:48`), not a hand-picked subset. All 10 CC-13A governance fields (`routePolicy`, `semanticUnit`, `deliberateShortSectionReason`, `textOnlyJustification`, `mayRevealTargetAnswer`, `visualOpportunityAnalysisId`, `assessmentMappingIds`, `requiredKnowledgeIds`, `v1PedagogicalRole`, `revisionLessonIds`) would survive projection if authored. The only field the generator deliberately strips is `assessmentStyleEvidence` from question blueprints (an intentional authoring/governance-metadata strip, documented in the generator's own comment). **This is a genuinely clean chain — there is no bypass risk here.** The reason the generated file shows 0 occurrences of any CC-13A field (confirmed by direct grep of the 18,624-line generated file) is entirely that the real authored content doesn't populate them yet, not a generator defect.

**Course orchestration / evidence-sync — confirmed LIVE, correcting the audit brief's framing that these might be dormant**: `apps/mobile/src/lib/course/next-activity.ts` (`computeNextCourseActivity`) and `apps/mobile/src/lib/evidence-sync/` (`evidence-sync.ts`, `derived-snapshot.ts`) are both real production dependencies of the ordinary Learn hub, invoked on every hub-focus event — not a separate/proving-slice-only surface. `next-activity.ts` drives only the top recommendation card, never a hard gate (confirmed alongside the Learn-hub regression check below).

**Learn-hub catalogue/prerequisite-access — CC-12H regression check: PASS.** `apps/mobile/src/app/(app)/learn/index.tsx` still derives its full lesson list from `getLocalReleaseLessons(bundledContentReleaseId())` (release membership, unfiltered by mastery/prerequisite/evidence), unchanged since the CC-12H fixing commit. Real regression tests exist and pass (`learn-hub-catalogue.test.ts`, 5 tests including one asserting no code path can remove a lesson from the list based on prerequisite/mastery state).

**One legacy dead-end confirmed harmless**: `apps/mobile/src/app/(app)/learn/[family]/index.tsx` and `.../practice.tsx` are explicitly self-documented `LEGACY_RETIRED (CC-12D)`, unlinked from navigation, retained only because some tests still exercise shared plumbing. Not a live second consumer of the projection.

## Part 3 — where the pipeline currently terminates

Combining Part 1 and Part 2: the real, working pipeline today runs cleanly from **source (stage 1) through runtime-qualified lesson delivery (stage 15)** for the existing 24-lesson corpus, with genuine, validated, mechanically-enforced integrity at every step of that span. It terminates there. Stages 8/13/16 (formative assessment through Guided Revision qualification) and 18 (release readiness) are not merely weak — they have **no real content or wiring to trace at all**, because the features they describe do not exist yet as anything beyond schema. Stages 6/9/10/12 (the visual-production side of the pipeline) exist, but as **two parallel, non-integrated systems** rather than one coherent chain, so a trace through them changes character partway — real production happened, but not through the pipeline the current architecture documents describe.
