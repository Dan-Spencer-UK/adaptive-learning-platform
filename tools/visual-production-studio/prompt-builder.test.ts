import { describe, expect, it } from "vitest";
import { allAssets, familyForAsset, findAsset, isPromptable } from "./catalogue.ts";
import { buildAssetPrompt } from "./prompt-builder.ts";
import { MASTER_PROMPT } from "./master-prompt.ts";

describe("buildAssetPrompt (PROMPT 2 -- ASSET-SPECIFIC PROMPT)", () => {
  it("is deterministic -- two calls with the same asset produce byte-identical output", () => {
    const asset = findAsset("unit202.right-hand-grip.teaching")!;
    expect(buildAssetPrompt(asset)).toBe(buildAssetPrompt(asset));
  });

  it("includes the asset id, display name and every immutable fact for a READY asset", () => {
    const asset = findAsset("unit202.right-hand-grip.teaching")!;
    const text = buildAssetPrompt(asset);
    expect(text).toContain(asset.assetId);
    expect(text).toContain(asset.displayName);
    for (const fact of asset.immutableFacts) expect(text).toContain(fact);
  });

  it("CC-11.7A §21/§22: states the need classification (REQUIRED vs USEFUL) so a Product Owner never confuses optional enrichment with REQUIRED completeness", () => {
    const required = findAsset("unit202.right-hand-grip.teaching")!;
    expect(buildAssetPrompt(required)).toContain("Need classification: REQUIRED");

    const useful = findAsset("unit202.magnet.permanent-vs-electromagnet")!;
    expect(useful.needOverride).toBe("USEFUL");
    // this specific fixture is currently BLOCKED_REFERENCE (no reference sourced yet) -- confirm the classification text still appears on a synthetically-ready clone.
    const readyUseful = { ...useful, referenceReadiness: "READY" as const, primaryReference: { sourceName: "test", sourceUrl: "", licence: "test", qualityGrade: "test" } };
    const text = buildAssetPrompt(readyUseful);
    expect(text).toContain("Need classification: USEFUL");
    expect(text).toContain("optional enrichment");
  });

  it("includes the critical direction-verification rule (§11) in every generated production prompt (READY, non-scope-blocked entries only)", () => {
    for (const asset of allAssets()) {
      if (asset.referenceReadiness !== "READY" || asset.needsScopeConfirmation || asset.promptable === false || asset.productionClass === "DETERMINISTIC_TECHNICAL") continue;
      const text = buildAssetPrompt(asset);
      expect(text).toContain("Do NOT rely on the text label of an arrow or diagram to infer correctness");
      expect(text).toContain("inspect arrowheads");
    }
  });

  it("CC-11.7A §11: every promptable asset's generated prompt is byte-unique -- one distinct image job, one distinct prompt, never a shared/generic family prompt", () => {
    const promptableAssets = allAssets().filter(isPromptable);
    const prompts = promptableAssets.map((asset) => buildAssetPrompt(asset));
    expect(new Set(prompts).size).toBe(prompts.length);
  });

  it("includes the family name/id and this asset's role and position within it", () => {
    const asset = findAsset("unit202.right-hand-grip.teaching")!;
    const family = familyForAsset(asset.assetId)!;
    const text = buildAssetPrompt(asset);
    expect(text).toContain(family.familyId);
    expect(text).toContain(family.displayName);
    expect(text).toContain("Role in family: MNEMONIC");
    expect(text).toContain("asset 2 of 2");
  });

  it('every generated prompt tells the art session to produce ONLY this asset and not the rest of the family', () => {
    for (const asset of allAssets()) {
      if (asset.referenceReadiness !== "READY" || asset.needsScopeConfirmation || asset.promptable === false || asset.productionClass === "DETERMINISTIC_TECHNICAL") continue;
      const text = buildAssetPrompt(asset);
      expect(text).toContain("Produce ONLY this asset. Do not automatically create the other members of the visual family.");
    }
  });

  it("a single-asset family's prompt does not add the multi-asset family-consistency reminder", () => {
    const asset = findAsset("unit202.circuit.series")!;
    const text = buildAssetPrompt(asset);
    expect(text).not.toContain("keep them visually consistent with each other");
  });

  it("a multi-asset family's prompt adds the family-consistency reminder without assuming the family always needs multiple images", () => {
    const asset = findAsset("unit202.levers.class-1")!;
    const text = buildAssetPrompt(asset);
    expect(text).toContain("keep them visually consistent with each other");
    expect(text).toContain("do not assume every concept needs multiple images");
  });

  it("includes the assessment note when one is declared (right-hand grip / Fleming rules are teaching-only)", () => {
    const asset = findAsset("unit202.right-hand-grip.teaching")!;
    const text = buildAssetPrompt(asset);
    expect(text).toContain("Assessment contains NO hand");
  });

  it("a BLOCKED (reference NOT_READY) asset produces a short blocked notice, never a full production prompt", () => {
    const asset = findAsset("unit202.heating-effect")!;
    const text = buildAssetPrompt(asset);
    expect(text).toContain("BLOCKED");
    expect(text).not.toContain("IMMUTABLE TECHNICAL FACTS");
  });

  it("a promptable:false asset (no image-generation deliverable) produces a short notice, never a full production prompt", () => {
    const asset = findAsset("unit202.components.symbols")!;
    const text = buildAssetPrompt(asset);
    expect(text).toContain("NO CHATGPT ART JOB -- VECTOR AUTHORITATIVE");
    expect(text).not.toContain("IMMUTABLE TECHNICAL FACTS");
  });

  it("CC-11.7C §3: every DETERMINISTIC_TECHNICAL asset produces the vector-authoritative notice, never a real art prompt, even when it has not explicitly set promptable:false", () => {
    const withoutExplicitFlag = findAsset("unit202.circuit.series")!;
    expect(withoutExplicitFlag.productionClass).toBe("DETERMINISTIC_TECHNICAL");
    expect(withoutExplicitFlag.promptable).not.toBe(false); // no explicit override -- the productionClass check alone must catch it
    for (const asset of allAssets()) {
      if (asset.productionClass !== "DETERMINISTIC_TECHNICAL") continue;
      const text = buildAssetPrompt(asset);
      expect(text).toContain("NO CHATGPT ART JOB -- VECTOR AUTHORITATIVE");
      expect(text).not.toContain("IMMUTABLE TECHNICAL FACTS");
      expect(isPromptable(asset)).toBe(false);
    }
  });

  it("produces a unique prompt per catalogue asset (no two assets share identical prompt text)", () => {
    const texts = allAssets().map((asset) => buildAssetPrompt(asset));
    expect(new Set(texts).size).toBe(texts.length);
  });

  it("never includes a secondary-reference block for an asset with none declared", () => {
    const asset = findAsset("unit202.right-hand-grip.teaching")!;
    expect(asset.secondaryReference).toBeUndefined();
    expect(buildAssetPrompt(asset)).not.toContain("SECONDARY / CROSS-CHECK REFERENCE");
  });

  it("includes a secondary-reference block for an asset that declares one", () => {
    const asset = findAsset("unit202.generator.rotating-loop.horizontal")!;
    expect(asset.secondaryReference).toBeDefined();
    const text = buildAssetPrompt(asset);
    expect(text).toContain("SECONDARY / CROSS-CHECK REFERENCE");
    expect(text).toContain(asset.secondaryReference!.sourceName);
  });

  describe("ANNOTATION FOLLOWS PEDAGOGICAL STATE -- label instructions", () => {
    it("a TEACHING_EXPLANATORY asset's prompt says labels are REQUIRED and names the specific required labels", () => {
      const asset = findAsset("unit202.right-hand-grip.teaching")!;
      const text = buildAssetPrompt(asset);
      expect(text).toContain("LABELS FOR THIS ASSET: REQUIRED");
      expect(text).toContain("THUMB = CURRENT");
      expect(text).toContain("FINGERS = MAGNETIC FIELD");
    });

    it("a NONE-policy asset's prompt says labels are OMITTED (synthetic: every real NONE-policy asset is DETERMINISTIC_TECHNICAL since CC-11.7C §3, so this branch is exercised via an override rather than a live fixture)", () => {
      const base = findAsset("unit202.right-hand-grip.teaching")!;
      const synthetic = { ...base, annotationPolicy: "NONE" as const };
      const text = buildAssetPrompt(synthetic);
      expect(text).toContain("LABELS FOR THIS ASSET: OMIT");
    });

    it("never claims a blanket 'no labels' rule for a TEACHING_EXPLANATORY asset -- the old absolute default is gone", () => {
      const asset = findAsset("unit202.levers.class-1")!;
      const text = buildAssetPrompt(asset);
      expect(text).not.toMatch(/should not bake in/i);
      expect(text).toContain("EFFORT");
      expect(text).toContain("LOAD");
      expect(text).toContain("FULCRUM");
    });
  });

  describe("default premium surface -- background instruction", () => {
    it("a HYBRID asset's prompt automatically inherits the standard white/near-white background instruction (CC-11.9)", () => {
      const asset = findAsset("unit202.right-hand-grip.teaching")!;
      expect(asset.productionClass).toBe("HYBRID");
      const text = buildAssetPrompt(asset);
      expect(text).toContain("BACKGROUND:");
      expect(text).toMatch(/near-white/i);
      expect(text).toMatch(/#FBFBFA/);
      expect(text).not.toMatch(/slate.*blue-grey/i);
    });

    it("a PREMIUM_CONCEPTUAL asset's prompt also inherits the default background instruction", () => {
      // unit202.components.physical.resistor is currently BLOCKED_REFERENCE
      // (CC-11.7C §1 correction) -- override readiness on a clone to still
      // exercise the READY-path background-instruction logic for this
      // productionClass.
      const base = findAsset("unit202.components.physical.resistor")!;
      expect(base.productionClass).toBe("PREMIUM_CONCEPTUAL");
      const ready = { ...base, referenceReadiness: "READY" as const, primaryReference: { sourceName: "test", sourceUrl: "", licence: "test", qualityGrade: "test" } };
      const text = buildAssetPrompt(ready);
      expect(text).toContain("BACKGROUND:");
    });

    it("a DETERMINISTIC_TECHNICAL asset's prompt never includes the background instruction -- it has no illustrated surface", () => {
      const asset = findAsset("unit202.circuit.series")!;
      expect(asset.productionClass).toBe("DETERMINISTIC_TECHNICAL");
      const text = buildAssetPrompt(asset);
      expect(text).not.toContain("BACKGROUND:");
    });

    it("an asset with a backgroundStyleOverride uses that text instead of the standard default", () => {
      const asset = { ...findAsset("unit202.right-hand-grip.teaching")!, backgroundStyleOverride: "Use a warm workshop-bench context instead of an abstract background." };
      const text = buildAssetPrompt(asset);
      expect(text).toContain("Use a warm workshop-bench context instead of an abstract background.");
      expect(text).not.toMatch(/slate.*blue-grey/i);
    });

    it("the CC-11.9 white/near-white default instruction wording is reproduced exactly for the standard (non-overridden) case", () => {
      const asset = findAsset("unit202.right-hand-grip.teaching")!;
      const text = buildAssetPrompt(asset);
      expect(text).toContain(
        "Use a clean near-white background (#FBFBFA) with an optional extremely subtle gradient toward a very light cool-grey (#F0F1F3). Premium, adult, technically credible, contemporary, calm, uncluttered, mobile-first. Subtle neutral-grey shadow/depth only (soft, low-opacity, never colour-tinted). Avoid black voids, dark slate, strong texture, decorative scenery, neon/cyberpunk treatment or advertising-dramatic lighting.",
      );
    });
  });
});

describe("MASTER_PROMPT (PROMPT 1 -- MASTER ART SESSION PROMPT) stays a separate, single layer", () => {
  it("is a non-empty string distinct from any per-asset prompt", () => {
    expect(MASTER_PROMPT.length).toBeGreaterThan(200);
    const assetText = buildAssetPrompt(findAsset("unit202.right-hand-grip.teaching")!);
    expect(MASTER_PROMPT).not.toBe(assetText);
  });

  it("never contains an individual asset's assetId -- it is asset-agnostic, used once per session", () => {
    for (const asset of allAssets()) {
      expect(MASTER_PROMPT).not.toContain(asset.assetId);
    }
  });

  it("explains the labels-follow-pedagogical-state rule and visual-family awareness, not a blanket no-labels default", () => {
    expect(MASTER_PROMPT).toMatch(/LABELS ARE A PEDAGOGICAL TOOL/);
    expect(MASTER_PROMPT).toMatch(/do not automatically strip labels/i);
    expect(MASTER_PROMPT).toMatch(/VISUAL-FAMILY AWARENESS/);
    expect(MASTER_PROMPT).toMatch(/do not assume every concept requires multiple images/i);
  });
});
