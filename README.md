# Adaptive Learning Platform

A governed adaptive vocational-learning platform designed to identify not only **what** a learner gets wrong, but **why**, then teach the smallest useful missing foundation and verify transfer back into the vocational context.

Initial market: **UK vocational education**. First full vertical: **Electrical**. Reusable horizontal domains begin with **Foundational Maths** and **Foundational Physics**.

The initial learner product has **no runtime AI dependency**. Teaching, question generation, marking, evidence updates, diagnosis, remediation, retesting and progression are deterministic and governed. AI is used for development and content production/verification. A future premium AI tutor may be added without becoming the core marking/mastery/diagnostic engine.

## Current state

See [`PROJECT-STATUS.md`](PROJECT-STATUS.md). It is the sole authoritative home for the current task, blockers and exact next task.

## Start here

A new human developer or AI coding agent should read:

1. [`docs/START-HERE.md`](docs/START-HERE.md)
2. [`PROJECT-STATUS.md`](PROJECT-STATUS.md)
3. only the task-relevant authoritative documents identified there.

Do not reconstruct product intent from chat history.

## Core product loop

```text
teach or assess
→ collect evidence
→ update learner state
→ identify weakness
→ infer likely root cause where evidence supports it
→ targeted remediation
→ foundational retest
→ vocational transfer retest
→ update mastery/readiness
→ choose next useful activity
→ later spaced retrieval
```

Learning does not have to begin with assessment. A learner may select qualification → unit → lesson and work systematically through the syllabus.

## Initial proving slice

The first implementation proves the architecture through a deliberately narrow Electrical/Foundational Maths/Foundational Physics proving slice rather than broad content coverage. See [`PROJECT-STATUS.md`](PROJECT-STATUS.md) for the current proving-slice content and diagnostic golden path.

## Technical baseline

Native iOS/Android are the primary learner platforms; this repository's current implementation is the secondary web client (TypeScript/Next.js) plus the shared Supabase backend, with a deterministic, no-runtime-AI learner engine. The full technical baseline — languages, frameworks, hosting, testing tools and internal package structure for both the web client and the native mobile client — is owned by [`docs/architecture/ARCHITECTURE-OVERVIEW.md`](docs/architecture/ARCHITECTURE-OVERVIEW.md) and [`docs/architecture/MOBILE-ARCHITECTURE.md`](docs/architecture/MOBILE-ARCHITECTURE.md); this README does not maintain an independent copy.

## Development setup

Prerequisites: Node.js 24 (see [`.nvmrc`](.nvmrc)) and npm 11+.

```bash
npm install
npm run dev
```

`npm run dev` starts the secondary web client at http://localhost:3000. For the primary native mobile client, see [`apps/mobile/README.md`](apps/mobile/README.md) and the "Local mobile app" section below.

Other root commands: `npm run build`, `npm run typecheck`, `npm run lint`, `npm run test:unit`, `npm run test:e2e`, `npm run test:a11y`. Mobile-specific commands: `npm run dev:mobile`, `npm run mobile:android`, `npm run mobile:ios`, `npm run mobile:test`, `npm run check:mobile-boundary`.

The Next.js (secondary) web application lives in [`apps/web`](apps/web); the Expo/React Native (primary) native application lives in [`apps/mobile`](apps/mobile) (CC-04N — see [`docs/architecture/evidence/CC-04N-MOBILE-FOUNDATION-EVIDENCE.md`](docs/architecture/evidence/CC-04N-MOBILE-FOUNDATION-EVIDENCE.md) for exactly what it currently proves). Framework-independent packages (`domain`, `calculation-engine`, `evidence-engine`, `diagnostic-engine`, `learning-engine`, `content-schema`, `ui`, `test-fixtures`) live in [`packages/`](packages) and are shared by both clients (`ui` is web/DOM-specific and consumed only by `apps/web`). See [`docs/development/DEVELOPMENT-WORKFLOW.md`](docs/development/DEVELOPMENT-WORKFLOW.md) for the task/review/checkpoint process.

## Local database (Supabase)

