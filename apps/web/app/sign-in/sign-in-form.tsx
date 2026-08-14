"use client";

import { useActionState } from "react";

import { signInAction } from "./actions";
import { initialSignInState, type SignInState } from "./state";

const buttonClassName =
  "min-h-11 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-60";
const linkButtonClassName =
  "min-h-11 text-sm underline underline-offset-2 disabled:opacity-60";
const inputClassName =
  "min-h-11 rounded-md border border-border bg-background px-3 py-2 text-base outline-none focus-visible:outline-2 focus-visible:outline-focus";

export function SignInForm({ next }: { readonly next: string }) {
  const [state, formAction, isPending] = useActionState<SignInState, FormData>(
    signInAction,
    { ...initialSignInState, next },
  );

  const errorId = state.step === "email" ? "email-error" : "code-error";

  return (
    <div className="flex flex-col gap-6">
      {state.step === "email" ? (
        <form action={formAction} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              defaultValue={state.email}
              aria-describedby={state.error ? errorId : undefined}
              aria-invalid={state.error ? true : undefined}
              className={inputClassName}
            />
          </div>
          <input type="hidden" name="next" value={state.next} />
          <button type="submit" disabled={isPending} className={buttonClassName}>
            {isPending ? "Sending code…" : "Send code"}
          </button>
        </form>
      ) : (
        <form action={formAction} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-2">
            <label htmlFor="token" className="text-sm font-medium">
              6-digit code
            </label>
            <input
              id="token"
              name="token"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              autoComplete="one-time-code"
              required
              aria-describedby={state.error ? errorId : "code-hint"}
              aria-invalid={state.error ? true : undefined}
              className={`${inputClassName} tracking-[0.3em]`}
            />
            <p id="code-hint" className="text-sm text-muted">
              Sent to {state.email}.
            </p>
          </div>
          <input type="hidden" name="intent" value="verify" />
          <input type="hidden" name="email" value={state.email} />
          <input type="hidden" name="next" value={state.next} />
          <button type="submit" disabled={isPending} className={buttonClassName}>
            {isPending ? "Verifying…" : "Verify and sign in"}
          </button>
        </form>
      )}

      <div aria-live="polite" className="flex flex-col gap-2">
        {state.error ? (
          <p id={errorId} role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">
            {state.error}
          </p>
        ) : null}
        {state.message ? (
          <p role="status" className="text-sm text-muted">
            {state.message}
          </p>
        ) : null}
      </div>

      {state.step === "code" ? (
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <form action={formAction}>
            <input type="hidden" name="email" value={state.email} />
            <input type="hidden" name="next" value={state.next} />
            <button type="submit" disabled={isPending} className={linkButtonClassName}>
              Resend code
            </button>
          </form>
          <form action={formAction}>
            <input type="hidden" name="intent" value="restart" />
            <button type="submit" disabled={isPending} className={linkButtonClassName}>
              Use a different email
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
