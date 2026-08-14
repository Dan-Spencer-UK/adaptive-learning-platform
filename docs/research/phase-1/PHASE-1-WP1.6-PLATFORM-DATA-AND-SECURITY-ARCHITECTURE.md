# Phase 1 — WP1.6: Platform, Data & Security Architecture

**Status:** Draft v0.2 for Product Owner review  
**Date:** 14 August 2026  
**Phase:** Phase 1 — Architecture & End-to-End Proving Slice  
**Depends on:** Approved WP1.1–WP1.5  
**Purpose:** Define the production-shaped SaaS, data, security, operational and scalability architecture required to implement the governed knowledge, teaching, evidence and diagnostic models without prematurely committing to specific vendors or frameworks.

---

# 1. Purpose

WP1.6 defines **how the product must behave as a secure SaaS system**.

It does not yet choose:

- frontend framework;
- backend framework;
- cloud provider;
- database vendor;
- authentication vendor;
- hosting provider;
- queue provider;
- analytics vendor.

Those decisions belong primarily to WP1.9.

WP1.6 defines the requirements that those choices must satisfy.

The governing principle is:

> **Build production-shaped, not production-sized.**

The proving slice may initially have only a handful of users and roughly 80–150 assertions, but the architecture must not rely on assumptions that make later secure growth to thousands or millions of users require a fundamental rewrite.

---

# 2. Architectural objectives

The platform must support:

1. secure learner accounts;
2. passwordless-first authentication;
3. strict user/tenant data isolation;
4. governed knowledge/content administration;
5. learner-facing teaching and assessment;
6. persistent learner evidence;
7. deterministic learner-state updates;
8. diagnostic episodes;
9. lesson/programme progression;
10. question generation and deterministic marking;
11. auditability;
12. background jobs;
13. observability;
14. backups/recovery;
15. controlled deployment;
16. future B2B organisations/cohorts;
17. eventual international expansion.

---

# 3. High-level system boundaries

The initial system should conceptually contain:

```text
                         ┌────────────────────┐
                         │   LEARNER CLIENT   │
                         │ web / mobile-first │
                         └─────────┬──────────┘
                                   │
                                   ▼
                         ┌────────────────────┐
                         │ APPLICATION/API    │
                         │ trusted server     │
                         └──────┬─────┬───────┘
                                │     │
                 ┌──────────────┘     └──────────────┐
                 ▼                                   ▼
        ┌──────────────────┐                ┌──────────────────┐
        │ RELATIONAL DATA  │                │ BACKGROUND JOBS  │
        │ + security rules │                │ async/slow work  │
        └──────────────────┘                └──────────────────┘
                 │
       ┌─────────┼──────────┐
       ▼         ▼          ▼
   knowledge   learner    content
    /source     state      /lesson
     data       data        data
```

Administrative/content-authoring functions may initially share the same deployed application if securely separated by authorisation.

Phase 1 does not require microservices.

---

# 4. Modular monolith first

The preferred conceptual architecture for Phase 1 is a **modular monolith**.

A modular monolith is:

> one deployable application organised into clear internal modules, rather than many independent network services.

Suggested modules include:

- identity/account;
- knowledge/provenance;
- curriculum;
- teaching/lessons;
- questions/content;
- learner evidence;
- mastery;
- diagnosis/remediation;
- progress/readiness;
- administration;
- audit/operations.

Why this matters:

- simpler to build;
- cheaper to operate;
- easier to test;
- easier to debug;
- fewer distributed-system failure modes;
- can still preserve strong internal boundaries.

If scale later justifies extracting a service, modular boundaries make that easier.

---

# 5. Stateless application principle

Application servers should be stateless where practical.

This means important durable state should not live only in one server's memory.

Persist state in:

- database;
- cache where appropriate;
- queue/job store;
- object storage where appropriate.

This allows multiple application instances to serve users later.

---

# 6. Primary data-store model

The core platform should use a **relational database**.

A relational database stores structured data in related tables and is well suited to:

- users;
- knowledge assertions;
- versions;
- source provenance;
- curriculum mappings;
- lessons;
- question families;
- learner evidence;
- mastery state;
- diagnostic episodes;
- audit logs.

The knowledge model is graph-like, but that does not require a dedicated graph database for Phase 1.

Typed relationships can be represented relationally and traversed efficiently with appropriate indexes and queries.

---

# 7. Why not a graph database initially?

A graph database may eventually become useful if relationship traversal becomes a demonstrated bottleneck.

It is not justified merely because we use the phrase "knowledge graph."

Phase 1 requires:

- moderate graph depth;
- explicit typed relationships;
- bounded diagnostic neighbourhoods.

A mature relational database can support this cleanly.

Avoid adding another database technology without measured need.

---

# 8. Major data domains

The application database should conceptually separate:

## 8.1 Identity/account data

- user;
- profile;
- authentication linkage;
- account status;
- preferences.

## 8.2 Knowledge data

- domains;
- assertions;
- assertion versions;
- relationships;
- misconceptions;
- quantities/units;
- strategies.

## 8.3 Source/provenance data

- sources;
- source versions;
- locators;
- rights classifications;
- provenance links.

## 8.4 Curriculum data

- qualifications;
- versions;
- units/modules;
- learning outcomes;
- assessment criteria;
- mappings.

## 8.5 Teaching/content data

- learning programmes;
- learning paths;
- lessons;
- lesson versions;
- contextual wrappers;
- explanations;
- demonstrations;
- question families;
- question versions;
- variants;
- remediation.

## 8.6 Learner data

- lesson progress;
- attempts;
- responses;
- evidence;
- learner-assertion state;
- strategy evidence;
- diagnostic episodes;
- readiness/progress summaries;
- deferred weaknesses.

## 8.7 Operational/audit data

- audit events;
- content approvals;
- administrative actions;
- job records;
- security events.

