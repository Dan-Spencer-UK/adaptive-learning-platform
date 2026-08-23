import { describe, expect, it } from "vitest";
import { CATALOGUE, findCatalogueEntry } from "./catalogue.ts";
import { buildAssetPrompt } from "./prompt-builder.ts";

describe("buildAssetPrompt", () => {
  it("is deterministic -- two calls with the same entry produce byte-identical output", () => {
    const entry = findCatalogueEntry("unit202.right-hand-grip.teaching")!;
    expect(buildAssetPrompt(entry)).toBe(buildAssetPrompt(entry));
  });

  it("includes the asset id, display name and every immutable fact for a READY entry", () => {
    const entry = findCatalogueEntry("unit202.right-hand-grip.teaching")!;
    const text = buildAssetPrompt(entry);
    expect(text).toContain(entry.assetId);
    expect(text).toContain(entry.displayName);
    for (const fact of entry.immutableFacts) expect(text).toContain(fact);
  });

  it("includes the critical direction-verification rule (§11) in every generated production prompt (READY entries only -- a BLOCKED entry gets a short notice instead, never a full prompt)", () => {
    for (const entry of CATALOGUE) {
      if (entry.referenceReadiness !== "READY") continue;
      const text = buildAssetPrompt(entry);
      expect(text).toContain("Do NOT rely on the text label of an arrow or diagram to infer correctness");
      expect(text).toContain("inspect arrowheads");
    }
  });

  it("includes the assessment note when one is declared (right-hand grip / Fleming rules are teaching-only)", () => {
    const entry = findCatalogueEntry("unit202.right-hand-grip.teaching")!;
    const text = buildAssetPrompt(entry);
    expect(text).toContain("Assessment contains NO hand");
  });

  it("a BLOCKED (reference NOT_READY) entry produces a short blocked notice, never a full production prompt", () => {
    const entry = findCatalogueEntry("unit202.heating-effect")!;
    const text = buildAssetPrompt(entry);
    expect(text).toContain("BLOCKED");
    expect(text).not.toContain("IMMUTABLE TECHNICAL FACTS");
  });

  it("produces a unique prompt per catalogue entry (no two assets share identical prompt text)", () => {
    const texts = CATALOGUE.map((entry) => buildAssetPrompt(entry));
    expect(new Set(texts).size).toBe(texts.length);
  });

  it("never includes a secondary-reference block for an entry with none declared", () => {
    const entry = findCatalogueEntry("unit202.right-hand-grip.teaching")!;
    expect(entry.secondaryReference).toBeUndefined();
    expect(buildAssetPrompt(entry)).not.toContain("SECONDARY / CROSS-CHECK REFERENCE");
  });

  it("includes a secondary-reference block for an entry that declares one", () => {
    const entry = findCatalogueEntry("unit202.generator.rotating-loop")!;
    expect(entry.secondaryReference).toBeDefined();
    const text = buildAssetPrompt(entry);
    expect(text).toContain("SECONDARY / CROSS-CHECK REFERENCE");
    expect(text).toContain(entry.secondaryReference!.sourceName);
  });
});
