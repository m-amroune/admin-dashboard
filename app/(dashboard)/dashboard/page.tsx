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
        <div className="rounded-xl border border-gray-300 bg-white p-5 shadow-lg transition-all">
          <p className="text-sm text-gray-500">Users</p>
          <p className="text-2xl font-semibold">{usersCount}</p>
        </div>
        <div className="rounded-xl border border-gray-300 bg-white p-5 shadow-lg transition-all">
          <p className="text-sm text-gray-500">Orders</p>
          <p className="text-2xl font-semibold">{ordersCount}</p>
        </div>
      </div>

      {/* Orders breakdown by status */}
      <div className="max-w-2xl">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500">
          Orders by status
        </h2>

        <div className="flex gap-3">
          {ordersByStatus.map((item) => (
            <div
              key={item.status}
              className="rounded-full border border-gray-300 bg-gray-50 px-4 py-2 text-sm"
            >
              <span className="capitalize text-gray-600">{item.status}</span>{" "}
              <span className="font-semibold">{item._count.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
