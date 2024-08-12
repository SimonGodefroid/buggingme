import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
} from '@nextui-org/react';
import { Company } from '@prisma/client';

export default function CompanyCard({ company }: { company: Company }) {
  return (
    <Card className="p-4" as={Link} href={`/companies/${company.id}`}>
      <CardHeader>{company.name}</CardHeader>
      <CardBody className="flex flex-col p-4 gap-4">
        <pre>{JSON.stringify(company, null, '\t')}</pre>
      </CardBody>
      <CardFooter className="justify-end">
        <Button>Edit</Button>
      </CardFooter>
    </Card>
  );
}
