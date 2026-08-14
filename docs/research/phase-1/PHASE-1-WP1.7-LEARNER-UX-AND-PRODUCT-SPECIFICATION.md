# Phase 1 — WP1.7: Learner UX & Product Specification

**Status:** Approved with implementation clarification v0.3  
**Date:** 14 August 2026  
**Phase:** Phase 1 — Architecture & End-to-End Proving Slice  
**Depends on:** Approved WP1.1–WP1.6  
**Purpose:** Define the learner-facing product experience that exposes the governed knowledge, teaching, assessment, evidence and diagnostic architecture as one coherent, class-leading vocational-learning product.

---

# 1. Purpose

WP1.7 defines **what the learner sees, chooses and experiences**.

The backend architecture is not the product.

A learner should not need to understand:

- assertions;
- prerequisite graphs;
- evidence weights;
- diagnostic hypotheses;
- curriculum mappings;
- remediation objects;
- source-version objects;
- strategy metadata.

The product should turn those structures into a simple experience that helps the learner:

- learn a qualification from the beginning;
- revise efficiently;
- practise;
- identify weaknesses;
- understand why they are struggling;
- fix the underlying issue;
- prepare for an assessment;
- see meaningful progress;
- move between quick and deep modes without friction.

The governing principle is:

> **The product should feel simpler than the intelligence underneath it.**

---

# 2. Product modes

The learner-facing product should expose a small number of understandable modes.

Recommended primary modes:

1. **Learn**
2. **Practise**
3. **Improve Weak Areas**
4. **Quick Revision**
5. **Mock / Exam Practice**
6. **Progress**

These are not separate products.

They are different entry views over:

- the same knowledge graph;
- the same learner model;
- the same lesson/content system;
- the same diagnostic engine.

---

# 3. Learn mode

**Learn** is a first-class primary mode.

It supports a learner who says:

> "Teach me this qualification."

The learner should be able to navigate:

```text
My Qualification
    ↓
Unit
    ↓
Lesson
```

Example:

```text
City & Guilds 2365 Level 2
    ↓
Unit 202 — Principles of Electrical Science
    ↓
Ohm's Law
```

The learner can:

- start from Lesson 1;
- continue where they left off;
- choose another lesson;
- revisit completed lessons;
- see progress through the unit;
- enter foundational Maths/Physics when useful.

No prior diagnostic assessment is required.

---

# 4. Learn-mode home

A qualification/unit home should answer immediately:

- where am I?
- what have I completed?
- what should I do next?
- what remains?
- where am I weak?
- how ready am I for this unit's assessment, if relevant?

A suggested structure:

```text
Unit 202 — Principles of Electrical Science

Continue:
Ohm's Law — 8 min

Progress:
6 of 18 lessons completed

Needs attention:
Formula transposition
Unit prefixes

Assessment readiness:
Early / Developing / Strong
```

Avoid cluttering the page with dozens of scores.

---

# 5. Lesson catalogue

Within a unit, lessons should be visible as a coherent ordered syllabus.

Example:

```text
1. Principles of electricity
2. Mathematical principles
3. Ohm's Law
4. Resistors in series
5. Resistors in parallel
6. Electrical power
7. Resistivity and voltage drop
...
```

The exact Phase 1 proving slice will expose only the relevant subset.

Each lesson should show concise status such as:

- Not started
- In progress
- Complete
- Needs review
- Strong

Do not expose internal mastery-state jargon unless translated into learner-friendly wording.

---

# 6. Fundamental-domain browsing

The learner should also be able to browse:

```text
Maths
Physics
Electrical
```

Example:

```text
Maths
  ↓
Algebra
  ↓
Formula transposition
```

This supports learners who want to repair a foundation directly.

The same learning asset may appear in both:

```text
Unit 202
```

and:

```text
Foundational Maths
```

without becoming duplicate content.

---

# 7. Cross-navigation

Context should always be preserved.

Example:

Learner starts:

```text
Unit 202
→ Ohm's Law
```

The engine identifies weak transposition and opens:

```text
Maths
→ Formula transposition
```

The UI should clearly show:

> "This is helping with Ohm's Law."

After remediation:

> "Back to Ohm's Law"

The learner should never feel dumped into an unrelated Maths product.

---

# 8. Lesson experience

A lesson should feel coherent and progressive.

Recommended structure:

```text
1. What you'll learn
2. Explain
3. Demonstrate
4. Guided practice
5. Independent check
6. Review / diagnose if needed
7. Transfer / application
8. Lesson summary
9. What next
```

Not every lesson needs all stages.

The lesson should adapt based on what the learner already knows.

---

# 9. Lesson opening

The lesson opening should be concise.

Example:

> **Ohm's Law**
>
> You'll learn how voltage, current and resistance are related, and how to calculate any one when the other two are known.
>
> About 8 minutes.

Useful optional information:

- lesson relevance to the qualification;
- assessment importance;
- prerequisite warning where useful.

Avoid long introductory prose.

---

# 10. Explain stage

The explanation should:

- use correct vocational terminology;
- be concise by default;
- explain why the concept matters;
- avoid unnecessary history/theory unless relevant;
- offer deeper detail naturally.

The default should optimise for understanding without overwhelming.

---

# 11. Demonstrate stage

The system should show the concept working.

For numerical topics:

```text
V = 12 V
R = 4 Ω

I = V / R
I = 12 / 4
I = 3 A
```

The learner should be able to see:

- what relationship is being used;
- why;
- how values are substituted;
- how the answer is checked.

Animations are not required.

Clarity is more important.

---

# 12. Deterministic teaching examples

Teaching demonstrations should use the deterministic content engine.

The system can choose deliberately easy values first, then add complexity.

Example progression:

```text
12 V / 4 Ω
↓
24 V / 6 Ω
↓
110 V / 22 Ω
↓
2.4 kΩ conversion
```

Difficulty should come from intentional knowledge demands rather than random awkward numbers.

---

# 13. Guided practice

Guided practice should allow assistance without making the learner feel tested prematurely.

Possible supports:

- formula reminder;
- partially completed working;
- one-step hint;
- identify the unknown first;
- choose the correct relationship.

A learner who struggles can receive more support.

A confident learner can answer directly.

---

# 14. Independent check

After teaching, remove scaffolding.

The independent check should:

- use a new example;
- avoid simply repeating the demonstration;
- create genuine learner evidence;
- be short enough not to turn every lesson into a test.

A learner may need only a few strong checks.

---

# 15. Correct answer feedback

Correct-answer feedback should be proportional.

Default:

> **Correct — 5 A**

Optional expandable explanation:

> `I = V/R = 230/46 = 5 A`

If the answer produced useful positive transfer evidence, the system may say:

> "You've now applied this successfully in a new context."

Avoid excessive celebration after every trivial question.

---

# 16. Wrong answer feedback

Wrong-answer feedback should not immediately dump a long explanation.

Default sequence:

```text
Result
↓
brief useful correction
↓
optional "Why?"
↓
diagnostic intervention if worthwhile
```

Example:

> **Not quite.**
>
> The correct current is **5 A**.
>
> Your formula choice looks right; the error may be in the rearrangement.

Then:

> **Check the algebra**

or:

> **Show me why**

depending on confidence.

---

# 17. Progressive disclosure

The product should reveal more detail only when useful.

**Progressive disclosure** means showing the simplest useful information first and making deeper detail available without forcing it on everyone.

Suggested feedback layers:

```text
1. Result
2. Quick correction
3. Why this happened
4. Deeper explanation
5. Targeted remediation
```

This is a central product principle.

---

# 18. Do not punish minimal-feedback learners

A learner selecting:

> "Just tell me if I'm right"

should still:

- receive learner-model updates;
- benefit from diagnostics in the background;
- be able to continue quickly.

The product may surface a high-value weakness unobtrusively:

> "This unit conversion issue has affected 3 questions. Fix it in 2 minutes?"

The learner can defer.

---

# 19. Feedback-depth preference

The product may expose a simple preference such as:

```text
Feedback:
Quick
Balanced
Detailed
```

or use contextual controls:

```text
Just the answer
Explain
Teach me this
```

Exact UI wording should be tested.

Do not make the learner configure a complex personality/profile before using the product.

---

# 20. Practise mode

**Practise** lets the learner choose:

- qualification;
- unit;
- lesson/topic;
- mixed practice;
- number of questions;
- optionally difficulty.

