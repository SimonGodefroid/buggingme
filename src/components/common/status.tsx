import { Chip, ChipProps } from '@nextui-org/react';
import { ReportStatus } from '@prisma/client';

export const statusColorMap: Record<
  ReportStatus,
  { color: ChipProps['color']; variant: ChipProps['variant'] }
> = {
  [ReportStatus.Open]: { color: 'primary', variant: 'solid' },
  [ReportStatus.UnderReview]: { color: 'secondary', variant: 'bordered' },
  [ReportStatus.InProgress]: { color: 'primary', variant: 'shadow' },
  [ReportStatus.Resolved]: { color: 'success', variant: 'solid' },
  [ReportStatus.Closed]: { color: 'secondary', variant: 'light' },
  [ReportStatus.Deferred]: { color: 'warning', variant: 'bordered' },
  [ReportStatus.Cancelled]: { color: 'danger', variant: 'solid' },
  [ReportStatus.Rejected]: { color: 'danger', variant: 'bordered' },
  [ReportStatus.Deleted]: { color: 'danger', variant: 'faded' },
};

export const Status = ({ status }: { status: ReportStatus }) => {
  return (
    <Chip
      className="capitalize"
      {...statusColorMap[status]}
      size="sm"
      variant="flat"
    >
      {status}
    </Chip>
  );
};
