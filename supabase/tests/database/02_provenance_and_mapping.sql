-- CC-02 pgTAP: assertion provenance and curriculum mapping
--
-- Verifies that a specific assertion VERSION can connect to a source
-- locator/version through many-to-many provenance (CC-02B), that
-- curriculum mapping enforces referential integrity against stable
-- assertion identity, and that invalid/missing references are rejected.

begin;

select plan(6);

-- Uses the seed fixture data (one source version/locator, two assertion
-- identities where one carries two versions, one curriculum node, one
-- provenance link on the currently-approved version, one curriculum
-- mapping on the stable identity).

-- Provenance connects a specific assertion VERSION to a source locator/
-- version (seeded on SAMPLE-ASSERTION-001 version 2, id 00e).
select results_eq(
  $$ select sv.id
     from public.assertion_provenance_links apl
     join public.source_locators sl on sl.id = apl.source_locator_id
     join public.source_versions sv on sv.id = sl.source_version_id
     where apl.assertion_version_id = '00000000-0000-0000-0000-00000000000e' $$,
  $$ values ('00000000-0000-0000-0000-000000000003'::uuid) $$,
  'seeded provenance link connects an assertion version to its source version via the locator'
);

-- A valid provenance link to an existing assertion version succeeds. An
-- assertion version may have multiple provenance links (many-to-many): add
-- a second role for the same version/locator pair alongside the seeded one.
select lives_ok(
  $$ insert into public.assertion_provenance_links (assertion_version_id, source_locator_id, provenance_role)
     values ('00000000-0000-0000-0000-00000000000e', '00000000-0000-0000-0000-000000000004', 'DEFINES') $$,
  'a second provenance role can be added for the same assertion-version/locator pair'
);

-- Provenance to a nonexistent assertion version is rejected.
select throws_ok(
  $$ insert into public.assertion_provenance_links (assertion_version_id, source_locator_id, provenance_role)
     values ('99999999-9999-9999-9999-999999999999', '00000000-0000-0000-0000-000000000004', 'SUPPORTS') $$,
  '23503',
  null,
  'provenance link with a non-existent assertion version is rejected'
);

-- An invalid source locator reference is rejected.
select throws_ok(
  $$ insert into public.assertion_provenance_links (assertion_version_id, source_locator_id, provenance_role)
     values ('00000000-0000-0000-0000-00000000000e', '99999999-9999-9999-9999-999999999999', 'SUPPORTS') $$,
  '23503',
  null,
  'provenance link with a non-existent source locator is rejected'
);

-- Curriculum mapping: many-to-many structure exists with referential integrity.
select results_eq(
  $$ select cn.code
     from public.assertion_curriculum_mappings acm
     join public.curriculum_nodes cn on cn.id = acm.curriculum_node_id
     where acm.assertion_id = '00000000-0000-0000-0000-00000000000b' $$,
  $$ values ('AC1.1'::text) $$,
  'seeded curriculum mapping connects the assertion to the expected curriculum node'
);

-- An invalid curriculum node reference is rejected.
select throws_ok(
  $$ insert into public.assertion_curriculum_mappings (assertion_id, curriculum_node_id, mapping_type)
     values ('00000000-0000-0000-0000-00000000000b', '99999999-9999-9999-9999-999999999999', 'SUPPORTS') $$,
  '23503',
  null,
  'curriculum mapping with a non-existent curriculum node is rejected'
);

select * from finish();

rollback;
