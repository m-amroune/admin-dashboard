"use client";

import { useRef } from "react";

type AddUserDialogProps = {
  action: (formData: FormData) => Promise<void>;
};

export default function AddUserDialog({ action }: AddUserDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <span aria-hidden="true" className="text-lg leading-none">
          +
        </span>
        Add user
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="add-user-title"
        className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-[0_24px_80px_rgba(15,23,42,0.25)] backdrop:bg-slate-950/60 backdrop:backdrop-blur-[3px]"
      >
        <div className="border-b border-blue-100 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white px-6 py-6">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <svg
                aria-hidden="true"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21a8 8 0 0 1 16 0" />
              </svg>
            </div>

            <button
              type="button"
              aria-label="Close add user dialog"
              onClick={() => dialogRef.current?.close()}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-white hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-blue-500"
            >
              ×
            </button>
          </div>

          <h2
            id="add-user-title"
            className="mt-4 text-xl font-bold tracking-tight text-slate-900"
          >
            Add a new user
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Create a profile and manage its access.
          </p>
        </div>

        <form action={action}>
          <div className="space-y-5 px-6 py-6">
            <div>
              <label
                htmlFor="new-user-name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Full name
              </label>

              <input
                id="new-user-name"
                name="name"
                type="text"
                required
                placeholder="Full name"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <div>
              <label
                htmlFor="new-user-email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email address
              </label>

              <input
                id="new-user-email"
                name="email"
                type="email"
                required
                placeholder="name@example.com"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="h-10 cursor-pointer rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="h-10 cursor-pointer rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Create user
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
