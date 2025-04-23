import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { UserProvider } from "@/components/UserContext";
import prisma from "@/db/prisma";
import { auth } from "@/lib/auth";
import { fetchDatabaseData, getPrismaClient, pingPrismaDatabase, withRetry } from "@/utils/dbUtils";
import { ReactNode } from "react";

interface PagesLayoutProps {
  children: ReactNode;
}

export default async function PagesLayout({ children }: PagesLayoutProps) {
  const session = await auth();

  let user;
  let userData: Record<string, any[]> = {};

  if (!session || !session.user.email) {
    user = null;
  } else {
    user = await prisma.user.findFirst({
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

    const promises = user?.databases.map(async (db) => {
      const dbClient = getPrismaClient(db);

      try {
        const dbReady = await withRetry(() => pingPrismaDatabase(dbClient), 5, 3000);
        if (!dbReady) {
          console.error(`Database ${db.id} not ready after retries.`);
          return [];
        }

        const data = await fetchDatabaseData(dbClient, db.indexSettings[0]?.indexParams[0] || "TRANSFER");

        if (data) {
          return { [db.name]: Array.isArray(data) ? data : [] }; // Return data keyed by db name
        } else {
          console.error(`No data found for database ${db.id}`);
          return {};
        }
      } catch (error) {
        console.error(`Error fetching data from database: ${db.name}`, error);
        return {};
      }
    }) || [];

    const results = await Promise.all(promises);
    userData = results
      .filter((result): result is Record<string, any[]> => typeof result === "object" && !Array.isArray(result))
      .reduce((acc, result) => ({ ...acc, ...result }), {});
  }

  return (
    <UserProvider user={user} userData={userData}>
      <main>
        <Navbar session={session} />
        {children}
        <Footer />
      </main>
    </UserProvider>
  );
}