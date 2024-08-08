'use client';

import { redirect } from 'next/navigation';

import * as actions from '@/actions';
import {
  Avatar,
  Button,
  NavbarItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from '@nextui-org/react';
import { Session } from 'next-auth';

import SignInAuth0Button from './common/sign-in-auth0-button';
import SignInGitHubButton from './common/sign-in-github-button';

// import { useSession } from 'next-auth/react';

export default function HeaderAuth({ user }: { user: Session['user'] }) {
  // const session = useSession();
  let authContent: React.ReactNode;
  if (user) {
    // if (user.status === 'loading') {
    //   authContent = null;
    // } else if (session.data?.user) {
    authContent = (
      <Popover placement="left">
        <PopoverTrigger>
          <Avatar src={user?.image || ''} />
        </PopoverTrigger>
        <PopoverContent>
          <div className="p-4">
            <form
              action={() => {
                actions.signOut();
                redirect('/');
              }}
            >
              <Button type="submit">Sign Out</Button>
            </form>
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
