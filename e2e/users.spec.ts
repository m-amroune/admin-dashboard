import type { Page } from "@playwright/test";

import { expect, test } from "./fixtures";


async function login(page: Page) {
  await page.goto("/login");

  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
}


test("creates a user", async ({ page }) => {
  await login(page);

  await page.goto("/users");

  await page
    .getByPlaceholder("Name (optional)")
    .fill("Grace E2E");

  await page
  .getByRole("textbox", {
    name: "Email",
    exact: true,
  })
  .fill("grace.e2e@example.com");

  await page
    .getByRole("button", {
      name: "Add user",
      exact: true,
    })
    .click();

  await expect(page).toHaveURL(/\/users\?created=1$/);

  await expect(
  page.getByText("User created successfully"),
).toBeVisible();

await page
  .getByRole("searchbox", { name: "Search users by name or email" })
  .fill("grace");

await expect(
  page.getByText("grace.e2e@example.com"),
).toBeVisible();
});

test("toggles a user role", async ({ page }) => {
  await login(page);

  await page.goto("/users");

  const bobRow = page
    .getByText("bob.e2e@example.com")
    .locator("..");

  await expect(
    bobRow.getByText("user", { exact: true }),
  ).toBeVisible();

  await bobRow
    .getByRole("button", {
      name: "Make admin",
      exact: true,
    })
    .click();

  await expect(
    bobRow.getByText("admin", { exact: true }),
  ).toBeVisible();
});

test("deletes a user without orders", async ({ page }) => {
  await login(page);

  await page.goto("/users");

  await page
    .getByPlaceholder("Name (optional)")
    .fill("Delete Me E2E");

  await page
    .getByRole("textbox", {
      name: "Email",
      exact: true,
    })
    .fill("delete.me.e2e@example.com");

  await page
    .getByRole("button", {
      name: "Add user",
      exact: true,
    })
    .click();

  const search = page.getByRole("searchbox", {
    name: "Search users by name or email",
  });

  await search.fill("delete.me");

  const userRow = page
    .getByText("delete.me.e2e@example.com")
    .locator("..");

  await userRow
    .getByRole("button", {
      name: "Delete",
      exact: true,
    })
    .click();

  await expect(page).toHaveURL(/\/users\?deleted=1$/);

  await page
    .getByRole("searchbox", {
      name: "Search users by name or email",
    })
    .fill("delete.me");

  await expect(page.getByText("No users found.")).toBeVisible();
});