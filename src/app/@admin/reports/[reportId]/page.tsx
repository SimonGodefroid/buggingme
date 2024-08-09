import { notFound } from 'next/navigation';

import { fetchUser } from '@/actions';
import { auth } from '@/auth';
import db from '@/db';
import { Button, Link, Tooltip } from '@nextui-org/react';
import type { Prisma } from '@prisma/client';

import { ReportWithTags } from '@/types/reports';
import { BreadCrumbsClient } from '@/components/breadcrumbs';
import { Mode, ReportForm } from '@/components/reports/report-form';

export default async function ViewReport({
  params,
}: {
  params: { reportId: string };
}) {
  const { reportId } = params;

  const user = await fetchUser();

  const report = (await db.report.findUnique({
    where: { id: reportId },
    include: { StatusHistory: true, tags: true, user: true, company: true },
  })) as ReportWithTags;

  if (!report) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <BreadCrumbsClient
          crumbs={[
            { href: '/reports', text: 'Reports' },
            {
              href: `/reports/${report?.id}`,
              text: report?.title,
            },
            { href: `/reports/${report.id}`, text: `View` },
          ]}
        />
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
      <ReportForm user={user} mode={Mode.View} report={report} disabled />
    </div>
  );
}
