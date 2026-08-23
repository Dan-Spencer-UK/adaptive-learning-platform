import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { buildContactSheetHtml } from "./contact-sheet.ts";
import { appendManifestEntry, type ManifestEntry } from "./state-store.ts";

const tempDirs: string[] = [];
function tempManifestPath(): string {
  const dir = mkdtempSync(join(tmpdir(), "alp-studio-contact-sheet-"));
  tempDirs.push(dir);
  return join(dir, "manifest.json");
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe("buildContactSheetHtml", () => {
  it("renders a valid HTML document reporting zero approved assets when the manifest is empty", () => {
    const html = buildContactSheetHtml(tempManifestPath());
    expect(html).toContain("<!doctype html>");
    expect(html).toContain("No approved assets yet.");
  });

  it("lists an approved asset's id, reference and version once one exists in the manifest", () => {
    const manifestPath = tempManifestPath();
    const entry: ManifestEntry = {
      assetId: "unit202.right-hand-grip.teaching",
      displayName: "Right-hand grip rule — teaching mnemonic",
      lessonIds: [],
      productionClass: "HYBRID",
      priority: "P0",
      referenceSource: "Wikimedia Commons",
      referenceUrl: "https://commons.wikimedia.org/wiki/File:Right-hand_grip_rule.svg",
      referenceLicence: "Public-domain dedication",
      referenceQualityGrade: "A",
      immutableFacts: [],
      deterministicOverlayResponsibilities: [],
      generatedArtworkResponsibilities: [],
      outputPath: join(tmpdir(), "does-not-exist-on-disk.png"),
      filename: "right-hand-grip-teaching-base-v1.png",
      fileHash: "deadbeef",
      dimensions: { width: 512, height: 512 },
      mimeType: "image/png",
      approvedAt: new Date().toISOString(),
      approvalStatus: "APPROVED",
      artworkVersion: 1,
    };
    appendManifestEntry(entry, manifestPath);

    const html = buildContactSheetHtml(manifestPath);
    expect(html).toContain("unit202.right-hand-grip.teaching");
    expect(html).toContain("Right-hand grip rule");
    expect(html).toContain("v1");
    expect(html).toContain("file not found on disk"); // the fixture path is deliberately non-existent
  });
});
