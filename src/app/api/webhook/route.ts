import pushToQueue from "@/lib/pushToQueue";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const receivedSecret = request.headers.get("authorization");
    const storedSecret = process.env.WEBHOOK_SECRET;

    if (!receivedSecret || receivedSecret !== storedSecret) {
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