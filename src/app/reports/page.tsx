import { db } from '@/db';

import ReportsTable from '@/components/reports/reports-table';
import { report } from 'process';

export default async function Reports() {
  const reports = await db.report.findMany();

  return (
    <div className="flex flex-col gap-4">
      <h1>Reports</h1>
      <ReportsTable reports={reports} />
    </div>
  );
}
