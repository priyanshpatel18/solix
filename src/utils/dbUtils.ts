import { decrypt } from "@/lib/encrypt";
import { Database, Prisma, PrismaClient } from "@prisma/client";


function validateTableName(tableName: string) {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }
}

export function generateConnectionString(db: Database) {
  return `postgresql://${db.username}:${decrypt(db.password)}@${db.host}:${db.port}/${db.name}?sslmode=require`;
}

export function getPrismaClient(db: Database): PrismaClient {
  const connStr = generateConnectionString(db);

  const client = new PrismaClient({
    datasources: {
      db: {
        url: connStr,
      },
    },
  });

  return client;
}

export async function fetchDatabaseData(db: PrismaClient, tableName: string) {
  validateTableName(tableName);

  const data = await db.$queryRawUnsafe(`SELECT * FROM "${tableName}"`);
  return data;
}

export async function pingPrismaDatabase(db: PrismaClient): Promise<boolean> {
  try {
    await db.$queryRaw`SELECT 1`;
    return true;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      console.warn("Prisma DB ping failed:", err.message);
    }
    return false;
  }
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 5,
  delayMs = 2000
): Promise<T | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt < retries) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
          console.warn("Prisma DB ping failed:", err.message);
        }
        await new Promise((res) => setTimeout(res, delayMs));
      } else {
        console.error(`All ${retries} attempts failed.`);
      }
    }
  }
  return null;
}