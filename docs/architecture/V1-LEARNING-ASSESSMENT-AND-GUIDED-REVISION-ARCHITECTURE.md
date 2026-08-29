# V1 Learning, Assessment & Guided Revision Architecture

**Status:** Approved Product Owner / Project Architect V1 scope decision — 2026-08-29.

## 1. Purpose

This document defines the learner-adaptation model for ALP Version 1.

The architectural decision is deliberately simple:

> **V1 has one canonical, premium route through each lesson. Adaptation happens after a completed and submitted formative/mock assessment by deciding which full lessons the learner should revise next.**

ALP already contains more sophisticated evidence, mastery, within-lesson branching and cross-lesson orchestration machinery. That work is retained as platform capability and future option. It is **not a V1 obligation for ordinary lesson delivery** and must not make V1 lesson production slower, more fragmented or harder to qualify.

## 2. V1 product loop

The canonical V1 learner loop is:

```text
AUTHORITATIVE SYLLABUS
        ↓
PREMIUM FULL LESSONS
(one canonical route per lesson)
        ↓
FORMATIVE / MOCK ASSESSMENT
(stable assessment instance)
        ↓
COMPLETE + SUBMIT
        ↓
ASSESSMENT EVIDENCE / WEAKNESS ANALYSIS
        ↓
WEAKNESS → LESSON MAPPING
        ↓
GUIDED REVISION PLAN
(full existing lessons, ranked highest weakness first)
        ↓
LEARNER REVISES
        ↓
NEXT COMPLETED + SUBMITTED ASSESSMENT
        ↓
GUIDED REVISION PLAN REBUILT
```

The adaptation exposed to the learner in V1 is therefore primarily:

> **what should I study next?**

not:

> **which paragraph/branch of this lesson should I see next?**

## 3. One canonical lesson route

### 3.1 Route invariance

For a released V1 lesson, the learner-visible teaching route must not change because of:
- current mastery state;
- prior lesson completion;
- ordinary lesson-check performance;
- diagnostic confidence;
- prerequisite state.

All learners may open every ordinary lesson directly.

The canonical route may still contain interactive teaching, worked examples and short knowledge checks. Those interactions do not dynamically remove, insert or reorder teaching sections in V1.

### 3.2 Explicitly deferred from V1 ordinary lessons

The following are retained as future/post-V1 capabilities, not deleted:
- mastery-driven skipping of introductory teaching;
- dynamically assembled alternative lesson routes;
- automatic prerequisite detours during a lesson;
- bespoke misconception-specific remediation branches;
- within-lesson diagnostic trees that alter the teaching route;
- automatic transfer/retest loops across lessons;
- spaced-retrieval scheduling;
- AI-generated runtime tutoring.

Existing code implementing/proving these behaviours may remain, but production V1 lesson architecture must not depend on them.

Where existing current documentation describes these behaviours as the intended end-state, it must distinguish **platform capability / post-V1 direction** from **V1 learner behaviour**.

## 4. Rich scrollable teaching is the default

A learner step is a **coherent semantic teaching experience**, not a viewport and not a PowerPoint slide.

The system must not fragment teaching into a sequence of one-sentence screens simply to avoid scrolling.

A substantial teaching section may legitimately include, where useful:
- a clear concept heading;
- several concise explanatory paragraphs;
- one or more high-quality visuals;
- labelled technical diagrams;
- physical examples;
- reinforcement or comparison;
- a worked example;
- an interactive teaching aid;
- a short summary or key takeaway.

It may extend beyond one phone viewport.

### 4.1 Scroll rule

Scrolling is allowed and expected when it preserves a coherent explanation.

If meaningful content exists below the visible viewport:
- the standard floating "more content below" affordance must indicate this;
- the affordance disappears at the bottom;
- normal swipe scrolling remains available;
- controls must not be obscured.

### 4.2 Density rule

Avoid both extremes:
- **under-authored:** one sentence → Continue → one sentence → Continue;
- **over-authored:** long uninterrupted walls of prose.

Preferred pattern:

> **chunked explanation + excellent visuals + reinforcement + examples/interactions + concise learner check**

A short screen is valid when the pedagogical object itself is short — for example a focused question or a single purposeful interaction. Shortness must not be the result of arbitrary viewport splitting.

## 5. Embedded lesson checks

Ordinary lessons may include short formative/knowledge checks to:
- force retrieval;
- reinforce the teaching;
- provide immediate feedback;
- maintain learner engagement;
- provide product analytics/evidence where useful.

For V1:
- they do **not** change the canonical lesson route;
- they do **not** trigger a bespoke remediation package;
- they do **not** directly rebuild the Guided Revision plan;
- they must still follow answer-integrity rules and must not reveal their own answer before response.

Their evidence may be retained in the wider evidence system for audit, analytics and future evolution, but V1 Guided Revision uses the dedicated submitted assessment boundary defined below.

## 6. Dedicated formative/mock assessment

V1 adaptation is driven by a dedicated assessment experience separate from ordinary lesson teaching.

A formative/mock assessment:
- is generated from governed question/archetype/content contracts rather than chosen from an ungoverned question bank;
- has stable question instances for the duration of the attempt;
- does not adapt its content mid-attempt based on answers;
- preserves exam-like answer isolation;
- maps every assessed item to governed capability/topic/lesson relationships;
- may be unit-scoped or wider-course scoped.

Learner-facing terminology may be "Practice Assessment", "Mock Assessment" or another approved product label. Internally, the evidential role must remain explicit.

