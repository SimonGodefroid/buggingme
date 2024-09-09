import db from '@/db';
import { CampaignWithCompany } from '@/types';
import { Campaign } from '@prisma/client';

import CampaignCard from '@/components/campaigns/campaign-card';
import PageHeader from '@/components/common/page-header';

export default async function Campaigns() {
  const campaigns: CampaignWithCompany[] | null = await db.campaign.findMany({
    include: { company: true },
  });

  return (
    <div className="flex flex-col gap-4">
      <PageHeader crumbs={[{ href: '/campaigns', text: 'Campaigns' }]} />
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
        {campaigns?.map((item) => <CampaignCard key={item.id} item={item} />)}
      </div>
    </div>
  );
}
