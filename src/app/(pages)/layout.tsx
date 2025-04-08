import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { UserProvider } from "@/components/UserContext";
import prisma from "@/db/prisma";
import { auth } from "@/lib/auth";
import { ReactNode } from "react";

interface PagesLayoutProps {
  children: ReactNode;
}

export default async function PagesLayout({ children }: PagesLayoutProps) {
  const session = await auth();

  if (!session || !session.user.email) {
    return (
      <main>
        <Navbar session={session} />
        {children}
        <Footer />
      </main>
    );
  }

  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email
    },
    include: {
      databases: {
        include: {
          indexSettings: true,
        }
      },
      indexSettings: {
        include: {
          database: true,
        }
      },
    }
  });

  return (
    <UserProvider user={user}>
      <main>
        <Navbar session={session} />
        {children}
        <Footer />
      </main>
    </UserProvider>
  );
}
