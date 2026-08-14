-- CC-03: RLS + grants for learner-owned tables
--
-- Deny-by-default remains the baseline (CC-02). This migration adds the
-- minimum explicit access required for an authenticated learner to manage
-- only their own profile and isolation-probe rows. anon receives no
-- privileges on these tables. No policy uses USING(true)/WITH CHECK(true).
--
-- This migration does NOT touch the CC-02 governed knowledge/provenance/
-- curriculum tables or their existing revoked privileges.

alter table public.learner_profiles enable row level security;
alter table public.learner_isolation_probe enable row level security;

-- learner_profiles: a learner may read and create only their own profile.
-- No UPDATE policy: the table currently has no learner-mutable fields.
create policy learner_profiles_select_own
  on public.learner_profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy learner_profiles_insert_own
  on public.learner_profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

-- learner_isolation_probe: a learner may read, create and update only
-- rows they own. USING governs which existing rows are visible/targetable;
-- WITH CHECK governs the ownership of rows being written, so a learner
-- cannot insert/update a row that claims another learner's ownership.
create policy learner_isolation_probe_select_own
  on public.learner_isolation_probe
  for select
  to authenticated
  using (learner_id = auth.uid());

create policy learner_isolation_probe_insert_own
  on public.learner_isolation_probe
  for insert
  to authenticated
  with check (learner_id = auth.uid());

create policy learner_isolation_probe_update_own
  on public.learner_isolation_probe
  for update
  to authenticated
  using (learner_id = auth.uid())
  with check (learner_id = auth.uid());

-- Table-level privileges: authenticated gets exactly the operations its
-- policies allow; anon gets nothing. This is defence-in-depth alongside
-- RLS, matching the CC-02 posture for governed tables.
--
-- REVOKE ALL first: Postgres/Supabase's default privileges on newly
-- created public-schema tables otherwise leave anon holding REFERENCES,
-- TRIGGER and TRUNCATE (TRUNCATE is a real data-affecting privilege, not
-- exercised through the normal PostgREST Data API but present for any
-- direct-connection anon credential). Revoking everything first, then
-- granting back exactly what authenticated's policies require, removes
-- that residual default rather than relying on it being harmless.
revoke all on public.learner_profiles from anon, authenticated;
revoke all on public.learner_isolation_probe from anon, authenticated;

grant select, insert on public.learner_profiles to authenticated;
grant select, insert, update on public.learner_isolation_probe to authenticated;
