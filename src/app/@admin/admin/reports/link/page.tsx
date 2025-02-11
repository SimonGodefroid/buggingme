import db from '@/db';
import { getAllCompanies, getAllUsers } from '@/db/queries';
import { ReportWithTags, UserWithCompanies } from '@/types';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { ReportCategory, ReportStatus } from '@prisma/client';

import { EditorClient } from '@/components/common/editor';
import ImageTooltip from '@/components/common/image-tooltip';
import PageHeader from '@/components/common/page-header';
import CompanyPicker from '@/components/companies/company-picker';
import LinkReportForm from '@/components/reports/forms/link-report-form';
import { TagChip } from '@/components/reports/tag';

const animals = [
  { key: 'whale', label: 'Whale' },
  { key: 'otter', label: 'Otter' },
];
export default async function LinkReport() {
  // const users = (await getAllUsers()) as UserWithCompanies[];
  // const companies = await getAllCompanies();
  const reports = (await db.report.findMany({
    where: {
      companyId: { in: [`${process.env.BUG_BUSTERS_COMPANY_ID}`] },
      category: {
        in: [ReportCategory.New],
      },
    },
    include: {
      company: true,
      tags: true,
      user: true,
      StatusHistory: true,
      attachments: true,
    },
  })) as ReportWithTags[];
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        crumbs={[
          { href: '/', text: 'Admin' },
          { href: '/admin/reports/link', text: 'Link report to company' },
        ]}
        buttonProps={{ secondary: { href: '/', text: 'Back' } }}
      />
      <div className="flex flex-col gap-4 p-4">
        <h1>Link Report to company</h1>
        {reports.map((r) => (
          <LinkReportForm report={r} key={r.id} />
        ))}
      </div>
    </div>
  );
}
