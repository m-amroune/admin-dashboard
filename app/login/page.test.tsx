import { render, screen } from "@testing-library/react";
import Page from "./page";

jest.mock("@/auth", () => ({
  signIn: jest.fn(),
}));

test("displays the login page heading", () => {
  render(<Page />);

  expect(
    screen.getByRole("heading", { name: "Admin Dashboard" }),
  ).toBeInTheDocument();

  expect(screen.getByText("Sign in to continue")).toBeInTheDocument();
});

test("displays the demo admin account", () => {
  render(<Page />);

  expect(screen.getByText("Account")).toBeInTheDocument();
  expect(screen.getAllByText("Admin").length).toBeGreaterThan(0);
});
test("prefills the password field", () => {
  render(<Page />);

  expect(screen.getByLabelText("Password")).toHaveValue("AdminDemo!2026#");
});