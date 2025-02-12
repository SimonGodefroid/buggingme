import { notFound } from 'next/navigation';

import { fetchUser } from '@/actions';
import { fetchAllTags } from '@/actions/reports/tags/fetchAllTags';
import db from '@/db';
import { ReportWithTags } from '@/types';

import PageHeader from '@/components/common/page-header';
import StatusSelector from '@/components/common/status-selector';
import CategorySelector from '@/components/reports/forms/category-selector';
import ViewReportForm from '@/components/reports/forms/view-report-form';

export default async function ViewReport({
  params,
}: {
  params: { reportId: string };
}) {
  const { reportId } = params;
  const user = await fetchUser();
  const report = (await db.report.findUnique({
    where: { id: reportId },
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
  if (!report) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        crumbs={[
          { href: '/reports', text: 'Reports' },
          {
            href: `/reports/${report?.id}`,
            text: report?.title,
          },
          { href: `/reports/${report.id}`, text: `View` },
        ]}
        buttonProps={{
          primary: { href: `/reports/${reportId}/edit`, text: 'Edit' },
          secondary: { href: `/reports`, text: 'Back to reports' },
          custom: (
            <>
              <CategorySelector report={report} />
              <StatusSelector report={report} />
            </>
          ),
        }}
      />
      <ViewReportForm report={report} />
    </div>
  );
}
