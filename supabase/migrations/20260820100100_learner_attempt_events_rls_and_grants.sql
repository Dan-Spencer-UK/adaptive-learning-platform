-- CC-07: RLS + grants for learner_attempt_events.
--
-- Deny-by-default baseline (CC-02/CC-03) continues. An authenticated
-- learner may INSERT and SELECT only their own attempt events. There is
-- deliberately NO update policy, NO delete policy, and NO update/delete
-- grant for any client role: raw evidence is append-only in product
-- semantics (CC-07 task brief §12). Interpretation changes are expressed
-- as a new mastery policy version re-deriving from the same untouched
-- history, never as edits to it. anon receives nothing.

alter table public.learner_attempt_events enable row level security;

create policy learner_attempt_events_select_own
  on public.learner_attempt_events
  for select
  to authenticated
  using (learner_id = auth.uid());

-- WITH CHECK ownership: a learner can never insert a row claiming another
-- learner's ownership (an event created for learner A can never upload as
-- learner B -- task brief §13.2 server half).
create policy learner_attempt_events_insert_own
  on public.learner_attempt_events
  for insert
  to authenticated
  with check (learner_id = auth.uid());

-- REVOKE ALL first (CC-03 pattern): strip residual default privileges
-- (REFERENCES/TRIGGER/TRUNCATE) before granting back exactly what the
-- policies mediate. UPDATE/DELETE are intentionally never granted --
-- append-only is enforced at the privilege layer as defence-in-depth
-- alongside the absent policies.
revoke all on public.learner_attempt_events from anon, authenticated;

grant select, insert on public.learner_attempt_events to authenticated;
