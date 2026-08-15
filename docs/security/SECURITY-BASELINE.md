---
id: SEC-001
status: approved
owner: project-architect
last_reviewed: 2026-08-14
---

# Security Baseline

Security is an implementation acceptance criterion from the beginning.

## Standards hierarchy

1. OWASP ASVS — application-security verification baseline
2. NIST SSDF — secure-development lifecycle baseline
3. OWASP Top 10 — contemporary risk-awareness cross-check
4. Applicable CIS Benchmarks — technology-specific hardening

Approved Phase 1 reference versions: OWASP ASVS 5.0.0; NIST SP 800-218 SSDF 1.1; OWASP Top 10:2025; applicable CIS recommendations selected against the actual managed stack.

## Core principles

Deny by default; least privilege; server-side authorisation; defence in depth; data minimisation; secure defaults; explicit trust boundaries; reproducible configuration; observable security failures.

## Authentication

Mature provider, passwordless-first, email OTP initially preferred, short-lived/single-use credentials, safe redirects, anti-enumeration behaviour, rate limits, session revocation and stronger admin MFA. Do not build custom authentication cryptography.

## Authorisation and RLS

Authentication proves identity; authorisation decides access. Protected reads/mutations enforce authorisation server-side. Learner-sensitive tables use PostgreSQL RLS where supported. Required test pattern: User A own row allowed; User B accessing A denied; anonymous learner data denied. Service-role bypass is server-only and narrow.

## Secrets

No production secrets in Git. Never expose service-role keys, SMTP credentials, AI provider keys, auth tokens or privileged DB credentials to any client bundle — browser (web) or app (native mobile) alike.

## Input and resource control

Use explicit schemas/allow-lists, database constraints, parameterised access, payload/pagination/compute bounds and rate limits for auth, expensive/admin/search/export/report endpoints.

## Errors and logging

Do not expose stack traces, SQL, internal paths or secrets. Log security-relevant auth/authz/rate-limit/validation/privileged/publication events without logging secrets or unnecessary sensitive content.

## Supply chain

Lock dependencies, use reproducible CI install, scan dependencies/secrets, keep major dependencies deliberate/current and review third-party UI registry code before use.

## Production browser/application controls

This section's specific controls (HTTPS/HSTS, CSP, CSRF/XSS protections) are web-client controls. No debug/admin bypasses or default credentials, on any client. For the web client: deliberately configure HTTPS/HSTS where appropriate, CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, frame protection and framework-appropriate CSRF/XSS protections. For the native mobile client, the equivalent controls (secure on-device credential storage, deep-link target validation, no service-role credential in the app bundle) are in [`docs/architecture/MOBILE-ARCHITECTURE.md`](../architecture/MOBILE-ARCHITECTURE.md) §Security integration — the underlying principles (deny by default, no debug bypass, no client-side authorisation) are the same baseline, applied per client type.

## Privacy

Collect only what supports the product. Product analytics and educational evidence are distinct. Avoid unnecessary sensitive data.

## Backups and recovery

Before meaningful external production: production-capable backups, documented restore procedure, at least one real restore test, migration discipline and rollback plan.

## Review triggers

Deeper review before external beta, payments, B2B/institutional access, file uploads, organisation/tutor learner-data access, future learner-facing AI/free-text interaction or major authentication/data-boundary changes. Independent penetration testing before meaningful scale.

## Evidence, not claims

Do not claim ASVS/CIS compliance without requirement-level evidence. Use the Security Verification Matrix.
