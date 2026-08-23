import { describe, expect, it } from "vitest";
import { buildAuditReport, EXPECTED_USEFUL_FINDING_ASSET_IDS, formatAuditReport, isAuditClean } from "./audit.ts";
import { FAMILIES, findAsset, type VisualFamily } from "./catalogue.ts";

describe("buildAuditReport against the real comprehensive catalogue", () => {
  const report = buildAuditReport();

  it("is clean -- every mandatory audit gate is zero", () => {
    expect(isAuditClean(report)).toBe(true);
  });

  it("reconciles exactly the real CC-05D canonical-variant count with zero unmapped (the package's own non-negotiable acceptance criterion)", () => {
    expect(report.totalRealCanonicalVariants).toBe(66);
    expect(report.unmappedExistingVariants).toEqual([]);
  });

  it("has zero duplicate ids across families/assets/states", () => {
    expect(report.duplicateIds).toEqual([]);
  });

  it("formats to a human-readable report containing the PASS verdict inputs", () => {
    const text = formatAuditReport(report);
    expect(text).toContain("comprehensive visual-production catalogue audit");
    expect(text).toContain("Real CC-05D canonical variants (recomputed from source): 66");
  });

  it("CC-11.7A §1/§26: all 10 CC-11.7 USEFUL findings are present in the live catalogue with needOverride USEFUL -- zero missing", () => {
    expect(EXPECTED_USEFUL_FINDING_ASSET_IDS.length).toBe(10);
    expect(report.usefulFindingsMissingFromCatalogue).toEqual([]);
    for (const assetId of EXPECTED_USEFUL_FINDING_ASSET_IDS) {
      expect(findAsset(assetId)?.needOverride).toBe("USEFUL");
    }
  });

  it("has zero catalogue structural problems (incl. one-art-prompt-per-distinct-image-job violations)", () => {
    expect(report.catalogueStructuralProblems).toEqual([]);
  });
});

describe("buildAuditReport detects CC-11.7A intentionally injected gaps", () => {
  it("fails when a CC-11.7 USEFUL finding's catalogue asset is removed entirely", () => {
    const target = EXPECTED_USEFUL_FINDING_ASSET_IDS[0]!;
    const dirtyFamilies: VisualFamily[] = FAMILIES.map((family) => ({ ...family, assets: family.assets.filter((asset) => asset.assetId !== target) })).filter(
      (family) => family.assets.length > 0,
    );
    const report = buildAuditReport(dirtyFamilies);
    expect(report.usefulFindingsMissingFromCatalogue.some((entry) => entry.startsWith(target))).toBe(true);
    expect(isAuditClean(report)).toBe(false);
  });

  it("fails when a CC-11.7 USEFUL finding's asset exists but its needOverride is stripped (silently reclassified as REQUIRED)", () => {
    const target = EXPECTED_USEFUL_FINDING_ASSET_IDS[0]!;
    const dirtyFamilies: VisualFamily[] = FAMILIES.map((family) => ({
      ...family,
      assets: family.assets.map((asset) => (asset.assetId === target ? { ...asset, needOverride: undefined } : asset)),
    }));
    const report = buildAuditReport(dirtyFamilies);
    expect(report.usefulFindingsMissingFromCatalogue.some((entry) => entry.startsWith(target))).toBe(true);
    expect(isAuditClean(report)).toBe(false);
  });

  it("fails when a PHYSICAL_RECOGNITION asset is given a second canonicalState (one art prompt per distinct image job violated)", () => {
    const base = findAsset("unit202.components.physical.resistor")!;
    expect(base.role).toBe("PHYSICAL_RECOGNITION");
    const dirtyFamilies: VisualFamily[] = FAMILIES.map((family) =>
      family.familyId !== base.familyId
        ? family
        : {
            ...family,
            assets: family.assets.map((asset) =>
              asset.assetId === base.assetId
                ? { ...asset, canonicalStates: [...asset.canonicalStates, { ...asset.canonicalStates[0]!, stateId: `${asset.assetId}.state.second-component` }] }
                : asset,
            ),
          },
    );
    const report = buildAuditReport(dirtyFamilies);
    expect(report.catalogueStructuralProblems.some((p) => p.includes(base.assetId) && p.includes("PHYSICAL_RECOGNITION"))).toBe(true);
    expect(isAuditClean(report)).toBe(false);
  });

  it("fails when two assets are given a duplicate filenameBase (a distinct art job losing its independent save target)", () => {
    const [first, second] = FAMILIES.flatMap((f) => f.assets);
    const dirtyFamilies: VisualFamily[] = FAMILIES.map((family) => ({
      ...family,
      assets: family.assets.map((asset) => (asset.assetId === second!.assetId ? { ...asset, filenameBase: first!.filenameBase } : asset)),
    }));
    const report = buildAuditReport(dirtyFamilies);
    expect(report.catalogueStructuralProblems.some((p) => p.includes("duplicate filenameBase"))).toBe(true);
    expect(isAuditClean(report)).toBe(false);
  });
});

