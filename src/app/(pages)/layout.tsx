import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { auth } from "@/lib/auth";
import { UserProvider } from "@/components/SessionProvder";
import { ReactNode } from "react";
import prisma from "@/db";

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
      databases: true,
      indexRequests: true,
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
