---
id: ARCH-003
status: approved
owner: project-architect
last_reviewed: 2026-08-28
---

# Lesson Player & Lesson Plan Architecture

**Status:** Approved durable product/architecture decision (Product Owner / Project Architect, 2026-08-17).

**Original design status (2026-08-17, when this document was approved):** documentation only — no lesson player, lesson screens, components, database schema or migrations existed yet. The document existed to specify the target shape *before* implementation began.

**CC-12E.1 current-status correction (2026-08-28):** that original framing is now stale and was found to still read as current guidance to a fresh contributor, which is false. Since 2026-08-17 the repository has implemented a governed Lesson Plan schema (`packages/content-schema/src/lesson-plan.ts`), deterministic learner-specific lesson assembly (CC-06B), a production-intent native Lesson Player (CC-06C, hardened CC-06D), evidence/mastery persistence and durable sync (CC-07), full adaptive cross-lesson behaviour (CC-08), and a real learner-facing vertical slice with diagnostic/remediation/recheck branching, qualified on a real Android emulator (CC-12, CC-12A-D). This document's architectural decisions were not violated by that work — see §5-§10, §13, §15-§16 below for exactly what is now implemented versus what remains open, corrected section by section rather than by rewriting the original rationale.
**Applies to:** the learner-facing lesson experience across `apps/mobile` (primary, now the real implemented Lesson Player) and `apps/web` (secondary), and any CC package that extends it further.
**Relationship to CC-05:** this document sits *above* CC-05A-D (pedagogical knowledge structure, deterministic engine, native proving slice, instructional-visual governance) as an orchestration layer. It references those governed primitives; it does not duplicate or redefine them.
**Design intent (as originally recorded, 2026-08-17):** capture the approved shape of the eventual lesson-player product before implementation begins, so that work is designed deliberately against this document rather than emerging incrementally from proving-slice screens. That design-first sequencing is exactly what happened — the CC-06 through CC-12 implementation packages built against this specification.

---

## 1. Why this document exists now

**Historical context, as it stood on 2026-08-17 (unchanged below; read against the current-status correction above):** CC-05C's native proving slice demonstrated the pedagogical/technical path end-to-end but was always explicitly *not* production learner UX (see its own evidence document and PROJECT-STATUS.md's scope note). CC-05D then built the governance/QA layer for instructional visuals and, in doing so, surfaced a Product Owner finding that the current proving visuals are below the required eventual product standard. Before any further learner-facing work is built — visual or interactive — the Product Owner / Project Architect has recorded the approved target shape of the lesson experience itself, so future work is designed against a real specification rather than by incrementally polishing proving-slice screens into an accidental product.

This document was that specification, written before implementation began. It is now also the durable rationale behind the real, implemented Lesson Player — see the current-status correction at the top of this document and §5-§16 below for what has since been built against it.

## 2. Experience benchmark

The learner experience should target **Duolingo-level smoothness, immediacy and frictionless progression** combined with **Articulate-360-quality instructional richness and polish** — not a copy of either product, but an original experience informed by what makes each work.

The app is the primary product. Lessons must feel like native application experiences. They must specifically **not** feel like:

- LMS pages;
- web articles;
- slide decks;
- long scrolling training packages;
- browser-style navigation (back/forward, page loads, breadcrumbs-as-navigation).

## 3. Primary lesson progression model

**Normative rule: lessons are structured sequences of discrete learning interactions, not scrolling documents.**

Progression should feel continuous and frictionless rather than conventionally paginated. The learner normally advances through one purposeful learning step at a time:

```text
concept
  → example
  → interaction
  → feedback
  → explanation
  → harder application
  → misconception discrimination
  → retrieval check
  → remediation if necessary
  → recap / exit
```

