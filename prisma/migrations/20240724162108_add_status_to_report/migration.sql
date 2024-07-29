-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('Open', 'UnderReview', 'InProgress', 'Resolved', 'Closed', 'Deferred', 'Cancelled', 'Rejected');

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "status" "ReportStatus" NOT NULL DEFAULT 'Open';
