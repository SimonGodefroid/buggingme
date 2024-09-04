import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
} from '@nextui-org/react';
import { Company } from '@prisma/client';

export default function CompanyCard({ item }: { item: Company }) {
  return (
    <Card className="p-4" as={Link} href={`/companies/${item.id}`}>
      <CardHeader>{item.name}</CardHeader>
      <CardBody className="flex flex-col p-4 gap-4">
        <pre>{JSON.stringify(item, null, '\t')}</pre>
      </CardBody>
      <CardFooter className="justify-end">
        <Button>Edit</Button>
      </CardFooter>
    </Card>
  );
}