Each step may approximately occupy one screen, but progression must not feel like `Page 1 → load → Page 2 → load → Page 3`. Transitions are immediate and native: submit answer → instant feedback → Continue → (swipe where appropriate) → branch seamlessly. No unnecessary LMS chrome (breadcrumb trails, "lesson 3 of 12" page furniture beyond a thin progress indicator, visible page-load states for local content).

## 4. Scrolling rule

Scrolling is **not** prohibited. **Lesson progression is step-based; content *within* a step may vertically scroll where the instructional content genuinely requires more space** — a worked calculation, an extended scenario, a source extract, a diagram explanation, detailed feedback. What is prohibited is making the entire primary lesson one infinite-scroll document. Continuous/infinite scroll is appropriate for browsing or reference (see §9), not as the core directed-learning mechanic.

**CC-12E correction (Product Owner, real-emulator review):** the rule above must never be read backwards as "every step must fit inside one device viewport." That misreading actively harms teaching quality — it pressures shrinking instructional imagery, compressing readable text, or splitting one coherent teaching interaction across two steps purely to satisfy a viewport, none of which is the actual goal. The durable principle is:

> Scrolling within a step is permitted whenever keeping related learner content together produces a better teaching experience than forcing it to fit one screen. Hidden continuation must never be ambiguous.

A step is a **semantic learning unit** (explanation + image + interaction + feedback + next action, as pedagogically coherent), not a physical-viewport unit. Where a step's content extends below the fold, the interface must make that unambiguous and must never hide a primary action (Continue/Submit) below the fold with no cue that it exists.

