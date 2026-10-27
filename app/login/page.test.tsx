import { render, screen } from "@testing-library/react";
import Page from "./page";

jest.mock("@/auth", () => ({
  signIn: jest.fn(),
}));

jest.mock("next-auth", () => ({
  AuthError: class AuthError extends Error {},
}));

async function renderLoginPage(error?: string) {
  render(
    await Page({
      searchParams: Promise.resolve(error ? { error } : {}),
    }),
  );
}

test("displays the login page heading", async () => {
  await renderLoginPage();

  expect(
    screen.getByRole("heading", { name: "Admin Dashboard" }),
  ).toBeInTheDocument();

  expect(
    screen.getByText("Access the demo admin account"),
  ).toBeInTheDocument();

  expect(
    screen.getByRole("button", { name: "Access demo" }),
  ).toBeInTheDocument();
});

test("displays the demo admin account", async () => {
  await renderLoginPage();

  expect(screen.getByText("Account")).toBeInTheDocument();
  expect(screen.getAllByText("Admin").length).toBeGreaterThan(0);
});

test("prefills the password field", async () => {
  await renderLoginPage();

  expect(screen.getByLabelText("Password")).toHaveValue(
    "AdminDemo!2026#",
  );
});

test("displays an error for invalid credentials", async () => {
  await renderLoginPage("CredentialsSignin");

  expect(screen.getByRole("alert")).toHaveTextContent(
    "Unable to sign in. Check the password and try again.",
  );
});
