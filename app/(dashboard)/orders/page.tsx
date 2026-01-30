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
    <div className="max-w-md">
      <h1 className="mb-6 text-2xl font-semibold">Orders</h1>

      {/* Empty state */}
      {orders.length === 0 && (
        <p className="mb-4 text-sm text-gray-500">No orders found.</p>
      )}

      {/* Render the list of orders */}
      <div className="space-y-2">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between rounded-md border p-3 text-sm"
          >
            <div>
              {/* Link to order detail page */}
              <Link
                href={`/orders/${order.id}`}
                className="font-medium hover:underline"
              >
                {order.email}
              </Link>{" "}
              — <span className="text-gray-500">{order.status}</span>
            </div>

            {/* Button to change the order status */}
            <form action={nextStatus}>
              <input type="hidden" name="id" value={order.id} />
              <input type="hidden" name="status" value={order.status} />
              <button
                type="submit"
                className="cursor-pointer rounded-md border px-3 py-1 hover:bg-gray-100"
              >
                Next status
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
