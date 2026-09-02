/**
 * CC-19A section 21: PROFILE B (DEGRADED_NO_ASSESSMENT) is produced ONLY by
 * mechanically filtering the frozen PROFILE A ledger -- never hand-authored
 * as a separate interpretation.
 */

import type { CC19AProposal } from "./cc19a-types.ts";

export function filterToProfile(proposals: readonly CC19AProposal[], profile: "FULL_PUBLIC" | "DEGRADED_NO_ASSESSMENT"): CC19AProposal[] {
  return proposals.filter((p) => p.layerB.profileEligibility.includes(profile));
}
