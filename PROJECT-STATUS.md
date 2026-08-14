# Project Status

**Project:** Adaptive Learning Platform  
**Current phase:** Phase 1 — Architecture & End-to-End Proving Slice  
**Current work package:** WP1.10 — Build the Proving Slice  
**Current implementation stage:** CC-00 — Repository Operating System  
**Status:** ACTIVE  
**Next coding package:** CC-01 — Repository Foundation  
**Last updated:** 2026-08-14

## Purpose of this file

This is the **sole authoritative home for live project state**.

Other documents may link here but should not independently maintain copies of the current task, current blocker, exact next task or last accepted implementation checkpoint.

## Approved Phase 1 work

- WP1.1 — Proving Slice Definition & Acceptance Criteria — APPROVED
- WP1.2 — Domain & Knowledge Architecture — APPROVED
- WP1.3 — Learner Evidence & Mastery Architecture — APPROVED
- WP1.4 — Diagnostic & Remediation Engine — APPROVED
- WP1.5 — Teaching, Question & Learning-Content Architecture — APPROVED
- WP1.6 — Platform, Data & Security Architecture — APPROVED
- WP1.7 — Learner UX & Product Specification — APPROVED
- WP1.8 — Content Production & Governance Pipeline — APPROVED
- WP1.9 — Technical Architecture Decision & Implementation Plan — APPROVED
- WP1.10 — Build the Proving Slice — ACTIVE
- WP1.11 — Evaluation & Phase 1 Exit Gate — NOT STARTED

## Current approved technical baseline

The approved technical baseline is defined by [`docs/architecture/ARCHITECTURE-OVERVIEW.md`](docs/architecture/ARCHITECTURE-OVERVIEW.md); it is not independently reproduced here.

## Current product invariants

1. Learning Mode is first-class and does not require prior assessment.
2. Learners may progress qualification → unit → lesson systematically.
3. Assertions are governed knowledge/diagnostic objects; lessons are coherent instructional units.
4. Foundational knowledge is reusable across vocational domains.
5. Diagnostic depth and displayed feedback depth are separate.
6. Minimal-feedback learners are not punished or forced through unnecessary remediation.
7. Mastery, readiness, strategy success and diagnostic confidence remain distinct.
8. Initial learner runtime is deterministic-first and has zero runtime AI dependency.
9. Theory learning is never represented as digitally verified practical competence.
10. Mobile-first usability and WCAG 2.2 AA are implementation requirements.
11. Security is designed in from the first implementation slice.
12. Proprietary source material is not a production learner asset unless separately licensed/approved.

## Initial proving content

First polished lessons:

1. Ohm's Law — Voltage, Current and Resistance
2. Resistors in Parallel
3. Electrical Power

First diagnostic golden path:

```text
wrong V-I-R calculation
→ test relationship selection
→ test formula transposition
→ identify evidence-supported likely cause
→ Foundational Maths remediation if appropriate
→ foundational retest
→ Electrical transfer
→ return to original lesson
```

## Current task

> **CC-00 — Repository Operating System**

Create, review and place durable project/governance/handover documentation before application scaffolding. No application feature coding should begin until CC-00 passes the cold-handover test.

## Known blockers

None.

## Last accepted implementation commit

No application implementation commit yet.

## Exact next task after CC-00

> **CC-01 — Repository Foundation**

CC-01 establishes the npm workspace, Next.js application, strict TypeScript, Tailwind, project directories, testing skeleton, CI skeleton and initial design tokens. It does **not** include Supabase, authentication, lessons, learner evidence or diagnosis.

## Cold-handover gate

Before CC-01 begins, a fresh contributor with no chat history must be able to determine from the repository:

1. What is the product?
2. Who is the initial learner/market?
3. What differentiates the product?
4. What decisions are approved?
5. Who has authority to change product scope or architecture?
6. What may Claude Code decide independently?
7. What is implemented versus only designed?
8. What phase/task is current?
9. What task is next?
10. What documents are authoritative for it?
11. What security/UX/content-governance invariants must not be violated?

Target orientation time: **under 15 minutes**.
