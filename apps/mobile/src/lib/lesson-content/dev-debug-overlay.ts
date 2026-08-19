/**
 * DEV-ONLY debug-overlay flag (task brief §38: "showing step ID/type in
 * an optional debug overlay"). Persisted through the same
 * `foundation_state` key-value store every other piece of local state
 * uses -- no new persistence mechanism. Toggled from
 * (app)/dev-lesson-qa.tsx; read by the production Lesson Player screen
 * only to decide whether to render a small debug badge -- the flag
 * itself carries no learner-facing meaning and defaults to off.
 */
import { useEffect, useState } from "react";
import { getFoundationState } from "../storage/foundation-state.ts";

export const DEV_LESSON_DEBUG_OVERLAY_KEY = "dev.lesson_debug_overlay";

/** Polls the flag on mount and on a short interval -- simple and sufficient for a dev-only diagnostic toggle (no need for a full pub/sub store for this). */
export function useLessonDebugOverlay(): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function check(): Promise<void> {
      const raw = await getFoundationState(DEV_LESSON_DEBUG_OVERLAY_KEY);
      if (cancelled) return;
      setEnabled(raw === "true");
    }
    void check();
    const interval = setInterval(() => void check(), 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return enabled;
}
