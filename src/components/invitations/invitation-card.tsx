import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
} from '@nextui-org/react';

import { InvitationWithUser } from '@/types/invitations';

export default function InvitationCard({ item }: { item: InvitationWithUser }) {
  return (
    <Card className="p-4" as={Link} href={`/invitation/${item.id}`}>
      <CardHeader>{item?.invitor?.name}</CardHeader>
      <CardBody className="flex flex-col p-4 gap-4">
        <pre>{JSON.stringify(item, null, '\t')}lol did it trigger?</pre>
      </CardBody>
      <CardFooter className="justify-end">
        <Button>Edit</Button>
      </CardFooter>
    </Card>
  );
}
