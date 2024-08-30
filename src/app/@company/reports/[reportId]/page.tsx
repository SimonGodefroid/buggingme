import { notFound } from 'next/navigation';

import { fetchUser } from '@/actions';
import { fetchAllTags } from '@/actions/reports/tags/fetchAllTags';
import db from '@/db';

import { ReportWithTags } from '@/types';
import PageHeader from '@/components/common/page-header';
import ViewReportForm from '@/components/reports/forms/view-report-form';
import CategorySelector from '@/components/reports/forms/category-selector';

export default async function ViewReport({
  params,
}: {
  params: { reportId: string };
}) {
  const user = await fetchUser();
  const { reportId } = params;

  const report = (await db.report.findUnique({
    where: { id: reportId },
    include: { StatusHistory: true, tags: true, user: true, company: true, attachments: true, comments: true },
  })) as ReportWithTags;

  const tags = await fetchAllTags();

  if (!report) {
    notFound();
  }

  return (
    <div className="flex flex-col ">
      <PageHeader
        crumbs={[
          { href: '/reports', text: 'Reports' },
          { href: `/reports/${report.id}`, text: `${report.title}` },
          { href: `/reports/${report.id}`, text: `View` },
        ]}
        buttonProps={{
          secondary: {
            href: `/reports`,
            text: 'Back to reports',
          },
          custom: <CategorySelector report={report} />,
        }}
      />
      <ViewReportForm report={report} />
    </div>
  );
}