Practice should use the learner model but remain learner-controlled.

---

# 21. Practice session flow

A lightweight practice flow:

```text
Choose area
↓
Answer
↓
Immediate feedback
↓
Continue
↓
Optional targeted intervention
↓
Session summary
```

Do not interrupt every error with remediation.

---

# 22. Adaptive practice

The system may choose questions based on:

- weak assertions;
- evidence uncertainty;
- recent repetition;
- transfer needs;
- assessment relevance.

The learner should still understand the session's purpose.

Avoid unexplained algorithmic behaviour.

---

# 23. Improve Weak Areas

This mode answers:

> "What is actually costing me marks?"

Suggested learner-facing cards:

```text
Unit prefixes
Affecting:
Ohm's Law, Resistivity
Likely impact:
High
Estimated fix:
3 min
```

and:

```text
Parallel circuit rules
Affecting:
Parallel resistance questions
Estimated fix:
8 min
```

This is more useful than generic:

> "Maths: 63%"

---

# 24. Root-cause explanation UX

When confidence is sufficient, show:

> "You seem to understand Ohm's Law itself. The repeated problem is converting kΩ to Ω."

This makes the intelligence visible without exposing the internal evidence graph.

When uncertain:

> "This may be either formula selection or rearrangement. One quick check can narrow it down."

Then offer the probe.

---

# 25. Diagnostic probe UX

A diagnostic probe should feel like a helpful quick check, not an exam.

Example:

> **Quick check**
>
> Which relationship would you use here?

or:

> **Let's isolate the algebra**
>
> Rearrange `x = yz` to make `z` the subject.

Explain why only where useful:

> "This helps work out whether the issue is Electrical or algebra."

---

# 26. Remediation UX

Remediation should clearly communicate:

- what it targets;
- why;
- duration;
- route back.

Example:

> **Fix formula transposition**
>
> This is affecting Ohm's Law, power and resistivity.
>
> About 5 minutes.
>
> [Start] [Later]

After completion:

> **Back to Ohm's Law**

---

# 27. Quick Revision

Quick Revision supports learners with limited time.

Possible inputs:

```text
I have:
5 min
10 min
20 min
30 min
```

The engine should prioritise:

- high-yield weaknesses;
- near-secure items;
- important forgotten material;
- assessment weighting;
- quick wins.

Avoid a long setup flow.

---

# 28. Exam-tomorrow mode

A pass-focused learner may say:

> "My exam is tomorrow."

The product should shift toward:

- high-weight areas;
- assessment-style questions;
- valid shortcuts/strategies;
- quick repair;
- readiness.

It should not suddenly force deep foundational study unless the gap is blocking high-value marks.

---

# 29. Mock / Exam Practice

Mock mode should provide assessment-authentic practice.

For Test 602 eventual full product:

- 40 questions;
- 90-minute style;
- multiple choice;
- assessment weighting;
- no hints during mock;
- review afterwards.

Phase 1 may implement a smaller representative mock.

---

# 30. Mock review

After a mock, do more than show score.

Provide:

```text
Score
Readiness summary
Strong areas
Likely mark-loss causes
High-value repairs
```

Example:

> 7 of your lost marks appear connected to unit conversion and formula transposition.

This demonstrates the platform's differentiation.

---

# 31. Assessment readiness

Readiness should be learner-friendly and honest.

Suggested bands:

- Early
- Developing
- Nearly ready
- Strong
- Very strong

Exact wording can change.

Avoid fake precision such as:

> 83.72% ready

until empirically justified.

---

# 32. Mastery versus readiness in UX

The interface should make the distinction understandable without jargon.

Example:

> **Exam readiness: Strong**
>
> You're answering most Unit 202-style questions correctly.
>
> **Underlying Maths:** formula transposition still needs work if you want stronger long-term mastery.

This supports both learner intents.

---

# 33. Progress page

Progress should prioritise meaningful learning outcomes.

Possible sections:

```text
Qualification progress
Lessons completed
Knowledge now secure
Weaknesses repaired
Areas to revisit
Assessment readiness
```

Question count is secondary.

---

# 34. Lesson completion

Completion should mean:

> learner has worked through the lesson.

It must not automatically mean:

> learner has mastered every assertion.

If a lesson is complete but evidence is weak:

> **Complete — review recommended**

This is more honest.

---

# 35. Knowledge progress

The platform may show high-level topic/fundamental progress:

```text
Electrical:
Ohm's Law — Strong
Series circuits — Developing
Parallel circuits — Needs work

Maths:
Formula transposition — Developing
Unit prefixes — Strong
```

These are summaries over the assertion model.

---

# 36. Cross-domain progress

A learner should be able to see that foundational work helps multiple topics.

Example:

> **Formula transposition**
>
> Improved.
>
> Helps with:
> - Ohm's Law
> - Power
> - Resistivity

This reinforces the product's educational logic.

---

# 37. Onboarding

Onboarding should be short.

Minimum information:

1. what are you studying?
2. what do you want to do now?

Example:

```text
I'm studying:
City & Guilds 2365 Level 2

Today I want to:
Learn
Practise
Revise
Take a mock
```

Do not force a long questionnaire.

---

# 38. Qualification selection

The learner should select the actual qualification/path where possible.

This allows:

- correct curriculum;
- correct units;
- assessment structure;
- references;
- readiness.

Avoid an ambiguous generic:

> "Electrical Level 2"

when precise qualification context is available.

---

# 39. Multiple goals

A learner may study more than one item later.

Example:

- 2365 Level 2;
- BS 7671;
- Inspection & Testing.

The account architecture should support multiple learning programmes.

Phase 1 can expose one.

---

# 40. Returning learner home

The home/dashboard should prioritise:

```text
Continue learning
Recommended next
Quick revision
Weak areas
Upcoming assessment/readiness
```

Avoid turning it into a dense analytics dashboard.

---

# 41. Recommended next

A recommendation should have a reason.

Example:

> **Recommended: Unit prefixes — 3 min**
>
> This is affecting several calculation topics.

or:

> **Continue: Parallel circuits**
>
> You're halfway through the lesson.

The user should understand why.

---

# 42. Learner control over recommendations

Recommendations should be easy to ignore.

The learner can:

- choose another lesson;
- practise something else;
- take a mock;
- postpone remediation.

The product is adaptive, not authoritarian.

---

# 43. Search and direct navigation

Later product should support searching lessons/topics.

Examples:

> "Ohm's law"

> "resistivity"

> "formula triangle"

Search results should show context.

Phase 1 can use simple navigation without full search.

---

# 44. Reference navigation

Where useful, learner content should show authoritative/reference navigation.

Example:

```text
Curriculum:
City & Guilds Unit 202 — AC4.5
```

Later professional content may show:

```text
BS 7671:
Regulation / page reference
```

Reference details should be expandable, not dominate ordinary learning.

---

# 45. Source transparency

The learner should be able to understand that teaching is grounded.

But do not clutter every screen with citation metadata.

A small:

> References

or:

> Where this comes from

control is sufficient.

---

# 46. Mobile-first requirement

The product should be designed primarily for:

- phone;
- tablet;
- desktop.

The core learning experience must work comfortably on a phone.

This affects:

- question length;
- formula layout;
- touch targets;
- navigation;
- lesson chunking;
- diagrams;
- progress views.

---

# 47. No wide-table dependency

Learner-critical information should not depend on wide tables.

Use:

- cards;
- stacked sections;
- expandable detail;
- vertical progress.

This is especially important on mobile.

---

# 48. Lesson chunking

Lessons should be chunked into short screens/sections.

Avoid one very long scrolling article.

A learner should feel progress:

```text
Concept
1 of 5
```

But avoid artificial micro-clicking every sentence.

---

# 49. Formula display

Formulae should:

- render clearly on narrow screens;
- use appropriate mathematical notation;
- not require horizontal scrolling for simple equations.

Where working is multi-step, stack vertically.

---

# 50. Numerical input

Numerical questions should make it easy to:

- enter number;
- select/enter unit;
- use decimal;
- use scientific notation where required.

Avoid awkward equation editors where not necessary.

---

# 51. Calculator

Because the real assessment permits a non-programmable calculator, learner practice may allow an in-app/basic calculator or expect external calculator depending on mode.

Mock-mode rules should match assessment conditions.

