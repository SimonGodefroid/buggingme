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
} from '@nextui-org/react';
import { Session } from 'next-auth';

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
          {/* <form action={actions.signIn}> */}
          <form action={actions.signInAuth0}>
            <Button type="submit" color="secondary" variant="bordered">
              Sign In with Auth0
            </Button>
          </form>
        </NavbarItem>

        <NavbarItem>
          <form action={actions.signIn}>
            <Button type="submit" color="primary" variant="flat">
              Sign In with Github
            </Button>
          </form>
        </NavbarItem>
      </>
    );
  }

  return authContent;
}
