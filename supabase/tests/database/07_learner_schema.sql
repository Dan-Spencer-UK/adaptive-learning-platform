-- CC-03 pgTAP: learner profile / isolation-probe schema shape
--
-- Verifies the CC-03 tables, keys, RLS-enabled state and policy existence.
-- Cross-user isolation behaviour is covered by 08_learner_isolation.sql.

begin;

select plan(20);

select has_table('public', 'learner_profiles', 'learner_profiles table exists');
select has_table('public', 'learner_isolation_probe', 'learner_isolation_probe table exists');

select col_is_pk('public', 'learner_profiles', 'id', 'learner_profiles has a primary key');
select fk_ok(
  'public', 'learner_profiles', 'id',
  'auth', 'users', 'id',
  'learner_profiles.id references auth.users(id)'
);

select col_is_pk('public', 'learner_isolation_probe', 'id', 'learner_isolation_probe has a primary key');
select fk_ok(
  'public', 'learner_isolation_probe', 'learner_id',
  'public', 'learner_profiles', 'id',
  'learner_isolation_probe.learner_id references learner_profiles(id)'
);
select has_column('public', 'learner_isolation_probe', 'note', 'learner_isolation_probe has a payload column');

-- RLS enabled on both learner-owned tables.
select ok(
  (select relrowsecurity from pg_class where oid = 'public.learner_profiles'::regclass),
  'RLS is enabled on learner_profiles'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.learner_isolation_probe'::regclass),
  'RLS is enabled on learner_isolation_probe'
);

-- Expected policies exist (self-only SELECT/INSERT on profiles;
-- self-only SELECT/INSERT/UPDATE on the isolation probe).
select is(
  (select count(*)::int from pg_policies where schemaname = 'public' and tablename = 'learner_profiles'),
  2,
  'learner_profiles has exactly the expected 2 policies (select own, insert own)'
);
select is(
  (select count(*)::int from pg_policies where schemaname = 'public' and tablename = 'learner_isolation_probe'),
  3,
  'learner_isolation_probe has exactly the expected 3 policies (select/insert/update own)'
);

-- No policy on these tables is trivially permissive (USING(true) /
-- WITH CHECK(true)); every qual/with_check must reference auth.uid().
select is(
  (select count(*)::int from pg_policies
   where schemaname = 'public'
     and tablename in ('learner_profiles', 'learner_isolation_probe')
     and (coalesce(qual, '') = 'true' or coalesce(with_check, '') = 'true')),
  0,
  'no learner-owned policy is a blanket USING(true)/WITH CHECK(true)'
);
select is(
  (select count(*)::int from pg_policies
   where schemaname = 'public'
     and tablename in ('learner_profiles', 'learner_isolation_probe')
     and coalesce(qual, with_check, '') like '%auth.uid()%'),
  5,
  'every learner-owned policy references auth.uid() in its USING or WITH CHECK expression'
);

-- anon has no table-level privileges on either table -- not just SELECT.
-- TRUNCATE is checked explicitly because Postgres/Supabase's default
-- privileges on newly created public-schema tables otherwise leave it
-- granted to anon regardless of RLS (RLS does not gate TRUNCATE).
select is(
  has_table_privilege('anon', 'public.learner_profiles', 'SELECT'),
  false,
  'anon cannot SELECT learner_profiles'
);
select is(
  has_table_privilege('anon', 'public.learner_isolation_probe', 'SELECT'),
  false,
  'anon cannot SELECT learner_isolation_probe'
);
select is(
  has_table_privilege('anon', 'public.learner_profiles', 'TRUNCATE'),
  false,
  'anon cannot TRUNCATE learner_profiles'
);
select is(
  has_table_privilege('anon', 'public.learner_isolation_probe', 'TRUNCATE'),
  false,
  'anon cannot TRUNCATE learner_isolation_probe'
);

-- authenticated has no more than the operations its policies allow: no
-- DELETE privilege exists on either table (no delete policy was created).
select is(
  has_table_privilege('authenticated', 'public.learner_profiles', 'DELETE'),
  false,
  'authenticated cannot DELETE learner_profiles'
);
select is(
  has_table_privilege('authenticated', 'public.learner_isolation_probe', 'DELETE'),
  false,
  'authenticated cannot DELETE learner_isolation_probe'
);

-- CC-03A: learner_profiles grants exactly SELECT + INSERT to authenticated
-- -- no UPDATE privilege exists. Idempotent (returning-learner) profile
-- creation relies on ON CONFLICT DO NOTHING precisely because it must
-- work without this privilege; see 08_learner_isolation.sql for the
-- functional proof.
select is(
  has_table_privilege('authenticated', 'public.learner_profiles', 'UPDATE'),
  false,
  'authenticated has no UPDATE privilege on learner_profiles'
);

select * from finish();

rollback;
