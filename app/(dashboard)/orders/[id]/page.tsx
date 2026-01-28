import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

// Order detail page
// Displays a single order and handles invalid or missing IDs
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Resolve dynamic route params (Next.js 16)
  const { id } = await params;
  const orderId = Number(id);

  // Invalid ID
  if (!Number.isInteger(orderId)) {
    notFound();
  }

  // Fetch order from database
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  // Order not found
  if (!order) {
    notFound();
  }

  return (
    <div>
      <h1>Order detail</h1>

      <p>Email: {order.email}</p>
      <p>Status: {order.status}</p>
      <p>Created at: {order.createdAt.toLocaleString()}</p>
    </div>
  );
}
