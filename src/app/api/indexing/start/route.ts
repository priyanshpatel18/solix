import prisma from "@/db";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const HELIUS_MAINNET_API = "https://api.helius.xyz/v0/webhooks";
const HELIUS_API_KEY = process.env.HELIUS_API_KEY;
const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL;

export async function POST(request: NextRequest) {
  try {
    if (!HELIUS_API_KEY || !WEBHOOK_URL) {
      return NextResponse.json(
        { error: "Server misconfiguration: Missing Helius API Key or Webhook URL" },
        { status: 500 }
      );
    }

    const { databaseId } = await request.json();
    const session = await auth();

    if (!session || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: { email: session.user.email },
      include: { databases: true, indexRequests: true }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const database = user.databases.find((db) => db.id === databaseId);
    if (!database) return NextResponse.json({ error: "Database not found" }, { status: 404 });

    const indexRequest = user.indexRequests.find((req) => req.databaseId === databaseId);
    if (!indexRequest) return NextResponse.json({ error: "Index request not found" }, { status: 404 });

    // Convert IndexCategory to a valid type
    const transactionTypes = mapCategoryToHelius(indexRequest.category);
    if (!transactionTypes.length) {
      return NextResponse.json(
        { error: `Unsupported index category: ${indexRequest.category}` },
        { status: 400 }
      );
    }

    const webhookSecret = crypto.randomBytes(32).toString("hex");
    await prisma.indexRequest.update({
      where: { id: indexRequest.id },
      data: { webhookSecret: webhookSecret },
    });

    // Register webhook with Helius
    const webhookResponse = await fetch(`${HELIUS_MAINNET_API}?api-key=${HELIUS_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        webhookURL: WEBHOOK_URL,
        transactionTypes,
        accountAddresses: [indexRequest.targetAddr],
        webhookType: "raw",
        txnStatus: "all",
        authHeader: webhookSecret
      }),
    });

    const webhookData = await webhookResponse.json();
    if (!webhookResponse.ok) {
      console.error("Helius Webhook Error:", webhookData);
      console.log(webhookResponse);
      return NextResponse.json({ error: webhookData.message || "Webhook registration failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: webhookData }, { status: 200 });
  } catch (error) {
    console.error("Error registering webhook:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

function mapCategoryToHelius(category: string): string[] {
  const categoryMap: Record<string, string[]> = {
    TRANSFER: ["TRANSFER"],
    DEPOSIT: ["DEPOSIT"],
    WITHDRAW: ["WITHDRAW"],
    NFT_SALE: ["NFT_SALE"],
    NFT_MINT: ["NFT_MINT"],
    SWAP: ["SWAP"],
    TOKEN_MINT: ["TOKEN_MINT"],
    LOAN: ["LOAN"],
    STAKE_TOKEN: ["STAKE_TOKEN"],
    BURN: ["BURN"],
  };

  return categoryMap[category] || [];
}