The product should not accidentally test mental arithmetic where the curriculum expects calculator use.

---

# 52. Accessibility

Learner experience must target **WCAG 2.2 Level AA** as the minimum
accessibility conformance target.

**WCAG — Web Content Accessibility Guidelines** are internationally used accessibility guidelines for web content.

The architecture/UX should support:

- keyboard navigation;
- semantic structure;
- screen readers;
- sufficient contrast;
- visible focus;
- text alternatives;
- no colour-only meaning;
- scalable text;
- accessible form errors.

---

# 53. Diagram accessibility

Meaningful circuit diagrams should have:

- descriptive text alternatives;
- labels readable at zoom;
- information not conveyed only by colour.

Where a diagram is essential to answer a question, screen-reader-compatible alternatives should be considered.

---

# 54. Cognitive accessibility

Clarity matters beyond formal accessibility.

Avoid:

- unnecessary jargon;
- overly dense pages;
- ambiguous controls;
- excessive animation;
- surprise navigation.

Use consistent patterns.

---

# 55. Saving progress

Every meaningful interaction should save automatically.

Learners should not need to press:

> Save progress

after a lesson.

If connection is lost, the product should minimise lost work where practical.

---

# 56. Resume behaviour

Returning learners should resume sensibly.

Examples:

> Continue Ohm's Law — Step 4 of 6

or:

> Resume 10-question practice — 6 remaining

Do not force restart.

---

# 57. Session summary

After a learning/practice session, show concise outcomes.

Example:

> **10-minute session complete**
>
> Learned:
> - Ohm's Law relationship
>
> Improved:
> - unit prefixes
>
> Still worth reviewing:
> - formula transposition
>
> Recommended next:
> - Series circuits

---

# 58. Positive reinforcement

The product should acknowledge progress meaningfully.

Prefer:

> "You fixed a unit-conversion issue that was affecting three topics."

over:

> "Amazing! You answered 5 questions!"

Avoid childish gamification unless later user testing supports it.

---

# 59. Gamification

Phase 1 does not need:

- points;
- badges;
- leaderboards;
- streak pressure.

These can be tested later.

Progress itself should be motivating.

---

# 60. Notifications

Phase 1 does not need push notifications.

Later useful notifications may include:

- retrieval due;
- assessment approaching;
- unfinished lesson.

Avoid engagement-spam architecture.

---

# 61. Error recovery

If something fails technically:

- preserve learner work where possible;
- clearly state what happened;
- provide retry;
- avoid duplicate attempts on retry.

The UI should not expose internal error details.

---

# 62. Loading states

Learner-critical actions should feel immediate.

For ordinary deterministic marking:

> no artificial delay.

Do not use "AI thinking" theatrics for deterministic answers.

If AI is used for optional explanation, show clear loading/fallback behaviour.

---

# 63. AI presence in UX

The product should not market every intelligent feature as "AI".

The value is:

- accurate teaching;
- targeted diagnosis;
- useful feedback.

AI may sit behind some functions.

The learner should not need to care which algorithm produced the recommendation.

---

# 64. Optional tutor interaction

A future optional tutor could support:

- "Explain this another way"
- "Give me another example"
- "Why is that wrong?"
- "What does this symbol mean?"

This should be bounded by approved content/knowledge.

It is not required for Phase 1 core loop.

---

# 65. Trust and uncertainty

When the platform is uncertain, say so appropriately.

Example:

> "This looks like an algebra issue, but one quick check will confirm."

Avoid pretending diagnostic omniscience.

---

# 66. Correction / report issue

Learners should eventually be able to report:

- question looks wrong;
- explanation unclear;
- typo;
- technical issue.

This creates useful QA feedback.

Phase 1 may implement a minimal "Report issue" action.

---

# 67. Content freshness

Where professional/standards content later depends on versions, the learner should be able to see the applicable version.

Example:

> Based on [standard edition]

For Unit 202, curriculum version can be visible in programme details rather than every screen.

---

# 68. Account settings

Keep account settings simple:

- email/auth methods;
- learning programmes;
- feedback preference;
- accessibility/display preferences;
- privacy/export/delete later.

Do not mix learning controls with security-critical account changes carelessly.

---

# 69. Privacy UX

The learner should be able to understand:

- what learning data is stored;
- why;
- how it helps recommendations;
- how to delete/export later.

Avoid opaque profiling language.

---

# 70. New-user first session

The ideal first session should demonstrate value quickly.

Example:

```text
Sign in
↓
Choose qualification
↓
Choose Learn
↓
Open Ohm's Law
↓
Learn concept
↓
Answer guided example
↓
Independent check
↓
See progress saved
```

No lengthy setup.

---

# 71. Alternative new-user first session

For a learner who chooses:

> Practise

flow:

```text
Sign in
↓
Choose qualification
↓
Practise Unit 202
↓
Answer
↓
Receive concise feedback
↓
Engine detects repeatable issue
↓
Optional targeted fix
```

Both paths should feel native.

---

# 72. Phase 1 proving-slice UX

The Phase 1 product should not be a collection of admin/debug screens.

It must demonstrate a real learner journey covering:

```text
qualification/unit selection
→ Learning Mode
→ lesson
→ deterministic demonstration
→ guided practice
→ independent check
→ learner evidence
→ diagnosis where needed
→ remediation
→ foundational retest
→ Electrical transfer
→ progress update
→ recommended next
```

This is a Phase 1 exit requirement.

---

# 73. First proving lesson

Recommended first polished learner-facing lesson:

> **Ohm's Law — Voltage, Current and Resistance**

because it can demonstrate:

- explanation;
- deterministic examples;
- formula triangle;
- algebraic strategy;
- independent practice;
- diagnostic branch;
- Maths remediation;
- transfer.

---

# 74. Second proving lesson

Recommended:

> **Resistors in Parallel**

because it demonstrates:

- conceptual structure;
- reciprocals;
- plausibility;
- circuit misconception diagnosis;
- differentiated remediation.

---

# 75. Third proving lesson

Recommended:

> **Electrical Power**

because it supports:

- multiple related formulae;
- relationship selection;
- cross-context power concept;
- transfer from Physics.

These three lessons provide a strong teaching/diagnostic showcase.

---

# 76. Phase 1 home screen

The Phase 1 home should include at minimum:

```text
Continue Learning
Practise
Weak Areas
Progress
```

Mock/Quick Revision may be present if enough content exists.

Avoid building a full commercial dashboard before these core flows work.

---

# 77. UX design system

The product should establish a small reusable design system:

- typography;
- spacing;
- buttons;
- cards;
- form inputs;
- feedback states;
- progress indicators;
- navigation;
- modal/drawer behaviour;
- formula styling.

This keeps future AI-generated UI consistent.

---

# 78. Design-token concept

A **design token** is a reusable named design value such as spacing size, text size or border radius.

Phase 1 may use a lightweight token system.

The purpose is consistency, not design-system bureaucracy.

---

# 79. Visual tone

Recommended tone:

- professional;
- modern;
- calm;
- clear;
- vocational rather than childish;
- confidence-building without over-celebration.

Avoid looking like:

- children's educational software;
- enterprise HR training;
- a generic AI chatbot;
- a dense exam PDF viewer.

---

# 80. Branding

Final product branding is not required for Phase 1 architecture.

Use a neutral working identity if necessary.

Do not delay UX validation for logo/name work.

---

# 81. UX telemetry

Phase 1 should measure product usage such as:

- lesson start/completion;
- drop-off point;
- remediation offer/accept/defer;
- feedback-depth use;
- diagnostic-probe completion;
- practice-session completion;
- return to original lesson after remediation.

This is product analytics, not canonical mastery evidence.

---

# 82. UX success measures

Phase 1 should evaluate whether:

1. learner understands where to start;
2. learner can work through a lesson without explanation;
3. feedback is useful without becoming intrusive;
4. diagnosis feels plausible/helpful;
5. remediation route is understandable;
6. learner can return to the original topic;
7. quick-feedback learners can move fast;
8. deep-learning learners can access more explanation;
9. mobile experience is comfortable;
10. progress feels meaningful.

---

# 83. Usability testing

Before Phase 1 exit, test with real representative learners if possible.

Even 5–10 users may reveal major UX problems.

Test tasks such as:

> "Start learning Unit 202."

> "Find formula transposition."

> "Practise parallel circuits."

> "Fix a weakness."

