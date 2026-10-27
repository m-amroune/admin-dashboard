import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { requireAuth } from "./require-auth";

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
}));

const mockAuth = auth as jest.Mock;
const mockRedirect = jest.mocked(redirect);

beforeEach(() => {
  jest.clearAllMocks();
});

test("allows an authenticated admin", async () => {
  const session = {
    user: { id: "1", email: "demo@admin-dashboard.dev" },
  };

  mockAuth.mockResolvedValue(session);

  await expect(requireAuth()).resolves.toEqual(session);
  expect(mockRedirect).not.toHaveBeenCalled();
});

test("redirects unauthenticated requests to login", async () => {
  mockAuth.mockResolvedValue(null);

  await expect(requireAuth()).rejects.toThrow("NEXT_REDIRECT");
  expect(mockRedirect).toHaveBeenCalledWith("/login");
});