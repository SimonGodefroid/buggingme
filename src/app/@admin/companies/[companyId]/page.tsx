import { notFound } from 'next/navigation';

import db from '@/db';

import PageHeader from '@/components/common/page-header';

export default async function ViewCompany({
  params: { companyId },
}: {
  params: { companyId: string };
}) {
  const company = await db.company.findUnique({
    where: { id: companyId },
  });
  if (!company) {
    return notFound();
  }
  return (
    <div>
      <PageHeader
        crumbs={[
          { href: '/companies', text: 'Companies' },
          { href: `/companies/${company.id}`, text: `${company.name}` },
          { href: `/companies/${company.id}`, text: `View` },
        ]}
        
      />
      <pre>
        <code>{JSON.stringify(company, null, '\t')}</code>
      </pre>
    </div>
  );
}
