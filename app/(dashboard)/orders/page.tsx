import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

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

  redirect("/orders");
}

// Orders page
// Displays the list of orders and allows status updates
export default async function Page() {
  const orders = await prisma.order.findMany({
    orderBy: { id: "asc" },
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
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-sm shadow-sm"
          >
            <div className="flex flex-col gap-2">
              {/* Link to order detail page */}
              <Link
                href={`/orders/${order.id}`}
                className="text-sm font-medium text-gray-800 hover:underline"
              >
                {order.email}
              </Link>

              <span className="w-fit rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium capitalize text-gray-600">
                {order.status}
              </span>
            </div>

            <form
              action={updateOrderStatus}
              className="flex items-center gap-3"
            >
              <input type="hidden" name="id" value={order.id} />

              <select
                name="status"
                defaultValue={order.status}
                aria-label="Order status"
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
              </select>

              <button
                type="submit"
                className="rounded-lg border border-slate-700 bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-600 cursor-pointer"
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
