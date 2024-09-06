import { pascalToSentenceCase } from '@/helpers';
import { Chip, ChipProps } from '@nextui-org/react';
import { CampaignType } from '@prisma/client';

export default function CampaignTypeChip({ type }: { type: CampaignType }) {
  const typeMapping: Record<CampaignType, ChipProps['color']> = {
    [CampaignType.InvitationOnly]: 'warning',
    [CampaignType.Public]: 'success',
  };
  return (
    <Chip size="sm" variant='flat' color={typeMapping[type]}>
      {pascalToSentenceCase(type)}
    </Chip>
  );
}