---

# 9. Knowledge data versus learner data

This separation is mandatory.

Knowledge/content objects are shared.

Learner state is user-specific.

Conceptually:

```text
SHARED:
assertion
lesson
question family

PER LEARNER:
attempt
evidence
mastery state
lesson progress
diagnostic episode
```

Do not duplicate knowledge objects per learner.

---

# 10. Immutable history where it matters

Historical learner evidence must refer to exact content/assertion versions.

Therefore:

- question versions are immutable once materially used;
- assertion versions retain history;
- lesson versions retain history where learner evidence depends on them;
- corrections create new versions or invalidation records.

Do not destructively overwrite historical meaning.

---

# 11. Authentication

The preferred initial direction is **passwordless-first authentication**.

Possible user experiences later include:

- email magic link;
- emailed one-time code;
- Continue with Google;
- Continue with Apple;
- institutional SSO later.

The final provider is not selected in WP1.6.

---

# 12. Why passwordless-first

Benefits include:

- no password database for the product to manage;
- fewer password-reset support flows;
- reduced credential-reuse risk;
- lower signup friction;
- good fit for consumer SaaS.

It does not remove all authentication risk.

---

# 13. Passwordless security requirements

Authentication must support:

- short-lived login tokens/codes;
- single-use tokens/codes;
- rate-limited email sends;
- safe redirect validation;
- secure session management;
- account-enumeration resistance;
- authentication-event logging;
- secure email-change flow;
- recovery process;
- session revocation;
- logout from current/all devices later if appropriate.

Administrative roles may require stronger authentication later.

---

# 14. Authentication versus authorisation

These are separate.

**Authentication** asks:

> Who are you?

**Authorisation** asks:

> What are you allowed to do?

A signed-in learner must not automatically gain access to:

- another learner's data;
- unpublished content;
- admin screens;
- content approval;
- source-management functions.

---

# 15. Server-side authorisation

All sensitive authorisation checks must be enforced on the server side.

Hiding a button in the browser is not security.

Examples:

- learner may read own evidence;
- learner may not read another learner's evidence;
- content author may edit draft content if permitted;
- reviewer may approve content;
- ordinary learner may not call admin APIs directly.

---

# 16. Row Level Security

Where the selected database/platform supports it, **Row Level Security (RLS)** should be enabled for learner-owned/user-sensitive tables.

RLS means:

> the database itself applies rules controlling which rows a user/request can access.

Examples:

- learner A can read learner A's attempts;
- learner A cannot read learner B's attempts.

RLS is defence-in-depth.

It does not replace application-level authorisation.

---

# 17. RLS default posture

For application/user/tenant-sensitive data:

> **deny by default; permit explicitly.**

Avoid tables that become publicly readable merely because frontend development is easier.

Shared approved public content can be exposed deliberately.

---

# 18. Service-role caution

Some server/service credentials may bypass RLS.

These must be:

- server-side only;
- tightly controlled;
- used only where required;
- never exposed to browser code;
- audited for privileged operations.

---

# 19. Future organisations/tenancy

Phase 1 is primarily B2C.

However, the architecture should leave room for:

```text
ORGANISATION
  ↓
COHORT
  ↓
LEARNER MEMBERSHIP
```

for later colleges/training providers.

Do not build full B2B management now.

Do avoid assumptions that every user will forever belong only to a single personal account with no organisational relationship.

---

# 20. Tenant isolation

When organisations are added, data isolation must remain explicit.

A tutor from Organisation A must not access Organisation B's cohort merely by changing an ID in a URL/API request.

This is an **object-level authorisation** requirement.

---

# 21. API boundary

The browser/client should communicate with trusted server-side APIs for privileged operations.

Do not put:

- private API keys;
- admin credentials;
- service-role database keys;
- unrestricted model-provider secrets;

into client-side code.

---

# 22. API design principles

APIs should:

- validate input;
- authenticate protected routes;
- authorise every protected object/action;
- limit payload size;
- paginate lists;
- use stable identifiers;
- return safe errors;
- avoid leaking internals;
- be versionable where necessary.

Exact REST/GraphQL/RPC style is deferred.

---

# 23. Input validation

All untrusted input must be validated.

Examples:

- IDs;
- text lengths;
- numerical responses;
- units;
- pagination;
- content-authoring fields;
- file uploads if introduced;
- redirect URLs.

Use allow-list/schema validation where practical.

---

# 24. Database injection protection

Database access must use:

- parameterised queries;
- trusted ORM/query tooling;
- no unsafe string-concatenated SQL from user input.

**ORM — Object-Relational Mapper** is software that maps application objects to relational database records. It can improve developer productivity, but it does not remove the need to understand SQL/query security.

---

# 25. Rate limiting

Rate limiting must exist from the beginning for abuse-sensitive endpoints.

Priority endpoints include:

- login/magic-link requests;
- OTP requests;
- passwordless verification;
- account recovery;
- AI/tutor endpoints;
- search;
- expensive question generation;
- exports;
- admin actions where appropriate.

---

# 26. Rate-limit dimensions

Later limits may consider:

- IP;
- user;
- organisation;
- endpoint;
- cost class.

Phase 1 does not need an elaborate adaptive abuse platform.

It does need a central mechanism that can enforce limits.

---

# 27. Resource limits

Protect expensive operations with:

- maximum page size;
- bounded graph traversal;
- bounded search;
- bounded export size;
- bounded AI context;
- timeout limits;
- queue limits.

This is both a security and scalability requirement.

---

# 28. Secrets management

Secrets include:

- database credentials;
- auth secrets;
- API keys;
- email-provider keys;
- payment keys;
- model-provider keys.

Rules:

- never commit production secrets to Git;
- never embed secrets in frontend bundles;
- use environment/configuration secret management;
- support rotation;
- use different secrets between environments.

---

# 29. Repository secret hygiene

