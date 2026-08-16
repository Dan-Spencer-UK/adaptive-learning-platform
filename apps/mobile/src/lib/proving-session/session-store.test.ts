/**
 * CC-05C: proves session-position persistence/restoration and
 * evidence-outbox recording, against the same in-memory Jest SQLite mock
 * ./storage/outbox.test.ts and ./storage/db.test.ts use -- see those
 * files' header comments for what this does and does not prove about
 * real on-device persistence.
 */
import * as mockExpoSqlite from "@/lib/storage/__mocks__/expo-sqlite-jest-mock";
import { resetFoundationDbHandleForTests } from "@/lib/storage/db";
import { emitProvingEvidence, generateProvingQuestion, markProvingAnswer } from "@/lib/proving-engine/proving-engine";
import {
  clearProvingSession,
  deriveQueueSeed,
  listProvingEvidence,
  loadProvingSession,
  recordProvingEvidence,
  saveProvingSession,
  type ProvingSessionState,
} from "./session-store";

jest.mock("expo-sqlite", () => mockExpoSqlite);

describe("session-store: session position", () => {
  beforeEach(() => {
    resetFoundationDbHandleForTests();
  });

  it("returns null for a family with no saved session", async () => {
    expect(await loadProvingSession("electrical.ohms_law")).toBeNull();
  });

  it("round-trips a saved session exactly", async () => {
    const state: ProvingSessionState = {
      familyId: "electrical.ohms_law",
      queue: [
        { blueprintId: "ohms_law.solve_for_voltage", seed: 111 },
        { blueprintId: "ohms_law.solve_for_current", seed: 222 },
      ],
      currentIndex: 1,
      startedAt: "2026-08-16T00:00:00.000Z",
      updatedAt: "2026-08-16T00:00:01.000Z",
    };
    await saveProvingSession(state);
    const loaded = await loadProvingSession("electrical.ohms_law");
    expect(loaded).toEqual(state);
  });

  it("regenerates a byte-identical question instance from a restored session's stored seed", async () => {
    const state: ProvingSessionState = {
      familyId: "electrical.ohms_law",
      queue: [{ blueprintId: "ohms_law.solve_for_resistance", seed: 555 }],
      currentIndex: 0,
      startedAt: "2026-08-16T00:00:00.000Z",
      updatedAt: "2026-08-16T00:00:00.000Z",
    };
    await saveProvingSession(state);

    const restored = await loadProvingSession("electrical.ohms_law");
    const entry = restored!.queue[restored!.currentIndex]!;
    const original = generateProvingQuestion({ familyId: "electrical.ohms_law", blueprintId: entry.blueprintId, seed: entry.seed });
    const regenerated = generateProvingQuestion({ familyId: "electrical.ohms_law", blueprintId: entry.blueprintId, seed: entry.seed });
    expect(JSON.stringify(regenerated)).toBe(JSON.stringify(original));
  });

  it("clearing a session makes it load as null again", async () => {
    const state: ProvingSessionState = {
      familyId: "electrical.series_circuits",
      queue: [{ blueprintId: "series.calculate_total_resistance", seed: 1 }],
      currentIndex: 0,
      startedAt: "2026-08-16T00:00:00.000Z",
      updatedAt: "2026-08-16T00:00:00.000Z",
    };
    await saveProvingSession(state);
    await clearProvingSession("electrical.series_circuits");
    expect(await loadProvingSession("electrical.series_circuits")).toBeNull();
  });

  it("deriveQueueSeed is stable for the same inputs and varies with index", () => {
    expect(deriveQueueSeed(1000, 0)).toBe(deriveQueueSeed(1000, 0));
    expect(deriveQueueSeed(1000, 0)).not.toBe(deriveQueueSeed(1000, 1));
  });
});

describe("session-store: evidence recording", () => {
  beforeEach(() => {
    resetFoundationDbHandleForTests();
  });

  it("records a graded interaction's evidence and lists it back, most-recent first", async () => {
    const instance = generateProvingQuestion({ familyId: "electrical.ohms_law", blueprintId: "ohms_law.solve_for_voltage", seed: 9 });
    const evaluation = markProvingAnswer(instance, instance.expected.value);
    const evidence = emitProvingEvidence(instance, evaluation);

    await recordProvingEvidence(evidence, instance.expected.value);
    const all = await listProvingEvidence();

    expect(all).toHaveLength(1);
    expect(all[0]!.evidence.questionBlueprintId).toBe("ohms_law.solve_for_voltage");
    expect(all[0]!.evidence.correct).toBe(true);
    expect(all[0]!.givenAnswer).toBe(instance.expected.value);
  });

  it("evidence remains pending (never marked synced) -- no sync target exists in this proving slice", async () => {
    const instance = generateProvingQuestion({ familyId: "electrical.ohms_law", blueprintId: "ohms_law.solve_for_current", seed: 2 });
    const evaluation = markProvingAnswer(instance, instance.expected.value);
    const evidence = emitProvingEvidence(instance, evaluation);
    const record = await recordProvingEvidence(evidence, instance.expected.value);
    expect(record.status).toBe("pending");
  });
});
