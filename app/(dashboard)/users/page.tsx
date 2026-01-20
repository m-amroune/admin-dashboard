import React from "react";
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
    <div>
      <h1>Users</h1>
      {isCreated && <p>User created successfully</p>}

      {/* Render a list of user emails */}
      {users.map((u) => (
        <div key={u.id}>
          {u.email} — {u.role}
          <form action={toggleRole}>
            <input type="hidden" name="id" value={u.id} />
            <input type="hidden" name="role" value={u.role} />
            <button type="submit">Toggle role</button>
          </form>
          <form action={deleteUser}>
            <input type="hidden" name="id" value={u.id} />
            <button type="submit">Delete</button>
          </form>
        </div>
      ))}

      <form action={createUser}>
        <input type="email" name="email" placeholder="Email" />
        <button type="submit">Add user</button>
      </form>
    </div>
  );
}
