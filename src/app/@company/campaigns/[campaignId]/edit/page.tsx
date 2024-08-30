import { fetchUser } from '@/actions';
import db from '@/db';
import { CampaignWithCompany, UserWithCompanies } from '@/types';
import { Button } from '@nextui-org/react';
import { CampaignStatus } from '@prisma/client';

import ArchiveCampaignModal from '@/components/campaigns/forms/archive-campaign-modal';
import { EditCampaignForm } from '@/components/campaigns/forms/edit-campaign-form';
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
          { href: `/campaigns/${campaign.id}`, text: `${campaign?.name}` },
          {
            href: '/campaigns',
            text: 'Edit',
          },
        ]}
        buttonProps={{
          custom: campaign.status !== CampaignStatus.Archived && (
            <ArchiveCampaignModal campaignId={campaignId} />
          ),
          secondary:
            campaign.status === CampaignStatus.Archived
              ? { href: '/campaigns', text: 'Back to campaigns' }
              : undefined,
        }}
      />
      <EditCampaignForm campaign={campaign} user={user} />
    </div>
  );
}
