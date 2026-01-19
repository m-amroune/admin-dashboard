import React from "react";
import { prisma } from "@/lib/prisma";

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
    </div>
  );
}
