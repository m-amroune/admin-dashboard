import React from "react";
import Link from "next/link";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <aside className="w-52 border-r p-4">
        <nav className="flex flex-col items-center gap-2 text-sm">
          <Link
            href="/dashboard"
            className="rounded-md px-6 py-3 text-lg hover:bg-gray-100"
          >
            Dashboard
          </Link>
          <Link
            href="/users"
            className="rounded-md px-6 py-3 text-lg hover:bg-gray-100"
          >
            Users
          </Link>
          <Link
            href="/orders"
            className="rounded-md px-6 py-3 text-lg hover:bg-gray-100"
          >
            Orders
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default layout;
