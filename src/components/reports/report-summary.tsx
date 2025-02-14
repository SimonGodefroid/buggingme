'use client';

import { useRouter } from 'next/navigation';

import { timeAgo } from '@/helpers/dates';
import { ReportWithTags } from '@/types';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
  Tooltip,
} from '@nextui-org/react';
import { Company, ReportStatus } from '@prisma/client';

import { Category } from '../common/category';
import UserCard from '../common/user-card';
import SiteBadge from '../sites/site-badge';
import { Status } from './status';

export default function ReportSummary({ report }: { report: ReportWithTags }) {
  const router = useRouter();
  const reportTimeAgo = timeAgo(report.createdAt);
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
          <div className="flex flex-col items-center md:flex-row justify-between md:items-start w-full gap-10 xs:flex-wrap md:flex-nowrap ">
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
            <div className="flex flex-col items-center md:flex-row md:items-start flex-wrap xl:flex-nowrap w-full p-4 gap-4">
              <div className="flex md:w-1/5 justify-start gap-4 mx-4">
                {/* <CompanyBadge company={report.company as Company} /> */}
                <SiteBadge company={report.company as Company} />
              </div>
              <div className="w-full md:w-4/5">
                <p className="text-md text-center md:text-left w-full">
                  {report.title}
                </p>
              </div>
              <div className="flex flex-col gap-4 items-center md:items-start">
                <h4 className="text-foreground text-tiny">Reported by:</h4>
                <UserCard user={report.user} />
                {report.status === ReportStatus.Open && (
                  <Tooltip content={`Reported on ${report.createdAt}`}>
                    <h5
                      suppressHydrationWarning
                      className="text-foreground text-tiny"
                    >
                      {`${reportTimeAgo.days} days, ${reportTimeAgo.hours} hours, ${reportTimeAgo.minutes} minutes ago`}
                    </h5>
                  </Tooltip>
                )}
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
