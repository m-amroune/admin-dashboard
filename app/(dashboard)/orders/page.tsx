import { prisma } from "@/lib/prisma";

export default async function Page() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1>Orders</h1>
      {orders.map((order) => (
        <div key={order.id}>
          {order.email} — {order.status}
        </div>
      ))}
    </div>
  );
}
