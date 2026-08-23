/**
 * CC-11.5 §8/§9/§15: status persistence (a small local JSON file, no
 * database, per task brief §15) and the governed approval manifest
 * (append-only per approved artwork version, mirroring this repository's
 * existing "never mutate a past immutable version" discipline for
 * content releases -- see docs/architecture/PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md
 * §9's "golden-asset locking model analogous to immutable content releases").
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

import { CATALOGUE, type CatalogueEntry } from "./catalogue.ts";
import { MANIFEST_PATH, STATE_PATH } from "./paths.ts";

export const STUDIO_STATUSES = [
  "REFERENCE_NOT_READY",
  "READY_TO_PROMPT",
  "IN_ART_SESSION",
  "IMAGE_PASTED",
  "NEEDS_REVIEW",
  "APPROVED",
  "SAVED",
  "SUPERSEDED",
  "BLOCKED",
] as const;
export type StudioStatus = (typeof STUDIO_STATUSES)[number];

export interface StudioStateEntry {
  status: StudioStatus;
  notes?: string;
  updatedAt: string;
}

export type StudioState = Record<string, StudioStateEntry>;

function defaultStatusFor(entry: CatalogueEntry): StudioStatus {
  return entry.referenceReadiness === "NOT_READY" ? "REFERENCE_NOT_READY" : "READY_TO_PROMPT";
}

export function defaultState(catalogue: CatalogueEntry[] = CATALOGUE): StudioState {
  const state: StudioState = {};
  for (const entry of catalogue) {
    state[entry.assetId] = { status: defaultStatusFor(entry), updatedAt: new Date(0).toISOString() };
  }
  return state;
}

function ensureDir(filePath: string): void {
  const dir = dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

export function loadState(statePath: string = STATE_PATH, catalogue: CatalogueEntry[] = CATALOGUE): StudioState {
  const base = defaultState(catalogue);
  if (!existsSync(statePath)) return base;

  try {
    const parsed = JSON.parse(readFileSync(statePath, "utf8")) as StudioState;
    // Merge over defaults so a newly added catalogue entry always has a
    // valid starting status even if the on-disk state file predates it.
    return { ...base, ...parsed };
  } catch {
    return base;
  }
}

export function saveState(state: StudioState, statePath: string = STATE_PATH): void {
  ensureDir(statePath);
  writeFileSync(statePath, JSON.stringify(state, null, 2) + "\n", "utf8");
}

export function setStatus(
  assetId: string,
  status: StudioStatus,
  options: { notes?: string; statePath?: string; catalogue?: CatalogueEntry[] } = {},
): StudioState {
  const statePath = options.statePath ?? STATE_PATH;
  const state = loadState(statePath, options.catalogue);
  state[assetId] = { status, notes: options.notes, updatedAt: new Date().toISOString() };
  saveState(state, statePath);
  return state;
}

// ---------------------------------------------------------------------
// Approval manifest -- append-only, one record per approved artwork
// version. reports/instructional-visuals/premium-artwork/unit202-artwork-manifest.json
// ---------------------------------------------------------------------

export type ApprovalStatus = "APPROVED";

export interface ManifestEntry {
  assetId: string;
  displayName: string;
  visualFamilyId?: string;
  lessonIds: string[];
  productionClass: string;
  priority: string;
  referenceSource: string;
  referenceUrl: string;
  referenceLicence: string;
  referenceQualityGrade: string;
  immutableFacts: string[];
  deterministicOverlayResponsibilities: string[];
  generatedArtworkResponsibilities: string[];
  outputPath: string;
  filename: string;
  fileHash: string;
  dimensions: { width: number | null; height: number | null };
  mimeType: string;
  approvedAt: string;
  approvalStatus: ApprovalStatus;
  artworkVersion: number;
}

export interface ManifestFile {
  generatedAt: string;
  assets: ManifestEntry[];
}

export function loadManifest(manifestPath: string = MANIFEST_PATH): ManifestFile {
  if (!existsSync(manifestPath)) return { generatedAt: new Date(0).toISOString(), assets: [] };
  try {
    return JSON.parse(readFileSync(manifestPath, "utf8")) as ManifestFile;
  } catch {
    return { generatedAt: new Date(0).toISOString(), assets: [] };
  }
}

export function saveManifest(manifest: ManifestFile, manifestPath: string = MANIFEST_PATH): void {
  ensureDir(manifestPath);
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
}

/** Append-only: never mutates or removes a previously written entry, matching this repo's immutable-release discipline. */
export function appendManifestEntry(entry: ManifestEntry, manifestPath: string = MANIFEST_PATH): ManifestFile {
  const manifest = loadManifest(manifestPath);
  manifest.assets.push(entry);
  manifest.generatedAt = new Date().toISOString();
  saveManifest(manifest, manifestPath);
  return manifest;
}

/**
 * The "current" record for an asset is the greatest (artworkVersion,
 * approvedAt) pair -- version normally increases monotonically, but a
 * REPLACE WITH EXPLICIT CONFIRMATION save (§9) appends a new record at
 * the SAME version number with a fresher approvedAt, so approvedAt is
 * the tiebreaker rather than array order.
 */
export function currentManifestEntry(assetId: string, manifestPath: string = MANIFEST_PATH): ManifestEntry | undefined {
  const manifest = loadManifest(manifestPath);
  const versions = manifest.assets.filter((asset) => asset.assetId === assetId);
  if (versions.length === 0) return undefined;
  return versions.reduce((latest, candidate) => {
    if (candidate.artworkVersion !== latest.artworkVersion) return candidate.artworkVersion > latest.artworkVersion ? candidate : latest;
    return candidate.approvedAt > latest.approvedAt ? candidate : latest;
  });
}
