import { describe, expect, it } from "vitest";
import { allAssets, FAMILIES, findAsset, type VisualFamily } from "./catalogue.ts";
import { pickNextAsset } from "./next-asset.ts";
import { defaultState, type StudioState } from "./state-store.ts";

describe("pickNextAsset", () => {
  it("recommends the lowest-sequence P0 asset when every asset starts at its default status", () => {
    const state = defaultState();
    const next = pickNextAsset(FAMILIES, state);
    expect(next?.assetId).toBe("unit202.current-conductor.magnetic-field"); // sequence 1, P0
  });

  it("never recommends a REFERENCE_NOT_READY (blocked) asset, even if nothing else is actionable", () => {
    const onlyBlocked: StudioState = {};
    for (const asset of allAssets()) onlyBlocked[asset.assetId] = { status: "REFERENCE_NOT_READY", updatedAt: "" };
    expect(pickNextAsset(FAMILIES, onlyBlocked)).toBeNull();
  });

  it("skips a higher-priority asset once it is APPROVED/SAVED and recommends the next actionable one by priority order", () => {
    const state = defaultState();
    state["unit202.current-conductor.magnetic-field"] = { status: "SAVED", updatedAt: "" };
    const next = pickNextAsset(FAMILIES, state);
    expect(next?.priority).toBe("P0");
    expect(next?.assetId).not.toBe("unit202.current-conductor.magnetic-field");
  });

  it("prefers a lower priority number over a later sequence number", () => {
    const state: StudioState = {};
    for (const asset of allAssets()) state[asset.assetId] = { status: "APPROVED", updatedAt: "" };
    // Free up one P1 and one P0 asset -- P0 must still win regardless of sequence order.
    state["unit202.waveform.sine"] = { status: "READY_TO_PROMPT", updatedAt: "" }; // P1
    state["unit202.magnet.field"] = { status: "READY_TO_PROMPT", updatedAt: "" }; // P0
    const next = pickNextAsset(FAMILIES, state);
    expect(next?.assetId).toBe("unit202.magnet.field");
  });

  it("returns null once every actionable asset is approved/saved/blocked", () => {
    const state: StudioState = {};
    for (const asset of allAssets()) {
      state[asset.assetId] = { status: asset.referenceReadiness === "NOT_READY" ? "REFERENCE_NOT_READY" : "SAVED", updatedAt: "" };
    }
    expect(pickNextAsset(FAMILIES, state)).toBeNull();
  });

  it("recommends a NEEDS_REVIEW asset (still actionable) over a done one", () => {
    const state: StudioState = {};
    for (const asset of allAssets()) state[asset.assetId] = { status: "SAVED", updatedAt: "" };
    state["unit202.fleming-left-hand.teaching"] = { status: "NEEDS_REVIEW", updatedAt: "" };
    expect(pickNextAsset(FAMILIES, state)?.assetId).toBe("unit202.fleming-left-hand.teaching");
  });

  it("never recommends a promptable:false asset (no image-generation deliverable), even if nothing else is actionable", () => {
    const state: StudioState = {};
    for (const asset of allAssets()) state[asset.assetId] = { status: "SAVED", updatedAt: "" };
    state["unit202.components.symbols"] = { status: "READY_TO_PROMPT", updatedAt: "" };
    expect(pickNextAsset(FAMILIES, state)).toBeNull();
  });

  it("never recommends a SCOPE_CONFIRMATION_NEEDED asset", () => {
    const asset = findAsset("unit202.right-hand-grip.teaching")!;
    const syntheticFamilies: VisualFamily[] = [
      { familyId: "synthetic.family", displayName: "Synthetic", instructionalPurpose: "test", assets: [{ ...asset, assetId: "synthetic.needs-scope", needsScopeConfirmation: true }] },
    ];
    const state: StudioState = { "synthetic.needs-scope": { status: "SCOPE_CONFIRMATION_NEEDED", updatedAt: "" } };
    expect(pickNextAsset(syntheticFamilies, state)).toBeNull();
  });

  it("a REFERENCE_NOT_READY sibling never blocks an otherwise-actionable co-member of the same family (§14: 'do not block the whole catalogue because one member is REFERENCE_NOT_READY')", () => {
    const base = findAsset("unit202.right-hand-grip.teaching")!;
    const syntheticFamilies: VisualFamily[] = [
      {
        familyId: "synthetic.mixed-readiness-family",
        displayName: "Synthetic mixed-readiness family",
        instructionalPurpose: "test",
        assets: [
          { ...base, assetId: "synthetic.blocked-sibling", orderInFamily: 1, referenceReadiness: "NOT_READY", primaryReference: { ...base.primaryReference, sourceUrl: "" } },
          { ...base, assetId: "synthetic.ready-sibling", orderInFamily: 2 },
        ],
      },
    ];
    const state: StudioState = {
      "synthetic.blocked-sibling": { status: "REFERENCE_NOT_READY", updatedAt: "" },
      "synthetic.ready-sibling": { status: "READY_TO_PROMPT", updatedAt: "" },
    };
    expect(pickNextAsset(syntheticFamilies, state)?.assetId).toBe("synthetic.ready-sibling");
  });

  it("a sanity check that the fixture asset ids referenced above actually exist in the real catalogue", () => {
    for (const id of ["unit202.current-conductor.magnetic-field", "unit202.waveform.sine", "unit202.magnet.field", "unit202.fleming-left-hand.teaching", "unit202.components.symbols"]) {
      expect(findAsset(id)).toBeDefined();
    }
  });
});
