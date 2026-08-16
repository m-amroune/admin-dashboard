import { fireEvent, render, screen } from "@testing-library/react";
import { prisma } from "@/lib/prisma";
import Page from "./page";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    order: {
      findMany: jest.fn(),
    },
    user: {
      findMany: jest.fn(),
    },
  },
}));

const mockFindMany = prisma.order.findMany as jest.Mock;
const mockUserFindMany = prisma.user.findMany as jest.Mock;

beforeEach(() => {
  mockUserFindMany.mockResolvedValue([
    {
      id: 1,
      email: "john@example.com",
      name: "John Doe",
    },
  ]);
});

test("displays orders from the database", async () => {
  mockFindMany.mockResolvedValue([
  {
    id: 1,
    status: "pending",
    user: { email: "john@example.com" },
  },
  {
    id: 2,
    status: "paid",
    user: { email: "jane@example.com" },
  },
]);

  render(await Page());

  expect(screen.getByText("john@example.com")).toBeInTheDocument();
  expect(screen.getByText("jane@example.com")).toBeInTheDocument();
});

test("displays the current order status", async () => {
 mockFindMany.mockResolvedValue([
  {
    id: 1,
    status: "pending",
    user: { email: "john@example.com" },
  },
]);

  render(await Page());

  expect(
  screen.getByRole("combobox", { name: "Order status" }),
).toHaveValue("pending")
});

test("displays the order detail link", async () => {
  mockFindMany.mockResolvedValue([
  {
    id: 1,
    status: "pending",
    user: { email: "john@example.com" },
  },
]);

  render(await Page());

  expect(
  screen.getByRole("link", { name: "john@example.com" }),
).toHaveAttribute("href", "/orders/1");
});

test("displays the empty state when there are no orders", async () => {
  mockFindMany.mockResolvedValue([]);

  render(await Page());

  expect(screen.getByText("No orders found.")).toBeInTheDocument();
});

test("filters orders by email", async () => {
  mockFindMany.mockResolvedValue([
    {
      id: 1,
      status: "pending",
      user: { email: "john@example.com" },
    },
    {
      id: 2,
      status: "paid",
      user: { email: "jane@example.com" },
    },
  ]);

  render(await Page());

  fireEvent.change(
    screen.getByRole("searchbox", { name: "Search orders by email" }),
    {
      target: { value: "jane" },
    },
  );

  expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  expect(screen.queryByText("john@example.com")).not.toBeInTheDocument();
});

test("filters orders by status", async () => {
  mockFindMany.mockResolvedValue([
    {
      id: 1,
      status: "pending",
      user: { email: "john@example.com" },
    },
    {
      id: 2,
      status: "paid",
      user: { email: "jane@example.com" },
    },
  ]);

  render(await Page());

  fireEvent.change(
    screen.getByLabelText("Filter orders by status"),
    {
      target: { value: "paid" },
    },
  );

  expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  expect(screen.queryByText("john@example.com")).not.toBeInTheDocument();
});

test("sorts orders by email", async () => {
  mockFindMany.mockResolvedValue([
    {
      id: 1,
      status: "pending",
      user: { email: "zoe@example.com" },
    },
    {
      id: 2,
      status: "paid",
      user: { email: "alice@example.com" },
    },
  ]);

  render(await Page());

  fireEvent.click(screen.getByRole("button", { name: "Email" }));

  const orderLinks = screen
    .getAllByRole("link")
    .filter((link) => link.getAttribute("href")?.startsWith("/orders/"));

  expect(orderLinks.map((link) => link.textContent)).toEqual([
    "alice@example.com",
    "zoe@example.com",
  ]);
});

test("paginates orders", async () => {
  mockFindMany.mockResolvedValue(
    Array.from({ length: 6 }, (_, index) => ({
      id: index + 1,
      status: "pending",
      user: { email: `user${index + 1}@example.com` },
    })),
  );

  render(await Page());

  expect(screen.getByText("user1@example.com")).toBeInTheDocument();
  expect(screen.getByText("user5@example.com")).toBeInTheDocument();
  expect(screen.queryByText("user6@example.com")).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Next" }));

  expect(screen.getByText("user6@example.com")).toBeInTheDocument();
  expect(screen.queryByText("user1@example.com")).not.toBeInTheDocument();
});