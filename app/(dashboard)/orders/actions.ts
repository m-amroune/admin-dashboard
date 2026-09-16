"use server";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";


export async function createOrder(formData: FormData) {
  await requireAuth();
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

  if (!["pending", "paid", "shipped", "cancelled"].includes(status)) {
  return;
}

 await prisma.order.create({
  data: {
    userId,
    status,
    reference,
    amountCents,
    statusHistory: {
      create: {
        status,
      },
    },
  },
});

  redirect("/orders");
}

export async function deleteOrder(formData: FormData) {
  await requireAuth();
  const id = Number(formData.get("id"));

  if (!Number.isInteger(id)) {
    return;
  }

  await prisma.order.delete({
    where: { id },
  });

  redirect("/orders");
}

export async function updateOrderStatus(formData: FormData) {
  await requireAuth();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));

  if (!Number.isInteger(id)) {
    return;
  }

  if (!["pending", "paid", "shipped", "cancelled"].includes(status)) {
    return;
  }

  const order = await prisma.order.findUnique({
    where: { id },
    select: { status: true },
  });

  if (!order || order.status === status) {
    redirect("/orders");
  }

  const allowedTransitions: Record<string, string[]> = {
    pending: ["paid", "cancelled"],
    paid: ["shipped", "cancelled"],
    shipped: [],
    cancelled: [],
  };

  if (!allowedTransitions[order.status]?.includes(status)) {
    redirect("/orders");
  }

  await prisma.order.update({
    where: { id },
    data: {
      status,
      statusHistory: {
        create: {
          status,
        },
      },
    },
  });

  redirect("/orders");
}

export async function updateOrdersStatus(formData: FormData) {
  await requireAuth();
  const ids = formData
    .getAll("ids")
    .map(Number)
    .filter(Number.isInteger);

  const status = String(formData.get("status"));

  if (ids.length === 0) {
    return;
  }

  if (!["paid", "shipped"].includes(status)) {
    return;
  }

  const orders = await prisma.order.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    select: {
      id: true,
      status: true,
    },
  });

  const requiredCurrentStatus: Record<string, string> = {
    paid: "pending",
    shipped: "paid",
  };

  const changedIds = orders
    .filter((order) => order.status === requiredCurrentStatus[status])
    .map((order) => order.id);

  if (changedIds.length === 0) {
    redirect("/orders");
  }

  await prisma.$transaction([
    prisma.order.updateMany({
      where: {
        id: {
          in: changedIds,
        },
      },
      data: {
        status,
      },
    }),

    prisma.orderStatusHistory.createMany({
      data: changedIds.map((orderId) => ({
        orderId,
        status,
      })),
    }),
  ]);

  redirect("/orders");
}

export async function deleteOrders(formData: FormData) {
  await requireAuth();
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
