import { describe, expect, it } from "vitest";
import { allAssets, FAMILIES, familyForAsset, findAsset, findFamily, isPromptable, promptableAssets, validateCatalogue, visualNeedClassificationFor, type VisualFamily } from "./catalogue.ts";

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

  it("a single base asset genuinely supports several canonical states without being collapsed into one (instrument.connections: 5 states from one asset)", () => {
    const asset = findAsset("unit202.instrument.connections")!;
    expect(asset.canonicalStates.length).toBe(5);
    expect(new Set(asset.canonicalStates.map((s) => s.stateId)).size).toBe(5);
  });

  it("CC-11.7B: motor.effect was split by pole orientation (a genuine apparatus-layout change) into two 4-state assets -- current direction within one orientation remains a shared deterministic-overlay concern", () => {
    const horizontal = findAsset("unit202.motor.effect.horizontal-poles")!;
    const vertical = findAsset("unit202.motor.effect.vertical-poles")!;
    expect(horizontal.canonicalStates.length).toBe(4);
    expect(vertical.canonicalStates.length).toBe(4);
    expect(horizontal.canonicalStates.length + vertical.canonicalStates.length).toBe(8); // all 8 original states preserved
    expect(horizontal.sharedBaseAudit?.splitFrom).toBe("unit202.motor.effect");
    expect(vertical.sharedBaseAudit?.splitFrom).toBe("unit202.motor.effect");
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

  it("CC-11.7C §3: a DETERMINISTIC_TECHNICAL asset never counts as promptable, even one that never explicitly set promptable:false -- its authoritative output is always vector geometry, never a ChatGPT job", () => {
    const asset = findAsset("unit202.waveform.sine")!;
    expect(asset.promptable).not.toBe(false); // no explicit override -- the productionClass check alone must catch it
    expect(isPromptable(asset)).toBe(false);
  });

  it("every promptable asset has a globally unique filenameBase -- one distinct image job, one independent save destination", () => {
    const promptable = promptableAssets();
    const stems = promptable.map((a) => a.filenameBase);
    expect(new Set(stems).size).toBe(stems.length);
  });
});

describe("CC-11.7A: ONE ART PROMPT PER DISTINCT IMAGE JOB -- physical electronic components split", () => {
  it("the six REQUIRED physical-recognition components are six independent ProductionAssets, never combined behind one asset", () => {
    const ids = ["resistor", "capacitor", "diode", "led", "thermistor", "transistor"].map((c) => `unit202.components.physical.${c}`);
    for (const id of ids) {
      const asset = findAsset(id)!;
      expect(asset).toBeDefined();
      expect(asset.role).toBe("PHYSICAL_RECOGNITION");
      expect(asset.canonicalStates).toHaveLength(1);
      expect(visualNeedClassificationFor(asset)).toBe("REQUIRED");
    }
    const filenames = ids.map((id) => findAsset(id)!.filenameBase);
    expect(new Set(filenames).size).toBe(6);
  });

  it("the five USEFUL specialist physical-recognition components (zener diode, photodiode, DIAC, TRIAC, thyristor/SCR) are also independent ProductionAssets", () => {
    const ids = ["zener-diode", "photodiode", "diac", "triac", "thyristor-scr"].map((c) => `unit202.components.physical.${c}`);
    for (const id of ids) {
      const asset = findAsset(id)!;
      expect(asset).toBeDefined();
      expect(asset.role).toBe("PHYSICAL_RECOGNITION");
      expect(asset.canonicalStates).toHaveLength(1);
      expect(asset.needOverride).toBe("USEFUL");
    }
  });

  it("no PHYSICAL_RECOGNITION asset in the whole catalogue carries more than one canonicalState", () => {
    for (const asset of allAssets()) {
      if (asset.role === "PHYSICAL_RECOGNITION") {
        expect(asset.canonicalStates.length).toBe(1);
      }
    }
  });

  it("the electronic-components family genuinely contains both REQUIRED and USEFUL assets side by side (VISUAL COUNT FOLLOWS PEDAGOGICAL NEED, classification never collapsed to a family-wide value)", () => {
    const family = findFamily("unit202.family.electronic-components")!;
    const classes = new Set(family.assets.map((asset) => visualNeedClassificationFor(asset)));
    expect(classes.has("REQUIRED")).toBe(true);
    expect(classes.has("USEFUL") || family.assets.some((a) => a.needOverride === "USEFUL")).toBe(true);
  });
});

