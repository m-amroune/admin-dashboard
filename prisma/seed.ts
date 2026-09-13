import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

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

// Seed orders in a predictable chronological order
const orders = [
  {
    reference: "ORD-SEED-001",
    amountCents: 4990,
    status: "pending",
    email: "john.doe@example.com",
  },
  {
    reference: "ORD-SEED-002",
    amountCents: 12990,
    status: "paid",
    email: "john.doe@example.com",
  },
  {
    reference: "ORD-SEED-003",
    amountCents: 7590,
    status: "paid",
    email: "jane.doe@example.com",
  },
  {
    reference: "ORD-SEED-004",
    amountCents: 18900,
    status: "shipped",
    email: "jane.doe@example.com",
  },
  {
    reference: "ORD-SEED-005",
    amountCents: 3490,
    status: "shipped",
    email: "jack.doe@example.com",
  },
];

for (const order of orders) {
  await prisma.order.create({
    data: {
      reference: order.reference,
      amountCents: order.amountCents,
      status: order.status,
      user: {
        connect: { email: order.email },
      },
    },
  });
}


  console.log("Seed done");
}

main().finally(async () => {
  await prisma.$disconnect();
});
