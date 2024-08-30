import { fetchUser } from '@/actions';
import db from '@/db';
import { CampaignWithCompany, UserWithCompanies } from '@/types';
import { CampaignStatus } from '@prisma/client';

import { ViewCampaignForm } from '@/components/campaigns/forms/view-campaign-form';
import PageHeader from '@/components/common/page-header';

export default async function ViewCampaign({
  params: { campaignId },
}: {
  params: { campaignId: string };
}) {
  const user: UserWithCompanies | null = await fetchUser();
  const campaign: CampaignWithCompany | null = await db.campaign.findFirst({
    where: { id: campaignId },
    include: { User: true, company: true },
  });

  if (!user) {
    return <div>Not authorized</div>;
  }
  if (!campaign) {
    return <div>Campaign not found</div>;
  }
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        crumbs={[
          { href: '/campaigns', text: 'Campaigns' },
          { href: '/campaigns', text: `${campaign?.name}` },
        ]}
        buttonProps={{
          primary:
            campaign.status !== CampaignStatus.Archived
              ? { text: 'Edit', href: `/campaigns/${campaignId}/edit` }
              : undefined,
          secondary: { text: 'Back to campaigns', href: '/campaigns' },
        }}
      />
      <ViewCampaignForm campaign={campaign} user={user} />
    </div>
  );
}
