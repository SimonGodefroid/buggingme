import db from '@/db';
import { CompanyWithReports } from '@/types';

import PageHeader from '@/components/common/page-header';
import SitesList from '@/components/sites/sites-list';

export default async function Sites() {
  const companies = (await db.company.findMany({
    where: {
      id: { notIn: [`${process.env.BUG_BUSTERS_COMPANY_ID}`] },
      reports: { some: {} }, // Ensures at least one report exists
    },
    include: {
      reports: {
        include: {
          tags: true,
          user: true,
          StatusHistory: true,
          company: true,
          attachments: true,
          comments: true,
          campaign: true,
        },
      },
    },
  })) as CompanyWithReports[];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader crumbs={[{ href: '/sites', text: 'Sites' }]} />
      <div className="flex flex-col">
        <div className="flex flex-col gap-4 items-center">
          <SitesList companies={companies} />
        </div>
      </div>
    </div>
  );
}
