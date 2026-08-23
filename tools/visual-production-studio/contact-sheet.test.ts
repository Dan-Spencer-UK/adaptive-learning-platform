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

function sampleEntry(overrides: Partial<ManifestEntry> = {}): ManifestEntry {
  return {
    assetId: "unit202.right-hand-grip.teaching",
    displayName: "Right-hand grip rule — teaching mnemonic",
    visualFamilyId: "unit202.family.right-hand-grip",
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
    ...overrides,
  };
}

describe("buildContactSheetHtml", () => {
  it("renders a valid HTML document reporting zero approved assets when the manifest is empty", () => {
    const html = buildContactSheetHtml(tempManifestPath());
    expect(html).toContain("<!doctype html>");
    expect(html).toContain("No approved assets yet.");
  });

  it("lists an approved asset's id, reference and version once one exists in the manifest", () => {
    const manifestPath = tempManifestPath();
    appendManifestEntry(sampleEntry(), manifestPath);

    const html = buildContactSheetHtml(manifestPath);
    expect(html).toContain("unit202.right-hand-grip.teaching");
    expect(html).toContain("Right-hand grip rule");
    expect(html).toContain("v1");
    expect(html).toContain("file not found on disk"); // the fixture path is deliberately non-existent
  });

  it("groups approved assets under their family's display name, in family order, with a progress badge", () => {
    const manifestPath = tempManifestPath();
    appendManifestEntry(
      sampleEntry({ assetId: "unit202.current-conductor.magnetic-field", displayName: "Magnetic field around a current-carrying conductor", filename: "current-conductor-magnetic-field-base-v1.png" }),
      manifestPath,
    );
    appendManifestEntry(sampleEntry(), manifestPath); // unit202.right-hand-grip.teaching, same family

    const html = buildContactSheetHtml(manifestPath);
    expect(html).toContain("Right-hand grip rule / field around a conductor"); // the family's own displayName
    expect(html).toContain("[2/2 approved]");

    // Both cards appear within the family section, phenomenon before mnemonic (family declaration order).
    const familyHeaderIndex = html.indexOf("Right-hand grip rule / field around a conductor");
    const phenomenonIndex = html.indexOf("Magnetic field around a current-carrying conductor");
    const mnemonicIndex = html.indexOf("unit202.right-hand-grip.teaching");
    expect(familyHeaderIndex).toBeGreaterThanOrEqual(0);
    expect(phenomenonIndex).toBeGreaterThan(familyHeaderIndex);
    expect(mnemonicIndex).toBeGreaterThan(phenomenonIndex);
  });

  it("shows a partial-approval progress badge when only some family members are approved", () => {
    const manifestPath = tempManifestPath();
    appendManifestEntry(sampleEntry(), manifestPath); // only the mnemonic, not the phenomenon

    const html = buildContactSheetHtml(manifestPath);
    expect(html).toContain("[1/2 approved]");
  });

  it("omits a family section entirely when none of its assets are approved", () => {
    const manifestPath = tempManifestPath();
    appendManifestEntry(sampleEntry(), manifestPath); // only right-hand-grip family has anything approved

    const html = buildContactSheetHtml(manifestPath);
    expect(html).not.toContain("Lever classes"); // a family with zero approvals never gets a section
  });
});
