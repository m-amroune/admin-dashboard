import { render, screen } from "@testing-library/react";
import { prisma } from "@/lib/prisma";
import Page from "./page";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    order: {
      findMany: jest.fn(),
    },
  },
}));

const mockFindMany = prisma.order.findMany as jest.Mock;

test("displays orders from the database", async () => {
  mockFindMany.mockResolvedValue([
    { id: 1, email: "john@example.com", status: "pending" },
    { id: 2, email: "jane@example.com", status: "paid" },
  ]);

  render(await Page());

  expect(screen.getByText("john@example.com")).toBeInTheDocument();
  expect(screen.getByText("jane@example.com")).toBeInTheDocument();
});

test("displays the current order status", async () => {
  mockFindMany.mockResolvedValue([
    { id: 1, email: "john@example.com", status: "pending" },
  ]);

  render(await Page());

  expect(screen.getByText("pending")).toBeInTheDocument();
});

test("displays the order detail link", async () => {
  mockFindMany.mockResolvedValue([
    { id: 1, email: "john@example.com", status: "pending" },
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