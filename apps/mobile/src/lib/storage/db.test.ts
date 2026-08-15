/**
 * Logic-level test for the SQLite foundation, run against the hand-rolled
 * in-memory mock in ./__mocks__/expo-sqlite-jest-mock.ts -- NOT the real
 * native expo-sqlite binding (confirmed unavailable under Jest in this
 * environment; see that file's header comment and
 * docs/architecture/evidence/CC-04N-MOBILE-FOUNDATION-EVIDENCE.md). This
 * proves the migration/versioning ORCHESTRATION logic in db.ts is
 * correct; it does not prove real on-device SQLite persistence, which
 * remains a separate, PENDING real-device/emulator verification item.
 */
import * as mockExpoSqlite from "./__mocks__/expo-sqlite-jest-mock";
import { DATABASE_VERSION, getFoundationDb, resetFoundationDbHandleForTests } from "./db";

jest.mock("expo-sqlite", () => mockExpoSqlite);

describe("getFoundationDb", () => {
  beforeEach(() => {
    resetFoundationDbHandleForTests();
  });

  it("opens the database and creates the foundation tables", async () => {
    const db = await getFoundationDb();
    const row = await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version");
    expect(row?.user_version).toBe(DATABASE_VERSION);

    const tables = await db.getAllAsync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name LIKE 'foundation_%'",
    );
    const tableNames = tables.map((t) => t.name).sort();
    expect(tableNames).toEqual(["foundation_outbox", "foundation_state"]);
  });

  it("is idempotent -- reopening does not fail and does not duplicate migrations", async () => {
    await getFoundationDb();
    resetFoundationDbHandleForTests();
    const db = await getFoundationDb();

    const row = await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version");
    expect(row?.user_version).toBe(DATABASE_VERSION);
  });
});
