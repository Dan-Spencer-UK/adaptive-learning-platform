-- CC-02: core knowledge / provenance / curriculum schema
--
-- Implements the minimum durable persistence model required to represent
-- the approved governed knowledge provenance chain (WP1.2, WP1.6, WP1.9):
--
--   source -> source version -> source locator
--     -> independently authored atomic assertion
--       -> relationships / prerequisites
--       -> curriculum mapping
--
-- This migration establishes shared knowledge/content data only. It does
-- not implement learner accounts, learner evidence, mastery state,
-- lessons, questions or diagnostic behaviour. Those belong to later CC
-- packages (CC-03 onward).

-- ---------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.set_updated_at() is
  'Maintains updated_at on row mutation. SECURITY INVOKER (default); no elevated privilege required.';

-- ---------------------------------------------------------------------
-- domains
--
-- The canonical home of a knowledge assertion (e.g. Foundational Maths,
-- Foundational Physics, Electrical). Domains are not curricula.
-- ---------------------------------------------------------------------

create table public.domains (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at
  before update on public.domains
  for each row execute function public.set_updated_at();

comment on table public.domains is
  'Canonical reusable knowledge domains (e.g. Electrical, Foundational Maths). Not a curriculum hierarchy.';

-- ---------------------------------------------------------------------
-- sources / source versions / source locators
-- ---------------------------------------------------------------------

create table public.sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  publisher text,
  source_family text,
  source_type text,
  jurisdiction text,
  canonical_reference text,
  access_location text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at
  before update on public.sources
  for each row execute function public.set_updated_at();

comment on table public.sources is
  'An identifiable publication, standard, handbook or resource. Source identity is distinct from source version.';

create table public.source_versions (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.sources (id) on delete restrict,
  edition text,
  revision text,
  publication_date date,
  effective_date date,
  superseded_date date,
  status text not null default 'CURRENT'
    check (status in ('CURRENT', 'SUPERSEDED', 'WITHDRAWN')),
  -- Approved rights classes only (WP1.2 SS25; CC-02 task boundary). UNKNOWN
  -- is deliberately not a permitted value: an unresolved source version
  -- cannot be recorded until its rights are known, which enforces
  -- deny-by-default for learner-facing reproduction at the database level.
  rights_classification text not null
    check (rights_classification in (
      'OPEN',
      'OFFICIAL_OGL',
      'PUBLIC_RESTRICTED',
      'PROPRIETARY_REFERENCE',
      'LICENSED',
      'ORIGINAL'
    )),
  checksum text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_id, edition, revision)
);

create trigger set_updated_at
  before update on public.source_versions
  for each row execute function public.set_updated_at();

comment on table public.source_versions is
  'A specific edition/revision of a source. Carries the rights classification governing learner-facing reproduction.';

comment on column public.source_versions.rights_classification is
  'Constrained to the approved rights classes. UNKNOWN is not a permitted value: rights must be resolved before a source version can be recorded.';

