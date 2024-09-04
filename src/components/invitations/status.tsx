import { pascalToSentenceCase } from '@/helpers/strings/pascalToSentenceCase';
import { ButtonProps, Chip, ChipProps } from '@nextui-org/react';
import { InvitationStatus } from '@prisma/client';

export const statusColorMap: Record<
  InvitationStatus,
  {
    color: ChipProps['color'];
    variant: ChipProps['variant'];
  }
> = {
  [InvitationStatus.Pending]: { color: 'primary', variant: 'flat' },
  [InvitationStatus.Accepted]: { color: 'success', variant: 'flat' },
  [InvitationStatus.Rejected]: { color: 'danger', variant: 'bordered' },
  [InvitationStatus.Revoked]: { color: 'default', variant: 'bordered' },
  [InvitationStatus.Cancelled]: { color: 'danger', variant: 'bordered' },
};

export const Status = ({ status }: { status: InvitationStatus }) => {
  const chipProps = { ...statusColorMap[status] };
  return (
    <Chip className="capitalize" {...chipProps} size="sm">
      {pascalToSentenceCase(status)}
    </Chip>
  );
};
