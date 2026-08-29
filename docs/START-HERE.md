---
id: GOV-START
status: approved
owner: project-architect
last_reviewed: 2026-08-14
---

# Start Here

This is the orientation document for a new human contributor or AI coding agent. Its purpose is to get a competent contributor from zero context to safe task execution quickly, without prior chat history.

## What this project is

The Adaptive Learning Platform is a UK-first vocational-learning product that teaches complete curricula, assesses knowledge, maintains a granular learner model, identifies weak concepts/capabilities, infers likely root causes where evidence supports that inference, remediates the smallest useful missing foundation, retests it and verifies transfer back into the vocational context.

Electrical is the first complete vocational vertical. Foundational Maths and Foundational Physics are reusable horizontal domains.

## What makes it different

The product is not fundamentally a question bank and not fundamentally an AI chatbot. Its intended differentiator is **evidence-driven diagnosis and targeted teaching across vocational and foundational knowledge**.

It must support both **MAKE ME PASS** and **MAKE ME UNDERSTAND** through the same learner model and content system.

## Learning does not require diagnosis first

A learner can choose qualification → unit → lesson and work systematically through the syllabus. Assessment is one entry route, not a gate.

## Learning-package production and the V1 learner model (2026-08-29)

Following Product Owner review of Unit 202 after full Android runtime qualification, two accepted decisions govern current and future learning-package work: [`ADR-0005`](architecture/adr/ADR-0005-learning-package-production-and-visual-governance.md) (ground-up learning-package production; instructional visuals are first-class governed content planned before authoring; Claude may extract candidate visual needs but may not select/approve a final technical reference — that requires independent Project Architect review; Gemini is a renderer only) and [`ADR-0006`](architecture/adr/ADR-0006-v1-canonical-lessons-and-assessment-driven-guided-revision.md) (V1 ordinary lessons use one canonical premium route — no per-learner skip/branch/reorder — with rich scrollable teaching preferred over viewport-fragmentation; V1 adaptation happens only via a dedicated formative/mock assessment that is completed and explicitly submitted, producing a deterministic Guided Revision plan ranking full canonical lessons by weakness).

The existing richer evidence/mastery/diagnostic/remediation machinery (CC-07/CC-08/CC-12) is real, implemented, and **retained as platform capability / post-V1 option** — it is not deleted, but it is not a V1 ordinary-lesson production requirement. Do not assume mastery drives ordinary-lesson routing, or that an ordinary lesson check triggers remediation, in current V1 work.

Full reconciliation checklist and production architecture: [`docs/architecture/ARCHITECTURE-RESET-INTEGRATION-MATRIX.md`](architecture/ARCHITECTURE-RESET-INTEGRATION-MATRIX.md), [`docs/architecture/SYLLABUS-TO-LEARNING-PACKAGE-PRODUCTION-ARCHITECTURE.md`](architecture/SYLLABUS-TO-LEARNING-PACKAGE-PRODUCTION-ARCHITECTURE.md), [`docs/architecture/V1-LEARNING-ASSESSMENT-AND-GUIDED-REVISION-ARCHITECTURE.md`](architecture/V1-LEARNING-ASSESSMENT-AND-GUIDED-REVISION-ARCHITECTURE.md).

## Initial runtime AI policy

Initial learner runtime has **no AI dependency**. AI is used for development, content generation/verification and review. Learner teaching, marking, evidence, diagnosis and remediation are deterministic/governed. A future premium AI tutor may be added separately.

## Source of truth

Authority order:

1. `docs/governance/PROJECT-CONSTITUTION.md`
2. accepted ADRs and approved durable product/architecture/security specifications
3. `docs/roadmap/ROADMAP.md` for development sequence
4. `PROJECT-STATUS.md` for live project state
5. currently approved task brief
6. implementation/tests as evidence of what exists
7. README/orientation material
8. chat history/model memory

Code does not silently supersede an approved requirement. Surface conflicts.

## Who decides what

Read `docs/governance/ROLES-AND-AUTHORITY.md`.

- **Product Owner** — final product/scope/risk/priority authority
- **Project Architect** — architecture/specification/research/review
- **Implementation Engineer** — bounded implementation and evidence

Claude Code normally acts as Implementation Engineer and has no independent product authority.

## Current work

Read root `PROJECT-STATUS.md`. Do not duplicate current state here.

## Before any implementation task

Beyond the orientation reading above, any implementation task also requires reading the repository's process documents. These govern how work is done, not what the product is, so they are not needed for purely informational reading:

- [`../CONTRIBUTING.md`](../CONTRIBUTING.md) — repository contribution and commit constraints
- [`development/DEVELOPMENT-WORKFLOW.md`](development/DEVELOPMENT-WORKFLOW.md) — the task/review/checkpoint process
- [`development/AI-DEVELOPMENT-PROTOCOL.md`](development/AI-DEVELOPMENT-PROTOCOL.md) — Claude Code implementation boundaries

## Critical invariants

Product, security, UX and content invariants must be preserved. This document does not maintain its own copy of them. Read:

- `PROJECT-STATUS.md` for the current live list of product invariants
- `docs/governance/PROJECT-CONSTITUTION.md` and `docs/product/PRODUCT-PRINCIPLES.md` for durable product requirements
- `docs/security/SECURITY-BASELINE.md` for durable security requirements

## What not to do

Do not turn this into a generic LMS or AI tutor; build the whole Electrical corpus before the proving slice; introduce microservices/Kubernetes/graph DB/Redis without evidence; copy proprietary educational content into production; force unnecessary remediation; import a generic SaaS dashboard theme; or use Replit as the canonical source-of-truth environment.

## Read only what the task needs

For normal work read this file, `PROJECT-STATUS.md`, the current task, task-relevant authoritative docs/ADRs and affected code/tests. Historical work packages explain why but are not required for every task.

## Fresh-session standard

A new contributor should orient safely in under 15 minutes. If previous chat history is required, the documentation system has failed.
