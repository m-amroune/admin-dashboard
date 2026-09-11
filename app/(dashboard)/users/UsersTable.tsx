"use client";
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
  type ColumnDef,
} from "@tanstack/react-table";
import { deleteUser, toggleRole } from "./actions";

export type UserRow = {
  id: number;
  name: string | null;
  email: string;
  role: string;
};

const features = tableFeatures({
  columnFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
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

const columns: Array<ColumnDef<typeof features, UserRow>> = [
  {
    id: "search",
    accessorFn: (user) => `${user.name ?? ""} ${user.email}`,
    filterFn: "includesString",
  },
  {
    accessorKey: "email",
    sortFn: "text",
  },
  {
    accessorKey: "role",
    sortFn: "text",
    filterFn: "equalsString",
  },
];

export default function UsersTable({ data }: { data: UserRow[] }) {
  const table = useTable(
    {
      features,
      columns,
      data,
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 5,
        },
      },
    },
    (state) => state,
  );

  const emailColumn = table.getColumn("email");
  const roleColumn = table.getColumn("role");
  const searchColumn = table.getColumn("search");
  if (data.length === 0) {
    return <p className="mb-4 text-sm text-gray-500">No users found.</p>;
  }

  return (
    <div className="max-w-4xl">
      {/* Users toolbar */}
      <div className="mb-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        {/* Search and filter */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="search"
            value={(searchColumn?.getFilterValue() ?? "") as string}
            onChange={(event) =>
              searchColumn?.setFilterValue(event.target.value)
            }
            placeholder="Search by name or email..."
            aria-label="Search users by name or email"
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-base text-slate-700 outline-none transition focus:border-blue-500 sm:w-72"
          />

          <select
            value={(roleColumn?.getFilterValue() ?? "") as string}
            onChange={(event) =>
              roleColumn?.setFilterValue(event.target.value || undefined)
            }
            aria-label="Filter users by role"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-base text-slate-700 outline-none transition focus:border-blue-500"
          >
            <option value="">All roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Sorting */}
        <div className="flex items-center gap-2">
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
            onClick={roleColumn?.getToggleSortingHandler()}
            className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition ${
              roleColumn?.getIsSorted()
                ? "bg-blue-600 text-white shadow-sm hover:bg-blue-500"
                : "border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Role
            {roleColumn?.getIsSorted() === "asc" && " ↑"}
            {roleColumn?.getIsSorted() === "desc" && " ↓"}
          </button>
        </div>
      </div>

      {/* Users table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Table header */}
        <div className="hidden border-b border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-600 md:grid md:grid-cols-[1fr_120px_260px] md:items-center md:gap-4">
          <span>Email</span>
          <span>Role</span>
          <span>Actions</span>
        </div>

        {/* Table rows */}
        {table.getRowModel().rows.map((row) => {
          const user = row.original;

          return (
            <div
              key={user.id}
              className="grid gap-4 border-b border-slate-200 px-5 py-4 text-sm last:border-b-0 lg:grid-cols-[1fr_120px_260px] lg:items-center"
            >
              {/* Email */}
              <span className="font-medium text-slate-800">{user.email}</span>

              {/* Role */}
              <span
                className={`w-fit rounded-full border px-3 py-1 text-sm font-medium ${
                  user.role === "admin"
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-slate-50 text-slate-600"
                }`}
              >
                {user.role}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <form action={toggleRole}>
                  <input type="hidden" name="id" value={user.id} />
                  <input type="hidden" name="role" value={user.role} />

                  <button
                    type="submit"
                    className="w-36 cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    {user.role === "admin" ? "Remove admin" : "Make admin"}
                  </button>
                </form>

                <form action={deleteUser}>
                  <input type="hidden" name="id" value={user.id} />

                  <button
                    type="submit"
                    className="cursor-pointer rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2 text-base font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        <span className="text-base text-slate-600">
          Page {table.state.pagination.pageIndex + 1} of {table.getPageCount()}
        </span>

        <button
          type="button"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2 text-base font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
