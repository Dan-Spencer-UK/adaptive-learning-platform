/**
 * CC-07: derived state -> `LearnerEvidenceSnapshot` (the lesson
 * assembler's input, owned by @alp/learning-engine since CC-06B/D).
 *
 * The snapshot is a sparse projection: a capability/family with no
 * derivation is simply absent, which the assembler already treats as
 * NOT_ASSESSED (WP1.3 §39.1/§53 -- epistemically honest and cheap).
 *
 * Retrieval dueness is a SCHEDULING decision this package never makes
 * (task brief §36): the caller passes any currently-due tags/capability
 * ids through unchanged; the default is "nothing due".
 */

import type { LearnerEvidenceSnapshot } from "@alp/learning-engine";

import type { DerivedLearnerState } from "./types.ts";

export function toLearnerEvidenceSnapshot(
  derived: DerivedLearnerState,
  retrieval?: {
    readonly retrievalDueTags?: ReadonlySet<string>;
    readonly retrievalDueCapabilityIds?: ReadonlySet<string>;
  },
): LearnerEvidenceSnapshot {
  return {
    learnerId: derived.learnerId,
    capabilityStatus: new Map(derived.capabilities.map((c) => [c.capabilityId, c.state])),
    familyStatus: new Map(derived.families.map((f) => [f.assertionFamilyId, f.state])),
    misconceptionsEvidenced: new Set(derived.misconceptions.filter((m) => m.currentlyEvidenced).map((m) => m.misconceptionId)),
    retrievalDueTags: new Set(retrieval?.retrievalDueTags ?? []),
    retrievalDueCapabilityIds: new Set(retrieval?.retrievalDueCapabilityIds ?? []),
  };
}
