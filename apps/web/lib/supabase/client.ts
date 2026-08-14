import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@alp/domain";

import { getSupabaseEnv } from "./env";

/**
 * Supabase client for Client Components running in the browser.
 * createBrowserClient uses a singleton internally, so it is safe to call
 * this repeatedly.
 */
export function createClient() {
  const { url, publishableKey } = getSupabaseEnv();

  return createBrowserClient<Database>(url, publishableKey);
}
