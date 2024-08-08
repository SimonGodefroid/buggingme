import { Metadata } from 'next';

import db from '@/db';
import { Prisma, UserType } from '@prisma/client';

import { ContributorWithReports } from '@/types/users';
import { BreadCrumbsClient } from '@/components/breadcrumbs';
import ContributorsTable from '@/components/contributors/contributors-table';

export const metadata: Metadata = {
  title: 'Contributors - Engineers raising the bar',
  description: 'Folks finding problems and fixing them',
};

export default async function Contributors() {
  const contributors: ContributorWithReports[] = await db.user.findMany({
    where: { userTypes: { hasSome: [UserType.ENGINEER, UserType.GOD] } },
    include: { Report: true },
  });
  return (
    <div className="flex flex-col gap-4">
      <BreadCrumbsClient
        crumbs={[{ href: '/contributors', text: 'Contributors' }]}
      />
      <ContributorsTable contributors={contributors} />
    </div>
  );
}
