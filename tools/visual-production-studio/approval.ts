/**
 * CC-11.5 §7/§8/§9: the APPROVE + SAVE orchestration. Deliberately kept
 * separate from server.ts's HTTP plumbing so it can be unit-tested
 * directly (task brief §19: "image-save behaviour", "existing-file
 * protection", "manifest update", "hashing") without spinning up a real
 * server or touching the real governed asset tree -- every filesystem
 * root this module writes to is an explicit parameter, defaulting to the
 * real governed locations only at the server's own call site.
 */

import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

import { familyForAsset, type VisualAsset } from "./catalogue.ts";
import { computeNextVersion, inspectImage, sha256Hex, versionedFilename, type ImageInfo } from "./image-utils.ts";
import { APPROVED_ASSET_ROOT, resolveApprovedAssetPath } from "./paths.ts";
import { appendManifestEntry, currentManifestEntry, type ManifestEntry } from "./state-store.ts";
import { MANIFEST_PATH } from "./paths.ts";

export type VersioningChoice = "new_version" | "replace_confirmed";

export interface ApproveParams {
  entry: VisualAsset;
  stagedBuffer: Buffer;
  versioning?: VersioningChoice;
  assetRoot?: string;
  manifestPath?: string;
  /** Only used when replacing an approved version whose original extension differed from the newly staged image's detected format. */
  now?: () => string;
}

export interface ApproveConflict {
  status: "conflict";
  existing: ManifestEntry;
}

export interface ApproveSaved {
  status: "saved";
  manifestEntry: ManifestEntry;
  outputPath: string;
}

export type ApproveResult = ApproveConflict | ApproveSaved;

function extensionFor(format: ImageInfo["format"]): string {
  return format === "jpeg" ? "jpg" : format;
}

function ensureDir(path: string): void {
  if (!existsSync(path)) mkdirSync(path, { recursive: true });
}

/**
 * Existing-file protection (§7): if this asset already has an approved
 * version and the caller has not made an explicit versioning choice,
 * this returns a conflict instead of writing anything -- the caller
 * (server.ts's HTTP layer) is responsible for surfacing the
 * CANCEL / SAVE AS NEW VERSION / REPLACE dialog and re-calling with an
 * explicit `versioning` value.
 */
export function approveStagedImage(params: ApproveParams): ApproveResult {
  const assetRoot = params.assetRoot ?? APPROVED_ASSET_ROOT;
  const manifestPath = params.manifestPath ?? MANIFEST_PATH;
  const now = params.now ?? (() => new Date().toISOString());

  const info = inspectImage(params.stagedBuffer);
  if (!info) throw new Error("staged buffer is not a recognised PNG/WEBP/JPEG image");

  const existing = currentManifestEntry(params.entry.assetId, manifestPath);
  if (existing && !params.versioning) {
    return { status: "conflict", existing };
  }

  const targetDir = resolveApprovedAssetPath(params.entry.outputSubfolder, "placeholder.png", assetRoot);
  const targetDirPath = dirname(targetDir);
  const existingFilenames = existsSync(targetDirPath) ? readdirSync(targetDirPath) : [];

  let version: number;
  if (!existing) {
    version = 1;
  } else if (params.versioning === "replace_confirmed") {
    version = existing.artworkVersion;
  } else {
    version = computeNextVersion(existingFilenames, params.entry.filenameBase);
  }

  const filename = versionedFilename(params.entry.filenameBase, version, extensionFor(info.format));
  const outputPath = resolveApprovedAssetPath(params.entry.outputSubfolder, filename, assetRoot);

  ensureDir(dirname(outputPath));
  writeFileSync(outputPath, params.stagedBuffer);

  const family = familyForAsset(params.entry.assetId);

  const manifestEntry: ManifestEntry = {
    assetId: params.entry.assetId,
    displayName: params.entry.displayName,
    visualFamilyId: family?.familyId ?? params.entry.familyId,
    governedDiagramBlueprintId: params.entry.governedDiagramBlueprintId,
    lessonIds: params.entry.loOrLesson ? [params.entry.loOrLesson] : [],
    productionClass: params.entry.productionClass,
    priority: params.entry.priority,
    referenceSource: params.entry.primaryReference.sourceName,
    referenceUrl: params.entry.primaryReference.sourceUrl,
    referenceLicence: params.entry.primaryReference.licence,
    referenceQualityGrade: params.entry.primaryReference.qualityGrade,
    immutableFacts: params.entry.immutableFacts,
    deterministicOverlayResponsibilities: params.entry.deterministicOverlayResponsibilities,
    generatedArtworkResponsibilities: params.entry.creativeFreedoms,
    outputPath,
    filename,
    fileHash: sha256Hex(params.stagedBuffer),
    dimensions: { width: info.width, height: info.height },
    mimeType: info.mimeType,
    approvedAt: now(),
    approvalStatus: "APPROVED",
    artworkVersion: version,
  };

  appendManifestEntry(manifestEntry, manifestPath);

  return { status: "saved", manifestEntry, outputPath };
}
