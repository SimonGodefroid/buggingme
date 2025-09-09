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
        src: company.domain
          ? `https://img.logo.dev/${company.domain}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}`
          : (company.logo ?? ''),
        size: 'md',
        className: 'shrink-0',
      }}
      description={company.domain}
      name={company.name}
    >
      {company.name}
    </User>
  );
}
