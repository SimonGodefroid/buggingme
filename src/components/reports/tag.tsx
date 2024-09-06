import { pascalToSentenceCase } from '@/helpers/strings/pascalToSentenceCase';
import { Chip } from '@nextui-org/react';
import { Tag } from '@prisma/client';

import Icon from '../common/Icon';

const tagsIconMapping = (tags: Tag) => {
  switch (tags.name) {
    case 'Visual Problem':
      return 'low-vision';
    case 'Accessibility (a11y) Issue':
      return 'accessibility';
    case 'Data Issue':
      return 'data';
    case 'Performance Issue':
      return 'run';
    case 'Security Vulnerability':
      return 'lock';
    case 'Functional Bug':
      return 'bug-alt';
    case 'Usability Issue':
      return 'block';
    case 'Compatibility Issue':
      return 'extension';
    case 'Content Issue':
      return 'book-content';
    case 'Code Issue':
      return 'code-alt';
    case 'Integration Issue':
      return 'transfer';
    case 'Responsive Design Issue':
      return 'devices';
    default:
      return '';
  }
};
export const TagChip = ({ tag }: { tag: Tag }) => {
  return (
    <Chip
      className="capitalize"
      size="sm"
      variant='solid'
      color="primary"
      startContent={<Icon name={tagsIconMapping(tag)} size="medium" />}
    >
      {`${pascalToSentenceCase(tag.name)}`}
    </Chip>
  );
};
