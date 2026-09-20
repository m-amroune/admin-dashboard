import { signIn } from "@/auth";
import { LoginButton } from "./LoginButton";
import { LayoutDashboard, ShoppingBag, UserRound, Users } from "lucide-react";

async function login(formData: FormData) {
  "use server";

  await signIn("credentials", {
    email: formData.get("email"),
    password: formData.get("password"),
    redirectTo: "/dashboard",
  });
}

export default function Page() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-200 px-4 py-8">
      {/* Background light effects */}
      <div className="absolute -left-48 top-1/2 h-155 w-155 -translate-y-1/2 rounded-full bg-cyan-200/35 blur-[140px]" />
      <div className="absolute -right-40 top-1/3 h-140 w-140 rounded-full bg-blue-200/35 blur-[130px]" />

      <div className="fade-in-up relative z-10 grid min-h-160 w-full max-w-275 overflow-hidden rounded-[28px] border border-white/80 bg-slate-100/90 shadow-[0_30px_90px_rgba(15,23,42,0.16)] backdrop-blur-sm lg:grid-cols-[0.9fr_1.1fr]">
        {/* Login form */}
        <div className="flex items-center px-8 py-12 sm:px-12 lg:px-16">
          <div className="mx-auto w-full max-w-sm">
            <div className="mb-10">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
                Admin Dashboard
              </h1>

              <p className="mt-3 text-base text-slate-500">
                Sign in to continue
              </p>
            </div>

            <form action={login} className="space-y-6">
              <input
                type="hidden"
                name="email"
                value="demo@admin-dashboard.dev"
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Account
                </label>

                <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-700">
                  Admin
                </div>
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
                  autoComplete="current-password"
                  defaultValue="AdminDemo!2026#"
                  aria-label="Password"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-800 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <LoginButton />
            </form>

            <p className="mt-7 text-center text-xs text-slate-400">
              Demo credentials are pre-filled
            </p>
          </div>
        </div>

        {/* Dashboard visual */}
        <div className="relative hidden items-center justify-center border-l border-slate-200/70 px-7 py-10 lg:flex">
          {/* Light behind the dashboard */}
          <div className="absolute left-1/2 top-1/2 h-107.5 w-107.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-300/30 blur-[90px]" />

          <div className="relative z-10 w-full translate-y-3 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50 shadow-[0_32px_80px_rgba(15,23,42,0.28)] ring-1 ring-white">
            <div className="grid min-h-107.5 grid-cols-[110px_1fr]">
              {/* Mini sidebar */}
              <aside className="flex flex-col border-r border-slate-200 bg-slate-100 p-3">
                <nav className="space-y-2 text-xs font-medium">
                  <div className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-white shadow-sm">
                    <LayoutDashboard size={14} />
                    Dashboard
                  </div>

                  <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-600">
                    <Users size={14} />
                    Users
                  </div>

                  <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-600">
                    <ShoppingBag size={14} />
                    Orders
                  </div>
                </nav>

                <div className="mt-4 border-t border-slate-200 pt-3">
                  <div className="w-full flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700">
                    Logout
                  </div>
                </div>
              </aside>

              {/* Mini dashboard */}
              <div className="flex flex-col bg-slate-50">
                <div className="flex h-12 items-center justify-end border-b border-slate-200 bg-white px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <UserRound size={15} />
                    </div>
                    <span className="text-xs font-semibold text-slate-900">
                      Admin
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Dashboard
                  </h2>

                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                      <p className="text-[10px] font-medium text-slate-500">
                        Users
                      </p>
                      <p className="mt-1 text-xl font-semibold text-slate-900">
                        15
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                      <p className="text-[10px] font-medium text-slate-500">
                        Orders
                      </p>
                      <p className="mt-1 text-xl font-semibold text-slate-900">
                        28
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                      <p className="text-[10px] font-medium text-slate-500">
                        Sales
                      </p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">
                        $1.4K
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-200 border-t-4 border-t-amber-400 bg-white p-3 shadow-sm">
                      <p className="text-[11px] font-semibold text-slate-700">
                        Orders by status
                      </p>

                      <div className="mt-3 space-y-2 text-[10px]">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Pending</span>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                            6
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Paid</span>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                            8
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Shipped</span>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                            9
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                      <p className="text-[11px] font-semibold text-slate-900">
                        Order values
                      </p>
                      <p className="mt-0.5 text-[9px] text-slate-500">
                        Latest 5 orders
                      </p>

                      <div className="mt-4 flex h-20 items-end gap-2 border-b border-slate-200 px-1">
                        <div className="h-8 flex-1 rounded-t bg-blue-500/80" />
                        <div className="h-12 flex-1 rounded-t bg-blue-500/80" />
                        <div className="h-6 flex-1 rounded-t bg-blue-500/80" />
                        <div className="h-16 flex-1 rounded-t bg-blue-500/80" />
                        <div className="h-10 flex-1 rounded-t bg-blue-500/80" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-semibold text-slate-900">
                        Recent orders
                      </p>
                      <span className="text-[9px] text-slate-500">
                        Latest 5
                      </span>
                    </div>

                    <div className="mt-3 space-y-2 text-[9px]">
                      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
                        <span className="truncate text-slate-700">
                          ORD-2026-1028
                        </span>
                        <span className="text-slate-600">$76.00</span>
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-700">
                          Paid
                        </span>
                      </div>

                      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
                        <span className="truncate text-slate-700">
                          ORD-2026-1027
                        </span>
                        <span className="text-slate-600">$349.00</span>
                        <span className="rounded-full bg-green-50 px-2 py-0.5 text-green-700">
                          Shipped
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
