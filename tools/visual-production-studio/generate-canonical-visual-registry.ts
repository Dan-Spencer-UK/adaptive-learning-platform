/**
 * CC-11.11 §18: prepares (never RELEASES) the canonical visual asset
 * registry -- the shipment-candidate list a future promotion step would
 * read from. Built directly from the state-level completeness matrix,
 * covering every RESOLVED state (GENERATED / DETERMINISTIC /
 * SHARED_BASE_VALID); DEFERRED_SCOPE states have nothing to ship and are
 * excluded.
 *
 * Every record's `approvalStatus` here is deliberately always
 * "AWAITING_PRODUCT_OWNER_APPROVAL" regardless of this package's own
 * internal audit verdict (PASS) -- an internal audit PASS is Claude's own
 * technical QA, never Product Owner sign-off, and this registry must never
 * imply otherwise. Nothing in this file ever becomes RELEASED by running
 * this script; that requires a real, separate Product Owner approval
 * action this tooling does not perform.
 *
 * Deliberately does NOT touch `unit202-artwork-manifest.json` (a
 * pre-existing file of unclear provenance from before this package's own
 * work, left untouched throughout CC-11.9/CC-11.10/CC-11.11) or any
 * `ContentRelease` -- this is a new, clearly CC-11.11-authored export.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { buildCompletenessMatrix, type ResolutionType, type StateCompletenessRecord } from "./generate-final-state-completeness.ts";
import { REPO_ROOT } from "./paths.ts";

const OUT_PATH = join(REPO_ROOT, "reports", "instructional-visuals", "unit202-canonical-visual-registry.json");

const SHIPPABLE: ReadonlySet<ResolutionType> = new Set(["GENERATED", "DETERMINISTIC", "SHARED_BASE_VALID"]);

export interface CanonicalVisualAssetRecord {
  canonicalAssetId: string;
  states: string[];
  reusable: boolean;
  commissioningContext: string;
  usageBindings: string[];
  resolutionType: ResolutionType;
  masterPath?: string;
  masterSha256?: string;
  derivativePath?: string;
  rendererBlueprintId?: string;
  approvalStatus: "AWAITING_PRODUCT_OWNER_APPROVAL";
}

export function buildCanonicalVisualRegistry(records: StateCompletenessRecord[] = buildCompletenessMatrix()): CanonicalVisualAssetRecord[] {
  const shippable = records.filter((r) => SHIPPABLE.has(r.resolutionType));
  const byAsset = new Map<string, StateCompletenessRecord[]>();
  for (const r of shippable) {
    if (!byAsset.has(r.assetId)) byAsset.set(r.assetId, []);
    byAsset.get(r.assetId)!.push(r);
  }

  const out: CanonicalVisualAssetRecord[] = [];
  for (const [assetId, assetRecords] of byAsset) {
    // One canonical registry entry per underlying resolved VISUAL (a state-specific master, or one shared asset-level master) --
    // several states can point at the same master (SHARED_BASE_VALID / a sole-generative-state asset with a deterministic-delegated sibling).
    const byMasterPath = new Map<string, StateCompletenessRecord[]>();
    for (const r of assetRecords) {
      const key = r.resolvedPath ?? r.rendererBlueprintId ?? r.stateId;
      if (!byMasterPath.has(key)) byMasterPath.set(key, []);
      byMasterPath.get(key)!.push(r);
    }
    for (const group of byMasterPath.values()) {
      const first = group[0]!;
      out.push({
        canonicalAssetId: assetId,
        states: group.map((r) => r.stateId),
        reusable: first.reuse.reusable,
        commissioningContext: first.reuse.commissioningContext,
        usageBindings: first.reuse.usageBindings,
        resolutionType: first.resolutionType,
        masterPath: first.resolvedPath,
        masterSha256: first.masterSha256,
        derivativePath: first.derivativePath,
        rendererBlueprintId: first.rendererBlueprintId,
        approvalStatus: "AWAITING_PRODUCT_OWNER_APPROVAL",
      });
    }
  }
  return out.sort((a, b) => a.canonicalAssetId.localeCompare(b.canonicalAssetId));
}

export function generateCanonicalVisualRegistry(): { path: string; count: number } {
  const registry = buildCanonicalVisualRegistry();
  mkdirSync(join(REPO_ROOT, "reports", "instructional-visuals"), { recursive: true });
  writeFileSync(
    OUT_PATH,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        note: "Shipment-candidate registry, CC-11.11. Every approvalStatus is AWAITING_PRODUCT_OWNER_APPROVAL -- nothing here is RELEASED. Does not touch unit202-artwork-manifest.json or any ContentRelease.",
        canonicalAssetCount: registry.length,
        assets: registry,
      },
      null,
      2,
    ) + "\n",
    "utf8",
  );
  return { path: OUT_PATH, count: registry.length };
}

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return fileURLToPath(import.meta.url) === entryPoint;
}

if (isMainModule()) {
  const { path, count } = generateCanonicalVisualRegistry();
  console.log(`Canonical visual registry written: ${path} (${count} canonical asset entries)`);
}
