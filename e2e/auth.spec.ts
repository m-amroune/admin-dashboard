import { expect, test } from "./fixtures";

test("logs in and logs out", async ({ page }) => {
  await page.goto("/login");

  await expect(
    page.getByRole("heading", { name: "Admin Dashboard" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Access demo" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);

  await page.getByRole("button", { name: "Logout" }).click();

  await expect(page).toHaveURL(/\/login$/);

  await expect(
    page.getByRole("heading", { name: "Admin Dashboard" }),
  ).toBeVisible();
});

test("shows an error for invalid credentials", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel("Password").fill("wrong-password");

  await page.getByRole("button", { name: "Access demo" }).click();

  await expect(page).toHaveURL(/\/login\?error=CredentialsSignin$/);

await expect(
  page.getByRole("alert").filter({ hasText: "Unable to sign in." }),
).toHaveText(
  "Unable to sign in. Check the password and try again.",
);
});

const protectedRoutes = ["/dashboard", "/orders", "/users"];

for (const route of protectedRoutes) {
  test(`redirects unauthenticated users from ${route}`, async ({ page }) => {
    await page.goto(route);

    await expect(page).toHaveURL(/\/login(?:\?.*)?$/);
  });
}

test("allows authenticated users to access protected routes", async ({
  page,
}) => {
  await page.goto("/login");

  await page.getByRole("button", { name: "Access demo" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);

  await page.goto("/orders");

  await expect(page).toHaveURL(/\/orders$/);
  await expect(
    page.getByRole("heading", { name: "Orders", exact: true }),
  ).toBeVisible();

  await page.goto("/users");

  await expect(page).toHaveURL(/\/users$/);
  await expect(
    page.getByRole("heading", { name: "Users", exact: true }),
  ).toBeVisible();
});
