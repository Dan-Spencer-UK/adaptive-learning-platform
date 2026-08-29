# 2026-08-29 Learning-Package Architecture Reset

## Trigger

Product Owner review of Unit 202 after full Android runtime qualification showed that the runtime architecture had matured faster than the learning-package authoring architecture.

Observed classes included:
- initial lesson launch issue requiring retry;
- internal step/debug information visible to learners;
- raw numerical tolerance metadata in feedback;
- teaching content revealing answers to following/current formative checks;
- duplicated penultimate recap/completion content;
- text-only conceptual lessons with no meaningful imagery;
- introductions not aligned with lesson aim;
- diagnostic/error-analysis questions that add unnecessary cognitive indirection;
- unrelated/off-syllabus telephone-socket content;
- component questions depending on material taught only in another lesson;
- component lessons lacking physical/symbol visuals.

These findings demonstrate that runtime PASS is necessary but insufficient.

## Architectural response

Adopt:
1. `SYLLABUS-TO-LEARNING-PACKAGE-PRODUCTION-ARCHITECTURE.md`
2. `INSTRUCTIONAL-VISUAL-PLANNING-REFERENCE-AND-PRODUCTION-ARCHITECTURE.md`
3. `ALP-PRODUCT-WIDE-VISUAL-DESIGN-SYSTEM.md`
4. `LEARNING-PACKAGE-QUALITY-GATES.md`
5. `VISUAL-REFERENCE-REVIEW-PROTOCOL.md`
6. `LEARNING-PACKAGE-PIPELINE-AUDIT-AND-QUALIFICATION-PLAN.md`
7. ADR-0005.

## Programme decision

Do not continue broad syllabus expansion until:
- architecture is integrated into current authoritative docs/tooling;
- the existing pipeline is audited;
- gaps are remediated;
- a start-to-finish pilot is run successfully;
- Product Owner reviews the resulting lesson as representative of the class-leading target.

## Subsequent V1 simplification

Before implementation prompts were issued, the Product Owner made a further scope decision recorded in ADR-0006 and `2026-08-29-v1-learning-model-simplification.md`.

The reset therefore does **not** require rich adaptive lesson branching for V1. Instead:
- one canonical premium lesson route is authored for everyone;
- teaching may scroll and should not be fragmented merely to fit a viewport;
- embedded lesson checks reinforce learning but do not rebuild revision priorities;
- adaptation occurs after a dedicated formative/mock assessment is completed and submitted;
- Guided Revision ranks the full canonical lessons needed, highest weakness first;
- each later submitted assessment rebuilds the plan;
- existing richer adaptive engines remain retained post-V1 capability.

The implementation/audit/pilot sequence must use this simplified V1 contract.
