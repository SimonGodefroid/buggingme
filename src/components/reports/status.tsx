import { pascalToSentenceCase } from '@/helpers/strings/pascalToSentenceCase';
import { Chip, ChipProps } from '@nextui-org/react';
import { ReportStatus } from '@prisma/client';

export const statusColorMap: Record<
  ReportStatus,
  { color: ChipProps['color']; variant: ChipProps['variant'] }
> = {
  [ReportStatus.Open]: { color: 'primary', variant: 'flat' },
  [ReportStatus.UnderReview]: {
    color: 'secondary',
    variant: 'flat',
  },
  [ReportStatus.InProgress]: { color: 'warning', variant: 'flat' },
  [ReportStatus.Resolved]: { color: 'success', variant: 'flat' },
  [ReportStatus.Closed]: { color: 'default', variant: 'flat' },
  [ReportStatus.Deferred]: { color: 'warning', variant: 'bordered' },
  [ReportStatus.Cancelled]: { color: 'danger', variant: 'bordered' },
  [ReportStatus.Rejected]: { color: 'danger', variant: 'solid' },
  [ReportStatus.Deleted]: { color: 'danger', variant: 'faded' },
};

export const Status = ({ status }: { status: ReportStatus }) => {
  const chipProps = { ...statusColorMap[status] };
  return (
    <Chip className="capitalize" {...chipProps} size="sm">
      {pascalToSentenceCase(status)}
    </Chip>
  );
};
