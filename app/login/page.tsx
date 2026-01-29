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
    <div className="min-h-screen flex items-center justify-center">
      <main className="p-6">
        <h1 className="text-red-500 text-3xl font-bold">Admin Dashboard</h1>
        <form action={login}>
          <button type="submit">Login</button>
        </form>
      </main>
    </div>
  );
}
