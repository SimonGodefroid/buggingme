import { User } from '@nextui-org/react';
import { Company } from '@prisma/client';

export default function CompanyBadge({ company }: { company: Company }) {
  return (
    <User
      classNames={{
        base: 'gap-4 p-4',
      }}
      avatarProps={{
        radius: 'lg',
        src: `${company?.logo}`,
        size: 'md',
        className:'shrink-0'
      }}
      description={company.domain}
      name={company.name}
    >
      {company.name}
    </User>
  );
}
