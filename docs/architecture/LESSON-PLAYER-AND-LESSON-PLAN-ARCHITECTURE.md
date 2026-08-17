---
id: ARCH-003
status: approved
owner: project-architect
last_reviewed: 2026-08-17
---

# Lesson Player & Lesson Plan Architecture

**Status:** Approved durable product/architecture decision (Product Owner / Project Architect, 2026-08-17). **Documentation only — the lesson player is not implemented by this document and implementation has not begun.** No lesson screens, components, database schema or migrations exist as a result of this document.
**Applies to:** the future learner-facing lesson experience across `apps/mobile` (primary) and `apps/web` (secondary), and any CC package that later implements it.
**Relationship to CC-05:** this document sits *above* CC-05A-D (pedagogical knowledge structure, deterministic engine, native proving slice, instructional-visual governance) as an orchestration layer. It references those governed primitives; it does not duplicate or redefine them.
**Design intent:** capture the approved shape of the eventual lesson-player product before implementation begins, so that work is designed deliberately against this document rather than emerging incrementally from proving-slice screens.

---

## 1. Why this document exists now

CC-05C's native proving slice demonstrated the pedagogical/technical path end-to-end but was always explicitly *not* production learner UX (see its own evidence document and PROJECT-STATUS.md's scope note). CC-05D then built the governance/QA layer for instructional visuals and, in doing so, surfaced a Product Owner finding that the current proving visuals are below the required eventual product standard. Before any further learner-facing work is built — visual or interactive — the Product Owner / Project Architect has recorded the approved target shape of the lesson experience itself, so future work is designed against a real specification rather than by incrementally polishing proving-slice screens into an accidental product.

This document is that specification. It does not implement anything.

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

A future implementation package must define the exact Zod/TypeScript shape of these; this document fixes only the *capability surface* they must cover.

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

Lesson plans must therefore represent branching and evidence targets, not just a linear step list. **The adaptive engine itself is not implemented by this document** unless it already exists within an approved package (it does not).

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

## 10. Learn mode vs. review/reference mode

Two distinct presentation modes over the same governed knowledge, never conflated:

**Learn Mode** — step-based; interactive; adaptive; directed; evidence-generating. This is everything described in §3-§8 above.

**Review / Reference Mode** — concise; structured; continuous-scroll/article-style presentation may be appropriate; useful for rapid revision/reference; can reuse the same underlying governed knowledge and representations (the same `FormulaFamily`/`DiagramBlueprint`/worked-example content CC-05A/B/D already govern) without the interaction/adaptation machinery.

Neither mode is implemented by this document. The architecture must not conflate them — a future player choosing to build only one must not accidentally make it structurally impossible to add the other later.

## 11. Native UX requirements

The future lesson player should be designed for: mobile-native primary use; instant local interaction/marking where possible (the CC-05B/CC-05C deterministic local-marking pattern already proves this is achievable); prefetching; smooth transitions; haptics where appropriate; animation/motion tokens where appropriate; reduced-motion/accessibility support; phone/tablet responsive layouts; offline/cached lesson continuity; deterministic restoration (as CC-05C's session-store already proves for the proving slice); minimal perceived loading; a clear, thin lesson-progress indicator; deep-link/session restoration where appropriate.

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

This document:

- **does** record durable product/architecture direction for the future lesson player and its governed Lesson Plan model;
- **does not** implement the lesson player, any lesson screen, or any lesson-plan UI component;
- **does not** create or modify any database schema, migration, or `packages/content-schema` type;
- **does not** implement the adaptive-assembly engine described in §6/§7;
- **does not** change anything about the current CC-05A-D proving-slice/governance implementation;
- **does not** authorise starting lesson-player implementation — that remains a future, separately-scoped CC package.

## 16. Open questions for the future implementation package

Deliberately left open, not decided here: exact Lesson/LessonStep schema field names and Zod shape; which package owns the schema (`packages/content-schema` is the natural candidate, consistent with CC-05A/D); exact adaptive-assembly algorithm; exact native navigation/animation implementation; exact completion-screen content model; how review/reference mode's content authoring relates to learn-mode content authoring (shared source, different projection, per §10); versioning/backwards-compatibility policy for published lesson plans, mirroring CC-05's existing content-release model.