**Future implementation requirement, not yet built:** a floating "more content below" affordance (in principle similar to ChatGPT's own down-arrow) that is:
- visible only while further step content exists below the current scroll position;
- positioned above the device safe-area/navigation region so it never occludes system chrome;
- dismissed automatically once the learner scrolls to the bottom of the step;
- tappable to scroll down (does not replace normal manual scrolling, which remains available throughout);
- accessible (exposed to screen readers as a "more content below" affordance, not a decorative icon) and correct across phone sizes and font-scaling settings.

This is recorded here as approved future scope (§P8 of the CC-12E Product Owner review) — it is **not implemented by this document or any package to date**. The existing `stepPresentationContractSchema.contentMayScroll` flag (`packages/content-schema/src/lesson-plan.ts`) already lets a governed step declare "my content may scroll"; the floating-arrow affordance is a `LessonStepView`/native-UI concern layered on top of that existing flag, not a schema change.

## 5. Every lesson has an explicit machine-readable lesson plan

This is the central architectural requirement of this document. A lesson must **not** be merely "a collection of UI components/content" — it must derive from an explicit, governed, machine-readable **Lesson Plan**.

This is intentionally specified as *capability requirements*, not a finalised schema — the actual types are a future CC package's job, and must be designed compatible with the existing governed model (`AssertionFamily` → `Capability` → `QuestionBlueprint`, per `docs/architecture/CC-05-PEDAGOGICAL-KNOWLEDGE-AND-QUESTION-ARCHITECTURE.md`) rather than duplicating it. The architecture must, at minimum, be able to represent:

**Lesson** (canonical, governed):
- stable identity/version;
- human title;
- learning objective(s);
- prerequisite knowledge;
- target assertion families;
- target atomic assertions;
- target capabilities / evidence goals;
- estimated duration;
- teaching strategy;
- canonical instructional sequence;
- assessment/check points;
- misconception-discrimination points;
- remediation branches;
- retrieval opportunities;
- completion/exit criteria;
- relationship to curriculum/provenance;
- presentation mode(s) where relevant (see §9).

**Lesson Step** (each step within a lesson has explicit pedagogical intent, not just UI content):
- stable step ID;
- step type;
- purpose;
- assertion(s) taught;
- assertion(s) tested;
- target capability;
- misconception(s) discriminated;
- representation(s) used (formula/diagram/mnemonic/worked-example — the CC-05A/CC-05D governed representation types);
- interaction/question blueprint reference (CC-05B);
- support/scaffolding level;
- difficulty/cognitive demand;
- feedback mode;
- branching rule(s);
- completion rule;
- optional remediation destination.

At the time this architecture was approved, a future implementation package was expected to define the exact Zod/TypeScript shape of these; this document fixed only the *capability surface* they must cover. **CC-12E.1 correction: that schema now exists** — `packages/content-schema/src/lesson-plan.ts` defines `lessonPlanSchema` and `lessonStepSchema` with, among others, `prerequisiteKnowledge`, `estimatedDurationMinutes`, `completionCriteria`, `lessonStepTypeSchema`, `stepRequirementSchema`, `stepRepresentationRefsSchema`, `interactionRoleSchema`, `answerRevealSchema` and `stepPresentationContractSchema` — covering this capability surface substantially, not merely aspirationally. This document was not re-audited field-by-field against that schema in this correction pass; a future package should do that reconciliation explicitly if a gap is suspected, rather than this document being trusted as the literal current field list.

## 6. Canonical plan vs. learner-specific lesson instance

The architecture must explicitly distinguish two things that must never be conflated:

- **Canonical Lesson Plan** — the pedagogically valid full learning intervention, as governed/authored content.
- **Learner-Specific Lesson Instance** — what a given learner actually experiences: a selection/skip/branch/reorder of the canonical plan's steps, permitted only by governed plan/adaptation rules.

```text
Canonical plan:  1 2 3 4 5 6 7 8 9 10 11 12 13 14

Learner A:       1  2  3     5     7  8     10     12        14
Learner B:       1  2     4  5  6  7     9  10  11  12  13  14
```

The point is **not** arbitrary AI generation of lesson content. The point is **deterministic/adaptive assembly** based on the learner's own evidence, mastery and diagnosed weaknesses — the same evidence model CC-05's own diagnostic/evidence architecture already governs. **No LLM/AI in the learner runtime** (product invariant 8 / Product Principle 12/19) — runtime adaptation must remain deterministic and governed, exactly as CC-05B's engine already is.

## 7. Adaptive behaviour the eventual player must support

Representative scenarios the Lesson Plan model must be capable of expressing (not implementing here):

- learner already demonstrated mastery → skip unnecessary introductory steps;
- correct answer but evidence indicates weak reasoning → branch to conceptual reinforcement;
- root-cause weakness found in a prerequisite assertion → remediate the prerequisite before continuing;
- remediation completed → retest the foundation;
- foundation restored → return to vocational transfer/application;
- mastery demonstrated → advance;
- spaced retrieval may be scheduled later (outside the single-lesson session).

Lesson plans must therefore represent branching and evidence targets, not just a linear step list. This document does not itself implement the adaptive engine — it never has, that is not this kind of document's job. **CC-12E.1 correction: at the time this section was written, no approved package implemented that engine either; that is now false.** The deterministic adaptive-assembly engine is real and implemented — `@alp/learning-engine`/`@alp/diagnostic-engine` plus `apps/mobile/src/lib/lesson-session/lesson-controller.ts` (CC-06B, CC-08, CC-12), all still zero-LLM/deterministic exactly as this section requires. Five of the six representative scenarios listed above are now proven, not merely representable: see CC-12's own diagnostic-chain proof (`PROJECT-STATUS.md` §CC-12) for the misconception-branch/remediate/retest/return sequence, and CC-08 for cross-lesson mastery-driven advancement/skip. The sixth — cross-session spaced retrieval — remains genuinely open; see §17.6.

## 8. Interaction-first philosophy

Prefer:

```text
DO → RESPOND → FEEDBACK → NEXT
```

over:

```text
READ → READ → READ → QUIZ
```

Explanatory content remains important — Articulate-like rich explanatory components (diagrams, progressive explanation, worked examples, manipulable/interactive visuals where useful, animation where pedagogically justified) are desirable. But rich explanation lives *inside* the step-based learning flow (§3/§4); it does not turn the lesson into a long document.

## 9. Feedback

Feedback should be: immediate where appropriate; layered; pedagogically useful; capable of explaining *why*; capable of exposing weakness/root cause without overwhelming the learner; adapted to the learner's support-level need; frictionless. A correct answer does not automatically imply mastery — evidence and reasoning (per CC-05's evidence model) may determine the next step, exactly as the product's existing diagnostic philosophy (Product Principles 2-4, 10-11) already establishes for the wider platform.

