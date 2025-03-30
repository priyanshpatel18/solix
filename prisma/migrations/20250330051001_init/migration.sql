-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('GOOGLE', 'GITHUB');

-- CreateEnum
CREATE TYPE "IndexType" AS ENUM ('TRANSACTIONS', 'TOKEN_ACCOUNTS', 'PROGRAM_LOGS', 'NFTS');

-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('REAL_TIME', 'HOURLY', 'DAILY');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "IndexCategory" AS ENUM ('TRANSACTIONS', 'TOKEN_TRANSFERS', 'NFT_MINTS', 'NFT_SALES', 'STAKING_ACCOUNTS', 'SMART_CONTRACTS', 'PROGRAM_EXECUTIONS', 'DEFI_SWAPS', 'LIQUIDITY_POOLS', 'ORACLE_UPDATES', 'GOVERNANCE_VOTES', 'DOMAIN_REGISTRATIONS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categories" "IndexCategory"[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "provider" "Provider" NOT NULL,
    "providerAccountId" TEXT,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Database" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "dbName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Database_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndexRequest" (
    "id" TEXT NOT NULL,
    "category" "IndexCategory" NOT NULL,
    "userId" TEXT NOT NULL,
    "databaseId" TEXT NOT NULL,
    "indexType" "IndexType" NOT NULL,
    "targetAddr" TEXT NOT NULL,
    "filters" TEXT NOT NULL DEFAULT '',
    "frequency" "Frequency" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IndexRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndexedData" (
    "id" TEXT NOT NULL,
    "category" "IndexCategory" NOT NULL,
    "data" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "databaseId" TEXT NOT NULL,

    CONSTRAINT "IndexedData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndexingTask" (
    "id" TEXT NOT NULL,
    "indexRequestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "errorMessage" TEXT,

    CONSTRAINT "IndexingTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Database" ADD CONSTRAINT "Database_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndexRequest" ADD CONSTRAINT "IndexRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndexRequest" ADD CONSTRAINT "IndexRequest_databaseId_fkey" FOREIGN KEY ("databaseId") REFERENCES "Database"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndexedData" ADD CONSTRAINT "IndexedData_databaseId_fkey" FOREIGN KEY ("databaseId") REFERENCES "Database"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndexingTask" ADD CONSTRAINT "IndexingTask_indexRequestId_fkey" FOREIGN KEY ("indexRequestId") REFERENCES "IndexRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndexingTask" ADD CONSTRAINT "IndexingTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