> "See how ready you are."

Observe behaviour rather than only asking if they like the design.

---

# 84. Founder testing

The Product Owner should use the product as an actual learner during Phase 1.

Because the initial Electrical domain overlaps the Product Owner's own learning route, this is useful qualitative validation.

It does not replace broader user testing.

---

# 85. Accessibility testing

Phase 1 should include at least:

- keyboard-only walkthrough;
- automated accessibility scan;
- basic screen-reader check;
- mobile zoom/text scaling;
- colour-contrast verification.

Detailed certification is not required.

---

# 86. UX non-goals for Phase 1

Do not build:

- social feed;
- peer chat;
- tutor marketplace;
- leaderboards;
- extensive gamification;
- native apps;
- complex offline mode;
- institution admin portal;
- elaborate profile customisation;
- AI avatar;
- immersive simulations.

The proving slice should be excellent at the core learning loop.

---

# 87. UX architecture test cases

The implementation must support:

## Test A — zero-evidence learner

New learner opens Unit 202 and starts a lesson without assessment.

## Test B — known strong learner

Same lesson shortens appropriately or offers skip/check.

## Test C — pass-focused learner

Receives concise feedback and continues quickly.

## Test D — deep-learning learner

Expands explanation and completes deeper teaching.

## Test E — diagnostic branch

Wrong answer opens a quick targeted probe.

## Test F — cross-domain remediation

Electrical lesson branches to Maths remediation and returns cleanly.

## Test G — deferred remediation

Learner says "later" and continues without penalty.

## Test H — mobile

Core lesson/practice works on a narrow phone screen.

## Test I — progress truthfulness

Lesson complete but weak evidence is shown honestly.

## Test J — uncertainty

System presents a tentative diagnosis without false certainty.

---

# 87.1 UX engineering baseline

WP1.7 is not only a product-flow specification.

It also establishes a minimum **UX engineering baseline** so that later
implementation cannot satisfy the document by merely placing the right
features on screens.

The product must be:

- responsive;
- predictable;
- accessible;
- forgiving;
- fast;
- touch-friendly;
- keyboard-friendly;
- resilient to interruption;
- clear under error/loading conditions;
- comfortable on narrow mobile screens;
- testable against explicit usability criteria.

The governing rule is:

> **Adaptive intelligence may change what the learner is shown, but it
> must not make interaction behaviour unpredictable.**

The learner should quickly learn how the product works and then be able
to rely on those interaction patterns throughout the platform.

---

# 87.2 External UX/accessibility baseline

The implementation should use recognised platform/web guidance as a
baseline rather than inventing interaction rules from scratch.

The initial reference set is:

- **WCAG 2.2 AA** as the minimum accessibility conformance target;
- W3C/WAI guidance for keyboard, focus, reflow, target sizing and
  accessible authentication;
- small-screen-first responsive principles consistent with the GOV.UK
  Design System;
- established mobile interaction conventions, including Apple Human
  Interface Guidelines where relevant;
- Core Web Vitals as measurable field-performance signals for the web
  product.

These references are design/engineering inputs, not a requirement to
make the product visually resemble GOV.UK or an Apple application.

The product should have its own identity while respecting mature,
well-understood interaction conventions.

---

# 87.3 WCAG 2.2 AA is the minimum accessibility target

Replace the weaker phrase "WCAG-aligned" with:

> **Target WCAG 2.2 Level AA for the learner-facing web product.**

WCAG conformance must be considered during design and implementation,
not tested only immediately before launch.

Particular attention should be paid to requirements covering:

- keyboard operation;
- visible focus;
- focus not obscured by sticky UI;
- meaningful semantic structure;
- contrast;
- resizing/reflow;
- text alternatives;
- form labels/errors;
- target sizing;
- non-drag alternatives;
- consistent help;
- redundant entry;
- accessible authentication.

Where the product intentionally deviates from an AA requirement, the
exception must be identified and resolved before public launch unless a
valid WCAG exception applies.

---

# 87.4 Small-screen-first design

Every important learner flow should be designed first for a narrow
screen.

Default principle:

```text
NARROW MOBILE
    first
      ↓
TABLET
      ↓
DESKTOP
enhancement
```

Desktop should add useful space, not repair a mobile layout that was
designed too late.

The initial design should prefer a single-column content flow on narrow
screens.

Do not assume a specific iPhone/Android model.

Design for viewport capability and content needs rather than named
devices.

---

# 87.5 Responsive reflow requirement

Ordinary learner content must reflow without horizontal scrolling.

This includes:

- lesson text;
- buttons;
- cards;
- feedback;
- progress;
- forms;
- ordinary equations;
- answer options.

Exceptions may be necessary for genuinely wide specialist content, but
the design should first attempt:

- stacking;
- wrapping;
- responsive scaling;
- alternative representation.

Horizontal scrolling should be an exception, not the default solution.

---

# 87.6 Content width and readability

On larger screens, do not allow lesson prose to stretch across the full
window merely because space exists.

Use a readable maximum content measure.

A practical design target is roughly:

> **45–75 characters per line for ordinary explanatory prose**

depending on typography and context.

This helps scanning and reduces fatigue.

Full-width space may still be useful for:

- diagrams;
- structured practice;
- selected dashboards.

---

# 87.7 Responsive spacing and typography

Typography and spacing should use a coherent responsive scale rather
than arbitrary values screen by screen.

Requirements:

- body text remains comfortably readable on phone;
- headings preserve hierarchy on all screen sizes;
- line height remains comfortable;
- spacing contracts/expands consistently;
- text enlargement does not make controls overlap;
- no essential content is clipped by fixed heights.

The design-token system should contain the approved typography and
spacing scale.

---

# 87.8 Touch-target design target

Although WCAG 2.2 AA defines a smaller formal minimum target in some
circumstances, the product should use a stronger practical mobile design
target:

> **approximately 44 × 44 CSS pixels or larger for frequent standalone
> touch controls wherever practical.**

This applies especially to:

- answer choices;
- Continue;
- Check answer;
- Back;
- Start remediation;
- lesson navigation;
- bottom/tab navigation;
- icon buttons.

Targets also need adequate spacing to reduce accidental activation.

Inline text links are a different case and may follow normal text-link
conventions.

---

# 87.9 Thumb-friendly interaction

Frequently used mobile actions should be comfortably reachable without
requiring precise tapping.

Avoid:

- tiny icon-only controls;
- tightly clustered destructive/confirm actions;
- controls placed against screen edges without adequate padding;
- important actions that depend on hover.

Hover may enhance desktop UX but never be required for core behaviour.

---

# 87.10 One obvious primary action

Each learner step should normally have one visually obvious primary
action.

Examples:

- Continue
- Check answer
- Start lesson
- Start quick fix
- Finish session

Secondary actions such as:

- Explain
- Skip
- Later

should be visually subordinate.

Avoid presenting several equally dominant buttons and asking the learner
to work out which one advances the task.

---

# 87.11 Action-oriented labels

Controls should use concise verbs or clear outcomes.

Prefer:

- Continue
- Check answer
- Review weakness
- Start 3-minute fix
- Back to Ohm's Law

Avoid vague labels such as:

- OK
- Go
- Submit form
- Click here
- Proceed

where a more meaningful label is possible.

---

# 87.12 Predictable navigation

Navigation behaviour must be consistent.

Rules include:

- Back returns to the expected previous context;
- Continue advances the current flow;
- top-level navigation changes product area rather than performing
  actions;
- closing an optional detail view returns the learner to where they
  were;
- browser Back should behave sensibly;
- deep links should restore meaningful context where possible.

Do not create custom navigation behaviour merely because it looks novel.

---

# 87.13 Preserve learner context

Context preservation is a hard requirement.

Example:

```text
Ohm's Law lesson
    ↓
diagnostic check
    ↓
Maths remediation
    ↓
retest
    ↓
BACK TO:
Ohm's Law lesson at the point the learner left
```

Do not return the learner to:

- dashboard;
- unit home;
- beginning of lesson;

unless that is the intentional outcome.

Cross-domain remediation should feel like a temporary branch, not a
navigation reset.

---

# 87.14 Stable top-level information architecture

Primary product modes should remain stable and learnable.

If the final navigation uses tabs/navigation items, their role and
position should not constantly change based on learner state.

Adaptive recommendations can change **content within the product**.

