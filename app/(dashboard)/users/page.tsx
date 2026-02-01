import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

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
      <div className="space-y-2 max-w-md">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between rounded-md border p-3 text-sm"
          >
            <div>
              {user.email} — <span className="text-gray-500">{user.role}</span>
            </div>

            <div className="flex gap-2">
              <form action={toggleRole}>
                <input type="hidden" name="id" value={user.id} />
                <input type="hidden" name="role" value={user.role} />
                <button
                  type="submit"
                  className="rounded-md border px-3 py-1 hover:bg-gray-100 cursor-pointer"
                >
                  {user.role === "admin" ? "Remove admin" : "Make admin"}
                </button>
              </form>

              <form action={deleteUser}>
                <input type="hidden" name="id" value={user.id} />
                <button
                  type="submit"
                  className="rounded-md border px-3 py-1 text-red-600 hover:bg-red-50 cursor-pointer"
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
        className="mt-6 flex max-w-md items-center justify-center gap-4"
      >
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-56 rounded-md border px-3 py-2 text-sm"
        />

        <button
          type="submit"
          className="cursor-pointer rounded-md border px-6 py-2 text-sm hover:bg-gray-100"
        >
          Add user
        </button>
      </form>
    </div>
  );
}
