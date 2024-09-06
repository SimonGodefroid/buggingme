import { ContributorWithReports } from '@/types';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
  User,
} from '@nextui-org/react';

export default function ContributorCard({
  item,
}: {
  item: ContributorWithReports | null;
}) {
  return (
    <Card className="p-4" as={Link} href={`/contributors/${item?.id}`}>
      <CardBody className="flex flex-col p-4 gap-4">
        <User
          className="flex flex-col gap-4"
          avatarProps={{ radius: 'lg', src: `${item?.image}` }}
          name={item?.name}
        />
        <div className="flex justify-center">
          {Boolean(item?.Report?.length && item?.Report?.length > 1)
            ? item?.Report.length + ' Reports'
            : item?.Report.length + ' Report'}{' '}
        </div>
      </CardBody>
      <CardFooter className="justify-center">{`Reputation: ${item?.reputation}`}</CardFooter>
    </Card>
  );
}
