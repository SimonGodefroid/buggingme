import { notFound } from 'next/navigation';

import db from '@/db';
import { ContributorWithReports } from '@/types';
import { Button, Link } from '@nextui-org/react';
import type { Prisma } from '@prisma/client';

import { BreadCrumbsClient } from '@/components/breadcrumbs';
import PageHeader from '@/components/common/page-header';
import ContributorStats from '@/components/contributors/contributor-stats';

export default async function ViewContributor({
  params,
}: {
  params: { userId: string };
}) {
  const { userId } = params;

  const contributor = (await db.user.findUnique({
    where: { id: userId },
    include: { Report: { include: { attachments: true } } },
  })) as ContributorWithReports;
  if (!contributor) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        crumbs={[
          { href: '/contributors', text: 'Contributors' },
          {
            href: `/contributors/${contributor.id}`,
            text: `${contributor.name}`,
          },
          { href: `/contributors/${contributor.id}`, text: `View` },
        ]}
        buttonProps={{
          secondary: { href: `/contributors`, text: 'Back to contributors' },
        }}
      />
      <div className="max-w[60vw]">
        <ContributorStats contributor={contributor} />
      </div>
    </div>
  );
}
