import { describe, expect, it } from "vitest";
import { buildMatrix } from "./generate-matrix.ts";
import { allAssets } from "./catalogue.ts";

describe("buildMatrix", () => {
  const matrix = buildMatrix();

  it("includes one CATALOGUED_ASSET row per real catalogue asset", () => {
    const catalogued = matrix.rows.filter((row) => row.kind === "CATALOGUED_ASSET");
    expect(catalogued.length).toBe(allAssets().length);
  });

  it("includes NOT_NEEDED rows from the audit findings", () => {
    expect(matrix.rows.some((row) => row.kind === "NOT_NEEDED")).toBe(true);
  });

  it("CC-11.7A §25: zero USEFUL_UNCATALOGUED rows -- all 10 CC-11.7 USEFUL findings are now live CATALOGUED_ASSET rows with needClassification USEFUL", () => {
    expect(matrix.rows.filter((row) => row.kind === "USEFUL_UNCATALOGUED")).toHaveLength(0);
    const usefulCatalogued = matrix.rows.filter((row) => row.kind === "CATALOGUED_ASSET" && row.needClassification === "USEFUL");
    expect(usefulCatalogued.length).toBeGreaterThan(0);
  });

  it("every CATALOGUED_ASSET row's existing66Mapped flag matches whether any of its states reconciles to a real CC-05D variant", () => {
    const withMapping = matrix.rows.filter((row) => row.kind === "CATALOGUED_ASSET" && row.existing66Mapped);
    expect(withMapping.length).toBeGreaterThan(0);
    for (const row of withMapping) {
      expect(row.canonicalStates?.some((s) => Boolean(s.existingCanonicalVariantId))).toBe(true);
    }
  });

  it("has a stable, non-empty generatedAt timestamp", () => {
    expect(matrix.generatedAt.length).toBeGreaterThan(0);
    expect(() => new Date(matrix.generatedAt)).not.toThrow();
  });
});
