-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('Critical', 'High', 'Medium', 'Low');

-- CreateEnum
CREATE TYPE "Impact" AS ENUM ('SingleUser', 'AllUsers', 'SpecificBrowsersDevices', 'SiteWide');

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "impact" "Impact" NOT NULL DEFAULT 'SingleUser',
ADD COLUMN     "severity" "Severity" NOT NULL DEFAULT 'Medium';

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusHistory" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "oldStatus" "ReportStatus" NOT NULL,
    "newStatus" "ReportStatus" NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedBy" TEXT NOT NULL,

    CONSTRAINT "StatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpdateHistory" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "UpdateHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ReportTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_ReportTags_AB_unique" ON "_ReportTags"("A", "B");

-- CreateIndex
CREATE INDEX "_ReportTags_B_index" ON "_ReportTags"("B");

-- AddForeignKey
ALTER TABLE "StatusHistory" ADD CONSTRAINT "StatusHistory_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpdateHistory" ADD CONSTRAINT "UpdateHistory_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReportTags" ADD CONSTRAINT "_ReportTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReportTags" ADD CONSTRAINT "_ReportTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
