/*
  Warnings:

  - You are about to drop the column `categories` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `IndexRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IndexedData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IndexingTask` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name,userId]` on the table `Database` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "IndexParams" AS ENUM ('TRANSFER', 'DEPOSIT', 'WITHDRAW', 'NFT_SALE', 'NFT_MINT', 'SWAP', 'TOKEN_MINT', 'LOAN', 'STAKE_TOKEN', 'BURN');

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO');

-- DropForeignKey
ALTER TABLE "IndexRequest" DROP CONSTRAINT "IndexRequest_databaseId_fkey";

-- DropForeignKey
ALTER TABLE "IndexRequest" DROP CONSTRAINT "IndexRequest_userId_fkey";

-- DropForeignKey
ALTER TABLE "IndexedData" DROP CONSTRAINT "IndexedData_databaseId_fkey";

-- DropForeignKey
ALTER TABLE "IndexingTask" DROP CONSTRAINT "IndexingTask_indexRequestId_fkey";

-- DropForeignKey
ALTER TABLE "IndexingTask" DROP CONSTRAINT "IndexingTask_userId_fkey";

-- AlterTable
ALTER TABLE "Database" ALTER COLUMN "port" SET DEFAULT 5432;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "categories",
ADD COLUMN     "indexCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "plan" "Plan" NOT NULL DEFAULT 'FREE';

-- DropTable
DROP TABLE "IndexRequest";

-- DropTable
DROP TABLE "IndexedData";

-- DropTable
DROP TABLE "IndexingTask";

-- DropEnum
DROP TYPE "Frequency";

-- DropEnum
DROP TYPE "IndexCategory";

-- DropEnum
DROP TYPE "TaskStatus";

-- CreateTable
CREATE TABLE "IndexSettings" (
    "id" TEXT NOT NULL,
    "targetAddr" TEXT NOT NULL,
    "indexType" "IndexType" NOT NULL,
    "indexParams" "IndexParams"[],
    "status" "Status" NOT NULL,
    "webhookSecret" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "databaseId" TEXT NOT NULL,

    CONSTRAINT "IndexSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IndexSettings_targetAddr_idx" ON "IndexSettings"("targetAddr");

-- CreateIndex
CREATE UNIQUE INDEX "Database_name_userId_key" ON "Database"("name", "userId");

-- AddForeignKey
ALTER TABLE "IndexSettings" ADD CONSTRAINT "IndexSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndexSettings" ADD CONSTRAINT "IndexSettings_databaseId_fkey" FOREIGN KEY ("databaseId") REFERENCES "Database"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
