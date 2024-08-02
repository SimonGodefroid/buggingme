import db from '@/db';

import { BreadCrumbsClient } from '@/components/breadcrumbs';
import CompaniesTable from '@/components/companies/companies-table';

export default async function Companies({ ...args }) {
  const companies = await db.company.findMany();
  return (
    <>
      <BreadCrumbsClient crumbs={[{ href: '/companies', text: 'Companies' }]} />
      <code>
        <pre>{JSON.stringify(companies, null, 2)}</pre>
      </code>
      <CompaniesTable />
    </>
  );
}