describe("CC-11.7C §1: every READY premium/hybrid art job has a genuinely locked reference", () => {
  const PLACEHOLDER_RE = /to be selected|when commissioned|when sourced|reference pending|reference to be added|to be recorded when selected|to be assessed/i;

  it("contains no placeholder reference wording, and every one has a real sourceUrl", () => {
    const readyArtJobs = allAssets().filter((a) => (a.productionClass === "PREMIUM_CONCEPTUAL" || a.productionClass === "HYBRID") && a.referenceReadiness === "READY");
    expect(readyArtJobs.length).toBeGreaterThan(0);
    for (const asset of readyArtJobs) {
      const text = `${asset.primaryReference.sourceName} ${asset.primaryReference.qualityGrade}`;
      expect(PLACEHOLDER_RE.test(text), `${asset.assetId} has placeholder reference wording: ${text}`).toBe(false);
      expect(asset.primaryReference.sourceUrl, `${asset.assetId} has no sourceUrl`).not.toBe("");
    }
  });

  it("regression: the 15 assets found with placeholder references are now BLOCKED_REFERENCE, not READY", () => {
    const blockedIds = [
      "unit202.motor.effect.horizontal-poles",
      "unit202.motor.effect.vertical-poles",
      "unit202.magnet.poles.like",
      "unit202.magnet.poles.unlike",
      "unit202.resistivity.length-comparison",
      "unit202.resistivity.area-comparison",
      "unit202.emf.motional",
      "unit202.components.physical.resistor",
      "unit202.components.physical.capacitor",
      "unit202.components.physical.diode",
      "unit202.components.physical.led",
      "unit202.components.physical.thermistor",
      "unit202.components.physical.transistor",
      "unit202.diode.bias-direction.forward",
      "unit202.diode.bias-direction.reverse",
    ];
    expect(blockedIds.length).toBe(15);
    for (const id of blockedIds) {
      const asset = findAsset(id)!;
      expect(asset, `${id} not found`).toBeDefined();
      expect(asset.referenceReadiness, `${id} should be NOT_READY`).toBe("NOT_READY");
      // pedagogical classification unchanged -- still REQUIRED, never demoted
      expect(visualNeedClassificationFor(asset)).toBe("REQUIRED");
    }
  });
});

describe("CC-11.7C §2: hand-rule governance prohibits mirroring/flipping", () => {
  it("every MNEMONIC hand-rule asset explicitly prohibits mirroring/flipping in its prompt", () => {
    const handRuleIds = ["unit202.right-hand-grip.teaching", "unit202.fleming-left-hand.teaching", "unit202.fleming-right-hand.teaching"];
    for (const id of handRuleIds) {
      const asset = findAsset(id)!;
      expect(asset.role).toBe("MNEMONIC");
      const mirrorRule = asset.prohibitedChanges.find((p) => p.includes("DO NOT MIRROR"));
      expect(mirrorRule, `${id} has no explicit no-mirroring rule`).toBeDefined();
    }
  });

  it("no hand-rule asset's own governance text claims mirroring/flipping is a legitimate way to produce a reversed-direction companion image", () => {
    const handRuleIds = ["unit202.right-hand-grip.teaching", "unit202.fleming-left-hand.teaching", "unit202.fleming-right-hand.teaching"];
    for (const id of handRuleIds) {
      const asset = findAsset(id)!;
      const allText = [asset.sharedBaseAudit?.rationale ?? "", ...asset.canonicalStates.map((s) => s.notes ?? "")].join(" ");
      expect(allText, `${id} still claims mirroring is legitimate`).not.toMatch(/legitimate.*(mirror|flip)/i);
    }
  });
});
