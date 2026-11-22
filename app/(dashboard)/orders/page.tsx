import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import OrdersTable from "./OrdersTable";
import AddOrderDialog from "./AddOrderDialog";

export const dynamic = "force-dynamic";

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
  const sort = params.sort ?? "name";
  const direction: "asc" | "desc" = params.order === "desc" ? "desc" : "asc";

  const page = Math.max(Number(params.page) || 1, 1);
  const pageSize = 5;
  const skip = (page - 1) * pageSize;

  const validStatuses = ["pending", "paid", "shipped", "cancelled"];

  const where = {
    ...(search
      ? {
          user: {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                email: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          },
        }
      : {}),
    ...(validStatuses.includes(status) ? { status } : {}),
  };

  const [orders, users, totalOrders] = await Promise.all([
    prisma.order.findMany({
      skip,
      take: pageSize,
      where,
      orderBy:
        sort === "status"
          ? { status: direction }
          : { user: { name: direction } },
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
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.max(Math.ceil(totalOrders / pageSize), 1);

  if (page > totalPages) {
    const query = new URLSearchParams();

    if (search) query.set("search", search);
    if (validStatuses.includes(status)) query.set("status", status);
    if (sort === "status") query.set("sort", "status");
    if (direction === "desc") query.set("order", "desc");

    const queryString = query.toString();

    redirect(queryString ? `/orders?${queryString}` : "/orders");
  }

  const orderRows = orders.map((order) => ({
    id: order.id,
    reference: order.reference,
    amountCents: order.amountCents,
    email: order.user.email,
    name: order.user.name,
    status: order.status,
  }));

  return (
    <div className="max-w-5xl lg:ml-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              Orders
            </h1>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {totalOrders}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Manage orders and track their status.
          </p>
        </div>

        <AddOrderDialog users={users} />
      </div>

      <OrdersTable data={orderRows} page={page} totalPages={totalPages} />
    </div>
  );
}
