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
  item,
}: {
  item: ContributorWithReports;
}) {
  return (
    <Card className="p-4" as={Link} href={`/contributors/${item.id}`}>
      <CardHeader>{item.name}</CardHeader>
      <CardBody className="flex flex-col p-4 gap-4">
        <pre>{JSON.stringify(item, null, '\t')}</pre>
      </CardBody>
      <CardFooter className="justify-end">
        {/* <Button>Edit</Button> */}
      </CardFooter>
    </Card>
  );
}
