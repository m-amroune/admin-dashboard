import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import { SidebarNav } from "./SidebarNav";

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
            className="w-full rounded-lg border border-slate-300 bg-white px-5 py-3 text-left text-base font-medium text-slate-700 transition hover:bg-slate-100 cursor-pointer"
          >
            Logout
          </button>
        </form>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default layout;
