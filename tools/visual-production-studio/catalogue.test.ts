import { describe, expect, it } from "vitest";
import { CATALOGUE, findCatalogueEntry, validateCatalogue } from "./catalogue.ts";

describe("CATALOGUE", () => {
  it("seeds all 24 entries from the CC-11.5 task brief", () => {
    expect(CATALOGUE).toHaveLength(24);
  });

  it("has zero validation problems -- unique ids, sequences, filename stems, and consistent enum/readiness fields", () => {
    expect(validateCatalogue()).toEqual([]);
  });

  it("every assetId is unique", () => {
    const ids = CATALOGUE.map((entry) => entry.assetId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("detects a duplicate assetId when one is synthetically introduced", () => {
    const dirty = [...CATALOGUE, { ...CATALOGUE[0]!, sequence: 999, filenameBase: "synthetic-dup-check" }];
    const problems = validateCatalogue(dirty);
    expect(problems.some((p) => p.includes("duplicate assetId"))).toBe(true);
  });

  it("detects a duplicate sequence number when one is synthetically introduced", () => {
    const dirty = [...CATALOGUE, { ...CATALOGUE[0]!, assetId: "synthetic.dup.sequence", filenameBase: "synthetic-dup-sequence" }];
    const problems = validateCatalogue(dirty);
    expect(problems.some((p) => p.includes("duplicate sequence"))).toBe(true);
  });

  it("REFERENCE_NOT_READY entries (§ heating-effect / conductor-insulator / protective-devices) carry no sourceUrl -- an invalid reference-ready state is mechanically detectable", () => {
    const notReady = CATALOGUE.filter((entry) => entry.referenceReadiness === "NOT_READY");
    expect(notReady.length).toBeGreaterThan(0);
    for (const entry of notReady) {
      expect(entry.primaryReference.sourceUrl).toBe("");
    }
  });

  it("flags an inconsistent readiness state (NOT_READY entry given a real sourceUrl) as a validation problem", () => {
    const dirty = CATALOGUE.map((entry) =>
      entry.assetId === "unit202.heating-effect" ? { ...entry, primaryReference: { ...entry.primaryReference, sourceUrl: "https://example.com" } } : entry,
    );
    const problems = validateCatalogue(dirty);
    expect(problems.some((p) => p.includes("unit202.heating-effect") && p.includes("inconsistent"))).toBe(true);
  });

  it("findCatalogueEntry resolves a known id and returns undefined for an unknown one", () => {
    expect(findCatalogueEntry("unit202.right-hand-grip.teaching")?.displayName).toBe("Right-hand grip rule — teaching mnemonic");
    expect(findCatalogueEntry("unit202.does-not-exist")).toBeUndefined();
  });

  it("every entry declares at least one immutable fact, except the three explicitly blocked NOT_READY entries", () => {
    for (const entry of CATALOGUE) {
      if (entry.referenceReadiness === "NOT_READY") continue;
      expect(entry.immutableFacts.length).toBeGreaterThan(0);
    }
  });
});
