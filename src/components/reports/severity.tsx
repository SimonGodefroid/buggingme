import { pascalToSentenceCase } from '@/helpers/strings/pascalToSentenceCase';
import { Chip, ChipProps } from '@nextui-org/react';
import { Severity } from '@prisma/client';

export const severityColorMap: Record<
  Severity,
  { color: ChipProps['color']; variant: ChipProps['variant'] }
> = {
  [Severity.Critical]: {
    variant: 'dot',
    color: 'danger',
  },
  [Severity.High]: {
    variant: 'dot',
    color: 'warning',
  },
  [Severity.Medium]: {
    variant: 'dot',
    color: 'primary',
  },
  [Severity.Low]: {
    variant: 'dot',
    color: 'success',
  },
};

export const SeverityChip = ({ severity }: { severity: Severity }) => {
  const chipsProps = { ...severityColorMap[severity] };
  return (
    <Chip className="capitalize" {...chipsProps} size="sm">
      {pascalToSentenceCase(severity)}
    </Chip>
  );
};
