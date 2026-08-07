import { render, screen } from "@testing-library/react";
import Page from "./page";

test("displays the login page heading", () => {
  render(<Page />);

  expect(
    screen.getByRole("heading", { name: "Admin Dashboard" }),
  ).toBeInTheDocument();

  expect(screen.getByText("Sign in to continue")).toBeInTheDocument();
});

test("prefills the username field", () => {
  render(<Page />);

  expect(screen.getByLabelText("Username")).toHaveValue("admin");
});

test("prefills the password field", () => {
  render(<Page />);

  expect(screen.getByLabelText("Password")).toHaveValue("demo1234");
});