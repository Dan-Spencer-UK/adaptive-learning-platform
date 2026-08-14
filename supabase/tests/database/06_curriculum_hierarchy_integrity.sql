-- CC-02A pgTAP: curriculum parent/version integrity
--
-- Proves that curriculum_nodes.parent_node_id cannot silently reference a
-- node belonging to a different curriculum_version_id: the declarative
-- composite foreign key (parent_node_id, curriculum_version_id) references
-- curriculum_nodes (id, curriculum_version_id) enforces this at the
-- database level rather than relying on application code. Root nodes with
-- a null parent remain valid because a multi-column FK is not checked when
-- any referencing column is null.

begin;

select plan(4);

-- A child node may reference a valid parent within the same curriculum
-- version (extends the seeded hierarchy under AC1.1's parent, LO1).
select lives_ok(
  $$ insert into public.curriculum_nodes (curriculum_version_id, parent_node_id, node_type, code, title, sequence_order)
     values (
       '00000000-0000-0000-0000-000000000006',
       '00000000-0000-0000-0000-000000000009',
       'ASSESSMENT_CRITERION',
       'AC1.2',
       'Sample Assessment Criterion 1.2',
       2
     ) $$,
  'a child node may reference a valid parent within the same curriculum version'
);

-- Fixture: a second, unrelated curriculum + curriculum_version + node, to
-- prove cross-curriculum-version parent references are rejected.
insert into public.curricula (id, code, name)
values ('11111111-1111-1111-1111-111111111112', 'OTHER-QUAL-001', 'Other Qualification (pgTAP fixture)');

insert into public.curriculum_versions (id, curriculum_id, version_label, status)
values ('11111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111112', 'v1.0 (fixture)', 'CURRENT');

insert into public.curriculum_nodes (id, curriculum_version_id, parent_node_id, node_type, code, title, sequence_order)
values ('11111111-1111-1111-1111-111111111114', '11111111-1111-1111-1111-111111111113', null, 'QUALIFICATION', 'OTHER-QUAL-001', 'Other Qualification', 1);

-- A child in curriculum version A is rejected if it references a parent
-- node that belongs to a different curriculum version B.
select throws_ok(
  $$ insert into public.curriculum_nodes (curriculum_version_id, parent_node_id, node_type, code, title, sequence_order)
     values (
       '00000000-0000-0000-0000-000000000006',
       '11111111-1111-1111-1111-111111111114',
       'UNIT',
       'CROSS-VERSION-UNIT',
       'Cross-curriculum-version parent attempt',
       2
     ) $$,
  '23503',
  null,
  'a child node cannot reference a parent node belonging to a different curriculum version'
);

-- Normal root nodes with no parent remain valid.
select lives_ok(
  $$ insert into public.curriculum_nodes (curriculum_version_id, parent_node_id, node_type, code, title, sequence_order)
     values (
       '00000000-0000-0000-0000-000000000006',
       null,
       'QUALIFICATION',
       'SAMPLE-QUAL-001-ROOT-ALT',
       'Alternate root node with no parent',
       2
     ) $$,
  'a root node with no parent remains valid'
);

-- A node cannot reference itself as its own parent.
select throws_ok(
  $$ insert into public.curriculum_nodes (id, curriculum_version_id, parent_node_id, node_type, code, title, sequence_order)
     values (
       '22222222-2222-2222-2222-222222222222',
       '00000000-0000-0000-0000-000000000006',
       '22222222-2222-2222-2222-222222222222',
       'UNIT',
       'SELF-PARENT-TEST',
       'Self-parent attempt',
       99
     ) $$,
  '23514',
  null,
  'a node cannot reference itself as its own parent'
);

select * from finish();

rollback;
