import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
   await prisma.order.deleteMany();
  await prisma.user.deleteMany();
  await prisma.user.createMany({
    data: [
      { email: "john.doe@example.com", name: "John Doe", role: "admin" },
      { email: "jane.doe@example.com", name: "Jane Doe", role: "user" },
      { email: "jack.doe@example.com", name: "Jack Doe", role: "user" },
    ],
  });

await Promise.all([
  prisma.order.create({
    data: {
      reference: "ORD-SEED-001",
      amountCents: 4990,
      status: "pending",
      user: {
        connect: { email: "john.doe@example.com" },
      },
    },
  }),

  prisma.order.create({
    data: {
      reference: "ORD-SEED-002",
      amountCents: 12990,
      status: "paid",
      user: {
        connect: { email: "john.doe@example.com" },
      },
    },
  }),

  prisma.order.create({
    data: {
      reference: "ORD-SEED-003",
      amountCents: 7590,
      status: "paid",
      user: {
        connect: { email: "jane.doe@example.com" },
      },
    },
  }),

  prisma.order.create({
    data: {
      reference: "ORD-SEED-004",
      amountCents: 18900,
      status: "shipped",
      user: {
        connect: { email: "jane.doe@example.com" },
      },
    },
  }),

  prisma.order.create({
    data: {
      reference: "ORD-SEED-005",
      amountCents: 3490,
      status: "shipped",
      user: {
        connect: { email: "jack.doe@example.com" },
      },
    },
  }),
]);



  console.log("Seed done");
}

main().finally(async () => {
  await prisma.$disconnect();
});
