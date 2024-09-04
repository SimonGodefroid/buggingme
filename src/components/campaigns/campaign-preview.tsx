import { Link } from '@nextui-org/react';
import { Campaign } from '@prisma/client';

export default function CampaignPreview({
  campaign,
}: {
  campaign: Campaign | null;
}) {
  return (
    <div className="flex justify-between py-4 border-2 px-4 rounded-lg">
      <div>
        <Link href={`/campaigns/${campaign?.id}`}>{campaign?.name}</Link>
      </div>
      <div>{`${campaign?.startDate.toDateString()} - ${campaign?.endDate.toDateString()}`}</div>
    </div>
  );
}
