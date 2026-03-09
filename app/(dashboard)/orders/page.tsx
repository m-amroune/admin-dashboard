import { prisma } from "@/lib/prisma";
import Link from "next/link";
export const dynamic = "force-dynamic";

// Server action to update the status of an order.
// Receives the order id and the selected status from the form.
async function updateOrderStatus(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));

  if (!["pending", "paid", "shipped"].includes(status)) {
    return;
  }

  await prisma.order.update({
    where: { id },
    data: { status },
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

            <form action={updateOrderStatus} className="flex gap-2">
              <input type="hidden" name="id" value={order.id} />

              <select
                name="status"
                defaultValue={order.status}
                className="rounded-md border px-2 py-1 text-sm"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
              </select>

              <button
                type="submit"
                className="rounded-md border px-3 py-1 hover:bg-gray-100 cursor-pointer"
              >
                Update
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
