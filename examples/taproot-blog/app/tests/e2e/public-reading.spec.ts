import { test, expect } from "@playwright/test";

test("home page lists three posts", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("article").first()).toBeVisible();
  await expect(page.locator("article")).toHaveCount(3);
});

test("clicking a post opens the post page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Hello, world/ }).first().click();
  await expect(page).toHaveURL(/\/posts\/hello-world$/);
  await expect(page.getByRole("heading", { level: 1, name: /Hello, world/ })).toBeVisible();
});

test("tag filter shows only matching posts", async ({ page }) => {
  await page.goto("/tag/css");
  await expect(page.locator("article")).toHaveCount(1);
});
