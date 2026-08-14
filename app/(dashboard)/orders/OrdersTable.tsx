"use client";

import Link from "next/link";
import {
  tableFeatures,
  useTable,
  type ColumnDef,
} from "@tanstack/react-table";

import { deleteOrder, updateOrderStatus } from "./actions";

export type OrderRow = {
  id: number;
  email: string;
  status: string;
};

const features = tableFeatures({});

const columns: Array<ColumnDef<typeof features, OrderRow>> = [
  {
    accessorKey: "email",
    header: "Email",
    cell: (info) => {
      const order = info.row.original;

      return (
        <Link
          href={`/orders/${order.id}`}
          className="text-sm font-medium text-gray-800 hover:underline"
        >
          {order.email}
        </Link>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => (
      <span className="w-fit rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium capitalize text-gray-600">
        {String(info.getValue())}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: (info) => {
      const order = info.row.original;

    return (
  <div className="flex items-center gap-2">
    <form action={updateOrderStatus} className="flex items-center gap-2">
      <input type="hidden" name="id" value={order.id} />

      <select
        name="status"
        defaultValue=""
        required
        aria-label="Order status"
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
      >
        <option value="" disabled>
          Change status...
        </option>
        <option value="pending">Pending</option>
        <option value="paid">Paid</option>
        <option value="shipped">Shipped</option>
      </select>

      <button
        type="submit"
        className="cursor-pointer rounded-lg border border-slate-700 bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-600"
      >
        Update
      </button>
    </form>

    <form
      action={deleteOrder}
      onSubmit={(event) => {
        if (!window.confirm("Delete this order?")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={order.id} />

      <button
        type="submit"
        className="cursor-pointer rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
      >
        Delete
      </button>
    </form>
  </div>
    );
  },
},
];


export default function OrdersTable({ data }: { data: OrderRow[] }) {
  const table = useTable(
    {
      features,
      columns,
      data,
    },
    (state) => state,
  );

  if (data.length === 0) {
    return <p className="mb-4 text-sm text-gray-500">No orders found.</p>;
  }

  return (
    <div className="space-y-2">
      {table.getRowModel().rows.map((row) => (
        <div
          key={row.id}
          className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm md:grid-cols-[minmax(180px,1fr)_auto_auto] md:items-center"
        >
          {row.getAllCells().map((cell) => (
            <div key={cell.id}>
              <table.FlexRender cell={cell} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
