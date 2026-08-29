# 2026-08-29 V1 Learning-Model Simplification Decision

## Trigger

During architecture-reset review, the Product Owner challenged whether rich within-lesson adaptation was creating unnecessary V1 complexity and slowing production.

Two observations drove the decision:

1. some existing lessons had become too fragmented — in places effectively one sentence followed by Continue — whereas stronger teaching would use fuller explanation, reinforcing information and high-quality visuals even when that requires scrolling;
2. the sophisticated evidence/mastery/remediation machinery is valuable, but V1 does not need to dynamically change ordinary lesson routes to deliver clear adaptive value.

## Decision

V1 will use:
- one canonical premium route per ordinary lesson;
- rich scrollable teaching instead of arbitrary viewport-sized fragmentation;
- embedded knowledge checks for reinforcement;
- a dedicated formative/mock assessment as the V1 weakness-identification boundary;
- Guided Revision generated only after the assessment is completed and submitted;
- full canonical lessons ranked from greatest demonstrated weakness to least;
- Guided Revision plan rebuilt after each later completed/submitted assessment.

Incomplete assessments and ordinary lesson-check activity do not change Guided Revision.

Existing richer adaptive engines remain available for post-V1 evolution.

## Product rationale

This delivers a simple learner proposition:

> Learn the course → take a mock → see exactly what to revise → revise the full lessons → take another mock → receive an updated plan.

It preserves ALP's governed evidence foundation while concentrating V1 production effort on excellent lessons, premium imagery, valid assessment and an explainable revision loop.