The repository should contain:

- `.env.example` or equivalent;
- names/descriptions of required variables;
- no real production values.

Local `.env` files containing secrets must be excluded by `.gitignore`.

CI should later include secret scanning.

**CI — Continuous Integration** means automated checks run when code is changed, such as tests and security scans.

---

# 30. Environment separation

At minimum:

```text
LOCAL
TEST
PRODUCTION
```

A staging environment may be added when useful.

Production must not share:

- database;
- auth users;
- secrets;
- payment settings;

with local development.

---

# 31. Test data

Do not use real production learner data as routine development fixtures.

Use synthetic test accounts and learner personas.

This is especially important given the detailed evidence history the platform will collect.

---

# 32. Logging

Structured logging should exist from Phase 1.

Logs should capture useful operational context such as:

- request/error identifier;
- route/action;
- time;
- application version;
- safe user identifier where justified;
- job status;
- security event type.

Do not log secrets.

---

# 33. Sensitive-data logging rule

Avoid logging:

- auth tokens;
- magic links;
- OTPs;
- API keys;
- full payment data;
- unnecessary learner free text;
- proprietary source content.

Logs are not a dumping ground.

---

# 34. Security-event logging

Important security events include:

- login attempts;
- login success/failure;
- rate-limit activation;
- authorisation failures;
- admin privilege changes;
- content approval/withdrawal;
- unusual privileged access.

Phase 1 needs a basic auditable trail.

---

# 35. Error handling

Learners should see safe errors such as:

> "Something went wrong. Please try again."

They should not see:

- stack traces;
- SQL errors;
- filesystem paths;
- internal service names;
- environment variables;
- secrets.

Detailed errors go to protected logs.

---

# 36. Observability

**Observability** means having enough telemetry to understand what the running system is doing.

Minimum categories:

- errors;
- latency;
- request volume;
- job failures;
- database health;
- authentication failures;
- rate limits;
- AI usage/cost later.

Do not build a huge monitoring estate in Phase 1.

---

# 37. Health checks

The deployed application should have protected/safe health indicators for:

- application availability;
- database connectivity;
- background-job processing where applicable.

Health endpoints must not expose sensitive configuration.

---

# 38. Background jobs

Some work should not block an interactive learner request.

Potential examples:

- email;
- content processing;
- long-running AI tasks;
- report generation;
- reprocessing learner states after invalidated evidence;
- source-update impact analysis.

Use a queue/background worker where justified.

---

# 39. Idempotent jobs

Where possible, background jobs should be **idempotent**.

Idempotent means:

> safely running the same job twice produces the same intended result rather than duplicating side effects.

This matters for retries after failures.

---

# 40. Transaction boundaries

Important multi-step changes should use database transactions where practical.

Example:

```text
record learner attempt
create evidence
update derived learner state
```

should not leave half-completed inconsistent state if one operation fails.

The exact synchronous/asynchronous boundary will be designed later.

---

# 41. Derived learner state

Derived mastery/readiness state may be cached/materialised for fast display.

But the underlying evidence remains authoritative enough to support recomputation.

This implements WP1.3.

---

# 42. Deterministic calculation service

Numerical generation/marking should live in a trusted deterministic component/module.

It should support:

- validated formulas;
- units;
- parameter generation;
- answer checking;
- error signatures.

Do not duplicate calculation logic independently in multiple UI screens.

---

# 43. Content-publication boundary

Draft/unapproved content must not be served as production teaching material by default.

Conceptually:

```text
AUTHORING
   ↓
VALIDATION
   ↓
APPROVAL
   ↓
PUBLICATION
   ↓
LEARNER DELIVERY
```

The production query path should make it easy to request only published content.

---

# 44. Administrative roles

Phase 1 may initially have only the founder as administrator.

Still define role capability conceptually.

Possible future roles:

- learner;
- content author;
- reviewer;
- administrator;
- organisation tutor;
- organisation manager.

Do not hard-code founder identity into privileged logic.

---

# 45. Least privilege

Every role/service receives only the permissions required.

Examples:

- learner cannot publish content;
- content author need not manage billing;
- background email worker need not access all learner mastery data;
- public frontend does not need database administration credentials.

---

# 46. Audit trail for governed content

Changes to important governed content should record:

- actor;
- timestamp;
- action;
- object/version;
- before/after or change reference;
- approval decision where relevant.

This supports knowledge governance and later professional review.

---

# 47. Source material separation

Proprietary development/reference files must not accidentally become publicly served product assets.

The architecture should distinguish:

```text
DEVELOPMENT REFERENCE MATERIAL
```

from:

```text
PRODUCTION GOVERNED CONTENT
```

If temporary proprietary processing is performed, its storage should be controlled separately from public production content.

---

# 48. File/object storage

If product assets later include:

- original diagrams;
- generated diagrams;
- approved images;
- exports;

use appropriate object/file storage.

Do not store large binary files unnecessarily inside ordinary database fields.

Phase 1 may require little or no object storage initially.

---

# 49. Backups

Production learner and governed-content data must be backed up.

The chosen platform later should support:

- automated backups;
- retention;
- restore procedure.

A backup that has never been restorable is not a complete recovery strategy.

---

# 50. Recovery objectives

Phase 1 does not need enterprise-grade minute-level disaster recovery.

It should nevertheless establish:

- what data can be lost;
- approximate acceptable recovery point;
- approximate acceptable recovery time;
- how restore will be tested.

---

# 51. Migration discipline

Database schema changes must use repeatable migrations committed to version control.

A migration is a controlled change to database structure/data.

Avoid manual production schema editing that cannot be reproduced.

---

# 52. Seed/reference data

Canonical initial data such as:

- domains;
- relationship types;
- rights classifications;
- evidence enums;

should be created reproducibly.

Avoid hidden production-only manual setup.

---

# 53. Deployment

