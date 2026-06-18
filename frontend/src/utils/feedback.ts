// Offline "sound" feedback. We use expo-haptics as the tactile equivalent of
// arcade beeps — works 100% offline with zero asset files. The `sound` toggle
// in settings gates all feedback. Each game maps an action ("jump", "hit",
// "pickup", "win") to a haptic pattern.

import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export type FxKind = "jump" | "hit" | "pickup" | "win" | "tick";

export function playFx(kind: FxKind, enabled: boolean) {
  if (!enabled) return;
  if (Platform.OS === "web") return; // haptics unavailable on web preview
  try {
    switch (kind) {
      case "jump":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case "pickup":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case "hit":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case "win":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case "tick":
        Haptics.selectionAsync();
        break;
    }
  } catch {
    // swallow — feedback is non-critical
  }
}
