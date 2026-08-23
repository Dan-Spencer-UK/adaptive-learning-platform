/**
 * CC-11.7 §19 / CC-11.7A §21 / CC-11.7B §12-14: the Studio's dashboard
 * counts, computed mechanically from catalogue + status data -- never a
 * single misleading total. Every number here is derived, never separately
 * authored, so the dashboard can never silently drift from the real
 * catalogue.
 *
 * CC-11.7B §12: PEDAGOGICAL NEED (REQUIRED/USEFUL/DEFERRED_SCOPE) and
 * PRODUCTION READINESS (READY/BLOCKED_REFERENCE) are two independent
 * dimensions, never conflated. A REQUIRED asset that is currently
 * reference-blocked is still REQUIRED -- it appears in `requiredTotal`
 * AND `requiredBlocked`, never removed from the REQUIRED bucket. The same
 * applies to USEFUL. This dashboard tracks both dimensions explicitly for
 * both REQUIRED and USEFUL throughout.
 */

import { allAssets, FAMILIES, isPromptable, isReferenceBlocked, visualNeedClassificationFor, type VisualFamily } from "./catalogue.ts";
import type { StudioState } from "./state-store.ts";

export interface DashboardCounts {
  visualFamilies: number;
  productionBaseAssets: number;
  canonicalLearnerVisibleStates: number;

  requiredTotal: number;
  requiredReady: number;
  requiredBlocked: number;

  usefulTotal: number;
  usefulReady: number;
  usefulBlocked: number;

  requiredArtJobsTotal: number;
  requiredArtJobsReady: number;
  requiredArtJobsBlocked: number;
  requiredArtJobsApproved: number;

  usefulArtJobsTotal: number;
  usefulArtJobsReady: number;
  usefulArtJobsBlocked: number;
  usefulArtJobsApproved: number;

  deterministicOnly: number;
  deferredScope: number;
  superseded: number;

  /**
   * CC-11.7B §14: true only when EVERY REQUIRED premium/hybrid art job is
   * approved AND the REQUIRED-blocked count is exactly 0. USEFUL status
   * never affects this value in either direction (§6/§14: "USEFUL assets
   * remain independent").
   */
  requiredVisualProductionComplete: boolean;

  // --- Backward-compatible aliases (CC-11.7/CC-11.7A field names) -------
  /** @deprecated use requiredTotal */
  required: number;
  /** @deprecated use usefulTotal */
  useful: number;
  /** @deprecated use requiredArtJobsTotal */
  requiredPremiumHybridArtJobs: number;
  /** @deprecated use usefulArtJobsTotal */
  usefulPremiumHybridArtJobs: number;
  /** @deprecated use requiredArtJobsTotal + usefulArtJobsTotal */
  premiumHybridArtJobs: number;
  /** @deprecated use requiredBlocked + usefulBlocked */
  blockedReference: number;
  /** @deprecated use requiredBlocked */
  blockedReferenceRequired: number;
  /** @deprecated use usefulBlocked */
  blockedReferenceUseful: number;
  /** @deprecated use requiredArtJobsApproved + usefulArtJobsApproved */
  approved: number;
  /** @deprecated use (requiredArtJobsTotal - requiredArtJobsApproved) + (usefulArtJobsTotal - usefulArtJobsApproved) */
  outstanding: number;
  /** @deprecated use requiredArtJobsApproved */
  approvedRequired: number;
  /** @deprecated use requiredArtJobsTotal - requiredArtJobsApproved */
  outstandingRequired: number;
  /** @deprecated use usefulArtJobsApproved */
  approvedUseful: number;
  /** @deprecated use usefulArtJobsTotal - usefulArtJobsApproved */
  outstandingUseful: number;
  /** @deprecated always 0 since CC-11.7A -- see USEFUL_TRACKED_NOT_CATALOGUED_COUNT */
  usefulTrackedNotCatalogued: number;
}

/**
 * CC-11.7A §25: all 10 CC-11.7 USEFUL findings are now materialised as
 * live catalogue assets, so this historical count is permanently 0.
 */
export const USEFUL_TRACKED_NOT_CATALOGUED_COUNT = 0;

