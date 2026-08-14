-- CC-03: minimal learner profile + RLS isolation-proving schema
--
-- This migration establishes the minimum schema required to prove
-- authentication and cross-user Row Level Security isolation for the
-- proving slice. It deliberately does NOT implement the wider learner
-- model (evidence, mastery, attempts, diagnostics, curriculum enrolment,
-- lesson progress) -- that is later CC-package scope.

-- ---------------------------------------------------------------------
-- learner_profiles
--
-- Associates an authenticated Supabase Auth user with an application
-- learner identity. Intentionally minimal: no demographic/preference
-- fields. Email/display data is read from the authenticated session
-- (auth.users / JWT claims) rather than duplicated here.
-- ---------------------------------------------------------------------

create table public.learner_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at
  before update on public.learner_profiles
  for each row execute function public.set_updated_at();

comment on table public.learner_profiles is
  'Minimal application learner identity linked 1:1 to auth.users. Created client-side (RLS-mediated upsert) on first successful sign-in, not via an auth.users trigger. No learner evidence/mastery/product data belongs here.';

comment on column public.learner_profiles.id is
  'Equal to the owning auth.users.id. Cascades on auth user deletion so no orphaned profile can remain.';

-- ---------------------------------------------------------------------
-- learner_isolation_probe
--
-- NOT a product/evidence table. Its sole purpose is to give CC-03 a
-- concrete learner-owned object to prove Row Level Security isolation
-- against (User A cannot read/write User B's row; anonymous access is
-- denied). Do not extend this table with product fields; the future
-- learner evidence/mastery model belongs to later CC packages.
-- ---------------------------------------------------------------------

create table public.learner_isolation_probe (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.learner_profiles (id) on delete cascade,
  note text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at
  before update on public.learner_isolation_probe
  for each row execute function public.set_updated_at();

comment on table public.learner_isolation_probe is
  'CC-03 security-test fixture table only. Proves per-learner RLS isolation (SELECT/INSERT/UPDATE ownership). Not the future learner evidence/attempt/mastery model -- do not build product features on this table.';

create index learner_isolation_probe_learner_id_idx on public.learner_isolation_probe (learner_id);
