/**
 * CC-05C: session position/restoration and evidence persistence for the
 * native proving slice, built entirely on the existing CC-04N local
 * persistence foundation (lib/storage/foundation-state.ts,
 * lib/storage/outbox.ts) -- no new SQLite table, no new sync mechanism.
 * This is deliberately narrow (task brief §17/§19: "without expanding
 * into full production sync", "do not turn this into broad learner-state
 * implementation"):
 *
 * - Session POSITION (which family, which question queue, which index) is
 *   a single JSON blob per family under `foundation_state` -- the same
 *   key-value table CC-04N already proves survives app restart.
 * - Evidence RECORDS are written through the existing outbox
 *   (`foundation_outbox`) as `proving.evidence` events. They are never
 *   marked synced here -- there is no real sync target yet (CC-06+ scope);
 *   they correctly remain "pending", which is an honest representation of
 *   "recorded locally, not yet reconciled with a server" (see
 *   docs/architecture/MOBILE-ARCHITECTURE.md §2, Evidence sync).
 */
import type { AnswerValue, QuestionEvidenceRecord } from "@alp/calculation-engine";

import { getFoundationState, setFoundationState } from "@/lib/storage/foundation-state";
import { enqueueOutboxEvent, listPendingOutboxEvents, type OutboxRecord } from "@/lib/storage/outbox";

const SESSION_STATE_KEY_PREFIX = "proving_session.";
const EVIDENCE_EVENT_TYPE = "proving.evidence";

export interface ProvingQueueEntry {
  readonly blueprintId: string;
  readonly seed: number;
}

export interface ProvingSessionState {
  readonly familyId: string;
  readonly queue: readonly ProvingQueueEntry[];
  readonly currentIndex: number;
  readonly startedAt: string;
  readonly updatedAt: string;
}

function sessionKey(familyId: string): string {
  return `${SESSION_STATE_KEY_PREFIX}${familyId}`;
}

/** Persists session position so an interrupted session (backgrounding, restart) is resumable -- Mobile UX Engineering Standard §6. */
export async function saveProvingSession(state: ProvingSessionState): Promise<void> {
  await setFoundationState(sessionKey(state.familyId), JSON.stringify(state));
}

/** Returns the most recently saved session for a family, or null if none exists (first visit, or a previously cleared session). */
export async function loadProvingSession(familyId: string): Promise<ProvingSessionState | null> {
  const raw = await getFoundationState(sessionKey(familyId));
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as ProvingSessionState;
  } catch {
    return null;
  }
}

/** Clears a family's saved session (e.g. after the learner finishes the practice queue, or starts a fresh one deliberately). */
export async function clearProvingSession(familyId: string): Promise<void> {
  await setFoundationState(sessionKey(familyId), JSON.stringify(null));
}

/** A deterministic, session-scoped seed for the Nth question in a family's queue -- stable across restarts once persisted (see ProvingQueueEntry). */
export function deriveQueueSeed(sessionStartedAtMs: number, index: number): number {
  // Simple, stable, non-cryptographic combination -- determinism only
  // requires "same inputs -> same seed", not entropy quality (the real
  // randomness source is @alp/calculation-engine's mulberry32 PRNG, seeded
  // from this value -- see proving-engine.ts).
  return (sessionStartedAtMs % 1_000_000) * 1000 + index;
}

export interface RecordedProvingEvidence {
  readonly evidence: QuestionEvidenceRecord;
  readonly givenAnswer: AnswerValue;
  readonly recordedAt: string;
}

/** Writes a graded interaction's evidence to the durable outbox queue -- local-first, optimistic, not yet synced (no sync target exists in this proving slice). */
export async function recordProvingEvidence(
  evidence: QuestionEvidenceRecord,
  givenAnswer: AnswerValue,
): Promise<OutboxRecord> {
  const payload: RecordedProvingEvidence = {
    evidence,
    givenAnswer,
    recordedAt: new Date().toISOString(),
  };
  return enqueueOutboxEvent(EVIDENCE_EVENT_TYPE, payload as unknown as Record<string, unknown>);
}

/** Lists every locally-recorded proving-evidence event (all pending -- see module header), most recent first. */
export async function listProvingEvidence(): Promise<readonly RecordedProvingEvidence[]> {
  const events = await listPendingOutboxEvents();
  const parsed: RecordedProvingEvidence[] = [];
  for (const event of events) {
    if (event.eventType !== EVIDENCE_EVENT_TYPE) continue;
    try {
      parsed.push(JSON.parse(event.payload) as RecordedProvingEvidence);
    } catch {
      // Skip a malformed payload rather than fail the whole listing.
    }
  }
  return parsed.slice().reverse();
}
