import { test, expect } from "@playwright/test";

test("logging in and creating a post", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/login/);

  await page.getByLabel("Email").fill("alice@taproot.local");
  await page.getByLabel("Password").fill("taproot-dev");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/admin$/);

  await page.getByRole("link", { name: "New post" }).click();
  await page.getByLabel("Title").fill("E2E test post");
  await page.getByLabel("Slug").fill("e2e-test-post");
  await page.getByLabel("Excerpt").fill("Posted by Playwright in CI.");
  await page.getByLabel("Body (Markdown)").fill("# Hello\n\nThis is a test post written by Playwright.");
  await page.getByLabel("Cover URL or path").fill("/cover-1.svg");
  await page.getByLabel("Tag").fill("e2e");
  await page.getByLabel("Publish").check();
  await page.getByRole("button", { name: "Create" }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByText("E2E test post")).toBeVisible();
});
