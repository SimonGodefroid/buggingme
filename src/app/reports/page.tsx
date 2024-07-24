import db from '@/db';

import { BreadCrumbsClient } from '@/components/breadcrumbs';
import ReportsTable from '@/components/reports/reports-table';

export default async function Reports() {
  const reports = await db.report.findMany();

  return (
    <div className="flex flex-col gap-4">
      <BreadCrumbsClient crumbs={[{ href: '/reports', text: 'Reports' }]} />
      <ReportsTable reports={reports} />
    </div>
  );
}
