-- CC-02 pgTAP: RLS / security baseline
--
-- Verifies RLS is enabled on every governed knowledge/provenance/
-- curriculum table, that no permissive policy exists (deny-by-default),
-- and that anon/authenticated API roles cannot read or write these
-- tables. Table-level privileges were also revoked from anon/authenticated
-- (defence-in-depth beyond RLS), so denial surfaces as a permission error
-- (42501) rather than an empty result set. Learner-specific RLS policies
-- are explicitly out of scope for CC-02 (CC-03) so this file does not test
-- learner isolation.

begin;

select plan(19);

select ok(
  (select relrowsecurity from pg_class where oid = 'public.domains'::regclass),
  'RLS is enabled on domains'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.sources'::regclass),
  'RLS is enabled on sources'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.source_versions'::regclass),
  'RLS is enabled on source_versions'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.source_locators'::regclass),
  'RLS is enabled on source_locators'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.curricula'::regclass),
  'RLS is enabled on curricula'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.curriculum_versions'::regclass),
  'RLS is enabled on curriculum_versions'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.curriculum_nodes'::regclass),
  'RLS is enabled on curriculum_nodes'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.assertions'::regclass),
  'RLS is enabled on assertions'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.assertion_versions'::regclass),
  'RLS is enabled on assertion_versions'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.assertion_provenance_links'::regclass),
  'RLS is enabled on assertion_provenance_links'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.assertion_relationships'::regclass),
  'RLS is enabled on assertion_relationships'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.assertion_curriculum_mappings'::regclass),
  'RLS is enabled on assertion_curriculum_mappings'
);

-- No permissive (or any) policy has been created on these tables yet;
-- absence of a learner-read policy is the intended CC-02 posture, not a
-- bug (learner-facing policies are deferred to CC-03/content-delivery).
select is(
  (select count(*)::int from pg_policies
   where schemaname = 'public'
     and tablename in (
       'domains', 'sources', 'source_versions', 'source_locators',
       'curricula', 'curriculum_versions', 'curriculum_nodes',
       'assertions', 'assertion_versions', 'assertion_provenance_links',
       'assertion_relationships', 'assertion_curriculum_mappings'
     )),
  0,
  'no policy exists on any CC-02 governed table (deny-by-default; no permissive USING(true)/WITH CHECK(true) policy)'
);

-- anon cannot read rows. Table privileges were revoked as defence-in-depth
-- beyond RLS, so this is denied at the privilege-check stage (42501)
-- rather than silently returning zero rows.
set role anon;
select throws_ok(
  $$ select 1 from public.assertions $$,
  '42501',
  null,
  'anon role cannot read assertions'
);
reset role;

-- authenticated cannot read rows either (no learner policy exists yet).
set role authenticated;
select throws_ok(
  $$ select 1 from public.assertions $$,
  '42501',
  null,
  'authenticated role cannot read assertions'
);
reset role;

-- anon cannot insert (table privileges were explicitly revoked).
set role anon;
select throws_ok(
  $$ insert into public.domains (code, name) values ('RLS-TEST', 'RLS Test') $$,
  '42501',
  null,
  'anon role cannot insert into domains'
);
reset role;

-- authenticated cannot insert either.
set role authenticated;
select throws_ok(
  $$ insert into public.domains (code, name) values ('RLS-TEST-2', 'RLS Test 2') $$,
  '42501',
  null,
  'authenticated role cannot insert into domains'
);
reset role;

-- anon cannot update or delete governed rows.
set role anon;
select throws_ok(
  $$ update public.domains set name = 'x' where code = 'SAMPLE_DOMAIN' $$,
  '42501',
  null,
  'anon role cannot update domains'
);
select throws_ok(
  $$ delete from public.domains where code = 'SAMPLE_DOMAIN' $$,
  '42501',
  null,
  'anon role cannot delete from domains'
);
reset role;

select * from finish();

rollback;
