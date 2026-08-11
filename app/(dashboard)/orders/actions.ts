"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function updateOrderStatus(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));

  if (!["pending", "paid", "shipped"].includes(status)) {
    return;
  }

  await prisma.order.update({
    where: { id },
    data: { status },
  });

  redirect("/orders");
}