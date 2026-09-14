import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

// Order detail page
// Displays a single order and handles invalid or missing IDs
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
 
  const { id } = await params;
const orderId = Number(id);

// Invalid ID
if (!Number.isInteger(orderId)) {
  notFound();
}

// Fetch order with user and status history
const order = await prisma.order.findUnique({
  where: { id: orderId },
  include: {
    user: true,
    statusHistory: {
      orderBy: {
        createdAt: "desc",
      },
    },
  },
});

  // Order not found
  if (!order) {
    notFound();
  }

  return (
    <div>
      <h1>Order detail</h1>
     
      <p>Reference: {order.reference}</p>

      <p>
        Amount:{" "}
        {order.amountCents === null
          ? "Not set"
          : `${(order.amountCents / 100).toFixed(2)} €`}
      </p>

      <p>Email: {order.user.email}</p>
      <p>Status: {order.status}</p>
      <p>Created at: {order.createdAt.toLocaleString()}</p>
      <p>Updated at: {order.updatedAt.toLocaleString()}</p>
      {/* Status history */}
<div className="mt-6">
  <h2 className="mb-3 text-lg font-semibold text-slate-900">
    Status history
  </h2>

  <div className="space-y-2">
    {order.statusHistory.map((entry) => (
      <div
        key={entry.id}
        className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3"
      >
        <span className="font-medium capitalize text-slate-700">
          {entry.status}
        </span>

        <span className="text-sm text-slate-500">
          {entry.createdAt.toLocaleString()}
        </span>
      </div>
    ))}
  </div>
</div>
    </div>
  );
}
