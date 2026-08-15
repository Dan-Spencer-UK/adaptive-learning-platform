/**
 * Native auth/session foundation. Preserves the existing product
 * direction (passwordless email one-time-code, see
 * docs/governance/PROJECT-PLAYBOOK.md §7.11-7.12 and the web client's
 * `apps/web/app/sign-in`) using the local Supabase Auth email-OTP flow --
 * the same mechanism already proven for the web client, not a new
 * authentication method. Session persistence uses `LargeSecureStore`
 * (see ../supabase/large-secure-store.ts), not cookies.
 *
 * Scope is deliberately FOUNDATION only: email OTP sign-in/verify/sign-out.
 * No Apple/Google sign-in, MFA, account management or onboarding -- see
 * docs/architecture/evidence/CC-04N-MOBILE-FOUNDATION-EVIDENCE.md.
 */
import type { Session } from "@supabase/supabase-js";
import { createContext, type PropsWithChildren, useContext, useEffect, useState } from "react";

import { getSupabaseClient } from "../supabase/client";

type SessionContextValue = {
  readonly session: Session | null;
  readonly isLoading: boolean;
  readonly requestOtp: (email: string) => Promise<{ error: string | null }>;
  readonly verifyOtp: (email: string, code: string) => Promise<{ error: string | null }>;
  readonly signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: PropsWithChildren): React.JSX.Element {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseClient();
    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (!cancelled) {
        setSession(data.session);
        setIsLoading(false);
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const value: SessionContextValue = {
    session,
    isLoading,
    requestOtp: async (email: string) => {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signInWithOtp({ email });
      return { error: error?.message ?? null };
    },
    verifyOtp: async (email: string, code: string) => {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
      return { error: error?.message ?? null };
    },
    signOut: async () => {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
    },
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return ctx;
}
