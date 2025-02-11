'use client';

import { useRouter } from 'next/navigation';

import { ReportWithTags } from '@/types';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
} from '@nextui-org/react';
import { Company } from '@prisma/client';

import { Category } from '../common/category';
import CompanyCard from '../companies/company-card';
import SiteBadge from '../sites/site-badge';
import { Status } from './status';

export default function ReportSummary({ report }: { report: ReportWithTags }) {
  const router = useRouter();
  console.log('report', report);
  return (
    <Card
      isHoverable
      className="w-full"
      key={report.id}
      isPressable
      onPress={() => router.push(`/reports/${report.id}`)}
    >
      <CardHeader className="flex justify-around ">
        <div className="w-48 h-32 flex-shrink-0">
          <img
            src={report.attachments?.[0]?.url || '/placeholder.png'}
            alt={report.company?.name}
            className="w-full h-full object-cover rounded-md"
          />
        </div>
        <SiteBadge company={report.company as Company} />
        <div className="flex gap-3">
          <p className="text-md">{report.title}</p>
        </div>
        <div className="flex gap-4">
          <Status status={report.status} />
          <Category category={report.category} />
        </div>
      </CardHeader>
      <CardBody>
        {/* <p>Categories: {report.tags.map((tag) => tag.name).join(', ')}</p> */}
      </CardBody>
    </Card>
  );
}
