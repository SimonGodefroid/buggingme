import { fetchUser } from '@/actions/users';
import { auth } from '@/auth';
import { Card, CardBody, CardHeader } from '@nextui-org/react';

export default async function Home() {
  const user = await fetchUser();
  return (
    <div className="flex flex-col gap-4">
      <h1>Home</h1>
      <div className="flex flex-col gap-4 max-w-fit ">
        <Card>
          <CardHeader className="text-xl">{`${user?.email}`}</CardHeader>
          <CardBody>
            <p>{`This is the home of your companies ${user?.companies.map((c) => c.name).join(',')}`}</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
