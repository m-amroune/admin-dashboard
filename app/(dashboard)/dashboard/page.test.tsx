import { render, screen } from "@testing-library/react";
import { prisma } from "@/lib/prisma";
import Page from "./page";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      count: jest.fn(),
    },
    order: {
      count: jest.fn(),
      groupBy: jest.fn(),
    },
  },
}));

const mockUserCount = prisma.user.count as jest.Mock;
const mockOrderCount = prisma.order.count as jest.Mock;
const mockOrderGroupBy = prisma.order.groupBy as jest.Mock;

test("displays the users count", async () => {
  mockUserCount.mockResolvedValue(5);
  mockOrderCount.mockResolvedValue(8);
  mockOrderGroupBy.mockResolvedValue([]);

  render(await Page());

  expect(screen.getByText("5")).toBeInTheDocument();
});

test("displays the orders count", async () => {
  mockUserCount.mockResolvedValue(5);
  mockOrderCount.mockResolvedValue(8);
  mockOrderGroupBy.mockResolvedValue([]);

  render(await Page());

  expect(screen.getByText("8")).toBeInTheDocument();
});

test("displays the orders status breakdown", async () => {
  mockUserCount.mockResolvedValue(5);
  mockOrderCount.mockResolvedValue(8);
  mockOrderGroupBy.mockResolvedValue([
    { status: "pending", _count: { status: 3 } },
    { status: "paid", _count: { status: 4 } },
    { status: "shipped", _count: { status: 1 } },
  ]);

  render(await Page());

  expect(screen.getByText("pending")).toBeInTheDocument();
  expect(screen.getByText("paid")).toBeInTheDocument();
  expect(screen.getByText("shipped")).toBeInTheDocument();
});