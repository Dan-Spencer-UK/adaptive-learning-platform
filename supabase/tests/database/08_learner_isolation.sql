-- CC-03 pgTAP: cross-user RLS isolation (hard acceptance gate)
--
-- Proves the ten CC-03 isolation invariants using two synthetic auth users
-- created and used entirely within this file's transaction (rolled back at
-- the end -- no auth fixture data persists into the dev database). The
-- authenticated request context is simulated via the same
-- request.jwt.claims GUC that PostgREST sets from a real access token, so
-- these tests exercise the actual auth.uid()/RLS evaluation path rather
-- than a superuser bypass.

begin;

select plan(19);

-- Synthetic test-only auth users. Never real personal data.
insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, is_sso_user, is_anonymous
) values
  (
    'aaaaaaaa-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'user-a@example.test', '',
    now(), '{"provider":"email","providers":["email"]}', '{}',
    now(), now(), false, false
  ),
  (
    'bbbbbbbb-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'user-b@example.test', '',
    now(), '{"provider":"email","providers":["email"]}', '{}',
    now(), now(), false, false
  );

insert into public.learner_profiles (id) values
  ('aaaaaaaa-0000-0000-0000-000000000001'),
  ('bbbbbbbb-0000-0000-0000-000000000002');

insert into public.learner_isolation_probe (id, learner_id, note) values
  ('aaaaaaaa-0000-0000-0000-000000000011', 'aaaaaaaa-0000-0000-0000-000000000001', 'user A note'),
  ('bbbbbbbb-0000-0000-0000-000000000022', 'bbbbbbbb-0000-0000-0000-000000000002', 'user B note');

-- =====================================================================
-- As User A
-- =====================================================================
set local role authenticated;
select set_config(
  'request.jwt.claims',
  json_build_object('sub', 'aaaaaaaa-0000-0000-0000-000000000001', 'role', 'authenticated')::text,
  true
);

-- 1. User A can read User A's row.
select results_eq(
  $$ select note from public.learner_isolation_probe where learner_id = 'aaaaaaaa-0000-0000-0000-000000000001' $$,
  $$ values ('user A note'::text) $$,
  'User A can read User A''s isolation-probe row'
);

-- 2. User A cannot read User B's row (targeted query and unfiltered scan).
select is_empty(
  $$ select 1 from public.learner_isolation_probe where learner_id = 'bbbbbbbb-0000-0000-0000-000000000002' $$,
  'User A cannot read User B''s isolation-probe row'
);
select results_eq(
  $$ select learner_id from public.learner_isolation_probe $$,
  $$ values ('aaaaaaaa-0000-0000-0000-000000000001'::uuid) $$,
  'unfiltered SELECT as User A returns only User A''s row'
);

-- 5. User A cannot update User B's row: RLS USING filters it out of the
-- update target entirely, so it affects zero rows rather than erroring.
select is_empty(
  $$ update public.learner_isolation_probe set note = 'tampered by A'
     where learner_id = 'bbbbbbbb-0000-0000-0000-000000000002'
     returning id $$,
  'User A updating User B''s row affects zero rows'
);

-- User A can update User A's own row.
select results_eq(
  $$ update public.learner_isolation_probe set note = 'updated by A'
     where learner_id = 'aaaaaaaa-0000-0000-0000-000000000001'
     returning note $$,
  $$ values ('updated by A'::text) $$,
  'User A can update User A''s own row'
);

-- 7. User A cannot insert a row claiming User B's ownership: WITH CHECK
-- rejects the new row outright (a real error, unlike the silent UPDATE
-- filtering above).
select throws_ok(
  $$ insert into public.learner_isolation_probe (learner_id, note)
     values ('bbbbbbbb-0000-0000-0000-000000000002', 'forged by A') $$,
  '42501',
  null,
  'User A cannot insert an isolation-probe row owned by User B'
);

