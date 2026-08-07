import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { proxy } from "./proxy";

jest.mock("next/server", () => ({
  NextResponse: {
    redirect: jest.fn(),
    next: jest.fn(),
  },
}));

test("redirects unauthenticated dashboard requests to login", () => {
  const request = {
    cookies: {
      get: jest.fn(() => undefined),
    },
    nextUrl: {
      pathname: "/dashboard",
      clone: jest.fn(() => ({ pathname: "/dashboard" })),
    },
  } as unknown as NextRequest;

  proxy(request);

  expect(NextResponse.redirect).toHaveBeenCalledWith(
    expect.objectContaining({ pathname: "/login" }),
  );
});

test("allows authenticated dashboard requests", () => {
  const request = {
    cookies: {
      get: jest.fn(() => ({ value: "1" })),
    },
    nextUrl: {
      pathname: "/dashboard",
      clone: jest.fn(() => ({ pathname: "/dashboard" })),
    },
  } as unknown as NextRequest;

  proxy(request);

  expect(NextResponse.next).toHaveBeenCalled();
});

test("redirects unauthenticated users requests to login", () => {
  const request = {
    cookies: {
      get: jest.fn(() => undefined),
    },
    nextUrl: {
      pathname: "/users",
      clone: jest.fn(() => ({ pathname: "/users" })),
    },
  } as unknown as NextRequest;

  proxy(request);

  expect(NextResponse.redirect).toHaveBeenCalledWith(
    expect.objectContaining({ pathname: "/login" }),
  );
});

test("redirects unauthenticated orders requests to login", () => {
  const request = {
    cookies: {
      get: jest.fn(() => undefined),
    },
    nextUrl: {
      pathname: "/orders",
      clone: jest.fn(() => ({ pathname: "/orders" })),
    },
  } as unknown as NextRequest;

  proxy(request);

  expect(NextResponse.redirect).toHaveBeenCalledWith(
    expect.objectContaining({ pathname: "/login" }),
  );
});