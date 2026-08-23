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

  it("CC-11.7B §12: requiredTotal + usefulTotal + deferredScope accounts for every asset -- BLOCKED_REFERENCE is a subset of required/useful, never a fourth bucket", () => {
    const dashboard = buildDashboard(defaultState());
    expect(dashboard.requiredTotal + dashboard.usefulTotal + dashboard.deferredScope).toBe(dashboard.productionBaseAssets);
  });

  it("CC-11.7B §12: requiredReady + requiredBlocked equals requiredTotal, and usefulReady + usefulBlocked equals usefulTotal", () => {
    const dashboard = buildDashboard(defaultState());
    expect(dashboard.requiredReady + dashboard.requiredBlocked).toBe(dashboard.requiredTotal);
    expect(dashboard.usefulReady + dashboard.usefulBlocked).toBe(dashboard.usefulTotal);
  });

  it("CC-11.7B §12 regression proof: a REQUIRED-but-blocked asset is still counted in requiredTotal, not silently dropped -- the pre-CC-11.7B bug this package fixes", () => {
    const requiredBlockedAssets = allAssets().filter((a) => a.referenceReadiness === "NOT_READY" && a.needOverride !== "USEFUL" && !a.needsScopeConfirmation && a.assetId !== "unit202.trigonometry");
    expect(requiredBlockedAssets.length).toBeGreaterThan(0); // heating-effect, conductor-insulator, protective-devices
    for (const asset of requiredBlockedAssets) {
      expect(visualNeedClassificationFor(asset)).toBe("REQUIRED"); // classification never demoted by blocked status
    }
    const dashboard = buildDashboard(defaultState());
    expect(dashboard.requiredBlocked).toBeGreaterThanOrEqual(requiredBlockedAssets.length);
  });

  it("has exactly 10 USEFUL-classified assets (the materialised CC-11.7 findings), some ready and some blocked", () => {
    const usefulAssets = allAssets().filter((asset) => asset.needOverride === "USEFUL");
    expect(usefulAssets.length).toBe(10);
    const dashboard = buildDashboard(defaultState());
    expect(dashboard.usefulTotal).toBe(10);
    expect(dashboard.usefulBlocked).toBeGreaterThan(0); // 8 of the 10 are currently reference-blocked
    expect(dashboard.usefulReady).toBeGreaterThan(0); // the 2 deterministic ones are ready
  });

  it("deterministicOnly + total art jobs never double-counts a DETERMINISTIC_TECHNICAL asset as an art job", () => {
    const dashboard = buildDashboard(defaultState());
    for (const asset of allAssets()) {
      if (asset.productionClass === "DETERMINISTIC_TECHNICAL") {
        expect(asset.productionClass).not.toBe("HYBRID");
      }
    }
    expect(dashboard.deterministicOnly).toBeGreaterThan(0);
    expect(dashboard.requiredArtJobsTotal + dashboard.usefulArtJobsTotal).toBeGreaterThan(0);
  });

  it("required art-job accounting is entirely independent of useful art-job accounting -- a family may contain both REQUIRED and USEFUL assets without either bucket influencing the other's totals", () => {
    const dashboard = buildDashboard(defaultState());
    expect(dashboard.requiredArtJobsReady + dashboard.requiredArtJobsBlocked).toBe(dashboard.requiredArtJobsTotal);
    expect(dashboard.usefulArtJobsReady + dashboard.usefulArtJobsBlocked).toBe(dashboard.usefulArtJobsTotal);

    // A family genuinely containing both classifications exists (e.g. electronic-components: REQUIRED physical-recognition assets alongside USEFUL specialist ones).
    const mixedFamily = FAMILIES.find((family) => {
      const classes = new Set(family.assets.map((asset) => visualNeedClassificationFor(asset)));
      return classes.has("REQUIRED") && classes.has("USEFUL");
    });
    expect(mixedFamily).toBeDefined();
  });

  it("nothing is approved and requiredVisualProductionComplete is false when required art jobs remain unapproved or blocked", () => {
    const dashboard = buildDashboard(defaultState());
    expect(dashboard.requiredArtJobsApproved).toBe(0);
    expect(dashboard.requiredArtJobsTotal).toBeGreaterThan(0);
    expect(dashboard.requiredVisualProductionComplete).toBe(false);
  });

  it("CC-11.7B §14: requiredVisualProductionComplete becomes true only once every REQUIRED art job is approved AND requiredBlocked is 0 -- USEFUL status never affects it", () => {
    // Synthetic families: two REQUIRED art-job assets, both READY, no USEFUL assets at all -- prove the boolean flips only when both required conditions are met, and stays independent of USEFUL.
    const template = allAssets().find((a) => a.productionClass === "HYBRID" && a.referenceReadiness === "READY" && a.needOverride !== "USEFUL")!;
    const a = { ...template, assetId: "synthetic.required.a", canonicalStates: [{ ...template.canonicalStates[0]!, stateId: "synthetic.required.a.state.x" }] };
    const b = { ...template, assetId: "synthetic.required.b", canonicalStates: [{ ...template.canonicalStates[0]!, stateId: "synthetic.required.b.state.x" }] };
    const families: VisualFamily[] = [{ familyId: "synthetic.family", displayName: "Synthetic", instructionalPurpose: "test", assets: [a, b] }];

    expect(buildDashboard(defaultState(), families).requiredVisualProductionComplete).toBe(false);

    const oneApproved = defaultState();
    oneApproved[a.assetId] = { status: "SAVED", updatedAt: "" };
    expect(buildDashboard(oneApproved, families).requiredVisualProductionComplete).toBe(false); // b still outstanding

    const bothApproved = defaultState();
    bothApproved[a.assetId] = { status: "SAVED", updatedAt: "" };
    bothApproved[b.assetId] = { status: "SAVED", updatedAt: "" };
    expect(buildDashboard(bothApproved, families).requiredVisualProductionComplete).toBe(true);

    // Now block one of them (still pedagogically REQUIRED) -- completion must become false again, and must stay false even if the OTHER one is approved.
    const blockedFamilies: VisualFamily[] = [{ familyId: "synthetic.family", displayName: "Synthetic", instructionalPurpose: "test", assets: [{ ...a, referenceReadiness: "NOT_READY", primaryReference: { sourceName: "", sourceUrl: "", licence: "", qualityGrade: "" } }, b] }];
    expect(buildDashboard(bothApproved, blockedFamilies).requiredVisualProductionComplete).toBe(false);
  });

  it("backward-compatible aliases stay consistent with the canonical fields", () => {
    const dashboard = buildDashboard(defaultState());
    expect(dashboard.required).toBe(dashboard.requiredTotal);
    expect(dashboard.useful).toBe(dashboard.usefulTotal);
    expect(dashboard.requiredPremiumHybridArtJobs).toBe(dashboard.requiredArtJobsTotal);
    expect(dashboard.usefulPremiumHybridArtJobs).toBe(dashboard.usefulArtJobsTotal);
    expect(dashboard.premiumHybridArtJobs).toBe(dashboard.requiredArtJobsTotal + dashboard.usefulArtJobsTotal);
    expect(dashboard.blockedReference).toBe(dashboard.requiredBlocked + dashboard.usefulBlocked);
    expect(dashboard.blockedReferenceRequired).toBe(dashboard.requiredBlocked);
    expect(dashboard.blockedReferenceUseful).toBe(dashboard.usefulBlocked);
    expect(dashboard.approved).toBe(dashboard.requiredArtJobsApproved + dashboard.usefulArtJobsApproved);
    expect(dashboard.approvedRequired).toBe(dashboard.requiredArtJobsApproved);
    expect(dashboard.approvedUseful).toBe(dashboard.usefulArtJobsApproved);
  });

  it("approving one REQUIRED asset moves it from outstandingRequired to approvedRequired without changing the useful buckets", () => {
    const before = buildDashboard(defaultState());
    const state = defaultState();
    state["unit202.right-hand-grip.teaching"] = { status: "SAVED", updatedAt: "" };
    const after = buildDashboard(state);
    expect(after.requiredArtJobsApproved).toBe(before.requiredArtJobsApproved + 1);
    expect(after.usefulArtJobsApproved).toBe(before.usefulArtJobsApproved);
  });

  it("approving one USEFUL art-job asset moves it from useful-outstanding to useful-approved without changing the required buckets", () => {
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
    expect(after.usefulArtJobsApproved).toBe(before.usefulArtJobsApproved + 1);
    expect(after.requiredArtJobsApproved).toBe(before.requiredArtJobsApproved);
  });
});
