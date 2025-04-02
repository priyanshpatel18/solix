import { z } from "zod";

export const databaseFormSchema = z.object({
  name: z.string().min(2, { message: "Database name must be at least 2 characters." }),
  host: z.string().min(5, { message: "Host address must be valid." }),
  port: z.string().regex(/^\d+$/, { message: "Port must be a number." }),
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  dbName: z.string().min(2, { message: "Database name must be at least 2 characters." }),
});

export const indexRequestSchema = z.object({
  databaseId: z.string().min(1, "Database selection is required"),
  categoryId: z.enum(["TRANSFER", "DEPOSIT", "WITHDRAW", "NFT_SALE", "NFT_MINT", "SWAP", "TOKEN_MINT", "LOAN", "STAKE_TOKEN", "BURN"]),
  indexType: z.enum(["TRANSACTIONS", "TOKEN_ACCOUNTS", "PROGRAM_LOGS", "NFTS"]),
  targetAddr: z.string().min(1, "Target address is required"),
});