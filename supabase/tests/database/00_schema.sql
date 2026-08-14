-- CC-02 pgTAP: core schema shape
--
-- Verifies the governed knowledge/provenance/curriculum tables, primary
-- keys and foreign keys exist as required by the CC-02 acceptance
-- criteria. This does not test data correctness; seed-data behaviour is
-- covered by 02_provenance_and_mapping.sql, 03_assertion_relationships.sql,
-- 05_assertion_versioning.sql and 06_curriculum_hierarchy_integrity.sql.

begin;

select plan(30);

-- Core tables exist.
select has_table('public', 'domains', 'domains table exists');
select has_table('public', 'sources', 'sources table exists');
select has_table('public', 'source_versions', 'source_versions table exists');
select has_table('public', 'source_locators', 'source_locators table exists');
select has_table('public', 'curricula', 'curricula table exists');
select has_table('public', 'curriculum_versions', 'curriculum_versions table exists');
select has_table('public', 'curriculum_nodes', 'curriculum_nodes table exists');
select has_table('public', 'assertions', 'assertions table exists');
select has_table('public', 'assertion_versions', 'assertion_versions table exists');
select has_table('public', 'assertion_provenance_links', 'assertion_provenance_links table exists');
select has_table('public', 'assertion_relationships', 'assertion_relationships table exists');
select has_table('public', 'assertion_curriculum_mappings', 'assertion_curriculum_mappings table exists');

-- Source identity and source version are distinct objects, linked by FK.
select has_column('public', 'source_versions', 'source_id', 'source_versions references a source');
select col_is_fk('public', 'source_versions', 'source_id', 'source_versions.source_id is a foreign key');

-- Semantic locator structure exists (not a single free-text citation).
select has_column('public', 'source_locators', 'section', 'source_locators has a section field');
select has_column('public', 'source_locators', 'clause', 'source_locators has a clause field');
select has_column('public', 'source_locators', 'page', 'source_locators has a supplementary page field');

-- Primary keys exist on core tables.
select col_is_pk('public', 'assertions', 'id', 'assertions has a primary key');
select col_is_pk('public', 'assertion_versions', 'id', 'assertion_versions has a primary key');
select col_is_pk('public', 'sources', 'id', 'sources has a primary key');
select col_is_pk('public', 'source_versions', 'id', 'source_versions has a primary key');

-- Assertion identifier is stable and unique (identity), independent of
-- version. Version content lives in assertion_versions, unique per
-- (assertion_id, version) rather than globally.
select col_is_unique('public', 'assertions', 'identifier', 'assertions.identifier is unique');
select col_is_fk('public', 'assertion_versions', 'assertion_id', 'assertion_versions references a stable assertion identity');
select col_is_unique(
  'public', 'assertion_versions', ARRAY['assertion_id', 'version'],
  'assertion_versions is unique per (assertion_id, version), not globally by version number'
);

-- Foreign keys exist for the provenance/relationship/mapping edges.
-- Provenance attaches to a SPECIFIC assertion version (CC-02B), not to
-- stable assertion identity.
select col_is_fk('public', 'assertion_provenance_links', 'assertion_version_id', 'provenance link references an assertion version');
select hasnt_column('public', 'assertion_provenance_links', 'assertion_id', 'provenance link does not directly reference stable assertion identity');
select col_is_fk('public', 'assertion_provenance_links', 'source_locator_id', 'provenance link references a source locator');
select col_is_fk('public', 'assertion_relationships', 'from_assertion_id', 'relationship references a from-assertion');
select col_is_fk('public', 'assertion_relationships', 'to_assertion_id', 'relationship references a to-assertion');
select col_is_fk('public', 'assertion_curriculum_mappings', 'curriculum_node_id', 'curriculum mapping references a curriculum node');

select * from finish();

rollback;
