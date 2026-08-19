import { Stack } from "expo-router";

import { color } from "@/lib/tokens";

export default function LearnLayout(): React.JSX.Element {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: color.surface },
        headerTintColor: color.text,
        contentStyle: { backgroundColor: color.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Learn" }} />
      <Stack.Screen name="[family]/index" options={{ title: "Lesson" }} />
      <Stack.Screen name="[family]/practice" options={{ title: "Practice" }} />
      <Stack.Screen name="lesson-player" options={{ title: "Ohm's Law", headerShown: false }} />
    </Stack>
  );
}
