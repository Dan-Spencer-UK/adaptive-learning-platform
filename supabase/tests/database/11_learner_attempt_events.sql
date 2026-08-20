-- CC-07 pgTAP: learner attempt/evidence events -- ownership isolation,
-- idempotent natural-key identity, and append-only enforcement.
--
-- Same conventions as 08_learner_isolation.sql: synthetic auth users
-- created inside this transaction (rolled back at the end), authenticated
-- context simulated via the request.jwt.claims GUC so the real
-- auth.uid()/RLS path is exercised.

begin;

select plan(20);

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
    'attempts-user-a@example.test', '',
    now(), '{"provider":"email","providers":["email"]}', '{}',
    now(), now(), false, false
  ),
  (
    'bbbbbbbb-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'attempts-user-b@example.test', '',
    now(), '{"provider":"email","providers":["email"]}', '{}',
    now(), now(), false, false
  );

insert into public.learner_profiles (id) values
  ('aaaaaaaa-0000-0000-0000-000000000001'),
  ('bbbbbbbb-0000-0000-0000-000000000002');

-- =====================================================================
-- Schema invariants
-- =====================================================================
select has_table('public', 'learner_attempt_events', 'learner_attempt_events exists');

select col_is_unique(
  'public', 'learner_attempt_events',
  array['learner_id', 'lesson_instance_id', 'session_key', 'step_id', 'attempt_index'],
  'the canonical natural event key is unique'
);

-- =====================================================================
-- As User A
-- =====================================================================
set local role authenticated;
select set_config(
  'request.jwt.claims',
  json_build_object('sub', 'aaaaaaaa-0000-0000-0000-000000000001', 'role', 'authenticated')::text,
  true
);

-- 1. A learner can insert their own attempt event through the intended path.
select lives_ok(
  $$ insert into public.learner_attempt_events (
       learner_id, lesson_instance_id, session_key, lesson_id, lesson_version,
       content_release, step_id, question_blueprint_id, question_blueprint_version,
       question_seed, attempt_index, answer_revealed_before_attempt, given_answer,
       client_correct, client_recorded_at
     ) values (
       'aaaaaaaa-0000-0000-0000-000000000001', 'li1_test_instance', 'sess-a-1',
       'lesson.electrical.ohms-law', 1, 'release.unit202.v1',
       'independent_question_resistance', 'ohms_law.solve_for_resistance', 1,
       123456789, 1, false, '6'::jsonb, true, '2026-08-20T10:00:00Z'
     ) $$,
  'learner A can insert their own attempt event'
);

-- 2. A learner can read back their own events.
select results_eq(
  $$ select count(*)::int from public.learner_attempt_events where learner_id = 'aaaaaaaa-0000-0000-0000-000000000001' $$,
  $$ values (1) $$,
  'learner A can read their own attempt events'
);

-- 3. Duplicate canonical identity via ON CONFLICT DO NOTHING is an
--    idempotent no-op (the sync retry path) without UPDATE privilege.
select lives_ok(
  $$ insert into public.learner_attempt_events (
       learner_id, lesson_instance_id, session_key, lesson_id, lesson_version,
       content_release, step_id, question_blueprint_id, question_blueprint_version,
       question_seed, attempt_index, answer_revealed_before_attempt, given_answer,
       client_correct, client_recorded_at
     ) values (
       'aaaaaaaa-0000-0000-0000-000000000001', 'li1_test_instance', 'sess-a-1',
       'lesson.electrical.ohms-law', 1, 'release.unit202.v1',
       'independent_question_resistance', 'ohms_law.solve_for_resistance', 1,
       123456789, 1, false, '6'::jsonb, true, '2026-08-20T10:00:00Z'
     )
     on conflict on constraint learner_attempt_events_natural_key do nothing $$,
  'duplicate attempt sync retry (ON CONFLICT DO NOTHING) succeeds as a no-op'
);
select results_eq(
  $$ select count(*)::int from public.learner_attempt_events where learner_id = 'aaaaaaaa-0000-0000-0000-000000000001' $$,
  $$ values (1) $$,
  'duplicate canonical attempt identity cannot create a second event'
);

-- 4. A plain duplicate insert (no ON CONFLICT) is a unique violation,
--    proving the key is enforced by the database, not client politeness.
select throws_ok(
  $$ insert into public.learner_attempt_events (
       learner_id, lesson_instance_id, session_key, lesson_id, lesson_version,
       content_release, step_id, question_blueprint_id, question_blueprint_version,
       question_seed, attempt_index, answer_revealed_before_attempt, given_answer,
       client_correct, client_recorded_at
     ) values (
       'aaaaaaaa-0000-0000-0000-000000000001', 'li1_test_instance', 'sess-a-1',
       'lesson.electrical.ohms-law', 1, 'release.unit202.v1',
       'independent_question_resistance', 'ohms_law.solve_for_resistance', 1,
       123456789, 1, false, '999'::jsonb, false, '2026-08-20T10:05:00Z'
     ) $$,
  '23505',
  null,
  'a raw duplicate of the canonical event key is rejected by the unique constraint'
);

-- 5. The same real attempt in a REPLAYED session (new session_key) is a
--    legitimately distinct event -- deterministic instance ids may recur.
select lives_ok(
  $$ insert into public.learner_attempt_events (
       learner_id, lesson_instance_id, session_key, lesson_id, lesson_version,
       content_release, step_id, question_blueprint_id, question_blueprint_version,
       question_seed, attempt_index, answer_revealed_before_attempt, given_answer,
       client_correct, client_recorded_at
     ) values (
       'aaaaaaaa-0000-0000-0000-000000000001', 'li1_test_instance', 'sess-a-2',
       'lesson.electrical.ohms-law', 1, 'release.unit202.v1',
       'independent_question_resistance', 'ohms_law.solve_for_resistance', 1,
       123456789, 1, false, '6'::jsonb, true, '2026-08-21T10:00:00Z'
     ) $$,
  'the same step/attempt in a new session occurrence is a distinct legitimate event'
);

