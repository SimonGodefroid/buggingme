import * as actions from '@/actions';
import { UserWithCompanies } from '@/types';
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
import { isCompany } from '@/helpers';

// import { useSession } from 'next-auth/react';

export default function HeaderAuth({
  user,
}: {
  user: UserWithCompanies | null;
}) {
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
            // break-words max-w-[174px]
            className="cursor-pointer"
            avatarProps={{ radius: 'lg', src: `${user?.image}` }}
            description={
              <span className="break-words max-w-[10px]">{user.email}</span>
            }
            name={isCompany(user) ? user?.companies?.[0]?.name : user?.name}
          >
            {user?.name}
          </User>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col gap-4 p-4">
            <Button as={Link} href={`/profile/${user.id}`}>
              Profile
            </Button>
            <form action={actions.signOut}>
              <Button type="submit">Sign Out</Button>
            </form>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
  return authContent;
}
