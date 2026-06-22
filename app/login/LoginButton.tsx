"use client";

import { useFormStatus } from "react-dom";

export function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md border border-gray-300 bg-white px-5 py-2.5 text-base font-medium transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
    >
      {pending ? "Loading..." : "Sign in"}
    </button>
  );
}
