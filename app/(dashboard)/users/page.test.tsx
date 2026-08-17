import { fireEvent, render, screen } from "@testing-library/react";
import { prisma } from "@/lib/prisma";
import Page from "./page";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
    },
  },
}));

const mockFindMany = prisma.user.findMany as jest.Mock;

test("displays users from the database", async () => {
  mockFindMany.mockResolvedValue([
    { id: 1, email: "admin@example.com", role: "admin" },
    { id: 2, email: "user@example.com", role: "user" },
  ]);

  render(await Page({}));

  expect(screen.getByText("admin@example.com")).toBeInTheDocument();
  expect(screen.getByText("user@example.com")).toBeInTheDocument();
});

test("displays Make admin for a regular user", async () => {
  mockFindMany.mockResolvedValue([
    { id: 1, email: "user@example.com", role: "user" },
  ]);

  render(await Page({}));

  expect(
    screen.getByRole("button", { name: "Make admin" }),
  ).toBeInTheDocument();
});

test("displays Remove admin for an admin user", async () => {
  mockFindMany.mockResolvedValue([
    { id: 1, email: "admin@example.com", role: "admin" },
  ]);

  render(await Page({}));

  expect(
    screen.getByRole("button", { name: "Remove admin" }),
  ).toBeInTheDocument();
});

test("displays the empty state when there are no users", async () => {
  mockFindMany.mockResolvedValue([]);

  render(await Page({}));

  expect(screen.getByText("No users found.")).toBeInTheDocument();
});

test("filters users by name or email", async () => {
  mockFindMany.mockResolvedValue([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "user",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "admin",
    },
  ]);

  render(await Page({}));

  fireEvent.change(
    screen.getByRole("searchbox", {
      name: "Search users by name or email",
    }),
    {
      target: { value: "Jane" },
    },
  );

  expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  expect(screen.queryByText("john@example.com")).not.toBeInTheDocument();
});