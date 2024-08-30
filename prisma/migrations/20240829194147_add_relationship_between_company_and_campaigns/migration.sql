/*
  Warnings:

  - You are about to drop the `_CompanyCampaigns` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CompanyCampaigns" DROP CONSTRAINT "_CompanyCampaigns_A_fkey";

-- DropForeignKey
ALTER TABLE "_CompanyCampaigns" DROP CONSTRAINT "_CompanyCampaigns_B_fkey";

-- AlterTable
ALTER TABLE "Campaign" ALTER COLUMN "status" SET DEFAULT 'Created';

-- DropTable
DROP TABLE "_CompanyCampaigns";

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