Whether an answer may be revealed before response is governed **per step**, not per screen or per "mode" — see §17.

## 10. Learn mode vs. review/reference mode

Two distinct presentation modes over the same governed knowledge, never conflated:

**Learn Mode** — step-based; interactive; adaptive; directed; evidence-generating. This is everything described in §3-§8 above.

**Review / Reference Mode** — concise; structured; continuous-scroll/article-style presentation may be appropriate; useful for rapid revision/reference; can reuse the same underlying governed knowledge and representations (the same `FormulaFamily`/`DiagramBlueprint`/worked-example content CC-05A/B/D already govern) without the interaction/adaptation machinery.

**CC-12E.1 correction:** at the time this section was written neither mode existed. **Learn Mode is now real and implemented** (the production Lesson Player, `apps/mobile/src/app/(app)/learn/lesson-player.tsx`, CC-06C onward). **Review/Reference Mode remains genuinely not built** — no continuous-scroll/article-style presentation of the same governed knowledge exists yet. The architecture must not conflate the two modes — Learn Mode's real implementation must not have accidentally made Review/Reference Mode structurally impossible to add later; nothing found while correcting this document suggests it has (Learn Mode consumes the same governed `FormulaFamily`/`DiagramBlueprint`/worked-example content via reference, per §13, rather than owning it).

## 11. Native UX requirements

The lesson player (now implemented, §11's requirements below still govern it going forward, not only at design time) should be designed for: mobile-native primary use; instant local interaction/marking where possible (the CC-05B/CC-05C deterministic local-marking pattern already proves this is achievable); prefetching; smooth transitions; haptics where appropriate; animation/motion tokens where appropriate; reduced-motion/accessibility support; phone/tablet responsive layouts; offline/cached lesson continuity; deterministic restoration (as CC-05C's session-store already proves for the proving slice); minimal perceived loading; a clear, thin lesson-progress indicator; deep-link/session restoration where appropriate.

No arbitrary millisecond SLA is invented here. Measurable performance governance is [`docs/product/MOBILE-UX-ENGINEERING-STANDARD.md`](../product/MOBILE-UX-ENGINEERING-STANDARD.md)'s job, not this document's — the lesson player must be held to that existing standard, not a new one.

## 12. Lesson completion experience

The architecture must allow a completion state capable of presenting learner-meaningful outcomes, for example (illustrative only, not required literal copy):

```text
Lesson complete
8 min
4 concepts strengthened
1 weakness identified

Continue learning
```

Completion should communicate: progress; strengthened/mastered knowledge; identified weaknesses; recommended continuation/remediation where applicable. This depends on the Lesson Plan's completion/exit criteria (§5) and the platform's existing evidence/mastery model — it does not invent a new one.

**Lesson completion and mastery are not the same concept and must never be conflated (CC-12E).** *Lesson completion* means the learner has progressed through the required learning experience (reached every `required` step and any `conditional_remediation_only` step a branch routed them through — see `stepRequirementSchema`, `packages/content-schema/src/lesson-plan.ts`). *Mastery* means accumulated evidence supports the conclusion that the learner can reliably perform a governed capability (`MasteryState`, `@alp/learning-engine`, derived by `@alp/evidence-engine`). A learner may legitimately complete a lesson while a capability it addresses remains `EMERGING`/`CONFLICTING`/below the secure threshold — that is not a bug and does not block completion. Completion does not require, and this architecture does not add, a separate mandatory mini-assessment at the end of every lesson merely to mark it complete; a lesson's own embedded formative checks (§17) are sufficient evidence input, and stronger evidence can still accumulate later through retrieval, remediation return, or unit/summative assessment (§17.7-17.8, §19).

