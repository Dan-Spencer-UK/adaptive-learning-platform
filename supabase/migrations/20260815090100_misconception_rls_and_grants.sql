-- CC-04: RLS / security baseline for the misconception schema
--
-- Same deny-by-default posture as CC-02's governed knowledge tables
-- (supabase/migrations/20260814120200_rls_baseline.sql): RLS is enabled
-- and no policy is created for anon or authenticated, and table
-- privileges are explicitly revoked as defence-in-depth beyond RLS. CC-04
-- is not the package that exposes governed knowledge to learners, so
-- misconceptions remain as inaccessible to anon/authenticated as every
-- other CC-02 governed table.

alter table public.misconceptions enable row level security;
alter table public.misconception_assertion_conflicts enable row level security;

revoke all on public.misconceptions from anon, authenticated;
revoke all on public.misconception_assertion_conflicts from anon, authenticated;
