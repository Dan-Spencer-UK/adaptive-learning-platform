/**
 * Root navigation boundary. Establishes the authenticated/unauthenticated
 * split required by MOBILE-ARCHITECTURE.md §Client/backend topology using
 * Expo Router's current documented `Stack.Protected` pattern
 * (https://docs.expo.dev/router/advanced/authentication/, verified
 * 2026-08-15), and keeps the splash screen visible until session
 * restoration (from LargeSecureStore, via SessionProvider) resolves --
 * proving lifecycle/session-restoration foundation (see
 * docs/architecture/MOBILE-ARCHITECTURE.md §4 and §18 in the CC-04N task).
 */
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { SessionProvider, useSession } from "@/lib/auth/session-context";
import { color } from "@/lib/tokens";

SplashScreen.preventAutoHideAsync().catch(() => {
  // Safe to ignore: only fails if already hidden/prevented, which is not
  // an error condition for this foundation.
});

export default function RootLayout(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: color.background }}>
      <SafeAreaProvider>
        <SessionProvider>
          <RootNavigator />
        </SessionProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator(): React.JSX.Element {
  const { session, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync().catch(() => {
        // Safe to ignore for the same reason as above.
      });
    }
  }, [isLoading]);

  if (isLoading) {
    // Splash screen remains visible (native splash, not this component);
    // rendering nothing here avoids a flash of empty content underneath it.
    return <></>;
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: color.background } }}>
      <Stack.Protected guard={Boolean(session)}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
    </Stack>
  );
}
