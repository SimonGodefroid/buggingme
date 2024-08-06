import { pascalToSentenceCase } from '@/helpers/strings/pascalToSentenceCase';
import { Chip } from '@nextui-org/react';
import { Tag } from '@prisma/client';

export const TagChip = ({ tag }: { tag: Tag }) => {
  return (
    <Chip className="capitalize" size="sm" color='primary'>
      {`${pascalToSentenceCase(tag.name)}`}
    </Chip>
  );
};
