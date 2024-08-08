import { notFound, redirect } from 'next/navigation';

import { fetchUser } from '@/actions';
import { auth } from '@/auth';
import db from '@/db';
import { Button, Link } from '@nextui-org/react';

import { ReportWithTags } from '@/types/reports';
import { BreadCrumbsClient } from '@/components/breadcrumbs';
import { ReportForm } from '@/components/reports/report-form';

export default async function EditReport({
  params,
}: {
  params: { reportId: string };
}) {
  const { reportId } = params;
  const authenticatedUser = await auth();
  const user = authenticatedUser?.user?.id
    ? await fetchUser(authenticatedUser?.user.id)
    : null;

  const report = (await db.report.findFirst({
    where: { id: params.reportId },
    include: { user: true, StatusHistory: true, tags: true, company: true },
  })) as ReportWithTags;

  if (!report?.id || !report) {
    return notFound();
  }
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <BreadCrumbsClient
          crumbs={[
            { href: '/reports', text: 'Reports' },
            { href: `/reports/${report.id}`, text: `${report.title}` },
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
      <ReportForm user={user} mode={'edit'} report={report} />
    </div>
  );
}
