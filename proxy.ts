import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Route-level access control.
 * Redirects unauthenticated users away from protected dashboard pages.
 */
export function proxy(req: NextRequest) {
  // Session flag stored in a cookie (temporary auth mechanism)
  const isLoggedIn = req.cookies.get("dh_session")?.value === "1";

  // Requested path
  const pathname = req.nextUrl.pathname;

  // Dashboard-related routes requiring authentication
  const isDashboardRoute =
    pathname === "/dashboard" ||
    pathname.startsWith("/users") ||
    pathname.startsWith("/orders");

  // Enforce login before accessing protected routes
  if (isDashboardRoute && !isLoggedIn) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Allow request to continue normally
  return NextResponse.next();
}

/**
 * Apply proxy only to dashboard routes
 */
export const config = {
  matcher: ["/dashboard", "/users/:path*", "/orders/:path*"],
};
