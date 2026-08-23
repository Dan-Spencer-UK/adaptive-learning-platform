import { describe, expect, it } from "vitest";
import { buildMatrix } from "./generate-matrix.ts";
import { allAssets } from "./catalogue.ts";

describe("buildMatrix", () => {
  const matrix = buildMatrix();

  it("includes one CATALOGUED_ASSET row per real catalogue asset", () => {
    const catalogued = matrix.rows.filter((row) => row.kind === "CATALOGUED_ASSET");
    expect(catalogued.length).toBe(allAssets().length);
  });

  it("includes USEFUL_UNCATALOGUED and NOT_NEEDED rows from the audit findings", () => {
    expect(matrix.rows.some((row) => row.kind === "USEFUL_UNCATALOGUED")).toBe(true);
    expect(matrix.rows.some((row) => row.kind === "NOT_NEEDED")).toBe(true);
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