Deployment should be automated enough that production can be recreated reliably.

Minimum expectation:

```text
commit
  ↓
automated checks
  ↓
build
  ↓
deploy
```

Manual approval before production may remain appropriate.

---

# 54. Continuous Integration

CI should eventually run:

- unit tests;
- integration tests;
- type/lint checks where applicable;
- migration checks;
- security/dependency scans;
- secret scans;
- deterministic question tests;
- synthetic learner regression tests;
- automated Security Verification Matrix checks where a security
  requirement can be tested mechanically.

Phase 1 should establish this early rather than bolt it on at the end.

Security tests should be traceable back to the adopted ASVS/NIST/CIS
requirements where applicable rather than existing as an unrelated
collection of ad hoc tests.

---

# 55. Continuous Deployment caution

Automatic deployment of every passing change to production is not required.

A controlled:

> tests pass → review → deliberate production release

model is appropriate during early development.

---

# 56. Dependency management

Use:

- lock files;
- deliberate dependencies;
- regular updates;
- vulnerability scanning.

Avoid adding libraries for trivial tasks when native/platform capabilities suffice.

---

# 57. Security standards and governing hierarchy

Security requirements must not be expressed merely as:

> "follow security best practice"

or:

> "follow OWASP".

Phase 1 establishes an explicit standards hierarchy.

## 57.1 Primary application-security verification baseline — OWASP ASVS

**OWASP ASVS — Application Security Verification Standard** is the
primary application-security requirements and verification baseline for
the learner-facing web application and its trusted server-side
components.

Use the latest stable ASVS version adopted by the project. At the time
of this WP1.6 revision, that baseline is:

> **OWASP ASVS 5.0.0**

ASVS is used because it provides concrete, testable requirements for
web-application technical security controls rather than only a list of
common risks.

Important project requirements should be traceable to version-qualified
ASVS requirement identifiers where applicable.

Example conceptual reference:

```text
ASVS:
v5.0.0-[requirement identifier]
```

The exact applicable ASVS profile/requirement set will be selected
during WP1.9 and implementation planning. Requirements that are not
applicable must be explicitly marked with rationale rather than silently
ignored.

ASVS is the main answer to:

> **What application security controls must we implement and verify?**

---

## 57.2 Secure-development lifecycle baseline — NIST SSDF

**NIST SSDF — Secure Software Development Framework** governs the
project's secure-development lifecycle practices.

The project baseline is the latest final NIST SSDF publication formally
adopted by the project.

At the time of this WP1.6 revision:

> **NIST SP 800-218, SSDF Version 1.1 is the current final publication.**

A later NIST revision should not silently replace the project baseline.
When a newer final version is published, it should be reviewed through a
governed architecture/security update.

NIST SSDF is used to ensure security exists throughout:

- development;
- dependency management;
- build/release;
- vulnerability handling;
- software supply chain;
- configuration;
- maintenance;
- developer practices.

SSDF is the main answer to:

> **How must we develop, release and maintain the software securely?**

---

## 57.3 Threat-awareness cross-check — OWASP Top 10

The **OWASP Top 10** is a threat/risk awareness cross-check.

At the time of this revision, the current release is:

> **OWASP Top 10:2025**

It must be reviewed against the architecture and security test plan so
that major web-application risk categories are not missed.

However:

> **OWASP Top 10 is not the project's application-security
> specification.**

It is broader risk-awareness material.

ASVS remains the primary detailed application-security verification
baseline.

OWASP Top 10 is the main answer to:

> **Are we overlooking a major class of contemporary web-application
> risk?**

---

## 57.4 Technology-specific hardening — CIS Benchmarks

Once WP1.9 selects the actual technologies and hosting environment, the
project must identify applicable **CIS Benchmarks**.

CIS Benchmarks provide consensus secure-configuration recommendations
for specific technologies such as:

- operating systems;
- cloud platforms;
- databases;
- containers;
- DevSecOps tooling;
- server software.

Applicable benchmarks must be selected only after the actual stack is
known.

Examples might later include the relevant benchmark for:

- the selected cloud platform;
- Linux distribution;
- PostgreSQL/database platform if covered;
- container platform if used;
- GitHub/DevSecOps tooling where applicable.

Do not claim CIS compliance for a technology without actually mapping
and checking the applicable recommendations.

CIS Benchmarks are the main answer to:

> **How should the technologies we selected be securely configured?**

---

## 57.5 Security-standard precedence

The project therefore uses this hierarchy:

```text
APPLICATION SECURITY REQUIREMENTS / VERIFICATION
    OWASP ASVS

SECURE SOFTWARE DEVELOPMENT LIFECYCLE
    NIST SSDF

CONTEMPORARY WEB-RISK CROSS-CHECK
    OWASP Top 10

TECHNOLOGY-SPECIFIC HARDENING
    Applicable CIS Benchmarks
```

These sources complement rather than replace one another.

Where recommendations appear to conflict, the conflict must be
documented and resolved explicitly during architecture/security review.

---

## 57.6 Version pinning and review

Security standards evolve.

The project must therefore record:

- adopted standard;
- adopted version;
- adoption/review date;
- applicable scope;
- any deliberate exclusions;
- next review trigger.

Do not write durable requirements against an unversioned phrase such as:

> "latest OWASP"

where precise requirement identifiers matter.

When a new major version is released:

1. identify changes;
2. assess applicability;
3. assess implementation impact;
4. update the verification matrix;
5. record the decision;
6. only then change the project baseline.

This prevents future AI/developer sessions silently moving the security
goalposts.

---

# 57.7 Security verification matrix

Phase 1 must create and maintain a **Security Verification Matrix**.

This is the bridge between standards and actual implementation.

Each applicable security requirement should record, at minimum:

