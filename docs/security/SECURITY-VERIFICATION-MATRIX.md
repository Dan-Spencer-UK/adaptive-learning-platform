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
| SEC-M-002a | OWASP ASVS 5.0.0 | Access control — deny-by-default baseline (pre-authentication) | Applicable | PostgreSQL RLS enabled with zero policies, plus explicit `REVOKE ALL` from `anon`/`authenticated`, on every CC-02 governed knowledge/provenance/curriculum table, including `assertion_versions` (`supabase/migrations/20260814120200_rls_baseline.sql`) | pgTAP `supabase/tests/database/04_rls_baseline.sql` (19 assertions: RLS enabled per table, zero policies exist, anon/authenticated read+write denied with 42501); `npm run db:test`; CI `database` job | VERIFIED | Cross-user learner isolation (User A / User B pattern) is CC-03 scope and remains NOT_ASSESSED until authentication exists. Absence of a learner-read policy here is the intended CC-02 posture, not a gap. |
| SEC-M-003a | OWASP ASVS 5.0.0 | Input validation — database constraints | Applicable | CHECK constraints constraining rights classification, relationship/mapping/provenance-role enums and lifecycle status; NOT NULL/UNIQUE/FK constraints on all CC-02 tables; self-link prevention on assertion relationships and curriculum-node parents; composite FK enforcing assertion-version uniqueness per identity and curriculum-node parent/child same-version consistency; `assertion_provenance_links` FKs to the specific `assertion_versions.id` it supports (not stable assertion identity), so relationships/mappings (stable identity) and provenance (specific version) are enforced at different, correctly-scoped FK targets | pgTAP `supabase/tests/database/00_schema.sql`, `01_rights_classification.sql`, `02_provenance_and_mapping.sql`, `03_assertion_relationships.sql`, `05_assertion_versioning.sql`, `06_curriculum_hierarchy_integrity.sql`; `npm run db:test` | VERIFIED | UNKNOWN is deliberately excluded from the rights-classification CHECK constraint so it cannot be recorded as a learner-reproduction rights class. |
| SEC-M-006a | NIST SSDF 1.1 | Reproducible database migrations | Applicable | Version-controlled SQL migrations under `supabase/migrations/`; no schema state exists only in a running database | Manual verification: `npx supabase db reset` rebuilds schema + `supabase/seed.sql` from repository state alone with no manual Studio step (verified 2026-08-14); CI `database` job runs the same reset on every push/PR | VERIFIED | |

Rules: add granular rows as components are implemented; cite exact requirements where practical; provider-managed N/A requires rationale; code existence alone is not VERIFIED; evidence should point to tests/config/review; exceptions require rationale; review before external beta and major security-boundary changes.
