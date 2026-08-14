---
id: SEC-002
status: approved
owner: project-architect
last_reviewed: 2026-08-14
---

# Security Verification Matrix

This maps applicable security requirements to project controls/evidence. It begins as a scaffold and is populated during implementation. An incomplete row is not compliance.

Status values: NOT_ASSESSED, APPLICABLE, NOT_APPLICABLE, IMPLEMENTED, VERIFIED, EXCEPTION.

| ID | Standard / version | Requirement area | Applicability | Project control | Verification / evidence | Status | Exception / rationale |
|---|---|---|---|---|---|---|---|
| SEC-M-001 | OWASP ASVS 5.0.0 | Authentication | Assess during auth implementation | Supabase Auth + application controls | Auth tests/config review | NOT_ASSESSED | |
| SEC-M-002 | OWASP ASVS 5.0.0 | Access control | Applicable | Server-side authorisation + PostgreSQL RLS | Integration + pgTAP cross-user tests | NOT_ASSESSED | |
| SEC-M-003 | OWASP ASVS 5.0.0 | Input validation | Applicable | Zod + DB constraints | Unit/integration tests | NOT_ASSESSED | |
| SEC-M-004 | OWASP ASVS 5.0.0 | Error handling/logging | Applicable | Safe errors + structured logs | Test/review | NOT_ASSESSED | |
| SEC-M-005 | OWASP ASVS 5.0.0 | Data protection | Applicable | TLS/provider controls + least privilege/minimisation | Config review | NOT_ASSESSED | |
| SEC-M-006 | NIST SSDF 1.1 | Secure development | Applicable | Bounded tasks, reviews, CI, scans | Repository/CI evidence | NOT_ASSESSED | |
| SEC-M-007 | OWASP Top 10:2025 | Risk cross-check | Applicable | Threat/risk review against implemented slice | Review evidence | NOT_ASSESSED | |
| SEC-M-008 | CIS | PostgreSQL/managed hardening | Assess | Supabase-configurable controls | Applicability review | NOT_ASSESSED | |
| SEC-M-009 | CIS | Hosting/platform hardening | Assess | Vercel/Supabase tenant controls | Applicability review | NOT_ASSESSED | |

Rules: add granular rows as components are implemented; cite exact requirements where practical; provider-managed N/A requires rationale; code existence alone is not VERIFIED; evidence should point to tests/config/review; exceptions require rationale; review before external beta and major security-boundary changes.
