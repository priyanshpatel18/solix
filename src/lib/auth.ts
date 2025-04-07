import prisma from "@/db/prisma";
import { Provider } from "@prisma/client";
import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

declare module "next-auth" {
  interface User {
    name?: string | null;
    image?: string | null;
  }
  interface Session {
    user: User;
  }
}

async function handleSignIn(
  email: string,
  name: string,
  picture: string,
  sub: string,
  provider: Provider,
  refreshToken?: string,
  accessToken?: string,
) {
  let user = await prisma.user.findUnique({
    where: { email },
    include: { accounts: true },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name,
        image: picture,
        accounts: {
          create: {
            provider,
            providerAccountId: sub,
            refreshToken: refreshToken ? refreshToken : undefined,
            accessToken: accessToken ? accessToken : undefined,
          },
        },
      },
      include: { accounts: true },
    });
  } else {
    const existingAccount = user.accounts.find((acc) => acc.provider === provider);

    if (!existingAccount) {
      await prisma.account.create({
        data: {
          provider,
          providerAccountId: sub,
          refreshToken: refreshToken ? refreshToken : undefined,
          accessToken: accessToken ? accessToken : undefined,
          user: { connect: { id: user.id } },
        },
      });
    }
  }

  return { id: user.id, name: user.name, image: user.image, email: user.email };
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          scope: "openid profile email",
        },
      },
      async profile(profile) {
        const { email, name, picture, sub } = profile;
        if (!email) {
          throw new Error("Missing email");
        }

        return await handleSignIn(
          email,
          name,
          picture,
          sub,
          "GOOGLE",
          profile.refreshToken,
          profile.accessToken,
        );
      },
    }),
    Github({
      authorization: {
        params: { scope: "read:user user:email" },
      },
      async profile(profile) {
        const { email, login, avatar_url, id } = profile;
        if (!email) {
          throw new Error("Missing email");
        }

        return await handleSignIn(
          email,
          login,
          avatar_url,
          String(id),
          "GITHUB",
        );
      },
    }),
    Discord({
      async profile(profile) {
        const { email, username, avatar, id } = profile;
        if (!email) {
          throw new Error("Missing email");
        }

        return await handleSignIn(
          email,
          username,
          `https://cdn.discordapp.com/avatars/${id}/${avatar}`,
          String(id),
          "DISCORD",
          profile.refreshToken,
          profile.accessToken,
        );
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.id = user.id;
        token.name = user.name || null;
        token.image = user.image || null;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.name = token.name as string | null;
      session.user.image = token.image as string | null;
      session.user.email = token.email as string;
      return session;
    },
  },
});