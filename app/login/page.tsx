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
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-100 via-gray-200 to-gray-300">
      <div className="fade-in-up me w-full max-w-lg rounded-lg border border-gray-200 bg-white p-10 shadow-sm text-center text-lg ">
        <h1 className=" text-3xl font-semibold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-base text-gray-500 mt-1.6">Sign in to continue</p>
        <form className="mt-4 w-full" action={login}>
          <LoginButton />
        </form>
      </div>
    </div>
  );
}
