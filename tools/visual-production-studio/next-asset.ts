/**
 * CC-11.5/CC-11.6 §14: NEXT RECOMMENDED ASSET -- ranks by priority (1),
 * reference readiness (2), then status (3), exactly the order the task
 * brief lists. Family-aware in the sense that mattered: a
 * REFERENCE_NOT_READY or SCOPE_CONFIRMATION_NEEDED sibling never blocks
 * an otherwise-actionable asset in the same family, because eligibility
 * is evaluated per-asset, never per-family. Pure function so the ranking
 * rule itself is directly unit-testable.
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
    const priorityDelta = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    if (priorityDelta !== 0) return priorityDelta;
    // Sequence follows family declaration order (see catalogue.ts), so this
    // tiebreak is already "sensible order within a family" for free.
    return a.sequence - b.sequence;
  });

  return candidates[0] ?? null;
}
