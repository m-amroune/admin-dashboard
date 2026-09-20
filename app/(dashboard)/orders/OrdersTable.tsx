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
  createPaginatedRowModel,
  rowPaginationFeature,
  rowSelectionFeature,
  type ColumnDef,
} from "@tanstack/react-table";

import {
  deleteOrder,
  deleteOrders,
  updateOrderStatus,
  updateOrdersStatus,
} from "./actions";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type OrderRow = {
  id: number;
  reference: string;
  amountCents: number | null;
  email: string;
  status: string;
};

const features = tableFeatures({
  columnFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
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
    accessorKey: "reference",
    header: "Reference",
    sortFn: "text",
  },
  {
    accessorKey: "amountCents",
    header: "Amount",
    cell: (info) => {
      const amountCents = info.getValue<number | null>();

      return amountCents === null
        ? "Not set"
        : `$${(amountCents / 100).toFixed(2)}`;
    },
  },
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
              <option value="cancelled">Cancelled</option>
            </select>

            <button
              type="submit"
              className="cursor-pointer rounded-lg border border-slate-700 bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-600"
            >
              Update
            </button>
          </form>

          <Link
            href={`/orders/${order.id}`}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            View details
          </Link>

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

type OrdersTableProps = {
  data: OrderRow[];
  page: number;
  totalPages: number;
};

export default function OrdersTable({
  data,
  page,
  totalPages,
}: OrdersTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.delete("page");

    router.replace(`${pathname}?${params.toString()}`);
  };

  const currentSort = searchParams.get("sort") ?? "email";
  const currentOrder = searchParams.get("order") === "desc" ? "desc" : "asc";

  const updateSort = (sort: "email" | "status") => {
    const params = new URLSearchParams(searchParams.toString());

    const nextOrder =
      currentSort === sort && currentOrder === "asc" ? "desc" : "asc";

    params.set("sort", sort);
    params.set("order", nextOrder);
    params.delete("page");

    router.replace(`${pathname}?${params.toString()}`);
  };

  const goToPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextPage <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(nextPage));
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  const table = useTable(
    {
      features,
      columns,
      data,
      getRowId: (row) => String(row.id),
    },
    (state) => state,
  );

  const selectedCount = table.getSelectedRowModel().rows.length;
  const selectedOrderIds = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.id);
  if (data.length === 0) {
    return <p className="mb-4 text-sm text-gray-500">No orders found.</p>;
  }

  return (
    <div>
      {/* Orders toolbar */}
      <div className="mb-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        {/* Search and filter */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="search"
            value={searchParams.get("search") ?? ""}
            onChange={(event) => updateQuery("search", event.target.value)}
            placeholder="Search by email..."
            aria-label="Search orders by email"
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-base text-slate-700 outline-none transition focus:border-blue-500 sm:w-64"
          />

          <select
            value={searchParams.get("status") ?? ""}
            onChange={(event) => updateQuery("status", event.target.value)}
            aria-label="Filter orders by status"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-base text-slate-700 outline-none transition focus:border-blue-500"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Sorting */}
        <div className="flex items-center gap-2">
          <span className="shrink-0 whitespace-nowrap text-base text-slate-500">
            Sort by :
          </span>

          <button
            type="button"
            onClick={() => updateSort("email")}
            className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition ${
              currentSort === "email"
                ? "bg-blue-600 text-white shadow-sm hover:bg-blue-500"
                : "border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Email
            {currentSort === "email" && currentOrder === "asc" && " ↑"}
            {currentSort === "email" && currentOrder === "desc" && " ↓"}
          </button>

          <button
            type="button"
            onClick={() => updateSort("status")}
            className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition ${
              currentSort === "status"
                ? "bg-blue-600 text-white shadow-sm hover:bg-blue-500"
                : "border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Status
            {currentSort === "status" && currentOrder === "asc" && " ↑"}
            {currentSort === "status" && currentOrder === "desc" && " ↓"}
          </button>
        </div>
      </div>

      <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
        {/* Selected orders */}
        {selectedCount > 0 && (
          <div className="mb-4 flex flex-col gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-semibold text-blue-700">
              {selectedCount} {selectedCount === 1 ? "order" : "orders"}{" "}
              selected
            </span>

            <div className="flex flex-wrap items-center gap-2">
              <form action={updateOrdersStatus}>
                {selectedOrderIds.map((id) => (
                  <input key={id} type="hidden" name="ids" value={id} />
                ))}

                <input type="hidden" name="status" value="paid" />

                <button
                  type="submit"
                  className="cursor-pointer rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
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
                  className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
                >
                  Mark as shipped
                </button>
              </form>

              <form
                action={deleteOrders}
                onSubmit={(event) => {
                  if (!window.confirm("Delete selected orders?")) {
                    event.preventDefault();
                  }
                }}
              >
                {selectedOrderIds.map((id) => (
                  <input key={id} type="hidden" name="ids" value={id} />
                ))}

                <button
                  type="submit"
                  className="cursor-pointer rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  Delete selected
                </button>
              </form>
            </div>
          </div>
        )}
        {/* Table header */}
        <div className="hidden border-b border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-600 lg:grid lg:grid-cols-[32px_120px_100px_180px_minmax(0,1fr)] lg:items-center lg:gap-4">
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            aria-label="Select all visible orders"
            className="h-4 w-4 cursor-pointer rounded border-slate-300"
          />

          <span>Reference</span>
          <span>Amount</span>
          <span>Customer</span>
          <span>Status / Actions</span>
        </div>
        {table.getRowModel().rows.map((row) => (
          <div
            key={row.id}
            className="grid gap-4 border-b border-slate-200 px-5 py-4 text-base last:border-b-0 lg:grid-cols-[32px_120px_100px_180px_minmax(0,1fr)] lg:items-center"
          >
            {/* Row selection */}
            <input
              type="checkbox"
              checked={row.getIsSelected()}
              onChange={row.getToggleSelectedHandler()}
              aria-label={`Select order ${row.original.reference}`}
              className="h-4 w-4 cursor-pointer rounded border-slate-300"
            />

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
      {/* Pagination */}
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1}
          className="cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2 text-base font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        <span className="text-base text-slate-600">
          Page {page} of {totalPages}
        </span>

        <button
          type="button"
          onClick={() => goToPage(page + 1)}
          disabled={page >= totalPages}
          className="cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2 text-base font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
