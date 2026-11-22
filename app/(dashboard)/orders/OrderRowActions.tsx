
"use client";

import Link from "next/link";
import { useRef } from "react";
import { deleteOrder } from "./actions";

type OrderRowActionsProps = {
  orderId: number;
  reference: string;
};

export default function OrderRowActions({
  orderId,
  reference,
}: OrderRowActionsProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <div className="flex items-center gap-2">
        <Link
          href={`/orders/${orderId}`}
          className="inline-flex h-11 items-center rounded-lg px-3 text-base font-medium text-slate-700 transition hover:bg-slate-100 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-blue-500"
        >
          Details
        </Link>

        <button
          type="button"
          aria-label={`Delete order ${reference}`}
          title="Delete order"
          onClick={() => dialogRef.current?.showModal()}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-blue-500"
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
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby={`delete-order-title-${orderId}`}
        aria-describedby={`delete-order-description-${orderId}`}
        className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/50"
      >
        <div className="p-6">
          <h2
            id={`delete-order-title-${orderId}`}
            className="text-xl font-semibold tracking-tight"
          >
            Delete order?
          </h2>

          <p
            id={`delete-order-description-${orderId}`}
            className="mt-3 text-base leading-relaxed text-slate-600"
          >
            Are you sure you want to delete{" "}
            <strong className="font-semibold text-slate-900">
              {reference}
            </strong>
            ? This action cannot be undone.
          </p>

          <form action={deleteOrder} className="mt-6 flex justify-end gap-3">
            <input type="hidden" name="id" value={orderId} />

            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="h-11 cursor-pointer rounded-lg border border-slate-200 bg-white px-4 text-base font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="h-11 cursor-pointer rounded-lg bg-red-600 px-4 text-base font-semibold text-white transition hover:bg-red-700"
            >
              Delete order
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
