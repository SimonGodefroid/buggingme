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
          {/* overflow-auto  */}
          <main className="flex flex-col m-4 md:m-4 min-h-[80vh] my-4 mb-10">
            {rendered()}
          </main>
          <footer className="border-t-1 py-2">
            <div
              className="flex flex-col items-center
            text-small gap-1 md:flex-row md:gap-4 md:justify-center"
            >
              <span>&copy; {new Date().getFullYear()} &nbsp;Bug busters</span>
              <a
                className="hover:text-background p-1 rounded bg-gradient-to-r hover:from-teal-400 hover:to-blue-500"
                href="/privacy-policy.html"
              >
                Privacy Policy
              </a>

              <a
                className="hover:text-background p-1 rounded bg-gradient-to-r hover:from-teal-400 hover:to-blue-500"
                href="/terms-and-conditions.html"
              >
                Terms and Conditions
              </a>
              <a
                className="hover:text-background p-1 rounded bg-gradient-to-r hover:from-teal-400 hover:to-blue-500"
                href="/cookie-policy.html"
              >
                Cookie Policy
              </a>
              <a
                className="hover:text-background p-1 rounded bg-gradient-to-r hover:from-teal-400 hover:to-blue-500"
                href="/contact.html"
              >
                Contact
              </a>
              <a
                className="hover:text-background p-1 rounded bg-gradient-to-r hover:from-teal-400 hover:to-blue-500"
                href="/github.html"
              >
                Github
              </a>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
