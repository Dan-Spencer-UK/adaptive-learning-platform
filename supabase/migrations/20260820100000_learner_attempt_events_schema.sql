-- CC-07: durable, append-only, learner-owned raw attempt/evidence events.
--
-- This is the canonical server home of raw learner interaction history:
--
--   RAW ATTEMPTS (this table, append-only, canonical)
--     -> deterministic evidence engine (@alp/evidence-engine, mastery
--        policy versioned) -> derived learner state (recomputable).
--
-- Derived mastery is deliberately NOT persisted here (no snapshot table):
-- raw attempts are the single source of truth and any snapshot is a
-- recomputable projection. See PROJECT-STATUS CC-07 for the scaling
-- boundary of that decision.
--
-- TRUST BOUNDARY (columns prefixed client_ are CLIENT-OBSERVED, not
-- server-canonical): the mobile client is untrusted. A row asserts only
-- "this authenticated learner submitted this answer to this exact
-- governed question identity". `client_correct` / the client_* diagnostic
-- fields record what the on-device deterministic engine concluded; the
-- stable identity columns (question_blueprint_id/version, question_seed,
-- content_release) plus given_answer keep full server-side regeneration
-- and re-marking possible (revalidation seam), and capability/family/
-- misconception attribution is always re-derived from GOVERNED content,
-- never read from a client claim.

create table public.learner_attempt_events (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.learner_profiles (id) on delete cascade,

  -- Deterministic lesson-instance identity (@alp/learning-engine) plus the
  -- unique session occurrence: instanceId alone is deliberately
  -- deterministic (same lesson + same evidence digest => same id), so a
  -- replayed lesson legitimately reuses it; session_key disambiguates.
  lesson_instance_id text not null,
  session_key text not null,

  -- Immutable content provenance (CC-06D identity fields): enough for a
  -- future engine to know exactly which governed content version produced
  -- this attempt, and to reproduce the question deterministically.
  lesson_id text not null,
  lesson_version integer not null check (lesson_version >= 1),
  content_release text not null,
  step_id text not null,
  question_blueprint_id text not null,
  question_blueprint_version integer not null check (question_blueprint_version >= 1),
  question_seed bigint not null,

  -- Deterministic attempt identity within (session_key, step_id): 1 = first attempt.
  attempt_index integer not null check (attempt_index >= 1),
  -- True when the correct answer had already been shown for this step
  -- before this attempt -- such an attempt can never count as independent
  -- first-attempt mastery evidence (CC-06D Correction G).
  answer_revealed_before_attempt boolean not null,

  -- The learner's actual response (JSON-encoded AnswerValue) -- the
  -- irreplaceable raw fact, and the input a future server revalidation
  -- re-marks.
  given_answer jsonb not null,

  -- CLIENT-OBSERVED evaluation results (see trust boundary above).
  client_correct boolean not null,
  client_misconception_identifier text,
  client_evidence_strength text check (client_evidence_strength in ('direct', 'suggestive', 'generic')),

  -- Provenance time (client clock, offline-capable) vs canonical server
  -- ordering (receipt time + monotonic sequence). Client time is evidence
  -- provenance only; it is never the idempotency identity.
  client_recorded_at timestamptz not null,
  server_received_at timestamptz not null default now(),
  server_seq bigint generated always as identity,

  -- The canonical natural event key (CC-07 task brief §8): safe sync
  -- retries/replays of the same real attempt collapse onto one row.
  constraint learner_attempt_events_natural_key
    unique (learner_id, lesson_instance_id, session_key, step_id, attempt_index)
);

comment on table public.learner_attempt_events is
  'Append-only canonical raw learner attempt/evidence events (CC-07). Learner-owned, RLS-isolated, idempotent on the natural event key. Raw history is never updated or deleted by clients; mastery is derived from it by the versioned deterministic evidence engine and is recomputable at any time.';

comment on column public.learner_attempt_events.client_correct is
  'CLIENT-OBSERVED marking result from the on-device deterministic engine. Not server-canonical truth: the row retains blueprint id/version/seed/release + given_answer so the server can regenerate the exact question and re-mark independently.';

comment on column public.learner_attempt_events.client_misconception_identifier is
  'CLIENT-OBSERVED diagnostic hint only. The evidence engine never trusts this field: specific misconception evidence is re-derived from governed content semantics (discriminating instrument + direct-strength target), never from a client claim.';

comment on column public.learner_attempt_events.session_key is
  'Unique id of the session occurrence that produced this attempt. Part of the natural event key because deterministic lesson_instance_id values legitimately recur across replays of the same lesson with the same evidence digest.';

-- Learner history reads (sync/derivation) are per learner in canonical
-- server order.
create index learner_attempt_events_learner_seq_idx
  on public.learner_attempt_events (learner_id, server_seq);
