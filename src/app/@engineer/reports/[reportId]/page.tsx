import { notFound } from 'next/navigation';

import { fetchUser } from '@/actions';
import { fetchAllTags } from '@/actions/reports/tags/fetchAllTags';
import { auth } from '@/auth';
import db from '@/db';
import { Button, Link } from '@nextui-org/react';
import { ReportStatus } from '@prisma/client';

import { ReportWithTags } from '@/types/reports';
import { BreadCrumbsClient } from '@/components/breadcrumbs';
import PageHeader from '@/components/common/page-header';
import { ViewReportForm } from '@/components/reports/forms/view-report-form';

export default async function ViewReport({
  params,
}: {
  params: { reportId: string };
}) {
  const { reportId } = params;

  const user = await fetchUser();

  const report = (await db.report.findUnique({
    where: { id: reportId },
    include: { StatusHistory: true, tags: true, user: true, company: true },
  })) as ReportWithTags;

  const tags = await fetchAllTags();
  if (!report) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        crumbs={[
          { href: '/reports', text: 'Reports' },
          { href: `/reports/${report.id}`, text: `${report.title}` },
          { href: `/reports/${report.id}`, text: `View` },
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
      <ViewReportForm tags={tags} mode={'view'} report={report} />
    </div>
  );
}
