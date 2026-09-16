jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

import { auth } from "@/auth";
import { config, proxy } from "./proxy";

test("uses Auth.js to protect matched routes", () => {
  expect(proxy).toBe(auth);
});

test("protects dashboard, users and orders routes", () => {
  expect(config.matcher).toEqual([
    "/dashboard/:path*",
    "/users/:path*",
    "/orders/:path*",
  ]);
});