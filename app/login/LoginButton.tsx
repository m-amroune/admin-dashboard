"use client";

import { useFormStatus } from "react-dom";

export function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-base font-semibold text-white shadow-lg shadow-blue-950/20 transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Loading..." : "Sign in"}
    </button>
  );
}
