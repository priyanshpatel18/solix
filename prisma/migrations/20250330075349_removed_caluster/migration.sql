/*
  Warnings:

  - You are about to drop the column `cluster` on the `IndexRequest` table. All the data in the column will be lost.
  - You are about to drop the column `filters` on the `IndexRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "IndexRequest" DROP COLUMN "cluster",
DROP COLUMN "filters",
ADD COLUMN     "webhookSecret" TEXT NOT NULL DEFAULT '';

-- DropEnum
DROP TYPE "Cluster";
