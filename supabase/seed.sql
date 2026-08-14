-- CC-02: synthetic development/test seed data
--
-- Entirely fictional fixture data used to prove the CC-02 schema's
-- relationships and to support pgTAP tests. This is NOT the proving-slice
-- Electrical/Foundational Maths content (that is CC-04). No proprietary
-- source wording is reproduced anywhere in this file.
--
-- Proves: one source; one source version; one semantic locator; two
-- synthetic assertion identities (one of which carries two historical
-- versions, demonstrating stable identity with preserved version history);
-- one curriculum hierarchy; one assertion-curriculum mapping; one
-- assertion relationship; one provenance link.

insert into public.domains (id, code, name, description)
values (
  '00000000-0000-0000-0000-000000000001',
  'SAMPLE_DOMAIN',
  'Sample Domain (Development Fixture)',
  'Synthetic domain used only for CC-02 schema/pgTAP fixtures.'
);

insert into public.sources (id, title, publisher, source_family, source_type, jurisdiction, canonical_reference, access_location)
values (
  '00000000-0000-0000-0000-000000000002',
  'Sample Reference Manual (Synthetic Fixture)',
  'Fixture Publishing House',
  'Sample Reference Manual',
  'SAMPLE_REFERENCE',
  'N/A',
  'SAMPLE-REF-001',
  'internal development fixture'
);

insert into public.source_versions (id, source_id, edition, revision, publication_date, effective_date, status, rights_classification)
values (
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000002',
  'v1.0',
  null,
  '2026-01-01',
  '2026-01-01',
  'CURRENT',
  'ORIGINAL'
);

insert into public.source_locators (id, source_version_id, section, paragraph, locator_summary)
values (
  '00000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000003',
  'Section 1',
  '1.1',
  'Section 1, Paragraph 1.1'
);

insert into public.curricula (id, code, name, awarding_body)
values (
  '00000000-0000-0000-0000-000000000005',
  'SAMPLE-QUAL-001',
  'Sample Qualification (Development Fixture)',
  'Fixture Awarding Body'
);

insert into public.curriculum_versions (id, curriculum_id, version_label, effective_date, status)
values (
  '00000000-0000-0000-0000-000000000006',
  '00000000-0000-0000-0000-000000000005',
  'v1.0 (fixture)',
  '2026-01-01',
  'CURRENT'
);

insert into public.curriculum_nodes (id, curriculum_version_id, parent_node_id, node_type, code, title, sequence_order)
values
  ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000006', null, 'QUALIFICATION', 'SAMPLE-QUAL-001', 'Sample Qualification', 1),
  ('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000007', 'UNIT', 'UNIT-01', 'Sample Unit 1', 1),
  ('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000008', 'LEARNING_OUTCOME', 'LO1', 'Sample Learning Outcome 1', 1),
  ('00000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000009', 'ASSESSMENT_CRITERION', 'AC1.1', 'Sample Assessment Criterion 1.1', 1);

insert into public.assertions (id, identifier, domain_id)
values
  (
    '00000000-0000-0000-0000-00000000000b',
    'SAMPLE-ASSERTION-001',
    '00000000-0000-0000-0000-000000000001'
  ),
  (
    '00000000-0000-0000-0000-00000000000c',
    'SAMPLE-ASSERTION-002',
    '00000000-0000-0000-0000-000000000001'
  );

-- SAMPLE-ASSERTION-001 carries two historical versions under the same
-- stable identity, proving that identity and version are correctly
-- decoupled: version 1 remains present and readable after version 2 is
-- recorded as the current approved wording.
insert into public.assertion_versions (id, assertion_id, version, statement, status)
values
  (
    '00000000-0000-0000-0000-00000000000d',
    '00000000-0000-0000-0000-00000000000b',
    1,
    'In a synthetic fixture series arrangement, a shared synthetic flow value is assumed to pass through each connected fixture component.',
    'SUPERSEDED'
  ),
  (
    '00000000-0000-0000-0000-00000000000e',
    '00000000-0000-0000-0000-00000000000b',
    2,
    'In a synthetic fixture series arrangement, the same synthetic flow value passes through each connected fixture component.',
    'APPROVED'
  ),
  (
    '00000000-0000-0000-0000-00000000000f',
    '00000000-0000-0000-0000-00000000000c',
    1,
    'The synthetic flow value in a series fixture arrangement can be calculated by dividing the total synthetic potential by the total synthetic resistance value.',
    'APPROVED'
  );

-- Provenance attaches to the specific assertion VERSION it supports
-- (CC-02B). This supports SAMPLE-ASSERTION-001 version 2 (id 00e), the
-- currently APPROVED version, not the superseded version 1.
insert into public.assertion_provenance_links (assertion_version_id, source_locator_id, provenance_role)
values (
  '00000000-0000-0000-0000-00000000000e',
  '00000000-0000-0000-0000-000000000004',
  'SUPPORTS'
);

insert into public.assertion_relationships (from_assertion_id, to_assertion_id, relationship_type, strength)
values (
  '00000000-0000-0000-0000-00000000000b',
  '00000000-0000-0000-0000-00000000000c',
  'PREREQUISITE_OF',
  'REQUIRED'
);

insert into public.assertion_curriculum_mappings (assertion_id, curriculum_node_id, mapping_type)
values (
  '00000000-0000-0000-0000-00000000000b',
  '00000000-0000-0000-0000-00000000000a',
  'REQUIRED_FOR'
);
