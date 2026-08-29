---
id: ARCH-001
status: approved
owner: project-architect
last_reviewed: 2026-08-28
---

# Architecture Overview

## System shape

The initial product is a **modular monolith**: one deployable application with strong internal module boundaries, rather than separately deployed microservices.

Native iOS/Android are the primary learner platforms; web is secondary (see [`docs/product/PRODUCT-PRINCIPLES.md`](../product/PRODUCT-PRINCIPLES.md)). This is current fact, not aspiration: `apps/mobile` (Expo + React Native, [`ADR-0001`](adr/ADR-0001-mobile-client-technology.md), status accepted) is the real, implemented, real-emulator-qualified primary learner client (CC-04N foundation; CC-06C/D native Lesson Player; CC-12/CC-12A-D real learner-facing vertical slice) — it is not a future client "expected to" arrive. The Phase 1 proving slice's *earliest* domain-engine proof happened against the secondary web client (`apps/web`) first, because it was the fastest path to proving the deterministic engines end-to-end before any native client existed; that historical sequencing choice is why `apps/web` is mentioned first in some older evidence documents, but it is not the current primary-client story. The resulting native target topology, offline/sync architecture and testing/release architecture are in [`MOBILE-ARCHITECTURE.md`](MOBILE-ARCHITECTURE.md) (status: approved). Both clients consume the same application services and domain engines below rather than duplicating business logic.

