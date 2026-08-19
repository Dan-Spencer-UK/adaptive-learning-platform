/**
 * Local durable-storage foundation (Expo SQLite), per
 * docs/architecture/MOBILE-ARCHITECTURE.md §2 (Local storage and session
 * state). Deliberately small: `foundation_state` (minimal session/
 * local-state key-value record), `foundation_outbox` (minimal
 * pending-sync/outbox proof), and (from version 2) `local_lesson_content`
 * (the Lesson Player's local content-availability record -- see
 * ./lesson-content/local-content-store.ts). This is NOT the future
 * learner/content schema and does NOT mirror any Supabase table -- see
 * MOBILE-ARCHITECTURE.md §2's "published learner-runtime projection"
 * boundary, still not fully implemented.
 *
 * Schema is versioned via SQLite's own `PRAGMA user_version`, the pattern
 * documented by Expo SQLite itself (https://docs.expo.dev/versions/latest/sdk/sqlite/,
 * verified 2026-08-15) -- no separate migration framework is introduced.
 */
import * as SQLite from "expo-sqlite";

const DATABASE_NAME = "alp-foundation.db";
export const DATABASE_VERSION = 2;

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
  {
    // Lesson Player local content library (task brief §25J): tracks, per
    // (lesson, version, content release), whether that lesson's governed
    // content dependencies have been validated as locally available --
    // the persistence half of ./lesson-content/content-availability.ts's
    // pure completeness check. Deliberately its own table, not a
    // foundation_state blob: this is structured, queryable-by-key content
    // metadata, not opaque session state.
    version: 2,
    apply: async (db) => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS local_lesson_content (
          content_key TEXT PRIMARY KEY NOT NULL,
          lesson_id TEXT NOT NULL,
          lesson_version INTEGER NOT NULL,
          content_release TEXT NOT NULL,
          status TEXT NOT NULL CHECK (status IN ('ready', 'invalid')),
          missing_dependencies TEXT NOT NULL,
          prepared_at TEXT,
          updated_at TEXT NOT NULL
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
