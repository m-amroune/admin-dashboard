import { prisma } from "@/lib/prisma";
import OrdersTable from "./OrdersTable";
import { createOrder } from "./actions";
export const dynamic = "force-dynamic";




// Displays the list of orders and allows status updates
export default async function Page() {
const [orders, users] = await Promise.all([
  prisma.order.findMany({
    orderBy: { id: "asc" },
    include: {
      user: true,
    },
  }),
  prisma.user.findMany({
    orderBy: { email: "asc" },
    select: {
      id: true,
      email: true,
      name: true,
    },
  }),
]);

const orderRows = orders.map((order) => ({
  id: order.id,
  email: order.user.email,
  status: order.status,
}));
  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-semibold">Orders</h1>

     

      {/* Render the list of orders */}
      <div className="space-y-2">
       <form
  action={createOrder}
  className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
>
  <h2 className="mb-4 text-sm font-semibold text-slate-800">
    Add order
  </h2>

  <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
    <div className="flex-1">
      <label htmlFor="userId" className="sr-only">
  User
</label>

      <select
        id="userId"
        name="userId"
        required
        defaultValue=""
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
      >
        <option value="" disabled>
          Select user...
        </option>

        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name ? `${user.name} — ${user.email}` : user.email}
          </option>
        ))}
      </select>
    </div>

    <input type="hidden" name="status" value="pending" />

    <button
      type="submit"
      className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
    >
      Add order
    </button>
  </div>
</form> 
       <OrdersTable data={orderRows} />
      </div>
    </div>
  );
}
