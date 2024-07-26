import { notFound } from 'next/navigation';

import db from '@/db';
import { BreadcrumbItem, Breadcrumbs, Button, Link } from '@nextui-org/react';
import type { Report } from '@prisma/client';

import { BreadCrumbsClient } from '@/components/breadcrumbs';
import { ReportForm } from '@/components/reports/report-form';

export default async function EditReport({
  params,
}: {
  params: { reportId: string };
}) {
  const { reportId } = params;

  const report = (await db.report.findFirst({
    where: { id: params.reportId },
  })) as Report;
  if (!report) {
    notFound();
  }

  return (
    <div className="flex flex-col ">
      <div className="flex items-center justify-between">
        <BreadCrumbsClient
          crumbs={[
            { href: '/reports', text: 'Reports' },
            { href: `/reports/${report.id}`, text: `${report.id}` },
            { href: `/reports/${report.id}`, text: `View` },
          ]}
        />
        {/* <h1>{`View report ${reportId}`}</h1> */}
        <div className="flex flex-col flex-wrap gap-4"></div>
        <div className="flex items-center gap-4">
          <Button href={`/reports`} as={Link} color="primary" variant="ghost">
            Back to reports
          </Button>
          <Button
            href={`/reports/${reportId}/edit`}
            as={Link}
            color="primary"
            variant="solid"
          >
            Edit
          </Button>
        </div>
      </div>
      <ReportForm mode={'view'} report={report} disabled />
    </div>
  );
}
