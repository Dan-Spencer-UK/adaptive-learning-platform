---
id: ADR-0005
status: accepted
owner: project-architect
approved_by: product-owner
approved_date: 2026-08-29
---

# ADR-0005: Ground-Up Learning-Package Production and Independent Visual Governance

## Status

Accepted — 2026-08-29.

## Context

Real Product Owner review of Unit 202 found that runtime qualification alone did not guarantee a premium or pedagogically coherent learning package. Recurring issues included learner-visible internal/debug language, teaching content leaking formative answers, redundant lesson steps, off-syllabus/untaught knowledge appearing in questions, weak learner-facing diagnostic framing, and entire conceptual/component lessons with little or no meaningful imagery.

Visual-production experience also demonstrated that generative tooling and the Implementation Engineer cannot be the authority for selecting technical references or deciding technical visual geometry. Reference choice itself is a critical correctness step.

## Decision

ALP adopts a ground-up production architecture in which curriculum, knowledge, pedagogy, visual planning, reference governance, questions/evidence and runtime compatibility are designed and validated as one pipeline.

Instructional visuals are first-class governed learning content. Every lesson receives a visual-opportunity analysis and required visuals are planned before learner-ready status.

Reference selection and annotation for new instructional visuals require independent Project Architect review. Claude may extract visual needs and orchestrate production but may not independently select technical references or invent technical relationships. Gemini is a renderer only.

A product-wide visual design system governs visual families across all qualifications/units.

Publication requires independent curriculum, pedagogy, visual, assessment-integrity, learner-presentation and runtime gates.

For V1 learner behaviour, this architecture is constrained by ADR-0006: ordinary lessons use one canonical premium route, and adaptation is exposed through Guided Revision generated after a completed/submitted formative/mock assessment. Rich within-lesson/cross-lesson adaptive routing remains a retained platform capability, not a V1 lesson-production requirement.

## Consequences

- Existing lesson-production assumptions must be audited and reconciled.
- Existing Unit 202 runtime success remains valid but does not imply learner-ready/premium quality.
- Further syllabus-scale expansion is paused until the new architecture is implemented, the pipeline is audited, and an end-to-end pilot proves the workflow.
- Visual requirement/reference/asset catalogues become explicit governed artefacts.
- Automated generation may accelerate execution but cannot bypass human/Project Architect authority boundaries.

## Supersession / compatibility

This ADR does not revoke ADR-0004. It strengthens it by moving visual authority and planning earlier in the learning-package production lifecycle.

Where older documentation implies that visual completeness can be established after lesson authoring, or that an asset catalogue/reference may be selected entirely by the Implementation Engineer, ADR-0005 governs and those documents must be updated.

## V1 scope amendment

ADR-0006 is the controlling decision for V1 lesson-routing and Guided Revision semantics. Nothing in ADR-0005 should be read as requiring bespoke adaptive lesson branches, remediation lesson variants, or mastery-driven step assembly before V1 can ship. ADR-0005 governs **how high-quality learning packages are produced**; ADR-0006 governs **how V1 learners move through and are guided back to those packages**.
