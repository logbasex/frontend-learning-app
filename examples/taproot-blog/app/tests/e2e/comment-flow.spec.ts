import { test, expect } from "@playwright/test";

test("posting a comment shows it on the page", async ({ page }) => {
  await page.goto("/posts/hello-world");
  await page.getByLabel("Name").fill("Tester");
  await page.getByLabel("Comment").fill("First!");
  await page.getByRole("button", { name: "Post comment" }).click();
  await expect(page.getByText("First!")).toBeVisible();
});
