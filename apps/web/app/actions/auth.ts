"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

/**
 * Terminates the Supabase session server-side and redirects to sign-in.
 * Session termination happens via the Supabase Auth API (which invalidates
 * the refresh token), not merely by discarding client-side UI state.
 */
export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}
