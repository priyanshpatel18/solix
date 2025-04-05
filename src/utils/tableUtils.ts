import { PrismaClient } from "@prisma/client";

function validateTableName(tableName: string) {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }
}

export async function ensureTableExists(db: PrismaClient, tableName: string) {
  validateTableName(tableName);

  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "${tableName}" (
      id SERIAL PRIMARY KEY,
      account_address TEXT NOT NULL,
      transaction_type TEXT NOT NULL,
      data TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function insertData(
  db: PrismaClient,
  tableName: string,
  accountAddress: string,
  transactionType: string,
  data: any
) {
  validateTableName(tableName);

  await db.$executeRawUnsafe(
    `INSERT INTO "${tableName}" (account_address, transaction_type, data)
     VALUES ($1, $2, $3)
     ON CONFLICT DO NOTHING;`,
    accountAddress,
    transactionType,
    JSON.stringify(data)
  );
}