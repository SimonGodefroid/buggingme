import { notFound } from 'next/navigation';

import { fetchUser } from '@/actions';
import db from '@/db';

import { ReportWithTags } from '@/types/reports';
import PageHeader from '@/components/common/page-header';
import { Mode, ReportForm } from '@/components/reports/report-form';

export default async function ViewReport({
  params,
}: {
  params: { reportId: string };
}) {
  const user = await fetchUser();
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
          { href: `/reports/${report.id}`, text: `${report.title}` },
          { href: `/reports/${report.id}`, text: `View` },
        ]}
        buttonProps={{
          primary: { href: `/reports/${reportId}/edit`, text: 'Edit' },
          secondary: {
            href: `/reports`,
            text: 'Back to reports',
          },
        }}
      />
      <ReportForm user={user} mode={'view' as Mode} report={report} disabled />
    </div>
  );
}
