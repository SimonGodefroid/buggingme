import db from '@/db';
import { CampaignWithCompany } from '@/types';

import CampaignDetails from '@/components/campaigns/campaign-details';
import PageHeader from '@/components/common/page-header';

export default async function ViewCampaign({
  params: { campaignId },
}: {
  params: { campaignId: string };
}) {
  const campaign: CampaignWithCompany | null = await db.campaign.findFirst({
    where: {
      id: campaignId,
    },
    include: { company: true },
  });
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        crumbs={[
          { href: '/campaigns', text: 'Campaigns' },
          { href: '/campaigns', text: `${campaign?.name}` },
        ]}
      />
      <CampaignDetails item={campaign} />
    </div>
  );
}
