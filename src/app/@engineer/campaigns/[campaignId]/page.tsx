import db from '@/db';

import PageHeader from '@/components/common/page-header';

export default async function ViewCampaign({
  params: { campaignId },
}: {
  params: { campaignId: string };
}) {
  const campaign = await db.campaign.findFirst({
    where: {
      id: campaignId,
    },
    include: { User: true },
  });
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        crumbs={[
          { href: '/campaigns', text: 'Campaigns' },
          { href: '/campaigns', text: `${campaign?.name}` },
        ]}
      />
      <pre>{JSON.stringify(campaign, null, '\t')}</pre>
    </div>
  );
}
