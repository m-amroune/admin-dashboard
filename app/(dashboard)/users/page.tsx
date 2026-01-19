import React from "react";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

// Server action called on form submit.
// Creates a new user, then redirects.
async function createUser(formData: FormData) {
  "use server";
  redirect("/users?submitted=1");
}
// Server action to delete a user by id
async function deleteUser(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  await prisma.user.delete({ where: { id } });
}

export default async function Page() {
  // Fetch all users from the database
  const users = await prisma.user.findMany();

  return (
    <div>
      <h1>Users</h1>

      {/* Render a list of user emails */}
      {users.map((u) => (
        <div key={u.id}>
          {u.email}
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
