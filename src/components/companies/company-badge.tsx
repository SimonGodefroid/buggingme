import { User } from '@nextui-org/react';
import { Company } from '@prisma/client';

export default function CompanyBadge({ company }: { company: Company }) {
  return (
    <User
      avatarProps={{
        radius: 'lg',
        src: `${company?.logo}`,
      }}
      description={company.name}
      name={company.name}
    >
      {company.name}
    </User>
  );
}
