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
      <div className="max-w-2xl">
        <h2 className="mb-4 inline-flex rounded-md bg-amber-50 px-3 py-1.5 text-[15px] font-bold uppercase tracking-wide text-amber-900">
          Orders by status
        </h2>

        <div className="flex gap-3">
          {ordersByStatus.map((item) => (
            <div
              key={item.status}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
            >
              <span className="font-medium capitalize text-slate-600">
                {item.status}
              </span>

              <span className="flex h-7 min-w-7 items-center justify-center rounded-md border border-amber-200 bg-white px-2 text-sm font-bold text-amber-800">
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
