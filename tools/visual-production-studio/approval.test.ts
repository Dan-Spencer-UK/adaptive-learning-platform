import { afterEach, describe, expect, it } from "vitest";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { findAsset } from "./catalogue.ts";
import { approveStagedImage } from "./approval.ts";
import { sha256Hex } from "./image-utils.ts";
import { currentManifestEntry, loadManifest } from "./state-store.ts";

function makeMinimalPng(width: number, height: number, colorType = 2): Buffer {
  const buf = Buffer.alloc(26);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(buf, 0);
  buf.writeUInt32BE(13, 8);
  buf.write("IHDR", 12, "ascii");
  buf.writeUInt32BE(width, 16);
  buf.writeUInt32BE(height, 20);
  buf[24] = 8;
  buf[25] = colorType;
  return buf;
}

const tempDirs: string[] = [];
function isolatedRoots(): { assetRoot: string; manifestPath: string } {
  const assetRoot = mkdtempSync(join(tmpdir(), "alp-studio-assets-"));
  const manifestDir = mkdtempSync(join(tmpdir(), "alp-studio-manifest-"));
  tempDirs.push(assetRoot, manifestDir);
  return { assetRoot, manifestPath: join(manifestDir, "manifest.json") };
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const ENTRY = findAsset("unit202.right-hand-grip.teaching")!;

describe("approveStagedImage -- first approval (image-save behaviour)", () => {
  it("writes the file to the entry's governed subfolder with a v1 filename and appends a matching manifest record", () => {
    const { assetRoot, manifestPath } = isolatedRoots();
    const buffer = makeMinimalPng(512, 512);

    const result = approveStagedImage({ entry: ENTRY, stagedBuffer: buffer, assetRoot, manifestPath });

    expect(result.status).toBe("saved");
    if (result.status !== "saved") throw new Error("unreachable");
    expect(result.manifestEntry.filename).toBe("right-hand-grip-teaching-base-v1.png");
    expect(result.manifestEntry.artworkVersion).toBe(1);
    expect(existsSync(result.outputPath)).toBe(true);
    expect(readFileSync(result.outputPath)).toEqual(buffer);
  });

  it("records the exact sha256 of the approved bytes (hashing)", () => {
    const { assetRoot, manifestPath } = isolatedRoots();
    const buffer = makeMinimalPng(4, 4);

    const result = approveStagedImage({ entry: ENTRY, stagedBuffer: buffer, assetRoot, manifestPath });
    if (result.status !== "saved") throw new Error("unreachable");
    expect(result.manifestEntry.fileHash).toBe(sha256Hex(buffer));
  });

  it("records the containing VisualFamily's id (not the old flat blueprint id) as visualFamilyId, and the governed CC-05D blueprint id separately", () => {
    const { assetRoot, manifestPath } = isolatedRoots();
    const result = approveStagedImage({ entry: ENTRY, stagedBuffer: makeMinimalPng(1, 1), assetRoot, manifestPath });
    if (result.status !== "saved") throw new Error("unreachable");
    expect(result.manifestEntry.visualFamilyId).toBe("unit202.family.right-hand-grip");
    expect(result.manifestEntry.governedDiagramBlueprintId).toBe("magnetic.field_conductor_direction");
  });

  it("records detected dimensions and MIME type in the manifest entry", () => {
    const { assetRoot, manifestPath } = isolatedRoots();
    const result = approveStagedImage({ entry: ENTRY, stagedBuffer: makeMinimalPng(800, 600), assetRoot, manifestPath });
    if (result.status !== "saved") throw new Error("unreachable");
    expect(result.manifestEntry.dimensions).toEqual({ width: 800, height: 600 });
    expect(result.manifestEntry.mimeType).toBe("image/png");
  });

  it("rejects a buffer that is not a recognised image format", () => {
    const { assetRoot, manifestPath } = isolatedRoots();
    expect(() => approveStagedImage({ entry: ENTRY, stagedBuffer: Buffer.from("not an image"), assetRoot, manifestPath })).toThrow();
  });
});

describe("approveStagedImage -- existing-file protection (§7)", () => {
  it("returns a conflict, and writes nothing, when an approved version already exists and no versioning choice is given", () => {
    const { assetRoot, manifestPath } = isolatedRoots();
    approveStagedImage({ entry: ENTRY, stagedBuffer: makeMinimalPng(1, 1), assetRoot, manifestPath });

    const secondAttempt = approveStagedImage({ entry: ENTRY, stagedBuffer: makeMinimalPng(2, 2), assetRoot, manifestPath });

    expect(secondAttempt.status).toBe("conflict");
    if (secondAttempt.status !== "conflict") throw new Error("unreachable");
    expect(secondAttempt.existing.artworkVersion).toBe(1);
    expect(loadManifest(manifestPath).assets).toHaveLength(1); // nothing appended by the rejected attempt
  });

  it("SAVE AS NEW VERSION creates v2 alongside v1 without touching the v1 file", () => {
    const { assetRoot, manifestPath } = isolatedRoots();
    const first = approveStagedImage({ entry: ENTRY, stagedBuffer: makeMinimalPng(1, 1), assetRoot, manifestPath });
    if (first.status !== "saved") throw new Error("unreachable");
    const v1Bytes = readFileSync(first.outputPath);

    const second = approveStagedImage({ entry: ENTRY, stagedBuffer: makeMinimalPng(2, 2), versioning: "new_version", assetRoot, manifestPath });
    if (second.status !== "saved") throw new Error("unreachable");

    expect(second.manifestEntry.filename).toBe("right-hand-grip-teaching-base-v2.png");
    expect(existsSync(first.outputPath)).toBe(true);
    expect(readFileSync(first.outputPath)).toEqual(v1Bytes); // v1 untouched
    expect(loadManifest(manifestPath).assets).toHaveLength(2);
    expect(currentManifestEntry(ENTRY.assetId, manifestPath)?.artworkVersion).toBe(2);
  });

  it("REPLACE WITH EXPLICIT CONFIRMATION overwrites the current version's file in place and appends a same-version manifest record", () => {
    const { assetRoot, manifestPath } = isolatedRoots();
    const original = makeMinimalPng(1, 1);
    const first = approveStagedImage({ entry: ENTRY, stagedBuffer: original, assetRoot, manifestPath });
    if (first.status !== "saved") throw new Error("unreachable");

    const replacement = makeMinimalPng(999, 999);
    const replaced = approveStagedImage({ entry: ENTRY, stagedBuffer: replacement, versioning: "replace_confirmed", assetRoot, manifestPath });
    if (replaced.status !== "saved") throw new Error("unreachable");

    expect(replaced.manifestEntry.artworkVersion).toBe(1); // same version, not bumped
    expect(replaced.outputPath).toBe(first.outputPath); // same file path
    expect(readFileSync(first.outputPath)).toEqual(replacement); // file bytes actually replaced
    expect(loadManifest(manifestPath).assets).toHaveLength(2); // append-only: both records retained
    expect(currentManifestEntry(ENTRY.assetId, manifestPath)?.fileHash).toBe(sha256Hex(replacement));
  });
});
