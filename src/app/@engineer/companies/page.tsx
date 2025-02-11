import db from '@/db';
import { CompanyWithReports } from '@/types';

import PageHeader from '@/components/common/page-header';
import CompaniesTable from '@/components/companies/companies-table';

export default async function Companies({ ...args }) {
  const companies = (await db.company.findMany({
    include: { reports: { include: { tags: true } } },
  })) as CompanyWithReports[];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader crumbs={[{ href: '/companies', text: 'Companies' }]} />
      <CompaniesTable companies={companies} />
    </div>
  );
}
