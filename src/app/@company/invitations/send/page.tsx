import { fetchUser } from '@/actions';
import db from '@/db';
import { CampaignWithInvitations } from '@/types';
import { CampaignStatus, CampaignType, UserType } from '@prisma/client';

import PageHeader from '@/components/common/page-header';
import { SendInvitationsForm } from '@/components/invitations';

export default async function SendInvitations() {
  const user = await fetchUser();
  const users = await db.user.findMany({
    where: {
      userTypes: {
        hasSome: [UserType.ENGINEER],
      },
    },
  });
  // const users = await db.report.findMany({
  //   select: { user: true },
  //   where: {
  //     company: {
  //       id: user?.companies[0].id, // Assumes user is associated with at least one company
  //     },
  //   },
  // });
  const campaigns: CampaignWithInvitations[] | null =
    await db.campaign.findMany({
      where: {
        company: {
          id: user?.companies[0].id, // Assumes user is associated with at least one company
        },
        status: CampaignStatus.Created,
        type: CampaignType.InvitationOnly,
      },
      include: {
        company: true,
        invitations: { include: { invitee: true, invitor: true } },
      },
    });
  return (
    <div className="flex flex-col">
      <PageHeader
        crumbs={[
          { href: '/invitations', text: 'Invitations' },
          { href: `/invitations/send`, text: 'Send invitations' },
        ]}
        buttonProps={{
          secondary: { text: 'Back' },
        }}
      />
      <SendInvitationsForm user={user} users={users} campaigns={campaigns} />
    </div>
  );
}
