import { notFound, redirect } from 'next/navigation';

import db from '@/db';
import { Button, Link } from '@nextui-org/react';
import type { Report } from '@prisma/client';

import { BreadCrumbsClient } from '@/components/breadcrumbs';
import { ReportForm } from '@/components/reports/report-form';

import { ReportWithTags } from '../page';

export default async function EditReport({
  params,
}: {
  params: { reportId: string };
}) {
  const { reportId } = params;

  const report = (await db.report.findFirst({
    where: { id: params.reportId },
    include: { user: true, StatusHistory: true, tags: true },
  })) as ReportWithTags;

  if (!report?.id) {
    return notFound();
  }
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <BreadCrumbsClient
          crumbs={[
            { href: '/reports', text: 'Reports' },
            { href: `/reports/${report?.id}`, text: `${report?.id}` },
            { href: `/reports/${report?.id}`, text: `Edit` },
          ]}
        />
        <Button
          href={`/reports/${reportId}`}
          as={Link}
          variant="ghost"
          color="primary"
        >
          Back
        </Button>
      </div>
      <ReportForm mode={'edit'} report={report} />
    </div>
  );
}
