# Project Status

**Project:** Adaptive Learning Platform  
**Current phase:** Phase 1 — Architecture & End-to-End Proving Slice  
**Current work package:** WP1.10 — Build the Proving Slice  
**Current implementation stage:** CC-05 — Deterministic Calculation / Question Engine (CC-05A: APPROVED / COMPLETE; CC-05B: APPROVED / COMPLETE; CC-05C: APPROVED / COMPLETE; CC-05D: APPROVED / COMPLETE — governance/QA workflow only; current instructional images remain explicitly NOT approved and require further review/redesign). CC-06 — Governed Lesson Plan Schema & First Canonical Lesson — implementation-complete, review-ready (see §CC-06 below). CC-06B — Deterministic Learner-Specific Lesson Assembly Engine — implementation-complete, review-ready (see §CC-06B below). **Next:** the native, production-quality Lesson Player itself remains unimplemented.  
**Status:** ACTIVE  
**Last updated:** 2026-08-17

## Purpose of this file

This is the **sole authoritative home for live project state**.

Other documents may link here but should not independently maintain copies of the current task, current blocker, exact next task or last accepted implementation checkpoint.

**Governance process note (2026-08-17):** development governance is now explicitly risk-proportionate (Class A/architecture, Class B/feature, Class C/routine-maintenance) — see [`docs/development/DEVELOPMENT-WORKFLOW.md`](docs/development/DEVELOPMENT-WORKFLOW.md#risk-proportionate-governance-change-classes). This changes process ceremony only, not any product/architecture/security control.

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

CC-05D (implementation): `0d17baa33ecde1bf42d5a8700ea703d1f67f0b1e`, pushed to `origin/main`. Two unrelated maintenance commits followed to reach a green CI baseline before closeout — `80213dded44636b0518e12f6f419c13f2c4bef28` (e2e test timing hardening, pre-existing Playwright flake, not CC-05D content) and `c4a5263e0b1e5c7a9e820231a5ab3ab8b191c139` (Expo SDK 57 patch alignment + governed security-exception path sync, upstream dependency drift, not CC-05D content) — see §CC-05D for the full explanation. GitHub Actions CI run [`32058475066`](https://github.com/Dan-Spencer-UK/adaptive-learning-platform/actions/runs/32058475066), the current `origin/main` HEAD, passed fully green (`conclusion: success`) across all four jobs. (CC-05C remains the last accepted *native proving-slice* checkpoint: `942b4ef7acb4c15f95c0e8e1b4dc2a316818d67e`, CI run `31973327168`. CC-05B remains the last accepted *deterministic-engine* checkpoint: `47e4448028cc6a7466140af6e087a328f4f6afc0`, CI run `31952530269`. CC-05A remains the last accepted *pedagogical knowledge structure* checkpoint: `9133c4fc2665114193fa1363baff90e0b25ac5e8`, CI run `31946117054`. CC-04N remains the last accepted *mobile-foundation* implementation checkpoint: `43bf28287374287c63c6b054436771038a1fc456`, CI run `31900574774`. CC-04/04A/04B remains the last accepted *product-domain knowledge-graph* checkpoint: `c67c56746977e3fd78cfa8abb0bb0461806874ce`, CI run `31882580990`. CC-04M's architecture commit is recorded separately above; CC-04M was documentation/comment-only.)

## CC-05 — Deterministic Calculation / Question Engine

**Status:** ACTIVE / CURRENT. CC-05A (pedagogical knowledge structure & blueprint backfill) is **APPROVED / COMPLETE** (Product Owner / Project Architect approval recorded 2026-08-16; implementation commit `9133c4fc2665114193fa1363baff90e0b25ac5e8`, CI run `31946117054` green — see §CC-05A below). CC-05B (deterministic engine, full 84/84 governed blueprint coverage) is **APPROVED / COMPLETE** (Product Owner / Project Architect approval recorded 2026-08-16 — see §CC-05B below). CC-05C (native learner-session integration proving slice, including the CC-05C-DIAGRAM-FIX instructional-imagery correction pass) is **APPROVED / COMPLETE** (Product Owner / Project Architect approval recorded 2026-08-17; implementation commit `942b4ef7acb4c15f95c0e8e1b4dc2a316818d67e`, CI run `31973327168` green — see §CC-05C below). **CC-05C approval is scoped to the proving path only: it does not approve the current proving-slice screens as production learner UX** — see the scope note at the end of §CC-05C. CC-05D (instructional visual governance, semantic QA & human-readable audit) is **APPROVED / COMPLETE** (Product Owner / Project Architect approval recorded 2026-08-17, governance/QA workflow only; implementation commit `0d17baa33ecde1bf42d5a8700ea703d1f67f0b1e`, current `origin/main` CI run `32058475066` green — see §CC-05D below). **CC-05D approval is scoped to the governance/QA workflow only: current instructional images remain explicitly NOT approved as production visual quality, and no real AI/vision semantic review has been run against them** — see §CC-05D for the full qualification. Product/architecture direction for the future learner lesson experience is now durably recorded in [`docs/architecture/LESSON-PLAYER-AND-LESSON-PLAN-ARCHITECTURE.md`](docs/architecture/LESSON-PLAYER-AND-LESSON-PLAN-ARCHITECTURE.md) (documentation only; lesson-player implementation has not started).

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

### CC-05B — Deterministic Calculation / Question Engine (APPROVED / COMPLETE)

**Status:** APPROVED / COMPLETE (Product Owner / Project Architect, 2026-08-16). Includes both the original deterministic-engine proving slice and the CC-05B2 completion pass (36/84 → 84/84 governed executable question blueprints).

CC-05B implements the framework-independent deterministic engine that consumes CC-05A's governed blueprints, entirely inside `packages/calculation-engine` (the package CC-01 reserved for this purpose). A follow-up completion pass (CC-05B2) extended the original 36-blueprint proving subset to **full governed coverage**, using the same, unmodified engine architecture. Full evidence: [`docs/architecture/evidence/CC-05B-DETERMINISTIC-QUESTION-ENGINE.md`](docs/architecture/evidence/CC-05B-DETERMINISTIC-QUESTION-ENGINE.md).

- Deterministic seed derivation (FNV-1a over the full `blueprintId/blueprintVersion/contentRelease/seed` tuple) + mulberry32 PRNG — no `Math.random()`/`Date.now()`/locale/network/DB/process-state anywhere in generation or marking (mechanically proven).
- A generic structured `FormulaExpression` evaluator (all 9 CC-05A operation types, including nested expressions such as `P = I² × R` and `rms = peak / √2`), a generic answer-marking module (`exact`/`numeric_tolerance`/`enum`/`set_equality`/`direction_match`, numeric comparisons never string-based), and generic educational parameter-generation helpers. Unchanged by the CC-05B2 completion pass — every new family is a thin, additive caller of this same machinery.
- Executors for **all 84 governed, learner-assessable question blueprints** in the live CC-05A Unit 202 manifest — the original 36 (Ohm's law, series/parallel resistance, magnetism/electromagnetism) plus 48 added by CC-05B2 (si_units, core_quantities, resistivity, series-vs-parallel comparison, power, energy/efficiency, charge, thermal/chemical effects, conductors/insulators, instrumentation, fault conditions, EMF/generation, AC/DC waveforms) — every one mechanically proven (via `npm run engine:prove`, importing the real CC-05A content) to generate, survive JSON round-trip, grade correct/incorrect answers correctly, reproduce deterministically, and satisfy its declared representation/evidence contracts. **Total governed blueprints: 84. Executable: 84. Unsupported: 0. Failed generation: 0. Failed marking: 0. Representation gaps: 0. Evidence gaps: 0.** The 6 CC-05A `teaching_only` families declare zero question blueprints by design, so there is nothing further to implement.
- Variant-dimension coverage mechanically proven: all 9 governed blueprints with a declared `variantDimensions` entry (11 entries) have every permitted value exercised by a 60-seed sweep (`npm run engine:dimensions`).
- Deterministic, non-rendered diagram/formula/worked-example representation specifications (symbolic labels by default, per CC-05A's `valueEmbedding` policy) and structured evidence emission (`emitEvidence`) for the future CC-07 evidence-engine — CC-05B does not implement mastery/adaptive logic itself.
- Mobile/Hermes proof (re-verified after the completion pass): the native-proof file (`apps/mobile/src/lib/native-proof/engine-proof.ts`) exercises the real engine under `jest-expo` (5/5 steps pass) and is wired into the existing dev-only diagnostics screen so the engine code path is genuinely reachable; `expo export` for both Android and iOS produced real Hermes bytecode (`file` confirms "Hermes JavaScript bytecode, version 98") including the expanded engine. `check:mobile-boundary` and `expo-doctor` (21/21) both still pass.
- 140 automated tests (packages/calculation-engine + scripts/content, all Vitest, up from 110) plus 2 mobile Jest tests — full repository `npm run test:unit` at 230/230 (Vitest) and mobile Jest at 11/11.
- **Not implemented** (CC-05C scope, not started): no diagram/formula renderer, no native lesson UI, no adaptive scheduling, no production sync, no learner-runtime AI.

**Implementation commit / CI**: `47e4448028cc6a7466140af6e087a328f4f6afc0`, pushed to `origin/main`, GitHub Actions CI run [`31952530269`](https://github.com/Dan-Spencer-UK/adaptive-learning-platform/actions/runs/31952530269) passed fully green (`conclusion: success`) across all four jobs, including the two new durable engine-consistency gate steps (`engine:prove:check`, `engine:dimensions:check`, wired into `.github/workflows/ci.yml` immediately after `content:pedagogy:check`), the mobile/boundary/Expo-doctor/Metro-export steps, the web build, and the governed dependency-security gate in NORMAL mode.

### CC-05C — Native Learner-Session Integration Proving Slice (APPROVED / COMPLETE)

**Status:** APPROVED / COMPLETE (Product Owner / Project Architect, 2026-08-17). Includes the CC-05C-DIAGRAM-FIX instructional-imagery correction pass and real interactive Android emulator runtime qualification.

CC-05C proves the governed CC-05A pedagogical model and CC-05B deterministic engine inside the actual native mobile app (`apps/mobile`), end-to-end, for four representative families (Ohm's law, series resistance, parallel resistance, magnetism/electromagnetism) — a proving slice, not the full Unit 202 learner UI. Full evidence: [`docs/architecture/evidence/CC-05C-NATIVE-LEARNER-PROVING-SLICE.md`](docs/architecture/evidence/CC-05C-NATIVE-LEARNER-PROVING-SLICE.md).

- A governed-content-mirror fixture (`apps/mobile/src/lib/proving-content/`) mechanically cross-checked byte-for-byte against the real CC-05A corpus (5/5 tests), since `apps/mobile` must never import content-authoring tooling directly. A thin binding (`lib/proving-engine/`) calls the real, unmodified `@alp/calculation-engine` for all generation/marking/evidence — no calculation logic exists in `apps/mobile`.
- Native `react-native-svg` vector components: a VIR-triangle mnemonic with governed-content-derived tap-to-reveal, symbolic-labels-only series/parallel circuit diagrams (numeric values live in prompt text, never the image), a genuine hand-based right-hand-grip-rule diagram (thumb + curled fingers, distinctly labelled), and a dynamic directional magnetic-force (motor-principle) diagram — both magnetism diagrams withhold their assessed-answer element during assessment, revealed only in teaching contexts, via a documented rendering-layer decision (CC-05B itself is unmodified throughout).
- Structured `FormulaExpression` rendering (fraction bars, superscripts, root signs) with a parallel accessibility description built from the same expression tree, plus deterministic worked substitutions (`I = V / R` → `I = 24 / 6` → `I = 4 A`) sourced from engine-computed data.
- A full lesson (teach the whole formula family together) vs. practice (assess one target per question) distinction, proving design doc §11.
- Local-only question/marking/feedback/evidence loop: zero network round trip; evidence persisted through the existing CC-04N outbox (remains `pending` — no sync target exists yet); session position persisted via the existing `foundation_state` table, with byte-identical instance regeneration on restore proven directly.
- **CC-05C-DIAGRAM-FIX correction pass** (Product Owner manual Android emulator review): corrected two instructional-imagery defects — the right-hand grip rule previously had no hand-based visual (a second, real, engine-supported governed blueprint (`magnetism.interpret_field_direction`) and its diagram blueprint (`magnetic.field_conductor_direction`) were added to the proving fixture and given a genuine hand/thumb/fingers `RightHandGripRuleDiagram`, distinct from the motor-principle force diagram); the series-circuit current-direction arrow pointed perpendicular to its wire rather than along it (fixed via new, unit-tested, direction-derived-from-the-path arrow geometry helpers, `components/diagrams/arc-geometry.ts`). A third defect — a text-label collision only visible on real device render — was found and fixed during this pass's own on-device verification, demonstrating why real-device review remains necessary alongside automated tests.
- 104 mobile Jest tests across 29 suites (up from 11/5 pre-CC-05C; 87/26 before the diagram-fix pass) plus 5 root Vitest tests (235/235 total) — including a full practice-screen integration test driving the real screen component through generate → answer → mark → feedback → evidence → continue → session-complete.
- Android/iOS Metro/Hermes bytecode export re-verified (`file` confirms "Hermes JavaScript bytecode, version 98"); `expo-doctor` 21/21; `check:mobile-boundary` pass. **Real interactive Android emulator runtime evidence now exists**: `npx expo run:android` built and ran the app on a live emulator; the real email-OTP sign-in flow was completed against local Supabase; the Learn → lesson screens were interactively navigated and the corrected diagrams visually confirmed. Physical-device and iOS-environment verification remain **NOT_RUN** — not available in this environment; not fabricated.
- **Not implemented** (explicitly deferred, see evidence doc §17): full 84-blueprint learner UI, real physical-device accessibility/performance verification, pixel-level visual-regression testing, guided/standard support-level distinction, production evidence sync, the real published-content-projection pipeline (CC-06+ scope).

**Implementation commit / CI**: `942b4ef7acb4c15f95c0e8e1b4dc2a316818d67e`, pushed to `origin/main`, GitHub Actions CI run [`31973327168`](https://github.com/Dan-Spencer-UK/adaptive-learning-platform/actions/runs/31973327168) passed fully green (`conclusion: success`) across all four jobs — install/typecheck/lint/unit-test/build (including mobile Jest, `expo-doctor`, Metro bundle validation), dependency security audit (NORMAL mode), Supabase local database (migrations/pgTAP/generated-type diff), and Playwright smoke tests.

**Scope note — proving UI is not production UX**: CC-05C approval confirms the native proving slice successfully demonstrates the required technical/pedagogical path end-to-end (governed content → deterministic engine → native rendering → interaction → marking → evidence), including on real Android emulator hardware. It does **not** constitute approval of the current proving-slice screens as production learner UX. The `learn`/`dev-proving-visuals` screens are engineering/proving surfaces built for technical demonstration, not designed against `MOBILE-UX-ENGINEERING-STANDARD.md` or `docs/product` UX specification. Any future commercial learner UI must be designed deliberately against the approved product/mobile UX architecture, not produced by incrementally polishing this proving UI.

### CC-05D — Instructional Visual Governance, Semantic QA & Human-Readable Audit (APPROVED / COMPLETE — governance/QA workflow only)

**Status:** **APPROVED / COMPLETE** — the governance/QA workflow and architecture (Product Owner / Project Architect, 2026-08-17), following a required truthfulness correction to the HTML report (see below). **Explicitly NOT approved as part of this closeout**: visual/pedagogical quality of the current instructional images; real AI/vision semantic approval of any image (none has been run); completeness of renderer coverage for every governed diagram blueprint; native pixel-level visual regression; production learner-facing visual design. The current diagrams are proving content and must not become accidental production visual-design precedent merely because the governance workflow is approved.

CC-05D makes instructional visuals first-class governed pedagogical artefacts and builds a scalable, mostly-automated, human-escalating QA pipeline for them — a gap CC-05C's own Product Owner review exposed twice (a wrong teaching visual; a current-direction arrow pointing perpendicular to its wire) and a real-device correction pass found a third time (a text-label collision no structural test could see). Durable design: [`docs/architecture/CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-AND-SEMANTIC-QA.md`](docs/architecture/CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-AND-SEMANTIC-QA.md). Full evidence: [`docs/architecture/evidence/CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-EVIDENCE.md`](docs/architecture/evidence/CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-EVIDENCE.md).

**Truthfulness correction (required before approval)**: Product Owner review of the generated HTML catalogue (`reports/instructional-visuals/index.html`) found that a mock-pipeline semantic result ("semantic: PASS (high)") could be mistaken for a real AI/vision review. Corrected so every card, every summary statistic, and two top-of-page banners now unambiguously distinguish **SIMULATED SEMANTIC** (mock pipeline, not a real review — currently all 18 results) from **REAL AI REVIEW** (currently 0 — not yet run) from unreviewed, driven by a single source-of-truth classifier (`isSimulatedReviewerIdentity`) never inferred from a label. The mock pipeline itself was preserved as valid implementation evidence, not discarded.

**Current instructional-visual quality — explicit open requirement, carried forward, not solved here**: Product Owner manual review of the HTML catalogue found the current imagery below the required eventual product standard. Future visual work must address pedagogical fidelity, visual clarity, professional illustration quality, label placement, arrow/direction clarity, appropriate teaching-aid choice, visual hierarchy, accessibility, consistency, native mobile legibility and overall polish "appropriate to a premium learning product" — substantially above the current proving-slice diagrams. **This is not addressed by CC-05D and remains open.**

- A governed `VisualSemanticContract` schema (`packages/content-schema/src/visual-governance.ts`) sitting beside, not modifying, CC-05A's `DiagramBlueprint` — 4 real contracts, one per diagram blueprint with an actual `apps/mobile` renderer (100% of the governed pilot set), every reference cross-checked against the live CC-05A corpus.
- 18 deterministic canonical semantic variants (every pedagogically distinct parameter/mode combination, never arbitrary numeric permutations), each rendered to a real, standalone, openable SVG artefact derived from the component's actual computed `react-native-svg` element tree — not JSX source (`apps/mobile/src/lib/visual-governance/`, run via `npm run visuals:render`).
- Mechanical QA (`npm run visuals:check` / `visuals:check:strict`, wired into CI immediately after `engine:dimensions:check`) plus an independent geometry check operating on the **actual rendered SVG bytes** that reproduces and would catch the exact CC-05C-DIAGRAM-FIX current-arrow defect class (proven against a synthetic reproduction of that defect, and against the real, currently-correct rendered artefacts: 3/3 arrows checked, 0 failures).
- A two-pass (blind observation → semantic verification) AI-vision QA architecture with a provider boundary, a fully-tested deterministic mock provider (exercised end-to-end: 18/18 reviewed, cache-hit-on-rerun proven), and an honestly-not-yet-wired Anthropic-vision provider scaffold — no live semantic review was run (no credential available, and Anthropic's API requires raster images this pipeline's SVG output isn't yet converted to; see the evidence doc §5 for exactly what remains).
- Hash-bound audit caching/staleness, deterministic human-review sampling (reusing `@alp/calculation-engine`'s own PRNG), and a hash-bound human-review CLI (`npm run visuals:review:record`) that never requires a reviewer to type a hash by hand.
- A self-contained, filterable HTML audit report (`reports/instructional-visuals/index.html`, `npm run visuals:report`) plus machine-readable JSON evidence, generated from canonical data, never hand-edited.
- 106 new root Vitest tests (341/341 total, up from 235) and 15 new mobile Jest tests (119/119 total across 31 suites, up from 104/29) — all existing CC-05A/B/C gates (`content:pedagogy:check`, `engine:prove:check`, `engine:dimensions:check`, `check:mobile-boundary`, `security:audit`, `expo-doctor` 21/21, Metro/Hermes export) remain green and unmodified. **No new npm dependency was added; no new security advisory was introduced.**
- **Not implemented** (explicitly deferred, see evidence doc §9): a live Anthropic semantic review (credential + SVG-rasterisation both absent — real AI visual approval of the current images has NOT occurred); renderers for the 3 governed diagram blueprints with no mobile component yet (`circuit.series_parallel_mixed`, `graph.waveform_sine`, `instrument.measurement_connection` — a pre-existing, tracked, non-fatal gap, explicitly out of CC-05D's scope, still lacking renderers); a CI-wired gate that validates the *committed* rendered-evidence artefacts are current (the mechanical gate that *is* CI-wired needs no rendered artefacts and is fully deterministic); true pixel-level native visual-regression testing (as already deferred in CC-05C's own evidence doc).

**Implementation commit / CI**: `0d17baa33ecde1bf42d5a8700ea703d1f67f0b1e` ("feat: establish CC-05D instructional visual governance"), pushed to `origin/main`. That commit's own CI run failed on an unrelated pre-existing Playwright timing issue in the returning-learner e2e test (fixed forward, not part of CC-05D, commit `80213dded44636b0518e12f6f419c13f2c4bef28`), which in turn surfaced an unrelated upstream Expo SDK 57 patch-version drift blocking `expo-doctor` (fixed forward, also not part of CC-05D, commit `c4a5263e0b1e5c7a9e820231a5ab3ab8b191c139`, including a narrow, non-broadening path-identity update to the pre-existing accepted `SEC-EXC-001`/`SEC-EXC-002` security exceptions caused directly by that Expo bump). GitHub Actions CI run [`32058475066`](https://github.com/Dan-Spencer-UK/adaptive-learning-platform/actions/runs/32058475066) — the current `origin/main` HEAD at closeout, including CC-05D unchanged since `0d17baa` — passed fully green (`conclusion: success`) across all four jobs, including the new `visuals:check:strict` gate, mobile Jest, `expo-doctor` 21/21, Metro/Hermes export (Android + iOS, both confirmed real Hermes bytecode v98), and the full 7/7 Playwright suite.

## CC-06 — Governed Lesson Plan Schema & First Canonical Lesson (implementation-complete, review-ready)

Implements ARCH-003 ([`docs/architecture/LESSON-PLAYER-AND-LESSON-PLAN-ARCHITECTURE.md`](docs/architecture/LESSON-PLAYER-AND-LESSON-PLAN-ARCHITECTURE.md)) as a governed, machine-readable content model — the orchestration layer above CC-05's pedagogical chain — plus one complete canonical lesson proving it against real content. This is Class B under the risk-proportionate governance model ([`docs/development/DEVELOPMENT-WORKFLOW.md`](docs/development/DEVELOPMENT-WORKFLOW.md)).

- `LessonPlan`/`LessonStep` Zod schema (`packages/content-schema/src/lesson-plan.ts`) sitting above, never duplicating, the governed pedagogical chain (assertion family → capability → teaching representation → question blueprint → evidence) — every reference field is a stable id into the real CC-05A/CC-04 corpus, never restated content. Structural integrity (duplicate step ids, branch-target existence, no self-loops, completion-criteria step references) enforced by the schema's own `superRefine`, mirroring `pedagogy.ts`'s established pattern.
- One canonical lesson, **Ohm's Law** (`lesson.electrical.ohms-law`), 16 pedagogically meaningful steps referencing real governed ids throughout: `electrical.ohms_law`'s full capability set, `formula.ohms_law`, the VIR-triangle mnemonic, all 3 worked-example blueprints, 8 of the family's 10 real question blueprints (all except `ohms_law.substitution` and `ohms_law.diagnose_unrelated_symbols`), and 3 real governed misconceptions (`MIS-EL-OHM-WRONG-OPERATION-001`, `MIS-EL-OHM-REARRANGE-ERROR-001`, `MIS-EL-OHM-UNRELATED-SYMBOLS-001`) — two actively discriminated-for with explicit branch routes to one shared, explicitly-modelled remediation step (not a vague `remediate: true`), which itself routes back into the main sequence once cleared. DO → RESPOND → FEEDBACK → NEXT throughout, not READ → READ → READ → QUIZ.
- Mechanical cross-reference validation (`npm run lesson:validate` / `lesson:validate:check`, `scripts/content/validate-lesson-plan.ts`) — independently re-derives every reference against the live corpus (never trusts the lesson's own claim), plus policy checks: assessable steps missing a question-blueprint reference, unreachable conditional steps, circular remediation routes, lessons with no exit step. Current corpus: 0 findings across every gate.
- Human-readable Markdown review (`npm run lesson:review`, `scripts/content/evidence/lesson-plan-review.md`) — every governed id resolved to its real statement/description so a Product Owner can review instructional design without cross-referencing ids by hand.
- 30 new tests (schema + validation script), full root Vitest suite 384/384, `content:pedagogy:check` unaffected and green, typecheck/lint clean.
- **Not implemented** (explicitly deferred to the next package): the learner-specific adaptive lesson assembler (ARCH-003 §6 — deterministic evidence-based step selection); the production native Lesson Player; any mastery-algorithm or evidence-engine change; Review/Reference-mode UI (the schema supports the distinction; no UI exists yet). The current CC-05D visual-governance status is unchanged by this package — current instructional images remain explicitly NOT approved as production quality.

## CC-06B — Deterministic Learner-Specific Lesson Assembly Engine (implementation-complete, review-ready; scalability-corrected)

Implements ARCH-003 §6/§7's learner-specific adaptive assembler — turns a canonical CC-06 `LessonPlan` plus a normalized learner-evidence snapshot into a deterministic, learner-specific `LessonInstance` (which governed steps this learner receives, and why). Pure selection/orchestration of already-governed content: no LLM calls, no invented questions, no new instructional facts, no network, no clock/RNG dependency. Class B under the risk-proportionate governance model ([`docs/development/DEVELOPMENT-WORKFLOW.md`](docs/development/DEVELOPMENT-WORKFLOW.md)). The initial implementation was approved in overall architecture, then given a bounded correction (still Class B) before the native Lesson Player begins, addressing two issues that would have become expensive at scale — both described below.

- **Package home:** `packages/learning-engine` — this fills in that package's own CC-01-reserved scope ("lesson sequencing, remediation/return flow and next-activity selection ... from CC-06 onward"), rather than creating a new package or overloading `evidence-engine`/`diagnostic-engine` (both remain untouched, reserved for CC-07/CC-08).
- **Evidence vocabulary:** adopts WP1.3's approved mastery-state model verbatim (`docs/research/phase-1/PHASE-1-WP1.3-LEARNER-EVIDENCE-AND-MASTERY-ARCHITECTURE.md`) — `MasteryState` = `NOT_ASSESSED | INSUFFICIENT_EVIDENCE | EMERGING | PROVISIONALLY_SECURE | TRANSFER_SECURE | WEAK | CONFLICTING` — the first TypeScript encoding of that already-approved vocabulary, not a second mastery model. `NOT_ASSESSED`/`INSUFFICIENT_EVIDENCE`/`EMERGING` never gate teaching (WP1.3 §39.1); only `WEAK`/`CONFLICTING` prerequisite evidence triggers mandatory prerequisite remediation.
- **Durable deterministic identity** (`packages/learning-engine/src/identity.ts`): same lesson id/version/content release/assembly-policy version/evidence digest ⇒ same `instanceId`, independent of Map/Set/object key ordering. **Corrected:** now full SHA-256 via `@noble/hashes` (audited, zero-dependency, pure JS/TS, synchronous, Hermes/React-Native-safe — deliberately not `expo-crypto`, which is async and would tie this framework-independent package to Expo), formatted `li1_<64-hex-char digest>` (the `li1` prefix versions the identity format for future migration). Originally 32-bit FNV-1a/8-hex-chars — too small a collision-resistance budget for a durable identity meant to serve potentially millions of learner lesson instances across session restoration, offline persistence, evidence association and audit (FNV-1a remains correctly used elsewhere, purely for deterministic PRNG seeding — `packages/calculation-engine/src/seed.ts`). `evidenceDigest` was upgraded the same way, since it is itself an input to `instanceId` and would otherwise silently bottleneck the outer hash's collision resistance.
- **Pre-session assembly** (`assembleLessonInstance`, `assembler.ts`) vs **within-session branching** (`resolveWithinSessionBranch`, `branching.ts`) are deliberately separate functions (ARCH-003 §16/§17): an assembled instance stays stable for the session; a governed branch trigger resolves exactly one destination step at a time using the lesson's own `branchRoutes`, never a silent whole-lesson reassembly. A wrong answer alone never triggers misconception remediation — only an evidenced match on the specific governed misconception id.
- **Prerequisite-remediation resolution** (`prerequisite-resolution.ts`) — **corrected.** The original rule ("at most one lesson per content release may target a given assertion family") was too restrictive at scale: many ordinary lessons (an introduction, a refresher, exam revision, retrieval practice, vocational transfer practice, ...) must be free to share the same target family with zero ambiguity. That invariant has been removed entirely, not renamed. `targetAssertionFamilyIds` now carries no uniqueness constraint at all. In its place, `@alp/content-schema`'s `LessonPlan` gained a new, separate, opt-in `remediationEligibility: { assertionFamilyId, isDefaultRemediation }[]` field — semantic metadata a lesson declares on itself ("I am eligible to remediate family X"), not a brittle pointer stored elsewhere. Resolution: **zero** eligible lessons for a family ⇒ `prerequisite_unresolved`; **exactly one** ⇒ resolved to it regardless of any default flag; **more than one** ⇒ resolved only if exactly one is marked `isDefaultRemediation` for that family, otherwise `AmbiguousPrerequisiteCandidatesError` is thrown (never a first-match guess). Enforced mechanically at content-authoring time by a rebuilt `ambiguousRemediationCandidates` gate in `scripts/content/validate-lesson-plan.ts` (replacing the removed `ambiguousPrimaryFamilyTargets`), which flags only genuine remediation ambiguity (two defaults, or two-plus eligible with no default) — ordinary multi-lesson family overlap is explicitly not a finding. `resolvePrerequisiteCandidate` also explicitly filters candidates by the target lesson's own `contentRelease` in its own filter predicate (mechanically verified, not merely assumed of the caller); `AssemblyContext` was already confirmed to carry no separate `contentRelease` field, so no dual-source-of-truth existed to begin with.
- **Real vs synthetic proof, kept honestly separate** (task brief §20): `packages/learning-engine`'s own unit tests (`identity.test.ts`, `prerequisite-resolution.test.ts`, `assembler.test.ts`, `branching.test.ts`, 54 tests) use only local synthetic fixtures (`test-fixtures.ts`) — an engine package's own tests never import `scripts/content/data` (established convention, mirrors `packages/calculation-engine/src/families/new-families.test.ts`). Real-content proof lives separately in `scripts/content/prove-lesson-assembly.ts` (`npm run lesson:assembly:prove` / `:check`, 5 tests), which imports both the real engine and the real `lesson.electrical.ohms-law` content to prove all 7 representative scenarios from task brief §19: **A** (new learner), **C**/**D** (the two real governed misconceptions, within-session routing to the shared remediation step and back), **G** (same-input replay) are proven against real content; **E** (prerequisite weakness) is proven against real content for the "zero candidates ⇒ unresolved" half and a small synthetic remediation lesson (now correctly declaring `remediationEligibility`) for the "resolves to an actual remediation lesson" half; **B** (skip-if-mastered) and **F** (retrieval due) are synthetic-only, since the real Ohm's Law lesson has no `conditional_skip_if_mastered` step and its `retrieval_check` is deliberately unconditional distributed practice, not spaced/conditional retrieval — the real lesson was not distorted to manufacture either mechanism.
- **Real-content gap, recorded honestly:** no governed lesson yet targets any of the real lesson's 5 prerequisite families, and the real lesson has no skip-if-mastered or conditional-retrieval step — the assembly *mechanism* is fully proven (including against real content wherever the real lesson can exercise it), but full real-content coverage of every adaptive pathway will only exist once more governed lessons are authored.
- Human-readable assembly review (`npm run lesson:assembly:review`, `scripts/content/evidence/lesson-assembly-review.md`) — per-step INCLUDED/OMITTED decisions with reasons for every representative scenario, with REAL and SYNTHETIC content explicitly labelled throughout so a reviewer can never mistake one for the other.
- `packages/learning-engine` now carries 54 tests (up from 46), plus new coverage in `@alp/content-schema`'s `lesson-plan.test.ts` and `scripts/content/validate-lesson-plan.test.ts` for the new `remediationEligibility` schema field and gate — 13 net new tests from this correction. Full root Vitest suite **450/450** (up from 437), `lesson:validate:check`/`lesson:assembly:prove:check`/`content:pedagogy:check` all green, typecheck/lint clean across the whole repo.
- **Not implemented** (explicitly out of scope for this package): the production native Lesson Player; any UI/screens; Supabase persistence or fetching of lesson instances; a spaced-retrieval scheduler (the assembler only decides *how* a retrieval-check step participates once told it is due — it does not decide *when* something becomes due); any mastery-model or evidence-engine redesign; runtime AI of any kind.
- **Scalability assessment:** with both corrections applied, Package B's contract (governed remediation-eligibility metadata rather than a global target-family uniqueness constraint; a durable SHA-256-based instance identity) is considered a stable, scalable foundation for the native Lesson Player to build on.

**Next package**: the native, production-quality Lesson Player itself — not started.

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