They should not make the fundamental navigation map unstable.

---

# 87.15 Avoid modal overuse

A **modal** is an interface layer that temporarily blocks interaction
with the underlying screen until it is dismissed.

Use modals only when the interruption genuinely requires focused
attention.

Do not use a modal for every:

- explanation;
- hint;
- remediation suggestion;
- success message.

Prefer inline expansion, drawers/sheets or normal navigation when these
preserve context better.

---

# 87.16 Interruption budget

Every adaptive interruption must earn its place.

Before interrupting normal learner flow with:

- diagnostic probe;
- remediation prompt;
- warning;
- explanation;
- confirmation;

the product should ask:

> **Is the likely learner benefit greater than the interruption cost?**

Examples:

```text
single low-value mistake
→ probably continue

repeated high-impact weakness
→ worthwhile interruption

safety-critical misconception later
→ stronger interruption justified
```

This principle should be tested during usability evaluation.

---

# 87.17 No dead ends

Every normal product state should expose an obvious next action.

Examples:

After lesson completion:

- Continue to next lesson;
- practise;
- return to unit.

After failed remediation:

- try another explanation;
- practise prerequisite;
- defer;
- return.

After technical failure:

- retry;
- safely navigate elsewhere.

Avoid screens where the learner has to use browser Back simply because
the product forgot to provide a route onward.

---

# 87.18 Forgiving interaction

Where possible:

- preserve entered answers during recoverable errors;
- let learners undo/cancel non-destructive choices;
- do not lose work because they opened an explanation;
- avoid destructive actions without confirmation where impact matters;
- preserve session context when navigating to related content.

The learner should feel safe exploring the product.

---

# 87.19 State persistence standard

Meaningful learner state should survive ordinary interruptions.

At minimum, where technically practical:

- page refresh;
- accidental navigation;
- temporary network interruption;
- browser close/reopen;
- device/session return.

Persist important state server-side promptly.

Do not rely solely on a long-lived browser-memory object for:

- lesson position;
- completed answers;
- diagnostic branch;
- learner evidence.

---

# 87.20 Auto-save feedback

Auto-saving should normally be unobtrusive.

Where useful, show a subtle state such as:

```text
Saved
```

Do not make the learner manually save routine learning progress.

If saving fails, surface the problem clearly before the learner assumes
the work is safe.

---

# 87.21 Loading-state design

Every asynchronous action that may visibly take time should have a
deliberate loading state.

Possible patterns:

- immediate button state change;
- small spinner;
- skeleton placeholder for substantial content;
- progress indication for genuinely long operations.

Do not leave controls apparently unresponsive.

Do not show theatrical "AI is thinking" states for deterministic work.

---

# 87.22 Skeleton-screen caution

A **skeleton screen** is a placeholder shaped roughly like the content
that will appear.

Use it when it reduces perceived disruption for page/content loading.

Do not use skeletons for near-instant actions where a brief blank delay
would never be perceived.

Avoid excessive animated placeholders that make a simple app feel
restless.

---

# 87.23 Error-state design

Errors need explicit UX, not only technical handling.

An error state should tell the learner:

1. what failed in learner-relevant language;
2. whether their work was saved;
3. what they can do next.

Example:

> **We couldn't save that answer.**
>
> Your answer is still on this screen. Check your connection and try
> again.
>
> [Retry]

Do not show raw error codes as the main learner message.

A support/reference identifier may be available in expandable detail
when useful.

---

# 87.24 Empty states

An empty state should explain why the area is empty and what action is
available.

Example:

> **No weak areas yet**
>
> Complete a few lessons or practice questions and we'll show useful
> areas to review here.

Avoid blank screens or meaningless `0 items` messages.

---

# 87.25 Success states

Success should communicate the useful outcome.

Prefer:

> **Prefix conversion repaired**
>
> You then applied it successfully in Ohm's Law.

over decorative confetti or generic praise.

Animation should support comprehension, not become the reward itself.

---

# 87.26 Motion and animation

Animation may be used to:

- clarify transition;
- preserve spatial context;
- show expansion/collapse;
- show progress.

Avoid:

- mandatory decorative animation;
- large motion that distracts from learning;
- delayed transitions solely for visual flourish.

Respect reduced-motion user preferences.

---

# 87.27 Perceived-performance requirement

The product should feel immediate for normal learning actions.

Deterministic actions such as:

- marking;
- selecting next step;
- displaying approved feedback;

should not wait on AI or unnecessary network chains.

Where optimistic UI is safe, it may be used.

**Optimistic UI** means updating the interface immediately while the
server operation completes in the background, then correcting if it
fails.

Use it only where recovery is safe and understandable.

---

# 87.28 Core Web Vitals performance targets

For the production web product, use the current Core Web Vitals "good"
thresholds as field-performance targets at the 75th percentile,
segmented appropriately across mobile and desktop:

- **LCP — Largest Contentful Paint:** ≤ 2.5 seconds;
- **INP — Interaction to Next Paint:** ≤ 200 ms;
- **CLS — Cumulative Layout Shift:** ≤ 0.1.

These are operational UX targets, not excuses to optimise prematurely
before Phase 1 functionality exists.

The critical learner paths should additionally target effectively
immediate deterministic answer feedback.

---

# 87.29 Layout stability

Unexpected movement is particularly harmful while answering questions.

Requirements:

- reserve space for images/diagrams where possible;
- do not insert feedback above the control the learner is currently
  using in a way that moves it unexpectedly;
- sticky headers/bars must not jump in size;
- loading fonts/content should not substantially reflow the answer area.

---

# 87.30 Keyboard support

Every core learner task must be possible using a keyboard.

This includes:

- navigation;
- selecting answer options;
- entering numerical answers;
- opening/closing explanations;
- proceeding through lessons;
- accepting/deferring remediation.

Logical keyboard focus order should follow the visual/task order.

Do not create positive `tabindex` hacks to repair poor DOM structure.

---

# 87.31 Visible focus

Keyboard focus must be clearly visible.

Focus must not be hidden behind:

- sticky header;
- bottom navigation;
- cookie/privacy overlay;
- remediation drawer.

This directly supports WCAG 2.2 focus requirements.

---

# 87.32 Screen-reader semantics

Use semantic HTML and accessible names before custom ARIA solutions.

**ARIA — Accessible Rich Internet Applications** is a set of attributes
used to improve accessibility semantics where native HTML is
insufficient.

Rule:

> **Use native semantic controls where possible; add ARIA only when
> needed.**

Buttons should be buttons.

Links should navigate.

Headings should form a meaningful hierarchy.

Form controls should have programmatic labels.

---

# 87.33 Text resizing and zoom

The learner interface should remain usable when text is enlarged and
the page is substantially zoomed.

Important content/actions must not:

- overlap;
- clip;
- disappear;
- become unreachable.

Avoid fixed pixel heights on text containers.

---

# 87.34 Colour and contrast

Colour may reinforce meaning but must not be the only signal.

Example:

Do not indicate:

```text
correct = green only
incorrect = red only
```

Also provide:

- icon;
- text;
- label;
- structural change.

Contrast must meet the applicable WCAG 2.2 AA requirements.

---

# 87.35 Dark mode

Dark mode is not a Phase 1 requirement.

If implemented later:

- contrast/accessibility must be verified independently;
- it must not simply invert colours;
- diagrams/formulae/feedback states must remain readable.

Do not delay proving UX to build themes.

---

# 87.36 Numerical input UX

Numerical-answer entry is a critical product interaction.

Requirements:

- use the appropriate mobile keyboard where possible;
- allow decimal input;
- support negative values later where relevant;
- support scientific notation where required;
- separate number and unit clearly where useful;
- retain the number if the learner changes unit;
- avoid requiring a full symbolic equation editor for a simple number;
- display validation close to the field.

Do not mark a formatting difference wrong when the mathematical answer
is valid.

---

# 87.37 Multiple-choice UX

Answer options should:

- have large touch areas;
- permit tapping the full option row;
- remain visually distinct;
- preserve selection before submission;
- expose focus/selected states accessibly;
- avoid tiny radio circles as the only tappable area.

Do not use hover-dependent answer feedback.

---

# 87.38 Answer submission behaviour

The product should clearly distinguish:

```text
SELECT ANSWER
```

from:

```text
CHECK / SUBMIT ANSWER
```

unless the mode intentionally uses immediate selection submission.

