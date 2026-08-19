import { Stack } from "expo-router";

import { color } from "@/lib/tokens";

export default function AppGroupLayout(): React.JSX.Element {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: color.surface },
        headerTintColor: color.text,
        contentStyle: { backgroundColor: color.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Adaptive Learning Platform" }} />
      <Stack.Screen name="learn" options={{ headerShown: false }} />
      <Stack.Screen name="dev-proof" options={{ title: "Foundation diagnostics" }} />
      <Stack.Screen name="dev-proving-visuals" options={{ title: "Proving-slice visual QA" }} />
      <Stack.Screen name="dev-lesson-qa" options={{ title: "Lesson Player QA" }} />
    </Stack>
  );
}
