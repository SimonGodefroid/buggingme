import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

import { fetchAllCounts } from '@/actions/count/fetchAllCounts';
import { fetchUser } from '@/actions/users/fetchUser';
import { UserType } from '@prisma/client';

import NavTabs from '@/components/nav-tabs';
import Providers from '@/app/providers';

import NotFound from './not-found';

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

  const rendered = () => {
    if (!user) {
      return children;
    } else {
      if (user?.userTypes.includes(UserType.GOD)) {
        return admin || <NotFound />;
      }
      if (user?.userTypes.includes(UserType.ENGINEER)) {
        return engineer || <NotFound />;
      }
      if (user?.userTypes.includes(UserType.COMPANY)) {
        return company || <NotFound />;
      }
    }
  };

  return (
    <html lang="en">
      <body>
        <Providers>
          {/* Wrap main content with ThemeProvider */}
          <NavTabs count={counts} user={user} />
          <main className="flex flex-col m-4 md:m-4 min-h-[80vh] my-4 overflow-auto mb-10">
            {rendered()}
            {/* {!user ? children : <>coucou</>} */}
          </main>
          <footer className="border-t-1 md:m-4">
            <div className="grid grid-cols-3">
              <div className="col-span-1 m-2">
                <h4 className="text-left">Privacy</h4>
                <div className="flex flex-col items-start text-small">
                  <a href="https://www.google.com">Privacy Policy</a>
                  <a href="https://www.google.com">Cookies and Consent</a>
                </div>
              </div>
              <div className="col-span-1 m-2">
                <h4 className="text-center md:text-left">Legal</h4>
                <div className="flex flex-col items-center md:items-start text-small  whitespace-nowrap">
                  <a href="https://www.google.com">Terms & conditions</a>
                  <a href="https://www.google.com">Legal Terms</a>
                </div>
              </div>
              <div className="col-span-1 m-2">
                <h4 className="text-right md:text-left">Contact</h4>
                <div className="flex flex-col items-end md:items-start text-small">
                  <a href="https://www.google.com">Email</a>
                  <a href="https://www.google.com">Github</a>
                  <a href="https://www.google.com">Twitter</a>
                </div>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
