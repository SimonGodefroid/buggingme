import { pascalToSentenceCase } from '@/helpers/strings/pascalToSentenceCase';
import { Chip, ChipProps } from '@nextui-org/react';
import { ReportCategory } from '@prisma/client';

export const categoryColorMap: Record<
  ReportCategory,
  { color: ChipProps['color']; variant: ChipProps['variant'] }
> = {
  // Open categories
  [ReportCategory.New]: { color: 'danger', variant: 'dot' },
  [ReportCategory.InformationNeeded]: { color: 'warning', variant: 'dot' },
  [ReportCategory.Valid]: { color: 'success', variant: 'dot' },
  [ReportCategory.PendingCompanyReview]: { color: 'secondary', variant: 'dot' },
  [ReportCategory.Testing]: { color: 'primary', variant: 'dot' },
  // Closed categories
  [ReportCategory.Duplicate]: {
    color: 'secondary',
    variant: 'flat',
  },
  [ReportCategory.Informative]: { color: 'primary', variant: 'flat' },
  [ReportCategory.Spam]: { color: 'danger', variant: 'flat' },
  [ReportCategory.NotApplicable]: { color: 'default', variant: 'flat' },
  [ReportCategory.Resolved]: { color: 'success', variant: 'flat' },
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
