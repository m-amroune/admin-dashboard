import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";
import { redirect } from "next/navigation";
import { deleteUser, toggleRole } from "./actions";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    order: { count: jest.fn() },
    user: {
      delete: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("@/lib/require-auth", () => ({
  requireAuth: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();

  jest
    .mocked(requireAuth)
    .mockRejectedValue(new Error("Unauthenticated"));
});

test.each([
  { name: "deleteUser", action: deleteUser },
  { name: "toggleRole", action: toggleRole },
])("blocks unauthenticated $name", async ({ action }) => {
  const formData = new FormData();
  formData.set("id", "1");
  formData.set("role", "user");

  await expect(action(formData)).rejects.toThrow("Unauthenticated");

  expect(requireAuth).toHaveBeenCalledTimes(1);
  expect(prisma.order.count).not.toHaveBeenCalled();
  expect(prisma.user.delete).not.toHaveBeenCalled();
  expect(prisma.user.update).not.toHaveBeenCalled();
  expect(redirect).not.toHaveBeenCalled();
});