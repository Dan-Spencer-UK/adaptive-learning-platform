-- ADR-0002: source-snapshot identity + independent-verification evidence.
--
-- "AI-generated/transcribed from an official source" is not equivalent to
-- "independently verified against the actual official source", and
-- "verified" is not permanently equivalent to "still current". This
-- migration adds the smallest set of nullable columns needed to make both
-- facts mechanically recordable against the existing `source_versions`
-- table (a source snapshot's own identity), rather than inventing a
-- parallel "verification" entity -- see ADR-0002 for the full decision.
--
-- All columns are nullable/defaulted: no existing row requires
-- backfilling, and no existing manifest requires any data migration of
-- its own.

alter table public.source_versions
  add column retrieved_date date,
  add column content_fingerprint_sha256 text,
  add column verification_status text not null default 'UNVERIFIED'
    check (verification_status in ('UNVERIFIED', 'VERIFIED', 'VERIFICATION_FAILED')),
  add column verified_by text,
  add column last_currency_check_date date,
  add constraint source_versions_fingerprint_format_check
    check (content_fingerprint_sha256 is null or content_fingerprint_sha256 ~ '^[0-9a-f]{64}$'),
  -- Mirrors @alp/content-schema's sourceVersionManifestSchema superRefine:
  -- verification must be attributed to an identified independent
  -- verifier, never asserted anonymously.
  add constraint source_versions_verified_by_required_check
    check (verification_status = 'UNVERIFIED' or verified_by is not null);

comment on column public.source_versions.retrieved_date is
  'Date this exact source artefact was actually fetched/inspected for this snapshot (distinct from publication_date/effective_date, which the publisher controls).';
comment on column public.source_versions.content_fingerprint_sha256 is
  'SHA-256 (64 lowercase hex chars) of the actual fetched source artefact bytes. Never fabricated -- left null when not actually computed from real source bytes.';
comment on column public.source_versions.verification_status is
  'Whether this source snapshot has been independently confirmed against the authoritative artefact by a verifier distinct from whatever model extracted/authored the governed content citing it (ADR-0002). Never assumed true from extraction alone.';
comment on column public.source_versions.verified_by is
  'Role/identity of the independent verifier (e.g. "project-architect"). Populated only once verification_status leaves UNVERIFIED.';
comment on column public.source_versions.last_currency_check_date is
  'Most recent date this source was checked for upstream changes -- may be later than a full re-verification (a lightweight currency recheck confirming "still the same" is not itself a full independent verification).';
