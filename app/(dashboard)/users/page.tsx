import React from "react";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

// Server action called on form submit.
// Creates a new user, then redirects.
async function createUser(formData: FormData) {
  "use server";
  redirect("/users?submitted=1");
}

export default async function Page() {
  // Fetch all users from the database
  const users = await prisma.user.findMany();

  return (
    <div>
      <h1>Users</h1>

      {/* Render a list of user emails */}
      {users.map((u) => (
        <div key={u.id}>{u.email}</div>
      ))}
      <form action={createUser}>
        <input type="email" name="email" placeholder="Email" />
        <button type="submit">Add user</button>
      </form>
    </div>
  );
}
