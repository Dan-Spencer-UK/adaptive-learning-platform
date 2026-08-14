# Phase 1 — WP1.9: Technical Architecture Decision & Implementation Plan

**Status:** Draft v0.3 for Product Owner review  
**Date:** 14 August 2026  
**Phase:** Phase 1 — Architecture & End-to-End Proving Slice  
**Depends on:** Approved WP1.1–WP1.8  
**Purpose:** Convert the approved conceptual architecture into a concrete, bootstrap-compatible technical stack and a bounded implementation sequence for WP1.10.

---

# 1. Executive decision

Recommended Phase 1 stack:

```text
LANGUAGE
TypeScript — strict mode

APPLICATION
Next.js App Router
React
Node.js LTS runtime

STYLING / DESIGN SYSTEM
Tailwind CSS v4
CSS custom properties/design tokens
native semantic HTML first
selective shadcn/ui open-code primitives

DATABASE / AUTH / DATA SECURITY
Supabase
  → managed PostgreSQL
  → Supabase Auth
  → PostgreSQL Row Level Security
  → SQL migrations
  → generated TypeScript database types

HOSTING
Vercel

AUTH EMAIL
Supabase Auth + Resend custom SMTP for external production use

VALIDATION
Zod v4

UNIT / DOMAIN TESTING
Vitest

COMPONENT TESTING
React Testing Library

END-TO-END / ACCESSIBILITY
Playwright
@axe-core/playwright
manual accessibility testing

DATABASE / RLS TESTING
pgTAP + application-level integration tests

CI
GitHub Actions

BACKGROUND WORK
No separate queue infrastructure initially
Supabase Queues / pgmq when durable async work is actually required

AI — INITIAL LAUNCH
No learner-runtime AI
AI used only for development/content production and verification

FUTURE OPTIONAL PREMIUM AI
Provider-neutral tutor gateway may be added later
without changing the core learning architecture

PRODUCT ANALYTICS
first-party event records initially
no third-party analytics dependency required for Phase 1

OBSERVABILITY
structured application logs
Vercel runtime/observability
Supabase logs
optional dedicated error tracker before wider beta if justified
```

The architecture remains a **modular monolith**.

This is not a microservices system.

---

# 2. Why this stack

The stack is chosen against the project's constraints:

- founder + AI implementation;
- minimal pre-revenue cash;
- excellent mobile web UX;
- secure authentication and learner isolation;
- relational/graph-like knowledge model;
- strong RLS support;
- deterministic learning engine;
- low operational burden;
- zero runtime-AI dependency at initial launch;
- rapid iteration with Claude Code;
- ability to scale substantially without an early rewrite;
- portability where practical;
- mature tooling and documentation.

The objective is not to select the most technically fashionable stack.

It is to select the **lowest-complexity stack that satisfies the governed architecture**.

---

# 3. TypeScript throughout

Use TypeScript in strict mode for:

- learner web application;
- server/application layer;
- deterministic learning engine;
- diagnostic engine;
- content tooling;
- AI gateway;
- test fixtures.

Why:

- one primary language;
- strong type checking;
- excellent React/Next.js ecosystem;
- easier AI-assisted implementation;
- shared domain types;
- fewer translation boundaries.

TypeScript types do not replace runtime validation.

Untrusted input still requires Zod/database validation.

---

# 4. Node.js runtime

Pin a supported Node.js LTS release in:

- repository tooling;
- CI;
- production runtime where configurable.

Do not use "whatever Node version happens to be installed."

The exact runtime version should be recorded in:

- `package.json` engines;
- `.nvmrc` or equivalent if useful;
- CI configuration.

The founder's existing Node 24 environment is a sensible initial development baseline if it remains supported by the selected deployment stack at implementation time.

---

# 5. Application framework — Next.js App Router

Use:

> **Next.js App Router**

for the learner application and the initial protected admin/content interface.

Why:

- React ecosystem;
- server and client rendering in one framework;
- strong routing/layout support;
- server-side execution;
- production optimisation;
- mature Vercel deployment path;
- suitable for a responsive PWA-capable web product;
- avoids running a separate frontend and backend application before necessary.

Next.js remains deployable outside Vercel if hosting strategy later changes.

---

# 6. Server Components by default

Use React Server Components where appropriate for:

- lesson pages;
- curriculum navigation;
- progress summaries;
- published content reads.

Use Client Components only where browser interactivity is needed:

- answer input;
- immediate interaction state;
- expandable feedback;
- interactive diagrams;
- session controls.

This reduces unnecessary browser JavaScript.

Do not turn the whole application into a client-rendered SPA by default.

---

# 7. Mutation/API strategy

Use explicit server-side application services behind:

- Next.js Route Handlers;
- carefully controlled Server Actions only where they genuinely simplify a UI interaction.

Security requirement:

> every mutation path must authenticate, authorise and validate independently of the visible UI.

Route Handlers are preferred for important domain mutations because they make:

- API contracts;
- testing;
- validation;
- security review;
- logging

more explicit.

Do not expose arbitrary database mutation from browser code merely because Supabase permits browser data access.

---

# 8. Zod v4 for runtime validation

Use Zod for application-boundary validation.

Examples:

- submitted answers;
- lesson navigation parameters;
- content-authoring payloads;
- diagnostic commands;
- AI structured outputs;
- import files.

Why:

- TypeScript-first;
- runtime validation;
- static type inference;
- structured errors;
- appropriate for shared schemas.

Database constraints remain required.

Zod does not replace PostgreSQL constraints or RLS.

---

# 9. Core database — Supabase PostgreSQL

Use Supabase managed PostgreSQL as the core data store.

This implements the WP1.6 relational-first decision while providing:

- PostgreSQL;
- authentication integration;
- RLS;
- managed operation;
- local development tooling;
- backups on paid production tier;
- queue capability later;
- generated TypeScript DB types.

The data model remains normal PostgreSQL.

Avoid platform-specific features where they provide little value.

This preserves a realistic migration path away from Supabase if ever necessary.

---

# 10. No dedicated graph database

Do not introduce Neo4j or another graph database in Phase 1.

Represent:

- assertion relationships;
- prerequisites;
- provenance;
- curriculum mappings;

as ordinary typed relational edges.

Diagnostic traversal is deliberately bounded.

If later profiling shows PostgreSQL traversal is inadequate, reconsider using evidence.

---

# 11. Supabase local development

Use the Supabase CLI local stack during development.

Repository contains:

```text
supabase/
  config.toml
  migrations/
  seed.sql
  tests/
```

Database changes are reproducible from version-controlled migrations.

The local Supabase stack is development-only and must never be publicly exposed.

---

# 12. SQL migrations as source of database truth

Use reviewed SQL migration files.

Rules:

- every schema change creates a migration;
- migrations are committed;
- `supabase db reset` must rebuild the local database successfully;
- CI verifies migration chain;
- production database is not manually edited without capturing the change as a migration.

For this project, explicit SQL is preferable to introducing an ORM migration layer on top of Supabase.

---

# 13. No ORM initially

Do **not** introduce Prisma/Drizzle/etc. in Phase 1 unless implementation reveals a concrete need.

Reason:

- PostgreSQL/RLS is central to the architecture;
- Supabase already provides typed client access;
- schema/migration ownership should remain explicit;
- an ORM adds another abstraction and migration system;
- many critical operations need PostgreSQL-specific capabilities anyway.

Use generated TypeScript database types from the Supabase schema.

This decision can be revisited if query complexity causes genuine maintainability problems.

---

# 14. Data access pattern

Use two deliberately different access paths.

## 14.1 User-scoped access

For learner operations:

```text
authenticated learner session
→ server-side Supabase client carrying learner identity
→ PostgreSQL
→ RLS
```

RLS remains active.

## 14.2 Privileged system access

For rare controlled operations:

```text
trusted server-only service
→ privileged credential
→ explicit application authorisation
→ audited operation
```

Examples:

- governed publishing;
- system reprocessing;
- maintenance jobs.

Privileged credentials must never enter client bundles.

---

# 15. RLS as mandatory defence-in-depth

Enable RLS on all learner-owned/user-sensitive exposed tables.

Standard test pattern:

```text
User A → own row → allowed
User B → User A row → denied
anonymous → learner row → denied
```

Use both:

- pgTAP database tests;
- application integration tests.

RLS is not considered complete until cross-user tests exist.

---

# 16. Database schema boundaries

Recommended PostgreSQL schemas or logical namespaces:

```text
public / app-facing governed data
internal / privileged implementation data where useful
audit / append-oriented audit records where useful
```

Do not create many schemas merely for aesthetics.

At minimum, table naming/modules should make boundaries obvious.

---

# 17. Major relational object groups

Initial schema implementation should cover:

```text
identity/profile
knowledge/assertions
assertion versions
relationships
misconceptions
sources/source versions/locators
provenance
curriculum/versions/nodes/mappings
learning programmes
learning paths
lessons/versions
question families/versions
deterministic parameter definitions
explanations/remediation
learner lesson progress
attempts
evidence events
learner assertion state
diagnostic episodes
audit/publication
```

Do not create all optional future columns on day one.

Implement the minimum structure required by the proving slice while preserving the approved relationships.

---

# 18. Immutable event/history pattern

Prefer append-oriented records for:

- learner attempts;
- evidence events;
- audit events;
- publication history.

Derived current state can be updated/cached separately.

This supports:

- recomputation;
- content invalidation;
- debugging;
- longitudinal learning history.

---

# 19. Transactional learner submission

A learner answer should become one coherent operation.

Conceptually:

```text
validate submission
↓
mark deterministically
↓
extract evidence
↓
derive state changes
↓
persist:
  attempt
  evidence
  learner-state changes
  diagnostic update
↓
commit
```

The persistence step must be atomic where practical.

Implementation option:

> a narrowly defined PostgreSQL RPC/function called through the authenticated Supabase client to persist the already-computed structured result in one transaction.

The database function should not become the entire learning engine.

Core educational rules remain in TypeScript.

---

# 20. Deterministic engine packages

The central learning logic should be ordinary testable TypeScript with no framework dependency.

Recommended packages:

```text
packages/domain
packages/calculation-engine
packages/evidence-engine
packages/diagnostic-engine
packages/learning-engine
```

These should not import React or Next.js.

This allows:

- unit testing;
- CLI/content tooling;
- future worker execution;
- future native/API clients;
- provider independence.

---

# 21. Formula/calculation engine

`calculation-engine` owns:

- quantities;
- units;
- unit conversion;
- formula definitions;
- variable substitution;
- deterministic parameter generation;
- answer tolerance;
- error signatures;
- distractor algorithms.

No duplicated formula logic in React components.

For Phase 1, avoid a general computer-algebra system.

Implement only the structured relationships required by the proving slice.

---

# 22. Numeric representation

Use normal JavaScript numeric arithmetic only where precision is safe for the Level 2 problem.

For unit conversion/calculation rules:

- define tolerances explicitly;
- avoid equality comparisons that assume perfect floating-point representation;
- test boundary/rounding behaviour.

A decimal arithmetic library can be added if actual content requires precision beyond safe handling.

Do not add one pre-emptively.

---

# 23. Question-generation seeds

Deterministic variants should be reproducible.

Use:

- question family version;
- variant seed;
- parameter-generation algorithm version.

This permits:

- replaying a learner's exact question;
- regression testing;
- investigating disputes;
- avoiding storage of every generated variant where unnecessary.

The exact pseudo-random generator must be deterministic and tested.

---

# 24. UI styling — Tailwind CSS v4

Use Tailwind CSS v4 for implementation speed and consistency.

Use it with:

- semantic HTML;
- CSS custom properties/design tokens;
- reusable React components.

Tailwind should implement the design system.

It should not replace the design system.

Avoid large opaque strings of arbitrary values repeated throughout the application.

---

# 25. Design tokens

Define semantic tokens for:

- typography;
- spacing;
- radius;
- focus;
- content width;
- breakpoints;
- status/feedback;
- motion.

The visual design can evolve without rewriting every component.

Do not encode meaning solely through colour.

---

# 26. Component-library strategy

Use mature open-source UI primitives for commodity interaction patterns,
but keep the product's learning UX and visual identity under project
control.

The default implementation strategy is:

1. **native semantic HTML first** where it is sufficient;
2. **selective shadcn/ui components** as the default open-code source for
   common UI primitives;
3. project-owned wrappers/components implementing the approved design
   system and UX rules;
4. additional headless accessibility primitives only where necessary.

**shadcn/ui** is an open-code component approach: component source is
added to the project repository and can then be inspected, modified,
tested and governed as project code.

This is preferred to:

- building every dialog/input/disclosure primitive from scratch;
- adopting a large opaque visual framework;
- depending on a hosted/proprietary UI builder;
- accepting generic SaaS templates wholesale.

The governing principle is:

> **Do not reinvent commodities. Do invent the product.**

Commodity examples:

- buttons;
- form controls;
- OTP input;
- radio groups;
- dialogs;
- sheets/drawers;
- collapsible/disclosure behaviour;
- progress primitives;
- skeleton/loading primitives;
- accessible tooltip/popover behaviour.

Product-specific examples that remain ours:

- lesson experience;
- adaptive teaching sequence;
- diagnostic interruptions;
- remediation branch/return;
- weak-area presentation;
- readiness/progress experience;
- assessment/revision flows.

Every imported component becomes subject to the project's:

- WCAG 2.2 AA target;
- ~44×44 CSS-pixel practical touch-target rule;
- keyboard/focus rules;
- mobile-first reflow;
- design tokens;
- security review;
- tests.

Do not assume an upstream component is automatically compliant merely
because it is popular or described as accessible.

Third-party/community shadcn registries or component packs require code
review before use.

Do not install the full component catalogue pre-emptively.

---

# 27. Initial UI component set

Where a suitable official shadcn/ui primitive exists, use it as the
reviewed starting implementation rather than recreating commodity
interaction behaviour from scratch.

Build/import only the components required by the proving slice:

```text
Button
Link
FormField
NumericAnswerInput
MultipleChoice
FeedbackPanel
Disclosure
LessonCard
LessonProgress
QuestionCard
FormulaBlock
DiagramFrame
QuickCheck
RemediationOffer
ProgressSummary
LoadingState
EmptyState
ErrorState
```

Likely initial shadcn/ui-derived primitives include:

```text
Button
Card
Input
Input OTP
Radio Group
Progress
Collapsible
Dialog
Sheet
Alert
Skeleton
Tabs
Tooltip
```

Not all must be installed; add them only when an approved learner/admin
flow needs them.

Every component includes relevant:

- keyboard;
- focus;
- touch;
- loading;
- disabled;
- error;
- submitted;

states.

---

# 28. Accessibility implementation

Target:

> **WCAG 2.2 AA**

Implementation strategy:

- native semantic HTML first;
- proper labels/headings;
- visible focus;
- no focus obstruction;
- keyboard-complete core journey;
- accessible validation errors;
- colour-independent meaning;
- reflow/zoom testing;
- responsive touch targets;
- alternative text for meaningful diagrams.

Automated checks supplement, not replace, manual testing.

---

# 29. Authentication — Supabase Auth

Use Supabase Auth for learner identity.

Initial authentication methods:

1. **email one-time code / passwordless**
2. optionally magic link if UX testing supports it
3. Google/Apple may be added later if valuable

Prefer one-time code as the initial primary UX because:

- it works across browser/device boundaries more predictably than relying exclusively on link callbacks;
- email security scanners can consume single-use links in some environments;
- the learner does not manage a password.

Do not build password authentication for the initial proving slice unless user testing identifies a need.

---

# 30. Production auth email — Resend

Use Supabase's local email tooling during development.

For real external users, configure a custom production email provider.

Initial recommendation:

> **Resend**

Why:

- direct documented Supabase integration;
- SMTP support;
- simple founder-managed setup.

Configure:

- dedicated auth sending subdomain where practical;
- SPF;
- DKIM;
- DMARC;
- link tracking disabled for auth mail;
- concise non-marketing auth templates.

The provider remains replaceable because Supabase supports standard custom SMTP.

---

# 31. Auth abuse controls

Use Supabase Auth rate limits and CAPTCHA/abuse controls where justified.

Additionally:

- generic anti-enumeration messages;
- safe redirect allow-list;
- short-lived OTP;
- sensible resend interval;
- session revocation;
- privileged admin MFA.

External beta cannot rely on Supabase's built-in demonstration SMTP.

---

# 32. Administrator authentication

Founder/admin access requires stronger protection than ordinary learner login.

At production:

- MFA/passkey-capable control account;
- MFA on GitHub;
- MFA on Supabase;
- MFA on Vercel;
- MFA on domain registrar;
- minimal number of privileged accounts.

Do not create a hidden `/admin?secret=...` security model.

---

# 33. Hosting — Vercel

Deploy the Next.js application to Vercel initially.

Reasons:

- simplest mature Next.js deployment path;
- preview deployments;
- CDN;
- TLS;
- WAF/DDoS capabilities;
- environment management;
- logs/observability;
- rollback;
- low founder operational burden.

Next.js remains portable to another Node/Docker host if costs or constraints later justify migration.

---

# 34. Vercel plan rule

Use Vercel's free Hobby tier only for non-commercial personal development where its current terms allow.

Before commercial/public production use:

> move to an appropriate paid plan.

At the time of this decision, Vercel lists Pro at **US$20/month** and describes Hobby as personal/non-commercial.

Pricing is operational metadata, not a permanent architecture assumption.

Recheck before launch.

---

# 35. Supabase plan rule

Local/private development can begin on free infrastructure.

Before meaningful external beta/production:

> use a plan providing production-appropriate backup/availability behaviour.

At the time of this decision, Supabase Pro starts at **US$25/month** and includes daily backups retained for 7 days.

The Free plan can pause after inactivity and does not provide the same production backup capability.

Recheck before launch.

---

# 36. Bootstrap infrastructure cost

Current approximate minimum paid infrastructure for a commercial external beta:

```text
Vercel Pro       ~$20/month
Supabase Pro     ~$25/month
                 ------------
base             ~$45/month
```

plus:

- domain;
- email usage if beyond free allowance;
- optional monitoring.

There is **no learner-runtime AI inference cost in the initial launch**.
AI development/content-production expenditure is tracked separately.

This remains comfortably within the Phase 0 bootstrap model.

Development can begin at near-zero incremental infrastructure cost.

---

# 37. Environment topology

Use:

```text
LOCAL
PREVIEW/TEST
PRODUCTION
```

Phase 1 does not require a permanently running dedicated staging environment from day one.

Vercel preview deployments can serve feature/review workflows.

For database safety:

- local Supabase for normal development/testing;
- production Supabase isolated;
- optional dedicated remote test/staging project when integration testing requires it.

Never run destructive test resets against production.

---

# 38. Environment variables

Use environment-separated secrets.

Rules:

- `.env.example` contains names, never secrets;
- `.env*` with real values ignored by Git;
- Vercel production/preview secrets separate;
- Supabase service-role credentials server-only;
- AI-provider credentials server-only;
- SMTP credentials server/provider-side only.

Only deliberately public values may use `NEXT_PUBLIC_*`.

---

# 39. Content/admin interface

Build the first content-authoring/review tooling inside the same Next.js application under a strongly protected admin route.

Why not an external CMS:

- the content model is highly domain-specific;
- assertions/misconceptions/provenance are relational;
- deterministic question rules need custom editors/validation;
- publication governance is bespoke.

The first admin interface can be functional rather than beautiful.

Learner UX remains the design priority.

---

# 40. Admin capabilities in Phase 1

Minimum:

- source/version registration;
- assertion review/edit;
- provenance mapping;
- curriculum mapping;
- relationship/prerequisite editing;
- lesson draft/edit;
- question-family editor;
- deterministic variant preview;
- validator output;
- approval/publication;
- audit history.

Bulk AI-assisted generation can initially run through scripts/controlled jobs rather than a polished admin UI.

---

# 41. Content import/export format

Define a versioned JSON schema for candidate/import content.

Use Zod to validate it.

Example uses:

- AI assertion candidate batch;
- AI verifier result;
- question-family candidate;
- lesson candidate.

