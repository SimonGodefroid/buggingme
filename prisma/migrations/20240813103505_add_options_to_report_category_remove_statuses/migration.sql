/*
  Warnings:

  - The values [PendingCampaign] on the enum `ReportCategory` will be removed. If these variants are still used in the database, this will fail.
  - The values [UnderReview,InProgress,Resolved,Deferred,Rejected] on the enum `ReportStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReportCategory_new" AS ENUM ('New', 'Valid', 'PendingCompanyReview', 'Resolved', 'Testing', 'InformationNeeded', 'Informative', 'NotApplicable', 'Duplicate', 'Spam');
ALTER TABLE "Report" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "Report" ALTER COLUMN "category" TYPE "ReportCategory_new" USING ("category"::text::"ReportCategory_new");
ALTER TYPE "ReportCategory" RENAME TO "ReportCategory_old";
ALTER TYPE "ReportCategory_new" RENAME TO "ReportCategory";
DROP TYPE "ReportCategory_old";
ALTER TABLE "Report" ALTER COLUMN "category" SET DEFAULT 'New';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ReportStatus_new" AS ENUM ('Open', 'Closed', 'Cancelled', 'Deleted');
ALTER TABLE "Report" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "StatusHistory" ALTER COLUMN "oldStatus" TYPE "ReportStatus_new" USING ("oldStatus"::text::"ReportStatus_new");
ALTER TABLE "StatusHistory" ALTER COLUMN "newStatus" TYPE "ReportStatus_new" USING ("newStatus"::text::"ReportStatus_new");
ALTER TABLE "Report" ALTER COLUMN "status" TYPE "ReportStatus_new" USING ("status"::text::"ReportStatus_new");
ALTER TYPE "ReportStatus" RENAME TO "ReportStatus_old";
ALTER TYPE "ReportStatus_new" RENAME TO "ReportStatus";
DROP TYPE "ReportStatus_old";
ALTER TABLE "Report" ALTER COLUMN "status" SET DEFAULT 'Open';
COMMIT;
