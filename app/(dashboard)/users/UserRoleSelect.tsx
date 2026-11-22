"use client";

import { toggleRole } from "./actions";

type UserRoleSelectProps = {
  userId: number;
  role: string;
  userLabel: string;
};

export default function UserRoleSelect({
  userId,
  role,
  userLabel,
}: UserRoleSelectProps) {
  const isAdmin = role === "admin";

  return (
    <form
      action={toggleRole}
      className="relative w-36 lg:justify-self-center"
    >
      <input type="hidden" name="id" value={userId} />
      <input type="hidden" name="role" value={role} />

      <span
        aria-hidden="true"
        className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${
          isAdmin ? "text-blue-600" : "text-slate-400"
        }`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isAdmin ? (
            <path d="M12 3 20 7v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4Z" />
          ) : (
            <>
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21a8 8 0 0 1 16 0" />
            </>
          )}
        </svg>
      </span>

      <select
        aria-label={`Change role for ${userLabel}`}
        defaultValue={role}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className="h-11 w-full cursor-pointer appearance-none rounded-lg border border-transparent bg-white pl-10 pr-8 text-base font-medium text-slate-800 transition hover:border-slate-200 hover:bg-slate-50 focus-visible:border-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-100"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <svg
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </form>
  );
}