import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import { ShoppingBag, Users, WalletCards } from "lucide-react";
import OrderValueChart from "./OrderValueChart";

// Displays global statistics and provides a logout action
const page = async () => {
  // Dashboard statistics
  const [usersCount, ordersCount, ordersByStatus, paidSales, recentOrders] =
    await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      prisma.order.aggregate({
        where: { status: "paid" },
        _sum: { amountCents: true },
      }),
      // Latest orders
      prisma.order.findMany({
        take: 5,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
      }),
    ]);

  // Revenue from paid orders
  const sales = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format((paidSales._sum.amountCents ?? 0) / 100);

  // Values of the latest orders for the chart
 const orderValues = [...recentOrders]
  .reverse()
  .map((order) => ({
    reference: order.reference.replace("ORD-SEED-", "#"),
    amount: (order.amountCents ?? 0) / 100,
  }));

  // Keep statuses in workflow order
  const statusOrder = ["pending", "paid", "shipped"];

  ordersByStatus.sort(
    (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status),
  );

  return (
    <div className="fade-in-up">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-800">
        Dashboard
      </h1>

      {/* Global statistics */}
      <div className="mb-8 grid max-w-4xl gap-4 md:grid-cols-3">
        {/* Users */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Users</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {usersCount}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users size={21} />
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Orders</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {ordersCount}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <ShoppingBag size={21} />
            </div>
          </div>
        </div>

        {/* Sales */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Sales</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {sales}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <WalletCards size={21} />
            </div>
          </div>
        </div>
      </div>

      {/* Orders breakdown by status */}
      <div className="grid max-w-4xl gap-6 lg:grid-cols-2">
        <div className="rounded-xl  border border-slate-200 border-t-4 border-t-amber-400 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700">
            Orders by status
          </h2>

          <div className="mt-5 space-y-4">
            {ordersByStatus.map((item) => (
              <div
                key={item.status}
                className="flex items-center justify-between"
              >
                <span className="text-sm font-medium capitalize text-slate-600">
                  {item.status}
                </span>

                <span className="flex min-w-8 items-center justify-center rounded-full bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-700">
                  {item._count.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Order values chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-slate-900">
              Order values
            </h2>
            <p className="mt-1 text-sm text-slate-500">Latest 5 orders</p>
          </div>

          <OrderValueChart data={orderValues} />
        </div>
      </div>

      {/* Recent orders */}
      <div className="mt-6 max-w-4xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">
            Recent orders
          </h2>

          <span className="text-sm text-slate-500">Latest 5</span>
        </div>

        <div className="divide-y divide-slate-100">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="grid items-center gap-4 py-3 text-sm md:grid-cols-[140px_1fr_100px_100px]"
            >
              {/* Reference */}
              <span className="font-medium text-slate-800">
                {order.reference}
              </span>

              {/* Customer */}
              <span className="truncate text-slate-600">
                {order.user.email}
              </span>

              {/* Amount */}
              <span className="text-slate-700">
                {order.amountCents === null
                  ? "Not set"
                  : `$${(order.amountCents / 100).toFixed(2)}`}
              </span>

              {/* Status */}
              <div className="flex justify-center">
                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-medium capitalize ${
                    order.status === "pending"
                      ? "bg-amber-50 text-amber-700"
                      : order.status === "paid"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-green-50 text-green-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
