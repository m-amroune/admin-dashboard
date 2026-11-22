
"use client";

import { useRef } from "react";
import { createOrder } from "./actions";

type OrderUser = {
  id: number;
  name: string | null;
  email: string;
};

type AddOrderDialogProps = {
  users: OrderUser[];
};

export default function AddOrderDialog({
  users,
}: AddOrderDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-md"
      >
        <span aria-hidden="true" className="text-lg leading-none">
          +
        </span>
        Add order
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="add-order-title"
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
                <rect x="5" y="3" width="14" height="18" rx="2" />
                <path d="M9 8h6M9 12h6M9 16h3" />
              </svg>
            </div>

            <button
              type="button"
              aria-label="Close add order dialog"
              onClick={() => dialogRef.current?.close()}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-white hover:text-slate-700"
            >
              ×
            </button>
          </div>

          <h2
            id="add-order-title"
            className="mt-4 text-xl font-bold tracking-tight text-slate-900"
          >
            Add a new order
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Create an order for an existing user.
          </p>
        </div>

        <form action={createOrder}>
          <div className="space-y-5 px-6 py-6">
            <div>
              <label
                htmlFor="new-order-user"
                className="mb-2 block text-base font-semibold text-slate-700"
              >
                User
              </label>

              <select
                id="new-order-user"
                name="userId"
                required
                defaultValue=""
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="" disabled>
                  Select user...
                </option>

                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name
                      ? `${user.name} — ${user.email}`
                      : user.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="new-order-amount"
                className="mb-2 block text-base font-semibold text-slate-700"
              >
                Amount ($)
              </label>

              <input
                id="new-order-amount"
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                required
                placeholder="0.00"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <input type="hidden" name="status" value="pending" />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="h-10 cursor-pointer rounded-lg border border-slate-200 bg-white px-4 text-base font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="h-10 cursor-pointer rounded-lg bg-blue-600 px-5 text-base font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Create order
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