describe("buildAuditReport detects an intentionally injected gap", () => {
  it("fails when an existing canonical variant is no longer reconciled by any state", () => {
    // Remove the right-hand-grip-rule reconciliation entirely from a clone of the real catalogue.
    const rhg = findAsset("unit202.current-conductor.magnetic-field")!;
    const dirtyFamilies: VisualFamily[] = FAMILIES.map((family) =>
      family.familyId !== "unit202.family.right-hand-grip"
        ? family
        : { ...family, assets: family.assets.map((asset) => (asset.assetId === rhg.assetId ? { ...asset, canonicalStates: [] } : asset)) },
    );
    const report = buildAuditReport(dirtyFamilies);
    expect(report.unmappedExistingVariants.length).toBeGreaterThan(0);
    expect(isAuditClean(report)).toBe(false);
  });

  it("fails when a REQUIRED premium/hybrid asset is marked READY but has no primaryReference.sourceName and is not explicitly BLOCKED_REFERENCE", () => {
    const base = findAsset("unit202.right-hand-grip.teaching")!;
    const dirtyFamilies: VisualFamily[] = FAMILIES.map((family) =>
      family.familyId !== "unit202.family.right-hand-grip"
        ? family
        : {
            ...family,
            assets: family.assets.map((asset) =>
              asset.assetId === base.assetId ? { ...asset, primaryReference: { ...asset.primaryReference, sourceName: "" } } : asset,
            ),
          },
    );
    const report = buildAuditReport(dirtyFamilies);
    expect(report.requiredPremiumHybridWithNoReferenceOrBlockedStatus).toContain(base.assetId);
    expect(isAuditClean(report)).toBe(false);
  });

  it("fails when a duplicate assetId is introduced across two families", () => {
    const [first, second] = FAMILIES;
    const dirtyFamilies: VisualFamily[] = [
      first!,
      { ...second!, assets: [{ ...second!.assets[0]!, assetId: first!.assets[0]!.assetId }] },
    ];
    const report = buildAuditReport(dirtyFamilies);
    expect(report.duplicateIds).toContain(first!.assets[0]!.assetId);
    expect(isAuditClean(report)).toBe(false);
  });

  it("fails when a MNEMONIC-role asset is given an ASSESSMENT state (known answer-bearing mnemonic dependency)", () => {
    const base = findAsset("unit202.right-hand-grip.teaching")!;
    const dirtyFamilies: VisualFamily[] = FAMILIES.map((family) =>
      family.familyId !== "unit202.family.right-hand-grip"
        ? family
        : {
            ...family,
            assets: family.assets.map((asset) =>
              asset.assetId === base.assetId
                ? {
                    ...asset,
                    canonicalStates: [
                      ...asset.canonicalStates,
                      { stateId: `${asset.assetId}.state.leaked-assessment`, displayName: "leak", pedagogicalState: "ASSESSMENT" as const, annotationPolicy: "NONE" as const, requiredLabels: [] },
                    ],
                  }
                : asset,
            ),
          },
    );
    const report = buildAuditReport(dirtyFamilies);
    expect(report.assessmentLeaksMnemonic.length).toBeGreaterThan(0);
    expect(isAuditClean(report)).toBe(false);
  });
});
