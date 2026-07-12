"use client";

import { useFormStatus } from "react-dom";

export function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-slate-700 px-5 py-2.5 text-base font-medium text-white shadow-sm transition-colors hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
    >
      {pending ? "Loading..." : "Sign in"}
    </button>
  );
}
