'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/react';

import { BreadCrumbsClient } from '@/components/breadcrumbs';
import Header from '@/components/header';
import NavTabs from '@/components/nav-tabs';
import Providers from '@/app/providers';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'Bug busters - Find glitches get money',
//   description: 'Submit bugs, get noticed, get paid',
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="">
        <Providers>
          <Header />
          <NavTabs />
          <div className="flex flex-col my-4">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
