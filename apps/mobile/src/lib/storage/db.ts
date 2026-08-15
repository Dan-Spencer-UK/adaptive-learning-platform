/**
 * Local durable-storage foundation (Expo SQLite), per
 * docs/architecture/MOBILE-ARCHITECTURE.md §2 (Local storage and session
 * state). Deliberately small: two foundation tables only --
 * `foundation_state` (minimal session/local-state key-value record) and
 * `foundation_outbox` (minimal pending-sync/outbox proof). This is NOT the
 * future learner/content schema and does NOT mirror any Supabase table --
 * see MOBILE-ARCHITECTURE.md §2's "published learner-runtime projection"
 * boundary, which CC-04N does not implement.
 *
 * Schema is versioned via SQLite's own `PRAGMA user_version`, the pattern
 * documented by Expo SQLite itself (https://docs.expo.dev/versions/latest/sdk/sqlite/,
 * verified 2026-08-15) -- no separate migration framework is introduced.
 */
import * as SQLite from "expo-sqlite";

const DATABASE_NAME = "alp-foundation.db";
export const DATABASE_VERSION = 1;

type Migration = {
  readonly version: number;
  readonly apply: (db: SQLite.SQLiteDatabase) => Promise<void>;
};

const migrations: readonly Migration[] = [
  {
    version: 1,
    apply: async (db) => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS foundation_state (
          key TEXT PRIMARY KEY NOT NULL,
          value TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS foundation_outbox (
          id TEXT PRIMARY KEY NOT NULL,
          event_type TEXT NOT NULL,
          payload TEXT NOT NULL,
          status TEXT NOT NULL CHECK (status IN ('pending', 'synced')),
          created_at TEXT NOT NULL,
          synced_at TEXT
        );
      `);
    },
  },
];

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/**
 * Opens (or returns the already-open) foundation database and applies any
 * outstanding migrations. Safe to call repeatedly / on every app start --
 * migrations are skipped once `user_version` is already current.
 */
export function getFoundationDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = openAndMigrate();
  }
  return dbPromise;
}

/**
 * Test/dev-only escape hatch to force a fresh open (e.g. between Jest
 * test cases). Not used by application startup code.
 */
export function resetFoundationDbHandleForTests(): void {
  dbPromise = null;
}

async function openAndMigrate(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);

  const row = await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version");
  let currentVersion = row?.user_version ?? 0;

  for (const migration of migrations) {
    if (migration.version <= currentVersion) {
      continue;
    }
    await migration.apply(db);
    await db.execAsync(`PRAGMA user_version = ${migration.version}`);
    currentVersion = migration.version;
  }

  return db;
}
