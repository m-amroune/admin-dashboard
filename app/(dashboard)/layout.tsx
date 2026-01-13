import React from "react";
import Link from "next/link";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 200, borderRight: "1px solid #ddd", padding: 12 }}>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/users">Users</Link>
        <Link href="/orders">Orders</Link>
      </aside>
      <main>{children}</main>
    </div>
  );
};

export default layout;
