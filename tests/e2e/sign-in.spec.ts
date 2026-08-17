import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { expect, test } from "@playwright/test";

const execFileAsync = promisify(execFile);

// Local Supabase's email catcher (Mailpit). Real local-only infrastructure,
// not an external email provider -- see supabase/config.toml [local_smtp].
const MAILPIT_URL = process.env.MAILPIT_URL ?? "http://127.0.0.1:54324";

// Deterministic local container name: supabase_db_<project_id>, where
// project_id is fixed in supabase/config.toml. Used only to run read-only
// verification queries from the test runner (Node), never from application
// code or the browser.
const SUPABASE_DB_CONTAINER =
  process.env.SUPABASE_DB_CONTAINER ??
  "supabase_db_adaptive-learning-platform";

type MailpitSearchResponse = {
  messages: { ID: string; Created: string }[];
};

type MailpitMessage = {
  Text: string;
};

/**
 * Retrieves the numeric one-time code most recently emailed to `email` via
 * Mailpit's local REST API. Polls briefly because delivery into Mailpit,
 * while local and fast, is not perfectly synchronous with the HTTP
 * response that triggered it. Explicitly sorts by `Created` (rather than
 * trusting search-result order) so a second OTP request to the same
 * address -- as in the returning-learner flow -- reliably returns the
 * newest code, not a stale one.
 */
async function fetchLatestOtpCode(email: string): Promise<string> {
  const deadline = Date.now() + 10_000;

  while (Date.now() < deadline) {
    const searchResponse = await fetch(
      `${MAILPIT_URL}/api/v1/search?query=${encodeURIComponent(`to:${email}`)}`,
    );
    const search = (await searchResponse.json()) as MailpitSearchResponse;

    if (search.messages.length > 0) {
      const newest = [...search.messages].sort(
        (a, b) => new Date(b.Created).getTime() - new Date(a.Created).getTime(),
      )[0]!;
      const messageResponse = await fetch(
        `${MAILPIT_URL}/api/v1/message/${newest.ID}`,
      );
      const message = (await messageResponse.json()) as MailpitMessage;
      const match = /\b(\d{6})\b/.exec(message.Text);
      if (match) {
        return match[1]!;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`No OTP email arrived for ${email} within the deadline`);
}

/**
 * Counts learner_profiles rows owned by the auth user with the given
 * email, via a direct read-only query against the local Postgres
 * container. Test/verification-only: never used by application code.
 */
async function countLearnerProfileRows(email: string): Promise<number> {
  const sql = `select count(*) from public.learner_profiles lp join auth.users u on u.id = lp.id where u.email = '${email}';`;
  const { stdout } = await execFileAsync("docker", [
    "exec",
    "-i",
    SUPABASE_DB_CONTAINER,
    "psql",
    "-U",
    "postgres",
    "-d",
    "postgres",
    "-t",
    "-A",
    "-c",
    sql,
  ]);

  return Number(stdout.trim());
}

async function signInWithFreshOtp(
  page: import("@playwright/test").Page,
  email: string,
) {
  await page.getByLabel("Email address").fill(email);
  await page.getByRole("button", { name: "Send code" }).click();

  // Explicit 10s wait (vs. Playwright's 5s default) for the code step to
  // appear. Investigated 2026-08-17 after a CI-only failure on the
  // returning-learner test (which calls this helper twice per test, so is
  // more exposed to a single slow round trip than the single-call tests):
  // ruled out Supabase Auth email rate-limiting (supabase/config.toml has
  // no [auth.email.smtp] section, so `[auth.rate_limit] email_sent` does
  // not apply to the local Mailpit-based mailer this suite uses -- and 6
  // back-to-back local reproduction attempts, deliberately run to stress
  // that exact hypothesis, all passed) and ruled out cross-test state
  // leakage (playwright.config.ts sets no shared `storageState`; CI's
  // `workers: 1` means tests run serially, each with Playwright's normal
  // fresh browser context). The most plausible remaining explanation is
  // CI-runner performance variance on the Next.js dev-server Server
  // Action round trip -- not a product defect (the OTP-step visibility
  // gate itself, apps/web/app/sign-in/actions.ts's `requestOtp`, is a
  // straightforward "no error from signInWithOtp -> step: 'code'" switch
  // with no rate limiting or extra logic on a second call for the same
  // address). This value stays in the same order of magnitude as this
  // file's own `fetchLatestOtpCode` polling deadline just below.
  await expect(page.getByLabel("6-digit code")).toBeVisible({ timeout: 10_000 });

  const code = await fetchLatestOtpCode(email);
  await page.getByLabel("6-digit code").fill(code);
  await page.getByRole("button", { name: "Verify and sign in" }).click();
}

test("sign-in page renders with an accessible email form", async ({ page }) => {
  await page.goto("/sign-in");

  await expect(
    page.getByRole("heading", { level: 1, name: "Sign in" }),
  ).toBeVisible();
  await expect(page.getByLabel("Email address")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Send code" }),
  ).toBeVisible();
});

test("unauthenticated access to the protected learner route is denied", async ({
  page,
}) => {
  await page.goto("/learn");

  await expect(page).toHaveURL(/\/sign-in\?next=(%2F|\/)learn/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Sign in" }),
  ).toBeVisible();
});

test("full email OTP sign-in reaches /learn, and sign-out revokes access", async ({
  page,
}) => {
  const email = `playwright-${Date.now()}@example.test`;

  await page.goto("/sign-in");
  await signInWithFreshOtp(page, email);

  await expect(page).toHaveURL(/\/learn$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "You're signed in" }),
  ).toBeVisible();
  await expect(page.getByText(email)).toBeVisible();
  await expect(page.getByText("Learner profile record: present")).toBeVisible();

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/sign-in$/);

  // Session is actually revoked server-side, not just hidden client UI.
  await page.goto("/learn");
  await expect(page).toHaveURL(/\/sign-in\?next=(%2F|\/)learn/);
});

test("a returning learner can sign in again without a duplicate profile row", async ({
  page,
}) => {
  const email = `playwright-repeat-${Date.now()}@example.test`;

  // First sign-in: creates the learner_profiles row (INSERT path).
  await page.goto("/sign-in");
  await signInWithFreshOtp(page, email);

  await expect(page).toHaveURL(/\/learn$/);
  await expect(page.getByText("Learner profile record: present")).toBeVisible();
  expect(await countLearnerProfileRows(email)).toBe(1);

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/sign-in$/);

  // Second sign-in with the SAME email: profile creation now hits the
  // ON CONFLICT DO NOTHING path (the row already exists). This must not
  // require UPDATE privilege, must not error, and must not duplicate the
  // row.
  await page.goto("/sign-in");
  await signInWithFreshOtp(page, email);

  await expect(page).toHaveURL(/\/learn$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "You're signed in" }),
  ).toBeVisible();
  await expect(page.getByText(email)).toBeVisible();
  await expect(page.getByText("Learner profile record: present")).toBeVisible();

  expect(await countLearnerProfileRows(email)).toBe(1);
});
