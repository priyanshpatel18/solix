import pushToQueue from "@/lib/pushToQueue";
import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_DEVNET_SECRET = process.env.WEBHOOK_DEVNET_SECRET;
const WEBHOOK_MAINNET_SECRET = process.env.WEBHOOK_MAINNET_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const receivedSecret = request.headers.get("authorization");

    if (!receivedSecret || (receivedSecret !== `Bearer ${WEBHOOK_DEVNET_SECRET}` && receivedSecret !== `Bearer ${WEBHOOK_MAINNET_SECRET}`)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { accountAddress, transactionType, data } = body;
    if (!accountAddress || !transactionType || !data) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Push the data to Redis
    const queueData = {
      accountAddress,
      transactionType,
      data,
    };

    await pushToQueue(queueData);

    return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}