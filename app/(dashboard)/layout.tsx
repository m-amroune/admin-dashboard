import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import { SidebarNav } from "./SidebarNav";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const session = cookieStore.get("dh_session");
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <aside className="w-52 border-r border-slate-200 bg-slate-50 p-4">
        <nav className="flex flex-col gap-2">
          <SidebarNav />
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default layout;
