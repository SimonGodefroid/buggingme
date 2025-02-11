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
  return (
    <Card
      isHoverable
      className="w-full gap-4 p-4 "
      key={report.id}
      isPressable
      onPress={() => router.push(`/reports/${report.id}`)}
    >
      <CardBody className="flex">
        <div className="flex xs:flex-row">
          <div className="flex flex-col items-center md:flex-row justify-between md:items-start w-full gap-10 xs:flex-wrap md:flex-nowrap 0">
            {/* Left: Image */}
            <div className="w-48 h-32 flex-shrink-0 ">
              <img
                src={
                  report.attachments?.[0]?.url ||
                  'https://placehold.co/200x200?text=No+attachment+yet'
                }
                alt={report.company?.name}
                className="w-full h-full object-cover rounded-md"
              />
            </div>

            {/* Middle: SiteBadge + Title (Now centered) */}
            <div className="flex flex-col md:flex-row md:items-start flex-wrap xl:flex-nowrap w-full p-4 gap-4 tems-center sm:items-start ">
              <div className="flex md:w-1/5 justify-center gap-4">
                <SiteBadge company={report.company as Company} />
              </div>
              <div className="w-full md:w-4/5">
                <p className="text-md text-center md:text-left w-full">
                  {report.title}
                </p>
              </div>
            </div>

            {/* Right: Status + Category (Moves below image on small screens) */}
            <div className="flex md:justify-start gap-4 md:flex-col h-full items-center ">
              <Status status={report.status} />
              <Category category={report.category} />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
