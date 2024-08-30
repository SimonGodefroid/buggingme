import { Metadata } from 'next';

import db from '@/db';
import { ContributorWithReports } from '@/types';
import { UserType } from '@prisma/client';

import PageHeader from '@/components/common/page-header';
import ContributorsTable from '@/components/contributors/contributors-table';

export const metadata: Metadata = {
  title: 'Contributors - Engineers raising the bar',
  description: 'Folks finding problems and fixing them',
};

export default async function Contributors() {
  const contributors: ContributorWithReports[] = await db.user.findMany({
    where: { userTypes: { hasSome: [UserType.ENGINEER, UserType.GOD] } },
    include: { Report: { include: { attachments: true } } },
  });
  return (
    <div className="flex flex-col gap-4">
      <PageHeader crumbs={[{ href: '/contributors', text: 'Contributors' }]} />
      <ContributorsTable contributors={contributors} />
    </div>
  );
}
