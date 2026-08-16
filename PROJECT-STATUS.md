# Project Status

**Project:** Adaptive Learning Platform  
**Current phase:** Phase 1 — Architecture & End-to-End Proving Slice  
**Current work package:** WP1.10 — Build the Proving Slice  
**Current implementation stage:** CC-05 — Deterministic Calculation / Question Engine (sub-package CC-05A: APPROVED / COMPLETE; CC-05B next, NOT STARTED)  
**Status:** ACTIVE  
**Last updated:** 2026-08-16

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
10. Native iOS/Android are the primary learner platforms; web is secondary. WCAG 2.2 AA is a minimum accessibility requirement on every platform.
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

## CC-04 — Minimum Ohm's-Law Knowledge Graph

**Status:** COMPLETE / APPROVED

CC-04, corrected and expanded through CC-04A (real City & Guilds 2365-02 curriculum grounding and genuine external provenance) and CC-04B (vocational-corpus expansion and source-governance tightening), populated the CC-02 governed schema with a curriculum-grounded proving-slice knowledge graph: City & Guilds Level 2 Diploma in Electrical Installations (2365-02), Qualification Handbook Version 1.12 (April 2026), Unit 202 — Principles of Electrical Science, spanning Learning Outcomes 1, 2, 3, 4 and 5. The corpus contains 176 assertions (146 Electrical, plus 30 reusable Foundational Maths/Physics assertions retained as horizontal knowledge even where not yet consumed by the Electrical slice), 268 assertion relationships spanning six qualitatively distinct diagnostic root-cause paths, 166 curriculum mappings, 20 misconceptions with 44 conflict links, and 288 provenance links to genuinely external, rights-classified sources (BIPM SI Brochure, UK DfE GCSE Maths subject content, OpenStax University Physics Vols 1–2, and the City & Guilds handbook as a cited proprietary reference — no assertion relies solely on internal `ORIGINAL` provenance). Content is authored as validated manifests (`@alp/content-schema`) and deterministically compiled to idempotent seed SQL. Graph health (zero cycles, zero duplicate/self/broken edges, zero unmapped Electrical assertions, zero approved-without-provenance assertions) and the full corpus are mechanically proven by 41 pgTAP assertions (`supabase/tests/database/10_unit202_knowledge_graph.sql`) plus schema-level tests, all under the same deny-by-default RLS/grant posture as every other governed table.

**Approved CC-04/04A/04B implementation commit:** `c67c56746977e3fd78cfa8abb0bb0461806874ce`, pushed to `origin/main`. GitHub Actions CI run `31882580990` passed fully green (`conclusion: success`) across all four jobs — install/typecheck/lint/unit-test/build, dependency security audit, Supabase local database (migrations, pgTAP, generated-type diff), and Playwright smoke tests (end-to-end + accessibility) against local Supabase Auth.

## CC-04M — Mobile-Native-First Architecture Transition

**Status:** COMPLETE / APPROVED

CC-04M was a **governance/evaluation stage**, not an implementation stage. It corrected durable product-principle/architecture documentation to state native iOS/Android are primary and web is secondary, then produced and formally accepted the mobile-native technology decision and its supporting architecture (refined through a bounded correction pass, CC-04M-C, before final approval):

- [`docs/architecture/adr/ADR-0001-mobile-client-technology.md`](docs/architecture/adr/ADR-0001-mobile-client-technology.md) — **status: accepted**. Decision: **Expo + React Native** (New Architecture), with alternatives (Flutter, Kotlin/Compose Multiplatform, separate native) evaluated and rejected primarily on TypeScript domain-engine reuse, offline-storage maturity, and managed release-pipeline completeness.
- [`docs/architecture/MOBILE-ARCHITECTURE.md`](docs/architecture/MOBILE-ARCHITECTURE.md) — **status: approved**. Target client/backend topology, offline/content-sync architecture, auth/session/lifecycle/push/observability architecture, security integration, testing/build/release architecture, CC-05 constraints, and implementation sequencing.
- [`docs/product/MOBILE-UX-ENGINEERING-STANDARD.md`](docs/product/MOBILE-UX-ENGINEERING-STANDARD.md) — **status: approved**. The durable native UX quality bar (responsiveness, motion, haptics, accessibility, low-end-Android performance).
- [`docs/architecture/evidence/CC-04M-STALE-ASSUMPTION-AUDIT.md`](docs/architecture/evidence/CC-04M-STALE-ASSUMPTION-AUDIT.md) — repository-wide audit for durable statements assuming web is the sole/primary learner client; 47 findings classified, 11 corrected, 0 unresolved contradictions, 0 remaining STALE_UPDATE after a second pass.

