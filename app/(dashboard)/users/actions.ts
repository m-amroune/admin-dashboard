"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function deleteUser(formData: FormData) {
  const id = Number(formData.get("id"));

  const orderCount = await prisma.order.count({
    where: { userId: id },
  });

  if (orderCount > 0) {
    redirect("/users?error=user_has_orders");
  }

  await prisma.user.delete({
    where: { id },
  });

  redirect("/users?deleted=1");
}

export async function toggleRole(formData: FormData) {
  const id = Number(formData.get("id"));
  const currentRole = String(formData.get("role"));

  const nextRole = currentRole === "admin" ? "user" : "admin";

  await prisma.user.update({
    where: { id },
    data: { role: nextRole },
  });

  redirect("/users?updated=1");
}