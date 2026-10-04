import { render, screen } from "@testing-library/react";
import { prisma } from "@/lib/prisma";
import Page from "./page";

// The chart itself is not part of the Dashboard page unit tests
jest.mock("./OrderValueChart", () => ({
  __esModule: true,
  default: () => <div data-testid="order-value-chart" />,
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      count: jest.fn(),
    },
    order: {
      groupBy: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

const mockUserCount = prisma.user.count as jest.Mock;
const mockOrderGroupBy = prisma.order.groupBy as jest.Mock;
const mockOrderFindMany = prisma.order.findMany as jest.Mock;

beforeEach(() => {
  mockUserCount.mockResolvedValue(0);
  mockOrderGroupBy.mockResolvedValue([]);
  mockOrderFindMany.mockResolvedValue([]);
});

test("displays the users count", async () => {
  mockUserCount.mockResolvedValue(5);

  render(await Page());

  expect(screen.getByText("5")).toBeInTheDocument();
});

test("displays the orders count", async () => {
  mockOrderGroupBy.mockResolvedValue([
    {
      status: "pending",
      _count: { status: 3 },
      _sum: { amountCents: 1000 },
    },
    {
      status: "paid",
      _count: { status: 4 },
      _sum: { amountCents: 20580 },
    },
    {
      status: "shipped",
      _count: { status: 1 },
      _sum: { amountCents: 3490 },
    },
  ]);

  render(await Page());

  expect(screen.getByText("8")).toBeInTheDocument();
});

test("displays the orders status breakdown", async () => {
  mockOrderGroupBy.mockResolvedValue([
    {
      status: "pending",
      _count: { status: 3 },
      _sum: { amountCents: 0 },
    },
    {
      status: "paid",
      _count: { status: 4 },
      _sum: { amountCents: 0 },
    },
    {
      status: "shipped",
      _count: { status: 1 },
      _sum: { amountCents: 0 },
    },
  ]);

  render(await Page());

  expect(screen.getByText("pending")).toBeInTheDocument();
  expect(screen.getByText("paid")).toBeInTheDocument();
  expect(screen.getByText("shipped")).toBeInTheDocument();
});

test("displays sales from paid orders", async () => {
  mockOrderGroupBy.mockResolvedValue([
    {
      status: "paid",
      _count: { status: 1 },
      _sum: { amountCents: 20580 },
    },
  ]);

  render(await Page());

  expect(screen.getByText("Sales")).toBeInTheDocument();
  expect(screen.getByText("$205.80")).toBeInTheDocument();
});

test("displays recent orders", async () => {
  mockOrderFindMany.mockResolvedValue([
    {
      id: 5,
      reference: "ORD-SEED-005",
      amountCents: 3490,
      status: "shipped",
      user: {
        email: "jack.doe@example.com",
      },
    },
  ]);

  render(await Page());

  expect(screen.getByText("Recent orders")).toBeInTheDocument();
  expect(screen.getByText("ORD-SEED-005")).toBeInTheDocument();
  expect(screen.getByText("jack.doe@example.com")).toBeInTheDocument();
  expect(screen.getByText("$34.90")).toBeInTheDocument();
});