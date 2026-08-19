/**
 * The Lesson Player's haptic vocabulary (MOBILE-UX-ENGINEERING-STANDARD.md
 * §4's minimum semantic categories): one semantic name per event kind, so
 * the same event always produces the same haptic (never per-screen ad
 * hoc calls to expo-haptics directly) and haptics degrade silently where
 * unsupported (expo-haptics itself already resolves to a no-op on
 * unsupported platforms; this wrapper additionally swallows any
 * rejection so a haptics failure can never interrupt a learner action).
 * Haptics are never the only feedback channel -- every caller pairs this
 * with a visible/accessible state change (FeedbackPanel etc.).
 */
import * as Haptics from "expo-haptics";

export type HapticEvent = "selection" | "confirmation" | "correct" | "incorrect" | "milestone";

async function safe(action: () => Promise<void>): Promise<void> {
  try {
    await action();
  } catch {
    // Haptics are enhancement, never load-bearing -- silently degrade.
  }
}

export function triggerHaptic(event: HapticEvent): void {
  switch (event) {
    case "selection":
      void safe(() => Haptics.selectionAsync());
      return;
    case "confirmation":
      void safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
      return;
    case "correct":
      void safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
      return;
    case "incorrect":
      void safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
      return;
    case "milestone":
      void safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
      return;
  }
}
