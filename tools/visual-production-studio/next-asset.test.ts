import { describe, expect, it } from "vitest";
import { CATALOGUE, findCatalogueEntry } from "./catalogue.ts";
import { pickNextAsset } from "./next-asset.ts";
import { defaultState, type StudioState } from "./state-store.ts";

describe("pickNextAsset", () => {
  it("recommends the lowest-sequence P0 asset when every entry starts at its default status", () => {
    const state = defaultState();
    const next = pickNextAsset(CATALOGUE, state);
    expect(next?.assetId).toBe("unit202.right-hand-grip.teaching"); // sequence 1, P0
  });

  it("never recommends a REFERENCE_NOT_READY (blocked) entry, even if nothing else is actionable", () => {
    const onlyBlocked: StudioState = {};
    for (const entry of CATALOGUE) onlyBlocked[entry.assetId] = { status: "REFERENCE_NOT_READY", updatedAt: "" };
    expect(pickNextAsset(CATALOGUE, onlyBlocked)).toBeNull();
  });

  it("skips a higher-priority asset once it is APPROVED/SAVED and recommends the next actionable one by priority order", () => {
    const state = defaultState();
    state["unit202.right-hand-grip.teaching"] = { status: "SAVED", updatedAt: "" };
    const next = pickNextAsset(CATALOGUE, state);
    expect(next?.priority).toBe("P0");
    expect(next?.assetId).not.toBe("unit202.right-hand-grip.teaching");
  });

  it("prefers a lower priority number over a later sequence number", () => {
    const state: StudioState = {};
    for (const entry of CATALOGUE) state[entry.assetId] = { status: "APPROVED", updatedAt: "" };
    // Free up one P1 and one P0 asset -- P0 must still win regardless of sequence order.
    state["unit202.waveform.sine"] = { status: "READY_TO_PROMPT", updatedAt: "" }; // P1, sequence 15
    state["unit202.magnet.field"] = { status: "READY_TO_PROMPT", updatedAt: "" }; // P0, sequence 8
    const next = pickNextAsset(CATALOGUE, state);
    expect(next?.assetId).toBe("unit202.magnet.field");
  });

  it("returns null once every actionable entry is approved/saved/blocked", () => {
    const state: StudioState = {};
    for (const entry of CATALOGUE) {
      state[entry.assetId] = { status: entry.referenceReadiness === "NOT_READY" ? "REFERENCE_NOT_READY" : "SAVED", updatedAt: "" };
    }
    expect(pickNextAsset(CATALOGUE, state)).toBeNull();
  });

  it("recommends a NEEDS_REVIEW asset (still actionable) over a done one", () => {
    const state: StudioState = {};
    for (const entry of CATALOGUE) state[entry.assetId] = { status: "SAVED", updatedAt: "" };
    state["unit202.fleming-left-hand.teaching"] = { status: "NEEDS_REVIEW", updatedAt: "" };
    expect(pickNextAsset(CATALOGUE, state)?.assetId).toBe("unit202.fleming-left-hand.teaching");
  });

  it("a sanity check that the fixture asset ids referenced above actually exist in the catalogue", () => {
    for (const id of ["unit202.right-hand-grip.teaching", "unit202.waveform.sine", "unit202.magnet.field", "unit202.fleming-left-hand.teaching"]) {
      expect(findCatalogueEntry(id)).toBeDefined();
    }
  });
});
