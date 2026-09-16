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

        const admin = await prisma.adminAccount.findUnique({
          where: {
            email: parsed.data.email,
          },
        });

        if (!admin) {
          return null;
        }

        const passwordIsValid = await compare(
          parsed.data.password,
          admin.passwordHash,
        );

        if (!passwordIsValid) {
          return null;
        }

        return {
          id: String(admin.id),
          email: admin.email,
          name: "Demo Admin",
        };
      },
    }),
  ],
});