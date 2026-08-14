import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@alp/domain";

import { getSupabaseEnv } from "./env";

/**
 * Supabase client for Server Components, Server Actions and Route
 * Handlers. Always create a new client per request -- never share one
 * across requests.
 *
 * Server Components cannot write cookies, so `setAll` failures here are
 * expected and safely ignored: session refresh is instead written back to
 * the response by `proxy.ts`, which runs before this on every request.
 */
export async function createClient() {
  const { url, publishableKey } = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component render, which cannot set
          // cookies. Safe to ignore because proxy.ts refreshes and
          // persists the session on every request.
        }
      },
    },
  });
}
