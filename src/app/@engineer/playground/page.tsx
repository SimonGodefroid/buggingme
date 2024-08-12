import { fetchUser } from '@/actions';
import db from '@/db';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';

import { ReportWithTags } from '@/types/reports';
import StatusSelector from '@/components/common/status-selector';

export default async function App() {
  const user = await fetchUser();
  console.log('user'.repeat(200), user);
  const reports: ReportWithTags[] = await db.report.findMany({
    include: { company: true, tags: true, user: true, StatusHistory: true },
  });
  return <StatusSelector report={reports[0]} />;
}
