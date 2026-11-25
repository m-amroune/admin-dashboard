import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import { ShoppingBag, Users, WalletCards } from "lucide-react";
import OrderValueChart from "./OrderValueChart";

// Displays global statistics and provides a logout action
const page = async () => {
  const [recentOrders, usersCount, orderStats] = await Promise.all([
    prisma.order.findMany({
      take: 5,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.user.count(),
    prisma.order.groupBy({
      by: ["status"],
      _count: { status: true },
      _sum: { amountCents: true },
    }),
  ]);

  const ordersCount = orderStats.reduce(
    (total, item) => total + item._count.status,
    0,
  );

  const paidSalesCents =
    orderStats.find((item) => item.status === "paid")?._sum.amountCents ?? 0;

  const ordersByStatus = orderStats;

  // Revenue from paid orders
  const sales = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(paidSalesCents / 100);

  // Values of the latest orders for the chart
  const orderValues = [...recentOrders].reverse().map((order) => ({
    reference: order.reference,
    amount: (order.amountCents ?? 0) / 100,
  }));

  // Keep statuses in workflow order
  const statusOrder = ["pending", "paid", "shipped", "cancelled"];

  ordersByStatus.sort(
    (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status),
  );

  return (
    <div className="fade-in-up lg:ml-8">
     <h1 className="mb-6 text-2xl font-bold tracking-tight text-slate-950">
        Dashboard
      </h1>

      {/* Global statistics */}
      <div className="mb-8 grid max-w-4xl gap-4 md:grid-cols-3">
        {/* Users */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-medium text-slate-500">Users</p>
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
              <p className="text-base font-medium text-slate-500">Orders</p>
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
              <p className="text-base font-medium text-slate-500">Sales</p>
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
          <h2 className="text-xl font-semibold text-slate-900">
            Orders by status
          </h2>

          <div className="mt-5 space-y-4">
            {ordersByStatus.map((item) => (
              <div
                key={item.status}
                className="flex items-center justify-between"
              >
                <span className="text-base font-medium capitalize text-slate-600">
                  {item.status}
                </span>

                <span className="flex min-w-8 items-center justify-center rounded-full bg-slate-100 px-2.5 py-1 text-base font-semibold text-slate-700">
                  {item._count.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Order values chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-slate-900">
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
          <h2 className="text-xl font-semibold text-slate-900">
            Recent orders
          </h2>

          <span className="text-sm text-slate-500">Latest 5</span>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200">
          <div className="hidden grid-cols-[1fr_1.5fr_0.8fr_0.8fr] gap-4 border-b border-slate-200 bg-slate-100 px-4 py-3 text-[15px] font-semibold text-slate-600 md:grid">
            <span>Reference</span>
            <span>Customer</span>
            <span>Amount</span>
            <span>Status</span>
          </div>

          <div className="divide-y divide-slate-200">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="grid grid-cols-2 items-center gap-4 px-4 py-4 text-base md:grid-cols-[1fr_1.5fr_0.8fr_0.8fr]"
              >
                <span className="break-words font-medium text-slate-800">
                  {order.reference}
                </span>

                <span className="min-w-0 break-words font-medium text-slate-800">
                  {order.user.name?.trim() || order.user.email}
                </span>

                <span className="text-slate-700">
                  {order.amountCents === null
                    ? "Not set"
                    : `$${(order.amountCents / 100).toFixed(2)}`}
                </span>

                <span className="font-medium capitalize text-slate-700">
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
