import db from '@/db';
import { Prisma } from '@prisma/client';

import { BreadCrumbsClient } from '@/components/breadcrumbs';
import ContributorsTable from '@/components/contributors/contributors-table';

export type ContributorWithReports = Prisma.UserGetPayload<{
  include: { Report: true };
}>;
export default async function Contributors({ ...args }) {
  const contributors: ContributorWithReports[] = await db.user.findMany({
    // where: { role: 'ENGINEER' },
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