```text
Requirement ID
Standard + version
Requirement summary
Applicability
Implementation/control
Verification method
Automated test where possible
Manual verification where necessary
Evidence/reference
Status
Exception/rationale if any
Owner/reviewer
```

Conceptual example:

```text
Requirement:
Prevent cross-user learner-data access

Source:
OWASP ASVS v5.0.0 [applicable requirement(s)]

Implementation:
server-side object authorisation
+ database RLS

Verification:
automated User A / User B isolation test

Evidence:
CI test run / security test reference

Status:
PASS
```

The matrix must not become paperwork detached from the code.

Where a requirement can be tested automatically, the verification
matrix should link to that test/evidence.

---

# 57.8 Security requirements are acceptance criteria

Security controls derived from the adopted baseline are not optional
quality improvements to add after product development.

Applicable controls become:

- architecture requirements;
- implementation acceptance criteria;
- CI/regression requirements where automatable;
- release-gate evidence where appropriate.

A feature that works functionally but violates an applicable critical
security requirement is not complete.

---

# 57.9 Risk-based applicability, not checkbox theatre

The project should not claim blanket "compliance" merely because a
checklist exists.

For each standard:

- determine what applies;
- explain exclusions;
- implement applicable controls;
- verify them;
- retain evidence.

This is intended to produce a demonstrably secure product, not a
marketing badge.

Formal certification is not required for Phase 1.

Independent security testing should be added before meaningful public
scale/revenue exposure when justified by risk.


---

# 58. Authentication/session storage

Use secure platform-standard session mechanisms.

Requirements include:

- HTTPS only in production;
- secure cookie/token handling;
- CSRF protection where relevant;
- appropriate token expiry;
- rotation/revocation.

**CSRF — Cross-Site Request Forgery** is an attack where a malicious site tricks a signed-in browser into performing an unwanted action. It matters when cookie-based authenticated requests can change state.

---

# 59. XSS protection

**XSS — Cross-Site Scripting** occurs when untrusted content is executed as script in another user's browser.

Protect through:

- framework-safe rendering;
- escaping/sanitisation;
- avoiding unsafe raw HTML;
- Content Security Policy where appropriate.

This matters particularly if future content authoring allows rich text.

---

# 60. Content Security Policy

A **Content Security Policy (CSP)** restricts what browser resources/scripts can execute or load.

The production app should use sensible security headers including CSP where compatible with the chosen stack.

Detailed configuration comes later.

---

# 61. CSRF protection

State-changing authenticated requests must be protected from CSRF where the chosen authentication/session model requires it.

Do not assume the framework handles this unless verified.

---

# 62. Clickjacking/security headers

Production should use appropriate browser security headers to reduce:

- clickjacking;
- content-type confusion;
- unsafe referrer leakage.

The exact header set should be validated during implementation.

---

# 63. Data minimisation

Store what the product needs.

Do not collect:

- date of birth;
- address;
- demographic profile;
- employment data;

unless later functionality genuinely requires them.

A consumer learning account may need little more than:

- email/login identity;
- display/preferred name if desired;
- learning selections;
- learner evidence.

---

# 64. Privacy by design

The architecture should make it possible to:

- export learner data;
- delete an account;
- remove/anonymise personal data where legally required;
- retain non-personal aggregate analytics where lawful;
- record consent/preferences where needed.

Exact UK GDPR/privacy policy work belongs before public commercial scale.

---

# 65. Payments

Phase 1 may not require payment integration.

When added:

- use a mature payment processor;
- do not store raw card details;
- verify webhook signatures;
- keep billing entitlement server-side.

**Webhook** means a service sends the application an HTTP message when an event occurs, such as a successful subscription payment.

---

# 66. Entitlements

Future paid access should be represented separately from authentication.

A user can be:

- authenticated;
- but not entitled to a paid programme.

Do not make "logged in" synonymous with "paid."

---

# 67. Search

Knowledge/content search should be bounded and permission-aware.

Learners should search only learner-visible/published content.

Admins may search drafts if authorised.

A dedicated search engine is not required in Phase 1.

---

# 68. Caching

Caching may later improve:

- public/static content;
- lesson structures;
- shared knowledge reads;
- generated assets.

Do not cache sensitive learner data in ways that can leak it between users.

Phase 1 should optimise only measured bottlenecks.

---

# 69. Pagination

Large lists must support pagination/cursors.

Examples later:

- questions;
- assertions;
- learner evidence history;
- audit events.

Do not design APIs that assume "return every record" will remain safe.

---

# 70. Database indexes

Frequently queried fields/relationships should be indexed deliberately.

Likely examples:

- assertion relationships;
- curriculum mappings;
- learner evidence by learner/assertion/time;
- question-family mappings;
- lesson programme order;
- diagnostic episodes.

Final indexes should follow real query patterns.

---

# 71. Bounded graph traversal

Diagnostic queries must not recursively traverse arbitrary graph depth on every request.

Use:

- explicit depth limits;
- relationship filters;
- indexed edges;
- precomputed neighbourhoods if later justified.

This aligns with WP1.4's bounded diagnostic neighbourhood.

---

# 72. Scalability model

Initial scale targets should be conceptual:

```text
Phase 1:
few users / ~100 assertions

Early commercial:
hundreds–thousands of learners

UK scale:
tens of thousands+

International:
potentially much larger
```

The architecture should support horizontal application scaling and database growth without premature distributed complexity.

---

# 73. Horizontal scaling

**Horizontal scaling** means adding more server instances rather than only buying one larger machine.

Stateless app design and external durable state make this possible.

Phase 1 does not need multiple live instances.

---

# 74. Database scaling

Start with:

- one robust relational primary;
- correct indexes;
- bounded queries;
- good schema design.

Possible future scale tools:

- read replicas;
- connection pooling;
- partitioning;
- archival.

Do not implement them before needed.

---

# 75. Queue scaling

Background work can scale independently from interactive requests later by adding workers.

