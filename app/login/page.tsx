import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginButton } from "./LoginButton";

/**
 * Server action handling a minimal login flow.
 * Sets a session cookie and redirects to the dashboard.
 */
async function login() {
  "use server";

  const cookieStore = await cookies();

  cookieStore.set("dh_session", "1", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/dashboard");
}

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 px-4 py-8">
      <div className="fade-in-up grid w-full max-w-5xl overflow-hidden rounded-2xl border border-white/80 bg-white shadow-xl shadow-slate-300/40 lg:grid-cols-2">
        {/* Dashboard preview */}
        <div className="hidden bg-slate-900 p-8 lg:flex lg:items-center">
          <div className="w-full overflow-hidden rounded-2xl border border-slate-700 bg-slate-100 shadow-2xl">
            <div className="grid min-h-96 grid-cols-[110px_1fr]">
              {/* Mini sidebar */}
              <aside className="border-r border-slate-200 bg-slate-200 p-4">
                <nav className="space-y-2 text-xs font-medium">
                  <div className="rounded-lg bg-blue-600 px-3 py-2 text-white shadow-sm">
                    Dashboard
                  </div>

                  <div className="rounded-lg px-3 py-2 text-slate-600">
                    Users
                  </div>

                  <div className="rounded-lg px-3 py-2 text-slate-600">
                    Orders
                  </div>
                </nav>
              </aside>

              {/* Mini dashboard */}
              <div className="bg-slate-50 p-5">
                <h2 className="text-lg font-semibold text-slate-900">
                  Dashboard
                </h2>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-200 border-t-4 border-t-blue-500 bg-white p-4 shadow-sm">
                    <p className="text-xs font-medium text-slate-500">
                      Users
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-slate-900">
                      12
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 border-t-4 border-t-blue-500 bg-white p-4 shadow-sm">
                    <p className="text-xs font-medium text-slate-500">
                      Orders
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-slate-900">
                      18
                    </p>
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-slate-200 border-t-4 border-t-amber-400 bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold text-slate-700">
                    Orders by status
                  </p>

                  <div className="mt-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Pending</span>

                      <span className="rounded-full bg-amber-50 px-2 py-1 font-medium text-amber-700">
                        4
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Paid</span>

                      <span className="rounded-full bg-blue-50 px-2 py-1 font-medium text-blue-700">
                        8
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Shipped</span>

                      <span className="rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-700">
                        6
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Login form */}
        <div className="flex items-center p-8 sm:p-10 lg:p-12">
          <div className="mx-auto w-full max-w-sm">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                Admin Dashboard
              </h1>

              <p className="mt-2 text-base text-slate-500">
                Sign in to continue
              </p>
            </div>

            <form action={login} className="space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Username
                </label>

                <input
                  id="username"
                  type="text"
                  name="username"
                  defaultValue="admin"
                  aria-label="Username"
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-base text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  name="password"
                  defaultValue="demo1234"
                  aria-label="Password"
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-base text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />
              </div>

              <LoginButton />
            </form>

            <p className="mt-6 text-center text-xs text-slate-400">
              Demo credentials are pre-filled
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}