/*
  Warnings:

  - The values [TRANSACTIONS,TOKEN_TRANSFERS,NFT_MINTS,NFT_SALES,STAKING_ACCOUNTS,SMART_CONTRACTS,PROGRAM_EXECUTIONS,DEFI_SWAPS,LIQUIDITY_POOLS,ORACLE_UPDATES,GOVERNANCE_VOTES,DOMAIN_REGISTRATIONS] on the enum `IndexCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "IndexCategory_new" AS ENUM ('TRANSFER', 'DEPOSIT', 'WITHDRAW', 'NFT_SALE', 'NFT_MINT', 'SWAP', 'TOKEN_MINT', 'LOAN', 'STAKE_TOKEN', 'BURN');
ALTER TABLE "User" ALTER COLUMN "categories" TYPE "IndexCategory_new"[] USING ("categories"::text::"IndexCategory_new"[]);
ALTER TABLE "IndexRequest" ALTER COLUMN "category" TYPE "IndexCategory_new" USING ("category"::text::"IndexCategory_new");
ALTER TABLE "IndexedData" ALTER COLUMN "category" TYPE "IndexCategory_new" USING ("category"::text::"IndexCategory_new");
ALTER TYPE "IndexCategory" RENAME TO "IndexCategory_old";
ALTER TYPE "IndexCategory_new" RENAME TO "IndexCategory";
DROP TYPE "IndexCategory_old";
COMMIT;
