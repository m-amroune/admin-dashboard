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
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  // Redirect after successful login
  redirect("/dashboard");
}

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-slate-100 to-slate-200">
      <div className="fade-in-up w-full max-w-lg rounded-2xl border border-white/80 bg-white/95 p-10 text-center text-lg shadow-xl shadow-slate-300/40 backdrop-blur-sm">
        <h1 className=" text-3xl font-semibold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-base text-gray-500 mt-1.6">Sign in to continue</p>
        <form action={login} className="space-y-4">
          <input
            type="text"
            name="username"
            defaultValue="admin"
            aria-label="Username"
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-base text-gray-700"
          />

          <input
            type="password"
            name="password"
            defaultValue="demo1234"
            aria-label="Password"
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-base text-gray-700"
          />

          <LoginButton />
        </form>
      </div>
    </div>
  );
}
