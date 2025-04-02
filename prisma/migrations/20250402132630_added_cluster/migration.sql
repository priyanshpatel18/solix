/*
  Warnings:

  - Added the required column `cluster` to the `IndexSettings` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Cluster" AS ENUM ('MAINNET', 'DEVNET');

-- AlterTable
ALTER TABLE "IndexSettings" ADD COLUMN     "cluster" "Cluster" NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "credits" SET DEFAULT 500;