create table public.source_locators (
  id uuid primary key default gen_random_uuid(),
  source_version_id uuid not null references public.source_versions (id) on delete restrict,
  part text,
  chapter text,
  section text,
  subsection text,
  clause text,
  paragraph text,
  table_reference text,
  figure_reference text,
  page text,
  web_anchor text,
  locator_summary text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at
  before update on public.source_locators
  for each row execute function public.set_updated_at();

comment on table public.source_locators is
  'A semantic locator within a specific source version. Semantic fields are primary; page is supplementary where known. Deliberately generic, not tied to one publisher structure.';

-- ---------------------------------------------------------------------
-- curriculum hierarchy
--
-- Generic qualification / unit / learning-outcome / assessment-criterion
-- style hierarchy (WP1.2 SS17). Node types are constrained but table names
-- remain generic rather than hard-coding one awarding body.
-- ---------------------------------------------------------------------

create table public.curricula (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  awarding_body text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at
  before update on public.curricula
  for each row execute function public.set_updated_at();

comment on table public.curricula is
  'A qualification/curriculum family (e.g. an awarding-body qualification), independent of knowledge assertions.';

create table public.curriculum_versions (
  id uuid primary key default gen_random_uuid(),
  curriculum_id uuid not null references public.curricula (id) on delete restrict,
  version_label text not null,
  effective_date date,
  superseded_date date,
  status text not null default 'CURRENT'
    check (status in ('CURRENT', 'SUPERSEDED', 'WITHDRAWN')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (curriculum_id, version_label)
);

create trigger set_updated_at
  before update on public.curriculum_versions
  for each row execute function public.set_updated_at();

comment on table public.curriculum_versions is
  'A version of a curriculum/qualification (numbering, wording or weighting can change without affecting stable assertions).';

create table public.curriculum_nodes (
  id uuid primary key default gen_random_uuid(),
  curriculum_version_id uuid not null references public.curriculum_versions (id) on delete restrict,
  parent_node_id uuid,
  node_type text not null
    check (node_type in ('QUALIFICATION', 'UNIT', 'LEARNING_OUTCOME', 'ASSESSMENT_CRITERION')),
  code text not null,
  title text not null,
  sequence_order integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (curriculum_version_id, node_type, code),
  -- Supports the composite self-referencing FK below (a node's own
  -- (id, curriculum_version_id) pair must be uniquely addressable).
  unique (id, curriculum_version_id),
  check (parent_node_id is null or parent_node_id <> id),
  -- Declarative parent/child curriculum-version consistency: a child can
  -- only reference a parent that exists AND belongs to the same
  -- curriculum_version_id as the child itself. NULL parent_node_id (root
  -- nodes) is unaffected because a multi-column FK is not checked when any
  -- referencing column is NULL.
  foreign key (parent_node_id, curriculum_version_id)
    references public.curriculum_nodes (id, curriculum_version_id)
    on delete restrict
);

create trigger set_updated_at
  before update on public.curriculum_nodes
  for each row execute function public.set_updated_at();

comment on table public.curriculum_nodes is
  'A node within a curriculum version hierarchy (qualification/unit/learning-outcome/assessment-criterion). Generic node_type, not qualification-specific table names.';

-- ---------------------------------------------------------------------
-- knowledge assertions: stable identity, separate from versioned content
--
-- WP1.2 SS34/SS35 requires the conceptual distinction between the enduring
-- assertion identity and the proposition "at a point in time" (a version).
-- CC-02A corrects the original CC-02 single-table design, which made
-- `identifier` globally UNIQUE on the same row that also carried `version`
-- -- making it impossible to store more than one version of a given
-- identifier. `assertions` now carries only durable identity; versioned
-- content/lifecycle lives in `assertion_versions`.
--
-- FK attachment level (CC-02B Architect decision):
--
--   assertion_relationships       -> assertions.id (stable identity)
--   assertion_curriculum_mappings -> assertions.id (stable identity)
--   assertion_provenance_links    -> assertion_versions.id (specific version)
--
-- Relationships and curriculum mappings describe the underlying knowledge
-- concept / where the canonical identity applies (WP1.2 SS10, SS52) and
-- should survive routine wording/version changes, so they attach to
-- `assertions.id`. Provenance is different: the exact source version and
-- semantic locator supports the exact governed CONTENT of one assertion
-- version, and that supporting evidence may differ between version 1 and
-- version 2 of the same identity. A provenance link attached only to
-- stable identity could not reliably answer "what exact source/version/
-- locator supported assertion X version N?" once multiple versions and
-- source revisions exist, so `assertion_provenance_links` attaches to
-- `assertion_versions.id` instead.
-- ---------------------------------------------------------------------

create table public.assertions (
  id uuid primary key default gen_random_uuid(),
  identifier text not null unique,
  domain_id uuid not null references public.domains (id) on delete restrict,
  -- Non-destructive supersession by a DIFFERENT stable assertion identity
  -- (WP1.2 SS30, e.g. a broad assertion split into precise successors).
  -- This is distinct from a new version of the SAME identifier, which is
  -- simply a new row in assertion_versions.
  superseded_by_assertion_id uuid references public.assertions (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (superseded_by_assertion_id is null or superseded_by_assertion_id <> id)
);

create trigger set_updated_at
  before update on public.assertions
  for each row execute function public.set_updated_at();

comment on table public.assertions is
  'Stable governed knowledge-assertion identity. Identity (identifier) is independent of display wording and independent of version. Non-destructive supersession by a different assertion identity via superseded_by_assertion_id. Versioned content lives in assertion_versions.';

comment on column public.assertions.identifier is
  'Stable machine identity, independent of wording/curriculum numbering (e.g. EL-DC-SERIES-CURRENT-001). Multiple historical versions of this identity live in assertion_versions.';

create table public.assertion_versions (
  id uuid primary key default gen_random_uuid(),
  assertion_id uuid not null references public.assertions (id) on delete restrict,
  version integer not null check (version > 0),
  statement text not null,
  status text not null default 'CANDIDATE'
    check (status in (
      'CANDIDATE',
      'SOURCE_LINKED',
      'VERIFIED',
      'APPROVED',
      'PUBLISHED',
      'SUPERSEDED',
      'WITHDRAWN'
    )),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (assertion_id, version)
);

create trigger set_updated_at
  before update on public.assertion_versions
  for each row execute function public.set_updated_at();

comment on table public.assertion_versions is
  'The proposition/capability at a point in time for a stable assertion identity (WP1.2 SS35). A single assertion identity may have multiple historical versions; version numbers are unique per assertion.';

comment on column public.assertion_versions.statement is
  'The governed canonical proposition for this version. Not necessarily the learner-facing explanation (deferred to later content packages).';

-- ---------------------------------------------------------------------
-- assertion provenance (many-to-many, role-typed)
--
-- Attaches to a SPECIFIC assertion_versions.id, not to stable assertion
-- identity (CC-02B). The conceptual chain is:
--
--   source -> source_version -> source_locator
--     -> assertion_provenance_link -> assertion_version -> assertion identity
-- ---------------------------------------------------------------------

create table public.assertion_provenance_links (
  id uuid primary key default gen_random_uuid(),
  assertion_version_id uuid not null references public.assertion_versions (id) on delete restrict,
  source_locator_id uuid not null references public.source_locators (id) on delete restrict,
  provenance_role text not null
    check (provenance_role in (
      'AUTHORITATIVE_REQUIREMENT',
      'CURRICULUM_REQUIRES',
      'LEGAL_BASIS',
      'SUPPORTS',
      'INTERPRETS',
      'DEFINES',
      'EXEMPLIFIES'
    )),
  created_at timestamptz not null default now(),
  -- One assertion version may have multiple provenance sources/locators
  -- and roles; this only prevents an accidental exact duplicate.
  unique (assertion_version_id, source_locator_id, provenance_role)
);

comment on table public.assertion_provenance_links is
  'Many-to-many provenance between a SPECIFIC assertion version and source locators, each carrying an explicit role. Not a single free-text citation column. Deliberately version-scoped: the sources supporting version 1 may differ from those supporting version 2 of the same assertion identity.';

comment on column public.assertion_provenance_links.assertion_version_id is
  'References assertion_versions.id (a specific governed statement at a point in time), not assertions.id (stable identity). See CC-02B rationale above assertion_versions.';

-- ---------------------------------------------------------------------
-- assertion relationships (typed, directed graph edges)
-- ---------------------------------------------------------------------

create table public.assertion_relationships (
  id uuid primary key default gen_random_uuid(),
  from_assertion_id uuid not null references public.assertions (id) on delete restrict,
  to_assertion_id uuid not null references public.assertions (id) on delete restrict,
  relationship_type text not null
    check (relationship_type in (
      'PREREQUISITE_OF',
      'SUPPORTS',
      'APPLIES_IN',
      'DERIVED_FROM',
      'CONTRASTS_WITH',
      'EQUIVALENT_TO',
      'PART_OF'
    )),
  strength text
    check (strength is null or strength in ('REQUIRED', 'STRONG', 'SUPPORTING')),
  created_at timestamptz not null default now(),
  unique (from_assertion_id, to_assertion_id, relationship_type),
  check (from_assertion_id <> to_assertion_id)
);

comment on table public.assertion_relationships is
  'Typed directed relationships between assertions (WP1.2 SS10), e.g. PREREQUISITE_OF. Self-links are prevented. Relational edges only; no graph database.';

-- ---------------------------------------------------------------------
-- assertion <-> curriculum mapping (many-to-many, typed)
-- ---------------------------------------------------------------------

create table public.assertion_curriculum_mappings (
  id uuid primary key default gen_random_uuid(),
  assertion_id uuid not null references public.assertions (id) on delete restrict,
  curriculum_node_id uuid not null references public.curriculum_nodes (id) on delete restrict,
  mapping_type text not null
    check (mapping_type in ('REQUIRED_FOR', 'SUPPORTS', 'EXEMPLIFIES', 'ASSESSED_UNDER')),
  created_at timestamptz not null default now(),
  unique (assertion_id, curriculum_node_id, mapping_type)
);

comment on table public.assertion_curriculum_mappings is
  'Many-to-many mapping between assertions and curriculum nodes, each carrying an explicit mapping type (WP1.2 SS18).';

-- ---------------------------------------------------------------------
-- indexes for expected traversal/query patterns
-- ---------------------------------------------------------------------

create index source_versions_source_id_idx on public.source_versions (source_id);
create index source_locators_source_version_id_idx on public.source_locators (source_version_id);
create index curriculum_versions_curriculum_id_idx on public.curriculum_versions (curriculum_id);
create index curriculum_nodes_curriculum_version_id_idx on public.curriculum_nodes (curriculum_version_id);
create index curriculum_nodes_parent_node_id_idx on public.curriculum_nodes (parent_node_id);
create index assertions_domain_id_idx on public.assertions (domain_id);
create index assertion_versions_assertion_id_idx on public.assertion_versions (assertion_id);
create index assertion_provenance_links_assertion_version_id_idx on public.assertion_provenance_links (assertion_version_id);
create index assertion_provenance_links_source_locator_id_idx on public.assertion_provenance_links (source_locator_id);
create index assertion_relationships_from_assertion_id_idx on public.assertion_relationships (from_assertion_id);
create index assertion_relationships_to_assertion_id_idx on public.assertion_relationships (to_assertion_id);
create index assertion_curriculum_mappings_assertion_id_idx on public.assertion_curriculum_mappings (assertion_id);
create index assertion_curriculum_mappings_curriculum_node_id_idx on public.assertion_curriculum_mappings (curriculum_node_id);