Mock mode and learning mode may legitimately differ.

The rule must be consistent within each mode.

---

# 87.39 Prevent accidental double submission

Once an answer is submitted:

- disable/reconcile duplicate submissions;
- show immediate acknowledgement;
- ensure retries caused by network lag do not create duplicate evidence.

This is both UX and data-integrity behaviour.

---

# 87.40 Formula UX

Formula rendering must be:

- readable;
- selectable where helpful;
- semantically represented where practical;
- responsive on narrow screens.

For simple transformations, stack work vertically:

```text
V = IR

I = V / R

I = 230 / 46

I = 5 A
```

Do not shrink an equation to unreadable text merely to keep it on one
line.

---

# 87.41 Formula interaction caution

Do not introduce a complex mathematical input editor unless a learning
task genuinely requires symbolic free entry.

Prefer:

- numerical entry;
- structured formula choice;
- reorder/selection;
- simple text where robust.

A complicated equation editor could add more friction than diagnostic
value for Level 2 learners.

---

# 87.42 Diagram responsive behaviour

Circuit diagrams must have a defined mobile strategy.

Depending on the diagram:

- reflow labels;
- use scalable vector graphics;
- allow controlled zoom;
- simplify layout;
- offer a full-screen view;
- provide an accessible text alternative.

Do not simply render a desktop diagram at 30% scale.

---

# 87.43 Diagram interaction

If a learner must inspect a diagram closely:

- tapping should open a larger view where useful;
- zoom/pan behaviour should be obvious;
- closing the view must return to the same question state;
- answer controls must not disappear permanently behind the viewer.

---

# 87.44 Form design

Forms should:

- ask only for necessary information;
- use one clear label per field;
- place error messages next to the problem field;
- preserve valid entries when one field fails;
- avoid placeholder-only labels;
- avoid asking for the same information repeatedly.

This applies both to onboarding and learning interactions.

---

# 87.45 Validation timing

Do not aggressively show an error before the learner has had a
reasonable chance to complete the field.

Validation may occur:

- on submit;
- on blur where appropriate;
- live only when genuinely helpful.

Avoid a field becoming red after the first digit of a multi-digit
answer.

---

# 87.46 Destructive actions

Actions such as:

- delete account;
- abandon irreversible attempt where relevant;
- remove a learning programme;

should be visually and semantically distinct from ordinary actions.

Confirmation should be proportional to consequence.

Do not add confirmation dialogs to routine reversible actions.

---

# 87.47 Responsive navigation

On narrow screens, primary navigation should remain compact and
reachable.

If using bottom navigation/tab-like navigation:

- reserve it for top-level destinations;
- keep item count limited;
- preserve active-state clarity;
- account for device safe areas;
- ensure it does not obscure focused content.

On larger screens, navigation may adapt to sidebar/header patterns while
preserving the same conceptual destinations.

---

# 87.48 Back-stack behaviour for branches

Diagnostic/remediation branches need explicit navigation semantics.

Preferred conceptual model:

```text
ORIGIN LESSON
   ↓ branch
DIAGNOSTIC
   ↓
REMEDIATION
   ↓
RETEST
   ↓
RETURN TO ORIGIN
```

Browser/app Back should not unexpectedly step through every automated
internal engine state if that creates confusion.

Implementation should deliberately decide which states deserve a
navigation-history entry.

---

# 87.49 Adaptive UI consistency

The engine may decide:

- which explanation;
- which probe;
- which remediation;
- which next question.

It should not invent new interaction components for each diagnosis.

Use a consistent vocabulary of components such as:

- explanation card;
- quick check;
- remediation offer;
- result;
- next recommendation.

This keeps adaptation understandable.

---

# 87.50 Progressive disclosure component rules

Expandable detail should:

- have a clear label;
- indicate expanded/collapsed state;
- be keyboard accessible;
- preserve learner position;
- avoid nesting excessive accordions.

Example:

```text
Why?
Show working
Reference
Teach me this
```

Do not hide essential information behind disclosure merely to make a
screen appear minimal.

---

# 87.51 Feedback placement

Feedback should appear close to the answer/task it relates to.

Avoid making the learner scroll far away from the question to find why
they were wrong.

For longer explanations, keep a visible connection to:

- original question;
- learner answer;
- correct answer.

---

# 87.52 Scrolling behaviour

Do not unexpectedly jump the page after answer submission.

If feedback appears lower on a long mobile screen, scroll just enough to
bring the result into view while preserving orientation.

Avoid returning the user to the top of the page after every step.

---

# 87.53 Progress indicators

Progress indicators should communicate useful scope.

Examples:

```text
Lesson: 3 of 6
Practice: 7 of 10
Unit lessons: 5 of 18 complete
```

Avoid progress bars that imply mastery when they actually show content
completion.

Use labels where the distinction may otherwise be unclear.

---

# 87.54 Session length transparency

Where duration is estimated, present it as an estimate.

Example:

> About 5 minutes.

Do not imply precise completion time.

When a learner sets a time budget, the product should avoid starting an
activity obviously longer than the remaining budget without warning.

---

# 87.55 Accessibility of timed assessments

Mock timing should follow assessment authenticity while still providing
accessible operation.

The product should:

- make remaining time clearly perceivable;
- avoid motion/flashing urgency;
- preserve answers;
- warn before timeout where appropriate.

Any future accommodation features must be modelled separately from
ordinary practice settings.

---

# 87.56 Reading-level and microcopy standards

UX copy should be:

- concise;
- active;
- specific;
- non-patronising;
- consistent.

Use correct vocational terminology and explain it when needed.

Avoid:

- cute button labels;
- unnecessary motivational slogans;
- vague AI language;
- technical backend terminology.

---

# 87.57 Terminology consistency

Once a learner-facing term is chosen, use it consistently.

Examples to standardise:

- Lesson
- Practise
- Weak areas
- Quick revision
- Mock
- Progress
- Review
- Continue

Do not alternate casually among:

- module / card / nugget / unit / topic / learning object

for the same concept.

A UX terminology glossary should be created during implementation.

---

# 87.58 Cognitive-load control

Each screen should primarily ask the learner to do one thing.

Reduce extraneous decisions.

For a question screen, the learner's main job is:

> understand and answer the question.

Do not simultaneously compete for attention with:

- dashboard statistics;
- upsell banners;
- multiple recommendations;
- decorative content;
- unrelated alerts.

---

# 87.59 Advertising/upsell boundary

If commercial upgrade prompts are introduced later, they must not
interrupt active learning or assessment flows in a way that damages
trust.

Phase 1 contains no advertising UX requirement.

Paid-entitlement messaging should be clear and separate from learning
feedback.

---

# 87.60 First-use guidance

The interface should be self-explanatory enough that most learners do
not require a tutorial.

If first-use guidance is necessary:

- keep it brief;
- contextual;
- skippable;
- never block the user from beginning the main task unnecessarily.

Avoid long carousel onboarding.

---

# 87.61 Help placement

Help should be available consistently.

Examples:

- contextual help near unfamiliar features;
- stable Help/Support route;
- report-content issue action.

Do not move Help unpredictably between screens.

This also supports WCAG 2.2's consistency principles.

---

# 87.62 Connectivity resilience

The core app should handle temporary connectivity problems gracefully.

For Phase 1:

- preserve unsent answer locally where practical;
- clearly distinguish "answered" from "saved";
- retry safe operations;
- prevent duplicate evidence;
- do not falsely display permanent progress if server persistence failed.

Full offline mode remains out of scope.

---

# 87.63 Device/orientation resilience

Core learning should remain usable in:

- portrait mobile;
- landscape mobile where used;
- tablet;
- resizable desktop browser.

Do not assume orientation lock.

Avoid layouts that break when browser width changes mid-session.

---

# 87.64 Browser baseline

WP1.9 should define an explicit supported-browser matrix based on
current usage and technical requirements.

Phase 1 should at minimum test the current mainstream engines used by:

- Chrome/Chromium;
- Safari/WebKit;
- Firefox.

Do not assume "works in my browser" is sufficient.

---

# 87.65 Real-device testing

Responsive browser emulation is useful but insufficient.

Before Phase 1 exit, test on real devices representing at least:

- narrow modern iPhone-class phone;
- narrow/typical Android phone;
- tablet;
- desktop/laptop.

The purpose is not brand certification.

It is to catch:

- virtual keyboard issues;
- touch sizing;
- viewport/safe-area behaviour;
- zoom;
- scrolling;
- real perceived performance.

---

# 87.66 Assistive-technology testing

Before Phase 1 exit, perform at least:

- keyboard-only complete core journey;
- screen-reader smoke test on a representative desktop/mobile setup;
- automated accessibility scan;
- contrast verification;
- text zoom/reflow check.

Automated accessibility testing cannot replace manual testing.

---

# 87.67 Performance testing conditions

Do not test performance only on a fast development desktop.

At minimum include:

- throttled/network-constrained testing;
- mobile-class device testing;
- production build;
- realistic lesson content/diagrams.

Field metrics should be gathered once real users exist.

---

# 87.68 UX regression testing

Important interaction behaviour should become automated end-to-end
tests where practical.

Examples:

```text
new learner can start lesson
lesson progress persists
wrong answer shows feedback
remediation defer returns to lesson
cross-domain repair returns to origin
keyboard can submit answer
```

Visual-regression tooling may be useful later for critical components.

Do not rely entirely on screenshot tests; behavioural tests matter more.

---

# 87.68.1 Open-source UI primitives

The project should reuse mature open-source implementation primitives
for solved interaction problems rather than requiring bespoke code for
every control.

The selected default source is:

> **shadcn/ui, used selectively as open code**

This is an implementation accelerator, not the learner-experience
design authority.

Any imported primitive must be reviewed/adapted to satisfy this WP1.7
specification, including:

- WCAG 2.2 AA;
- practical ~44×44 CSS-pixel touch targets where applicable;
- narrow-screen-first behaviour;
- visible/unobscured focus;
- semantic control use;
- stable component states;
- project design tokens;
- terminology/microcopy rules.

Do not adopt a wholesale theme or generic SaaS dashboard template.

The aim is to reuse solved mechanics while preserving a purpose-built
vocational-learning interface.

---

# 87.69 Design-system governance

Once a component exists, reuse it.

Core components should include, as needed:

- primary/secondary button;
- answer option;
- numerical input;
- feedback panel;
- explanation disclosure;
- lesson card;
- progress indicator;
- quick-check panel;
- remediation offer;
- navigation;
- error/empty/loading states;
- formula block;
- diagram viewer.

Avoid creating visually similar but behaviourally different versions
for each feature.

---

# 87.70 Component states

Each reusable component should be designed for all relevant states.

Example answer option:

```text
default
hover where applicable
focus
selected
submitted-correct
submitted-incorrect
disabled
loading if relevant
```

Building only the "happy state" leads to inconsistent UX later.

---

# 87.71 Design tokens

The design system should use tokens for:

- spacing;
- typography;
- radii;
- elevation where used;
- motion duration;
- breakpoints;
- semantic status colours;
- focus treatment.

Tokens help maintain consistency across AI-assisted implementation.

Do not hard-code arbitrary values repeatedly.

---

# 87.72 Breakpoint philosophy

Breakpoints should follow layout/content needs rather than a long list
of named device widths.

A small number of breakpoints is preferable.

The default CSS should work for the smallest supported layout, with
enhancements added as space becomes available.

The precise values are chosen during implementation/design-system work.

---

# 87.73 Safe-area handling

On modern mobile devices, fixed/bottom controls should respect safe
areas so they are not obscured by:

- home indicator;
- browser UI;
- display cut-outs.

This matters especially if bottom navigation or sticky answer controls
are used.

---

# 87.74 Sticky-control caution

Sticky headers/bottom actions can improve mobile usability but also
cause:

- hidden focus;
- reduced content area;
- accidental obstruction;
- layout instability.

Use them only where usability testing supports them.

They must satisfy accessibility/focus requirements.

---

# 87.75 Primary task availability

The learner should not have to scroll through a long explanation merely
to reach the first interactive step if the lesson structure does not
require it.

Chunk content so that explanation and action remain close.

For deeper content, use progressive expansion or logical sections.

---

# 87.76 Resume-position fidelity

When resuming a lesson, return to the meaningful prior point.

Persist:

- lesson step;
- completed components;
- active diagnostic branch where appropriate.

Do not merely mark "lesson 50% complete" and restart at the top.

---

# 87.77 Multi-device continuity

Longer term, a learner signed into another device should see server-side
progress.

Phase 1 should ensure the data model supports this from the beginning.

Local browser storage may enhance resilience but must not become the
canonical learning record.

---

# 87.78 Authentication UX

Passwordless authentication should be designed for low friction and
WCAG 2.2 accessible-authentication requirements.

Requirements include:

- clear email input;
- clear code/magic-link messaging;
- no unnecessary memory/cognitive test;
- safe resend;
- understandable expiry/error states;
- no account-enumeration leaks in wording.

Security and UX must be designed together.

---

# 87.79 Session expiry UX

If a session expires:

- explain that sign-in is required again;
- preserve recoverable unsaved learning state where safe;
- after sign-in, return the learner to the intended context.

Do not silently discard the lesson and send them to the home page.

---

# 87.80 Privacy/consent UX

Privacy controls should avoid dark patterns.

**Dark patterns** are interface designs that manipulate users into
choices they might not otherwise make.

Rules:

- no preselected optional consent where prohibited/inappropriate;
- clear distinction between required and optional processing;
- easy access to privacy/account controls;
- no confusing cancellation/deletion route.

---

# 87.81 Desirable emotional tone

The product should feel:

- competent;
- calm;
- responsive;
- trustworthy;
- respectful of adult learners.

Avoid:

- shame for wrong answers;
- exaggerated celebration;
- faux-human AI theatrics;
- nagging remediation;
- countdown anxiety outside actual timed assessment.

---

# 87.82 Wrong-answer emotional design

Wrong answers are normal learning evidence.

Use neutral language:

> Not quite.

> Check the unit here.

> This looks like a formula-selection issue.

Avoid:

> Wrong!

> You failed this topic.

> You should know this.

The aim is clarity, not emotional cushioning or criticism.

---

# 87.83 User agency as a hard UX requirement

The adaptive engine should suggest rather than trap.

Learners should generally be able to:

- choose lessons;
- skip/defer remediation;
- exit a diagnostic branch;
- change feedback depth;
- practise a chosen topic;
- return to syllabus sequence.

Exceptions may exist later for safety-critical instructional flows, but
they must be explicit.

---

# 87.84 Smoothness definition

"Smooth UX" should be treated as testable behaviour rather than an
aesthetic adjective.

For Phase 1, smoothness means:

- no unexplained navigation jumps;
- no lost learner work;
- no unnecessary page reloads;
- no duplicate submissions;
- no avoidable waiting for deterministic actions;
- no dead ends;
- no inconsistent button behaviour;
- no mobile overflow;
- no focus loss in ordinary keyboard flows;
- no forced remediation for low-value issues;
- clear route back after adaptive branches.

---

# 87.85 Measurable usability task gates

Before Phase 1 exit, representative users should be able to complete
core tasks without coaching.

Required task tests include:

## Task A — start learning from zero

Prompt:

> "You are studying Unit 202 and want to start learning it."

Success:

- learner selects qualification/unit;
- enters Learn;
- starts intended lesson;
- no facilitator explanation required.

## Task B — resume lesson

Prompt:

> "Continue where you left off."

Success:

- learner identifies Continue;
- returns to meaningful saved position.

## Task C — practise selected topic

Prompt:

> "Practise parallel circuits."

Success:

- learner reaches targeted practice without entering unrelated learning
  flow.

## Task D — inspect deeper explanation

Prompt:

> "You don't understand why this answer is wrong."

Success:

- learner discovers deeper explanation naturally.

## Task E — defer remediation

Prompt:

> "You want to keep practising and fix this later."

Success:

- learner defers without penalty;
- returns to practice;
- weakness remains available later.

## Task F — repair cross-domain weakness

Prompt:

> "Fix the underlying Maths problem."

Success:

- learner understands transition to Maths;
- completes remediation;
- returns to Electrical context.

## Task G — find progress/readiness

Prompt:

> "See how you're doing in Unit 202."

Success:

- learner can distinguish lesson progress from assessment readiness.

---

# 87.86 Quantitative usability signals

During Phase 1 testing, capture at least:

- task completion;
- task failure;
- facilitator assistance required;
- time to complete;
- navigation errors;
- accidental taps;
- backtracking;
- remediation acceptance/defer behaviour;
- abandonment points.

