import { fetchUser } from '@/actions';
import db from '@/db';
import { UserType } from '@prisma/client';

import { CreateCampaignForm } from '@/components/campaigns/forms';
import PageHeader from '@/components/common/page-header';

export default async function CreateCampaign() {
  const user = await fetchUser();
  // If we want only existing contributors for that company to be invited
  // const users = await db.report.findMany({
  //   select: { user: true },
  //   where: {
  //     company: {
  //       id: user?.companies[0].id, // Assumes user is associated with at least one company
  //     },
  //   },
  // });
  const users = await db.user.findMany({
    where: {
      userTypes: {
        hasSome: [UserType.ENGINEER],
      },
    },
  });

  return (
    <div className="flex flex-col">
      <PageHeader
        crumbs={[
          { href: '/campaigns', text: 'Campaigns' },
          { href: `/campaigns/create`, text: 'Create campaign' },
        ]}
        buttonProps={{
          secondary: { text: 'Back' },
        }}
      />
      <CreateCampaignForm user={user} users={users} />
    </div>
  );
}