## 13. Relationship to the governed knowledge architecture

The lesson-plan model integrates with, and sits *above*, the existing governed pedagogical chain — it must never bypass or duplicate it:

```text
Source
  → Atomic Assertion
  → Assertion Family
  → Capability / Evidence Target
  → Teaching Representation
  → Question Blueprint
  → Deterministic Variant
  → Evidence
```

(CC-05-PEDAGOGICAL-KNOWLEDGE-AND-QUESTION-ARCHITECTURE.md §1; CC-05D adds Visual Semantic Contract/canonical-variant/QA evidence alongside the Teaching Representation/Diagram Blueprint links.)

**Lesson Plan sits above/around these governed primitives as an instructional-orchestration layer.** It references governed content — assertion family IDs, capability IDs, question blueprint IDs, diagram/formula representation IDs — it does not duplicate factual/pedagogical truth into itself. A Lesson Step's "teaches assertion X" field is a reference, never a restatement.

## 14. Formal product principles recorded by this decision

The following are now approved product-architecture principles, recorded verbatim (or near-verbatim) as new entries in [`docs/product/PRODUCT-PRINCIPLES.md`](../product/PRODUCT-PRINCIPLES.md) (principles 25-28), cross-referencing this document:

- **Principle 25 (A):** Lessons are structured sequences of discrete learning interactions, not scrolling documents; progression is step-based, not paginated; scrolling is permitted within a step, not across the lesson.
- **Principle 26 (B):** Every lesson derives from an explicit machine-readable Lesson Plan (objectives, prerequisites, target assertions/capabilities, sequence, assessment points, misconception checks, branching/remediation rules, completion criteria).
- **Principle 27 (C):** A canonical lesson plan defines the pedagogically valid intervention; the learner instance is adaptively assembled from it using governed evidence; runtime adaptation is deterministic, never LLM-dependent.
- **Principle 28 (D):** Learn mode is interaction-first and directed; review/reference mode may present the same governed knowledge in a concise, continuous-scroll format.

This document is the durable rationale/detail behind those four principles; the principles file stays the short, scannable, cross-referencing index it already is for every other product rule.

## 15. Explicit scope boundary for this decision

**As originally recorded (2026-08-17):** this document did not itself implement the lesson player, any lesson screen, lesson-plan UI component, database schema/migration/`packages/content-schema` type, or the adaptive-assembly engine described in §6/§7; it did not change anything about the CC-05A-D proving-slice/governance implementation as it stood then; and it did not itself authorise starting lesson-player implementation — that was left for a future, separately-scoped CC package.

**CC-12E.1 status correction:** that future package sequence happened — CC-06 (governed lesson plan schema and first canonical lesson), CC-06B (adaptive assembly engine), CC-06C/D (native Lesson Player), CC-07 (evidence/mastery/sync), CC-08 (full adaptive cross-lesson vertical), CC-12/CC-12A-D (real learner-facing vertical slice, real-emulator-qualified). This document's own scope boundary is unchanged going forward — it still is not itself an implementation, schema, or migration, and any future extension of it still requires its own separately-scoped package — but the specific "not yet started" claims above describe 2026-08-17, not today. What genuinely remains **not** implemented as of this correction: Review/Reference Mode (§10); the floating scroll-discoverability affordance (§4); dedicated `diagnostic_check`/`recheck` step-type values (§17.3/§17.5/§18); topic/unit/course-level summative assessment and exam-practice experiences (§17.7-§17.8, §19); cross-session spaced retrieval (§17.6/§7).

## 16. Open questions for the future implementation package

Deliberately left open at the time this document was approved (2026-08-17), not decided here. **CC-12E.1 status correction — most of these are now resolved by real implementation, not merely predicted:**

