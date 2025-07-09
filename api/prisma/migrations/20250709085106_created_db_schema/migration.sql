-- CreateEnum
CREATE TYPE "CategoryGroup" AS ENUM ('REVENUE', 'COGS', 'GROSS_PROFIT', 'EXPENSES', 'NON_OPERATING_EXPENSES', 'OPERATING_PROFIT', 'OPERATING_EXPENSES', 'OTHER_INCOME', 'OTHER_EXPENSES', 'NET_OTHER_INCOME', 'PROFIT_BEFORE_TAX', 'TAX_EXPENSE', 'NET_PROFIT');

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Record" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "type" TEXT,
    "group" "CategoryGroup" NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