Never import unvalidated AI JSON directly into approved tables.

---

# 42. No runtime AI in the initial learner product

The initial launch must have:

> **no learner-runtime AI dependency**

The learner-facing product must operate through:

- governed lessons;
- deterministic question generation;
- deterministic marking;
- deterministic evidence extraction;
- deterministic mastery updates;
- deterministic diagnostic logic;
- deterministic remediation selection;
- deterministic next-activity selection;
- pre-approved explanations and teaching content.

Normal learner actions must not call an LLM.

This includes:

- lesson delivery;
- ordinary feedback;
- diagnosis;
- remediation;
- progress;
- readiness;
- question selection.

The base product must remain fully usable if all external AI providers
are unavailable.

---

# 43. AI is a development/content-production tool initially

AI remains heavily used behind the scenes for:

- candidate assertion generation;
- independent assertion verification;
- curriculum/content analysis;
- question-family drafting;
- explanation drafting;
- remediation drafting;
- code development;
- test generation;
- review assistance.

These operations are part of the development/content-production
pipeline, not learner runtime.

They may run:

- manually;
- through controlled scripts;
- through internal/admin tooling;
- through development jobs.

No AI-development credential or provider SDK should be exposed to the
learner client.

---

# 44. Development AI abstraction

Where internal tooling calls model APIs programmatically, isolate those
calls behind a small development/content-production adapter.

A possible later package is:

```text
packages/content-ai
```

This package is **not part of the learner runtime dependency graph**.

Responsibilities might include:

```text
generateAssertionCandidates()
verifyAssertionCandidates()
draftExplanation()
draftQuestionFamily()
```

Domain engines must not depend on it.

This keeps AI-assisted content production replaceable by:

- another provider;
- local models;
- manual workflows;
- future internal tooling.

---

# 45. Structured AI outputs for content production

AI-assisted development/content operations should return validated
structured schemas where possible.

Flow:

```text
model response
↓
Zod parse
↓
reject malformed
↓
candidate / verification record
↓
governed content pipeline
```

Do not parse prose with fragile regular expressions where structured
output is available.

Provider/model metadata should be retained for generated/verified
content as defined in WP1.8.

---

# 46. Future optional AI tutor

A future higher-priced tier may add an **optional AI tutor**.

Possible learner functions:

- explain this another way;
- answer a bounded follow-up;
- give another example;
- converse about approved lesson content;
- help interpret a learner's question.

This is explicitly **not required for initial launch**.

If introduced, it must:

- sit behind a server-side provider-neutral tutor interface;
- use approved/governed knowledge as its grounding boundary;
- have explicit rate/cost limits;
- fail gracefully without affecting the deterministic core product;
- never become the authoritative learner-state or marking engine;
- be separately entitlement-gated so base-tier users do not incur AI
  cost;
- preserve the same security/privacy standards as the core product.

The tutor is an enhancement layer, not the architecture's foundation.

---

# 47. AI economics

Initial learner-runtime AI cost target is:

> **£0 per learner because the launch product performs no runtime model
> inference.**

Development/content-production AI cost is tracked separately as a
content-development expense.

If a premium AI tutor is introduced later:

- track inference cost per entitled user;
- price the tier to cover that cost comfortably;
- enforce quotas/rate limits where appropriate;
- keep non-AI learning functionality available independently.

The Phase 0 low-AI-cost principle therefore becomes stronger for the
initial launch: routine learner inference cost is zero.

---

# 48. Background work

Do not deploy Redis/Celery/Kafka/etc. in the first proving slice.

Use synchronous work for fast bounded tasks.

When durable asynchronous work becomes necessary, preferred first option:

> **Supabase Queues / pgmq**

because it is PostgreSQL-native and avoids another infrastructure service.

Candidate uses:

- content AI batches;
- evidence recomputation;
- exports;
- source update analysis.

---

# 49. Queue exposure rule

Queues are server/internal infrastructure.

Do not expose queue APIs directly to learners.

Use trusted workers/server functions.

RLS/permissions remain explicit if any queue interface becomes externally reachable.

---

# 50. Worker execution

Do not commit to a permanent worker provider before the first real queued task exists.

Options when required:

- scheduled/server function consumer;
- Supabase Edge Function;
- small dedicated worker process.

Choose based on duration/retry/runtime needs.

The queue contract should not depend on one worker host.

---

# 51. Product analytics

Initially store first-party product events needed for UX evaluation.

Examples:

- lesson started/completed;
- remediation offered/accepted/deferred;
- diagnostic branch entered;
- session completed;
- resume used.

Do not store canonical mastery only in analytics.

No third-party analytics SDK is required for the proving slice.

This reduces:

- privacy complexity;
- browser JavaScript;
- cost;
- vendor dependency.

---

# 52. Observability

Initial observability:

```text
Next.js structured JSON logs
Vercel runtime logs
Supabase database/auth logs
application audit/security events
Core Web Vitals capture
```

Before wider external beta, evaluate whether a dedicated error tracker such as Sentry materially improves:

- exception grouping;
- browser error visibility;
- alerting.

Do not add telemetry vendors by habit.

---

# 53. Logging format

Every important server request/job should be able to include:

- correlation/request ID;
- operation;
- application version;
- safe actor ID;
- duration;
- outcome;
- error class.

Never log:

- OTP;
- magic link;
- auth token;
- service key;
- raw proprietary source;
- unnecessary learner free text.

---

# 54. Rate limiting

Layered approach:

## Authentication

Use/configure Supabase Auth rate limits.

## Application endpoints

Implement a central application rate-limit interface.

For Phase 1 low volume, a PostgreSQL-backed implementation is acceptable.

Possible future replacement:

- distributed Redis/edge limiter

without changing endpoint code.

High priority:

- AI endpoints;
- content bulk generation;
- search;
- export;
- report issue;
- privileged mutations.

---

# 55. Security headers

Configure production security headers in Next.js/Vercel, including as appropriate:

- Content-Security-Policy;
- Strict-Transport-Security;
- X-Content-Type-Options;
- Referrer-Policy;
- Permissions-Policy;
- frame protection through CSP `frame-ancestors`.

Do not copy an internet CSP blindly.

Build the CSP from the actual resources the product needs and test it.

---

# 56. Content Security Policy strategy

Begin restrictive.

Preferred direction:

```text
default-src 'self'
```

then explicitly allow required:

- Vercel/Next assets;
- Supabase connections;
- auth assets;
- necessary fonts/images;
- selected monitoring provider if used.

Avoid broad:

```text
script-src *
```

or widespread `unsafe-eval`/`unsafe-inline` in production.

Exact policy depends on implementation.

---

# 57. Security Verification Matrix implementation

Create:

```text
docs/security/SECURITY-VERIFICATION-MATRIX.md
```