This is useful for:

- content generation;
- bulk analysis;
- AI tasks;
- exports;
- reprocessing.

---

# 76. AI isolation

AI/model calls should sit behind a server-side abstraction.

Benefits:

- model/provider can change;
- cost can be logged;
- rate limits apply;
- prompts are controlled;
- failures can degrade gracefully;
- learner secrets/API keys remain protected.

Do not call paid model APIs directly from the browser with exposed credentials.

---

# 77. AI cost tracking

Track at least:

- provider/model;
- operation type;
- input/output usage;
- approximate cost;
- learner/session/job where appropriate without overlogging content.

This supports the Phase 0 AI-cost target.

---

# 78. AI failure mode

Core learning should continue where practical if AI is unavailable.

Examples that should remain available:

- lessons;
- deterministic questions;
- marking;
- mastery updates;
- progress;
- most diagnostics.

Optional AI explanation can fail gracefully.

---

# 79. Email dependence

Passwordless login creates dependence on email delivery.

Therefore:

- monitor delivery failures;
- rate-limit sends;
- support resend safely;
- avoid blocking existing active sessions because email provider is temporarily unavailable.

Later social login may provide alternative access.

---

# 80. Availability priorities

The highest-value learner path is:

```text
sign in
→ open lesson/practice
→ answer
→ receive result
→ progress saved
```

Architecture should keep this path simple and reliable.

Do not make it depend synchronously on:

- analytics;
- AI;
- background reporting;
- nonessential external services.

---

# 81. Graceful degradation

If non-core services fail:

- analytics failure should not stop answers;
- AI explanation failure should fall back to approved static explanation;
- email failure should not break active sessions;
- background export failure should retry.

This improves reliability.

---

# 82. Analytics boundary

Product analytics can be useful for:

- lesson completion;
- funnel/drop-off;
- feature use;
- learner return.

But learning evidence is not the same as product analytics.

Keep:

```text
PRODUCT ANALYTICS
```

separate from:

```text
CANONICAL LEARNER EVIDENCE
```

Do not let a third-party analytics platform become the only source of educational state.

---

# 83. Testing pyramid

Phase 1 should include:

## Unit tests

Small deterministic logic:

- calculations;
- evidence rules;
- diagnostic ranking.

## Integration tests

Multiple components together:

- API + database + RLS;
- question attempt → evidence → learner state;
- lesson completion persistence.

## End-to-end tests

Real user flow through browser/application.

## Regression tests

Synthetic learners and golden question families.

No one test category is sufficient alone.

---

# 84. Security tests

Automated security-oriented tests should include where possible:

- unauthorised route access;
- cross-user data access;
- privilege escalation attempts;
- invalid inputs;
- rate limiting;
- admin endpoint protection;
- secret exposure checks.

---

# 85. RLS test requirement

For every user-owned table protected by RLS, automated tests should verify:

```text
User A can access own row
User B cannot access User A's row
unauthenticated access denied
privileged server path works only where expected
```

This should become a standard pattern.

---

# 86. Backup restore test

Before meaningful public scale, perform at least one actual restore test.

Do not rely solely on a dashboard saying "backups enabled."

---

# 87. Development/admin debug controls

Debug/admin functionality must:

- be absent or locked down in production;
- not rely on obscurity;
- not use default credentials;
- not expose database consoles publicly.

Convenient local tooling must not become production exposure.

---

# 88. Feature flags

A lightweight feature-flag mechanism may be useful for:

- testing learning paths;
- hiding unfinished features;
- controlled beta rollout.

Do not adopt an expensive feature-management platform unless needed.

---

# 89. Audit versus ordinary logs

Keep the conceptual distinction:

## Operational log

What happened technically?

## Audit event

Who performed a governed/sensitive action?

Audit records may require longer retention and stronger integrity.

---

# 90. Data retention

Retention periods should eventually be defined for:

- learner evidence;
- audit logs;
- operational logs;
- deleted accounts;
- temporary proprietary development material.

Phase 1 need not freeze exact periods.

It must not make deletion/impossible retention controls an afterthought.

---

# 91. Content-development environment

Development/reference source processing may require a controlled workspace separate from learner production.

Conceptually:

```text
REFERENCE / CONTENT DEVELOPMENT
        ↓
candidate governed objects
        ↓
validation/approval
        ↓
PRODUCTION CONTENT
```

This reduces the risk of proprietary material crossing the publication boundary.

---

# 92. Production admin interface

An eventual admin/content interface should not expose privileged database powers directly.

It should perform governed operations through authenticated/authorised application actions.

Phase 1 may use minimal internal tooling.

---

# 93. Architecture boundaries for future services

The following internal modules should have clean interfaces so they can later be separated if needed:

- AI gateway;
- notification/email;
- content processing;
- learning-state calculation;
- analytics/export.

Do not deploy them as independent services prematurely.

---

# 94. Event model

Some internal actions may emit domain events such as:

```text
QUESTION_ANSWERED
EVIDENCE_CREATED
MASTERY_CHANGED
LESSON_COMPLETED
DIAGNOSTIC_EPISODE_RESOLVED
CONTENT_PUBLISHED
```

Phase 1 may handle these synchronously inside the modular monolith.

The conceptual event boundaries can still improve modularity.

---

# 95. Event delivery caution

Do not build Kafka/event-stream infrastructure in Phase 1.

An internal application event or transactional outbox later may be enough.

Use complexity only when a real scaling/reliability problem appears.

---

# 96. Data ownership by module

Each conceptual module should own its business rules.

Examples:

- knowledge module governs assertion versioning;
- learner-evidence module governs evidence creation;
- diagnostic module governs hypotheses;
- teaching module governs lesson sequence;
- content module governs question versions.

Avoid one giant "services" layer where every module directly mutates every table.

---

# 97. Cross-module contracts

