import { Suspense } from 'react';

import { notFound } from 'next/navigation';

import db from '@/db';
import { ReportStatus } from '@prisma/client';

import { ReportWithTags } from '@/types/reports';
import PageHeader from '@/components/common/page-header';
import ViewReportForm from '@/components/reports/forms/view-report-form';

export default async function ViewReport({
  params,
}: {
  params: { reportId: string };
}) {
  const { reportId } = params;

  const report = (await db.report.findUnique({
    where: { id: reportId },
    include: { StatusHistory: true, tags: true, user: true, company: true },
  })) as ReportWithTags;

  if (!report) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        crumbs={[
          { href: '/reports', text: 'Reports' },
          { href: `/reports/${reportId}`, text: `${report.title}` },
          { href: `/reports/${reportId}`, text: `View` },
        ]}
        buttonProps={{
          primary:
            report.status === ReportStatus.Open
              ? {
                  href: `/reports/${reportId}/edit`,
                  text: 'Edit',
                }
              : undefined,
          secondary: { href: `/reports`, text: 'Back to reports' },
        }}
      />
      <ViewReportForm report={report} />
    </div>
  );
}
