import { fetchUser } from '@/actions';
import db from '@/db';
import { UserWithCompanies } from '@/types';

import { InvitationWithCampaignAndParties } from '@/types/invitations';
import PageHeader from '@/components/common/page-header';
import InvitationsTable from '@/components/invitations/invitations-table';

export default async function Invitations() {
  const user: UserWithCompanies | null = await fetchUser();
  const invitations: InvitationWithCampaignAndParties[] =
    await db.invitation.findMany({
      where: {
        inviteeId: { in: [user!.id] },
      },
      include: {
        campaign: true,
        company: true,
        invitee: true,
        invitor: true,
      },
    });

  if (!user) {
    return <div>Not authorized</div>;
  }
  return (
    <div className="flex flex-col gap-4">
      <PageHeader crumbs={[{ href: '/invitations', text: 'Invitations' }]} />
      <InvitationsTable invitations={invitations} user={user} />
    </div>
  );
}
