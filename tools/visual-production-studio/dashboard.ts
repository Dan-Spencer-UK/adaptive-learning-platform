/**
 * CC-11.7 §19: the Studio's dashboard counts, computed mechanically from
 * catalogue + status data -- never a single misleading total. Every
 * number here is derived, never separately authored, so the dashboard
 * can never silently drift from the real catalogue.
 */

import { allAssets, FAMILIES, isPromptable, visualNeedClassificationFor, type VisualFamily } from "./catalogue.ts";
import type { StudioState } from "./state-store.ts";

export interface DashboardCounts {
  visualFamilies: number;
  productionBaseAssets: number;
  canonicalLearnerVisibleStates: number;
  required: number;
  usefulTrackedNotCatalogued: number;
  deterministicOnly: number;
  premiumHybridArtJobs: number;
  approved: number;
  outstanding: number;
  blockedReference: number;
  deferredScope: number;
  superseded: number;
}

/**
 * Real, currently-tracked USEFUL findings from the CC-11.7 audit that are
 * NOT modelled as full catalogue assets (task brief §5: "USEFUL assets
 * may enter a secondary production queue... do not inflate the catalogue
 * with decorative imagery"). See reports/instructional-visuals/
 * unit202-comprehensive-visual-audit.md for the full reasoning behind
 * each one -- this count exists so the dashboard never implies these
 * findings were forgotten just because they have no asset object.
 */
export const USEFUL_TRACKED_NOT_CATALOGUED_COUNT = 10;

export function buildDashboard(state: StudioState, families: VisualFamily[] = FAMILIES): DashboardCounts {
  const assets = allAssets(families);
  const approvedStatuses = new Set(["APPROVED", "SAVED"]);
  const supersededStatuses = new Set(["SUPERSEDED"]);

  let required = 0;
  let deterministicOnly = 0;
  let premiumHybridArtJobs = 0;
  let approved = 0;
  let outstanding = 0;
  let blockedReference = 0;
  let deferredScope = 0;
  let superseded = 0;

  for (const asset of assets) {
    const classification = visualNeedClassificationFor(asset);
    if (classification === "REQUIRED") required += 1;
    if (classification === "BLOCKED_REFERENCE") blockedReference += 1;
    if (classification === "DEFERRED_SCOPE") deferredScope += 1;

    if (asset.productionClass === "DETERMINISTIC_TECHNICAL") deterministicOnly += 1;
    if (isPromptable(asset) && asset.productionClass !== "DETERMINISTIC_TECHNICAL") premiumHybridArtJobs += 1;

    const status = state[asset.assetId]?.status;
    if (status && approvedStatuses.has(status)) approved += 1;
    else if (isPromptable(asset)) outstanding += 1;
    if (status && supersededStatuses.has(status)) superseded += 1;
  }

  return {
    visualFamilies: families.length,
    productionBaseAssets: assets.length,
    canonicalLearnerVisibleStates: assets.reduce((sum, asset) => sum + asset.canonicalStates.length, 0),
    required,
    usefulTrackedNotCatalogued: USEFUL_TRACKED_NOT_CATALOGUED_COUNT,
    deterministicOnly,
    premiumHybridArtJobs,
    approved,
    outstanding,
    blockedReference,
    deferredScope,
    superseded,
  };
}
