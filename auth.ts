import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
  },

  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
  },

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const authorizeStart = performance.now();

        const prismaStart = performance.now();

        const admin = await prisma.adminAccount.findUnique({
          where: {
            email: parsed.data.email,
          },
        });

        console.log(
          `[perf][auth] Prisma: ${(performance.now() - prismaStart).toFixed(1)} ms`,
        );

        if (!admin) {
          return null;
        }

        const bcryptStart = performance.now();

        const passwordIsValid = await compare(
          parsed.data.password,
          admin.passwordHash,
        );

        console.log(
          `[perf][auth] bcrypt: ${(performance.now() - bcryptStart).toFixed(1)} ms`,
        );

        if (!passwordIsValid) {
          return null;
        }
        console.log(
          `[perf][auth] authorize total: ${(performance.now() - authorizeStart).toFixed(1)} ms`,
        );
        return {
          id: String(admin.id),
          email: admin.email,
          name: "Demo Admin",
        };
      },
    }),
  ],
});
