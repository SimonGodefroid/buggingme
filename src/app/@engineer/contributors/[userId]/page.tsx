import { notFound } from 'next/navigation';

import db from '@/db';
import { Button, Link } from '@nextui-org/react';
import type { Prisma } from '@prisma/client';

import { BreadCrumbsClient } from '@/components/breadcrumbs';
import ContributorStats from '@/components/contributors/contributor-stats';
import { ReportForm } from '@/components/reports/report-form';

import { ContributorWithReports } from '../page';

export type ReportWithTags = Prisma.ReportGetPayload<{
  include: { tags: true; user: true; StatusHistory: true; company: true };
}>;

export default async function ViewContributor({
  params,
}: {
  params: { userId: string };
}) {
  const { userId } = params;

  const contributor = (await db.user.findUnique({
    where: { id: userId },
    include: { Report: true },
  })) as ContributorWithReports;
  if (!contributor) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <BreadCrumbsClient
          crumbs={[
            { href: '/contributors', text: 'Contributors' },
            {
              href: `/contributors/${contributor.id}`,
              text: `${contributor.name}`,
            },
            { href: `/contributors/${contributor.id}`, text: `View` },
          ]}
        />
        {/* <h1>{`View report ${reportId}`}</h1> */}
        <div className="flex flex-col flex-wrap gap-4"></div>
        <div className="flex items-center gap-4">
          <Button href={`/contributors`} as={Link} color="primary" variant="ghost">
            Back to contributors
          </Button>
        </div>
      </div>
      <div className="max-w[60vw]">
        <ContributorStats contributor={contributor} />
      </div>
    </div>
  );
}
