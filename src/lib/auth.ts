import prisma from "@/db/prisma";
import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Discord from "next-auth/providers/discord";

declare module "next-auth" {
  interface User {
    name?: string | null;
    image?: string | null;
  }
  interface Session {
    user: User;
  }
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
                  provider: "GOOGLE",
                  providerAccountId: sub,
                  refreshToken: profile.refresh_token,
                  accessToken: profile.access_token,
                },
              },
            },
            include: { accounts: true },
          });
        } else {
          const googleAccount = user.accounts.find((acc) => acc.provider === "GOOGLE");

          if (!googleAccount) {
            await prisma.account.create({
              data: {
                provider: "GOOGLE",
                providerAccountId: sub,
                refreshToken: profile.refresh_token,
                accessToken: profile.access_token,
                user: { connect: { id: user.id } },
              },
            });
          }
        }

        return { id: user.id, name: user.name, image: user.image, email: user.email };
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

        let user = await prisma.user.findUnique({
          where: { email },
          include: { accounts: true },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name: login,
              image: avatar_url,
              accounts: {
                create: {
                  provider: "GITHUB",
                  providerAccountId: String(id),
                },
              },
            },
            include: { accounts: true },
          });
        } else {
          const githubAccount = user.accounts.find((acc) => acc.provider === "GITHUB");

          if (!githubAccount) {
            await prisma.account.create({
              data: {
                provider: "GITHUB",
                providerAccountId: String(id),
                user: { connect: { id: user.id } },
              },
            });
          }
        }

        return { id: user.id, name: user.name, image: user.image, email: user.email };
      },
    }),
    Discord({ 
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      async profile(profile) {
        const { email, username, avatar, id } = profile;
        if (!email) {
          throw new Error("Missing email");
        }

        let user = await prisma.user.findUnique({
          where: { email },
          include: { accounts: true },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name: username,
              image: `https://cdn.discordapp.com/avatars/${id}/${avatar}`,
              accounts: {
                create: {
                  provider: "DISCORD",
                  providerAccountId: String(id),
                },
              },
            },
            include: { accounts: true },
          });
        } else {
          const discordAccount = user.accounts.find((acc) => acc.provider === "DISCORD");

          if (!discordAccount) {
            await prisma.account.create({
              data: {
                provider: "DISCORD",
                providerAccountId: String(id),
                user: { connect: { id: user.id } },
              },
            });
          }
        }

        return { id: user.id, name: user.name, image: user.image, email };
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