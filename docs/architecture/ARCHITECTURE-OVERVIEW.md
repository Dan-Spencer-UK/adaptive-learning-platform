---
id: ARCH-001
status: approved
owner: project-architect
last_reviewed: 2026-08-23
---

# Architecture Overview

## System shape

The initial product is a **modular monolith**: one deployable application with strong internal module boundaries, rather than separately deployed microservices.

Native iOS/Android are the primary learner platforms; web is secondary (see [`docs/product/PRODUCT-PRINCIPLES.md`](../product/PRODUCT-PRINCIPLES.md)). The Phase 1 proving slice is implemented against the web client below because it is the fastest path to proving the deterministic domain engines end-to-end; this is a proving-slice implementation choice, not a statement that the web client is the durable primary learner surface. The mobile-native client technology is decided in [`ADR-0001`](adr/ADR-0001-mobile-client-technology.md) (Expo + React Native; status: accepted); the resulting target topology, offline/sync architecture and testing/release architecture are in [`MOBILE-ARCHITECTURE.md`](MOBILE-ARCHITECTURE.md) (status: approved). Whatever client(s) exist, they must consume the same application services and domain engines below rather than duplicating business logic.

```text
Learner browser (Phase 1 proving-slice client)
      ↓
Next.js application
      ↓
Application services
      ↓
────────────────────────────────
Domain / deterministic engines
────────────────────────────────
calculation
learner evidence
Diagnosis
learning / next activity
────────────────────────────────
      ↓
Supabase PostgreSQL
      ↓
RLS / governed persistence
```

A future native client is expected to sit alongside or in place of the browser at the top of this diagram, consuming the same application services/domain engines/persistence layer without duplicating business logic in the client.

## Technical baseline

This is the baseline for the current web client and shared backend. The native mobile client's baseline (Expo + React Native) is decided separately in [`ADR-0001`](adr/ADR-0001-mobile-client-technology.md) (accepted) and detailed in [`MOBILE-ARCHITECTURE.md`](MOBILE-ARCHITECTURE.md); the two are not the same list, though they share TypeScript, Zod, Supabase and the underlying domain-engine packages.

- TypeScript strict mode
- Next.js App Router + React (web client)
- Tailwind CSS v4 (web client)
- project-owned design tokens/components
- semantic HTML first (web client)
- selective shadcn/ui open-code primitives (web client)
- Supabase PostgreSQL + Auth + RLS (shared backend, both clients)
- SQL migrations + generated TypeScript DB types (shared backend)
- no ORM initially
- Vercel hosting (web client)
- Zod v4 (shared)
- Vitest + React Testing Library (web client unit/component tests)
- Playwright + axe (web client E2E/accessibility; not a mobile test strategy — see `MOBILE-ARCHITECTURE.md` §Testing/build/release)
- pgTAP (shared backend)
- GitHub Actions (web client CI; mobile CI is a separate target, see `MOBILE-ARCHITECTURE.md`)

## Learner-runtime AI boundary

Initial runtime: **NO LLM**. Core learner behaviour works with no model-provider connection. AI is used in development/content tooling only. A future premium AI tutor may sit beside the core platform but must not become a dependency of deterministic marking/mastery/diagnosis.

## Core internal packages

Recommended framework-independent packages, intended to be consumed unmodified by both the web client and the primary native mobile client (confirmed 2026-08-15: none currently depend on React, Next.js, the DOM or a Node built-in module; CC-04N proved real consumption from `apps/mobile` under the RN/Jest pipeline and Metro/Hermes bytecode compilation):

```text
packages/domain
packages/calculation-engine
packages/evidence-engine
packages/diagnostic-engine
packages/learning-engine
packages/content-schema
```

`packages/ui` is a separate, existing package that is **not** framework-independent — it is the web (secondary) client's own DOM/Tailwind component package and is not consumed by the native mobile client. CC-04N (2026-08-15) deliberately did not create a separate `packages/mobile-ui` package at this foundation scale — native design-token/UI constants currently live directly in `apps/mobile/src/lib/tokens.ts`, explicitly labelled as not the final design system; a dedicated shared native UI package remains a candidate for later extraction if and when duplication across native screens justifies it, per [`MOBILE-ARCHITECTURE.md`](MOBILE-ARCHITECTURE.md) §Client/backend topology. Neither package is renamed by this document.

Optional internal development tooling later: `packages/content-ai`. It must not be imported by learner-runtime domain engines.

## Dependency direction

```text
domain
  ↓
calculation / evidence / diagnosis / learning
  ↓
application services
  ↓
Next.js API/UI  (web)   |   native mobile UI  (mobile)
```

UI is not the source of business rules, on either client. Domain engines do not import Next.js, React Native, or any client framework.

## Knowledge model

