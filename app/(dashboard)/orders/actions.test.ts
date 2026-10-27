import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  createOrder,
  deleteOrder,
  updateOrderStatus,
  updateOrdersStatus,
  deleteOrders,
} from "./actions";
import { requireAuth } from "@/lib/require-auth";
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

test.each([
  { name: "createOrder", action: createOrder },
  { name: "deleteOrder", action: deleteOrder },
  { name: "updateOrderStatus", action: updateOrderStatus },
  { name: "updateOrdersStatus", action: updateOrdersStatus },
  { name: "deleteOrders", action: deleteOrders },
])("blocks unauthenticated $name", async ({ action }) => {
  jest
    .mocked(requireAuth)
    .mockRejectedValueOnce(new Error("Unauthenticated"));

  await expect(action(new FormData())).rejects.toThrow("Unauthenticated");

  expect(jest.mocked(requireAuth)).toHaveBeenCalledTimes(1);
  expect(mockUpdateMany).not.toHaveBeenCalled();
  expect(mockDeleteMany).not.toHaveBeenCalled();
  expect(mockRedirect).not.toHaveBeenCalled();
});