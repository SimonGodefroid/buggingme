import { pascalToSentenceCase } from '@/helpers/strings/pascalToSentenceCase';
import { Chip, ChipProps } from '@nextui-org/react';
import { Impact } from '@prisma/client';

export const impactColorMap: Record<Impact, { label: string }> = {
  [Impact.AllUsers]: {
    label: '🌎',
  },
  [Impact.SingleUser]: {
    label: '👩🏽‍💻',
  },
  [Impact.SiteWide]: {
    label: '🌐',
  },
  [Impact.SpecificBrowsersDevices]: {
    label: '💻',
  },
};

export const ImpactChip = ({ impact }: { impact: Impact }) => {
  const { label, ...chipsProps } = { ...impactColorMap[impact] };
  return (
    <Chip className="capitalize" {...chipsProps} size="sm">
      {`${label} ${pascalToSentenceCase(impact)}`}
    </Chip>
  );
};
