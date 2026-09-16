import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { deleteOrders, updateOrdersStatus } from "./actions";
jest.mock("@/lib/prisma", () => ({
  prisma: {
    order: {
      findMany: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    orderStatusHistory: {
      createMany: jest.fn(),
    },
    $transaction: jest.fn(),
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
  redirect: jest.fn(),
}));

const mockFindMany = prisma.order.findMany as unknown as jest.Mock;
const mockUpdateMany = prisma.order.updateMany as unknown as jest.Mock;
const mockDeleteMany = prisma.order.deleteMany as unknown as jest.Mock;
const mockRedirect = redirect as unknown as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

test("updates the status of selected orders", async () => {
  mockFindMany.mockResolvedValue([
  { id: 1, status: "pending" },
  { id: 2, status: "pending" },
]);
  const formData = new FormData();

  formData.append("ids", "1");
  formData.append("ids", "2");
  formData.append("status", "paid");

  await updateOrdersStatus(formData);

  expect(mockUpdateMany).toHaveBeenCalledWith({
    where: {
      id: {
        in: [1, 2],
      },
    },
    data: {
      status: "paid",
    },
  });

  expect(mockRedirect).toHaveBeenCalledWith("/orders");
});

test("deletes selected orders", async () => {
  const formData = new FormData();

  formData.append("ids", "1");
  formData.append("ids", "2");

  await deleteOrders(formData);

  expect(mockDeleteMany).toHaveBeenCalledWith({
    where: {
      id: {
        in: [1, 2],
      },
    },
  });

  expect(mockRedirect).toHaveBeenCalledWith("/orders");
});