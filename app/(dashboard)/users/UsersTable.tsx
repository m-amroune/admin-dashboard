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
  type ColumnDef,
} from "@tanstack/react-table";
import UserRoleSelect from "./UserRoleSelect";
import DeleteUserButton from "./DeleteUserButton";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import UserIdentity from "./UserIdentity";

export type UserRow = {
  id: number;
  name: string | null;
  email: string;
  role: string;
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

type UsersTableProps = {
  data: UserRow[];
  page: number;
  totalPages: number;
};

export default function UsersTable({
  data,
  page,
  totalPages,
}: UsersTableProps) {
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

  const sortParam = searchParams.get("sort");

  const currentSort =
    sortParam === "email" || sortParam === "role" ? sortParam : null;

  const currentOrder = searchParams.get("order") === "desc" ? "desc" : "asc";

  const updateSort = (sort: "email" | "role") => {
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
    },
    (state) => state,
  );

  return (
    <div className="w-full">
      {/* Users toolbar */}
      <div className="mb-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        {/* Search and filter */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="search"
            value={searchParams.get("search") ?? ""}
            onChange={(event) => updateQuery("search", event.target.value)}
            placeholder="Search by name or email..."
            aria-label="Search users by name or email"
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-base text-slate-700 outline-none transition focus:border-blue-500 sm:w-72"
          />

          <select
            value={searchParams.get("role") ?? ""}
            onChange={(event) => updateQuery("role", event.target.value)}
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
            onClick={() => updateSort("email")}
            className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition ${
              currentSort === "email"
                ? "border-[#315C72] bg-[#315C72] text-white shadow-sm hover:bg-[#284D60]"
                : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Email
            {currentSort === "email" && currentOrder === "asc" && " ↑"}
            {currentSort === "email" && currentOrder === "desc" && " ↓"}
          </button>

          <button
            type="button"
            onClick={() => updateSort("role")}
            className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition ${
              currentSort === "role"
                ? "border-[#315C72] bg-[#315C72] text-white shadow-sm hover:bg-[#284D60]"
                : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Role
            {currentSort === "role" && currentOrder === "asc" && " ↑"}
            {currentSort === "role" && currentOrder === "desc" && " ↓"}
          </button>
        </div>
      </div>

      {/* Users table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Table header */}
        <div className="hidden border-b border-slate-200 bg-slate-100 px-5 py-3 text-base font-semibold text-slate-600 lg:grid lg:grid-cols-[1fr_120px_260px] lg:items-center lg:gap-4">
          <span className="text-center">User</span>
          <span className="text-center">Role</span>
          <span className="text-center">Actions</span>
        </div>

        {/* Table rows */}
        {data.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="text-base font-medium text-slate-700">
              No users found.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try another search or role filter.
            </p>
          </div>
        )}

        {table.getRowModel().rows.map((row) => {
          const user = row.original;

          return (
            <div
              key={user.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-3 border-b border-slate-200 px-4 py-4 last:border-b-0 lg:grid-cols-[1fr_120px_260px] lg:gap-4 lg:px-5"
            >
              {/* Email */}
              <div className="col-span-2 min-w-0 lg:col-span-1">
  <UserIdentity name={user.name} email={user.email} />
</div>

              {/* Role */}
              <UserRoleSelect
                userId={user.id}
                role={user.role}
                userLabel={user.name?.trim() || user.email}
              />

              {/* Actions */}
              <div className="flex items-center justify-self-end gap-3 lg:justify-self-center">
                <DeleteUserButton
                  userId={user.id}
                  userLabel={user.name?.trim() || user.email}
                />
              </div>
            </div>
          );
        })}
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
