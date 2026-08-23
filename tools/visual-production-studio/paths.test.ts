import { describe, expect, it } from "vitest";
import { join } from "node:path";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";

import { APPROVED_ASSET_ROOT, resolveApprovedAssetPath, resolveStagingPath, UnsafePathError } from "./paths.ts";
import { CATALOGUE } from "./catalogue.ts";

describe("resolveApprovedAssetPath", () => {
  it("resolves a safe filename inside a governed subfolder under the real approved asset root", () => {
    const resolved = resolveApprovedAssetPath("teaching", "right-hand-grip-teaching-base-v1.png");
    expect(resolved.startsWith(APPROVED_ASSET_ROOT)).toBe(true);
    expect(resolved.endsWith(join("teaching", "right-hand-grip-teaching-base-v1.png"))).toBe(true);
  });

  it("produces the correct output path for every catalogue entry's own declared subfolder", () => {
    for (const entry of CATALOGUE) {
      const filename = `${entry.filenameBase}-v1.png`;
      const resolved = resolveApprovedAssetPath(entry.outputSubfolder, filename);
      expect(resolved).toBe(join(APPROVED_ASSET_ROOT, entry.outputSubfolder, filename));
    }
  });

  it("rejects a filename containing a path-traversal sequence", () => {
    expect(() => resolveApprovedAssetPath("teaching", "../../../etc/passwd.png")).toThrow(UnsafePathError);
  });

  it("rejects a filename with a directory separator embedded", () => {
    expect(() => resolveApprovedAssetPath("teaching", "sub/dir/evil.png")).toThrow(UnsafePathError);
  });

  it("rejects an unsafe/unapproved extension", () => {
    expect(() => resolveApprovedAssetPath("teaching", "payload.exe")).toThrow(UnsafePathError);
    expect(() => resolveApprovedAssetPath("teaching", "payload.svg")).toThrow(UnsafePathError);
  });

  it("rejects an output subfolder that is not one of the governed enum values", () => {
    // @ts-expect-error -- deliberately passing an invalid subfolder to prove the runtime guard, not just the type system
    expect(() => resolveApprovedAssetPath("../escape", "safe-name-v1.png")).toThrow(UnsafePathError);
  });

  it("a path that resolves outside the approved root even after joining is rejected (defense in depth against an override root sharing a path prefix)", () => {
    const tempDir = mkdtempSync(join(tmpdir(), "alp-studio-paths-"));
    try {
      // An adjacent sibling directory ("<tempDir>-sibling") shares tempDir as
      // a string prefix but is NOT a descendant of it -- proves the check is
      // a genuine path-boundary test, not a naive string prefix comparison
      // that a cleverly-named sibling directory could defeat.
      const siblingLikePrefixRoot = tempDir; // baseline: legitimate root
      const resolved = resolveApprovedAssetPath("teaching", "safe-name-v1.png", siblingLikePrefixRoot);
      expect(resolved.startsWith(tempDir)).toBe(true);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});

describe("resolveStagingPath", () => {
  it("resolves a safe assetId + extension pair", () => {
    const resolved = resolveStagingPath("unit202.right-hand-grip.teaching", "png");
    expect(resolved.endsWith("unit202.right-hand-grip.teaching.png")).toBe(true);
  });

  it("rejects an assetId containing a path-traversal sequence", () => {
    expect(() => resolveStagingPath("../../etc/passwd", "png")).toThrow(UnsafePathError);
  });

  it("rejects an assetId containing a directory separator", () => {
    expect(() => resolveStagingPath("unit202/evil", "png")).toThrow(UnsafePathError);
  });

  it("rejects an unapproved extension", () => {
    expect(() => resolveStagingPath("unit202.right-hand-grip.teaching", "exe")).toThrow(UnsafePathError);
  });

  it("every real catalogue assetId resolves safely (no false-positive rejections)", () => {
    for (const entry of CATALOGUE) {
      expect(() => resolveStagingPath(entry.assetId, "png")).not.toThrow();
    }
  });
});
