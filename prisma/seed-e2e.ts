import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.order.deleteMany();
  await prisma.user.deleteMany();
  await prisma.adminAccount.deleteMany();

  await prisma.user.createMany({
    data: [
      {
        email: "alice.e2e@example.com",
        name: "Alice E2E",
        role: "admin",
      },
      {
        email: "bob.e2e@example.com",
        name: "Bob E2E",
        role: "user",
      },
      {
        email: "charlie.e2e@example.com",
        name: "Charlie E2E",
        role: "user",
      },
      {
        email: "diana.e2e@example.com",
        name: "Diana E2E",
        role: "user",
      },
      {
        email: "eric.e2e@example.com",
        name: "Eric E2E",
        role: "user",
      },
      {
        email: "fiona.e2e@example.com",
        name: "Fiona E2E",
        role: "user",
      },
    ],
  });

  const passwordHash = await hash("AdminDemo!2026#", 12);

  await prisma.adminAccount.create({
    data: {
      email: "demo@admin-dashboard.dev",
      passwordHash,
    },
  });

  const orders = [
    {
      reference: "ORD-E2E-001",
      amountCents: 4990,
      status: "pending",
      email: "alice.e2e@example.com",
    },
    {
      reference: "ORD-E2E-002",
      amountCents: 7990,
      status: "pending",
      email: "bob.e2e@example.com",
    },
    {
      reference: "ORD-E2E-003",
      amountCents: 12990,
      status: "paid",
      email: "charlie.e2e@example.com",
    },
    {
      reference: "ORD-E2E-004",
      amountCents: 18900,
      status: "paid",
      email: "diana.e2e@example.com",
    },
    {
      reference: "ORD-E2E-005",
      amountCents: 3490,
      status: "shipped",
      email: "eric.e2e@example.com",
    },
    {
      reference: "ORD-E2E-006",
      amountCents: 9990,
      status: "cancelled",
      email: "fiona.e2e@example.com",
    },
    {
      reference: "ORD-E2E-007",
      amountCents: 6490,
      status: "pending",
      email: "alice.e2e@example.com",
    },
  ];

  for (const order of orders) {
    await prisma.order.create({
      data: {
        reference: order.reference,
        amountCents: order.amountCents,
        status: order.status,
        user: {
          connect: {
            email: order.email,
          },
        },
        statusHistory: {
          create: {
            status: order.status,
          },
        },
      },
    });
  }

  console.log("E2E seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });