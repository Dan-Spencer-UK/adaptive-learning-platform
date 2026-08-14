-- CC-02: RLS / security baseline
--
-- Establishes security posture only. CC-02 does not implement learner
-- authentication or learner isolation (that is CC-03). Every table that is
-- reachable through the Supabase Data API (PostgREST) is switched to
-- deny-by-default: RLS is enabled and NO policy is created for anon or
-- authenticated roles. Table-level privileges are also revoked from anon
-- and authenticated as defence-in-depth beyond RLS.
--
-- Effect for CC-02:
--   * anon and authenticated API roles can read/write NOTHING on these
--     tables (no policy => no rows visible/mutable);
--   * the local Postgres superuser and the Supabase service_role (which
--     carries BYPASSRLS) retain full access, so migrations, `supabase db
--     reset`, seed loading and pgTAP tests continue to work unaffected.
--
-- This is intentional and matches the CC-02 task boundary: it is NOT a bug
-- that learners cannot yet read governed content through the API. Public
-- learner-facing read policies for approved/published content, and any
-- learner-owned RLS policies, are deliberately deferred to CC-03 and later
-- content-delivery packages once authentication/authorisation exists.

alter table public.domains enable row level security;
alter table public.sources enable row level security;
alter table public.source_versions enable row level security;
alter table public.source_locators enable row level security;
alter table public.curricula enable row level security;
alter table public.curriculum_versions enable row level security;
alter table public.curriculum_nodes enable row level security;
alter table public.assertions enable row level security;
alter table public.assertion_versions enable row level security;
alter table public.assertion_provenance_links enable row level security;
alter table public.assertion_relationships enable row level security;
alter table public.assertion_curriculum_mappings enable row level security;

revoke all on public.domains from anon, authenticated;
revoke all on public.sources from anon, authenticated;
revoke all on public.source_versions from anon, authenticated;
revoke all on public.source_locators from anon, authenticated;
revoke all on public.curricula from anon, authenticated;
revoke all on public.curriculum_versions from anon, authenticated;
revoke all on public.curriculum_nodes from anon, authenticated;
revoke all on public.assertions from anon, authenticated;
revoke all on public.assertion_versions from anon, authenticated;
revoke all on public.assertion_provenance_links from anon, authenticated;
revoke all on public.assertion_relationships from anon, authenticated;
revoke all on public.assertion_curriculum_mappings from anon, authenticated;