Explicit contracts should define important interactions.

Example:

```text
Question attempt
  → evidence service receives structured attempt outcome
  → returns evidence events
  → mastery service derives state updates
  → diagnostic service may open/update episode
```

This makes future testing and service extraction easier.

---

# 98. Performance targets for Phase 1

Initial learner interactions should feel immediate.

Suggested design targets, not contractual SLAs:

- ordinary page/API actions: sub-second where practical;
- answer submission/result: near-immediate;
- no AI dependency in critical marking path;
- lesson navigation responsive on mobile connections.

Measure rather than prematurely optimise.

---

# 99. Accessibility and device support architecture

The learner client should be responsive/mobile-first.

The platform architecture should not require a native app for core capabilities.

A web application/PWA direction remains suitable for initial product design.

**PWA — Progressive Web App** is a web application that can provide app-like behaviour such as installability and offline-capable features where implemented.

The exact PWA feature set belongs to WP1.7/WP1.9.

---

# 100. Offline support

Full offline learning is not a Phase 1 requirement.

The architecture should not promise it.

If later desired, lesson/content caching and queued learner attempts create additional security/synchronisation complexity.

---

# 101. Internationalisation

UK English is the initial product language/context.

The architecture should avoid hard-coding display strings deeply into business logic where practical.

Later jurisdictions may require:

- terminology;
- curricula;
- units/standards;
- legal references;
- pricing/tax.

Do not build a full translation platform now.

---

# 102. Time zones

Persist server timestamps in a standard unambiguous form.

Display local time appropriately.

This matters later for:

- retrieval scheduling;
- audit logs;
- subscriptions;
- cohort deadlines.

---

# 103. Data identifiers

Use non-guessable stable identifiers for user-sensitive public object references where appropriate.

Do not rely on sequential numeric IDs as an authorisation boundary.

Even non-guessable IDs still require authorisation.

---

# 104. Soft deletion and hard deletion

Governed historical objects may use retirement/supersession instead of destructive deletion.

Personal account deletion has different requirements.

The data model should distinguish:

- retire content;
- invalidate evidence;
- delete/anonymise personal data.

One generic `deleted=true` flag should not be expected to solve every lifecycle problem.

---

# 105. Admin changes and publication

High-impact actions such as publishing content should be explicit.

Future high-risk/safety-critical content may require two-person review.

Phase 1 can use founder approval but must preserve the workflow concept.

---

# 106. Supply-chain security

Software dependencies and build tooling create security risk.

Later CI should check:

- known vulnerable packages;
- lockfile integrity;
- suspicious dependency changes;
- secrets.

Avoid unnecessary install scripts/tools.

---

# 107. Infrastructure as code

Phase 1 does not strictly require elaborate Infrastructure as Code.

But deployment/configuration should be reproducible.

**Infrastructure as Code (IaC)** means defining infrastructure configuration in version-controlled files rather than only clicking settings manually.

If the chosen hosting platform is simple, its declarative configuration may be sufficient.

---

# 108. Domain ownership and DNS

Commercial launch should use:

- controlled domain ownership;
- secure registrar account;
- MFA for domain/admin accounts;
- minimal privileged users.

Domain compromise can be as damaging as application compromise.

---

# 109. Administrative MFA

Although learner authentication is passwordless-first, privileged production administration should support stronger protection.

Preferred future direction:

- passkey/MFA;
- tightly limited privileged accounts;
- separate production privileges.

**MFA — Multi-Factor Authentication** means requiring more than one independent authentication factor.

---

# 110. Secure-by-default development rule

New endpoints/tables/features should default to:

- private;
- authenticated;
- least privilege;

unless intentionally made public.

The developer should need to make an explicit decision to expose data.

---

# 111. Architecture test cases

Before WP1.6 is considered implementable, the eventual technical design must demonstrate it can represent these scenarios cleanly.

## Test A — learner isolation

User A cannot read or mutate User B's evidence or progress.

## Test B — public/shared content

Two learners use the same approved lesson/question records without duplication.

## Test C — lesson-led entry

A new user with no evidence can open Unit 202 Learning Mode and begin Lesson 1.

## Test D — adaptive branch

Inside a lesson, failure creates evidence, a diagnostic episode, remediation, then returns to the lesson.

## Test E — content correction

A flawed question version is invalidated and affected learner states can be recomputed.

## Test F — source update

A source-version change identifies affected assertions/content without exposing source text publicly.

## Test G — privileged publishing

A learner cannot publish content by manually calling the API.

## Test H — RLS

Direct database-facing access path cannot retrieve another learner's rows.

## Test I — AI outage

Core lesson/question/marking path remains usable without model-provider availability.

## Test J — future B2B

Organisation/cohort membership can be added without redesigning learner identity from scratch.

---

# 112. Phase 1 implementation minimum

The proving slice must implement at least:

- real account creation/sign-in;
- protected learner area;
- user data isolation;
- relational persistence;
- lesson/programme persistence;
- question/evidence persistence;
- deterministic marking;
- mastery-state persistence;
- diagnostic episode persistence;
- admin/content publication boundary;
- safe secrets;
- input validation;
- basic rate limiting;
- structured logs;
- automated tests;
- repeatable database migrations;
- production-like deployment;
- basic backup/recovery mechanism;
- version-pinned adopted security baselines;
- initial Security Verification Matrix;
- traceability from applicable high-priority security requirements to
  implementation/tests/evidence.

---

# 113. Phase 1 security minimum

Before real external beta users:

- protected routes tested;
- RLS/row isolation tested where applicable;
- no production secrets in repository/client;
- rate limits on auth;
- safe error handling;
- admin routes protected;
- dependency/secret scan;
- HTTPS;
- backups enabled;
- logs available;
- no debug consoles publicly exposed;
- applicable ASVS baseline requirements for the implemented slice
  reviewed and tracked;