- Exact Lesson/LessonStep schema field names and Zod shape — **resolved**: `lessonPlanSchema`/`lessonStepSchema`, `packages/content-schema/src/lesson-plan.ts` (§5).
- Which package owns the schema — **resolved as predicted**: `packages/content-schema`.
- Exact adaptive-assembly algorithm — **resolved**: `@alp/learning-engine`/`@alp/diagnostic-engine` plus `lesson-controller.ts` (§7).
- Exact native navigation implementation — **resolved**: Expo Router, `apps/mobile/src/app/(app)/learn/lesson-player.tsx`. Animation/motion-token polish specifically was not verified in this correction pass — do not treat as proven finished.
- Exact completion-screen content model — **resolved at component level**: `LessonCompletionView.tsx` exists and renders. Whether its current content fully matches §12's illustrative example was not re-verified here.
- Versioning/backwards-compatibility policy for published lesson plans — **resolved as predicted**: lesson plans carry a `contentRelease` field and historical-snapshot files preserve prior releases' immutable membership (e.g. `lesson-cc12-v7-historical-snapshot.ts`), mirroring CC-05's content-release model exactly as anticipated.
- How review/reference mode's content authoring relates to learn-mode content authoring — **still genuinely open**: Review/Reference Mode itself does not exist yet (§10), so this question has not been reached.

## 17. Pedagogical interaction classes (CC-12E)

CC-12 (the first real end-to-end adaptive vertical slice) proved teaching, formative checking, diagnosis, remediation and recheck working together in one real lesson, but this document had not yet named the distinct pedagogical classes involved or stated the rule tying them together. This section records that taxonomy as durable architecture. It documents an already-largely-implemented reality (`lessonStepTypeSchema` / `answerRevealSchema`, `packages/content-schema/src/lesson-plan.ts`) rather than proposing new mechanism; where a class has no dedicated governed representation yet, that gap is named explicitly rather than implied to exist.

**The governing rule, which supersedes any reading of "inside a lesson" as license to leak answers:**

> If a learner's response is being used as evidence that they independently know or can perform something, the answer must not be available to them before that response. Whether a question sits inside a lesson screen or a dedicated assessment screen is irrelevant to this rule — only the response's evidential role matters.

This is exactly what the existing `answerRevealSchema` (`"before_response" | "after_submission" | "on_request" | "not_applicable"`) already lets a governed step declare per-step, and exactly what `LessonStepView.tsx`'s per-step `reveal`/`context` plumbing (CC-12B/CC-13) already enforces at runtime for the diagram layer specifically. §9's feedback rule ("a correct answer does not automatically imply mastery") is the same principle applied to interpretation; this section applies it to *presentation*.

### 17.1 Instruction / teaching

Purpose: teach new knowledge/capability. Examples: explanation, annotated teaching diagram, demonstration, worked example, mnemonic, interactive explanatory model. Governed step types: `concept_explanation`, `visual_explanation`, `worked_example`. Answer reveal: **may show the full relationship/answer** — that is teaching's purpose (`answerReveal: "not_applicable"` or the answer simply being part of the taught content, e.g. a worked example's own substitution/working/final-value). Viewing teaching content is never itself evidence that the learner can independently perform the capability — no `StepOutcome` is derived from a pure teaching step.

### 17.2 Formative learning check

Purpose: measure understanding during learning and produce real evidence. Examples: "Try It" / "Check Your Understanding", a guided application question, a direction-rule question, a short calculation. Governed step types: `guided_interaction`, `independent_question`, `transfer_application`. Although these occur inside a lesson, they **are** assessment in the formative sense: `answerReveal` must be `"before_response"`-excluding (`"after_submission"` or `"on_request"`, never revealed pre-response), and a real `StepOutcome`/`CapabilityDerivation` is produced from the response (`@alp/evidence-engine`).

### 17.3 Diagnostic check

