---
id: ADR-0006
status: accepted
owner: project-architect
approved_by: product-owner
approved_date: 2026-08-29
---

# ADR-0006: V1 Canonical Lessons and Assessment-Driven Guided Revision

## Status

Accepted — 2026-08-29.

## Context

ALP has already implemented/proven sophisticated deterministic evidence, mastery, within-lesson branching and cross-lesson remediation/orchestration capabilities. Product Owner review showed, however, that requiring rich adaptive lesson routing during initial content production would multiply authoring states, visual variants, QA paths and implementation effort before the premium core learning product is proven.

The same review also showed that some existing lessons had been over-fragmented into very short screens. Avoiding scroll had effectively reduced teaching depth in places, while the product ambition requires fuller explanation, reinforcement and strong visual teaching.

## Decision

Version 1 will use **one canonical premium route through each ordinary lesson**.

The route does not change because of learner mastery, prerequisite state or ordinary lesson-check performance. Lessons remain directly openable and may contain rich scrollable teaching, visuals, worked examples, interactions and short knowledge checks.

V1 learner-facing adaptation occurs **after a dedicated formative/mock assessment is completed and explicitly submitted**.

The submitted assessment is mapped to governed capabilities and canonical lessons. The system produces a deterministic **Guided Revision plan** ranking the full lessons needed to address the weaknesses exposed by that latest submitted assessment, from highest priority to lowest.

Opening/completing Guided Revision lessons does not itself recalculate weakness priority. A later completed and submitted formative/mock assessment rebuilds the plan.

Incomplete, abandoned, suspended or merely started assessments do not update the plan.

Existing richer adaptive machinery is retained as platform capability and post-V1 option; it is not deleted, but it is not a V1 ordinary-lesson production requirement.

## Consequences

- Lesson authors build one excellent lesson rather than multiple adaptive variants.
- Scrolling is explicitly preferable to arbitrary fragmentation where it preserves a coherent teaching experience.
- Premium visuals and reinforcement can receive more production attention.
- Embedded lesson checks reinforce learning but do not drive the V1 Guided Revision plan.
- The dedicated submitted assessment boundary becomes the principal V1 weakness-identification trigger.
- Assessment-to-capability-to-lesson mapping becomes a required upstream content contract.
- Guided Revision reuses canonical full lessons rather than bespoke remediation lessons.
- The current revision plan is explainably tied to the latest submitted assessment in scope.
- Existing CC-07/CC-08/CC-12 adaptive infrastructure remains valid historical/platform work but must not be described as mandatory V1 lesson behaviour.

## Compatibility

ADR-0006 does not revoke the evidence/mastery architecture or deterministic adaptive engines. It limits how those capabilities are exposed in V1.

ADR-0005 continues to govern ground-up learning-package and visual production. ADR-0006 narrows the V1 learner model that those packages must produce.
