/**
 * CC-11.5/CC-11.6 §14 / CC-11.7A §5/§23: NEXT RECOMMENDED ASSET -- ranks by
 * REQUIRED-before-USEFUL (1), priority (2), reference readiness (3), then
 * status (4). Task brief §5/§23: "Default recommendation order: 1.
 * REQUIRED P0 ready assets 2. REQUIRED P1 3. REQUIRED P2 4. USEFUL
 * P0/P1/P2 as appropriate" -- a USEFUL asset is never recommended ahead of
 * an actionable REQUIRED one, regardless of relative priority label.
 * Family-aware in the sense that mattered: a REFERENCE_NOT_READY or
 * SCOPE_CONFIRMATION_NEEDED sibling never blocks an otherwise-actionable
 * asset in the same family, because eligibility is evaluated per-asset,
 * never per-family. Pure function so the ranking rule itself is directly
 * unit-testable.
 */

import { allAssets, FAMILIES, type Priority, type VisualAsset, type VisualFamily } from "./catalogue.ts";
import type { StudioState } from "./state-store.ts";

const PRIORITY_RANK: Record<Priority, number> = { P0: 0, P1: 1, P2: 2 };

/** Statuses that still represent open production work -- a candidate for "next". */
const ACTIONABLE_STATUSES = new Set(["READY_TO_PROMPT", "IN_ART_SESSION", "IMAGE_PASTED", "NEEDS_REVIEW"]);

export function pickNextAsset(families: VisualFamily[] = FAMILIES, state: StudioState): VisualAsset | null {
  const candidates = allAssets(families).filter((asset) => {
    if (asset.referenceReadiness !== "READY") return false;
    if (asset.needsScopeConfirmation) return false;
    if (asset.promptable === false) return false;
    const status = state[asset.assetId]?.status;
    return status !== undefined && ACTIONABLE_STATUSES.has(status);
  });

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => {
    const classificationDelta = Number(a.needOverride === "USEFUL") - Number(b.needOverride === "USEFUL");
    if (classificationDelta !== 0) return classificationDelta; // REQUIRED (false=0) before USEFUL (true=1)
    const priorityDelta = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    if (priorityDelta !== 0) return priorityDelta;
    // Sequence follows family declaration order (see catalogue.ts), so this
    // tiebreak is already "sensible order within a family" for free.
    return a.sequence - b.sequence;
  });

  return candidates[0] ?? null;
}
