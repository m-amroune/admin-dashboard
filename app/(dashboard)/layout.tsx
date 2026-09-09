import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import { SidebarNav } from "./SidebarNav";
import { UserRound } from "lucide-react";

async function logout() {
  "use server";

  const cookieStore = await cookies();
  cookieStore.delete("dh_session");

  redirect("/login");
}

const layout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const session = cookieStore.get("dh_session");
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-52 flex-col border-r border-slate-200 bg-slate-50 p-4">
        <SidebarNav />

        <form action={logout} className="mt-6 border-t border-slate-200 pt-4">
          <button
            type="submit"
            className="w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-5 py-3 text-left text-base font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Logout
          </button>
        </form>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-end border-b border-slate-200 bg-white px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <UserRound size={20} strokeWidth={1.8} />
            </div>

            <p className="text-sm font-semibold text-slate-900">Admin</p>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default layout;
