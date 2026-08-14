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

export async function createOrder(formData: FormData) {
  const userId = Number(formData.get("userId"));
  const status = String(formData.get("status") || "pending");

  if (!Number.isInteger(userId)) {
    return;
  }

  if (!["pending", "paid", "shipped"].includes(status)) {
    return;
  }

  await prisma.order.create({
    data: {
      userId,
      status,
    },
  });

  redirect("/orders");
}

export async function deleteOrder(formData: FormData) {
  const id = Number(formData.get("id"));

  if (!Number.isInteger(id)) {
    return;
  }

  await prisma.order.delete({
    where: { id },
  });

  redirect("/orders");
}