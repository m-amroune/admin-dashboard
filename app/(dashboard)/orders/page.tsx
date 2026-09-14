import { prisma } from "@/lib/prisma";
import OrdersTable from "./OrdersTable";
import { createOrder } from "./actions";
export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";

// Displays the list of orders and allows status updates
type OrdersPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
    sort?: string;
    order?: string;
    page?: string;
  }>;
};

export default async function Page({ searchParams }: OrdersPageProps) {
  const params = await searchParams;

  const search = params.search?.trim() ?? "";
  const status = params.status ?? "";
  const sort = params.sort ?? "email";
  const direction: "asc" | "desc" = params.order === "desc" ? "desc" : "asc";

  const page = Math.max(Number(params.page) || 1, 1);
  const pageSize = 5;
  const skip = (page - 1) * pageSize;

  const validStatuses = ["pending", "paid", "shipped", "cancelled"];

  const [orders, users, totalOrders] = await Promise.all([
    prisma.order.findMany({
      skip,
      take: pageSize,
      where: {
        ...(search
          ? {
              user: {
                email: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            }
          : {}),
        ...(validStatuses.includes(status) ? { status } : {}),
      },
      orderBy:
        sort === "status"
          ? { status: direction }
          : { user: { email: direction } },
      include: {
        user: true,
      },
    }),
    prisma.user.findMany({
      orderBy: { email: "asc" },
      select: {
        id: true,
        email: true,
        name: true,
      },
    }),
    prisma.order.count({
      where: {
        ...(search
          ? {
              user: {
                email: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            }
          : {}),
        ...(validStatuses.includes(status) ? { status } : {}),
      },
    }),
  ]);
  const totalPages = Math.max(Math.ceil(totalOrders / pageSize), 1);
  if (page > totalPages) {
  const query = new URLSearchParams();

  if (search) {
    query.set("search", search);
  }

  if (validStatuses.includes(status)) {
    query.set("status", status);
  }

  if (sort === "status") {
    query.set("sort", "status");
  }

  if (direction === "desc") {
    query.set("order", "desc");
  }

  const queryString = query.toString();

  redirect(queryString ? `/orders?${queryString}` : "/orders");
}
  const orderRows = orders.map((order) => ({
    id: order.id,
    reference: order.reference,
    amountCents: order.amountCents,
    email: order.user.email,
    status: order.status,
  }));
  return (
    <div className="max-w-4xl">
      <h1 className="mb-6 text-2xl font-semibold">Orders</h1>

      {/* Render the list of orders */}
      <div className="space-y-2">
        <form
          action={createOrder}
          className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <h2 className="mb-4 text-sm font-semibold text-slate-800">
            Add order
          </h2>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label htmlFor="userId" className="sr-only">
                User
              </label>

              <select
                id="userId"
                name="userId"
                required
                defaultValue=""
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
              >
                <option value="" disabled>
                  Select user...
                </option>

                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name ? `${user.name} — ${user.email}` : user.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="amount" className="sr-only">
                Amount
              </label>

              <input
                id="amount"
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                required
                placeholder="Amount"
                className="w-32 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
              />
            </div>

            <input type="hidden" name="status" value="pending" />

            <button
              type="submit"
              className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              Add order
            </button>
          </div>
        </form>
        <OrdersTable data={orderRows} page={page} totalPages={totalPages} />
      </div>
    </div>
  );
}
