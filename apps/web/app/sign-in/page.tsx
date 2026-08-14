import { redirect } from "next/navigation";
import { Container } from "@alp/ui";

import { safeRedirectPath } from "@/lib/safe-redirect";
import { createClient } from "@/lib/supabase/server";

import { SignInForm } from "./sign-in-form";

export const metadata = {
  title: "Sign in — Adaptive Learning Platform",
};

export default async function SignInPage({
  searchParams,
}: {
  readonly searchParams: Promise<{ next?: string }>;
}) {
  const { next: rawNext } = await searchParams;
  const next = safeRedirectPath(rawNext);

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims) {
    redirect(next);
  }

  return (
    <main id="main-content" className="flex-1">
      <Container>
        <div className="flex flex-col gap-8 py-10">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted">
              Adaptive Learning Platform
            </p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Sign in
            </h1>
            <p className="max-w-prose text-base leading-7 text-muted">
              Enter your email address and we&apos;ll send you a one-time
              6-digit code. No password required.
            </p>
          </div>

          <SignInForm next={next} />
        </div>
      </Container>
    </main>
  );
}
