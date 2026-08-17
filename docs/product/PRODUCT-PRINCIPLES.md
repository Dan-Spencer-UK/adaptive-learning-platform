---
id: PROD-002
status: approved
owner: product-owner
last_reviewed: 2026-08-17
---

# Product Principles

1. **Teach, do not merely test.** A learner must be able to start from zero evidence and receive coherent teaching.
2. **Diagnose causes, not labels.** Identify the smallest plausible underlying weakness that changes what should be taught next.
3. **Preserve uncertainty.** Do not turn weak evidence into false certainty; use competing hypotheses where appropriate.
4. **Separate diagnostic depth from feedback depth.** The system may reason deeply while displaying little.
5. **Never punish less explanation.** Do not force lengthy remediation after every detected weakness; compulsory interruption needs a genuine reason.
6. **Support MAKE ME PASS and MAKE ME UNDERSTAND.** Different learner intents use the same learner model and governed content.
7. **Assertions are not lessons.** Atomic governed knowledge/evidence objects are not the learner-facing teaching structure.
8. **Foundational knowledge is reusable.** Formula transposition belongs to Foundational Maths, not separately to every vocational domain.
9. **Verify transfer.** Passing foundational remediation is not sufficient; retest in vocational context.
10. **Evidence is not mastery.** One correct or incorrect answer does not automatically determine learner state.
11. **Readiness is not mastery.** Exam readiness can include coverage, recency, strategy and assessment familiarity.
12. **Deterministic-first runtime.** Initial launch has no runtime AI dependency.
13. **Progressive disclosure.** Give the useful minimum first and allow deeper support naturally.
14. **Preserve context.** Adaptive branching must make clear why the learner moved, what is being fixed and how to return.
15. **Every interruption earns its interruption.** Do not derail learning for low-value noise.
16. **Stable interaction, adaptive content.** Content/sequence may adapt; navigation and interaction behaviour should remain predictable.
17. **Native-mobile-first.** iOS and Android are the primary learner platforms; web is secondary. Native quality and parity are release requirements, not a later port. The product must not be architected as a wrapped responsive website. Critical flows are designed for native mobile first.
18. **Accessible by default.** WCAG 2.2 AA is the minimum target for the web client; the native clients meet the equivalent native-platform accessibility standard (screen reader, Dynamic Type/scaling, focus order, contrast, reduced motion — see [`docs/product/MOBILE-UX-ENGINEERING-STANDARD.md`](MOBILE-UX-ENGINEERING-STANDARD.md)). Accessibility is required on every platform; the specific standard cited differs because WCAG is a web-content standard.
19. **Deterministic actions should feel immediate.** No runtime AI belongs in the launch critical path.
20. **No unnecessary gamification.** Avoid childish mechanics, shame or decorative scoring without learning value.
21. **Calm adult tone.** Wrong answers are evidence, not failure theatre.
22. **Measure what changes decisions.** Collect signals that improve content, UX, diagnosis or commercial decisions.
23. **Feature maturity follows content maturity.** Do not expose paths whose underlying content/engine is incomplete.
24. **Narrow commercial quality beats broad rough coverage.** The proving slice should feel like something a learner might choose to pay for.
25. **Lessons are structured sequences of discrete learning interactions, not scrolling documents.** Progression should feel continuous and frictionless rather than paginated. Vertical scrolling is permitted within a step where content genuinely requires it, but the learner advances through the lesson one purposeful step at a time. See [`docs/architecture/LESSON-PLAYER-AND-LESSON-PLAN-ARCHITECTURE.md`](../architecture/LESSON-PLAYER-AND-LESSON-PLAN-ARCHITECTURE.md).
26. **Every lesson is derived from an explicit machine-readable lesson plan** identifying its objectives, prerequisite knowledge, target knowledge assertions/capabilities, instructional sequence, assessment points, misconception checks, branching/remediation rules and completion criteria — not merely a collection of UI components/content.
27. **A canonical lesson plan defines the pedagogically valid intervention; the actual learner lesson instance may be adaptively assembled from that plan using governed learner evidence.** Runtime adaptation remains deterministic and must not depend on an LLM.
28. **Learn mode is interaction-first and directed; review/reference mode may present the same governed knowledge in a concise continuous-scroll format.** The two modes must not be conflated.
