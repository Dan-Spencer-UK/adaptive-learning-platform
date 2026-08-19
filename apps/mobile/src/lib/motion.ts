/**
 * Reduce-motion support (MOBILE-UX-ENGINEERING-STANDARD.md §3/§7: "the
 * reduce-motion system preference must be respected -- the app remains
 * fully usable and legible with motion minimized"). Any component that
 * animates a Lesson Player transition should consult `useReducedMotion`
 * and skip/shorten the animation rather than ignore the preference.
 */
import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (mounted) setReduced(value);
      })
      .catch(() => {
        // Platform doesn't support the query -- default to full motion.
      });

    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduced);
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return reduced;
}
