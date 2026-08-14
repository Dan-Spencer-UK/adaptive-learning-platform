/**
 * Reads and validates the minimum application-facing Supabase environment
 * variables. Only the local Supabase URL and the publishable (anon-level)
 * key -- both safe to expose to the browser. Never read a service-role key
 * or database credential here.
 */
export function getSupabaseEnv(): { url: string; publishableKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. " +
        "Copy apps/web/.env.example to apps/web/.env.local and fill in the values " +
        "printed by `npx supabase start` (or `npx supabase status`).",
    );
  }

  return { url, publishableKey };
}
