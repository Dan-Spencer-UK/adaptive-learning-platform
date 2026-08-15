-- CC-04 pgTAP: misconception schema shape and security posture
--
-- Verifies the misconceptions / misconception_assertion_conflicts tables,
-- keys, RLS-enabled state and deny-by-default posture, mirroring the
-- pattern established for the rest of the CC-02 governed schema in
-- 00_schema.sql and 04_rls_baseline.sql. Real graph content (the CC-04
-- Unit 202 proving-slice corpus) is covered by 10_unit202_knowledge_graph.sql.

begin;

select plan(15);

select has_table('public', 'misconceptions', 'misconceptions table exists');
select has_table('public', 'misconception_assertion_conflicts', 'misconception_assertion_conflicts table exists');

select col_is_pk('public', 'misconceptions', 'id', 'misconceptions has a primary key');
select col_is_unique('public', 'misconceptions', 'identifier', 'misconceptions.identifier is unique');

select col_is_pk('public', 'misconception_assertion_conflicts', 'id', 'misconception_assertion_conflicts has a primary key');
select col_is_fk('public', 'misconception_assertion_conflicts', 'misconception_id', 'conflict references a misconception');
select col_is_fk('public', 'misconception_assertion_conflicts', 'assertion_id', 'conflict references a stable assertion identity');
select col_is_unique(
  'public', 'misconception_assertion_conflicts', ARRAY['misconception_id', 'assertion_id'],
  'a misconception cannot conflict with the same assertion twice'
);

-- RLS enabled, deny-by-default, matching the CC-02 governed-table posture.
select ok(
  (select relrowsecurity from pg_class where oid = 'public.misconceptions'::regclass),
  'RLS is enabled on misconceptions'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.misconception_assertion_conflicts'::regclass),
  'RLS is enabled on misconception_assertion_conflicts'
);
select is(
  (select count(*)::int from pg_policies
   where schemaname = 'public'
     and tablename in ('misconceptions', 'misconception_assertion_conflicts')),
  0,
  'no policy exists on the misconception tables (deny-by-default; CC-04 does not expose the graph to learners)'
);

set role anon;
select throws_ok(
  $$ select 1 from public.misconceptions $$,
  '42501',
  null,
  'anon role cannot read misconceptions'
);
select throws_ok(
  $$ insert into public.misconceptions (identifier, description) values ('RLS-TEST', 'x') $$,
  '42501',
  null,
  'anon role cannot insert into misconceptions'
);
reset role;

set role authenticated;
select throws_ok(
  $$ select 1 from public.misconceptions $$,
  '42501',
  null,
  'authenticated role cannot read misconceptions (no learner-facing policy exists yet)'
);
select throws_ok(
  $$ select 1 from public.misconception_assertion_conflicts $$,
  '42501',
  null,
  'authenticated role cannot read misconception_assertion_conflicts'
);
reset role;

select * from finish();

rollback;
