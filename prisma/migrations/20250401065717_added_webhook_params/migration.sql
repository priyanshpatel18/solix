-- CreateTable
CREATE TABLE "Params" (
    "id" TEXT NOT NULL,
    "accountAddresses" TEXT[],
    "transactionTypes" "IndexParams"[],

    CONSTRAINT "Params_pkey" PRIMARY KEY ("id")
);
