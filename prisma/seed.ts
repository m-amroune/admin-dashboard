import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

const DAY = 24 * 60 * 60 * 1000;

const seedReferenceDate = new Date("2026-09-20T12:00:00.000Z");

function daysBefore(days: number) {
  return new Date(seedReferenceDate.getTime() - days * DAY);
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * DAY);
}

function buildStatusHistory(status: string, createdAt: Date) {
  const history = [
    {
      status: "pending",
      createdAt,
    },
  ];

  if (status === "paid") {
    history.push({
      status: "paid",
      createdAt: addDays(createdAt, 1),
    });
  }

  if (status === "shipped") {
    history.push(
      {
        status: "paid",
        createdAt: addDays(createdAt, 1),
      },
      {
        status: "shipped",
        createdAt: addDays(createdAt, 2),
      },
    );
  }

  if (status === "cancelled") {
    history.push({
      status: "cancelled",
      createdAt: addDays(createdAt, 1),
    });
  }

  return history;
}

async function main() {
  await prisma.order.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: [
      {
        name: "Mayra Ziemann",
        email: "mayra.ziemann@example.com",
        role: "admin",
        createdAt: daysBefore(120),
      },
      {
        name: "Skyla Friesen",
        email: "skyla.friesen@example.com",
        role: "user",
        createdAt: daysBefore(116),
      },
      {
        name: "Korey Steuber",
        email: "korey.steuber@example.com",
        role: "user",
        createdAt: daysBefore(111),
      },
      {
        name: "Gianni Jacobson",
        email: "gianni.jacobson@example.com",
        role: "user",
        createdAt: daysBefore(106),
      },
      {
        name: "Nicola Oberbrunner-Funk",
        email: "nicola.oberbrunnerfunk@example.com",
        role: "admin",
        createdAt: daysBefore(101),
      },
      {
        name: "Seth Howell",
        email: "seth.howell@example.com",
        role: "user",
        createdAt: daysBefore(96),
      },
      {
        name: "Jordan Wunsch",
        email: "jordan.wunsch@example.com",
        role: "user",
        createdAt: daysBefore(91),
      },
      {
        name: "Chloe Osinski",
        email: "chloe.osinski@example.com",
        role: "user",
        createdAt: daysBefore(86),
      },
      {
        name: "Rafael Wilkinson",
        email: "rafael.wilkinson@example.com",
        role: "admin",
        createdAt: daysBefore(81),
      },
      {
        name: "Stella Adams",
        email: "stella.adams@example.com",
        role: "user",
        createdAt: daysBefore(76),
      },
      {
        name: "Arturo Lubowitz",
        email: "arturo.lubowitz@example.com",
        role: "user",
        createdAt: daysBefore(71),
      },
      {
        name: "Angelina Bayer",
        email: "angelina.bayer@example.com",
        role: "user",
        createdAt: daysBefore(67),
      },
      {
        name: "Roberta Jaskolski",
        email: "roberta.jaskolski@example.com",
        role: "user",
        createdAt: daysBefore(63),
      },
      {
        name: "Edna Kautzer",
        email: "edna.kautzer@example.com",
        role: "user",
        createdAt: daysBefore(59),
      },
      {
        name: "Margit Lindqvist",
        email: "margit.lindqvist@example.com",
        role: "user",
        createdAt: daysBefore(55),
      },
    ],
  });

  const demoAdminPasswordHash = await hash("AdminDemo!2026#", 12);

  await prisma.adminAccount.upsert({
    where: {
      email: "demo@admin-dashboard.dev",
    },
    update: {
      passwordHash: demoAdminPasswordHash,
    },
    create: {
      email: "demo@admin-dashboard.dev",
      passwordHash: demoAdminPasswordHash,
    },
  });

  const orders = [
    ["ORD-2026-1001", 12900, "pending", "mayra.ziemann@example.com", 2],
    ["ORD-2026-1002", 7450, "paid", "skyla.friesen@example.com", 4],
    ["ORD-2026-1003", 18900, "shipped", "korey.steuber@example.com", 6],
    ["ORD-2026-1004", 6200, "cancelled", "gianni.jacobson@example.com", 8],
    ["ORD-2026-1005", 24900, "paid", "nicola.oberbrunnerfunk@example.com", 9],
    ["ORD-2026-1006", 4590, "shipped", "seth.howell@example.com", 11],
    ["ORD-2026-1007", 9900, "pending", "jordan.wunsch@example.com", 13],
    ["ORD-2026-1008", 13450, "paid", "chloe.osinski@example.com", 14],
    ["ORD-2026-1009", 31500, "shipped", "rafael.wilkinson@example.com", 16],
    ["ORD-2026-1010", 7990, "cancelled", "stella.adams@example.com", 18],
    ["ORD-2026-1011", 5490, "pending", "arturo.lubowitz@example.com", 19],
    ["ORD-2026-1012", 15900, "shipped", "angelina.bayer@example.com", 21],
    ["ORD-2026-1013", 8900, "paid", "mayra.ziemann@example.com", 22],
    ["ORD-2026-1014", 22500, "shipped", "skyla.friesen@example.com", 24],
    ["ORD-2026-1015", 3290, "pending", "korey.steuber@example.com", 25],
    ["ORD-2026-1016", 11800, "paid", "gianni.jacobson@example.com", 27],
    ["ORD-2026-1017", 27500, "cancelled", "nicola.oberbrunnerfunk@example.com", 29],
    ["ORD-2026-1018", 6700, "shipped", "seth.howell@example.com", 31],
    ["ORD-2026-1019", 18490, "paid", "jordan.wunsch@example.com", 33],
    ["ORD-2026-1020", 4200, "pending", "chloe.osinski@example.com", 34],
    ["ORD-2026-1021", 9600, "shipped", "rafael.wilkinson@example.com", 36],
    ["ORD-2026-1022", 14300, "paid", "stella.adams@example.com", 38],
    ["ORD-2026-1023", 5100, "cancelled", "arturo.lubowitz@example.com", 40],
    ["ORD-2026-1024", 19900, "pending", "angelina.bayer@example.com", 42],
    ["ORD-2026-1025", 27900, "shipped", "mayra.ziemann@example.com", 44],
    ["ORD-2026-1026", 8700, "cancelled", "skyla.friesen@example.com", 46],
    ["ORD-2026-1027", 34900, "shipped", "nicola.oberbrunnerfunk@example.com", 48],
    ["ORD-2026-1028", 7600, "paid", "chloe.osinski@example.com", 50],
  ] as const;

  for (const [reference, amountCents, status, email, daysAgo] of orders) {
    const createdAt = daysBefore(daysAgo);
    const history = buildStatusHistory(status, createdAt);
    const updatedAt = history.at(-1)?.createdAt ?? createdAt;

    await prisma.order.create({
      data: {
        reference,
        amountCents,
        status,
        createdAt,
        updatedAt,
        user: {
          connect: {
            email,
          },
        },
        statusHistory: {
          create: history,
        },
      },
    });
  }

  console.log("Seed done: 15 users, 28 orders");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });