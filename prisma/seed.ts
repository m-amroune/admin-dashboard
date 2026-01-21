import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  await prisma.user.createMany({
    data: [
      { email: "john.doe@example.com", name: "John Doe", role: "admin" },
      { email: "jane.doe@example.com", name: "Jane Doe", role: "user" },
      { email: "jack.doe@example.com", name: "Jack Doe", role: "user" },
    ],
  });

  await prisma.order.deleteMany();
  await prisma.order.createMany({
    data: [
      { email: "john.doe@example.com", status: "pending" },
      { email: "jane.doe@example.com", status: "paid" },
      { email: "jack.doe@example.com", status: "shipped" },
    ],
  });

  console.log("Seed done");
}

main().finally(async () => {
  await prisma.$disconnect();
});