```text
Native mobile client (apps/mobile, primary)   Web client (apps/web, secondary)
Expo + React Native                            Next.js application
      ↓                                               ↓
      └───────────────────┬───────────────────────────┘
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

Neither client owns business logic — both are thin consumers of the same shared, framework-independent domain-engine packages (`packages/domain`, `packages/calculation-engine`, `packages/evidence-engine`, `packages/diagnostic-engine`, `packages/learning-engine`, `packages/content-schema`; see "Core internal packages" below) and the same Supabase backend.

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

**V1 scope note (ADR-0006, 2026-08-29):** this diagram describes the domain engines' general capability, not the V1 ordinary-lesson learner route. A V1 ordinary lesson is one canonical premium route (no per-learner skip/branch/reorder); the "branch to diagnosis/remediation" step above is retained implemented platform capability / post-V1 option — not deleted, but not a V1 ordinary-lesson production requirement. See "Learning-package production architecture and V1 learner model" below.

## Learning-package production architecture and V1 learner model (ADR-0005 / ADR-0006)

Following Product Owner review of Unit 202 after full Android runtime qualification (2026-08-29), the platform adopted a ground-up learning-package production architecture and a simplified V1 learner-adaptation model. Both are accepted decisions and both narrow how the sections above are read for current work:

- **Learning-package quality is upstream-governed, not repaired at runtime.** The full production sequence is source/syllabus → knowledge → canonical storyboard → visual plan → lesson checks → formative/mock assessment mapping → reference governance → production → publication gates → runtime → submitted-assessment Guided Revision. See [`SYLLABUS-TO-LEARNING-PACKAGE-PRODUCTION-ARCHITECTURE.md`](SYLLABUS-TO-LEARNING-PACKAGE-PRODUCTION-ARCHITECTURE.md).
- **Instructional visuals are first-class governed content**, planned before authoring, not a downstream polish layer — see [`INSTRUCTIONAL-VISUAL-PLANNING-REFERENCE-AND-PRODUCTION-ARCHITECTURE.md`](INSTRUCTIONAL-VISUAL-PLANNING-REFERENCE-AND-PRODUCTION-ARCHITECTURE.md) and [`docs/design/ALP-PRODUCT-WIDE-VISUAL-DESIGN-SYSTEM.md`](../design/ALP-PRODUCT-WIDE-VISUAL-DESIGN-SYSTEM.md).
- **Runtime compatibility is one publication gate among several, not the overall definition of learner readiness.** A lesson that runs correctly on-device (runtime PASS) is necessary but not sufficient for learner-ready/premium quality — see [`docs/governance/LEARNING-PACKAGE-QUALITY-GATES.md`](../governance/LEARNING-PACKAGE-QUALITY-GATES.md).
- **V1 ordinary lessons follow one canonical route.** The route does not change with learner mastery, prerequisite state, or ordinary lesson-check performance.
- **V1 adaptation is revision prioritisation after a completed/submitted formative/mock assessment, not mastery-driven lesson assembly.** A deterministic Guided Revision plan ranks full canonical lessons by weakness after the assessment is submitted; incomplete/abandoned assessments and ordinary lesson-check activity never update it. See [`V1-LEARNING-ASSESSMENT-AND-GUIDED-REVISION-ARCHITECTURE.md`](V1-LEARNING-ASSESSMENT-AND-GUIDED-REVISION-ARCHITECTURE.md).

Governing decisions: [`ADR-0005`](adr/ADR-0005-learning-package-production-and-visual-governance.md) and [`ADR-0006`](adr/ADR-0006-v1-canonical-lessons-and-assessment-driven-guided-revision.md). Full reconciliation checklist: [`ARCHITECTURE-RESET-INTEGRATION-MATRIX.md`](ARCHITECTURE-RESET-INTEGRATION-MATRIX.md). Existing richer adaptive/diagnostic/remediation machinery (CC-07/CC-08/CC-12) is retained implemented platform capability / post-V1 option — it is not deleted, and nothing above revokes it — but it is no longer a V1 ordinary-lesson production requirement.

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

A single generation call cannot publish learner-visible governed content. For instructional visuals specifically, this boundary is elaborated in [`PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md`](PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md) and [`ADR-0004`](adr/ADR-0004-deterministic-authority-over-generated-instructional-imagery.md): a reference-first, human-readable-reference-grounded workflow precedes any AI-generated imagery, and where generated imagery and governed deterministic geometry disagree, deterministic geometry always wins — generated imagery may never be the sole authority for circuit topology, schematic symbol geometry, mathematical geometry, or directional electromagnetism. The automated implementation of this workflow (Claude orchestrates and audits, Gemini renders, ChatGPT/Product Owner approves references, Product Owner gives final approval) is recorded in the pipeline document's §20; the canonical look of generated imagery is governed separately by [`ALP-INSTRUCTIONAL-VISUAL-STYLE-GUIDE.md`](../design/ALP-INSTRUCTIONAL-VISUAL-STYLE-GUIDE.md) (white/near-white background default as of CC-11.9), never re-derived per asset. An external Product Owner reference-research handover is the reference-decision authority where one has been supplied, applied via an additive correction overlay rather than in-place catalogue rewrites, with a mechanical zero-missing-reference gate before any production run -- see the pipeline document's §21. Instructional visuals are modelled as reusable platform assets (a commissioning course is not their permanent owner), also §21. **Reference-first is not itself sufficient**: as of CC-11.12 (permanent product/content governance, all future modules/courses/qualifications), the exact reference frame supplied to the model must separately pass semantic reference QA against the exact governed learner-visible state before any generation call, and every generated candidate is judged on three independent verdicts (technical, pedagogical clarity, visual/product quality), not one -- see the pipeline document's §22 and the style guide's §9. **Nor is the reference itself the final asset**: as of CC-11.13, the shipped asset is normally an original ALP redraw grounded on the reference's technical authority, never a lifted/traced/vectorised copy, with no artistic licence over the technical relationships the reference establishes; governed teaching diagrams default to clean 2D/diagrammatic treatment, not 3D; every asset is classified under one of five governed production modes and a seven-gate lifecycle separating correctness from appearance from Product Owner approval -- see the pipeline document's §23, the style guide's §10, and `tools/visual-production-studio/production-mode.ts` / `asset-lifecycle.ts`.

## Proprietary-source boundary

Proprietary development references do not automatically enter Git, learner DB, public assets or runtime retrieval/embeddings. Production contains governed derived content/provenance only where permitted.

## Background work and scale

Do not add Redis/Kafka/etc. initially. If durable async work becomes necessary, Supabase Queues/pgmq is the preferred first option subject to requirements. Scale through indexed relational queries, bounds/pagination, stateless services where practical, jobs and horizontal scaling when measured need appears.

## UI architecture

This section describes the web client. Open-source primitives solve mechanics, not product design. Use shadcn/ui selectively. The project owns lesson UX, adaptive branching, remediation return, progress/readiness, visual identity and accessibility. Do not import a wholesale SaaS theme. The equivalent native mobile UI architecture is [`MOBILE-UX-ENGINEERING-STANDARD.md`](../product/MOBILE-UX-ENGINEERING-STANDARD.md) and [`MOBILE-ARCHITECTURE.md`](MOBILE-ARCHITECTURE.md) — it is a separate, native-specific design system, not a shadcn/ui port.

## Generated reports are not runtime authority (CC-12E)

A generated report, manifest or registry (a coverage matrix, a visual-production manifest, an audit/proof-pack export) is evidence or a snapshot of a specific run, never itself a source of truth a system component may casually consume, unless a document explicitly designs it as runtime authority. Every such artefact needs a clearly defined owner and generation path; runtime code must resolve against the real governed source (the actual audited asset/content, traced to its own audit trail) rather than a historical output file that can silently go stale the moment the real source moves on. This was learned the hard way: a disconnected, never-audited `unit202-artwork-manifest.json` snapshot was briefly mistaken for the current Unit 202 image set (CC-12B) before being traced back to the real audit lineage and corrected (CC-12C, then generalised across the whole unit by the CC-12 imagery cleanup — see `PROJECT-STATUS.md` §CC-12). The fix in each case was tracing to the real audit trail, never trusting the generated report at face value.

## Architecture-change rule

If implementation requires violating this overview or an accepted ADR, stop and raise the architecture decision. Do not silently create a second architecture in code.
