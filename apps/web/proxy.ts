import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@alp/domain";

import { getSupabaseEnv } from "./lib/supabase/env";

const PROTECTED_PATH_PREFIXES = ["/learn"];
const SIGN_IN_PATH = "/sign-in";

/**
 * Next.js 16 request interceptor (the successor to `middleware.ts`).
 *
 * Refreshes the Supabase session on every request and writes the renewed
 * cookies back to both the outgoing request (so Server Components read the
 * fresh token) and the response (so the browser gets it). Server
 * Components cannot write cookies themselves, so this refresh step is
 * required -- see lib/supabase/server.ts.
 *
 * This is defence-in-depth only. The authoritative authorization check for
 * `/learn` happens again, server-side, in that route's own page component.
 *
 * This cookie-based session refresh is specific to this Next.js web client.
 * The native mobile client's session persistence is a different mechanism
 * (OS secure storage, not cookies) -- see docs/architecture/MOBILE-ARCHITECTURE.md.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const { url, publishableKey } = getSupabaseEnv();

  const supabase = createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
        Object.entries(headers).forEach(([key, headerValue]) => {
          response.headers.set(key, headerValue);
        });
      },
    },
  });

  // getClaims() verifies the JWT rather than trusting an unverified
  // session object, and (via getSession() internally) refreshes an
  // expired access token using the refresh token when needed.
  const { data } = await supabase.auth.getClaims();
  const isAuthenticated = Boolean(data?.claims);

  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED_PATH_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );

  if (isProtected && !isAuthenticated) {
    const signInUrl = new URL(SIGN_IN_PATH, request.url);
    signInUrl.searchParams.set("next", path);
    return NextResponse.redirect(signInUrl);
  }

  if (path === SIGN_IN_PATH && isAuthenticated) {
    return NextResponse.redirect(new URL("/learn", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