-- 9. Profile isolation follows the same ownership principle.
select results_eq(
  $$ select id from public.learner_profiles where id = 'aaaaaaaa-0000-0000-0000-000000000001' $$,
  $$ values ('aaaaaaaa-0000-0000-0000-000000000001'::uuid) $$,
  'User A can read User A''s own profile'
);
select is_empty(
  $$ select 1 from public.learner_profiles where id = 'bbbbbbbb-0000-0000-0000-000000000002' $$,
  'User A cannot read User B''s profile'
);

-- CC-03A: this is exactly the operation apps/web/app/sign-in/actions.ts
-- performs for a returning learner (id already has a profile row).
-- ON CONFLICT DO NOTHING must succeed as a no-op under the authenticated
-- role, without requiring UPDATE privilege on learner_profiles.
select lives_ok(
  $$ insert into public.learner_profiles (id)
     values ('aaaaaaaa-0000-0000-0000-000000000001')
     on conflict (id) do nothing $$,
  'duplicate profile insert (ON CONFLICT DO NOTHING) succeeds as a no-op for the owning learner'
);
select is(
  (select count(*)::int from public.learner_profiles where id = 'aaaaaaaa-0000-0000-0000-000000000001'),
  1,
  'duplicate profile insert does not create a second row for the same learner'
);

-- =====================================================================
-- As User B
-- =====================================================================
select set_config(
  'request.jwt.claims',
  json_build_object('sub', 'bbbbbbbb-0000-0000-0000-000000000002', 'role', 'authenticated')::text,
  true
);

-- 3. User B can read User B's row.
select results_eq(
  $$ select note from public.learner_isolation_probe where learner_id = 'bbbbbbbb-0000-0000-0000-000000000002' $$,
  $$ values ('user B note'::text) $$,
  'User B can read User B''s isolation-probe row'
);

-- 4. User B cannot read User A's row.
select is_empty(
  $$ select 1 from public.learner_isolation_probe where learner_id = 'aaaaaaaa-0000-0000-0000-000000000001' $$,
  'User B cannot read User A''s isolation-probe row'
);

-- 6. User B cannot update User A's row.
select is_empty(
  $$ update public.learner_isolation_probe set note = 'tampered by B'
     where learner_id = 'aaaaaaaa-0000-0000-0000-000000000001'
     returning id $$,
  'User B updating User A''s row affects zero rows'
);

-- Mirror of invariant 7 for the other direction.
select throws_ok(
  $$ insert into public.learner_isolation_probe (learner_id, note)
     values ('aaaaaaaa-0000-0000-0000-000000000001', 'forged by B') $$,
  '42501',
  null,
  'User B cannot insert an isolation-probe row owned by User A'
);

-- =====================================================================
-- 8. As anonymous: access denied entirely (no table privileges granted).
-- =====================================================================
set local role anon;

select throws_ok(
  $$ select 1 from public.learner_isolation_probe $$,
  '42501',
  null,
  'anonymous SELECT on learner_isolation_probe is denied'
);
select throws_ok(
  $$ insert into public.learner_isolation_probe (learner_id, note)
     values ('aaaaaaaa-0000-0000-0000-000000000001', 'anon') $$,
  '42501',
  null,
  'anonymous INSERT on learner_isolation_probe is denied'
);
select throws_ok(
  $$ select 1 from public.learner_profiles $$,
  '42501',
  null,
  'anonymous SELECT on learner_profiles is denied'
);

-- =====================================================================
-- 10. Governed CC-02 tables must remain unaffected by CC-03's new
-- authenticated grants/policies on the learner-owned tables.
-- =====================================================================
set local role authenticated;
select set_config(
  'request.jwt.claims',
  json_build_object('sub', 'aaaaaaaa-0000-0000-0000-000000000001', 'role', 'authenticated')::text,
  true
);

select throws_ok(
  $$ insert into public.assertions (identifier, domain_id)
     values ('CC03-TEST', '00000000-0000-0000-0000-000000000001') $$,
  '42501',
  null,
  'authenticated role still cannot insert into public.assertions (CC-02 posture unchanged)'
);
select throws_ok(
  $$ select 1 from public.assertions $$,
  '42501',
  null,
  'authenticated role still cannot select public.assertions (CC-02 posture unchanged)'
);

select * from finish();

rollback;
