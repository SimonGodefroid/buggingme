import { fetchUser } from '@/actions/users';
import { auth } from '@/auth';

export default async function Home() {
  const authenticatedUser = await auth();
  const user = authenticatedUser?.user?.id
    ? await fetchUser(authenticatedUser?.user?.id as string)
    : null;
  return (
    <div>
      <h1>Home of the companies...</h1>
      <pre>
        <code>{JSON.stringify(user, null, '\t')}</code>
      </pre>
    </div>
  );
}
