/**
 * CC-08: the mobile-side glue that assembles @alp/diagnostic-engine's
 * `selectNextActivity` inputs from real local state -- entirely offline
 * (task brief §21): local derived evidence (CC-07), the local recent-
 * completion record, and the locally available release's lessons. No
 * decision logic lives here or in any screen component -- this is pure
 * plumbing; the deterministic policy itself is @alp/diagnostic-engine's.
 */
import { selectNextActivity, ACTIVITY_SELECTION_POLICY_VERSION, UNIT202_ADAPTIVE_VERTICAL, type ActivityDecision } from "@alp/diagnostic-engine";

import { deriveLocalLearnerEvidence } from "@/lib/evidence-sync/derived-snapshot";
import { bundledContentReleaseId, getLocalReleaseLessons } from "@/lib/lesson-content/local-content-registry";
import { getRecentCourseCompletion } from "./recent-completion-store";

export async function computeNextCourseActivity(learnerId: string): Promise<ActivityDecision> {
  const [{ snapshot }, recentCompletionContext] = await Promise.all([
    deriveLocalLearnerEvidence(learnerId),
    getRecentCourseCompletion(learnerId),
  ]);
  const allLessons = getLocalReleaseLessons(bundledContentReleaseId());
  return selectNextActivity({
    courseDefinition: UNIT202_ADAPTIVE_VERTICAL,
    learnerEvidenceSnapshot: snapshot,
    recentCompletionContext: recentCompletionContext ?? undefined,
    availableContent: { allLessons },
    policyVersion: ACTIVITY_SELECTION_POLICY_VERSION,
  });
}
