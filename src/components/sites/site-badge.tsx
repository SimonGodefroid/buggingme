import { Avatar } from '@nextui-org/react';
import { Company } from '@prisma/client';

export default function SiteBadge({ company }: { company: Company }) {
  return (
    <div className="flex gap-2 items-center">
      <Avatar
        alt={company?.name}
        src={`${company?.logo}`}
        size="sm"
        isBordered
      />
      <div className="flex flex-col">
        <span>{company?.name}</span>
        <span className="text-tiny text-default-400">{company?.domain}</span>
      </div>
    </div>
  );
}
