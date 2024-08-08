import { fetchUser } from '@/actions';
import { auth } from '@/auth';
import { User } from '@nextui-org/react';

export default async function Profile() {
  const authenticatedUser = await auth();
  const user = authenticatedUser?.user?.id
    ? await fetchUser(authenticatedUser?.user?.id)
    : null;
  return (
    <div className="flex flex-col gap-4">
      <User
        avatarProps={{ radius: 'lg', src: `${user?.image}` }}
        description={
          <span className="">
            {user?.companies.map((c) => c.name).join(',')}
          </span>
        }
        name={user?.name}
      >
        {user?.name}
      </User>
      <pre>
        <code>{JSON.stringify(user, null, '\t')}</code>
      </pre>
    </div>
  );
}