-- 6. A learner cannot spoof another learner as owner.
select throws_ok(
  $$ insert into public.learner_attempt_events (
       learner_id, lesson_instance_id, session_key, lesson_id, lesson_version,
       content_release, step_id, question_blueprint_id, question_blueprint_version,
       question_seed, attempt_index, answer_revealed_before_attempt, given_answer,
       client_correct, client_recorded_at
     ) values (
       'bbbbbbbb-0000-0000-0000-000000000002', 'li1_forged', 'sess-forged',
       'lesson.electrical.ohms-law', 1, 'release.unit202.v1',
       'independent_question_resistance', 'ohms_law.solve_for_resistance', 1,
       1, 1, false, '1'::jsonb, true, '2026-08-20T10:00:00Z'
     ) $$,
  '42501',
  null,
  'learner A cannot insert an attempt event owned by learner B'
);

-- 7. Append-only: even the OWNING learner cannot update or delete raw
--    history (no policy and no privilege -- both directions proven).
select throws_ok(
  $$ update public.learner_attempt_events set client_correct = false
     where learner_id = 'aaaaaaaa-0000-0000-0000-000000000001' $$,
  '42501',
  null,
  'the owning learner cannot UPDATE their own raw attempt history'
);
select throws_ok(
  $$ delete from public.learner_attempt_events
     where learner_id = 'aaaaaaaa-0000-0000-0000-000000000001' $$,
  '42501',
  null,
  'the owning learner cannot DELETE their own raw attempt history'
);

-- =====================================================================
-- As User B
-- =====================================================================
select set_config(
  'request.jwt.claims',
  json_build_object('sub', 'bbbbbbbb-0000-0000-0000-000000000002', 'role', 'authenticated')::text,
  true
);

-- 8. Learner B cannot read learner A's attempts (targeted and unfiltered).
select is_empty(
  $$ select 1 from public.learner_attempt_events where learner_id = 'aaaaaaaa-0000-0000-0000-000000000001' $$,
  'learner B cannot read learner A''s attempt events'
);
select results_eq(
  $$ select count(*)::int from public.learner_attempt_events $$,
  $$ values (0) $$,
  'unfiltered SELECT as learner B sees none of learner A''s events'
);

-- 9. Learner B cannot insert rows claiming learner A's ownership.
select throws_ok(
  $$ insert into public.learner_attempt_events (
       learner_id, lesson_instance_id, session_key, lesson_id, lesson_version,
       content_release, step_id, question_blueprint_id, question_blueprint_version,
       question_seed, attempt_index, answer_revealed_before_attempt, given_answer,
       client_correct, client_recorded_at
     ) values (
       'aaaaaaaa-0000-0000-0000-000000000001', 'li1_forged_by_b', 'sess-forged-b',
       'lesson.electrical.ohms-law', 1, 'release.unit202.v1',
       'independent_question_resistance', 'ohms_law.solve_for_resistance', 1,
       1, 1, false, '1'::jsonb, true, '2026-08-20T10:00:00Z'
     ) $$,
  '42501',
  null,
  'learner B cannot insert an attempt event owned by learner A'
);

-- 10. Learner B cannot update/delete learner A's history either (RLS
--     filters rows; privilege denies the verb outright).
select throws_ok(
  $$ update public.learner_attempt_events set client_correct = false
     where learner_id = 'aaaaaaaa-0000-0000-0000-000000000001' $$,
  '42501',
  null,
  'learner B cannot UPDATE learner A''s attempt events'
);
select throws_ok(
  $$ delete from public.learner_attempt_events
     where learner_id = 'aaaaaaaa-0000-0000-0000-000000000001' $$,
  '42501',
  null,
  'learner B cannot DELETE learner A''s attempt events'
);

-- =====================================================================
-- As anonymous: nothing at all.
-- =====================================================================
set local role anon;

select throws_ok(
  $$ select 1 from public.learner_attempt_events $$,
  '42501',
  null,
  'anonymous SELECT on learner_attempt_events is denied'
);
select throws_ok(
  $$ insert into public.learner_attempt_events (
       learner_id, lesson_instance_id, session_key, lesson_id, lesson_version,
       content_release, step_id, question_blueprint_id, question_blueprint_version,
       question_seed, attempt_index, answer_revealed_before_attempt, given_answer,
       client_correct, client_recorded_at
     ) values (
       'aaaaaaaa-0000-0000-0000-000000000001', 'li1_anon', 'sess-anon',
       'lesson.electrical.ohms-law', 1, 'release.unit202.v1',
       'independent_question_resistance', 'ohms_law.solve_for_resistance', 1,
       1, 1, false, '1'::jsonb, true, '2026-08-20T10:00:00Z'
     ) $$,
  '42501',
  null,
  'anonymous INSERT on learner_attempt_events is denied'
);
select throws_ok(
  $$ update public.learner_attempt_events set client_correct = false $$,
  '42501',
  null,
  'anonymous UPDATE on learner_attempt_events is denied'
);
select throws_ok(
  $$ delete from public.learner_attempt_events $$,
  '42501',
  null,
  'anonymous DELETE on learner_attempt_events is denied'
);

select * from finish();

rollback;
