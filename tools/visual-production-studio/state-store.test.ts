import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { allAssets } from "./catalogue.ts";
import {
  appendManifestEntry,
  currentManifestEntry,
  defaultState,
  familyIdForAsset,
  loadManifest,
  loadState,
  saveState,
  setStatus,
  type ManifestEntry,
} from "./state-store.ts";

const tempDirs: string[] = [];
function tempFile(name: string): string {
  const dir = mkdtempSync(join(tmpdir(), "alp-studio-state-"));
  tempDirs.push(dir);
  return join(dir, name);
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe("defaultState", () => {
  it("gives every catalogue asset a starting status matching its reference readiness", () => {
    const state = defaultState();
    for (const asset of allAssets()) {
      if (asset.needsScopeConfirmation) continue;
      const expected = asset.referenceReadiness === "NOT_READY" ? "REFERENCE_NOT_READY" : "READY_TO_PROMPT";
      expect(state[asset.assetId]?.status).toBe(expected);
    }
  });

  it("familyIdForAsset resolves every real asset to its containing family id", () => {
    expect(familyIdForAsset("unit202.right-hand-grip.teaching")).toBe("unit202.family.right-hand-grip");
    expect(familyIdForAsset("unit202.does-not-exist")).toBeUndefined();
  });
});

describe("status persistence", () => {
  it("loadState falls back to defaults when no state file exists yet", () => {
    const statePath = tempFile("does-not-exist.json");
    const state = loadState(statePath);
    expect(state["unit202.right-hand-grip.teaching"]?.status).toBe("READY_TO_PROMPT");
  });

  it("survives a save/reload round trip -- status persists across a simulated Studio restart", () => {
    const statePath = tempFile("studio-state.json");
    setStatus("unit202.right-hand-grip.teaching", "NEEDS_REVIEW", { notes: "thumb angle looks off", statePath });

    const reloaded = loadState(statePath);
    expect(reloaded["unit202.right-hand-grip.teaching"]).toMatchObject({ status: "NEEDS_REVIEW", notes: "thumb angle looks off" });
  });

  it("a newly added catalogue entry not present in an older on-disk state file still gets a valid default status", () => {
    const statePath = tempFile("studio-state.json");
    saveState({ "unit202.right-hand-grip.teaching": { status: "SAVED", updatedAt: new Date().toISOString() } }, statePath);

    const reloaded = loadState(statePath);
    expect(reloaded["unit202.right-hand-grip.teaching"]?.status).toBe("SAVED"); // preserved
    expect(reloaded["unit202.trigonometry"]?.status).toBe("READY_TO_PROMPT"); // defaulted, not missing
  });

  it("a corrupt state file falls back to defaults rather than throwing", () => {
    const statePath = tempFile("corrupt.json");
    saveState({} as never, statePath); // write valid-but-empty first
    writeFileSync(statePath, "{not valid json", "utf8"); // now corrupt it directly
    expect(() => loadState(statePath)).not.toThrow();
    expect(loadState(statePath)["unit202.right-hand-grip.teaching"]?.status).toBe("READY_TO_PROMPT");
  });
});

describe("approval manifest", () => {
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
      immutableFacts: ["RIGHT hand"],
      deterministicOverlayResponsibilities: [],
      generatedArtworkResponsibilities: [],
      outputPath: "/repo/apps/mobile/src/assets/instructional/unit202/teaching/right-hand-grip-teaching-base-v1.png",
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

  it("loadManifest returns an empty asset list when no manifest file exists yet", () => {
    const manifestPath = tempFile("does-not-exist-manifest.json");
    expect(loadManifest(manifestPath).assets).toEqual([]);
  });

  it("appendManifestEntry is genuinely append-only -- a second approval never overwrites the first record", () => {
    const manifestPath = tempFile("manifest.json");
    appendManifestEntry(sampleEntry({ artworkVersion: 1 }), manifestPath);
    appendManifestEntry(sampleEntry({ artworkVersion: 2 }), manifestPath);

    const manifest = loadManifest(manifestPath);
    expect(manifest.assets).toHaveLength(2);
    expect(manifest.assets.map((a) => a.artworkVersion)).toEqual([1, 2]);
  });

  it("currentManifestEntry resolves to the highest artworkVersion for an asset", () => {
    const manifestPath = tempFile("manifest.json");
    appendManifestEntry(sampleEntry({ artworkVersion: 1 }), manifestPath);
    appendManifestEntry(sampleEntry({ artworkVersion: 3 }), manifestPath);
    appendManifestEntry(sampleEntry({ artworkVersion: 2 }), manifestPath);

    expect(currentManifestEntry("unit202.right-hand-grip.teaching", manifestPath)?.artworkVersion).toBe(3);
  });

  it("currentManifestEntry tiebreaks same-version REPLACE records by approvedAt (the later replace wins)", () => {
    const manifestPath = tempFile("manifest.json");
    appendManifestEntry(sampleEntry({ artworkVersion: 1, approvedAt: "2026-01-01T00:00:00.000Z", fileHash: "first" }), manifestPath);
    appendManifestEntry(sampleEntry({ artworkVersion: 1, approvedAt: "2026-01-02T00:00:00.000Z", fileHash: "replaced" }), manifestPath);

    expect(currentManifestEntry("unit202.right-hand-grip.teaching", manifestPath)?.fileHash).toBe("replaced");
  });

  it("currentManifestEntry returns undefined for an asset with no approved record", () => {
    const manifestPath = tempFile("manifest.json");
    appendManifestEntry(sampleEntry(), manifestPath);
    expect(currentManifestEntry("unit202.trigonometry", manifestPath)).toBeUndefined();
  });
});
