-- CreateEnum
CREATE TYPE "ReportVisibility" AS ENUM ('Public', 'Private');

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "visibility" "ReportVisibility" NOT NULL DEFAULT 'Public';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "validPublicReportsCount" INTEGER NOT NULL DEFAULT 0;
