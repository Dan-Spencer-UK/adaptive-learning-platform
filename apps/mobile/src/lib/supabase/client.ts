/**
 * Native Supabase client foundation. Separate from the web client
 * (apps/web/lib/supabase/*) because the platform requirements genuinely
 * differ: the web client uses browser-cookie session handling via
 * `@supabase/ssr`; the native client uses `LargeSecureStore`
 * (OS-secure-storage-backed) session persistence via plain
 * `@supabase/supabase-js`, and manual AppState-driven auto-refresh
 * lifecycle management, per current official Supabase Expo/React Native
 * guidance. Only the publishable (anon-level) client key is used here --
 * never a service-role key. See docs/architecture/MOBILE-ARCHITECTURE.md §3.
 */
import type { Database } from "@alp/domain";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { AppState, type AppStateStatus } from "react-native";

import { getSupabaseEnv } from "./env";
import { LargeSecureStore } from "./large-secure-store";

let client: ReturnType<typeof createSupabaseClient<Database>> | null = null;
let appStateListenerRegistered = false;

/**
 * Returns the singleton native Supabase client, creating it on first call.
 * Also registers the AppState-driven auto-refresh listener exactly once,
 * per Supabase's guidance ("make sure you register this only once").
 */
export function getSupabaseClient(): ReturnType<typeof createSupabaseClient<Database>> {
  if (client) {
    return client;
  }

  const { url, publishableKey } = getSupabaseEnv();

  client = createSupabaseClient<Database>(url, publishableKey, {
    auth: {
      storage: new LargeSecureStore(),
      autoRefreshToken: true,
      persistSession: true,
      // No URL-based session detection on native -- there is no browser
      // location bar carrying auth tokens.
      detectSessionInUrl: false,
    },
  });

  registerAppStateAutoRefresh(client);

  return client;
}

function registerAppStateAutoRefresh(
  supabase: ReturnType<typeof createSupabaseClient<Database>>,
): void {
  if (appStateListenerRegistered) {
    return;
  }
  appStateListenerRegistered = true;

  AppState.addEventListener("change", (state: AppStateStatus) => {
    if (state === "active") {
      void supabase.auth.startAutoRefresh();
    } else {
      void supabase.auth.stopAutoRefresh();
    }
  });
}
