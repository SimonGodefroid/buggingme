import { notFound, redirect } from 'next/navigation';

import db from '@/db';
import { Button, Link } from '@nextui-org/react';

import { ReportWithTags } from '@/types/reports';
import { BreadCrumbsClient } from '@/components/breadcrumbs';
import PageHeader from '@/components/common/page-header';
import { Mode, ReportForm } from '@/components/reports/report-form';

export default async function EditReport({
  params,
}: {
  params: { reportId: string };
}) {
  const { reportId } = params;

  const report = (await db.report.findFirst({
    where: { id: params.reportId },
    include: { user: true, StatusHistory: true, tags: true, company: true },
  })) as ReportWithTags;

  if (!report?.id || !report) {
    return notFound();
  }
  return (
    <div className="flex flex-col">
      <PageHeader
        crumbs={[
          { href: '/reports', text: 'Reports' },
          { href: `/reports/${report?.id}`, text: `${report?.title}` },
          { href: `/reports/${report?.id}`, text: `Edit` },
        ]}
        buttonProps={{
          secondary: { href: `/reports/${reportId}`, text: 'Back' },
        }}
      />
      <ReportForm mode={'edit' as Mode} report={report} />
    </div>
  );
}
