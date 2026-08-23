/**
 * CC-11.5 §16: NEXT RECOMMENDED ASSET -- ranks by priority (1), reference
 * readiness (2), then status (3), exactly the order the task brief lists.
 * Pure function so the ranking rule itself is directly unit-testable.
 */

import { CATALOGUE, type CatalogueEntry, type Priority } from "./catalogue.ts";
import type { StudioState } from "./state-store.ts";

const PRIORITY_RANK: Record<Priority, number> = { P0: 0, P1: 1, P2: 2 };

/** Statuses that still represent open production work -- a candidate for "next". */
const ACTIONABLE_STATUSES = new Set(["READY_TO_PROMPT", "IN_ART_SESSION", "IMAGE_PASTED", "NEEDS_REVIEW"]);

export function pickNextAsset(catalogue: CatalogueEntry[] = CATALOGUE, state: StudioState): CatalogueEntry | null {
  const candidates = catalogue.filter((entry) => {
    if (entry.referenceReadiness !== "READY") return false;
    const status = state[entry.assetId]?.status;
    return status !== undefined && ACTIONABLE_STATUSES.has(status);
  });

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => {
    const priorityDelta = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    if (priorityDelta !== 0) return priorityDelta;
    return a.sequence - b.sequence;
  });

  return candidates[0] ?? null;
}
