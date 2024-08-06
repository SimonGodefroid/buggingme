-- CreateEnum
CREATE TYPE "ReportCategory" AS ENUM ('New', 'Valid', 'PendingCampaign', 'Duplicate', 'NotApplicable', 'Informative', 'Spam', 'InformationNeeded');

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "category" "ReportCategory" NOT NULL DEFAULT 'New';
