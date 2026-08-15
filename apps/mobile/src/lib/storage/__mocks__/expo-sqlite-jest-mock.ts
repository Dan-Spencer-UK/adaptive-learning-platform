/**
 * A deliberately minimal, hand-rolled in-memory stand-in for the specific
 * expo-sqlite queries this repository's db.ts/outbox.ts/foundation-state.ts
 * modules issue -- NOT a general SQL engine, and NOT a proof that the real
 * native expo-sqlite binding works.
 *
 * Why this exists: expo-sqlite is a genuine native module. Running it
 * under Jest fails with `NativeDatabase is not a constructor`
 * (confirmed empirically 2026-08-15 in this repository -- see
 * docs/architecture/evidence/CC-04N-MOBILE-FOUNDATION-EVIDENCE.md), because
 * there is no compiled native app / device / emulator in this test
 * environment. That failure is itself real, honest evidence of the
 * environment's limits, not a bug to silently paper over.
 *
 * This mock exists ONLY to give logic-level coverage of the migration/
 * outbox/foundation-state ORCHESTRATION code in this repository (correct
 * SQL statement shape, correct call sequence, correct state transitions)
 * -- it does not exercise real SQLite semantics, real file persistence,
 * or the real native binding. Real on-device/emulator SQLite execution
 * remains a separate, PENDING verification item.
 */

type Row = Record<string, unknown>;

class MockSQLiteDatabase {
  private tables = new Map<string, Row[]>();
  private userVersion = 0;

  async execAsync(sql: string): Promise<void> {
    if (/PRAGMA user_version\s*=\s*(\d+)/i.test(sql)) {
      const match = sql.match(/PRAGMA user_version\s*=\s*(\d+)/i);
      this.userVersion = Number(match?.[1] ?? 0);
      return;
    }
    const createMatches = [...sql.matchAll(/CREATE TABLE IF NOT EXISTS (\w+)/gi)];
    for (const m of createMatches) {
      const tableName = m[1];
      if (tableName && !this.tables.has(tableName)) {
        this.tables.set(tableName, []);
      }
    }
  }

  async getFirstAsync<T extends Row>(sql: string, ...params: unknown[]): Promise<T | null> {
    if (/PRAGMA user_version/i.test(sql)) {
      return { user_version: this.userVersion } as unknown as T;
    }
    if (/FROM foundation_state WHERE key = \?/i.test(sql)) {
      const rows = this.tables.get("foundation_state") ?? [];
      return (rows.find((r) => r.key === params[0]) as T) ?? null;
    }
    if (/FROM foundation_outbox WHERE id = \?/i.test(sql)) {
      const rows = this.tables.get("foundation_outbox") ?? [];
      return (rows.find((r) => r.id === params[0]) as T) ?? null;
    }
    return null;
  }

  async getAllAsync<T extends Row>(sql: string, ...params: unknown[]): Promise<T[]> {
    if (/sqlite_master/i.test(sql)) {
      return [...this.tables.keys()]
        .filter((name) => name.startsWith("foundation_"))
        .map((name) => ({ name })) as unknown as T[];
    }
    if (/FROM foundation_outbox WHERE status = 'pending'/i.test(sql)) {
      const rows = (this.tables.get("foundation_outbox") ?? []).filter(
        (r) => r.status === "pending",
      );
      return [...rows].sort((a, b) =>
        String(a.created_at).localeCompare(String(b.created_at)),
      ) as T[];
    }
    return [];
  }

  async runAsync(sql: string, ...params: unknown[]): Promise<{ changes: number }> {
    if (/INSERT INTO foundation_state/i.test(sql)) {
      const [key, value, updatedAt] = params;
      const rows = this.tables.get("foundation_state") ?? [];
      const existing = rows.find((r) => r.key === key);
      if (existing) {
        existing.value = value;
        existing.updated_at = updatedAt;
      } else {
        rows.push({ key, value, updated_at: updatedAt });
      }
      this.tables.set("foundation_state", rows);
      return { changes: 1 };
    }
    if (/INSERT INTO foundation_outbox/i.test(sql)) {
      const [id, eventType, payload, createdAt] = params;
      const rows = this.tables.get("foundation_outbox") ?? [];
      rows.push({
        id,
        event_type: eventType,
        payload,
        status: "pending",
        created_at: createdAt,
        synced_at: null,
      });
      this.tables.set("foundation_outbox", rows);
      return { changes: 1 };
    }
    if (/UPDATE foundation_outbox SET status = 'synced'/i.test(sql)) {
      const [syncedAt, id] = params;
      const rows = this.tables.get("foundation_outbox") ?? [];
      const row = rows.find((r) => r.id === id);
      if (row) {
        row.status = "synced";
        row.synced_at = syncedAt;
      }
      return { changes: row ? 1 : 0 };
    }
    return { changes: 0 };
  }
}

export async function openDatabaseAsync(_name: string): Promise<MockSQLiteDatabase> {
  return new MockSQLiteDatabase();
}
