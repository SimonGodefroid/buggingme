import { Suspense } from 'react';

import { notFound } from 'next/navigation';

import { fetchUser } from '@/actions';
import { fetchAllTags } from '@/actions/reports/tags/fetchAllTags';
import db from '@/db';
import { CompanyWithReports, ReportWithTags } from '@/types';
import { ReportStatus } from '@prisma/client';

import PageHeader from '@/components/common/page-header';
import { CreateReportForm } from '@/components/reports/forms/create-report-form';
import SiteInformation from '@/components/sites/site-information';

export default async function ViewSite({
  params,
}: {
  params: { url: string };
}) {
  const { url } = params;
  const user = await fetchUser();
  const tags = await fetchAllTags();

  const company = (await db.company.findFirst({
    where: {
      domain: { contains: url }, // Partial match on domain
      id: { notIn: [`${process.env.BUG_BUSTERS_COMPANY_ID}`] },
      // Ensure ID exclusion
    },
    include: { reports: { include: { tags: true, company: true } } },
  })) as CompanyWithReports | null;

  if (!company) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        crumbs={[
          { href: '/sites', text: 'Sites' },
          { href: `/sites/${url}`, text: `${company.domain}` },
          {
            href: `/sites/${url}/report`,
            text: `Create report for ${new URL(`${company.domain}`).host}`,
          },
        ]}
        buttonProps={{
          secondary: {
            href: `/sites`,
            text: `Back to ${new URL(`${company.domain}`).host} reports`,
          },
        }}
      />
      <CreateReportForm user={user} tags={tags} />
    </div>
  );
}
