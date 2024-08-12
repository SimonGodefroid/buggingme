import * as actions from '@/actions';
import {
  Button,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  User,
} from '@nextui-org/react';
import { Session } from 'next-auth';

import SignInAuth0Button from './common/sign-in-auth0-button';
import SignInGitHubButton from './common/sign-in-github-button';

// import { useSession } from 'next-auth/react';

export default function HeaderAuth({ user }: { user: Session['user'] | null }) {
  let authContent: React.ReactNode;
  if (!user) {
    authContent = (
      <div className="flex gap-4">
        <SignInGitHubButton />
        <SignInAuth0Button />
      </div>
    );
  } else {
    // if (user.status === 'loading') {
    //   authContent = null;
    // } else if (session.data?.user) {
    authContent = (
      <Popover placement="bottom">
        <PopoverTrigger>
          <User
            className="cursor-pointer"
            avatarProps={{ radius: 'lg', src: `${user?.image}` }}
            description={<span className="">{user.email}</span>}
            name={user?.name}
          >
            {user?.name}
          </User>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col gap-4 p-4">
            <form action={actions.signOut}>
              <Button type="submit">Sign Out</Button>
            </form>
            <Button as={Link} href={`/profile/${user.id}`}>
              Profile
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
  return authContent;
}
