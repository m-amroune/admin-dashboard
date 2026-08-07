import { render, screen } from "@testing-library/react";
import { LoginButton } from "./LoginButton";

let mockPending = false;

jest.mock("react-dom", () => ({
  ...jest.requireActual("react-dom"),
  useFormStatus: () => ({ pending: mockPending }),
}));

test("displays the sign in button", () => {
  render(<LoginButton />);

  expect(
    screen.getByRole("button", { name: "Sign in" }),
  ).toBeInTheDocument();
});

  test("displays the loading state", () => {
  mockPending = true;

  render(<LoginButton />);

  expect(screen.getByRole("button", { name: "Loading..." })).toBeDisabled();
});