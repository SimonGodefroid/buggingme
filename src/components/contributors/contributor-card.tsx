import { ContributorWithReports } from '@/types';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
} from '@nextui-org/react';

export default function ContributorCard({
  contributor,
}: {
  contributor: ContributorWithReports;
}) {
  return (
    <Card className="p-4" as={Link} href={`/contributors/${contributor.id}`}>
      <CardHeader>{contributor.name}</CardHeader>
      <CardBody className="flex flex-col p-4 gap-4">
        <pre>{JSON.stringify(contributor, null, '\t')}</pre>
      </CardBody>
      <CardFooter className="justify-end">
        {/* <Button>Edit</Button> */}
      </CardFooter>
    </Card>
  );
}
