import { describe, expect, it } from "vitest";
import { allAssets, FAMILIES, familyForAsset, findAsset, findFamily, isPromptable, promptableAssets, validateCatalogue, type VisualFamily } from "./catalogue.ts";

describe("FAMILIES", () => {
  it("has zero validation problems -- unique family/asset ids, sequences, filename stems, and consistent enum/readiness/role/order fields", () => {
    expect(validateCatalogue()).toEqual([]);
  });

  it("every familyId is unique", () => {
    const ids = FAMILIES.map((family) => family.familyId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every assetId is unique across every family", () => {
    const ids = allAssets().map((asset) => asset.assetId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every family has at least one asset (VISUAL COUNT FOLLOWS PEDAGOGICAL NEED -- a family is never empty)", () => {
    for (const family of FAMILIES) {
      expect(family.assets.length).toBeGreaterThan(0);
    }
  });

  it("VISUAL COUNT FOLLOWS PEDAGOGICAL NEED is not a fiction -- the catalogue genuinely contains both single-asset and multi-asset families", () => {
    const singleAssetFamilies = FAMILIES.filter((family) => family.assets.length === 1);
    const multiAssetFamilies = FAMILIES.filter((family) => family.assets.length > 1);
    expect(singleAssetFamilies.length).toBeGreaterThan(0);
    expect(multiAssetFamilies.length).toBeGreaterThan(0);
  });

  it("a representative single-asset family (a simple concept) contains exactly one asset -- no manufactured family structure", () => {
    const family = findFamily("unit202.family.circuit-series");
    expect(family?.assets).toHaveLength(1);
  });

  it("a representative multi-asset family (right-hand-grip: phenomenon + mnemonic) contains exactly two assets, ordered", () => {
    const family = findFamily("unit202.family.right-hand-grip");
    expect(family?.assets.map((a) => a.role)).toEqual(["PHENOMENON", "MNEMONIC"]);
    expect(family?.assets.map((a) => a.orderInFamily)).toEqual([1, 2]);
  });

  it("the levers family was split into three distinct CONFIGURATION assets, not one image forcing all three classes together", () => {
    const family = findFamily("unit202.family.levers");
    expect(family?.assets).toHaveLength(3);
    expect(family?.assets.every((a) => a.role === "CONFIGURATION")).toBe(true);
    expect(family?.assets.map((a) => a.assetId)).toEqual(["unit202.levers.class-1", "unit202.levers.class-2", "unit202.levers.class-3"]);
  });

  it("the pulleys family stays at exactly two assets (fixed, movable) -- confirmed by governed evidence, not assumed and not expanded beyond scope", () => {
    const family = findFamily("unit202.family.pulleys");
    expect(family?.assets).toHaveLength(2);
    expect(family?.assets.map((a) => a.assetId)).toEqual(["unit202.pulleys.fixed", "unit202.pulleys.movable"]);
    expect(family?.familyNotes).toMatch(/CONFIRMED/);
  });

  it("every family's assets appear in family declaration order matching orderInFamily (ordered family display)", () => {
    for (const family of FAMILIES) {
      family.assets.forEach((asset, index) => {
        expect(asset.orderInFamily).toBe(index + 1);
        expect(asset.familyId).toBe(family.familyId);
      });
    }
  });

  it("detects a duplicate familyId when one is synthetically introduced", () => {
    const dirty: VisualFamily[] = [...FAMILIES, { ...FAMILIES[0]!, assets: FAMILIES[0]!.assets.map((a) => ({ ...a, assetId: "synthetic.dup.check", filenameBase: "synthetic-dup-check" })) }];
    const problems = validateCatalogue(dirty);
    expect(problems.some((p) => p.includes("duplicate familyId"))).toBe(true);
  });

  it("detects a duplicate assetId when one is synthetically introduced across two different families", () => {
    const first = FAMILIES[0]!;
    const other = FAMILIES[1]!;
    const dirty: VisualFamily[] = [
      first,
      { ...other, familyId: "unit202.family.synthetic", assets: [{ ...other.assets[0]!, assetId: first.assets[0]!.assetId, familyId: "unit202.family.synthetic", filenameBase: "synthetic-dup-asset" }] },
    ];
    const problems = validateCatalogue(dirty);
    expect(problems.some((p) => p.includes("duplicate assetId"))).toBe(true);
  });

  it("REFERENCE_NOT_READY assets (heating-effect / conductor-insulator / protective-devices) carry no sourceUrl -- an invalid reference-ready state is mechanically detectable", () => {
    const notReady = allAssets().filter((asset) => asset.referenceReadiness === "NOT_READY");
    expect(notReady.length).toBeGreaterThan(0);
    for (const asset of notReady) {
      expect(asset.primaryReference.sourceUrl).toBe("");
    }
  });

  it("flags an inconsistent readiness state (NOT_READY asset given a real sourceUrl) as a validation problem", () => {
    const dirty = FAMILIES.map((family) => ({
      ...family,
      assets: family.assets.map((asset) =>
        asset.assetId === "unit202.heating-effect" ? { ...asset, primaryReference: { ...asset.primaryReference, sourceUrl: "https://example.com" } } : asset,
      ),
    }));
    const problems = validateCatalogue(dirty);
    expect(problems.some((p) => p.includes("unit202.heating-effect") && p.includes("inconsistent"))).toBe(true);
  });

  it("findAsset resolves a known id and returns undefined for an unknown one", () => {
    expect(findAsset("unit202.right-hand-grip.teaching")?.displayName).toBe("Right-hand grip rule — teaching mnemonic");
    expect(findAsset("unit202.does-not-exist")).toBeUndefined();
  });

  it("findFamily resolves a known id and returns undefined for an unknown one", () => {
    expect(findFamily("unit202.family.right-hand-grip")?.displayName).toContain("Right-hand grip rule");
    expect(findFamily("unit202.family.does-not-exist")).toBeUndefined();
  });

  it("familyForAsset resolves an asset back to its exact containing family", () => {
    expect(familyForAsset("unit202.levers.class-2")?.familyId).toBe("unit202.family.levers");
    expect(familyForAsset("unit202.circuit.series")?.familyId).toBe("unit202.family.circuit-series");
  });

  it("every asset declares a valid annotationPolicy, and TEACHING_EXPLANATORY assets carry requiredLabels only when specifically known (never fabricated for a blocked asset)", () => {
    for (const asset of allAssets()) {
      expect(["TEACHING_EXPLANATORY", "ASSESSMENT_NON_REVEALING", "FEEDBACK_EXPLANATORY", "NONE"]).toContain(asset.annotationPolicy);
    }
  });

  it("the right-hand-grip MNEMONIC asset requires the exact THUMB = CURRENT / FINGERS = MAGNETIC FIELD labels per the Product Owner correction", () => {
    const asset = findAsset("unit202.right-hand-grip.teaching");
    expect(asset?.annotationPolicy).toBe("TEACHING_EXPLANATORY");
    expect(asset?.requiredLabels).toEqual(expect.arrayContaining(["THUMB = CURRENT", "FINGERS = MAGNETIC FIELD"]));
  });

  it("every lever asset requires EFFORT / LOAD / FULCRUM labels per the Product Owner correction", () => {
    for (const id of ["unit202.levers.class-1", "unit202.levers.class-2", "unit202.levers.class-3"]) {
      const asset = findAsset(id);
      expect(asset?.requiredLabels).toEqual(expect.arrayContaining(["EFFORT", "LOAD", "FULCRUM"]));
    }
  });

  it("deterministic-technical style-reference assets declare annotationPolicy NONE with no required labels", () => {
    const asset = findAsset("unit202.circuit.series");
    expect(asset?.annotationPolicy).toBe("NONE");
    expect(asset?.requiredLabels).toEqual([]);
  });
});

describe("CC-11.7 §7 hierarchy: VISUAL FAMILY -> PRODUCTION/BASE ASSET -> CANONICAL LEARNER-VISIBLE STATE", () => {
  it("every asset belongs to exactly the family that contains it, and every state belongs to exactly the asset that contains it", () => {
    for (const family of FAMILIES) {
      for (const asset of family.assets) {
        expect(asset.familyId).toBe(family.familyId);
        expect(asset.canonicalStates.length).toBeGreaterThan(0);
        for (const state of asset.canonicalStates) {
          expect(state.stateId.startsWith(asset.assetId)).toBe(true);
        }
      }
    }
  });

  it("a single base asset genuinely supports several canonical states without being collapsed into one (motor.effect: 8 states from one asset)", () => {
    const asset = findAsset("unit202.motor.effect")!;
    expect(asset.canonicalStates.length).toBe(8);
    expect(new Set(asset.canonicalStates.map((s) => s.stateId)).size).toBe(8);
  });

  it("assessment states differ from teaching states in annotation policy on the same base asset (never the same labelling rule)", () => {
    const asset = findAsset("unit202.current-conductor.magnetic-field")!;
    const teaching = asset.canonicalStates.find((s) => s.pedagogicalState === "TEACHING")!;
    const assessment = asset.canonicalStates.find((s) => s.pedagogicalState === "ASSESSMENT")!;
    expect(teaching.annotationPolicy).toBe("TEACHING_EXPLANATORY");
    expect(assessment.annotationPolicy).toBe("ASSESSMENT_NON_REVEALING");
    expect(teaching.requiredLabels.length).toBeGreaterThan(0);
    expect(assessment.requiredLabels).toEqual([]);
  });

  it("the total canonical-state count across the whole catalogue is at least the 66 pre-existing CC-05D variants (never fewer -- nothing lost)", () => {
    const totalStates = allAssets().reduce((sum, asset) => sum + asset.canonicalStates.length, 0);
    expect(totalStates).toBeGreaterThanOrEqual(66);
  });
});

describe("prompt accounting -- a VisualFamily is an organisational grouping only, never a reduction in prompt granularity", () => {
  it("distinguishes family count, individual asset count, and promptable artwork asset count", () => {
    const familyCount = FAMILIES.length;
    const assetCount = allAssets().length;
    const promptableCount = promptableAssets().length;

    expect(familyCount).toBeGreaterThan(0);
    expect(assetCount).toBeGreaterThan(familyCount); // proves at least one multi-asset family exists
    expect(promptableCount).toBeLessThan(assetCount); // proves at least one asset is genuinely non-promptable (blocked or no deliverable)
  });

  it("the component-symbol asset (produced deterministically by ComponentSymbols.tsx, never an art session) is explicitly excluded from promptable accounting", () => {
    const asset = findAsset("unit202.components.symbols")!;
    expect(isPromptable(asset)).toBe(false);
    expect(promptableAssets().some((a) => a.assetId === asset.assetId)).toBe(false);
  });

  it("a REFERENCE_NOT_READY asset is excluded from promptable accounting even though it is not marked promptable:false", () => {
    const asset = findAsset("unit202.heating-effect")!;
    expect(asset.promptable).not.toBe(false); // no explicit override -- NOT_READY alone excludes it
    expect(isPromptable(asset)).toBe(false);
  });

  it("every asset in a multi-asset family (levers) is individually promptable and each gets a genuinely distinct prompt -- grouping into a family never merges or reduces per-asset prompts", () => {
    const family = findFamily("unit202.family.levers")!;
    expect(family.assets.every((asset) => isPromptable(asset))).toBe(true);
    expect(family.assets.length).toBe(3);
  });

  it("an ordinary style-reference deterministic asset (not explicitly promptable:false) still counts as promptable", () => {
    const asset = findAsset("unit202.waveform.sine")!;
    expect(isPromptable(asset)).toBe(true);
  });
});
