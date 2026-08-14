-- CC-02 pgTAP: rights classification constraint
--
-- Verifies that source_versions.rights_classification accepts every
-- approved rights class, and that UNKNOWN (and other unapproved values)
-- are rejected at the database level. UNKNOWN must never be a permitted
-- learner-reproduction rights classification (CC-02 task boundary).

begin;

select plan(9);

-- Fixture source to attach versions to.
insert into public.sources (id, title)
values ('11111111-1111-1111-1111-111111111111', 'pgTAP rights-classification fixture source');

-- Each approved rights class is accepted.
select lives_ok(
  $$ insert into public.source_versions (source_id, edition, rights_classification)
     values ('11111111-1111-1111-1111-111111111111', 'OPEN-ed', 'OPEN') $$,
  'OPEN is an accepted rights classification'
);

select lives_ok(
  $$ insert into public.source_versions (source_id, edition, rights_classification)
     values ('11111111-1111-1111-1111-111111111111', 'OGL-ed', 'OFFICIAL_OGL') $$,
  'OFFICIAL_OGL is an accepted rights classification'
);

select lives_ok(
  $$ insert into public.source_versions (source_id, edition, rights_classification)
     values ('11111111-1111-1111-1111-111111111111', 'PR-ed', 'PUBLIC_RESTRICTED') $$,
  'PUBLIC_RESTRICTED is an accepted rights classification'
);

select lives_ok(
  $$ insert into public.source_versions (source_id, edition, rights_classification)
     values ('11111111-1111-1111-1111-111111111111', 'PROP-ed', 'PROPRIETARY_REFERENCE') $$,
  'PROPRIETARY_REFERENCE is an accepted rights classification'
);

select lives_ok(
  $$ insert into public.source_versions (source_id, edition, rights_classification)
     values ('11111111-1111-1111-1111-111111111111', 'LIC-ed', 'LICENSED') $$,
  'LICENSED is an accepted rights classification'
);

select lives_ok(
  $$ insert into public.source_versions (source_id, edition, rights_classification)
     values ('11111111-1111-1111-1111-111111111111', 'ORIG-ed', 'ORIGINAL') $$,
  'ORIGINAL is an accepted rights classification'
);

-- UNKNOWN must not be permitted.
select throws_ok(
  $$ insert into public.source_versions (source_id, edition, rights_classification)
     values ('11111111-1111-1111-1111-111111111111', 'UNK-ed', 'UNKNOWN') $$,
  '23514',
  null,
  'UNKNOWN is rejected as a rights classification'
);

-- An arbitrary unapproved value is rejected.
select throws_ok(
  $$ insert into public.source_versions (source_id, edition, rights_classification)
     values ('11111111-1111-1111-1111-111111111111', 'BOGUS-ed', 'NOT_A_REAL_CLASS') $$,
  '23514',
  null,
  'An unapproved rights classification value is rejected'
);

-- rights_classification is required (not null).
select throws_ok(
  $$ insert into public.source_versions (source_id, edition, rights_classification)
     values ('11111111-1111-1111-1111-111111111111', 'NULL-ed', null) $$,
  '23502',
  null,
  'rights_classification cannot be null'
);

select * from finish();

rollback;
