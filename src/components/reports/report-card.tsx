import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
} from '@nextui-org/react';

import { ReportWithTags } from '@/types';

import { Category } from '../common/category';
import { Status } from './status';

export default function ReportCard({ report }: { report: ReportWithTags }) {
  return (
    <Card className="p-4" as={Link} href={`/reports/${report.id}`}>
      <CardHeader>{report.title}</CardHeader>
      <CardBody className="flex flex-col p-4 gap-4">
        <Status status={report.status} />
        <Category category={report.category} />
      </CardBody>
      <CardFooter className="justify-end">
        <Button>Edit</Button>
      </CardFooter>
    </Card>
  );
}
