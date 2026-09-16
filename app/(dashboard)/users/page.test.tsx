import { render, screen } from "@testing-library/react";
import { prisma } from "@/lib/prisma";
import Page from "./page";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

jest.mock("@/lib/require-auth", () => ({
  requireAuth: jest.fn().mockResolvedValue({
    user: {
      id: "1",
      email: "demo@admin-dashboard.dev",
      name: "Demo Admin",
    },
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
  usePathname: () => "/users",
  useSearchParams: () => new URLSearchParams(),
  redirect: jest.fn(),
}));

const mockFindMany = prisma.user.findMany as jest.Mock;
const mockCount = prisma.user.count as jest.Mock;

type TestSearchParams = {
  search?: string;
  role?: string;
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
});

test("displays users from the database", async () => {
  mockFindMany.mockResolvedValue([
    {
      id: 1,
      name: null,
      email: "admin@example.com",
      role: "admin",
    },
    {
      id: 2,
      name: null,
      email: "user@example.com",
      role: "user",
    },
  ]);

  await renderPage();

  expect(screen.getByText("admin@example.com")).toBeInTheDocument();
  expect(screen.getByText("user@example.com")).toBeInTheDocument();
});

test("displays Make admin for a regular user", async () => {
  mockFindMany.mockResolvedValue([
    {
      id: 1,
      name: null,
      email: "user@example.com",
      role: "user",
    },
  ]);

  await renderPage();

  expect(
    screen.getByRole("button", { name: "Make admin" }),
  ).toBeInTheDocument();
});

test("displays Remove admin for an admin user", async () => {
  mockFindMany.mockResolvedValue([
    {
      id: 1,
      name: null,
      email: "admin@example.com",
      role: "admin",
    },
  ]);

  await renderPage();

  expect(
    screen.getByRole("button", { name: "Remove admin" }),
  ).toBeInTheDocument();
});

test("displays the empty state when there are no users", async () => {
  mockCount.mockResolvedValue(0);
  mockFindMany.mockResolvedValue([]);

  await renderPage();

  expect(screen.getByText("No users found.")).toBeInTheDocument();
});

test("filters users by name or email", async () => {
  mockFindMany.mockResolvedValue([]);

  await renderPage({
    search: "Jane",
  });

  expect(mockFindMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: expect.objectContaining({
        OR: [
          {
            email: {
              contains: "Jane",
              mode: "insensitive",
            },
          },
          {
            name: {
              contains: "Jane",
              mode: "insensitive",
            },
          },
        ],
      }),
    }),
  );
});

test("filters users by role", async () => {
  mockFindMany.mockResolvedValue([]);

  await renderPage({
    role: "admin",
  });

  expect(mockFindMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: expect.objectContaining({
        role: "admin",
      }),
    }),
  );
});

test("sorts users by email", async () => {
  mockFindMany.mockResolvedValue([]);

  await renderPage({
    sort: "email",
    order: "desc",
  });

  expect(mockFindMany).toHaveBeenCalledWith(
    expect.objectContaining({
      orderBy: {
        email: "desc",
      },
    }),
  );
});

test("sorts users by role", async () => {
  mockFindMany.mockResolvedValue([]);

  await renderPage({
    sort: "role",
    order: "asc",
  });

  expect(mockFindMany).toHaveBeenCalledWith(
    expect.objectContaining({
      orderBy: {
        role: "asc",
      },
    }),
  );
});

test("paginates users", async () => {
  mockCount.mockResolvedValue(6);
  mockFindMany.mockResolvedValue([]);

  await renderPage({
    page: "2",
  });

  expect(mockFindMany).toHaveBeenCalledWith(
    expect.objectContaining({
      skip: 5,
      take: 5,
    }),
  );
});