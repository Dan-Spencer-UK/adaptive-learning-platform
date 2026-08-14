-- CC-02: extensions / foundation
--
-- Enables only the extensions actually required by the CC-02 governed
-- knowledge/provenance schema and its pgTAP tests. No vector/AI/PostGIS
-- extensions are enabled; none are required by the approved architecture.

-- gen_random_uuid() for durable, non-sequential primary keys.
create extension if not exists pgcrypto with schema extensions;

-- pgTAP database testing framework (supabase/tests/database).
create extension if not exists pgtap with schema extensions;
