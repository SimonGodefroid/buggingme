import { Avatar } from '@nextui-org/react';
import { Company } from '@prisma/client';

export default function SiteBadge({ company }: { company: Company }) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 flex-wrap justify-center md:justify-start md:flex-nowrap ">
      {/* <div className="flex gap-2 items-center flex-wrap justify-center"> */}
      <Avatar
        alt={company?.name}
        src={`${company?.logo}`}
        className="shrink-0"
        isBordered
        radius="sm"
      />
      <div className="flex flex-col">
        <span>{company?.name}</span>
        {/* <span className="w-full text-center">{company?.name}</span> */}
        <span className="text-tiny text-default-400">{company?.domain}</span>
      </div>
    </div>
  );
}
