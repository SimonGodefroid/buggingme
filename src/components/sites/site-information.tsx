import { CompanyWithReports } from '@/types';
import { Avatar } from '@nextui-org/react';
import { Company } from '@prisma/client';

import ReportsTable from '../reports/reports-table';

export default function SiteInformation({
  company,
}: {
  company: CompanyWithReports;
}) {
  return (
    <div className="flex flex-col p-4">
      <div className="flex flex-col gap-4">
        <h1>Site Information</h1>
        <div className="flex gap-2 items-center">
          <Avatar
            alt={company?.name}
            src={`${company?.logo}`}
            size="sm"
            isBordered
          />
          <div className="flex flex-col">
            <span>{company?.name}</span>
            <span className="text-tiny text-default-400">
              {company?.domain}
            </span>
          </div>
        </div>
        <ReportsTable reports={company?.reports} />
      </div>
    </div>
  );
}
