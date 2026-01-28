import { prisma } from "@/lib/prisma";
import Link from "next/link";

// Server action to move an order to the next status
async function nextStatus(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));

  const next =
    status === "pending" ? "paid" : status === "paid" ? "shipped" : "pending";

  await prisma.order.update({
    where: { id },
    data: { status: next },
  });
}

// Orders page
// Displays the list of orders and allows status updates
export default async function Page() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1>Orders</h1>

      {/* Empty state */}
      {orders.length === 0 && <p>No orders found.</p>}

      {/* Render the list of orders */}
      {orders.map((order) => (
        <div key={order.id}>
          {/* Link to order detail page */}
          <Link href={`/orders/${order.id}`}>{order.email}</Link> —
          {order.status}
          {/* Button to change the order status */}
          <form action={nextStatus}>
            <input type="hidden" name="id" value={order.id} />
            <input type="hidden" name="status" value={order.status} />
            <button type="submit">Next status</button>
          </form>
        </div>
      ))}
    </div>
  );
}
