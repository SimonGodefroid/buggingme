import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

import { fetchAllCounts } from '@/actions/count/fetchAllCounts';
import { fetchUser } from '@/actions/users/fetchUser';
import { UserWithCompanies } from '@/types';
import { Card, CardBody } from '@nextui-org/react';
import { UserType } from '@prisma/client';

import NavTabs from '@/components/nav-tabs';
import Providers from '@/app/providers';

import NotFound from './not-found';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "BugBusters - It's like Bravado but for Engineers",
  description: 'Report bugs, get noticed, talk tech, stand out, get hired',
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
  const user: UserWithCompanies | null = await fetchUser();

  const rendered = () => {
    if (!user) {
      return children;
    } else {
      if (user?.userTypes?.includes(UserType.GOD)) {
        return admin || <NotFound />;
      }
      if (user?.userTypes?.includes(UserType.ENGINEER)) {
        return engineer || <NotFound />;
      }
      if (user?.userTypes?.includes(UserType.COMPANY)) {
        return company || <NotFound />;
      }
    }
  };

  return (
    <html suppressHydrationWarning={true} lang="en">
      <body>
        <Providers>
          {/* Wrap main content with ThemeProvider */}
          <NavTabs count={counts} user={user} />
          {/* overflow-auto  */}
          <main className="flex flex-col m-4 md:m-4 my-4 mb-10 pb-60">
            <Card>
              <CardBody className='bg-green-400 text-foreground'>New release soon: Transforming reports into a war-room for both community topics and bug reports</CardBody>
            </Card>
            {rendered()}
          </main>
          <footer className="border-t-1 py-1 text-xs fixed bottom-0 w-full bg-background text-foreground z-10 opacity-75">
            <div className="flex flex-wrap justify-center text-xs gap-x-4 gap-y-1 md:text-sm items-center">
              <span>&copy; {new Date().getFullYear()} &nbsp;BugBusters</span>
              {[
                { href: '/privacy-policy.html', label: 'Privacy Policy' },
                {
                  href: '/terms-and-conditions.html',
                  label: 'Terms and Conditions',
                },
                { href: '/cookie-policy.html', label: 'Cookie Policy' },
                { href: '/contact.html', label: 'Contact' },
                { href: '/github.html', label: 'Github' },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  className="hover:text-background p-1 rounded bg-gradient-to-r hover:from-teal-400 hover:to-blue-500"
                  href={href}
                >
                  {label}
                </a>
              ))}
            </div>
          </footer>
          {/* <footer className="border-t-1 py-2 fixed bottom-0 w-full bg-foreground text-background z-10 ">
            <div
              className="flex flex-col items-center
            text-small gap-1 md:flex-row md:gap-4 md:justify-center"
            >
              <span>&copy; {new Date().getFullYear()} &nbsp;BugBusters</span>
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
          </footer> */}
        </Providers>
      </body>
    </html>
  );
}
