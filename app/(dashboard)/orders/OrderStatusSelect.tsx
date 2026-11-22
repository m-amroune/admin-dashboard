
"use client";

import { updateOrderStatus } from "./actions";

type OrderStatusSelectProps = {
  orderId: number;
  status: string;
};

const transitions: Record<string, string[]> = {
  pending: ["paid", "cancelled"],
  paid: ["shipped", "cancelled"],
  shipped: [],
  cancelled: [],
};

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function OrderStatusSelect({
  orderId,
  status,
}: OrderStatusSelectProps) {
  const allowedTransitions = transitions[status] ?? [];
  const isFinal = allowedTransitions.length === 0;

  return (
    <form action={updateOrderStatus} className="relative w-36">
      <input type="hidden" name="id" value={orderId} />

      <select
        name="status"
        aria-label="Order status"
        defaultValue={status}
        disabled={isFinal}
        onChange={(event) =>
          event.currentTarget.form?.requestSubmit()
        }
        className="h-11 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pl-4 pr-8 text-base font-medium text-slate-800 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-500 disabled:cursor-default disabled:bg-slate-50 disabled:text-slate-500"
      >
        <option value={status}>{formatStatus(status)}</option>

        {allowedTransitions.map((nextStatus) => (
          <option key={nextStatus} value={nextStatus}>
            {formatStatus(nextStatus)}
          </option>
        ))}
      </select>

      {!isFinal && (
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
      )}
    </form>
  );
}

