import { fetchUser } from '@/actions';
import db from '@/db';
import {  CampaignWithInvitations, UserWithCompanies } from '@/types';

import CampaignsTable from '@/components/campaigns/campaigns-table';
import PageHeader from '@/components/common/page-header';

export default async function Campaigns() {
  const user: UserWithCompanies | null = await fetchUser();
  const campaigns: CampaignWithInvitations[] =
    await db.campaign.findMany({
      where: {
        companyId: { in: user?.companies.map((company) => company.id) },
      },
      include: {
        company: true,
        invitations: { include: { invitee: true, invitor: true } },
      },
    });

  if (!user) {
    return <div>Not authorized</div>;
  }
  return (
    <div className="flex flex-col gap-4">
      <PageHeader crumbs={[{ href: '/campaigns', text: 'Campaigns' }]} />
      <CampaignsTable campaigns={campaigns} user={user} />
    </div>
  );
}
