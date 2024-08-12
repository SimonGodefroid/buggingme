import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

import { fetchAllCounts } from '@/actions/count/fetchAllCounts';
import { fetchUser } from '@/actions/users/fetchUser';
import { UserType } from '@prisma/client';

import NavTabs from '@/components/nav-tabs';
import Providers from '@/app/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bug busters - Find glitches get money',
  description: 'Submit bugs, get noticed, get paid',
};

export default async function RootLayout({
  children,
  engineer,
  admin,
  company,
}: {
  children: React.ReactNode;
  admin: React.ReactNode;
  company: React.ReactNode;
  engineer: React.ReactNode;
}) {
  const counts = await fetchAllCounts();
  const user = await fetchUser();

  return (
    <html lang="en">
      <body>
        <Providers>
          {/* Wrap main content with ThemeProvider */}
          <NavTabs count={counts} user={user} />
          <main className="my-4 ">
            {user?.userTypes.includes(UserType.GOD) ? admin : null}
            {user?.userTypes.includes(UserType.ENGINEER) ? engineer : null}
            {user?.userTypes.includes(UserType.COMPANY) ? company : null}
            {!user ? children : null}
          </main>
        </Providers>
      </body>
    </html>
  );
}