during WP1.10.

Columns conceptually:

```text
ID
standard/version
requirement
applicability
control
test/evidence
status
exception
```

Baseline hierarchy remains:

```text
OWASP ASVS 5.0.0
→ application security verification

NIST SP 800-218 SSDF 1.1
→ secure development lifecycle

OWASP Top 10:2025
→ risk cross-check

Applicable CIS Benchmarks
→ technology-specific hardening
```

---

# 58. CIS applicability

Because Vercel and Supabase are managed platforms, the project does not control every underlying host/OS setting.

WP1.10 should perform an applicability review for:

- PostgreSQL benchmark recommendations exposed to us;
- GitHub/repository security guidance;
- container/OS guidance if self-hosted components are introduced later.

Where a CIS recommendation applies to a layer managed entirely by the provider and cannot be configured by us:

> mark it not directly applicable with rationale.

Do not claim blanket CIS compliance.

---

# 59. Testing stack

Use:

```text
Vitest
→ domain/unit tests

React Testing Library
→ component behavioural tests

Playwright
→ browser end-to-end tests

@axe-core/playwright
→ automated accessibility checks

pgTAP
→ PostgreSQL/RLS/schema tests
```

This gives each layer an appropriate test tool.

---

# 60. Unit test priorities

The highest-value unit-test targets are:

- formula calculations;
- unit conversions;
- deterministic parameter generation;
- rounding/tolerance;
- evidence weighting;
- learner-state transition;
- diagnostic candidate generation;
- hypothesis ranking;
- remediation selection;
- transfer classification.

These are the intellectual core of the product.

---

# 61. Property-based / generative testing

For deterministic question families, generate many valid parameter combinations and assert invariants.

Examples:

- correct answer always satisfies formula;
- parallel total resistance remains below smallest positive branch resistance;
- distractors never duplicate correct answer;
- generated values remain inside authored bounds.

A lightweight property-testing library may be adopted if useful.

The requirement matters more than the library.

---

# 62. Component testing

Test learner-facing components by behaviour, not implementation details.

Examples:

- entire answer option is clickable;
- keyboard selection works;
- submitted state is announced;
- feedback disclosure opens;
- invalid numeric input is understandable;
- remediation can be deferred.

Use accessible roles/labels in tests.

---

# 63. End-to-end test journeys

Required proving journeys:

## Journey A — new learner

```text
sign in
→ choose qualification
→ Unit 202
→ start lesson
→ complete teaching/check
→ progress persists
```

## Journey B — algebra weakness

```text
wrong V-I-R
→ relationship passes
→ transposition fails
→ Maths remediation
→ Maths retest
→ Electrical transfer
→ return to lesson
```

## Journey C — parallel misconception

```text
parallel failure
→ concept/reciprocal discrimination
→ targeted remediation
→ transfer
```

## Journey D — minimal feedback

```text
Quick feedback
→ wrong answer
→ concise correction
→ continue
```

## Journey E — cross-user security

```text
User A
→ attempt User B resource
→ denied
```

---

# 64. Accessibility testing

Automated Playwright + axe checks run on core pages.

Manual Phase 1 checks:

- keyboard-only learner journey;
- representative screen reader;
- 200–400% zoom/reflow;
- narrow real phone;
- touch targets;
- visible/unobscured focus;
- meaningful diagram alternative.

Automated accessibility PASS does not mean WCAG compliance is proven.

---

# 65. Performance testing

Measure production-like build.

Targets from WP1.7:

- LCP ≤2.5 s;
- INP ≤200 ms;
- CLS ≤0.1;

at good-threshold field standards when real-user data becomes available.

Additionally:

> deterministic answer submission/feedback should feel near-immediate.

No AI call belongs in that critical path.

---

# 66. CI — GitHub Actions

Use GitHub Actions for Continuous Integration.

On pull request / relevant push, run:

```text
install from lockfile
typecheck
lint
unit tests
component tests
database migration reset
database/RLS tests
content validation/lint
build
selected Playwright tests
secret/dependency/security checks
```

Heavier browser suites can be split if runtime becomes excessive.

---

# 67. Package manager

Stay with:

> **npm**

initially.

Reason:

- founder already uses it;
- Node/npm already installed;
- npm workspaces are sufficient;
- no need to introduce pnpm/Yarn solely for preference.

Use:

```text
package-lock.json
npm ci
```

in CI.

---

# 68. Repository structure

Recommended structure:

```text
adaptive-learning-platform/
│
├─ README.md
├─ CHANGELOG.md
├─ package.json
├─ package-lock.json
├─ tsconfig.base.json
│
├─ apps/
│  └─ web/
│     ├─ app/
│     ├─ components/
│     ├─ modules/
│     └─ public/
│
├─ packages/
│  ├─ domain/
│  ├─ calculation-engine/
│  ├─ evidence-engine/
│  ├─ diagnostic-engine/
│  ├─ learning-engine/
│  ├─ content-schema/
│  ├─ content-ai/          # internal/dev tooling only when needed
│  ├─ ui/
│  └─ test-fixtures/
│
├─ supabase/
│  ├─ config.toml
│  ├─ migrations/
│  ├─ seed.sql
│  └─ tests/
│
├─ scripts/
│  └─ content/
│
├─ tests/
│  └─ e2e/
│
└─ docs/
   ├─ governance/
   ├─ research/
   ├─ architecture/
   ├─ product/
   ├─ security/
   ├─ business/
   └─ phases/
```

This is one repository and one primary application.

The packages are code boundaries, not deployed microservices.

---

# 69. Why a small workspace structure

The project needs stronger boundaries than one giant `src/` directory because:

- AI sessions need bounded context;
- core learning logic must remain framework-independent;
- content tooling shares schemas;
- future verticals reuse engines;
- regression testing becomes easier.

But avoid creating dozens of packages.

Start with only those actually needed.

---

# 70. Dependency direction

Preferred dependency direction:

```text
domain
  ↑
calculation / evidence / diagnosis / learning
  ↑
application services
  ↑
Next.js UI/API
```

UI must not become the source of business rules.

The domain layer must not import Next.js.

---

# 71. Module ownership

Business rules live close to their domain.

Examples:

```text
calculation-engine
→ formula and numerical rules

evidence-engine
→ attempt-to-evidence transformation

diagnostic-engine
→ hypothesis/probe logic

learning-engine
→ lesson sequencing/next activity

content-schema
→ import/export schemas

content-ai
→ development/content-generation adapters only; never imported by
  learner runtime/domain engines
```

Avoid generic `utils.ts` becoming a dumping ground.

---

# 72. ADR set

WP1.10 should create formal Architecture Decision Records for at least:

```text
ADR-001 — TypeScript + Next.js modular monolith
ADR-002 — Supabase PostgreSQL/Auth/RLS
ADR-003 — Vercel hosting
ADR-004 — Passwordless OTP + production SMTP
ADR-005 — Data-access and privileged-service pattern
ADR-006 — Framework-independent deterministic engines
ADR-007 — Testing and CI architecture
ADR-008 — Governed in-app content/admin tooling
ADR-009 — Background jobs / Supabase Queues when required
ADR-010 — Development/content AI isolation and future optional tutor boundary
ADR-011 — Security standards and verification matrix
ADR-012 — Design system / Tailwind / shadcn open-code primitives / accessibility baseline
ADR-013 — Governed development environment; Replit excluded from primary workflow
```

Each ADR records:

- context;
- decision;
- alternatives;
- consequences;
- review trigger.

---

# 72.1 Development environment decision — no Replit dependency

Replit is **not** part of the primary governed development or deployment
workflow.

The project remains:

```text
local repository
→ VS Code
→ Claude Code for bounded implementation
→ Git/GitHub
→ CI/review
→ Vercel/Supabase deployment
```

Replit or another browser-based AI app builder may be used later as an
isolated disposable scratch/prototyping environment only if useful.

It must not become:

- the source of truth;
- the only copy of application state/code;
- the architecture authority;
- the production deployment dependency;
- a bypass around ADRs, tests, migrations or review.

Reason:

The project's main implementation risk is not inability to generate UI
quickly. It is **AI-assisted architectural drift** as the application
grows.

A local Git-controlled repository with bounded Claude Code tasks,
reviewable diffs, tests and explicit architecture documents gives the
Product Owner stronger control despite having limited development
experience.

---

# 73. Alternatives explicitly rejected for Phase 1

## Separate React SPA + separate API

Rejected initially:

- extra deployment;
- duplicated routing/config;
- more auth complexity;
- little benefit for proving slice.

## Microservices

Rejected:

- operational burden;
- tracing/deployment complexity;
- no demonstrated scale need.

## Dedicated graph database

Rejected:

- PostgreSQL can satisfy current graph requirements.

## Custom auth

Rejected:

- needless security risk.

## Large LMS/CMS platform

Rejected:

- poor fit for structured assertion/evidence/diagnostic model.

## Runtime LLM dependency in the initial product

Rejected:

- unnecessary inference cost;
- availability dependency;
- weaker reproducibility;
- weaker governance;
- deterministic core is sufficient for launch.

## Live LLM question generation

Rejected:

- weak reproducibility/governance/cost;
- incompatible with the launch architecture.

## Replit as primary development/build environment

Rejected for the governed product workflow:

- adds another autonomous application-building layer;
- can obscure architectural drift behind rapid generation;
- does not improve the project's central need for bounded,
  reviewable Git-controlled implementation;
- the existing VS Code + Claude Code + GitHub workflow provides better
  control for this architecture.

It remains acceptable for disposable experiments that do not become the
canonical codebase.

## Kubernetes

Rejected:

- no Phase 1 problem it solves.

---

# 74. Vendor-lock-in assessment

There is deliberate managed-service dependence, but not total architectural lock-in.

## Low/moderate lock-in

- Next.js can run on Node/Docker elsewhere.
- PostgreSQL is standard.
- SQL migrations remain owned.
- Resend uses standard SMTP.
- development/content AI tooling is provider-isolated;
- future optional tutor can use a provider-neutral adapter without affecting the core.

## Higher coupling

- Supabase Auth/RLS helper functions;
- Supabase generated APIs;
- Vercel deployment conveniences.

Accept this because:

- it materially reduces bootstrap complexity;
- the core knowledge/content/learner data remains PostgreSQL;
- business rules remain in TypeScript packages.

Avoid unnecessary use of proprietary platform primitives when standard PostgreSQL/application code is sufficient.

---

# 75. Backups and recovery

Development:

- migrations + seed reconstruct schema/test data.

Production external beta:

- Supabase production backup capability enabled through appropriate paid plan;
- periodic independent logical export considered;
- at least one restore drill before meaningful scale.

Document:

- recovery procedure;
- who can restore;
- latest tested restore date.

---

# 76. Content/IP storage rule

Do not store proprietary source PDFs in:

- application repository;
- Vercel public assets;
- learner Supabase storage;
- production embedding store.

Controlled content-development source storage remains separate.

Production retains:

- source metadata;
- versions;
- semantic locators;
- governed derived assertions/content.

---

# 77. PWA direction

Build responsive web first.

Do not implement offline sync in proving slice.

Permit later PWA features:

- installable metadata;
- icons;
- home-screen installation.

Only add service-worker/offline caching after explicit design because learner-state synchronisation becomes more complex.

---

# 78. Browser support

Initial target:

- current mainstream Chrome/Chromium;
- current Safari/WebKit;
- current Firefox;
- modern mobile browsers corresponding to these engines.

Exact minimum versions should be recorded when implementation begins.

Tailwind v4's own browser support floor must be considered when setting this matrix.

Do not promise obsolete browser support that materially degrades the product.

---

# 79. Security gates before external beta

Before inviting external users:

```text
AUTH
✓ production SMTP
✓ OTP/session settings reviewed
✓ admin MFA

DATA
✓ RLS enabled
✓ cross-user tests
✓ production backup plan

APP
✓ CSP/security headers
✓ safe errors
✓ rate limiting
✓ input schemas
✓ privileged routes protected

SUPPLY CHAIN
✓ lockfile
✓ dependency scan
✓ secret scan

UX
✓ WCAG automated + manual core checks
✓ mobile real-device test
✓ no major Core Web Vitals issue

OPERATIONS
✓ logs
✓ rollback
✓ restore procedure
✓ security matrix reviewed
```

---

# 80. Development workflow

For each bounded implementation task:

```text
1. ChatGPT prepares exact scope/acceptance criteria
2. User approves
3. Claude Code receives:
   - governing docs
   - target files/modules
   - non-goals
   - required tests
4. Claude implements
5. tests run
6. evidence produced
7. ChatGPT reviews result/diff
8. user accepts/rejects
9. commit
10. status document updated
```

Never instruct Claude:

> "continue building the platform."

---

# 81. Implementation principle — vertical slices

Do not build the entire database first, then entire backend, then entire frontend.

Build **thin end-to-end vertical slices**.

Each slice should create something observable by a learner or reviewer.

This reduces architecture drift.

---

# 82. WP1.10 implementation sequence

Recommended bounded implementation packages follow.

---

# 83. CC-01 — Repository foundation

Build:

- npm workspace;
- Next.js app;
- strict TypeScript;
- Tailwind;
- lint/typecheck/test scripts;
- base directory structure;
- design tokens;
- initial docs/ADR directory;
- GitHub Actions skeleton.

Acceptance:

- app runs locally;
- production build passes;
- tests run;
- CI runs.

No learner features yet.

---

# 84. CC-02 — Local Supabase + database baseline

