import { Suspense } from 'react';

import { notFound } from 'next/navigation';

import db from '@/db';
import { ReportWithTags } from '@/types';
import { ReportStatus } from '@prisma/client';

import PageHeader from '@/components/common/page-header';
import ViewReportForm from '@/components/reports/forms/view-report-form';

export default async function ViewReport({
  params,
}: {
  params: { reportId: string };
}) {
  const { reportId } = params;

  const report = (await db.report.findUnique({
    where: {
      id: reportId,
      companyId: { notIn: [`${process.env.BUG_BUSTERS_COMPANY_ID}`] },
    },
    include: {
      StatusHistory: true,
      tags: true,
      user: true,
      company: true,
      attachments: true,
      comments: true,
      campaign: true,
    },
  })) as ReportWithTags;

  console.log('report'.repeat(200), report);
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
          secondary: { href: `/reports`, text: 'Back to reports' },
        }}
      />
      <div className='flex flex-col gap-4 sm:w-sm'>
        <ViewReportForm report={report} />
      </div>
    </div>
  );
}
