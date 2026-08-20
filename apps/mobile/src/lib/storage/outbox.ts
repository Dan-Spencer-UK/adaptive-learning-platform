/**
 * Minimal durable pending-sync / outbox FOUNDATION, proving the
 * infrastructure shape required by the future offline evidence-sync
 * model (docs/architecture/MOBILE-ARCHITECTURE.md §2, Evidence sync).
 *
 * This is deliberately NOT final learner-evidence semantics: it proves
 * that a locally-written event can (1) be assigned stable idempotency
 * identity, (2) survive process restart, (3) be marked pending, (4) be
 * read back for later sync, and (5) transition to a non-pending state
 * after a (here, simulated) acknowledgement. No mastery/evidence logic,
 * no production learner table, and no real network sync exists in this
 * module -- see docs/architecture/evidence/CC-04N-MOBILE-FOUNDATION-EVIDENCE.md
 * for what was actually exercised.
 */
import { getFoundationDb } from "./db";
import { randomId } from "./random-id";

export type OutboxStatus = "pending" | "synced";

export type OutboxRecord = {
  readonly id: string;
  readonly eventType: string;
  readonly payload: string;
  readonly status: OutboxStatus;
  readonly createdAt: string;
  readonly syncedAt: string | null;
  /** Stable learner ownership recorded at WRITE time (CC-06D, Correction E §9.3). Null only for legacy/diagnostic foundation events with no owning learner; learner evidence events always carry it, and ownership is never reassigned. */
  readonly learnerId: string | null;
};

type OutboxRow = {
  id: string;
  event_type: string;
  payload: string;
  status: OutboxStatus;
  created_at: string;
  synced_at: string | null;
  learner_id: string | null;
};

function toRecord(row: OutboxRow): OutboxRecord {
  return {
    id: row.id,
    eventType: row.event_type,
    payload: row.payload,
    status: row.status,
    createdAt: row.created_at,
    syncedAt: row.synced_at,
    learnerId: row.learner_id ?? null,
  };
}

/**
 * Writes a new pending outbox event with a stable, locally-generated
 * idempotency id. `eventType` and `payload` are foundation-fixture
 * concepts (e.g. "dev-proof.synthetic-event") -- never a real learner
 * evidence/mastery event in this package.
 */
export async function enqueueOutboxEvent(
  eventType: string,
  payload: Record<string, unknown>,
  learnerId: string | null = null,
): Promise<OutboxRecord> {
  const db = await getFoundationDb();
  const id = randomId();
  const createdAt = new Date().toISOString();
  const payloadJson = JSON.stringify(payload);

  await db.runAsync(
    `INSERT INTO foundation_outbox (id, event_type, payload, status, created_at, synced_at, learner_id)
     VALUES (?, ?, ?, 'pending', ?, NULL, ?)`,
    id,
    eventType,
    payloadJson,
    createdAt,
    learnerId,
  );

  return { id, eventType, payload: payloadJson, status: "pending", createdAt, syncedAt: null, learnerId };
}

/** Deterministic read of all pending events, oldest first. */
export async function listPendingOutboxEvents(): Promise<readonly OutboxRecord[]> {
  const db = await getFoundationDb();
  const rows = await db.getAllAsync<OutboxRow>(
    "SELECT * FROM foundation_outbox WHERE status = 'pending' ORDER BY created_at ASC",
  );
  return rows.map(toRecord);
}

/**
 * Marks an event as synced after a (simulated/controlled) acknowledgement.
 * No real network call happens here -- this proves the state-transition
 * shape only.
 */
export async function markOutboxEventSynced(id: string): Promise<void> {
  const db = await getFoundationDb();
  await db.runAsync(
    "UPDATE foundation_outbox SET status = 'synced', synced_at = ? WHERE id = ?",
    new Date().toISOString(),
    id,
  );
}

export async function getOutboxEventById(id: string): Promise<OutboxRecord | null> {
  const db = await getFoundationDb();
  const row = await db.getFirstAsync<OutboxRow>(
    "SELECT * FROM foundation_outbox WHERE id = ?",
    id,
  );
  return row ? toRecord(row) : null;
}
