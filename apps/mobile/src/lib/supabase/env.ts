/**
 * Reads and validates the minimum client-facing Supabase environment
 * variables for the native app. Only the Supabase URL and the publishable
 * (anon-level) key -- both safe to bundle into the client. Never read a
 * service-role key or database credential here.
 *
 * Expo bundles any `EXPO_PUBLIC_*` variable into the client JS bundle
 * (https://docs.expo.dev/guides/environment-variables/); this is the same
 * trust boundary as the web client's `NEXT_PUBLIC_*` variables, not a
 * secret-storage mechanism.
 */
export function getSupabaseEnv(): { url: string; publishableKey: string } {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY. " +
        "Copy apps/mobile/.env.example to apps/mobile/.env.local and fill in the values " +
        "printed by `npx supabase start` (or `npx supabase status`). See apps/mobile/README.md " +
        "for the Android-emulator/physical-device local-connectivity notes.",
    );
  }

  return { url, publishableKey };
}
