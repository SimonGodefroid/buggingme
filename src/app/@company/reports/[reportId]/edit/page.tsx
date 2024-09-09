import { notFound } from 'next/navigation';

import { fetchUser } from '@/actions';
import { fetchAllTags } from '@/actions/reports/tags/fetchAllTags';
import db from '@/db';
import { ReportWithTags } from '@/types';

import PageHeader from '@/components/common/page-header';
import { UpdateReportForm } from '@/components/reports/forms/update-report-form';

export default async function EditReport({
  params,
}: {
  params: { reportId: string };
}) {
  const { reportId } = params;
  const user = await fetchUser();
  const tags = await fetchAllTags();
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
          { href: `/reports/${report.id}`, text: `${report.title}` },
          { href: `/reports/${report?.id}`, text: `Edit` },
        ]}
        buttonProps={
          report.user?.id === user?.id
            ? {
                secondary: { href: `/reports/${reportId}`, text: 'Back' },
              }
            : {}
        }
      />
      <UpdateReportForm tags={tags} report={report} />
    </div>
  );
}
