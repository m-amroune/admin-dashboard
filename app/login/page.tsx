import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Server action handling a minimal login flow.
 * Sets a session cookie and redirects to the dashboard.
 */
async function login() {
  "use server";

  // Access the request cookie store (async in Next 16)
  const cookieStore = await cookies();

  // Temporary session flag (will be replaced by real auth later)
  cookieStore.set("dh_session", "1", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });

  // Redirect after successful login
  redirect("/dashboard");
}

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm rounded-lg border p-6 text-center">
        <h1 className="mb-4 text-lg font-semibold">Admin Dashboard</h1>

        <form action={login}>
          <button
            type="submit"
            className="w-full cursor-pointer rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-100"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
