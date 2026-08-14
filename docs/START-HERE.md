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
