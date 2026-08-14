import { redirect } from "next/navigation";
import { Container } from "@alp/ui";

import { signOutAction } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Learn — Adaptive Learning Platform",
};

/**
 * CC-03 protected-route proof. This is infrastructure evidence, not the
 * learner product: it exists to demonstrate that an authenticated session
 * is required and available server-side, and that the signed-in learner's
 * own profile can be read under RLS. Lessons, practice, evidence and
 * progress belong to later CC packages.
 */
export default async function LearnPage() {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims) {
    redirect("/sign-in?next=/learn");
  }

  const { sub: userId, email } = claimsData.claims;

  const { data: profile } = await supabase
    .from("learner_profiles")
    .select("id, created_at")
    .eq("id", userId)
    .single();

  return (
    <main id="main-content" className="flex-1">
      <Container>
        <div className="flex flex-col gap-8 py-10">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted">
              Adaptive Learning Platform
            </p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              You&apos;re signed in
            </h1>
          </div>

          <section
            aria-labelledby="session-heading"
            className="flex flex-col gap-3"
          >
            <h2 id="session-heading" className="text-lg font-semibold">
              Session proof (CC-03)
            </h2>
            <ul className="flex flex-col gap-2">
              <li className="rounded-md border border-border bg-surface px-4 py-3 text-sm leading-6">
                Signed in as <strong>{email}</strong>
              </li>
              <li className="rounded-md border border-border bg-surface px-4 py-3 text-sm leading-6">
                Learner profile record:{" "}
                {profile ? (
                  <>
                    present, created{" "}
                    {new Date(profile.created_at).toLocaleString("en-GB")}
                  </>
                ) : (
                  "not found"
                )}
              </li>
            </ul>
            <p className="max-w-prose text-sm leading-6 text-muted">
              This page proves authentication, server-side session
              verification and self-owned profile access under Row Level
              Security. It is not the learner product.
            </p>
          </section>

          <form action={signOutAction}>
            <button
              type="submit"
              className="min-h-11 rounded-md border border-border px-4 py-2 text-sm font-medium"
            >
              Sign out
            </button>
          </form>
        </div>
      </Container>
    </main>
  );
}
