'use client';

import { ReportWithTags } from '@/types';
import { Select, SelectItem } from '@nextui-org/react';
import { Impact } from '@prisma/client';

import { ImpactChip } from '../impact';

export default function ({
  viewModeProps,
  report,
}: {
  viewModeProps?: {
    isReadOnly: boolean;
    isDisabled: boolean;
  };
  report?: ReportWithTags;
}) {
  return (
    <Select
      label="Impact"
      name="impact"
      {...viewModeProps}
      placeholder="Select an impact level"
      defaultSelectedKeys={[report?.impact || Impact.SingleUser]}
      classNames={{ value: ['mt-1'] }}
      renderValue={(selected) => (
        <ImpactChip impact={selected[0].key as Impact} />
      )}
    >
      {Object.values(Impact).map((impact) => (
        <SelectItem key={impact} textValue={impact}>
          <ImpactChip impact={impact} />
        </SelectItem>
      ))}
    </Select>
  );
}
