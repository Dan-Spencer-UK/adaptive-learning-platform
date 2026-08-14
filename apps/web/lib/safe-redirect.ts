const DEFAULT_REDIRECT = "/learn";

/**
 * Constrains a `next` redirect target to an internal relative path.
 * Rejects absolute URLs, protocol-relative URLs (`//evil.example`) and
 * anything that isn't a same-origin path, so a `next` query/form value can
 * never send a signed-in learner to an arbitrary external destination.
 */
export function safeRedirectPath(
  next: string | null | undefined,
  fallback: string = DEFAULT_REDIRECT,
): string {
  if (!next) {
    return fallback;
  }

  if (!next.startsWith("/") || next.startsWith("//") || next.includes("://")) {
    return fallback;
  }

  return next;
}
