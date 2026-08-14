-- CC-02 pgTAP: assertion relationships
--
-- Verifies that relationship endpoints must reference valid assertions,
-- and that self-links are prevented as required by the CC-02 invariant.

begin;

select plan(4);

-- The seeded PREREQUISITE_OF relationship exists between the two fixture
-- assertions.
select results_eq(
  $$ select relationship_type::text
     from public.assertion_relationships
     where from_assertion_id = '00000000-0000-0000-0000-00000000000b'
       and to_assertion_id = '00000000-0000-0000-0000-00000000000c' $$,
  $$ values ('PREREQUISITE_OF'::text) $$,
  'seeded prerequisite relationship exists between the fixture assertions'
);

-- A self-link is rejected.
select throws_ok(
  $$ insert into public.assertion_relationships (from_assertion_id, to_assertion_id, relationship_type)
     values ('00000000-0000-0000-0000-00000000000b', '00000000-0000-0000-0000-00000000000b', 'SUPPORTS') $$,
  '23514',
  null,
  'a self-referential assertion relationship is rejected'
);

-- An invalid from-assertion reference is rejected.
select throws_ok(
  $$ insert into public.assertion_relationships (from_assertion_id, to_assertion_id, relationship_type)
     values ('99999999-9999-9999-9999-999999999999', '00000000-0000-0000-0000-00000000000c', 'SUPPORTS') $$,
  '23503',
  null,
  'relationship with a non-existent from-assertion is rejected'
);

-- An invalid to-assertion reference is rejected.
select throws_ok(
  $$ insert into public.assertion_relationships (from_assertion_id, to_assertion_id, relationship_type)
     values ('00000000-0000-0000-0000-00000000000b', '99999999-9999-9999-9999-999999999999', 'SUPPORTS') $$,
  '23503',
  null,
  'relationship with a non-existent to-assertion is rejected'
);

select * from finish();

rollback;
