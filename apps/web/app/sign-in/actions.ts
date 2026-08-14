"use server";

import { redirect } from "next/navigation";

import { safeRedirectPath } from "@/lib/safe-redirect";
import { isValidEmail, isValidOtpCode } from "@/lib/sign-in-validation";
import { createClient } from "@/lib/supabase/server";

import { initialSignInState, type SignInState } from "./state";

// Deliberately generic: does not reveal whether an account exists for the
// submitted address (anti-enumeration), and never surfaces the underlying
// Supabase/database error.
const GENERIC_REQUEST_ERROR =
  "We couldn't send a sign-in code right now. Please try again in a moment.";
const GENERIC_VERIFY_ERROR = "That code didn't work. Check it and try again.";
const GENERIC_SETUP_ERROR =
  "We couldn't finish signing you in. Please request a new code and try again.";

/**
 * Requests a passwordless email OTP. Always returns a generic outcome
 * message regardless of whether the address has an existing account, to
 * avoid leaking account existence.
 */
export async function requestOtp(
  prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const next = safeRedirectPath(String(formData.get("next") ?? ""));

  if (!isValidEmail(email)) {
    return {
      step: "email",
      email,
      next,
      error: "Enter a valid email address.",
      message: null,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({ email });

  if (error) {
    return {
      step: "email",
      email,
      next,
      error: GENERIC_REQUEST_ERROR,
      message: null,
    };
  }

  return {
    step: "code",
    email,
    next,
    error: null,
    message: `We sent a 6-digit code to ${email}. It expires shortly.`,
  };
}

/**
 * Verifies the emailed one-time code. On success, ensures the learner's
 * profile row exists (self-owned, RLS-mediated) and redirects into the
 * protected area.
 */
export async function verifyOtpCode(
  prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const token = String(formData.get("token") ?? "").trim();
  const next = safeRedirectPath(String(formData.get("next") ?? ""));

  if (!isValidEmail(email)) {
    return { step: "email", email: "", next, error: "Start again.", message: null };
  }

  if (!isValidOtpCode(token)) {
    return {
      step: "code",
      email,
      next,
      error: "Enter the 6-digit code from your email.",
      message: null,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error || !data.user) {
    return {
      step: "code",
      email,
      next,
      error: GENERIC_VERIFY_ERROR,
      message: null,
    };
  }

  // Client-mediated profile creation: the row is created by the now-
  // authenticated learner themselves under RLS (auth.uid() = id), not by
  // an elevated-privilege trigger on auth.users. ignoreDuplicates issues
  // INSERT ... ON CONFLICT (id) DO NOTHING, which only requires INSERT
  // privilege. Plain upsert() defaults to ON CONFLICT DO UPDATE, which
  // Postgres requires UPDATE privilege to even plan -- and
  // learner_profiles deliberately has no UPDATE grant/policy, since it
  // has no learner-mutable fields.
  //
  // A returning learner's profile already exists: DO NOTHING absorbs
  // that conflict silently at the database level (zero rows affected, no
  // error) -- so any `error` returned here is a genuine unexpected
  // failure, not routine duplicate handling, and must not be treated as
  // success.
  const { error: profileError } = await supabase
    .from("learner_profiles")
    .upsert({ id: data.user.id }, { onConflict: "id", ignoreDuplicates: true });

  if (profileError) {
    return {
      step: "email",
      email,
      next,
      error: GENERIC_SETUP_ERROR,
      message: null,
    };
  }

  redirect(next);
}

/**
 * Single entry point for the sign-in form's `useActionState` hook. Reads
 * a hidden `intent` field to dispatch to the request or verify step, so
 * the two-step UI can share one action/state pair.
 */
export async function signInAction(
  prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const intent = formData.get("intent");

  if (intent === "verify") {
    return verifyOtpCode(prevState, formData);
  }

  if (intent === "restart") {
    return { ...initialSignInState, next: prevState.next };
  }

  return requestOtp(prevState, formData);
}