export function buildDashboard(state: StudioState, families: VisualFamily[] = FAMILIES): DashboardCounts {
  const assets = allAssets(families);
  const approvedStatuses = new Set(["APPROVED", "SAVED"]);
  const supersededStatuses = new Set(["SUPERSEDED"]);

  let requiredTotal = 0;
  let requiredReady = 0;
  let requiredBlocked = 0;
  let usefulTotal = 0;
  let usefulReady = 0;
  let usefulBlocked = 0;
  let deterministicOnly = 0;
  let deferredScope = 0;
  let superseded = 0;

  let requiredArtJobsTotal = 0;
  let requiredArtJobsReady = 0;
  let requiredArtJobsBlocked = 0;
  let requiredArtJobsApproved = 0;
  let usefulArtJobsTotal = 0;
  let usefulArtJobsReady = 0;
  let usefulArtJobsBlocked = 0;
  let usefulArtJobsApproved = 0;

  for (const asset of assets) {
    const classification = visualNeedClassificationFor(asset); // REQUIRED | USEFUL | DEFERRED_SCOPE | NOT_NEEDED -- pedagogical need only
    const blocked = isReferenceBlocked(asset); // production readiness only, orthogonal

    if (classification === "REQUIRED") {
      requiredTotal += 1;
      if (blocked) requiredBlocked += 1;
      else requiredReady += 1;
    } else if (classification === "USEFUL") {
      usefulTotal += 1;
      if (blocked) usefulBlocked += 1;
      else usefulReady += 1;
    } else if (classification === "DEFERRED_SCOPE") {
      deferredScope += 1;
    }

    if (asset.productionClass === "DETERMINISTIC_TECHNICAL") deterministicOnly += 1;

    // An "art job" is a real, non-deterministic image-generation job this
    // asset represents -- deterministic-only and promptable:false assets
    // never count here, regardless of pedagogical need or readiness.
    // DEFERRED_SCOPE assets are excluded from both art-job buckets (§14:
    // "no required shared-base audit remains unresolved" implies a
    // deferred asset is neither REQUIRED-complete nor USEFUL-complete).
    const isArtJobCandidate = asset.productionClass !== "DETERMINISTIC_TECHNICAL" && asset.promptable !== false && classification !== "DEFERRED_SCOPE";
    if (!isArtJobCandidate) continue;

    const status = state[asset.assetId]?.status;
    const isApproved = Boolean(status && approvedStatuses.has(status));
    if (status && supersededStatuses.has(status)) superseded += 1;

    if (classification === "REQUIRED") {
      requiredArtJobsTotal += 1;
      if (blocked) requiredArtJobsBlocked += 1;
      else requiredArtJobsReady += 1;
      if (isApproved) requiredArtJobsApproved += 1;
    } else if (classification === "USEFUL") {
      usefulArtJobsTotal += 1;
      if (blocked) usefulArtJobsBlocked += 1;
      else usefulArtJobsReady += 1;
      if (isApproved) usefulArtJobsApproved += 1;
    }
  }

  // isPromptable() double-checked here only as a cross-validation that a
  // "ready" art job is genuinely promptable -- the two computations must
  // always agree, or a future catalogue field is inconsistent.
  const readyArtJobsViaIsPromptable = assets.filter((a) => isPromptable(a) && a.productionClass !== "DETERMINISTIC_TECHNICAL" && visualNeedClassificationFor(a) !== "DEFERRED_SCOPE").length;
  if (readyArtJobsViaIsPromptable !== requiredArtJobsReady + usefulArtJobsReady) {
    throw new Error(`dashboard readiness accounting mismatch: isPromptable() found ${readyArtJobsViaIsPromptable} ready art jobs, but classification+blocked accounting found ${requiredArtJobsReady + usefulArtJobsReady}`);
  }

  const requiredVisualProductionComplete = requiredBlocked === 0 && requiredArtJobsTotal === requiredArtJobsApproved;

  return {
    visualFamilies: families.length,
    productionBaseAssets: assets.length,
    canonicalLearnerVisibleStates: assets.reduce((sum, asset) => sum + asset.canonicalStates.length, 0),

    requiredTotal,
    requiredReady,
    requiredBlocked,
    usefulTotal,
    usefulReady,
    usefulBlocked,

    requiredArtJobsTotal,
    requiredArtJobsReady,
    requiredArtJobsBlocked,
    requiredArtJobsApproved,
    usefulArtJobsTotal,
    usefulArtJobsReady,
    usefulArtJobsBlocked,
    usefulArtJobsApproved,

    deterministicOnly,
    deferredScope,
    superseded,

    requiredVisualProductionComplete,

    // Backward-compatible aliases
    required: requiredTotal,
    useful: usefulTotal,
    requiredPremiumHybridArtJobs: requiredArtJobsTotal,
    usefulPremiumHybridArtJobs: usefulArtJobsTotal,
    premiumHybridArtJobs: requiredArtJobsTotal + usefulArtJobsTotal,
    blockedReference: requiredBlocked + usefulBlocked,
    blockedReferenceRequired: requiredBlocked,
    blockedReferenceUseful: usefulBlocked,
    approved: requiredArtJobsApproved + usefulArtJobsApproved,
    outstanding: requiredArtJobsTotal - requiredArtJobsApproved + (usefulArtJobsTotal - usefulArtJobsApproved),
    approvedRequired: requiredArtJobsApproved,
    outstandingRequired: requiredArtJobsTotal - requiredArtJobsApproved,
    approvedUseful: usefulArtJobsApproved,
    outstandingUseful: usefulArtJobsTotal - usefulArtJobsApproved,
    usefulTrackedNotCatalogued: USEFUL_TRACKED_NOT_CATALOGUED_COUNT,
  };
}
