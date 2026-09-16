import { fireEvent, render, screen } from "@testing-library/react";

import { prisma } from "@/lib/prisma";

import Page from "./page";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    order: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    user: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock("./actions", () => ({
  createOrder: jest.fn(),
  deleteOrder: jest.fn(),
  deleteOrders: jest.fn(),
  updateOrderStatus: jest.fn(),
  updateOrdersStatus: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
  usePathname: () => "/orders",
  useSearchParams: () => new URLSearchParams(),
  redirect: jest.fn(),
}));

const mockFindMany = prisma.order.findMany as jest.Mock;
const mockCount = prisma.order.count as jest.Mock;
const mockUserFindMany = prisma.user.findMany as jest.Mock;

type TestSearchParams = {
  search?: string;
  status?: string;
  sort?: string;
  order?: string;
  page?: string;
};

const renderPage = async (searchParams: TestSearchParams = {}) => {
  render(
    await Page({
      searchParams: Promise.resolve(searchParams),
    }),
  );
};

beforeEach(() => {
  jest.clearAllMocks();

  mockCount.mockResolvedValue(2);

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
      reference: "ORD-TEST-001",
      amountCents: 4990,
      status: "pending",
      user: { email: "john@example.com" },
    },
    {
      id: 2,
      reference: "ORD-TEST-002",
      amountCents: 7990,
      status: "paid",
      user: { email: "jane@example.com" },
    },
  ]);

  await renderPage();

  expect(screen.getByText("john@example.com")).toBeInTheDocument();
  expect(screen.getByText("jane@example.com")).toBeInTheDocument();
});

test("displays the current order status", async () => {
  mockFindMany.mockResolvedValue([
    {
      id: 1,
      reference: "ORD-TEST-001",
      amountCents: 4990,
      status: "pending",
      user: { email: "john@example.com" },
    },
  ]);

  await renderPage();

  expect(screen.getByRole("combobox", { name: "Order status" })).toHaveValue(
    "pending",
  );
});

test("displays the order detail link", async () => {
  mockFindMany.mockResolvedValue([
    {
      id: 1,
      reference: "ORD-TEST-001",
      amountCents: 4990,
      status: "pending",
      user: { email: "john@example.com" },
    },
  ]);

  await renderPage();

  expect(
    screen.getByRole("link", { name: "john@example.com" }),
  ).toHaveAttribute("href", "/orders/1");
});

test("displays the empty state when there are no orders", async () => {
  mockFindMany.mockResolvedValue([]);

  await renderPage();

  expect(screen.getByText("No orders found.")).toBeInTheDocument();
});

test("filters orders by email", async () => {
  mockFindMany.mockResolvedValue([]);

  await renderPage({ search: "jane" });

  expect(mockFindMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: expect.objectContaining({
        user: {
          email: {
            contains: "jane",
            mode: "insensitive",
          },
        },
      }),
    }),
  );
});

test("filters orders by status", async () => {
  mockFindMany.mockResolvedValue([]);

  await renderPage({ status: "paid" });

  expect(mockFindMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: expect.objectContaining({
        status: "paid",
      }),
    }),
  );
});

test("sorts orders by email", async () => {
  mockFindMany.mockResolvedValue([]);

  await renderPage({
    sort: "email",
    order: "desc",
  });

  expect(mockFindMany).toHaveBeenCalledWith(
    expect.objectContaining({
      orderBy: {
        user: {
          email: "desc",
        },
      },
    }),
  );
});

test("paginates orders", async () => {
  mockCount.mockResolvedValue(6);
  mockFindMany.mockResolvedValue([]);

  await renderPage({ page: "2" });

  expect(mockFindMany).toHaveBeenCalledWith(
    expect.objectContaining({
      skip: 5,
      take: 5,
    }),
  );
});

test("displays order reference and amount", async () => {
  mockFindMany.mockResolvedValue([
    {
      id: 1,
      reference: "ORD-TEST-001",
      amountCents: 4990,
      status: "pending",
      user: { email: "john@example.com" },
    },
  ]);

  await renderPage();

  expect(screen.getByText("ORD-TEST-001")).toBeInTheDocument();
  expect(screen.getByText("$49.90")).toBeInTheDocument();
});

test("selects an order and displays the selected count", async () => {
  mockFindMany.mockResolvedValue([
    {
      id: 1,
      reference: "ORD-TEST-001",
      amountCents: 4990,
      status: "pending",
      user: { email: "john@example.com" },
    },
    {
      id: 2,
      reference: "ORD-TEST-002",
      amountCents: 7990,
      status: "paid",
      user: { email: "jane@example.com" },
    },
  ]);

  await renderPage();

  fireEvent.click(
    screen.getByRole("checkbox", {
      name: "Select order ORD-TEST-001",
    }),
  );

  expect(screen.getByText("1 order selected")).toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("checkbox", {
      name: "Select order ORD-TEST-002",
    }),
  );

  expect(screen.getByText("2 orders selected")).toBeInTheDocument();
});

test("selects all visible orders", async () => {
  mockFindMany.mockResolvedValue([
    {
      id: 1,
      reference: "ORD-TEST-001",
      amountCents: 4990,
      status: "pending",
      user: { email: "john@example.com" },
    },
    {
      id: 2,
      reference: "ORD-TEST-002",
      amountCents: 7990,
      status: "paid",
      user: { email: "jane@example.com" },
    },
  ]);

  await renderPage();

  fireEvent.click(
    screen.getByRole("checkbox", {
      name: "Select all visible orders",
    }),
  );

  expect(
    screen.getByRole("checkbox", {
      name: "Select order ORD-TEST-001",
    }),
  ).toBeChecked();

  expect(
    screen.getByRole("checkbox", {
      name: "Select order ORD-TEST-002",
    }),
  ).toBeChecked();

  expect(screen.getByText("2 orders selected")).toBeInTheDocument();
});