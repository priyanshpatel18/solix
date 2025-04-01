/*
  Warnings:

  - You are about to drop the column `indexCount` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "indexCount",
ADD COLUMN     "credits" INTEGER NOT NULL DEFAULT 0;
