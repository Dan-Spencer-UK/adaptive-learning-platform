# Project Status

**Project:** Adaptive Learning Platform  
**Current phase:** Phase 1 — Architecture & End-to-End Proving Slice  
**Current work package:** WP1.10 — Build the Proving Slice  
**Current implementation stage:** CC-02 — Local Supabase + Database Baseline  
**Status:** ACTIVE  
**Next coding package:** CC-03 — Authentication + Learner Isolation  
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

## CC-00 — Repository Operating System

**Status:** COMPLETE / APPROVED

CC-00 created, reviewed and placed the durable project/governance/handover documentation and passed the cold-handover test before application scaffolding began.

**Baseline checkpoint commit:** `50ab9b1e820bd9155e32b33669e852ec4f59059f`

This baseline is committed and pushed to `origin/main` (`https://github.com/Dan-Spencer-UK/adaptive-learning-platform.git`).

## CC-01 — Repository Foundation

**Status:** COMPLETE / APPROVED

CC-01 established the npm workspace, the Next.js application (`apps/web`), strict shared TypeScript configuration, Tailwind design tokens, the eight approved framework-independent package skeletons under `packages/`, unit/component/e2e/accessibility testing infrastructure and a GitHub Actions CI workflow. The repository now contains real application infrastructure rather than documentation-only planning; no learner-domain behaviour, Supabase, authentication or runtime AI was implemented.

**Approved CC-01 commit:** `8a678715a8eb300422615f4cb4f1ceba31086cc3`, pushed to `origin/main`. GitHub Actions CI passed for this commit (typecheck, lint, unit tests, build, Playwright e2e/accessibility, dependency audit).

## Current task

> **CC-02 — Local Supabase + Database Baseline**

CC-02 establishes local Supabase-backed persistence on the approved technical baseline in [`docs/architecture/ARCHITECTURE-OVERVIEW.md`](docs/architecture/ARCHITECTURE-OVERVIEW.md).

In scope: Supabase CLI local development environment, initial SQL migrations, seed/test data, generated TypeScript database types, the minimum source/curriculum/assertion schema, RLS scaffolding and pgTAP tests. Acceptance: `supabase db reset` reconstructs the local database successfully; no production Supabase project is needed yet.

Out of scope: authentication and learner isolation (CC-03), populating real Electrical/Foundational Maths knowledge-graph content (CC-04), deterministic calculation/evidence/diagnostic/learning-engine behaviour, lesson/content implementation, a production Supabase project and production deployment.

## Known blockers

None.

## Last accepted implementation commit

CC-01: `8a678715a8eb300422615f4cb4f1ceba31086cc3`, pushed to `origin/main`, GitHub Actions CI passed.

## Exact next task after CC-02

> **CC-03 — Authentication + Learner Isolation**

See [`docs/roadmap/ROADMAP.md`](docs/roadmap/ROADMAP.md) for the full WP1.10 implementation sequence.

## Cold-handover gate

Before each CC package begins, a fresh contributor with no chat history must be able to determine from the repository:

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