Build:

- Supabase CLI local environment;
- initial migrations;
- seed/test data;
- generated DB types;
- source/curriculum/assertion minimum schema;
- RLS scaffolding;
- pgTAP tests.

Acceptance:

```text
supabase db reset
```

reconstructs successfully.

No production project needed yet.

---

# 85. CC-03 — Authentication + learner isolation

Build:

- Supabase Auth;
- passwordless OTP development flow;
- protected learner route;
- profile record;
- learner-owned test table;
- RLS;
- cross-user tests;
- logout/session handling.

Acceptance:

- two test users cannot access each other's rows;
- unauthenticated protected access denied.

This is the first security golden path.

---

# 86. CC-04 — Knowledge graph minimum

Implement only the first Ohm's-law neighbourhood:

- Maths assertions;
- Electrical assertions;
- relationships;
- source/version/locator;
- curriculum mappings;
- misconceptions.

Add seed/import path.

Acceptance:

- graph can answer required dependency queries;
- provenance traceable;
- mappings versioned.

---

# 87. CC-05 — Deterministic calculation/question engine

Implement:

- quantity/unit primitives;
- V-I-R relationship;
- formula orientation;
- parameterised question family;
- deterministic seeded variants;
- answer marking;
- tolerance;
- representative distractors;
- property/regression tests.

Acceptance:

- hundreds/thousands of generated test variants pass invariants;
- exact variant reproducible from seed/version.

This should be treated as a major engineering milestone.

---

# 88. CC-06 — First governed lesson

Implement learner-facing:

> Ohm's Law — Voltage, Current and Resistance

Include:

- lesson navigation;
- explanation;
- deterministic demonstration;
- guided practice;
- independent check;
- auto-save;
- mobile-first layout;
- accessible interaction.

Acceptance:

- brand-new learner can complete lesson without diagnostic assessment.

---

# 89. CC-07 — Evidence and learner state

Wire:

```text
answer
→ deterministic marking
→ attempt
→ evidence
→ learner assertion state
→ progress
```

Implement synthetic Algebra-Weak persona.

Acceptance:

- state changes are reproducible/explainable;
- question version/seed retained.

---

# 90. CC-08 — Diagnostic golden path

Implement:

> V-I-R relationship-selection vs formula-transposition weakness

Flow:

```text
wrong answer
→ hypothesis
→ relationship probe
→ transposition probe
→ Maths remediation
→ Maths retest
→ Electrical transfer
→ return to lesson
```

Acceptance:

- synthetic personas choose expected branch;
- ambiguity remains unresolved where designed;
- minimal-feedback route can continue without forced remediation.

This is the central Phase 1 product proof.

---

# 91. CC-09 — Content admin/governance minimum

Implement:

- candidate assertion view;
- AI verification metadata;
- validation status;
- approve/publish;
- first question-family editor/preview;
- audit events.

Acceptance:

- candidate cannot become learner-visible without required gate;
- published version remains immutable/history-preserving.

---

# 92. CC-10 — AI content pipeline proof

Implement a bounded content-development workflow:

```text
source metadata + bounded supplied source text
→ candidate assertion generation
→ independent AI verification
→ Zod validation
→ review queue
```

No raw proprietary source stored in production.

Acceptance:

- generation and verification metadata separately recorded;
- malformed/unsupported candidate rejected;
- no auto-publication.

---

# 93. CC-11 — Parallel circuits slice

Implement:

- parallel lesson;
- deterministic family;
- reciprocal prerequisite;
- concept vs arithmetic diagnosis;
- remediation;
- transfer.

Reuse existing engine rather than special-casing the lesson.

Architecture failure if major engine rewrites are required.

---

# 94. CC-12 — Electrical power slice

Implement:

- power lesson;
- formula families;
- Foundational Physics power link;
- transposition/relationship selection;
- transfer.

Again test reuse.

---

# 95. CC-13 — Learner home/progress/weak areas

Implement polished:

- Continue Learning;
- Unit progress;
- Weak Areas;
- recommendation;
- readiness placeholder/early band;
- cross-domain progress.

Do not build excessive analytics.

---

# 96. CC-14 — UX/security hardening

Complete:

- responsive edge cases;
- real-device tests;
- keyboard journey;
- axe/Playwright;
- CSP/security headers;
- rate limits;
- safe errors;
- auth/email production configuration plan;
- Security Verification Matrix;
- dependency/secret scans.

This is not optional final polish.

---

# 97. CC-15 — Production-like deployment

Deploy:

- Vercel;
- isolated Supabase project;
- environment secrets;
- controlled production migration;
- logs;
- backup configuration;
- rollback process.

Use synthetic/internal test accounts first.

Do not invite public users immediately.

---

# 98. CC-16 — Integrated proving-slice evaluation

Run:

- synthetic personas;
- full learner journeys;
- content pipeline metrics;
- performance checks;
- security tests;
- accessibility checks;
- founder learner trial;
- representative external usability testing.

This supplies WP1.11 evidence.

---

# 99. Claude Code task sizing

Each CC work package may still be too large for one Claude session.

Rule:

> split any package into a sequence of changes that can be reviewed and tested independently.

Example:

```text
CC-05A quantity/unit model
CC-05B formula model
CC-05C parameter generation
CC-05D answer marking
CC-05E distractors/property tests
```

The work-package number defines the goal.

The Claude session defines the smallest safely implementable change.

---

# 100. Commit discipline

Prefer small meaningful commits.

Examples:

```text
feat(calc): add quantity and unit primitives
feat(calc): add Ohm's-law formula model
test(calc): add generated variant invariants
feat(auth): protect learner routes with Supabase session
test(security): prove cross-user attempt isolation
```

Do not accumulate weeks of AI changes into one commit.

---

# 101. Definition of done for implementation tasks

A coding task is not done when:

> "the code was written."

It is done when applicable:

- acceptance criteria satisfied;
- tests pass;
- security impact considered;
- accessibility considered;
- documentation updated;
- migrations reproducible;
- no known secrets exposed;
- diff reviewed;
- evidence captured.

---

# 102. No premature optimisation

Do not add:

- Redis;
- separate worker cluster;
- graph database;
- search service;
- API gateway;
- service mesh;
- Kubernetes;
- event-stream platform;
- multi-region database;

without a measured/functional need.

The interfaces should permit future evolution.

The infrastructure should remain simple.

---

# 103. Performance/scaling triggers

Revisit architecture only when evidence shows issues such as:

- bounded graph queries become slow;
- database connection pressure;
- background tasks exceed server-function limits;
- rate limiter causes DB contention;
- heavy content search needs indexing beyond PostgreSQL;
- learner traffic causes clear latency/cost problem.

Each change should have a measured trigger.

---

# 104. Security review triggers

Perform deeper security review:

