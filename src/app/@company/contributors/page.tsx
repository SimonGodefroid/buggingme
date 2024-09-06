import { Metadata } from 'next';

import db from '@/db';
import { Prisma, UserType } from '@prisma/client';

import PageHeader from '@/components/common/page-header';
import ContributorsTable from '@/components/contributors/contributors-table';
import { ContributorWithReports } from '@/types';

export const metadata: Metadata = {
  title: 'Contributors - Engineers raising the bar',
  description: 'Folks finding problems and fixing them',
};

export default async function Contributors({ ...args }) {
  const contributors: ContributorWithReports[] = (await db.user.findMany({
    where: { userTypes: { has: UserType.ENGINEER } },
    include: { Report: true },
  })) as ContributorWithReports[];
  return (
    <div className="flex flex-col gap-4">
      <PageHeader crumbs={[{ href: '/contributors', text: 'Contributors' }]} />
      <ContributorsTable contributors={contributors} />
    </div>
  );
}
