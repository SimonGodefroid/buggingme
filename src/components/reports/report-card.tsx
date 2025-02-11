import { ReportWithTags } from '@/types';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
} from '@nextui-org/react';
import { Company } from '@prisma/client';

import { Category } from '../common/category';
import SiteBadge from '../sites/site-badge';
import { Status } from './status';

export default function ReportCard({ report }: { report: ReportWithTags }) {
  return (
    <Card className="p-4" as={Link} href={`/reports/${report.id}`}>
      <CardHeader className="flex flex-col gap-4">
        <div>{report.title}</div>
        <div>
          <SiteBadge company={report.company as Company} />
        </div>
      </CardHeader>
      <CardBody className="flex flex-col p-4 gap-4">
        <img src={report.attachments[0].url} alt={report.title} />
      </CardBody>
      <CardFooter className="flex justify-between items-center gap-2">
        <Status status={report.status} />
        <Category category={report.category} />
      </CardFooter>
    </Card>
  );
}
