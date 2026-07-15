import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";

// Server action called on form submit.
// Creates a new user, then redirects.
async function createUser(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "").trim();
  if (!email) redirect("/users?error=missing_email");

  await prisma.user.create({ data: { email } });
  redirect("/users?created=1");
}

// Server action to delete a user by id
async function deleteUser(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  await prisma.user.delete({ where: { id } });
  redirect("/users?deleted=1");
}

// Server action to switch a user's role.
// If the user is admin, set role to user
async function toggleRole(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  const currentRole = String(formData.get("role"));

  const nextRole = currentRole === "admin" ? "user" : "admin";

  await prisma.user.update({
    where: { id },
    data: { role: nextRole },
  });

  redirect("/users?updated=1");
}

type SearchParams = Record<string, string | undefined>;

export default async function Page({
  searchParams,
}: {
  searchParams?: SearchParams | Promise<SearchParams>;
}) {
  // Fetch all users from the database
  const params = await Promise.resolve(searchParams ?? {});
  const isCreated = params["created"] === "1";

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-semibold">Users</h1>

      {isCreated && (
        <p className="mb-4 text-sm text-green-600">User created successfully</p>
      )}

      {/* Empty state */}
      {users.length === 0 && (
        <p className="mb-4 text-sm text-gray-500">No users found.</p>
      )}

      {/* Render a list of user emails */}
      <div className="space-y-2 max-w-lg">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-sm shadow-sm"
          >
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-800">
                {user.email}
              </span>

              <span
                className={`w-fit rounded-full border px-3 py-1 text-sm font-medium ${
                  user.role === "admin"
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-gray-50 text-gray-600"
                }`}
              >
                {user.role}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <form action={toggleRole}>
                <input type="hidden" name="id" value={user.id} />
                <input type="hidden" name="role" value={user.role} />
                <button
                  type="submit"
                  className="w-36 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 cursor-pointer"
                >
                  {user.role === "admin" ? "Remove admin" : "Make admin"}
                </button>
              </form>

              <form action={deleteUser}>
                <input type="hidden" name="id" value={user.id} />
                <button
                  type="submit"
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition cursor-pointer"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
      {/* Create user */}
      <form
        action={createUser}
        className="mt-8 flex max-w-lg items-center gap-3"
      >
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-64 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-base text-gray-700 outline-none focus:border-blue-500"
        />

        <button
          type="submit"
          className="cursor-pointer rounded-lg border border-slate-700 bg-slate-700 px-5 py-2.5 text-base font-medium text-white transition hover:bg-slate-600"
        >
          Add user
        </button>
      </form>
    </div>
  );
}
