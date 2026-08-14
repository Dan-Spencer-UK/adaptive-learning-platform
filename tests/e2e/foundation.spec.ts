import { expect, test } from "@playwright/test";

test("foundation page renders", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: "Repository Foundation" }),
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { level: 2, name: "Confirmed in this build" }),
  ).toBeVisible();

  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();
});
