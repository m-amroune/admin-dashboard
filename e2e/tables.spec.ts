

import { expect, test } from "./fixtures";


async function login(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}



test("filters orders with URL parameters", async ({ page }) => {
  await login(page);

  await page.goto("/orders");

  await page
    .getByRole("searchbox", { name: "Search orders by email" })
    .fill("alice");

  await expect(page).toHaveURL(/search=alice/);

  await page
    .getByRole("combobox", { name: "Filter orders by status" })
    .selectOption("paid");

  await expect(page).toHaveURL(/status=paid/);
});

test("filters users with URL parameters", async ({ page }) => {
  await login(page);

  await page.goto("/users");

  await page
    .getByRole("searchbox", { name: "Search users by name or email" })
    .fill("alice");

  await expect(page).toHaveURL(/search=alice/);

  await page
    .getByRole("combobox", { name: "Filter users by role" })
    .selectOption("admin");

  await expect(page).toHaveURL(/role=admin/);
});

test("sorts users by email", async ({ page }) => {
  await login(page);

  await page.goto("/users");

  await page.getByRole("button", { name: "Email" }).click();

  await expect(page).toHaveURL(/sort=email/);
  await expect(page).toHaveURL(/order=asc/);
});

test("paginates orders", async ({ page }) => {
  await login(page);

  await page.goto("/orders");

  const nextButton = page.getByRole("button", {
  name: "Next",
  exact: true,
});

  if (await nextButton.isEnabled()) {
    await nextButton.click();

    await expect(page).toHaveURL(/page=2/);
  }
});

test("uses the isolated E2E database", async ({ page }) => {
  await login(page);

  await page.goto("/users");

  await expect(
    page.getByText("alice.e2e@example.com"),
  ).toBeVisible();
});