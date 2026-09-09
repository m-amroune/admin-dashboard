import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

// Displays global statistics and provides a logout action
const page = async () => {
  // Total users count
  const usersCount = await prisma.user.count();

  // Total orders count
  const ordersCount = await prisma.order.count();

  // Orders count by status (pending / paid / shipped)
  const ordersByStatus = await prisma.order.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  const statusOrder = ["pending", "paid", "shipped"];

ordersByStatus.sort(
  (a, b) =>
    statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status),
);

  return (
    <div className="fade-in-up">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-800">
        Dashboard
      </h1>

      {/* Global statistics */}
      <div className="grid grid-cols-2 gap-6 mb-10 max-w-2xl">
        <div className="rounded-xl border border-gray-200 border-t-4 border-t-blue-500 bg-white p-5 shadow-sm transition-all">
          <p className="text-sm font-medium text-gray-700">Users</p>
          <p className="text-2xl font-semibold text-blue-700">{usersCount}</p>
        </div>
        <div className="rounded-xl border border-gray-200 border-t-4 border-t-green-500 bg-white p-5 shadow-sm transition-all">
          <p className="text-sm font-medium text-gray-700">Orders</p>
          <p className="text-2xl font-semibold text-blue-700">{ordersCount}</p>
        </div>
      </div>

      {/* Orders breakdown by status */}
      <div className="max-w-2xl rounded-xl border border-slate-200 border-t-4 border-t-amber-400 bg-white p-5 shadow-sm">
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
    </div>
  );
};

export default page;
