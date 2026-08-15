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
      <Stack.Screen name="dev-proof" options={{ title: "Foundation diagnostics" }} />
    </Stack>
  );
}
