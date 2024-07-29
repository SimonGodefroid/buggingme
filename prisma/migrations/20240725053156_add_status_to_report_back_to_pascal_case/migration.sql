/*
  Warnings:

  - The values [open,under_review,in_progress,resolved,closed,deferred,cancelled,rejected,deleted] on the enum `ReportStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReportStatus_new" AS ENUM ('Open', 'UnderReview', 'InProgress', 'Resolved', 'Closed', 'Deferred', 'Cancelled', 'Rejected');
ALTER TABLE "Report" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Report" ALTER COLUMN "status" TYPE "ReportStatus_new" USING ("status"::text::"ReportStatus_new");
ALTER TYPE "ReportStatus" RENAME TO "ReportStatus_old";
ALTER TYPE "ReportStatus_new" RENAME TO "ReportStatus";
DROP TYPE "ReportStatus_old";
ALTER TABLE "Report" ALTER COLUMN "status" SET DEFAULT 'Open';
COMMIT;

-- AlterTable
ALTER TABLE "Report" ALTER COLUMN "status" SET DEFAULT 'Open';
