import db from '@/db';

import { ReportWithTags } from '@/types/reports';
import PageHeader from '@/components/common/page-header';
import ReportsTable from '@/components/reports/reports-table';
import { fetchUser } from '@/actions';

export default async function Reports() {
  const reports: ReportWithTags[] = await db.report.findMany({
    include: { company: true, tags: true, user: true, StatusHistory: true },
  });
const user = await fetchUser()
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        crumbs={[{ href: '/reports', text: 'Reports' }]}
        
      />
      <ReportsTable reports={reports} user={user} />
    </div>
  );
}
