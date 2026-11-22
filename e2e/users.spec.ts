
import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

async function login(page: Page) {
  await page.goto("/login");

  await page
    .getByRole("button", { name: "Access demo" })
    .click();

  await expect(page).toHaveURL(/\/dashboard$/);
}

async function createUser(
  page: Page,
  name: string,
  email: string,
) {
  await page.goto("/users");

  await page
    .getByRole("button", { name: "Add user", exact: true })
    .click();

  const dialog = page.getByRole("dialog");

  await expect(dialog).toBeVisible();

  await dialog.locator('input[name="name"]').fill(name);
  await dialog.locator('input[name="email"]').fill(email);

  await dialog.locator('button[type="submit"]').click();

  await expect(page).toHaveURL(/\/users\?created=1$/);
}

test("creates a user", async ({ page }) => {
  await login(page);

  await createUser(
    page,
    "Grace E2E",
    "grace.e2e@example.com",
  );

  await expect(
    page.getByText("User created successfully"),
  ).toBeVisible();

  await page
    .getByRole("searchbox", {
      name: "Search users by name or email",
    })
    .fill("grace");

  await expect(
    page.getByText("grace.e2e@example.com", { exact: true }),
  ).toBeVisible();
});

test("toggles a user role", async ({ page }) => {
  await login(page);
  await page.goto("/users");

  const bobRow = page.locator("div.grid.border-b").filter({
    has: page.getByText("bob.e2e@example.com", {
      exact: true,
    }),
  });

  const bobRole = bobRow.getByRole("combobox", {
    name: /^Change role for /,
  });

  await expect(bobRole).toHaveValue("user");

  await bobRole.selectOption("admin");

  await expect(page).toHaveURL(/\/users\?updated=1$/);

  await page.reload();

  await expect(bobRole).toHaveValue("admin");
});

test("deletes a user without orders", async ({ page }) => {
  await login(page);

  await createUser(
    page,
    "Delete Me E2E",
    "delete.me.e2e@example.com",
  );

  const search = page.getByRole("searchbox", {
    name: "Search users by name or email",
  });

  await search.fill("delete.me");

  const userRow = page.locator("div.grid.border-b").filter({
    has: page.getByText("delete.me.e2e@example.com", {
      exact: true,
    }),
  });

  await expect(userRow).toBeVisible();

  await userRow
    .getByRole("button", { name: /^Delete / })
    .click();

  const confirmation = page.getByRole("dialog");

  await expect(confirmation).toBeVisible();

  await confirmation
    .locator('button[type="submit"]')
    .click();

  await expect(page).toHaveURL(/\/users\?deleted=1$/);

  await search.fill("delete.me");

  await expect(
    page.getByText("No users found."),
  ).toBeVisible();
});
