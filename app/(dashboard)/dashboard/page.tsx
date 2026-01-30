import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

// Server Action: log out the user
// Deletes the session cookie and redirects to the login page
async function logout() {
  "use server";

  const cookieStore = await cookies();
  cookieStore.delete("dh_session");

  redirect("/login");
}

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
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Dashboard</h1>

      {/* Global statistics */}
      <div className="grid grid-cols-2 gap-4 mb-6 max-w-2xl">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Users</p>
          <p className="text-2xl font-semibold">{usersCount}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Orders</p>
          <p className="text-2xl font-semibold">{ordersCount}</p>
        </div>
      </div>

      {/* Orders breakdown by status */}
      <ul>
        {ordersByStatus.map((item) => (
          <li key={item.status}>
            {item.status}: {item._count.status}
          </li>
        ))}
      </ul>

      {/* Logout action */}
      <form action={logout}>
        <button
          type="submit"
          className="mt-4 rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-100 cursor-pointer"
        >
          Logout
        </button>
      </form>
    </div>
  );
};

export default page;
