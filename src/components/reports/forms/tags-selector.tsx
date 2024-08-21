'use client';

import { ReportWithTags } from '@/types';
import { Chip, Select, SelectItem } from '@nextui-org/react';
import { Tag } from '@prisma/client';

export default function TagsSelector({
  report,
  tags,
  mode,
}: {
  report?: ReportWithTags;
  tags: Tag[];
  mode: 'view' | 'update' | 'creation';
}) {
  return (
    <Select
      label={<div className="mb-4">Tags</div>}
      name="tags"
      isDisabled={mode === 'view'}
      selectionMode="multiple"
      selectedKeys={report?.tags.map((tag) => tag.id)}
      renderValue={(values) => {
        return [
          ...values.map((value) => (
            <Chip color="primary" isCloseable key={value.key} className="m-1">
              {value.textValue}
            </Chip>
          )),
        ].filter(Boolean);
      }}
      isMultiline
      placeholder="Select tags"
    >
      {(tags || []).map((tag: Tag) => (
        <SelectItem key={tag.id}>{tag.name}</SelectItem>
      ))}
    </Select>
  );
}
