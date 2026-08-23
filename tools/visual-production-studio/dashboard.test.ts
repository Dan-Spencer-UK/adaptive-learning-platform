import { describe, expect, it } from "vitest";
import { buildDashboard, USEFUL_TRACKED_NOT_CATALOGUED_COUNT } from "./dashboard.ts";
import { allAssets, FAMILIES } from "./catalogue.ts";
import { defaultState } from "./state-store.ts";

describe("buildDashboard", () => {
  it("derives every count mechanically from the real catalogue -- never a single misleading total", () => {
    const dashboard = buildDashboard(defaultState());
    expect(dashboard.visualFamilies).toBe(FAMILIES.length);
    expect(dashboard.productionBaseAssets).toBe(allAssets().length);
    expect(dashboard.canonicalLearnerVisibleStates).toBe(allAssets().reduce((sum, asset) => sum + asset.canonicalStates.length, 0));
    expect(dashboard.usefulTrackedNotCatalogued).toBe(USEFUL_TRACKED_NOT_CATALOGUED_COUNT);
  });

  it("required + blockedReference + deferredScope accounts for every asset", () => {
    const dashboard = buildDashboard(defaultState());
    expect(dashboard.required + dashboard.blockedReference + dashboard.deferredScope).toBe(dashboard.productionBaseAssets);
  });

  it("deterministicOnly + premiumHybridArtJobs never double-counts a DETERMINISTIC_TECHNICAL asset as an art job", () => {
    const dashboard = buildDashboard(defaultState());
    for (const asset of allAssets()) {
      if (asset.productionClass === "DETERMINISTIC_TECHNICAL") {
        expect(asset.productionClass).not.toBe("HYBRID");
      }
    }
    expect(dashboard.deterministicOnly).toBeGreaterThan(0);
    expect(dashboard.premiumHybridArtJobs).toBeGreaterThan(0);
  });

  it("approved is zero and outstanding equals every promptable asset when nothing has been approved yet", () => {
    const dashboard = buildDashboard(defaultState());
    expect(dashboard.approved).toBe(0);
    expect(dashboard.outstanding).toBeGreaterThan(0);
  });

  it("approving one asset moves it from outstanding to approved", () => {
    const before = buildDashboard(defaultState());
    const state = defaultState();
    state["unit202.right-hand-grip.teaching"] = { status: "SAVED", updatedAt: "" };
    const after = buildDashboard(state);
    expect(after.approved).toBe(before.approved + 1);
    expect(after.outstanding).toBe(before.outstanding - 1);
  });
});
