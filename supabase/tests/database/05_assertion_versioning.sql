-- CC-02A/CC-02B pgTAP: assertion identity/version integrity
--
-- Proves that assertion identity (assertions) and assertion content-at-a-
-- version (assertion_versions) are correctly decoupled: one stable
-- identifier can carry multiple historical versions, duplicate version
-- numbers for the same identifier are rejected, two different identities
-- may each independently start at version 1, invalid references are
-- rejected, assertion relationships and curriculum mappings attach to the
-- stable assertion identity, and provenance attaches to a specific
-- assertion version (so different versions of the same identity can carry
-- different, independently-preserved provenance).

begin;

select plan(12);

-- 1 & 4: SAMPLE-ASSERTION-001 (identity 00b) has both version 1 and
-- version 2 present simultaneously; the historical version 1 remains
-- present and readable after version 2 exists.
select results_eq(
  $$ select version from public.assertion_versions
     where assertion_id = '00000000-0000-0000-0000-00000000000b'
     order by version $$,
  $$ values (1), (2) $$,
  'SAMPLE-ASSERTION-001 has both version 1 and version 2 present simultaneously'
);

select is(
  (select status from public.assertion_versions
   where assertion_id = '00000000-0000-0000-0000-00000000000b' and version = 1),
  'SUPERSEDED',
  'historical version 1 remains present with its own status after version 2 exists'
);

-- 2: a duplicate version number for the same assertion identity is rejected.
select throws_ok(
  $$ insert into public.assertion_versions (assertion_id, version, statement)
     values ('00000000-0000-0000-0000-00000000000b', 2, 'duplicate version attempt') $$,
  '23505',
  null,
  'a duplicate version number for the same assertion identity is rejected'
);

-- 3: two different stable assertion identities may each independently
-- have their own version 1. Scoped to the two CC-02 fixture identities
-- specifically (rather than every version-1 row in the table) because
-- CC-04 onward legitimately adds many more real assertions that also
-- start at version 1; the invariant under test is per-identity
-- independence, not exclusivity of the whole table.
select results_eq(
  $$ select assertion_id::text from public.assertion_versions
     where version = 1
       and assertion_id in (
         '00000000-0000-0000-0000-00000000000b',
         '00000000-0000-0000-0000-00000000000c'
       )
     order by assertion_id::text $$,
  $$ values
      ('00000000-0000-0000-0000-00000000000b'),
      ('00000000-0000-0000-0000-00000000000c') $$,
  'two different assertion identities each independently have a version 1'
);

-- 6a: an invalid (non-existent) assertion identity reference is rejected.
select throws_ok(
  $$ insert into public.assertion_versions (assertion_id, version, statement)
     values ('99999999-9999-9999-9999-999999999999', 1, 'orphan version') $$,
  '23503',
  null,
  'assertion_versions with a non-existent assertion identity is rejected'
);

-- 6b: a non-positive version number is rejected.
select throws_ok(
  $$ insert into public.assertion_versions (assertion_id, version, statement)
     values ('00000000-0000-0000-0000-00000000000b', 0, 'zero version') $$,
  '23514',
  null,
  'a non-positive version number is rejected'
);

-- 7 & 8: assertion relationships and curriculum mappings attach to the
-- stable assertion IDENTITY (assertions.id) (WP1.2 SS10, SS52).
select fk_ok(
  'public', 'assertion_relationships', 'from_assertion_id',
  'public', 'assertions', 'id',
  'assertion_relationships.from_assertion_id references assertion identity, not a version'
);
select fk_ok(
  'public', 'assertion_relationships', 'to_assertion_id',
  'public', 'assertions', 'id',
  'assertion_relationships.to_assertion_id references assertion identity, not a version'
);
select fk_ok(
  'public', 'assertion_curriculum_mappings', 'assertion_id',
  'public', 'assertions', 'id',
  'assertion_curriculum_mappings.assertion_id references assertion identity, not a version'
);

-- CC-02B invariant 1: provenance links attach to a SPECIFIC assertion
-- version (assertion_versions.id), not to stable assertion identity.
select fk_ok(
  'public', 'assertion_provenance_links', 'assertion_version_id',
  'public', 'assertion_versions', 'id',
  'assertion_provenance_links.assertion_version_id references a specific assertion version'
);

-- CC-02B invariants 5 & 6: the same stable assertion identity (00b) has
-- version 1 and version 2 with distinct, independently-recorded
-- provenance, and version 1's provenance remains historically present
-- alongside version 2's rather than being overwritten/removed.
select lives_ok(
  $$ insert into public.assertion_provenance_links (assertion_version_id, source_locator_id, provenance_role)
     values ('00000000-0000-0000-0000-00000000000d', '00000000-0000-0000-0000-000000000004', 'INTERPRETS') $$,
  'a provenance link can be recorded for the historical version 1 of SAMPLE-ASSERTION-001'
);

select results_eq(
  $$ select av.version, apl.provenance_role
     from public.assertion_provenance_links apl
     join public.assertion_versions av on av.id = apl.assertion_version_id
     where av.assertion_id = '00000000-0000-0000-0000-00000000000b'
     order by av.version, apl.provenance_role $$,
  $$ values (1, 'INTERPRETS'::text), (2, 'SUPPORTS'::text) $$,
  'version 1 and version 2 of the same assertion identity carry distinct provenance, and version 1''s provenance remains present alongside version 2''s'
);

select * from finish();

rollback;