**Approved CC-04M architecture commit:** `3d9c370ee001dc80924cc259bbbd809ef70e018f`, pushed to `origin/main`. GitHub Actions CI run `31888986084` passed fully green (`conclusion: success`) across all four jobs — install/typecheck/lint/unit-test/build, dependency security audit, Supabase local database (migrations, pgTAP, generated-type diff), and Playwright smoke tests (end-to-end + accessibility) against local Supabase Auth.

No mobile app, dependency, or app-store/signing credential was created as part of CC-04M; it remained documentation/comment-only throughout.

## CC-04N — Mobile Foundation Implementation

**Status:** COMPLETE / APPROVED

CC-04N is the first real mobile **implementation** task, building on the CC-04M architecture. Full evidence: [`docs/architecture/evidence/CC-04N-MOBILE-FOUNDATION-EVIDENCE.md`](docs/architecture/evidence/CC-04N-MOBILE-FOUNDATION-EVIDENCE.md) (implementation) and [`docs/architecture/evidence/CC-04N-IMPLEMENTATION-CONSISTENCY-AUDIT.md`](docs/architecture/evidence/CC-04N-IMPLEMENTATION-CONSISTENCY-AUDIT.md) (staleness follow-up).

**Approved CC-04N implementation commit:** `43bf28287374287c63c6b054436771038a1fc456`, pushed to `origin/main`. GitHub Actions CI run [`31900574774`](https://github.com/Dan-Spencer-UK/adaptive-learning-platform/actions/runs/31900574774) passed fully green (`conclusion: success`) across all four jobs — install/typecheck/lint/unit-test/build (including the new mobile boundary check, mobile Jest tests, `expo-doctor`, and Metro bundle validation for both platforms), dependency security audit (`npm run security:audit`, NORMAL mode — the governed gate, not review mode), Supabase local database (migrations, pgTAP, generated-type diff), and Playwright smoke tests (end-to-end + accessibility) against local Supabase Auth.

**What was established/proven** (see the evidence document for exact detail on which tier each result belongs to):

- `apps/mobile` exists (Expo `57.0.13` / React Native `0.86.2`, New Architecture and Hermes mandatory by default at this SDK, Expo Router navigation);
- monorepo/workspace integration alongside `apps/web`, one root lockfile, zero Metro customisation needed;
- the shared framework-independent TypeScript packages (`@alp/domain`, `@alp/calculation-engine`, `@alp/evidence-engine`, `@alp/diagnostic-engine`, `@alp/learning-engine`, `@alp/content-schema`) resolve and execute under the RN/Jest pipeline, **and** the whole app (1823/1735 modules) compiles to real Hermes bytecode via Metro (`file` confirms "Hermes JavaScript bytecode, version 98" on the exported Android/iOS bundles) — genuine on-device Hermes *execution* remains PENDING (no device/emulator in this environment);
- a native Supabase auth/session foundation using `LargeSecureStore` (Supabase's own documented Expo/RN pattern: AES-256 key in `expo-secure-store`, encrypted session in AsyncStorage) — not cookies, not bespoke cryptography;
- an Expo SQLite / local-persistence foundation with `PRAGMA user_version` schema versioning and a pending→synced outbox state machine, proven at the logic level (the real native SQLite binding was mechanically confirmed unavailable under Jest in this environment — `NativeDatabase is not a constructor` — so a clearly-labelled in-memory mock provides logic-level coverage; real on-device persistence remains PENDING);
- basic native navigation (`Stack.Protected` auth boundary), a sign-in/home/dev-diagnostics shell respecting native accessibility basics;
- CI extended with mobile boundary/Jest/expo-doctor/Metro-bundle-validation steps (fast tier only — no native cloud build added to every commit, per cost/economics guidance); `eas.json` build profiles created, no EAS account/credentials (external prerequisite);
- performance instrumentation harness built and exercised on dev-machine timings only; low-end-Android and iOS physical-device performance are explicitly **PENDING PRODUCT OWNER DEVICE QUALIFICATION** (not waived, not substituted with a flagship emulator).

**Security risk acceptance (resolved 2026-08-15)**: implementing this surfaced two genuine HIGH-severity dependency advisories (`image-size`, transitive via Expo/Metro's own toolchain, GHSA-w3rx-r6r6-pgpr and GHSA-5p2g-fcmc-qvqq) that `npm audit fix --force` can only resolve by downgrading React Native to `0.72.17` (rejected — violates ADR-0001). CC-04N-S (bounded security correction pass, 2026-08-15) confirmed **no patched image-size release exists at all** for either advisory (both GHSA records list "Patched versions: None"), and implemented a governed, tested audit-gate script (`scripts/security/check-npm-audit.mjs`, `scripts/security/npm-audit-exceptions.json`) that independently re-derives the actual dependency path from `npm ls` on every run (path drift or an additional unexpected path both fail the gate). CC-04N-S1 (hardening pass, same day) split this into two explicit modes: `npm run security:audit` (NORMAL mode, the only mode CI ever calls) permits **only `status: "accepted"`** exceptions; `npm run security:audit:review` (REVIEW mode, never used by CI) permits proposed exceptions to prove they would work once accepted. On 2026-08-15, Product Owner / Project Architect **explicitly accepted** both `SEC-EXC-001` and `SEC-EXC-002` through **2026-09-14** (not extended) — see `SECURITY-VERIFICATION-MATRIX.md` SEC-M-006b. `npm run security:audit` (NORMAL mode) now PASSES. **The underlying vulnerability itself is not resolved** — `image-size@1.2.1` is unchanged and raw `npm audit --json` remains fully unfiltered; only the risk-acceptance decision is resolved, and only for these two exact advisory/package/version/path tuples until 2026-09-14.

Explicitly **not** in scope for CC-04N (and not implemented): the CC-05 deterministic calculation/question engine; production learner lessons; adaptive diagnosis; the production published-content projection; full production sync; broad product feature work.

**Truthfully deferred qualification items** (not waived, not fabricated, tracked for whoever next has the hardware/account access):
- Low-end Android physical-device build and performance: **PENDING PRODUCT OWNER DEVICE QUALIFICATION**.
- iOS physical-device/simulator build and performance: **PENDING** — requires Apple hardware and an EAS account (external prerequisite, not created as part of CC-04N).
- On-device/emulator Hermes execution (Tier 2c): **NOT_RUN** — no Android SDK/emulator/device or macOS/Xcode exists in this environment; Metro/Hermes bytecode compilation (Tier 2b) is proven instead, which is real but distinct evidence.
- Native E2E (Maestro): tool selected, not installed/run — no device to validate against yet.

## Known blockers

None currently open. The former CC-04N security-risk-acceptance blocker was resolved on 2026-08-15 when Product Owner / Project Architect explicitly accepted `SEC-EXC-001`/`SEC-EXC-002` through 2026-09-14 (see `SECURITY-VERIFICATION-MATRIX.md` SEC-M-006b), and the implementation commit's CI (run `31900574774`) passed fully green, including the security gate in NORMAL mode.

## Mandatory future review trigger

- **2026-09-14 — accepted security-exception expiry**: `SEC-EXC-001` and `SEC-EXC-002` (`image-size` HIGH-severity advisories, `scripts/security/npm-audit-exceptions.json`) expire on this date and are not auto-renewed. `npm run security:audit` (NORMAL mode, what CI runs) will automatically fail again once expired, an upstream patch changes the dependency tree, or the dependency path drifts. Requires a fresh, explicit Product Owner / Project Architect risk-acceptance decision (or an upstream fix, or a directed alternative) at or before that date — see `SECURITY-VERIFICATION-MATRIX.md` SEC-M-006b.

## Last accepted implementation commit

CC-05A (implementation): `9133c4fc2665114193fa1363baff90e0b25ac5e8`, pushed to `origin/main`, GitHub Actions CI run `31946117054` passed (all four jobs, including the new `content:pedagogy:check` gate and the governed security gate in NORMAL mode). (CC-04N remains the last accepted *mobile-foundation* implementation checkpoint: `43bf28287374287c63c6b054436771038a1fc456`, CI run `31900574774`. CC-04/04A/04B remains the last accepted *product-domain knowledge-graph* checkpoint: `c67c56746977e3fd78cfa8abb0bb0461806874ce`, CI run `31882580990`. CC-04M's architecture commit is recorded separately above; CC-04M was documentation/comment-only.)

## CC-05 — Deterministic Calculation / Question Engine

**Status:** ACTIVE / CURRENT. CC-05A (pedagogical knowledge structure & blueprint backfill) is **APPROVED / COMPLETE** (Product Owner / Project Architect approval recorded 2026-08-16; implementation commit `9133c4fc2665114193fa1363baff90e0b25ac5e8`, CI run `31946117054` green — see §CC-05A below for full detail). CC-05B (deterministic engine) is the next authorised sub-package and has **NOT STARTED**. CC-05C (native integration) has **NOT STARTED**.

CC-05 follows CC-04N now that the mobile foundation is proven, per `MOBILE-ARCHITECTURE.md` §Implementation sequencing and its CC-05 constraints (§9). See [`docs/roadmap/ROADMAP.md`](docs/roadmap/ROADMAP.md) for the full WP1.10 implementation sequence.

**Bounded purpose**: a deterministic calculation/question engine — question presentation, numerical/formula answer marking, tolerance/unit handling, and distractor/misconception-aware evaluation for the existing Unit 202 knowledge graph — with zero runtime AI dependency, consistent with product invariant 8.

**Inherited constraints** (from `MOBILE-ARCHITECTURE.md` §9, binding on CC-05 because native mobile is the primary learner platform):
- Framework-independent TypeScript — no React/Next.js/DOM dependency in the engine core.
- No Node-only runtime dependency anywhere the engine must run on-device.
- Hermes-compatible (the engine must be loadable and executable under the same Metro/Hermes pipeline `apps/mobile` already proves, not just under Node/Vitest).
- Deterministic: identical inputs (including any random-seed input) produce identical outputs regardless of which client/runtime calls it.
- Inputs and outputs must be serialisable plain data — no client-runtime-specific objects.
- No assumption of round-trip server latency inside the engine's own logic — must be safely callable from an offline mobile session.
- Question/evidence outputs must be compatible with the versioned published-content model, attributable to a specific content-release version.
- No mobile-UI logic, native navigation, or presentation concerns belong inside the engine — it produces data, not screens.

**Explicitly not implemented by this governance entry**: no learner-facing questions, formula parsing, numerical marking, tolerance/unit rules, distractors, misconception diagnosis, lessons, published-content projection, or production sync. Implementation begins only once Product Owner / Project Architect issues a bounded CC-05 implementation task brief.

### CC-05A — Pedagogical Knowledge Structure & Blueprint Backfill

**Status:** APPROVED / COMPLETE (Product Owner / Project Architect, 2026-08-16).

CC-05A adds a governed pedagogical layer between the existing CC-04/CC-04A/CC-04B Unit 202 corpus and the future CC-05B engine, per the approved [`CC-05-PEDAGOGICAL-KNOWLEDGE-AND-QUESTION-ARCHITECTURE.md`](docs/architecture/CC-05-PEDAGOGICAL-KNOWLEDGE-AND-QUESTION-ARCHITECTURE.md) design. Full evidence: [`docs/architecture/evidence/CC-05A-PEDAGOGICAL-BLUEPRINT-BACKFILL.md`](docs/architecture/evidence/CC-05A-PEDAGOGICAL-BLUEPRINT-BACKFILL.md).

- New schema: `packages/content-schema/src/pedagogy.ts` (`AssertionFamily`, `Capability`, `FormulaFamily`, `DiagramBlueprint`, `QuestionBlueprint` and 12 further governed content types).
- New content: `scripts/content/data/cc05a-pedagogy-unit202.ts` — a one-time backfill of the existing 176-assertion corpus into 23 assertion families (17 assessable, 6 explicitly teaching-only with documented reasons), 9 formula families, 7 diagram blueprints, and 84 pedagogically exhaustive, normalised question blueprints. **176/176 assertions classified** (172 with family membership, 4 explicitly standalone).
- Mechanical gate `npm run content:pedagogy:check` (`scripts/content/validate-pedagogy.ts`) is wired into CI (`.github/workflows/ci.yml`) and independently recomputes coverage from the live corpus + pedagogy manifests on every commit. **0 mechanical coverage gaps**: unclassified learner assertions, formula families missing required forms, unresolved required diagram references, assessable families with zero question blueprints, required capabilities without assessment coverage.
- **No assertion wording, provenance, rights, curriculum mapping, relationship or identifier in the CC-04 corpus was modified** — mechanically confirmed (zero diff in `cc04-unit202-electrical-science.ts`) and test-asserted.
- **Not implemented** (CC-05B/C scope, not started): no runtime question-generation engine, no deterministic PRNG, no formula calculation engine, no marking engine, no diagram/formula renderer, no native learner-facing integration/UI, no adaptive diagnosis.

**Implementation commit / CI**: `9133c4fc2665114193fa1363baff90e0b25ac5e8`, pushed to `origin/main`, GitHub Actions CI run [`31946117054`](https://github.com/Dan-Spencer-UK/adaptive-learning-platform/actions/runs/31946117054) passed fully green (`conclusion: success`) across all four jobs, including the new `content:pedagogy:check` gate step and the governed dependency-security gate in NORMAL mode.

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
