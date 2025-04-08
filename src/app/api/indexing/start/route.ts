import prisma from "@/db/prisma";
import { auth } from "@/lib/auth";
import { cacheData, pushDataToRedis } from "@/lib/cacheData";
import { IndexParams, IndexSettings, Params } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const HELIUS_MAINNET_API_KEY = process.env.HELIUS_MAINNET_API_KEY;
const HELIUS_DEVNET_API_KEY = process.env.HELIUS_DEVNET_API_KEY;
const WEBHOOK_DEVNET_SECRET = process.env.WEBHOOK_DEVNET_SECRET;
const WEBHOOK_MAINNET_SECRET = process.env.WEBHOOK_MAINNET_SECRET;
const MAINNET_WEBHOOK_ID = process.env.MAINNET_WEBHOOK_ID;
const DEVNET_WEBHOOK_ID = process.env.DEVNET_WEBHOOK_ID;
const WEBHOOK_CALLBACK_URL = process.env.WEBHOOK_CALLBACK_URL || "http://localhost:3000/api/webhook";
const HELIUS_MAINNET_API = "https://api.helius.xyz/v0"
const HELIUS_DEVNET_API = "https://api-devnet.helius.xyz/v0"

export async function POST(request: NextRequest) {
  try {
    // Check for missing environment variables
    validateEnvVars();

    const { databaseId } = await request.json();
    if (!databaseId) {
      return NextResponse.json({ error: "Missing database ID" }, { status: 400 });
    }

    // Authenticate user
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Check for IndexSettings
    const indexSettings = getIndexSettings(user, databaseId);
    if (!indexSettings) return NextResponse.json({ error: "Index request not found" }, { status: 404 });

    // Check for WebhookParams
    let webhookParams = await prisma.params.findFirst();
    if (!webhookParams) {
      webhookParams = await prisma.params.create({
        data: {
          accountAddresses: [],
          transactionTypes: [],
        },
      });
    }

    // Register webhook
    const usedApi = await updateHeliusWebhook(indexSettings, webhookParams);

    // Start settings in redis
    await cacheData(
      user,
      indexSettings.database,
      indexSettings.targetAddr,
      indexSettings.indexType,
      indexSettings.indexParams,
      indexSettings.cluster
    );

    // Fetch and store past transactions
    await pushDataToRedis(indexSettings.database, await getPastData(indexSettings));

    // Update IndexSettings
    await updateDatabaseRecords(user.id, indexSettings.id, usedApi);

    return NextResponse.json(
      { message: "Indexing has been initiated. Syncing historical transactions now..." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error registering webhook:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

function validateEnvVars() {
  if (!HELIUS_MAINNET_API_KEY || !HELIUS_DEVNET_API_KEY || !WEBHOOK_DEVNET_SECRET || !WEBHOOK_MAINNET_SECRET || !MAINNET_WEBHOOK_ID || !DEVNET_WEBHOOK_ID) {
    throw new Error("Server misconfiguration");
  }
}

async function getAuthenticatedUser() {
  const session = await auth();
  if (!session || !session.user.email) return null;
  return prisma.user.findFirst({
    where: { email: session.user.email },
    include: {
      indexSettings: { include: { database: { include: { user: true } } } },
      databases: true,
    },
  });
}

async function getPastData(indexSettings: IndexSettings) {
  const HELIUS_API = indexSettings.cluster === "DEVNET" ? HELIUS_DEVNET_API : HELIUS_MAINNET_API;
  const HELIUS_API_KEY = indexSettings.cluster === "DEVNET" ? HELIUS_DEVNET_API_KEY : HELIUS_MAINNET_API_KEY;

  const response = await fetch(`${HELIUS_API}/addresses/${indexSettings.targetAddr}/transactions/?api-key=${HELIUS_API_KEY}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Helius API error: ${errorText}`);
  }

  const transactions = await response.json();

  if (!Array.isArray(transactions)) {
    return [];
  }

  return transactions;
}

function getIndexSettings(user: any, databaseId: string) {
  return user.indexSettings.find((req: IndexSettings) => req.databaseId === databaseId);
}

async function updateHeliusWebhook(indexSettings: IndexSettings, webhookParams: Params) {
  const params = indexSettings.indexParams.map(mapParamsToHelius).flat();
  const missingParams = params.filter((param: IndexParams) => !webhookParams.transactionTypes.includes(param));
  let usedApi = false;
  const WEBHOOK_SECRET = indexSettings.cluster === "DEVNET" ? WEBHOOK_DEVNET_SECRET : WEBHOOK_MAINNET_SECRET;
  const WEBHOOK_ID = indexSettings.cluster === "DEVNET" ? DEVNET_WEBHOOK_ID : MAINNET_WEBHOOK_ID;
  const HELIUS_API_KEY = indexSettings.cluster === "DEVNET" ? HELIUS_DEVNET_API_KEY : HELIUS_MAINNET_API_KEY;
  const HELIUS_API_URL = indexSettings.cluster === "DEVNET" ? HELIUS_DEVNET_API : HELIUS_MAINNET_API;

  if (missingParams.length > 0 || !webhookParams.accountAddresses.includes(indexSettings.targetAddr)) {
    usedApi = true;
    const webhookBody = {
      webhookURL: WEBHOOK_CALLBACK_URL,
      webhookType: "enhanced",
      accountAddresses: [...new Set([...webhookParams.accountAddresses, indexSettings.targetAddr])],
      transactionTypes: [...new Set([...webhookParams.transactionTypes, ...missingParams])],
      authHeader: WEBHOOK_SECRET,
      txnStatus: "all",
    };

    try {
      await fetch(`${HELIUS_API_URL}/webhooks/${WEBHOOK_ID}?api-key=${HELIUS_API_KEY}`, {
        method: "PUT",
        headers: {
          "Authorization": `${WEBHOOK_SECRET}`,
        },
        body: JSON.stringify(webhookBody),
      });
    } catch (error) {
      console.error("Error updating webhook:", error);
    }

    await prisma.params.upsert({
      where: { id: webhookParams.id },
      create: {
        accountAddresses: [...new Set([...webhookParams.accountAddresses, indexSettings.targetAddr])],
        transactionTypes: [...new Set([...webhookParams.transactionTypes, ...missingParams])],
      },
      update: {
        accountAddresses: [...new Set([...webhookParams.accountAddresses, indexSettings.targetAddr])],
        transactionTypes: [...new Set([...webhookParams.transactionTypes, ...missingParams])],
      }
    });
  }

  return usedApi;
}

async function updateDatabaseRecords(userId: string, indexSettingsId: string, usedApi: boolean) {
  await prisma.$transaction(async (tx) => {
    if (usedApi) {
      await tx.user.update({
        where: { id: userId },
        data: { credits: { decrement: 100 } }
      });
    }

    await tx.indexSettings.update({
      where: { id: indexSettingsId },
      data: { status: "IN_PROGRESS" },
    });
  });
}

function mapParamsToHelius(category: string): IndexParams[] {
  const paramsMap: Record<string, IndexParams[]> = {
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

  return paramsMap[category] ?? [];
}