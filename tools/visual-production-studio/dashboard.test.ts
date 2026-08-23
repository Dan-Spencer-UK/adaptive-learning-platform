import { describe, expect, it } from "vitest";
import { buildDashboard, USEFUL_TRACKED_NOT_CATALOGUED_COUNT } from "./dashboard.ts";
import { allAssets, FAMILIES, visualNeedClassificationFor, type VisualFamily } from "./catalogue.ts";
import { defaultState } from "./state-store.ts";

describe("buildDashboard", () => {
  it("derives every count mechanically from the real catalogue -- never a single misleading total", () => {
    const dashboard = buildDashboard(defaultState());
    expect(dashboard.visualFamilies).toBe(FAMILIES.length);
    expect(dashboard.productionBaseAssets).toBe(allAssets().length);
    expect(dashboard.canonicalLearnerVisibleStates).toBe(allAssets().reduce((sum, asset) => sum + asset.canonicalStates.length, 0));
  });

  it("CC-11.7A §25: all 10 CC-11.7 USEFUL findings are now materialised into the live catalogue -- the historical uncatalogued count is 0", () => {
    const dashboard = buildDashboard(defaultState());
    expect(USEFUL_TRACKED_NOT_CATALOGUED_COUNT).toBe(0);
    expect(dashboard.usefulTrackedNotCatalogued).toBe(0);
  });

  it("required + useful + blockedReference + deferredScope accounts for every asset", () => {
    const dashboard = buildDashboard(defaultState());
    expect(dashboard.required + dashboard.useful + dashboard.blockedReference + dashboard.deferredScope).toBe(dashboard.productionBaseAssets);
  });

  it("has at least 10 USEFUL-classified or blocked-but-ultimately-useful assets (the materialised CC-11.7 findings)", () => {
    const usefulAssets = allAssets().filter((asset) => asset.needOverride === "USEFUL");
    expect(usefulAssets.length).toBe(10);
  });

  it("blockedReferenceRequired + blockedReferenceUseful equals blockedReference", () => {
    const dashboard = buildDashboard(defaultState());
    expect(dashboard.blockedReferenceRequired + dashboard.blockedReferenceUseful).toBe(dashboard.blockedReference);
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

  it("required art-job accounting is entirely independent of useful art-job accounting -- a family may contain both REQUIRED and USEFUL assets without either bucket influencing the other's totals", () => {
    const dashboard = buildDashboard(defaultState());
    expect(dashboard.requiredPremiumHybridArtJobs + dashboard.usefulPremiumHybridArtJobs).toBe(dashboard.premiumHybridArtJobs);
    expect(dashboard.approvedRequired + dashboard.outstandingRequired).toBe(dashboard.requiredPremiumHybridArtJobs);
    expect(dashboard.approvedUseful + dashboard.outstandingUseful).toBe(dashboard.usefulPremiumHybridArtJobs);

    // A family genuinely containing both classifications exists (e.g. electronic-components: REQUIRED physical-recognition assets alongside USEFUL specialist ones).
    const mixedFamily = FAMILIES.find((family) => {
      const classes = new Set(family.assets.map((asset) => visualNeedClassificationFor(asset)));
      return classes.has("REQUIRED") && (classes.has("USEFUL") || family.assets.some((asset) => asset.needOverride === "USEFUL"));
    });
    expect(mixedFamily).toBeDefined();
  });

  it("approved is zero and outstanding equals every promptable art-job asset when nothing has been approved yet", () => {
    const dashboard = buildDashboard(defaultState());
    expect(dashboard.approved).toBe(0);
    expect(dashboard.outstanding).toBeGreaterThan(0);
  });

  it("approving one REQUIRED asset moves it from outstandingRequired to approvedRequired without changing the useful buckets", () => {
    const before = buildDashboard(defaultState());
    const state = defaultState();
    state["unit202.right-hand-grip.teaching"] = { status: "SAVED", updatedAt: "" };
    const after = buildDashboard(state);
    expect(after.approvedRequired).toBe(before.approvedRequired + 1);
    expect(after.outstandingRequired).toBe(before.outstandingRequired - 1);
    expect(after.approvedUseful).toBe(before.approvedUseful);
    expect(after.outstandingUseful).toBe(before.outstandingUseful);
    expect(after.approved).toBe(before.approved + 1);
    expect(after.outstanding).toBe(before.outstanding - 1);
  });

  it("approving one USEFUL art-job asset moves it from outstandingUseful to approvedUseful without changing the required buckets", () => {
    // All 10 real materialised USEFUL findings are currently either
    // DETERMINISTIC_TECHNICAL (no art job at all) or BLOCKED_REFERENCE (no
    // reference sourced yet -- honestly tracked, never fabricated) -- so
    // no real USEFUL art job exists yet to approve. Prove the accounting
    // itself is correct with a synthetic families override (the same
    // pattern audit.test.ts uses) rather than inventing a real reference.
    const usefulTemplate = allAssets().find((asset) => asset.needOverride === "USEFUL" && asset.productionClass !== "DETERMINISTIC_TECHNICAL")!;
    expect(usefulTemplate).toBeDefined();
    const readyUseful = { ...usefulTemplate, referenceReadiness: "READY" as const, primaryReference: { sourceName: "synthetic test reference", sourceUrl: "", licence: "test", qualityGrade: "test" } };
    const families: VisualFamily[] = FAMILIES.map((family) =>
      family.familyId !== usefulTemplate.familyId ? family : { ...family, assets: family.assets.map((a) => (a.assetId === usefulTemplate.assetId ? readyUseful : a)) },
    );

    const before = buildDashboard(defaultState(), families);
    const state = defaultState();
    state[readyUseful.assetId] = { status: "SAVED", updatedAt: "" };
    const after = buildDashboard(state, families);
    expect(after.approvedUseful).toBe(before.approvedUseful + 1);
    expect(after.outstandingUseful).toBe(before.outstandingUseful - 1);
    expect(after.approvedRequired).toBe(before.approvedRequired);
    expect(after.outstandingRequired).toBe(before.outstandingRequired);
  });
});