## 7. Submission boundary — non-negotiable

A Guided Revision plan is recalculated **only when a new formative/mock assessment is completed and explicitly submitted**.

Therefore:

- assessment started → **no revision-plan change**;
- assessment partially answered → **no revision-plan change**;
- assessment exited/suspended → **no revision-plan change**;
- assessment resumed → **no revision-plan change**;
- assessment completed but not submitted → **no revision-plan change**;
- assessment completed + submitted → mark/finalise attempt, derive weakness result, rebuild Guided Revision plan.

This boundary must be represented in schema/state and tested mechanically. UI events such as viewing a result screen must not accidentally trigger a second recalculation.

A submitted assessment instance is an auditable evidence event. Subsequent correction/versioning of flawed questions follows existing evidence-versioning/invalidation rules.

## 8. Weakness analysis

Each submitted assessment produces an explainable weakness analysis based on its governed mappings.

At minimum, the system must be able to trace:

```text
assessment item
→ assessed capability/assertion
→ topic/lesson ownership
→ correct/incorrect/evidence result
→ lesson revision priority
```

V1 priority must be deterministic and explainable. It must not use opaque runtime AI or ML.

The current Guided Revision plan should be based on the **most recently completed and submitted assessment within the relevant scope**. Earlier submitted assessments remain in evidence/mastery history and may be shown as progress/history, but they do not silently override the latest plan.

This keeps V1 behaviour simple and understandable:

> "Your revision plan reflects your latest completed assessment."

If later evidence policy deliberately moves Guided Revision to cumulative longitudinal mastery, that is a post-V1 architecture change requiring Product Owner approval.

## 9. Guided Revision plan

The learner-facing **Guided Revision** action opens a deterministic ordered plan containing the **full existing canonical lessons** needed to address weaknesses exposed by the latest submitted assessment.

### 9.1 Plan rules

The plan:
- ranks lessons from highest demonstrated weakness to lowest;
- deduplicates multiple weak capabilities that map to the same lesson;
- includes only lessons relevant to the submitted assessment scope;
- links directly to the same canonical lesson used in ordinary Learn navigation;
- does not create a hidden/simplified/remediation-specific copy of the lesson;
- does not hard-lock other lessons;
- may display concise reasons such as "High priority" or "Revision recommended".

### 9.2 Revision does not itself recalculate priority

Opening or completing a Guided Revision lesson does not automatically rewrite the plan.

The learner may mark progress through the plan, but the weakness ranking remains based on the latest submitted assessment until another assessment is completed and submitted.

This avoids a circular model in which completing the prescribed lesson is treated as proof that the weakness has been repaired.

The next submitted assessment is the evidence that updates the plan.

## 10. Mastery and evidence architecture

Existing evidence/mastery infrastructure remains valuable and must not be deleted or duplicated.

V1 separates two concerns:

### Longitudinal evidence/mastery
May retain:
- lesson-check attempts;
- assessment attempts;
- question versions;
- evidence strength/context;
- conflicting evidence;
- historical progress.

### Guided Revision decision
Uses the latest completed/submitted formative/mock assessment result to build the current revision plan.

This preserves the sophisticated evidence foundation without making V1 learner routing dependent on it.

Lesson completion remains distinct from mastery. Guided Revision lesson completion remains distinct from demonstrated repair.

## 11. Assessment-to-lesson mapping is an upstream authoring requirement

A syllabus/learning package is not V1-ready unless:
- assessment capabilities are governed;
- every assessment item/archetype maps to those capabilities;
- every capability that can produce a revision need maps to one or more canonical lessons;
- the mapping is specific enough to produce useful Guided Revision rather than "revise the whole unit".

This mapping is designed during syllabus/lesson production, not retrofitted after assessment implementation.

## 12. V1 visual implications

Because V1 reuses full canonical lessons for Guided Revision, visual-production effort is concentrated on:
- exceptional core lesson teaching visuals;
- physical/symbol recognition families;
- worked/interactive teaching visuals;
- assessment-safe visuals required by the formative/mock assessment.

V1 does **not** require bespoke alternate-remediation visual families merely because a misconception is possible.

This is a deliberate production-economics decision: make the canonical lessons excellent first.

## 13. V1 runtime invariants

Automated/runtime qualification must prove:

1. the same released lesson produces the same canonical teaching sequence regardless of mastery/evidence input;
2. no lesson is hidden or hard-gated by prerequisite completion;
3. ordinary lesson-check outcomes do not alter Guided Revision;
4. incomplete/unsubmitted assessments do not alter Guided Revision;
5. one submitted assessment triggers exactly one deterministic revision-plan rebuild;
6. the plan uses the latest submitted assessment in scope;
7. every plan item resolves to a canonical production lesson;
8. plan ranking is deterministic/explainable;
9. a later submitted assessment replaces/rebuilds the current plan;
10. all raw evidence/history remains auditable.

## 14. Post-V1 extension boundary

Future versions may re-enable richer deterministic adaptation using the existing machinery, including:
- mastery-driven lesson assembly;
- targeted diagnostic remediation;
- alternate teaching representations;
- transfer/retest loops;
- cumulative mastery-driven revision planning;
- spaced retrieval.

Those are not rejected ideas. They are deferred until V1's premium lesson + assessment + Guided Revision loop is proven valuable in the real product.

No V1 implementation package should be delayed by satisfying a post-V1 adaptive scenario unless that scenario is required for data integrity or compatibility.
