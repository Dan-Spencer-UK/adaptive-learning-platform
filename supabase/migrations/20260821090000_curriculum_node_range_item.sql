-- CC-09A: add RANGE_ITEM to the curriculum_nodes.node_type vocabulary.
--
-- An official City & Guilds handbook Assessment Criterion is frequently
-- followed by a "Range" box listing individual mandatory items (e.g. a
-- named electrical quantity, a named electronic component) that a
-- complete-coverage claim must be able to enumerate and trace
-- mechanically -- previously these items existed only as prose inside a
-- code comment, never as governed, queryable curriculum requirements.
-- RANGE_ITEM's parent is always the ASSESSMENT_CRITERION node the Range
-- box belongs to (enforced at the manifest layer by
-- @alp/content-schema's knowledge-graph schema, not by a new CHECK here
-- -- this migration only widens the existing generic node_type
-- vocabulary, matching the table comment's "generic node_type, not
-- qualification-specific table names" design).
--
-- Postgres has no ALTER TABLE ... ALTER CONSTRAINT for CHECK; the
-- constraint must be dropped and recreated. The table has no fixed
-- system-generated constraint name to guess at reliably across
-- environments, so this looks it up from pg_constraint by table + column
-- reference rather than hardcoding a name.

do $$
declare
  v_constraint_name text;
begin
  select conname into v_constraint_name
  from pg_constraint
  where conrelid = 'public.curriculum_nodes'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) ilike '%node_type%QUALIFICATION%';

  if v_constraint_name is not null then
    execute format('alter table public.curriculum_nodes drop constraint %I', v_constraint_name);
  end if;
end $$;

alter table public.curriculum_nodes
  add constraint curriculum_nodes_node_type_check
  check (node_type in ('QUALIFICATION', 'UNIT', 'LEARNING_OUTCOME', 'ASSESSMENT_CRITERION', 'RANGE_ITEM'));

comment on table public.curriculum_nodes is
  'A node within a curriculum version hierarchy (qualification/unit/learning-outcome/assessment-criterion/range-item). Generic node_type, not qualification-specific table names.';
