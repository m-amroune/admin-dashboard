import type { Page } from "@playwright/test";

import { expect, test } from "./fixtures";

async function login(page: Page) {
  await page.goto("/login");

  await page.getByRole("button", { name: "Access demo" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
}

test("creates an order", async ({ page }) => {
  await login(page);

  await page.goto("/orders");

  await page
  .getByRole("button", { name: "Add order", exact: true })
  .click();

  const userSelect = page.locator('select[name="userId"]');

  const aliceOption = userSelect
    .locator("option")
    .filter({ hasText: "alice.e2e@example.com" });

  const aliceValue = await aliceOption.getAttribute("value");

  expect(aliceValue).not.toBeNull();

  await userSelect.selectOption(aliceValue!);

  await page.getByLabel("Amount").fill("25.50");

  await page
  .getByRole("button", { name: "Create order", exact: true })
  .click();

  await expect(page).toHaveURL(/\/orders$/);

  await expect(page.getByText("$25.50")).toBeVisible();
});

test("updates an order status", async ({ page }) => {
  await login(page);

  await page.goto("/orders");

  const orderRow = page
    .getByRole("checkbox", {
      name: "Select order ORD-E2E-001",
    })
    .locator("..");

  const statusSelect = orderRow.getByRole("combobox", {
    name: "Order status",
  });

  await expect(statusSelect).toHaveValue("pending");

  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        new URL(response.url()).pathname === "/orders",
    ),
    statusSelect.selectOption("paid"),
  ]);

  await page.reload();

  await expect(
    page
      .getByRole("checkbox", {
        name: "Select order ORD-E2E-001",
      })
      .locator("..")
      .getByRole("combobox", {
        name: "Order status",
      }),
  ).toHaveValue("paid");
});

test("deletes an order", async ({ page }) => {
  await login(page);

  await page.goto("/orders");

  const orderCheckbox = page.getByRole("checkbox", {
    name: "Select order ORD-E2E-001",
  });

  await expect(orderCheckbox).toBeVisible();

  const orderRow = orderCheckbox.locator("..");

  await orderRow
    .getByRole("button", {
      name: "Delete order ORD-E2E-001",
    })
    .click();

  const confirmation = page.getByRole("dialog", {
    name: "Delete order?",
  });

  await expect(confirmation).toBeVisible();

  await confirmation
    .getByRole("button", {
      name: "Delete order",
      exact: true,
    })
    .click();

  await expect(page).toHaveURL(/\/orders$/);

  await expect(
    page.getByRole("checkbox", {
      name: "Select order ORD-E2E-001",
    }),
  ).toHaveCount(0);
});

test("updates selected orders status", async ({ page }) => {
  await login(page);

  await page.goto("/orders");

  await page
    .getByRole("checkbox", {
      name: "Select order ORD-E2E-001",
    })
    .check();

  await page
    .getByRole("checkbox", {
      name: "Select order ORD-E2E-007",
    })
    .check();

  await expect(page.getByText("2 orders selected")).toBeVisible();

  await page
    .getByRole("button", {
      name: "Mark as paid",
      exact: true,
    })
    .click();

  const firstOrderRow = page
    .getByRole("checkbox", {
      name: "Select order ORD-E2E-001",
    })
    .locator("..");

  const secondOrderRow = page
    .getByRole("checkbox", {
      name: "Select order ORD-E2E-007",
    })
    .locator("..");

  await expect(
    firstOrderRow.getByRole("combobox", {
      name: "Order status",
    }),
  ).toHaveValue("paid");

  await expect(
    secondOrderRow.getByRole("combobox", {
      name: "Order status",
    }),
  ).toHaveValue("paid");
});

test("deletes selected orders", async ({ page }) => {
  await login(page);

  await page.goto("/orders");

  await page
    .getByRole("checkbox", {
      name: "Select order ORD-E2E-001",
    })
    .check();

  await page
    .getByRole("checkbox", {
      name: "Select order ORD-E2E-007",
    })
    .check();

  await expect(page.getByText("2 orders selected")).toBeVisible();

  await page
    .getByRole("button", {
      name: "Delete selected",
      exact: true,
    })
    .click();

  const confirmation = page.getByRole("dialog", {
    name: "Delete selected orders?",
  });

  await expect(confirmation).toBeVisible();

  await confirmation
    .getByRole("button", {
      name: "Delete orders",
      exact: true,
    })
    .click();

  await expect(
    page.getByRole("checkbox", {
      name: "Select order ORD-E2E-001",
    }),
  ).toHaveCount(0);

  await expect(
    page.getByRole("checkbox", {
      name: "Select order ORD-E2E-007",
    }),
  ).toHaveCount(0);
});