Purpose: distinguish between plausible causes of an observed error — never assume a specific misconception from one ambiguous wrong answer. Must be evidence-bearing (a governed `error_classification`/binary-discriminator instrument, never a generic recognition question repurposed) and support EVIDENCE → HYPOTHESIS → DIAGNOSTIC CHECK → TARGETED REMEDIATION (`lesson-controller.ts`'s `incorrect_answer` branch trigger, added CC-12, is the real mechanism). **Current gap, honestly recorded:** there is no dedicated `lessonStepTypeSchema` value for this class — CC-12's own diagnostic step (`diagnose_force_direction_error`) is typed `guided_interaction`, distinguished only by step-id naming convention and its `conditional_remediation_only` requirement, not by a first-class governed field. `misconception_discrimination` exists in the enum but is not currently used for this purpose. See §18's schema note.

### 17.4 Remediation

Purpose: repair a detected or plausible weakness. May include explanation, alternative explanation, worked example, visual, mnemonic, prerequisite refresh. Governed step type: `remediation`. Answer reveal: **may reveal, like teaching** — remediation is teaching, not assessment.

### 17.5 Recheck

Purpose: determine whether the learner can now demonstrate the capability after remediation. Is formative assessment: `answerReveal` withheld before response, exactly like §17.2. Must not reveal the target answer before response, should prefer a fresh equivalent instance over the identical question (CC-12's `recheck_force_direction` reuses the original blueprint under a fresh step id, so the deterministic engine reseeds and generates a genuinely different parameter combination in the large majority of cases — see `@alp/calculation-engine`), contributes new evidence, and must never erase the preceding failure (`CapabilityEvidenceCounts.failuresAfterFirstIndependentSuccess` and the separate `retrySuccesses` tally already keep this distinguishable from an untouched first-attempt success — §18). **Current gap:** no dedicated step type exists for this class either; CC-12's recheck step is also typed `guided_interaction`.

### 17.6 Delayed retrieval

Purpose: test whether knowledge/capability remains available after time/intervening learning — ultimately stronger evidence of durable learning than immediate post-teaching success. Governed step type: `retrieval_check` (already exists, already used within-lesson — e.g. `lesson.magnetism.effects-of-current`'s own `retrieval_check` step). Cross-lesson/cross-session spaced retrieval (§19) is architecturally anticipated (Product Constitution's core teaching loop ends "...→ update learner state → later retrieval") but not yet exercised by any implemented package — recorded as future scope, not built here.

### 17.7 Summative / unit assessment

Purpose: a higher-integrity judgement of capability after a meaningful body of learning, at topic/unit/course boundaries the platform will define separately from individual lessons (§19). **A separate formal assessment is not required after every individual lesson by default** — lesson mastery may be informed by the formative evidence gathered throughout the lesson (§12). No governed step type or screen exists for this yet; it is a distinct future experience, not an extension of in-lesson `guided_interaction` steps.

### 17.8 Exam practice / mock assessment

Purpose: prepare learners for the actual qualification/examination — governed exam-style questions, qualification-appropriate structure, question archetypes informed by official/sample papers where available (the existing `assessmentStyleEvidence` field on `QuestionBlueprint`, CC-09E, already carries this provenance for question *grammar*, never content), no answer leakage, exam-like conditions where useful, performance feedback after completion. Strict answer withholding throughout, matching §17.2/§17.5. Not built by this document or any package to date — a distinct future high-integrity mode, never conflated with in-lesson formative checks.

### 17.9 Summary table

| Class | Purpose | Governed step type(s) today | Answer reveal |
|---|---|---|---|
| Instruction/teaching | Teach | `concept_explanation`, `visual_explanation`, `worked_example` | May reveal |
| Formative check | Measure understanding, produce evidence | `guided_interaction`, `independent_question`, `transfer_application` | Withheld before response |
| Diagnostic check | Distinguish causes of an error | `guided_interaction` (no dedicated type yet — §18) | Withheld before response |
| Remediation | Repair a weakness | `remediation` | May reveal |
| Recheck | Verify capability post-remediation | `guided_interaction` (no dedicated type yet — §18) | Withheld before response |
| Delayed retrieval | Test durable recall | `retrieval_check` | Withheld before response |
| Summative/unit assessment | High-integrity judgement after a body of learning | *(not yet built — §17.7)* | Strict withholding |
| Exam practice/mock | Qualification preparation | *(not yet built — §17.8)* | Strict withholding |

## 18. Evidence must carry context (CC-12E)

**Mastery is an inference from accumulated evidence, not a direct alias for the most recent answer.** One correct answer does not automatically mean `MASTERED`; a correct recheck after remediation is useful positive evidence but does not erase the preceding error; contradictory evidence may legitimately produce a `CONFLICTING` state; immediate post-remediation success is not equivalent to delayed independent retrieval; repeated independent success should provide stronger confidence than a single instance; summative/unit evidence may carry different significance from a heavily scaffolded learning attempt. This is a restatement, not a change, of Product Principle 10 ("Evidence is not mastery") and the existing deterministic/offline-first `@alp/evidence-engine` architecture (WP1.3) — **this package makes no evidence-schema change.**

**What the schema already captures** (`packages/evidence-engine/src/types.ts`, unchanged by CC-12E): `StepOutcomeKind` already distinguishes `passed_first_attempt` / `passed_retry` / `failed` / `revealed_only`; `scaffoldingLevel` (`guided`/`standard`/`independent`) is carried per outcome; `CapabilityEvidenceCounts` separately tallies `independentSuccesses`, `transferSuccesses`, `scaffoldedSuccesses`, `retrySuccesses`, `supportingSuccesses`, `meaningfulFailures`, and — critically — `failuresAfterFirstIndependentSuccess`, which is exactly the "a later success does not erase an earlier failure" signal. This already lets the derivation distinguish independent-first-attempt success, correct-after-retry, and a failure that later reverses, without conflating them.

**Smallest future schema requirement, not implemented here:** there is currently no first-class way to distinguish *why* a `guided_interaction` step was a recheck-after-remediation, a diagnostic response, or a plain formative check — that context lives only in step-id naming convention (`recheck_*`, `diagnose_*`) and `stepRequirementSchema: "conditional_remediation_only"`, not in a governed enum a derivation could branch on directly. The smallest addition that would close this without a schema migration is two new `lessonStepTypeSchema` values — `diagnostic_check` and `recheck` — used in place of `guided_interaction` for those two classes (§17.3/§17.5), letting `StepOutcome.stepType` carry the distinction structurally. Delayed retrieval, summative and exam-practice evidence provenance (§17.6-17.8) has no schema representation at all yet, because none of those experiences exist yet; when they are built, `LearnerAttemptRecord`/`StepOutcome` will need an explicit source-context field (e.g. `interactionClass` or equivalent) so a unit-assessment attempt is never silently pooled with an in-lesson formative attempt of the same capability. This is recorded as a requirement for that future package, not designed in detail here.

## 19. Future assessment hierarchy (CC-12E, conceptual only)

```text
LESSON            → embedded formative checks (§17.2/§17.3/§17.5)
TOPIC / CLUSTER    → optional checkpoint, only where pedagogically justified
UNIT               → dedicated unit assessment (§17.7)
COURSE/QUALIFICATION → broader assessment + mock/exam-practice experience (§17.8)
SPACED RETRIEVAL   → crosses lesson/topic/unit boundaries over time (§17.6)
```

This is a conceptual placeholder, not a specification: no UI, scoring model, or schema for topic/unit/course-level assessment is designed here. It exists so a future package extending beyond single-lesson formative checks has a named place in the architecture to attach to, and so that no future package accidentally re-invents "assessment" as a single undifferentiated concept.
