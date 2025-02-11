import { fetchUser } from '@/actions';
import db from '@/db';
import { ReportWithTags, UserWithCompanies } from '@/types';

import PageHeader from '@/components/common/page-header';
import ReportsTable from '@/components/reports/reports-table';

export default async function Reports() {
  const user: UserWithCompanies | null = await fetchUser();
  const reports: ReportWithTags[] = await db.report.findMany({
    where: { companyId: { notIn: [`${process.env.BUG_BUSTERS_COMPANY_ID}`] } },
    include: {
      company: true,
      tags: true,
      user: true,
      StatusHistory: true,
      attachments: true,
      comments: true,
      campaign: true,
    },
  });

  if (!user) {
    return <div>Not authorized</div>;
  }
  return (
    <div className="flex flex-col gap-4">
      <PageHeader crumbs={[{ href: '/reports', text: 'Reports' }]} />
      <ReportsTable reports={reports} user={user} />
    </div>
  );
}
