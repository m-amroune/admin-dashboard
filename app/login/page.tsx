import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginButton } from "./LoginButton";

/**
 * Server action handling a minimal login flow.
 * Sets a session cookie and redirects to the dashboard.
 */
async function login() {
  "use server";

  // Access the request cookie store (async in Next 16)
  const cookieStore = await cookies();

  // Temporary session flag
  cookieStore.set("dh_session", "1", {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
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
          <LoginButton />
        </form>
      </div>
    </div>
  );
}
