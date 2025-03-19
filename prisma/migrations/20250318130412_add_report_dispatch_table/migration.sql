-- CreateTable
CREATE TABLE "ReportDispatch" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "issueTracker" "IssueTracker" NOT NULL,
    "dispatchedBy" TEXT NOT NULL,
    "dispatchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "externalId" TEXT,
    "status" TEXT NOT NULL,
    "response" JSONB,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ReportDispatch_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReportDispatch" ADD CONSTRAINT "ReportDispatch_dispatchedBy_fkey" FOREIGN KEY ("dispatchedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportDispatch" ADD CONSTRAINT "ReportDispatch_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;
