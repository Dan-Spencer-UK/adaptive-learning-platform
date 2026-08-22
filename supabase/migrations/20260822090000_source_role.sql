-- CC-09C (Course Evidence, Corpus Confidence & Release-Gate Architecture):
-- the generic EVIDENTIAL ROLE a source plays (what job it does -- sets the
-- formal curriculum boundary, interprets awarding-body teaching scope,
-- supplies official assessment evidence, establishes factual truth, etc.)
-- as first-class, governed source-identity metadata, alongside the
-- existing source_family/source_type free-text columns. See ADR-0003 and
-- @alp/content-schema's sourceRoleSchema for the full decision and enum.
--
-- Deliberately on `sources` (source IDENTITY), not `source_versions`
-- (source SNAPSHOT) -- a source's evidential role does not change edition
-- to edition, unlike rights_classification (already on source_versions,
-- since a source's usage rights genuinely can change by edition/licence).
--
-- Nullable: no existing row requires backfilling, and no existing
-- manifest requires any data migration of its own -- per the governed
-- migration/legacy-data discipline (never mass-label historical sources
-- merely because a title looks plausible), only the one source in the
-- live corpus with clear, defensible evidence (the City & Guilds
-- qualification handbook -- the sole source ever cited with a
-- curriculum-authority provenance role) is classified at this migration's
-- authoring time; every other existing source is left null/unclassified.

alter table public.sources
  add column source_role text
    check (source_role is null or source_role in (
      'NORMATIVE_CURRICULUM',
      'AWARDING_BODY_SCOPE_INTERPRETATION',
      'OFFICIAL_ASSESSMENT',
      'OFFICIAL_PERFORMANCE_FEEDBACK',
      'ENDORSED_OR_ASSOCIATED',
      'EXTERNAL_DISCOVERY_OR_CORROBORATION',
      'FACTUAL_AUTHORITY',
      'SME_ADJUDICATION'
    ));

comment on column public.sources.source_role is
  'This source''s generic evidential role in the Course Evidence Registry (CC-09C) -- WHAT job the source does (e.g. sets the formal curriculum boundary vs. interprets awarding-body teaching scope vs. establishes factual truth), never WHO produced it (see publisher/source_family/source_type) and never a specific assertion-level provenance link''s own role (assertion_provenance_links.provenance_role). Null means genuinely unclassified, never "assumed factual" or "assumed curriculum-authority" by default.';
