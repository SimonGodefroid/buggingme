import { fetchUser } from '@/actions';
import { auth } from '@/auth';
import db from '@/db';

import { ReportWithTags } from '@/types/reports';
import PageHeader from '@/components/common/page-header';
import ReportsTable from '@/components/reports/reports-table';

export default async function Reports() {
  const user = await fetchUser();
  const reports: ReportWithTags[] = await db.report.findMany({
    where: { companyId: { in: user?.companies.map((company) => company.id) } },
    include: { company: true, tags: true, user: true, StatusHistory: true },
  });

  if (!user) {
    return <div>Not authorized</div>;
  }
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        crumbs={[{ href: '/reports', text: 'Reports' }]}
        
      />
      <ReportsTable reports={reports} />
    </div>
  );
}
