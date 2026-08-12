import { prisma } from "@/lib/prisma";
import Link from "next/link";
import OrdersTable from "./OrdersTable";

export const dynamic = "force-dynamic";




// Displays the list of orders and allows status updates
export default async function Page() {
 const orders = await prisma.order.findMany({
  orderBy: { id: "asc" },
  include: {
    user: true,
  },
});

const orderRows = orders.map((order) => ({
  id: order.id,
  email: order.user.email,
  status: order.status,
}));
  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-2xl font-semibold">Orders</h1>

     

      {/* Render the list of orders */}
      <div className="space-y-2">
       <OrdersTable data={orderRows} />
      </div>
    </div>
  );
}
