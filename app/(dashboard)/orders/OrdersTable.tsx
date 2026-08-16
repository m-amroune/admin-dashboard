"use client";

import Link from "next/link";
import {
  createSortedRowModel,
  rowSortingFeature,
  sortFn_text,
  tableFeatures,
  useTable,
  columnFilteringFeature,
createFilteredRowModel,
filterFn_includesString,
filterFn_equalsString,
  type ColumnDef,
} from "@tanstack/react-table";

import { deleteOrder, updateOrderStatus } from "./actions";

export type OrderRow = {
  id: number;
  email: string;
  status: string;
};

const features = tableFeatures({
  columnFilteringFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
      equalsString: filterFn_equalsString,
  },
  sortFns: {
    text: sortFn_text,
  },
});

const columns: Array<ColumnDef<typeof features, OrderRow>> = [
  {
    accessorKey: "email",
    header: "Email",
    sortFn: "text",
    filterFn: "includesString",
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
    sortFn: "text",
    filterFn: "equalsString",
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
        defaultValue={order.status}
        required
        aria-label="Order status"
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
      >
       
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
       className="cursor-pointer rounded-lg border border-red-200 px-4 py-2 text-base font-medium text-red-600 transition hover:bg-red-50"
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

  const emailColumn = table.getColumn("email");
const statusColumn = table.getColumn("status");
  if (data.length === 0) {
    return <p className="mb-4 text-sm text-gray-500">No orders found.</p>;
  }

return (
  <div>
    <div className="mb-4 flex items-center gap-2">
  <input
  type="search"
  value={(emailColumn?.getFilterValue() ?? "") as string}
  onChange={(event) => emailColumn?.setFilterValue(event.target.value)}
  placeholder="Search by email..."
  aria-label="Search orders by email"
  className="w-64 rounded-lg border border-slate-200 bg-white px-4 py-2 text-base text-slate-700 outline-none transition focus:border-blue-500"
/>
<select
  value={(statusColumn?.getFilterValue() ?? "") as string}
  onChange={(event) =>
    statusColumn?.setFilterValue(event.target.value || undefined)
  }
  aria-label="Filter orders by status"
  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-base text-slate-700 outline-none transition focus:border-blue-500"
>
  <option value="">All statuses</option>
  <option value="pending">Pending</option>
  <option value="paid">Paid</option>
  <option value="shipped">Shipped</option>
</select>
      <span className="shrink-0 whitespace-nowrap text-base text-slate-500">
  Sort by :
</span>

      <button
        type="button"
        onClick={emailColumn?.getToggleSortingHandler()}
       className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition ${
  emailColumn?.getIsSorted()
    ? "bg-blue-600 text-white shadow-sm hover:bg-blue-500"
    : "border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
}`}
      >
        Email
        {emailColumn?.getIsSorted() === "asc" && " ↑"}
        {emailColumn?.getIsSorted() === "desc" && " ↓"}
      </button>

      <button
        type="button"
        onClick={statusColumn?.getToggleSortingHandler()}
        className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition ${
  statusColumn?.getIsSorted()
    ? "bg-blue-600 text-white shadow-sm hover:bg-blue-500"
    : "border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
}`}
      >
        Status
        {statusColumn?.getIsSorted() === "asc" && " ↑"}
        {statusColumn?.getIsSorted() === "desc" && " ↓"}
      </button>
    </div>

   <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
 
  {table.getRowModel().rows.map((row) => (
    <div
      key={row.id}
      className="grid gap-5 border-b border-slate-200 px-5 py-4 text-base last:border-b-0 md:grid-cols-[210px_auto] md:items-center"
    >
      {row
  .getAllCells()
  .filter((cell) => cell.column.id !== "status")
  .map((cell) => (
        <div key={cell.id}>
          <table.FlexRender cell={cell} />
        </div>
      ))}
    </div>
  ))}
</div>
        </div>

);
  
}
