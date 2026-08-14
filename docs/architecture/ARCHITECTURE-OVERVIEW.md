---
id: ARCH-001
status: approved
owner: project-architect
last_reviewed: 2026-08-14
---

# Architecture Overview

## System shape

The initial product is a **modular monolith**: one deployable application with strong internal module boundaries, rather than separately deployed microservices.

```text
Learner browser
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

## Technical baseline

- TypeScript strict mode
- Next.js App Router + React
- Tailwind CSS v4
- project-owned design tokens/components
- semantic HTML first
- selective shadcn/ui open-code primitives
- Supabase PostgreSQL + Auth + RLS
- SQL migrations + generated TypeScript DB types
- no ORM initially
- Vercel hosting
- Zod v4
- Vitest + React Testing Library
- Playwright + axe
- pgTAP
- GitHub Actions

## Learner-runtime AI boundary

Initial runtime: **NO LLM**. Core learner behaviour works with no model-provider connection. AI is used in development/content tooling only. A future premium AI tutor may sit beside the core platform but must not become a dependency of deterministic marking/mastery/diagnosis.

## Core internal packages

Recommended framework-independent packages:

```text
packages/domain
packages/calculation-engine
packages/evidence-engine
packages/diagnostic-engine
packages/learning-engine
packages/content-schema
```

Optional internal development tooling later: `packages/content-ai`. It must not be imported by learner-runtime domain engines.

## Dependency direction

```text
domain
  ↓
calculation / evidence / diagnosis / learning
  ↓
application services
  ↓
Next.js API/UI
```

UI is not the source of business rules. Domain engines do not import Next.js.

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

A single generation call cannot publish learner-visible governed content.

## Proprietary-source boundary

Proprietary development references do not automatically enter Git, learner DB, public assets or runtime retrieval/embeddings. Production contains governed derived content/provenance only where permitted.

## Background work and scale

Do not add Redis/Kafka/etc. initially. If durable async work becomes necessary, Supabase Queues/pgmq is the preferred first option subject to requirements. Scale through indexed relational queries, bounds/pagination, stateless services where practical, jobs and horizontal scaling when measured need appears.

## UI architecture

Open-source primitives solve mechanics, not product design. Use shadcn/ui selectively. The project owns lesson UX, adaptive branching, remediation return, progress/readiness, visual identity and accessibility. Do not import a wholesale SaaS theme.

## Architecture-change rule

If implementation requires violating this overview or an accepted ADR, stop and raise the architecture decision. Do not silently create a second architecture in code.