Do not invent a universal acceptable completion time for every task.

The first testing rounds establish baselines and identify friction.

---

# 87.87 Qualitative usability questions

After task completion, useful questions include:

- What did you expect to happen?
- Was anything confusing?
- Did the diagnosis make sense?
- Did the remediation feel worth interrupting you?
- Did you know how to get back?
- Was the amount of explanation right?
- Would you use this to learn/revise for the actual qualification?

Prefer observed behaviour over relying only on satisfaction ratings.

---

# 87.88 Founder implementation guardrail

Because the Product Owner is not expected to be a professional UX
designer, implementation should not depend on subjective founder
judgement alone.

The design process should use:

- this specification;
- established design patterns;
- reusable design-system components;
- accessibility checks;
- real learner usability testing;
- measurable acceptance criteria.

The Product Owner remains final product decision-maker, but should not
be required to personally identify every interaction/accessibility
failure.

---

# 87.89 UX debt gate

Do not knowingly defer core UX defects merely because the backend loop
works.

Before Phase 1 exit, blockers include:

- broken mobile layout;
- inaccessible primary controls;
- lost progress;
- confusing remediation return path;
- inconsistent navigation;
- major performance lag on deterministic interactions;
- repeated usability-test failure on core tasks.

These are architecture/product failures, not cosmetic polish.

---

# 87.90 Phase 1 UX launch-quality bar

The proving slice does not need the breadth of the final commercial
platform.

But the flows it does contain should be **commercial-quality exemplars**.

The principle is:

> **narrow and excellent rather than broad and rough.**

For the selected proving lessons, the user should experience something
credible enough that we can evaluate:

> "Would someone actually prefer learning this way?"

rather than:

> "Can we imagine how good this would be after polishing it?"

---

# 87.91 UX implementation evidence

Phase 1 exit evidence should include:

- screenshots at representative viewport sizes;
- real-device test record;
- accessibility test record;
- keyboard journey;
- performance metrics from production-like build;
- usability-test findings;
- resolved/unresolved UX issues;
- demonstration of cross-domain remediation return;
- demonstration of persisted resume state.

This evidence should be reviewed alongside technical test results.

---

# 87.92 UX standards review cadence

UX/accessibility standards evolve.

Before public launch and periodically thereafter:

- review current WCAG guidance;
- review browser/platform changes affecting interaction;
- review Core Web Vitals/current performance guidance;
- update the design system deliberately.

Do not silently rebuild the interface around every platform fashion.

Durable principles such as clarity, agency, accessibility,
predictability and context preservation take precedence over visual
trends.

---

# 88. Phase 1 UX acceptance criteria

WP1.7 is accepted when the Product Owner agrees that:

1. learner experience is designed independently of backend implementation details;
2. Learn is a first-class primary mode;
3. a learner can work through qualification → unit → lesson in sequence;
4. foundational Maths/Physics/Electrical browsing is also supported;
5. cross-domain remediation preserves the learner's original vocational context;
6. lessons follow explain → demonstrate → guided practice → independent check → diagnose/remediate if needed → retest → transfer;
7. deterministic numerical examples are used throughout teaching, not only assessment;
8. progressive disclosure is the default feedback model;
9. minimal-feedback learners are not penalised or forced into long teaching;
10. deeper-learning learners can access additional explanation/remediation naturally;
11. practice remains learner-controlled while still benefiting from adaptive selection;
12. Improve Weak Areas exposes root causes rather than only topic percentages;
13. diagnostic probes are short and explicitly helpful;
14. remediation communicates reason, duration and route back;
15. Quick Revision prioritises high-value learning under time constraints;
16. Mock mode preserves assessment authenticity;
17. readiness and mastery are shown separately;
18. progress prioritises meaningful learning outcomes over question count;
19. onboarding is short;
20. qualification selection is precise;
21. recommendations show their rationale;
22. the learner can ignore/defer recommendations;
23. mobile-first layout is mandatory;
24. learner-critical information does not depend on wide tables;
25. accessibility is designed in from Phase 1;
26. lesson progress saves automatically and resumes;
27. AI is not theatrically exposed where deterministic logic is doing the work;
28. uncertainty is communicated honestly;
29. Phase 1 delivers a polished learner journey rather than backend-only proof;
30. Ohm's Law, Parallel Circuits and Electrical Power are the preferred first polished proving lessons;
31. a small reusable design system is established;
32. representative usability testing occurs before Phase 1 exit;
33. Product Owner/founder learner testing is useful but does not replace external learner testing;
34. the core UX remains intentionally free of unnecessary gamification/social/enterprise features;
35. WCAG 2.2 AA is the explicit minimum accessibility target;
36. critical learner flows are designed small-screen-first rather than adapted from desktop afterwards;
37. ordinary learner content reflows without horizontal scrolling;
38. frequent standalone touch controls target approximately 44×44 CSS pixels or larger where practical;
39. each step normally exposes one obvious primary action;
40. navigation and adaptive branches preserve learner context predictably;
41. the adaptive engine may change content/sequence but must not create unpredictable interaction patterns;
42. adaptive interruptions are governed by an explicit interruption-budget principle;
43. ordinary product states contain a clear next action and avoid dead ends;
44. meaningful learner state persists through ordinary interruption/reload/session return where practical;
45. loading, empty, success and error states are deliberately designed;
46. deterministic learner actions are not delayed by optional AI;
47. production web UX targets current good Core Web Vitals thresholds, including LCP ≤2.5 s, INP ≤200 ms and CLS ≤0.1 at the 75th percentile;
48. keyboard operation, visible focus and focus-not-obscured behaviour are mandatory;
49. semantic HTML/native controls are preferred over custom ARIA-heavy widgets;
50. formulae and diagrams have explicit responsive/mobile behaviour;
51. numerical entry is optimised for mobile keyboards and does not require unnecessarily complex equation editors;
52. answer controls prevent accidental/double submission and preserve clear selected/submitted states;
53. reusable components include all important interactive/error/loading states;
54. UX terminology is standardised and learner-facing copy is concise/action-oriented;
55. core learning screens control cognitive load and avoid competing unrelated calls to action;
56. real-device testing is required in addition to responsive browser emulation;
57. manual assistive-technology testing supplements automated accessibility scans;
58. usability testing uses explicit learner tasks and records observed friction, not only satisfaction;
59. core UX defects are Phase 1 exit blockers rather than cosmetic debt;
60. the implemented proving flows must reach a narrow commercial-quality bar rather than serving as rough backend demonstrations;
61. mature open-source UI primitives may be reused to avoid rebuilding
    solved accessibility/interaction mechanics;
62. shadcn/ui is the preferred starting source for commodity primitives,
    but imported code remains subject to the project's own UX/design
    system and accessibility requirements;
63. wholesale themes/templates are not used as a substitute for
    product-specific learner experience design.

---

# 89. Decision recommendation

**APPROVE WP1.7 as the Learner UX & Product Specification for Phase 1.**

The central decision is:

> **The learner product will expose a small number of clear modes — Learn, Practise, Improve Weak Areas, Quick Revision, Mock/Exam Practice and Progress — over one shared knowledge and learner model. Learning Mode supports complete syllabus-led study from zero prior evidence; adaptive diagnosis and remediation appear only when useful; feedback uses progressive disclosure; and the core experience is engineered small-screen-first to WCAG 2.2 AA with predictable navigation, preserved context, resilient state, touch/keyboard accessibility, deliberate loading/error behaviour and measurable performance/usability gates. Adaptive intelligence may change what is taught, but not make the interaction model unpredictable.**

This is the product layer that turns the platform's architecture into something learners may actually choose to use and pay for.

---

# 90. Next work package

On approval of WP1.7, proceed to:

> **WP1.8 — Content Production & Governance Pipeline**

WP1.8 will define:

- source intake;
- rights classification;
- candidate assertion extraction;
- validation;
- curriculum mapping;
- misconception creation;
- lesson authoring;
- question-family authoring;
- deterministic variant validation;
- review;
- approval;
- publication;
- update propagation;
- source-version changes;
- throughput metrics;
- AI-assisted content-development controls;
- deletion/segregation of proprietary development material.

This work package will operationalise the knowledge/content governance architecture before WP1.9 chooses the implementation stack.

---

**End of WP1.7**
