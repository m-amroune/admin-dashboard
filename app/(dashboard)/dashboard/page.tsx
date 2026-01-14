import React from "react";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function logout() {
  "use server";

  const cookieStore = await cookies();
  cookieStore.delete("dh_session");

  redirect("/login");
}

const page = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <form action={logout}>
        <button type="submit">Logout</button>
      </form>
    </div>
  );
};

export default page;
