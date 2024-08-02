import db from '@/db';

import { BreadCrumbsClient } from '@/components/breadcrumbs';
import ReportsTable from '@/components/reports/reports-table';

import { ReportWithTags } from './[reportId]/page';

export default async function Reports() {
  const reports: ReportWithTags[] = await db.report.findMany({
    include: { company: true, tags: true, user: true, StatusHistory: true },
  });

  return (
    <div className="flex flex-col gap-4">
      <BreadCrumbsClient crumbs={[{ href: '/reports', text: 'Reports' }]} />
      <ReportsTable reports={reports} />
    </div>
  );
}
