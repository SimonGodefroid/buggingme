'use client';

import { redirect, useRouter } from 'next/navigation';

import * as actions from '@/actions';
import {
  Avatar,
  Button,
  Link,
  NavbarItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  User,
} from '@nextui-org/react';
import { Session } from 'next-auth';

import SignInAuth0Button from './common/sign-in-auth0-button';
import SignInGitHubButton from './common/sign-in-github-button';

// import { useSession } from 'next-auth/react';

export default function HeaderAuth({ user }: { user: Session['user'] }) {
  const router = useRouter();
  // const session = useSession();
  let authContent: React.ReactNode;
  if (user) {
    // if (user.status === 'loading') {
    //   authContent = null;
    // } else if (session.data?.user) {
    authContent = (
      <Popover placement="left">
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
            <form
              action={async () => {
                await actions.signOut().then(() => {
                  router.push('/');
                });
              }}
            >
              <Button type="submit">Sign Out</Button>
            </form>
            <Button as={Link} href={`/profile/${user.id}`}>
              Profile
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  } else {
    authContent = (
      <>
        <NavbarItem>
          <SignInAuth0Button />
        </NavbarItem>

        <NavbarItem>
          <SignInGitHubButton />
        </NavbarItem>
      </>
    );
  }

  return authContent;
}
