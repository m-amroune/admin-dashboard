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

// Dashboard page (read-only)
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
      <h1>Dashboard</h1>

      {/* Global statistics */}
      <p>Users: {usersCount}</p>
      <p>Orders: {ordersCount}</p>

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
        <button type="submit">Logout</button>
      </form>
    </div>
  );
};

export default page;
