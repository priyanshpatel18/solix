import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { PrismaClient } from "@prisma/client";
import { decrypt } from "@/lib/encrypt";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const receivedSecret = request.headers.get("authorization");

    console.log("Webhook received:", body);

    const { transactionTypes, accountAddresses, data } = body;
    if (!transactionTypes || !accountAddresses || !data || !receivedSecret) {
      return NextResponse.json({ error: "Invalid webhook data" }, { status: 400 });
    }

    const indexRequest = await prisma.indexRequest.findFirst({
      where: { targetAddr: { in: accountAddresses } },
      include: { database: true },
    });

    if (!indexRequest || !indexRequest.database) return NextResponse.json({ error: "No matching database found" }, { status: 404 });

    // Verify the webhook secret
    if (indexRequest.webhookSecret !== receivedSecret) return NextResponse.json({ error: "Unauthorized webhook" }, { status: 403 });

    const { database } = indexRequest;

    // Decrypt the database credentials
    const password = decrypt(database.password);
    const userPrisma = new PrismaClient({
      datasources: { db: { url: `postgresql://${database.username}:${password}@${database.host}:${database.port}/${database.dbName}` } },
    });

    // Ensure `indexedData` table exists
    await userPrisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "IndexedData" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "category" TEXT NOT NULL,
        "data" JSONB NOT NULL,
        "receivedAt" TIMESTAMPTZ DEFAULT now(),
        "databaseId" UUID NOT NULL
      );
    `);

    // Insert webhook data into user's database
    await userPrisma.indexedData.create({
      data: {
        category: indexRequest.category,
        data: JSON.stringify(data),
        receivedAt: new Date(),
        databaseId: database.id,
      },
    });

    console.log(`Webhook data stored in user database: ${database.dbName}`);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
