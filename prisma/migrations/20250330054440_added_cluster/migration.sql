/*
  Warnings:

  - Added the required column `cluster` to the `IndexRequest` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Cluster" AS ENUM ('MAINNET', 'DEVNET');

-- AlterTable
ALTER TABLE "IndexRequest" ADD COLUMN     "cluster" "Cluster" NOT NULL;