- before external beta;
- before payment launch;
- before institutional/B2B access;
- before adding file uploads;
- before adding any future learner-facing AI tutor/free-text model interaction;
- before adding organisation-level tutor data access;
- after major auth/data-boundary change.

Independent penetration testing becomes appropriate before meaningful scale, not necessarily before the first handful of controlled testers.

---

# 105. IP/legal review trigger

Focused legal/IP review remains required before:

- production-scale proprietary-source AI processing;
- commercial reliance on uncertain source-use assumptions;
- distributing anything derived in a way that may reproduce protected expression.

Do not block the small controlled proving slice if the work remains within the approved development/reference boundary and founder-accepted risk posture.

---

# 106. Cost gates

Infrastructure should scale only when needed.

Development:

> target essentially free/very low incremental infrastructure cost.

External commercial beta:

> current baseline approximately US$45/month before domain/email/AI usage.

Any new paid service should answer:

1. what concrete problem does it solve?
2. why can't current stack solve it?
3. what is its monthly cost?
4. what is the migration/lock-in consequence?
5. can it wait until revenue?

---

# 107. Phase 1 technical exit conditions

The technical architecture succeeds if:

- the three proving lessons use the same engine;
- no lesson requires bespoke hard-coded diagnostic logic;
- deterministic variants are reproducible;
- learner evidence is persistent/auditable;
- RLS blocks cross-user access;
- lesson-led and assessment-led routes coexist;
- content publication is governed;
- AI generation/verification remains entirely outside learner runtime at initial launch;
- the proving slice remains fully functional with no model-provider connection;
- mobile/accessibility standards hold;
- security controls have evidence;
- deployment is reproducible;
- adding more Unit 202 content is primarily content work, not architecture rewrite.

---

# 108. Risks in the selected stack

## Risk A — Supabase coupling

Mitigation:

- PostgreSQL-first schema;
- SQL migrations;
- business logic in TypeScript;
- avoid unnecessary proprietary primitives.

## Risk B — Next.js complexity/change rate

Mitigation:

- pin versions;
- follow official App Router guidance;
- keep domain packages framework-independent;
- use standard web primitives.

## Risk C — Vercel cost growth

Mitigation:

- monitor usage;
- Next.js remains deployable elsewhere;
- no Vercel-only business logic.

## Risk D — RLS mistakes

Mitigation:

- deny-by-default;
- pgTAP;
- cross-user integration tests;
- security matrix.

## Risk E — AI-generated code drift

Mitigation:

- ADRs;
- module contracts;
- bounded Claude sessions;
- tests;
- ChatGPT review;
- small commits.

## Risk F — founder operational overload

Mitigation:

- managed services;
- minimal vendor count;
- automatic CI/deploy;
- no self-hosted production infrastructure initially.

---

# 109. Architecture decisions recommended for approval

Approve the following as the Phase 1 implementation baseline:

1. TypeScript strict mode end-to-end.
2. Next.js App Router modular monolith.
3. React learner UI.
4. Tailwind CSS v4 + project-owned design system.
5. Supabase managed PostgreSQL.
6. Supabase Auth passwordless-first.
7. PostgreSQL RLS for learner-owned data.
8. Supabase SQL migrations/local CLI.
9. No ORM initially.
10. Vercel hosting.
11. Resend custom auth SMTP before external production.
12. Zod v4 boundary/AI-schema validation.
13. Vitest + Testing Library + Playwright + axe + pgTAP.
14. GitHub Actions CI.
15. npm workspaces/package-lock.
16. deterministic framework-independent engine packages.
17. no runtime AI in the initial learner product.
18. development/content AI is isolated from learner runtime and provider-specific dependencies.
19. future AI tutor, if introduced, is an optional entitlement-gated enhancement behind a provider-neutral server interface.
20. no dedicated queue until needed; Supabase Queues/pgmq preferred first.
21. first-party product-event analytics initially.
22. in-app custom admin/content tooling rather than generic CMS.
23. versioned JSON candidate/import schemas.
24. ASVS/NIST/OWASP/CIS verification hierarchy from WP1.6.
25. external beta requires production-quality auth email, backups, security/UX gates.
26. thin vertical-slice implementation order.
27. no premature microservices/graph DB/Kubernetes/Redis.
28. selective shadcn/ui open-code primitives are the default starting
    source for commodity UI components, subject to project UX/accessibility
    review.
29. no wholesale UI theme/template or component-catalogue import.
30. Replit is not part of the primary governed development/deployment
    workflow; local Git/VS Code/Claude Code remains canonical.

---

# 110. Decision recommendation

**APPROVE WP1.9 as the technical architecture and implementation plan for Phase 1.**

The central decision is:

> **Build one production-shaped TypeScript/Next.js modular monolith, hosted on Vercel and backed by Supabase PostgreSQL/Auth/RLS. Keep all initial learner-facing educational intelligence in framework-independent deterministic packages with zero runtime AI dependency. Use AI extensively for development and governed content generation/verification outside the learner runtime. A future premium AI tutor may be added as a separate entitlement-gated enhancement without changing the deterministic core. Use selective open-source shadcn/ui primitives for solved commodity interactions while retaining project ownership of the code and design system; keep the canonical implementation in the local Git/VS Code/Claude Code workflow rather than an autonomous app-builder such as Replit. Make the database, migrations and security controls reproducible and testable, and implement the proving slice as a sequence of thin end-to-end increments rather than large horizontal infrastructure phases.**

This stack should let a founder using AI build the proving slice quickly while preserving the architectural, security, UX and governance standards already approved.

---

# 111. Next work package

On approval of WP1.9, proceed to:

> **WP1.10 — Build the Proving Slice**

WP1.10 should not begin with a single giant Claude Code prompt.

The first implementation action should be:

> **CC-01 — Repository Foundation**

Before CC-01 begins, create the corresponding ADR skeletons and a concise `PROJECT-STATUS.md` recording:

- current phase;
- approved work packages;
- selected stack;
- current implementation package;
- known blockers;
- last accepted commit.

This gives both the Product Owner and future AI sessions a durable source of current project state.

---

# 112. Official technical research basis reviewed for WP1.9

Current official documentation was checked during preparation of this work package, including:

- Next.js App Router and production guidance;
- Next.js deployment/security-header/CSP guidance;
- Supabase Auth, RLS, local-development, migration, database-testing,
  queue and production guidance;
- Vercel deployment/pricing/environment/logging information;
- Tailwind CSS v4 documentation;
- Zod v4 documentation;
- Vitest documentation;
- Testing Library documentation;
- Playwright accessibility-testing documentation;
- GitHub Actions documentation;
- Resend/Supabase SMTP documentation;
- OWASP ASVS project guidance.

Technology versions, pricing and provider plan capabilities are
time-sensitive and must be rechecked before external production launch.

---

**End of WP1.9**
