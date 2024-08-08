import db from '@/db';
import { Prisma } from '@prisma/client';

import { BreadCrumbsClient } from '@/components/breadcrumbs';
import CompaniesTable from '@/components/companies/companies-table';

export type CompanyWithReports = Prisma.CompanyGetPayload<{
  include: { reports: true };
}>;
export default async function Companies({ ...args }) {
  const companies: CompanyWithReports[] = await db.company.findMany({
    include: { reports: true },
  });

  return (
    <div className="flex flex-col gap-4">
      <BreadCrumbsClient crumbs={[{ href: '/companies', text: 'Companies' }]} />
      <CompaniesTable companies={companies} />
    </div>
  );
}
