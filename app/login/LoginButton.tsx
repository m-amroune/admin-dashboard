"use client";

import { useFormStatus } from "react-dom";

export function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full cursor-pointer rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-100 disabled:opacity-50"
    >
      {pending ? "Loading..." : "Login"}
    </button>
  );
}
