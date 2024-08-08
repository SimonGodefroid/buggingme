import { pascalToSentenceCase } from '@/helpers/strings/pascalToSentenceCase';
import { Button, Chip, ChipProps } from '@nextui-org/react';
import { ReportCategory } from '@prisma/client';

export const categoryColorMap: Record<
  ReportCategory,
  { color: ChipProps['color']; variant: ChipProps['variant'] }
> = {
  [ReportCategory.New]: { color: 'danger', variant: 'dot' },
  [ReportCategory.Duplicate]: {
    color: 'secondary',
    variant: 'flat',
  },
  [ReportCategory.InformationNeeded]: { color: 'warning', variant: 'dot' },
  [ReportCategory.Informative]: { color: 'primary', variant: 'dot' },
  [ReportCategory.Spam]: { color: 'danger', variant: 'flat' },
  [ReportCategory.Valid]: { color: 'success', variant: 'dot' },
  [ReportCategory.NotApplicable]: { color: 'default', variant: 'flat' },
  [ReportCategory.PendingCampaign]: { color: 'secondary', variant: 'dot' },
};

export const Category = ({ category }: { category?: ReportCategory }) => {
  const chipProps = { ...categoryColorMap[category as ReportCategory] };
  if (!category) return null;
  return (
    <Chip className="capitalize" {...chipProps} size="sm">
      {pascalToSentenceCase(category)}
    </Chip>
  );
};
