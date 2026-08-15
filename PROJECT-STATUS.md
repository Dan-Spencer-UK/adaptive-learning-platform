# Project Status

**Project:** Adaptive Learning Platform  
**Current phase:** Phase 1 — Architecture & End-to-End Proving Slice  
**Current work package:** WP1.10 — Build the Proving Slice  
**Current implementation stage:** CC-04 — Minimum Ohm's-Law Knowledge Graph  
**Status:** ACTIVE  
**Last updated:** 2026-08-15

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

## CC-02 — Local Supabase + Database Baseline

**Status:** COMPLETE / APPROVED

CC-02 established local Supabase-backed persistence on the approved technical baseline: project-scoped Supabase CLI tooling, version-controlled SQL migrations, synthetic seed data, generated TypeScript database types, the governed source/curriculum/assertion schema and a deny-by-default RLS baseline. Product Owner / Project Architect review (CC-02A, CC-02B) corrected assertion identity/version separation, curriculum parent/version integrity and provenance-to-version binding before approval. The final approved model: `assertions` is the stable canonical identity; `assertion_versions` holds versioned governed content; `assertion_relationships` and `assertion_curriculum_mappings` reference stable `assertions.id`; `assertion_provenance_links` reference the specific `assertion_versions.id` they support. No authentication, learner isolation, runtime AI or production Supabase project was implemented.

The local database is reproducible from migrations + seed alone (`supabase db reset`); pgTAP database verification (84 assertions) passed; generated database TypeScript types are mechanically reproducible from the local schema.

**Approved CC-02 checkpoint:** `b075fddc295e0cf32090ee6c6e4c553462c56933`, pushed to `origin/main`; local and remote HEAD matched at approval. GitHub Actions CI passed for this commit, including the Supabase database job (start, reset, pgTAP, lint, generated-type diff check, stop) on a clean GitHub-hosted runner.

## CC-03 — Authentication + Learner Isolation

**Status:** COMPLETE / APPROVED

CC-03 built Supabase Auth on the CC-02 database baseline: passwordless email-OTP sign-in (local Mailpit mail catcher), server-side session verification via `auth.getClaims()`, a protected `/learn` route, a self-owned `learner_profiles` record and a dedicated `learner_isolation_probe` table proving cross-user RLS isolation. Product Owner / Project Architect review (CC-03A) corrected profile creation to be idempotent (`ON CONFLICT DO NOTHING`, no UPDATE privilege granted) and error-aware (unexpected DB errors are surfaced, never silently swallowed). A follow-up correction (CC-03B) made the `/learn` and `/sign-in` routes explicitly `force-dynamic` to fix a CI build regression caused by build-time env validation running against Next.js's static-prerender probe; no auth, RLS, environment-validation or secret-handling behaviour was weakened by this fix.

**Primary CC-03 implementation checkpoint:** `ce9c8bb4c3581d17245d78cc247ea24cdf01857f`

**Corrective CC-03B checkpoint:** `977257d73401f14914868c434625ed8f418f2514`

Both commits are pushed to `origin/main`; local and `origin/main` matched at approval, with a clean working tree. GitHub Actions CI (run `31852486647`) passed fully green at the corrective checkpoint across all four jobs — install/typecheck/lint/unit/build, dependency security audit, Supabase local database (migrations/pgTAP/types), and Playwright smoke tests against local Supabase Auth (the auth job actually ran, not skipped). Authentication and learner isolation are now proven both locally and in CI.

## Current task

> **CC-04 — Minimum Ohm's-Law Knowledge Graph**

CC-04 populates the CC-02 governed schema with the first real Ohm's-law knowledge neighbourhood.

In scope: Foundational Maths assertions, Electrical assertions, assertion relationships, source/version/locator records, curriculum mappings and misconceptions for the first Ohm's-law neighbourhood; a seed/import path for this content. Acceptance: the graph can answer required dependency queries; provenance is traceable; mappings are versioned.

Out of scope: deterministic calculation/question engine behaviour (CC-05), lesson/content implementation, learner evidence/mastery/attempts/diagnostic/remediation state, production SMTP/email provider, a production Supabase project, production deployment and runtime AI.

## Known blockers

None.

## Last accepted implementation commit

CC-03B (corrective): `977257d73401f14914868c434625ed8f418f2514`, pushed to `origin/main`, GitHub Actions CI passed (all four jobs, including the Playwright/auth job).

## Exact next task after CC-04

> **CC-05 — Deterministic Calculation/Question Engine**

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