- OWASP Top 10:2025 cross-check completed for the implemented slice;
- NIST SSDF development practices reflected in the build/release
  workflow;
- applicable CIS hardening guidance identified once the stack is known.

---

# 114. What Phase 1 does not need

Do not build now:

- Kubernetes;
- microservices;
- multi-region deployment;
- active-active databases;
- enterprise SSO;
- full B2B RBAC;
- data warehouse;
- Kafka;
- complex service mesh;
- custom authentication cryptography;
- custom payment vault;
- dedicated graph database;
- petabyte analytics system;
- native mobile backend;
- full offline sync.

These can be reconsidered when measured need exists.

---

# 115. Architecture decision record requirement

When WP1.9 selects actual technologies, important choices should be recorded as **ADRs**.

**ADR — Architecture Decision Record** is a short durable document recording a significant technical decision, its context, alternatives and rationale.

Likely ADRs include:

- database/platform;
- authentication;
- backend/frontend structure;
- hosting;
- job queue;
- AI gateway;
- testing strategy;
- adopted security-standard versions/profile;
- applicable technology-specific CIS Benchmarks.

This prevents later AI sessions from casually replacing major technologies
or silently changing the project's security baseline.

---

# 116. Acceptance criteria

WP1.6 is accepted when the Product Owner agrees that:

1. Phase 1 uses a production-shaped SaaS architecture without premature production-scale infrastructure;
2. a modular monolith is the preferred initial structural model;
3. the core data store is relational unless later evidence justifies another specialised store;
4. knowledge/content data remains separate from learner-specific data;
5. historical evidence references exact governed versions;
6. authentication is passwordless-first, provider still undecided;
7. authentication and authorisation are separate;
8. sensitive authorisation is server-side;
9. RLS is required where supported for learner-owned/user-sensitive tables;
10. privileged service credentials remain server-side and tightly controlled;
11. future organisation/cohort tenancy is accommodated without implementing full B2B now;
12. APIs validate, authenticate, authorise, bound and paginate input/output;
13. rate limiting is required for abuse/expensive endpoints;
14. secrets are environment-managed and never committed/exposed client-side;
15. local/test/production environments are separated;
16. structured logging and security-event logging begin in Phase 1;
17. learner-facing errors never expose sensitive internals;
18. background jobs are used for slow/noninteractive work when justified;
19. jobs should be idempotent where practical;
20. deterministic calculation/marking is a trusted central module;
21. draft content remains behind an explicit publication boundary;
22. roles and least privilege are modelled even if founder is initially the only administrator;
23. proprietary development reference material remains separated from public production content;
24. production data is backed up and restore is eventually tested;
25. database changes use version-controlled migrations;
26. CI begins during Phase 1;
27. security design is checked against recognised frameworks such as OWASP ASVS/NIST SSDF principles;
28. privacy/data minimisation are architectural requirements;
29. core learner flows do not synchronously depend on AI;
30. AI calls are server-side, bounded and cost-observable;
31. product analytics is separate from canonical learner evidence;
32. unit, integration, end-to-end, regression and security tests are all required;
33. synthetic learner regression personas are part of CI;
34. bounded graph traversal is enforced;
35. horizontal scaling is possible without introducing microservices now;
36. lesson-led Learning Mode is supported for new users with zero prior evidence;
37. future B2B organisations can be added without redesigning user identity;
38. debug/admin development conveniences cannot remain exposed in production;
39. important technical choices will later be frozen through ADRs;
40. Phase 1 explicitly excludes unnecessary distributed/enterprise infrastructure;
41. OWASP ASVS is the primary application-security requirements and
    verification baseline;
42. NIST SSDF is the secure-development lifecycle baseline;
43. OWASP Top 10 is a threat/risk cross-check rather than the detailed
    application-security specification;
44. applicable CIS Benchmarks are selected after the actual technology
    stack is chosen and are used for technology-specific hardening;
45. adopted security standards/versions are pinned and changed only
    through explicit review;
46. a Security Verification Matrix maps applicable requirements to
    controls, tests/evidence and status;
47. applicable security requirements become implementation/release
    acceptance criteria rather than optional later hardening;
48. security verification should be automated in CI wherever practical;
49. exclusions/non-applicable requirements require recorded rationale;
50. the project must not claim blanket standards compliance without
    evidence of applicability, implementation and verification.

---

# 117. Decision recommendation

**APPROVE WP1.6 as the Platform, Data & Security Architecture for Phase 1.**

The central decision is:

> **The platform will begin as a secure, modular, relational, passwordless-first SaaS with server-side authorisation, database-level learner isolation where supported, deterministic core learning logic, governed publication boundaries, auditable history, reproducible deployment and explicit operational safeguards. Security will be governed through a version-pinned hierarchy: OWASP ASVS for application-security requirements/verification, NIST SSDF for the secure-development lifecycle, OWASP Top 10 for contemporary risk cross-checking, and applicable CIS Benchmarks for technology-specific hardening. Requirements will be mapped to implementation and verifiable evidence through a maintained Security Verification Matrix.**

The architecture must be capable of growing substantially, but Phase 1 pays only for the complexity necessary to prove the product safely.

---

# 118. Next work package

On approval of WP1.6, proceed to:

> **WP1.7 — Learner UX & Product Specification**

WP1.7 will define the actual learner-facing product, including:

- information architecture;
- onboarding;
- qualification/unit selection;
- Learning Mode;
- lesson catalogue/navigation;
- lesson experience;
- progressive feedback;
- practice;
- targeted weaknesses;
- quick revision;
- mocks;
- progress/readiness;
- diagnostic interruptions;
- remediation;
- mobile-first interaction;
- accessibility;
- reference navigation;
- learner controls;
- how all modes remain one coherent product.

This work package is required before implementation so that backend architecture does not dictate the learner experience.

---

**End of WP1.6**
