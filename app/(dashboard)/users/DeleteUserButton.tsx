"use client";

import { useRef } from "react";
import { deleteUser } from "./actions";

type DeleteUserButtonProps = {
  userId: number;
  userLabel: string;
};

export default function DeleteUserButton({
  userId,
  userLabel,
}: DeleteUserButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        title="Delete user"
        aria-label={`Delete ${userLabel}`}
        onClick={() => dialogRef.current?.showModal()}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-transparent text-slate-500 transition hover:border-slate-200 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-blue-500"
      >
        <svg
          aria-hidden="true"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="M5 6l1 14h12l1-14" />
          <path d="M10 10v6" />
          <path d="M14 10v6" />
        </svg>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={`delete-user-title-${userId}`}
        aria-describedby={`delete-user-description-${userId}`}
        className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/50"
      >
        <div className="p-6">
          <h2
            id={`delete-user-title-${userId}`}
            className="text-xl font-semibold tracking-tight"
          >
            Delete user?
          </h2>

          <p
            id={`delete-user-description-${userId}`}
            className="mt-3 text-base leading-relaxed text-slate-600"
          >
            Are you sure you want to delete{" "}
            <strong className="font-semibold text-slate-900">
              {userLabel}
            </strong>
            ? This action cannot be undone.
          </p>

          <form action={deleteUser} className="mt-6 flex justify-end gap-3">
            <input type="hidden" name="id" value={userId} />

            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="h-10 cursor-pointer rounded-lg border border-slate-200 bg-white px-4 text-base font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="h-10 cursor-pointer rounded-lg bg-red-600 px-4 text-base font-semibold text-white transition hover:bg-red-700"
            >
              Delete user
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}