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

test("filters users by role", async () => {
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
    screen.getByLabelText("Filter users by role"),
    {
      target: { value: "admin" },
    },
  );

  expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  expect(screen.queryByText("john@example.com")).not.toBeInTheDocument();
});

test("sorts users by email", async () => {
  mockFindMany.mockResolvedValue([
    {
      id: 1,
      name: null,
      email: "zoe@example.com",
      role: "user",
    },
    {
      id: 2,
      name: null,
      email: "alice@example.com",
      role: "admin",
    },
  ]);

  render(await Page({}));

  fireEvent.click(screen.getByRole("button", { name: "Email" }));

  const emails = [
    screen.getByText("alice@example.com"),
    screen.getByText("zoe@example.com"),
  ];

  expect(
    emails[0].compareDocumentPosition(emails[1]) &
      Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
});

test("sorts users by role", async () => {
  mockFindMany.mockResolvedValue([
    {
      id: 1,
      name: null,
      email: "user@example.com",
      role: "user",
    },
    {
      id: 2,
      name: null,
      email: "admin@example.com",
      role: "admin",
    },
  ]);

  render(await Page({}));

  fireEvent.click(screen.getByRole("button", { name: "Role" }));

  const adminEmail = screen.getByText("admin@example.com");
  const userEmail = screen.getByText("user@example.com");

  expect(
    adminEmail.compareDocumentPosition(userEmail) &
      Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
});

test("paginates users", async () => {
  mockFindMany.mockResolvedValue(
    Array.from({ length: 6 }, (_, index) => ({
      id: index + 1,
      name: null,
      email: `user${index + 1}@example.com`,
      role: "user",
    })),
  );

  render(await Page({}));

  expect(screen.getByText("user1@example.com")).toBeInTheDocument();
  expect(screen.getByText("user5@example.com")).toBeInTheDocument();
  expect(screen.queryByText("user6@example.com")).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Next" }));

  expect(screen.getByText("user6@example.com")).toBeInTheDocument();
  expect(screen.queryByText("user1@example.com")).not.toBeInTheDocument();
});