import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import UsersTable from "./UsersTable";
import { requireAuth } from "@/lib/require-auth";
export const dynamic = "force-dynamic";
import AddUserDialog from "./AddUserDialog";

// Server action called on form submit.
// Creates a new user, then redirects.
async function createUser(formData: FormData) {
  "use server";
    await requireAuth();
  const email = String(formData.get("email") || "").trim();
  const name = String(formData.get("name") || "").trim();

  if (!email) redirect("/users?error=missing_email");
  if (!name) redirect("/users?error=missing_name");

  await prisma.user.create({
    data: {
      email,
      name,
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
  const search = params.search?.trim() ?? "";
  const role = params.role ?? "";
  const sort = params.sort ?? "";
  const direction: "asc" | "desc" = params.order === "desc" ? "desc" : "asc";

  const page = Math.max(Number(params.page) || 1, 1);
  const pageSize = 5;
  const skip = (page - 1) * pageSize;
  const hasOrdersError = params["error"] === "user_has_orders";
  const isCreated = params["created"] === "1";

  const validRoles = ["user", "admin"];

  const where = {
    ...(search
      ? {
          OR: [
            {
              email: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
    ...(validRoles.includes(role) ? { role } : {}),
  };

  const [users, totalUsers] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: pageSize,
      orderBy:
  sort === "role"
    ? { role: direction }
    : sort === "email"
      ? { email: direction }
      : { id: "asc" },
    }),

    prisma.user.count({
      where,
    }),
  ]);

  const totalPages = Math.max(Math.ceil(totalUsers / pageSize), 1);
  if (page > totalPages) {
  const query = new URLSearchParams();

  if (search) {
    query.set("search", search);
  }

  if (validRoles.includes(role)) {
    query.set("role", role);
  }

  if (sort === "email" || sort === "role") {
    query.set("sort", sort);
  }

  if (direction === "desc") {
    query.set("order", "desc");
  }

  const queryString = query.toString();

  redirect(queryString ? `/users?${queryString}` : "/users");
}

  return (
    <div className="max-w-4xl lg:ml-8">
  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Users
        </h1>

        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {totalUsers}
        </span>
      </div>

      <p className="mt-1 text-sm text-slate-500">
        Manage user profiles and access roles.
      </p>
    </div>

    <AddUserDialog action={createUser} />
  </div>
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
         page={page}
  totalPages={totalPages}
      />
    </div>
  );
}
