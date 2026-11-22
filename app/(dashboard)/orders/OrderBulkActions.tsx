
"use client";

import { useRef } from "react";
import { deleteOrders, updateOrdersStatus } from "./actions";

type OrderBulkActionsProps = {
  selectedOrderIds: number[];
};

export default function OrderBulkActions({
  selectedOrderIds,
}: OrderBulkActionsProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const count = selectedOrderIds.length;

  return (
    <>
      <div className="flex flex-col gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-base font-semibold text-slate-800">
          {count} {count === 1 ? "order" : "orders"} selected
        </span>

        <div className="flex flex-wrap items-center gap-2">
          <form action={updateOrdersStatus}>
            {selectedOrderIds.map((id) => (
              <input key={id} type="hidden" name="ids" value={id} />
            ))}
            <input type="hidden" name="status" value="paid" />

            <button
              type="submit"
              className="h-11 cursor-pointer rounded-lg border border-slate-200 bg-white px-4 text-base font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Mark as paid
            </button>
          </form>

          <form action={updateOrdersStatus}>
            {selectedOrderIds.map((id) => (
              <input key={id} type="hidden" name="ids" value={id} />
            ))}
            <input type="hidden" name="status" value="shipped" />

            <button
              type="submit"
              className="h-11 cursor-pointer rounded-lg bg-blue-600 px-4 text-base font-medium text-white transition hover:bg-blue-500"
            >
              Mark as shipped
            </button>
          </form>

          <button
            type="button"
            onClick={() => dialogRef.current?.showModal()}
            className="h-11 cursor-pointer rounded-lg px-4 text-base font-medium text-slate-600 transition hover:bg-slate-100"
          >
            Delete selected
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="bulk-delete-title"
        aria-describedby="bulk-delete-description"
        className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/50"
      >
        <div className="p-6">
          <h2
            id="bulk-delete-title"
            className="text-xl font-semibold tracking-tight"
          >
            Delete selected orders?
          </h2>

          <p
            id="bulk-delete-description"
            className="mt-3 text-base leading-relaxed text-slate-600"
          >
            You are about to delete {count}{" "}
            {count === 1 ? "order" : "orders"}. This action
            cannot be undone.
          </p>

          <form
            action={deleteOrders}
            className="mt-6 flex justify-end gap-3"
          >
            {selectedOrderIds.map((id) => (
              <input key={id} type="hidden" name="ids" value={id} />
            ))}

            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="h-11 cursor-pointer rounded-lg border border-slate-200 px-4 text-base font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="h-11 cursor-pointer rounded-lg bg-red-600 px-4 text-base font-semibold text-white transition hover:bg-red-700"
            >
              Delete orders
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