Local Postgres/Supabase requires [Docker](https://www.docker.com/) to be running. The Supabase CLI is a project-scoped dev dependency, invoked through the scripts below; no globally installed CLI or remote/production Supabase project is required for local development.

```bash
npm run db:start   # start the local Supabase stack (Postgres, Auth, Studio, ...)
npm run db:reset   # rebuild the schema from supabase/migrations and load supabase/seed.sql
npm run db:test    # run pgTAP database tests (supabase/tests/database)
npm run db:lint    # lint the local database schema
npm run db:types   # regenerate packages/domain/src/database.types.ts from the local schema
npm run db:stop    # stop the local Supabase stack
```

Schema changes live only in version-controlled SQL migrations under [`supabase/migrations`](supabase/migrations) — never edit the schema by hand in Supabase Studio. `npm run db:reset` must always reconstruct the full schema and seed data from repository state alone; if it doesn't, the migrations are incomplete. Seed data in [`supabase/seed.sql`](supabase/seed.sql) is synthetic/fictional development-fixture data, not real proving-slice content.

Row Level Security is enabled on every governed knowledge/provenance/curriculum table with no policies yet defined, so the local `anon`/`authenticated` API roles can read and write nothing on them. This is the intended CC-02 deny-by-default posture, not a bug — learner-facing read policies for this content arrive with later content-delivery packages. CC-03 added the first learner-owned tables (`learner_profiles`, `learner_isolation_probe`) with self-only RLS; see below. CC-04/CC-04A/CC-04B populated the governed schema with a curriculum-grounded proving-slice knowledge graph (City & Guilds 2365-02 Unit 202 — Principles of Electrical Science, spanning Learning Outcomes 1, 2, 3, 4 and 5, plus reusable Foundational Maths/Physics prerequisites); it remains under the same deny-by-default posture as every other governed table.

Governed knowledge-graph content is authored as structured, validated manifests under [`scripts/content/data`](scripts/content/data) and deterministically compiled to SQL under [`supabase/seed-content`](supabase/seed-content), which loads automatically on `db:reset` alongside `seed.sql`:

```bash
npm run content:generate  # validate a manifest and (re)write its supabase/seed-content/*.sql
npm run content:check     # regenerate and fail if the committed .sql is stale
npm run content:review    # (re)write the human-reviewable corpus inventory under scripts/content/evidence
```

CC-05A (see [`docs/architecture/evidence/CC-05A-PEDAGOGICAL-BLUEPRINT-BACKFILL.md`](docs/architecture/evidence/CC-05A-PEDAGOGICAL-BLUEPRINT-BACKFILL.md)) adds a governed pedagogical layer -- assertion families, capabilities, formula families, diagram blueprints, question blueprints -- on top of the knowledge graph, under [`scripts/content/data/cc05a-pedagogy-unit202.ts`](scripts/content/data/cc05a-pedagogy-unit202.ts):

```bash
npm run content:pedagogy:report  # print the coverage report (families, formula/diagram/question-blueprint counts, gaps)
npm run content:pedagogy:check   # same computation, exits non-zero if any coverage gate is non-zero
```

## Local authentication (CC-03)

Sign-in uses Supabase Auth passwordless email one-time codes. No password, no social login and no production email provider are required locally.

```bash
npm run db:start   # local Supabase Auth runs as part of the standard stack
npm run dev         # starts the Next.js app at http://localhost:3000
```

1. Copy [`apps/web/.env.example`](apps/web/.env.example) to `apps/web/.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from the `npx supabase start` (or `npx supabase status`) output. Never put the secret/service-role key or JWT secret in this file.
2. Visit [`/sign-in`](http://localhost:3000/sign-in), enter any address at a reserved test domain (e.g. `you@example.test`) and request a code.
3. Local emails are never actually sent — open Mailpit at the `MAILPIT_URL` printed by `supabase start` (typically <http://127.0.0.1:54324>) to read the 6-digit code, then enter it on the sign-in page.
4. A signed-in session grants access to the protected [`/learn`](http://localhost:3000/learn) route, which also proves the learner's own profile row is readable under RLS. Signing out revokes the session server-side.

Database-level auth/isolation tests (`supabase/tests/database/07_learner_schema.sql`, `08_learner_isolation.sql`) run via `npm run db:test`. Browser-level auth tests (`tests/e2e/sign-in.spec.ts`) run via `npm run test:e2e` and drive the real OTP flow through the local Mailpit API — no test-only authentication backdoor exists in application code.

## Local mobile app (CC-04N)

The primary native learner client (Expo + React Native, [`ADR-0001`](docs/architecture/adr/ADR-0001-mobile-client-technology.md)) lives in [`apps/mobile`](apps/mobile). It shares the same local Supabase backend as the web client, using its own native Supabase client and secure session storage (not cookies).

```bash
npm run db:start     # local Supabase, shared with the web client
npm run dev:mobile    # starts Expo; press "a" for Android or scan the QR code
npm run mobile:test   # mobile Jest suite (shared-package proof, SQLite/outbox, component tests)
```

See [`apps/mobile/README.md`](apps/mobile/README.md) for the full Windows developer workflow (Android emulator/physical-device connectivity, where logs appear, how to stop services) and [`docs/architecture/evidence/CC-04N-MOBILE-FOUNDATION-EVIDENCE.md`](docs/architecture/evidence/CC-04N-MOBILE-FOUNDATION-EVIDENCE.md) for exactly what has and has not been verified so far (this machine has no Android SDK/emulator or macOS/Xcode; native builds are configuration-verified only, not device-verified, until that hardware is available).

## Development model

```text
Product Owner decision
→ Project Architect specification/task
→ Claude Code bounded implementation
→ tests and evidence
→ Project Architect review
→ Product Owner approval/rejection
→ commit/push
→ PROJECT-STATUS update
→ next task
```

Claude Code does not independently expand scope or redesign approved architecture.

## Repository as project memory

The Git repository and its approved documentation are the durable project memory. Chat history, model memory and informal summaries are not authoritative.
