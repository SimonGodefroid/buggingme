'use client';

import { ReportWithTags } from '@/types';
import { Chip, Select, SelectItem } from '@nextui-org/react';
import { Tag } from '@prisma/client';

import { TagChip } from '../tag';

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
      defaultSelectedKeys={report?.tags.map((tag) => tag.id)}
      renderValue={(values) => {
        return (
          <div className="flex flex-wrap gap-2">
            {[
              ...values.map((value) => (
                <TagChip
                  tag={{ name: value.textValue } as Tag}
                  key={value.key}
                />
              )),
            ].filter(Boolean)}
          </div>
        );
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
