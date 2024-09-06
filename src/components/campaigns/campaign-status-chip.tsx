import { pascalToSentenceCase } from '@/helpers';
import { isPastDate } from '@/helpers/dates/isPastDate';
import { CampaignWithCompany } from '@/types';
import { Chip, ChipProps } from '@nextui-org/react';
import { Campaign, CampaignStatus } from '@prisma/client';

export default function CampaignStatusChip({
  campaign,
}: {
  campaign: CampaignWithCompany | null;
}) {
  const statusColorMapping: Record<
    CampaignStatus,
    { color: ChipProps['color']; variant: ChipProps['variant'] }
  > = {
    [CampaignStatus.Created]: {
      color: 'success',
      variant: 'bordered',
    },
    [CampaignStatus.Archived]: {
      color: 'default',
      variant: 'bordered',
    },
  };
  const isPastCampaign = isPastDate(campaign!.endDate);

  const chipsProps: {
    color: ChipProps['color'];
    variant: ChipProps['variant'];
  } = {
    ...statusColorMapping[campaign!.status],
    ...(isPastCampaign
      ? {
          color: 'danger',
          variant: 'bordered',
        }
      : {}),
  };
  if (!campaign) return null;
  return (
    <Chip {...chipsProps} size="sm">
      {isPastCampaign ? 'Ended' : pascalToSentenceCase(campaign.status)}
    </Chip>
  );
}
