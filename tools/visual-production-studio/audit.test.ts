import { describe, expect, it } from "vitest";
import { buildAuditReport, formatAuditReport, isAuditClean } from "./audit.ts";
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
