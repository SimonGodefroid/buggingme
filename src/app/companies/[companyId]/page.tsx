import { notFound } from 'next/navigation';

import db from '@/db';

import { BreadCrumbsClient } from '@/components/breadcrumbs';

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
      <BreadCrumbsClient
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
