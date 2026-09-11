"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Menu, ShoppingBag, Users, X } from "lucide-react";
import { useState } from "react";

const links = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/users",
    label: "Users",
    icon: Users,
  },
  {
    href: "/orders",
    label: "Orders",
    icon: ShoppingBag,
  },
];

export function MobileNav({
  logoutAction,
}: {
  logoutAction: () => Promise<void>;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 md:hidden"
      >
        <Menu size={20} />
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/20 md:hidden"
          />

          {/* Mobile navigation panel */}
          <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white p-4 shadow-xl md:hidden">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-base font-semibold text-slate-900">
                Menu
              </span>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close navigation"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation links */}
            <nav className="flex flex-col gap-2">
              {links.map((link) => {
                const isActive =
                  pathname === link.href ||
                  pathname.startsWith(`${link.href}/`);

                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon size={20} strokeWidth={1.8} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <form
              action={logoutAction}
              className="mt-6 border-t border-slate-200 pt-4"
            >
              <button
                type="submit"
                className="w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-5 py-3 text-left text-base font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Logout
              </button>
            </form>
          </aside>
        </>
      )}
    </>
  );
}