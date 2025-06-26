'use client';

import { ReportWithTags } from '@/types';
import { Select, SelectItem } from '@nextui-org/react';
import { Severity } from '@prisma/client';

import { SeverityChip } from '../severity';

export default function SeveritySelector({
  viewModeProps,
  report,
}: {
  viewModeProps?: { isReadOnly?: boolean; isDisabled?: boolean };
  report?: ReportWithTags;
}) {
  return (
    <Select
      label="Severity"
      name="severity"
      {...viewModeProps}
      defaultSelectedKeys={[report?.severity || Severity.Medium]}
      placeholder="Select a severity degree"
      classNames={{ value: ['mt-1'] }}
      renderValue={(selected) => (
        <SeverityChip severity={selected[0].key as Severity} />
      )}
    >
      {Object.values(Severity).map((degree) => (
        <SelectItem key={degree} textValue={degree}>
          <SeverityChip severity={degree} />
        </SelectItem>
      ))}
    </Select>
  );
}
