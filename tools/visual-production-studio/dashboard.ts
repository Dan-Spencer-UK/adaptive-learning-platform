/**
 * CC-11.7 §19 / CC-11.7A §21: the Studio's dashboard counts, computed
 * mechanically from catalogue + status data -- never a single misleading
 * total. Every number here is derived, never separately authored, so the
 * dashboard can never silently drift from the real catalogue.
 *
 * CC-11.7A: REQUIRED and USEFUL are tracked as fully independent buckets
 * throughout (task brief §6/§21/§22: "Do not let USEFUL assets make
 * REQUIRED progress appear incomplete"). A DEFERRED_SCOPE asset (currently
 * only trigonometry, which has no lesson to attach to yet) is counted in
 * `deferredScope` and deliberately excluded from both the required and
 * useful art-job/approved/outstanding buckets -- it is neither.
 */

import { allAssets, FAMILIES, isPromptable, visualNeedClassificationFor, type VisualFamily } from "./catalogue.ts";
import type { StudioState } from "./state-store.ts";

export interface DashboardCounts {
  visualFamilies: number;
  productionBaseAssets: number;
  canonicalLearnerVisibleStates: number;

  required: number;
  useful: number;

  requiredPremiumHybridArtJobs: number;
  usefulPremiumHybridArtJobs: number;
  /** requiredPremiumHybridArtJobs + usefulPremiumHybridArtJobs -- kept for backward compatibility with the CC-11.7 single-total field name. */
  premiumHybridArtJobs: number;

  deterministicOnly: number;
  blockedReference: number;
  blockedReferenceRequired: number;
  blockedReferenceUseful: number;
  deferredScope: number;
  superseded: number;

  /** approvedRequired + approvedUseful -- kept for backward compatibility with the CC-11.7 single-total field name. */
  approved: number;
  /** outstandingRequired + outstandingUseful -- kept for backward compatibility with the CC-11.7 single-total field name. */
  outstanding: number;
  approvedRequired: number;
  outstandingRequired: number;
  approvedUseful: number;
  outstandingUseful: number;

  /**
   * CC-11.7A §25 acceptance criterion: all 10 CC-11.7 USEFUL findings are
   * now materialised as live catalogue assets (`needOverride: "USEFUL"`),
   * so this historical count is 0. Kept (rather than removed) so a
   * dashboard/report consumer written against the CC-11.7 field name does
   * not silently read `undefined` -- see `useful` for the live, current
   * count of materialised USEFUL assets instead.
   */
  usefulTrackedNotCatalogued: number;
}

export const USEFUL_TRACKED_NOT_CATALOGUED_COUNT = 0;

export function buildDashboard(state: StudioState, families: VisualFamily[] = FAMILIES): DashboardCounts {
  const assets = allAssets(families);
  const approvedStatuses = new Set(["APPROVED", "SAVED"]);
  const supersededStatuses = new Set(["SUPERSEDED"]);

  let required = 0;
  let useful = 0;
  let deterministicOnly = 0;
  let requiredPremiumHybridArtJobs = 0;
  let usefulPremiumHybridArtJobs = 0;
  let approvedRequired = 0;
  let outstandingRequired = 0;
  let approvedUseful = 0;
  let outstandingUseful = 0;
  let blockedReference = 0;
  let blockedReferenceRequired = 0;
  let blockedReferenceUseful = 0;
  let deferredScope = 0;
  let superseded = 0;

  for (const asset of assets) {
    const classification = visualNeedClassificationFor(asset);
    // "Ultimately REQUIRED/USEFUL" independent of current reference-blocked
    // status (task brief §15: an item can be simultaneously USEFUL and
    // currently BLOCKED_REFERENCE) -- read from `needOverride` directly,
    // never from `classification` alone, so a blocked USEFUL asset is
    // never miscounted as REQUIRED.
    const isUltimatelyUseful = asset.needOverride === "USEFUL";
    const isUltimatelyRequired = !isUltimatelyUseful && classification !== "DEFERRED_SCOPE";

    if (classification === "REQUIRED") required += 1;
    if (classification === "USEFUL") useful += 1;
    if (classification === "DEFERRED_SCOPE") deferredScope += 1;
    if (classification === "BLOCKED_REFERENCE") {
      blockedReference += 1;
      if (isUltimatelyUseful) blockedReferenceUseful += 1;
      else blockedReferenceRequired += 1;
    }

    if (asset.productionClass === "DETERMINISTIC_TECHNICAL") deterministicOnly += 1;

    const isArtJob = isPromptable(asset) && asset.productionClass !== "DETERMINISTIC_TECHNICAL";
    const status = state[asset.assetId]?.status;
    const isApproved = Boolean(status && approvedStatuses.has(status));
    if (status && supersededStatuses.has(status)) superseded += 1;

    if (isArtJob) {
      if (isUltimatelyUseful) {
        usefulPremiumHybridArtJobs += 1;
        if (isApproved) approvedUseful += 1;
        else outstandingUseful += 1;
      } else if (isUltimatelyRequired) {
        requiredPremiumHybridArtJobs += 1;
        if (isApproved) approvedRequired += 1;
        else outstandingRequired += 1;
      }
    }
  }

  return {
    visualFamilies: families.length,
    productionBaseAssets: assets.length,
    canonicalLearnerVisibleStates: assets.reduce((sum, asset) => sum + asset.canonicalStates.length, 0),
    required,
    useful,
    requiredPremiumHybridArtJobs,
    usefulPremiumHybridArtJobs,
    premiumHybridArtJobs: requiredPremiumHybridArtJobs + usefulPremiumHybridArtJobs,
    deterministicOnly,
    blockedReference,
    blockedReferenceRequired,
    blockedReferenceUseful,
    deferredScope,
    superseded,
    approved: approvedRequired + approvedUseful,
    outstanding: outstandingRequired + outstandingUseful,
    approvedRequired,
    outstandingRequired,
    approvedUseful,
    outstandingUseful,
    usefulTrackedNotCatalogued: USEFUL_TRACKED_NOT_CATALOGUED_COUNT,
  };
}
