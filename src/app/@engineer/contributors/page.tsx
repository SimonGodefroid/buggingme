import { Metadata } from 'next';

import db from '@/db';
import { getContributors } from '@/db/queries';

import PageHeader from '@/components/common/page-header';
import ContributorsTable from '@/components/contributors/contributors-table';

export const metadata: Metadata = {
  title: 'Contributors - Engineers raising the bar',
  description: 'Folks finding problems and fixing them',
};

export default async function Contributors({ ...args }) {
  const contributors = await getContributors();
  return (
    <div className="flex flex-col gap-4">
      <PageHeader crumbs={[{ href: '/contributors', text: 'Contributors' }]} />
      <ContributorsTable contributors={contributors} />
    </div>
  );
}
