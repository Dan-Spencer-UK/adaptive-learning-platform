/**
 * Logic-level test for the outbox foundation, run against the in-memory
 * Jest mock (see db.test.ts's header comment and
 * ./__mocks__/expo-sqlite-jest-mock.ts) -- proves the outbox
 * pending -> synced state-machine and idempotency-key assignment logic
 * are correct. Real on-device persistence-across-restart remains a
 * separate, PENDING real-device/emulator verification item (see
 * docs/architecture/evidence/CC-04N-MOBILE-FOUNDATION-EVIDENCE.md).
 */
import * as mockExpoSqlite from "./__mocks__/expo-sqlite-jest-mock";
import { resetFoundationDbHandleForTests } from "./db";
import {
  enqueueOutboxEvent,
  getOutboxEventById,
  listPendingOutboxEvents,
  markOutboxEventSynced,
} from "./outbox";

jest.mock("expo-sqlite", () => mockExpoSqlite);

describe("outbox foundation", () => {
  beforeEach(() => {
    resetFoundationDbHandleForTests();
  });

  it("assigns a stable id and starts pending", async () => {
    const event = await enqueueOutboxEvent("test.event", { note: "fixture" });
    expect(event.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(event.status).toBe("pending");
  });

  it("appears in listPendingOutboxEvents before sync and not after", async () => {
    const event = await enqueueOutboxEvent("test.event", { note: "fixture" });

    const pendingBefore = await listPendingOutboxEvents();
    expect(pendingBefore.some((e) => e.id === event.id)).toBe(true);

    await markOutboxEventSynced(event.id);

    const pendingAfter = await listPendingOutboxEvents();
    expect(pendingAfter.some((e) => e.id === event.id)).toBe(false);

    const stored = await getOutboxEventById(event.id);
    expect(stored?.status).toBe("synced");
    expect(stored?.syncedAt).not.toBeNull();
  });

  it("never writes duplicate ids for two separate events", async () => {
    const a = await enqueueOutboxEvent("test.event", { n: 1 });
    const b = await enqueueOutboxEvent("test.event", { n: 2 });
    expect(a.id).not.toBe(b.id);
  });
});
