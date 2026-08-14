import { describe, expect, it } from "vitest";
import { packageManifestSchema } from "./index";

describe("packageManifestSchema", () => {
  it("accepts a valid manifest", () => {
    const result = packageManifestSchema.safeParse({
      name: "domain",
      version: "0.1.0",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a manifest missing required fields", () => {
    const result = packageManifestSchema.safeParse({ name: "" });

    expect(result.success).toBe(false);
  });

  it("rejects a manifest with the wrong field types", () => {
    const result = packageManifestSchema.safeParse({
      name: "domain",
      version: 1,
    });

    expect(result.success).toBe(false);
  });
});
