"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";

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

  const amount = Number(formData.get("amount"));

  if (!Number.isFinite(amount) || amount <= 0) {
    return;
  }

  const amountCents = Math.round(amount * 100);
  const reference = `ORD-${randomUUID().slice(0, 8).toUpperCase()}`;

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
      reference,
      amountCents,
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

export async function updateOrdersStatus(formData: FormData) {
  const ids = formData.getAll("ids").map(Number).filter(Number.isInteger);

  const status = String(formData.get("status"));

  if (ids.length === 0) {
    return;
  }

  if (!["paid", "shipped"].includes(status)) {
    return;
  }

  await prisma.order.updateMany({
    where: {
      id: {
        in: ids,
      },
    },
    data: {
      status,
    },
  });

  redirect("/orders");
}

export async function deleteOrders(formData: FormData) {
  const ids = formData.getAll("ids").map(Number).filter(Number.isInteger);

  if (ids.length === 0) {
    return;
  }

  await prisma.order.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  redirect("/orders");
}
