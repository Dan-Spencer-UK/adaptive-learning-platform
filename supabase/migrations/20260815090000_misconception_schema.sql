-- CC-04: misconception schema
--
-- WP1.2 SS13-15/SS34 defines MISCONCEPTION as a first-class governed
-- knowledge object, part of the same conceptual object family as
-- domain/source/curriculum/assertion (SS34), not merely a free-text note
-- on a question. CC-02 established the rest of that object family
-- (domains, sources, curricula, assertions, relationships, curriculum
-- mappings) but did not yet implement misconception persistence -- CC-04
-- is the first package with real governed misconception content to
-- store, so this migration completes the already-approved object family
-- rather than introducing a new architectural concept.
--
-- A misconception describes a plausible incorrect belief that conflicts
-- with the enduring PROPOSITION a stable assertion identity represents,
-- not with a specific version's exact wording. This mirrors the CC-02B
-- rationale for assertion_relationships/assertion_curriculum_mappings:
-- those attach to assertions.id (stable identity) because they describe
-- the underlying concept and should survive routine wording/version
-- changes, whereas assertion_provenance_links attaches to
-- assertion_versions.id because it supports one specific version's exact
-- content. A misconception "conflicts with" the concept, so it attaches
-- to assertions.id for the same reason relationships/mappings do.
--
-- This migration only creates the governed knowledge representation. It
-- does not implement misconception detection from learner answers,
-- scoring or remediation -- those are later CC packages (WP1.3/WP1.4/
-- WP1.5 behaviour), consistent with the CC-04 task boundary.

create table public.misconceptions (
  id uuid primary key default gen_random_uuid(),
  identifier text not null unique,
  description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at
  before update on public.misconceptions
  for each row execute function public.set_updated_at();

comment on table public.misconceptions is
  'A structured representation of a plausible incorrect learner belief (WP1.2 SS13). First-class governed object, not a free-text note on a question. Does not itself detect, score or remediate learner errors.';

comment on column public.misconceptions.identifier is
  'Stable machine identity, independent of wording (e.g. MIS-EL-OHM-REARRANGE-ERROR-001).';

create table public.misconception_assertion_conflicts (
  id uuid primary key default gen_random_uuid(),
  misconception_id uuid not null references public.misconceptions (id) on delete restrict,
  assertion_id uuid not null references public.assertions (id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (misconception_id, assertion_id)
);

comment on table public.misconception_assertion_conflicts is
  'Many-to-many: which stable assertion identities a misconception conflicts with (WP1.2 SS13/SS15). Attaches to assertions.id, not assertion_versions.id, for the same reason assertion_relationships/assertion_curriculum_mappings do (CC-02B) -- a misconception conflicts with the enduring proposition, not one version''s exact wording.';

create index misconception_assertion_conflicts_misconception_id_idx on public.misconception_assertion_conflicts (misconception_id);
create index misconception_assertion_conflicts_assertion_id_idx on public.misconception_assertion_conflicts (assertion_id);