Relational data with graph-like typed edges. Core concepts include source/version/locator, assertion/capability/version, provenance, prerequisite/relationship, misconception, curriculum node/mapping, lesson/version, question family/version, remediation, learner attempt, evidence event, learner assertion state and diagnostic episode. No dedicated graph DB in Phase 1.

## Assertion versus lesson

Assertion: smallest useful governed proposition/capability for evidence, diagnosis, reuse and provenance. Lesson: coherent learner-facing instructional unit built from multiple assertions. Do not collapse them.

## Deterministic question generation

A numerical variant should be reproducible from question-family version, deterministic seed and generator algorithm version. The calculation engine owns formulas, quantities, units, tolerances, parameter constraints and distractor rules.

## Learner evidence

Attempts are evidence, not mastery. Prefer append-oriented records for attempts, evidence events and audit/publication events. Derived learner state may be stored for performance but should remain traceable/recomputable where practical.

## Diagnostic architecture

Diagnosis uses bounded, explainable competing hypotheses such as vocational concept, relationship selection, Foundational Maths, Foundational Physics, procedure/strategy, interpretation or likely slip. Probe only when expected information gain justifies learner friction.

## Learning architecture

```text
select lesson
→ explain
→ demonstrate
→ guided practice
→ independent check
→ branch to diagnosis/remediation if useful
→ retest
→ vocational transfer
→ return
→ update progress/state
```

## Authentication and isolation

Authentication and authorisation are separate. Ordinary learner access uses authenticated application/server paths and RLS. Privileged credentials are server-only and narrowly used. Production authentication email requires a custom SMTP provider (Resend) in place of Supabase's built-in development email, kept replaceable via standard SMTP configuration.

## Security hierarchy

OWASP ASVS — application-security verification; NIST SSDF — secure-development lifecycle; OWASP Top 10 — risk cross-check; applicable CIS Benchmarks — technology hardening. No blanket compliance claim without evidence.

## Content publication boundary

```text
source
→ rights/version/locator
→ AI/manual candidates
→ independent verification
→ deterministic validation
→ risk-based human review/sampling
→ approval
→ publication
```

A single generation call cannot publish learner-visible governed content. For instructional visuals specifically, this boundary is elaborated in [`PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md`](PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md) and [`ADR-0004`](adr/ADR-0004-deterministic-authority-over-generated-instructional-imagery.md): a reference-first, human-readable-reference-grounded workflow precedes any AI-generated imagery, and where generated imagery and governed deterministic geometry disagree, deterministic geometry always wins — generated imagery may never be the sole authority for circuit topology, schematic symbol geometry, mathematical geometry, or directional electromagnetism. The automated implementation of this workflow (Claude orchestrates and audits, Gemini renders, ChatGPT/Product Owner approves references, Product Owner gives final approval) is recorded in the pipeline document's §20; the canonical look of generated imagery is governed separately by [`ALP-INSTRUCTIONAL-VISUAL-STYLE-GUIDE.md`](../design/ALP-INSTRUCTIONAL-VISUAL-STYLE-GUIDE.md) (white/near-white background default as of CC-11.9), never re-derived per asset. An external Product Owner reference-research handover is the reference-decision authority where one has been supplied, applied via an additive correction overlay rather than in-place catalogue rewrites, with a mechanical zero-missing-reference gate before any production run -- see the pipeline document's §21. Instructional visuals are modelled as reusable platform assets (a commissioning course is not their permanent owner), also §21. **Reference-first is not itself sufficient**: as of CC-11.12 (permanent product/content governance, all future modules/courses/qualifications), the exact reference frame supplied to the model must separately pass semantic reference QA against the exact governed learner-visible state before any generation call, and every generated candidate is judged on three independent verdicts (technical, pedagogical clarity, visual/product quality), not one -- see the pipeline document's §22 and the style guide's §9.

## Proprietary-source boundary

Proprietary development references do not automatically enter Git, learner DB, public assets or runtime retrieval/embeddings. Production contains governed derived content/provenance only where permitted.

## Background work and scale

Do not add Redis/Kafka/etc. initially. If durable async work becomes necessary, Supabase Queues/pgmq is the preferred first option subject to requirements. Scale through indexed relational queries, bounds/pagination, stateless services where practical, jobs and horizontal scaling when measured need appears.

## UI architecture

This section describes the web client. Open-source primitives solve mechanics, not product design. Use shadcn/ui selectively. The project owns lesson UX, adaptive branching, remediation return, progress/readiness, visual identity and accessibility. Do not import a wholesale SaaS theme. The equivalent native mobile UI architecture is [`MOBILE-UX-ENGINEERING-STANDARD.md`](../product/MOBILE-UX-ENGINEERING-STANDARD.md) and [`MOBILE-ARCHITECTURE.md`](MOBILE-ARCHITECTURE.md) — it is a separate, native-specific design system, not a shadcn/ui port.

## Architecture-change rule

If implementation requires violating this overview or an accepted ADR, stop and raise the architecture decision. Do not silently create a second architecture in code.
