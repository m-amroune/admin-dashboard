import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { deleteOrders, updateOrdersStatus } from "./actions";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    order: {
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

const mockUpdateMany = prisma.order.updateMany as jest.Mock;
const mockDeleteMany = prisma.order.deleteMany as jest.Mock;
const mockRedirect = redirect as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

test("updates the status of selected orders", async () => {
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