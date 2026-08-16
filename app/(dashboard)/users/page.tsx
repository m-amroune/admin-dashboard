import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import UsersTable from "./UsersTable";
export const dynamic = "force-dynamic";

// Server action called on form submit.
// Creates a new user, then redirects.
async function createUser(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "").trim();
const name = String(formData.get("name") || "").trim();

if (!email) redirect("/users?error=missing_email");

await prisma.user.create({
  data: {
    email,
    name: name || null,
  },
});
  redirect("/users?created=1");
}




type SearchParams = Record<string, string | undefined>;

export default async function Page({
  searchParams,
}: {
  searchParams?: SearchParams | Promise<SearchParams>;
}) {
  // Fetch all users from the database
  const params = await Promise.resolve(searchParams ?? {});
  const hasOrdersError = params["error"] === "user_has_orders";
  const isCreated = params["created"] === "1";

const users = await prisma.user.findMany({
  orderBy: { id: "asc" },
});

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-semibold">Users</h1>
      {hasOrdersError && (
  <p className="mb-4 text-base text-red-600">
    This user cannot be deleted because they have existing orders.
  </p>
)}

      {isCreated && (
        <p className="mb-4 text-sm text-green-600">User created successfully</p>
      )}
<UsersTable
  data={users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }))}
/>
      {/* Create user */}
      <form
        action={createUser}
        className="mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row sm:items-center"
      >
        <input
  type="text"
  name="name"
  placeholder="Name (optional)"
  className="h-12 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-4 text-base text-slate-700 outline-none transition focus:border-blue-500"
/>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="h-12 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-4 text-base text-slate-700 outline-none transition focus:border-blue-500"
        />

        <button
          type="submit"
          className="h-12 shrink-0 whitespace-nowrap rounded-lg bg-slate-800 px-6 text-base font-semibold text-white transition hover:bg-slate-700"
        >
          Add user
        </button>
      </form>
    </div>
  );
}
