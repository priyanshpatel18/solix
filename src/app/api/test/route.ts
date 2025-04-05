import prisma from "@/db/prisma";
import { auth } from "@/lib/auth";
import { getDatabaseClient } from "@/utils/dbUtils";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let db: PrismaClient | null = null;

  try {
    // Authentication
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch User and Database Info
    const user = await prisma.user.findFirst({
      where: { email: session.user.email },
      include: { databases: true },
    });

    if (!user || !user.databases.length) {
      return NextResponse.json({ error: "Database not found for user" }, { status: 404 });
    }

    const dbConfig = user.databases[0];
    db = await getDatabaseClient(dbConfig);

    // Ensure Table and Insert Data
    // await ensureTableExists(db, "transactions");

    return NextResponse.json({ message: "Transaction inserted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });

  } finally {
    if (db) {
      await db.$disconnect();
      console.log("Database connection closed.");
    }
  }
}
