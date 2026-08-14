/**
 * Shared plain types/constants for the sign-in form and its server
 * actions. Deliberately NOT inside actions.ts: a "use server" file may
 * only export async functions, so a plain object export like
 * `initialSignInState` would be silently stripped/corrupted if imported
 * from client code through that file.
 */
export type SignInState = {
  step: "email" | "code";
  email: string;
  next: string;
  error: string | null;
  message: string | null;
};

export const initialSignInState: SignInState = {
  step: "email",
  email: "",
  next: "/learn",
  error: null,
  message: null,
};
