/**
 * Minimal local key-value state record, proving that a small piece of
 * non-auth application state persists across app restart. See
 * docs/architecture/MOBILE-ARCHITECTURE.md §2 and §4 (App lifecycle).
 */
import { getFoundationDb } from "./db";

export async function setFoundationState(key: string, value: string): Promise<void> {
  const db = await getFoundationDb();
  await db.runAsync(
    `INSERT INTO foundation_state (key, value, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
    key,
    value,
    new Date().toISOString(),
  );
}

export async function getFoundationState(key: string): Promise<string | null> {
  const db = await getFoundationDb();
  const row = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM foundation_state WHERE key = ?",
    key,
  );
  return row?.value ?? null;
}
