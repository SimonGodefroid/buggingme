import { Metadata } from 'next';

import db from '@/db';
import { Prisma, UserType } from '@prisma/client';

import { BreadCrumbsClient } from '@/components/breadcrumbs';
import ContributorsTable from '@/components/contributors/contributors-table';

export const metadata: Metadata = {
  title: 'Contributors - Engineers raising the bar',
  description: 'Folks finding problems and fixing them',
};
export type ContributorWithReports = Prisma.UserGetPayload<{
  include: { Report: true };
}>;
export default async function Contributors({ ...args }) {
  const contributors: ContributorWithReports[] = await db.user.findMany({
    where: { userTypes: { has: UserType.ENGINEER } },
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
