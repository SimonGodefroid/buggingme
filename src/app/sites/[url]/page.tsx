import { Suspense } from 'react';

import { notFound } from 'next/navigation';

import db from '@/db';
import { CompanyWithReports, ReportWithTags } from '@/types';
import { ReportStatus } from '@prisma/client';

import PageHeader from '@/components/common/page-header';
import ViewReportForm from '@/components/reports/forms/view-report-form';
import SiteInformation from '@/components/sites/site-information';

export default async function ViewSite({
  params,
}: {
  params: { url: string };
}) {
  const { url } = params;

  const company = (await db.company.findFirst({
    where: {
      domain: { contains: url }, // Partial match on domain
      id: { notIn: [`${process.env.BUG_BUSTERS_COMPANY_ID}`] },
      // Ensure ID exclusion
    },
    include: { reports: { include: { tags: true } } },
  })) as CompanyWithReports | null;

  if (!company) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        crumbs={[
          { href: '/sites', text: 'Reports' },
          { href: `/sites/${url}`, text: `${company.domain}` },
        ]}
        buttonProps={{
          secondary: { href: `/sites`, text: 'Back to sites' },
        }}
      />
      <SiteInformation company={company} />
    </div>
  );
}
