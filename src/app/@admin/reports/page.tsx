import { fetchUser } from '@/actions';
import db from '@/db';
import { ReportWithTags } from '@/types';

import PageHeader from '@/components/common/page-header';
import ReportsTable from '@/components/reports/reports-table';

export default async function Reports() {
  const reports = (await db.report.findMany({
    include: {
      company: true,
      tags: true,
      user: true,
      StatusHistory: true,
      attachments: true,
    },
  })) as ReportWithTags[];
  const user = await fetchUser();
  return (
    <div className="flex flex-col gap-4">
      <PageHeader crumbs={[{ href: '/reports', text: 'Reports' }]} />
      <ReportsTable reports={reports} user={user} />
    </div>
  );
}
