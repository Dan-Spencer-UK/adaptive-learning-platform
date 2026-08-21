/**
 * CC-08: durable, LOCAL-ONLY (never synced to the server) record of the
 * learner's most recently completed lesson -- the one piece of "what
 * just happened" context @alp/diagnostic-engine's `selectNextActivity`
 * needs beyond the pure evidence snapshot (task brief §9's
 * `recentCompletionContext`), used only to distinguish a first
 * remediation entry from a retest, and to recognise a return from
 * remediation. Reuses the existing generic `foundation_state` key-value
 * table (./storage/foundation-state.ts) rather than adding a new SQLite
 * table or Supabase migration -- this is ephemeral device convenience
 * state, not learner-owned server data (task brief §33: prefer deriving
 * state rather than adding persistence; nothing here is course POSITION
 * or mastery, both of which remain derivable from raw evidence).
 * Learner-scoped key so learner B never reads learner A's context.
 */
import { getFoundationState, setFoundationState } from "../storage/foundation-state";

export interface RecentCourseCompletion {
  readonly lessonId: string;
  readonly lessonInstanceId: string;
}

function keyFor(learnerId: string): string {
  return `course.recentCompletion.v1.${learnerId}`;
}

export async function recordRecentCourseCompletion(learnerId: string, completion: RecentCourseCompletion): Promise<void> {
  await setFoundationState(keyFor(learnerId), JSON.stringify(completion));
}

export async function getRecentCourseCompletion(learnerId: string): Promise<RecentCourseCompletion | null> {
  const raw = await getFoundationState(keyFor(learnerId));
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof (parsed as Record<string, unknown>).lessonId === "string" &&
      typeof (parsed as Record<string, unknown>).lessonInstanceId === "string"
    ) {
      return parsed as RecentCourseCompletion;
    }
    return null;
  } catch {
    // Malformed/legacy value -- fail safe to "no recent completion" rather than throwing (product invariant: never guess, never crash on local-state drift).
    return null;
  }
}
