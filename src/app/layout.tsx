'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

import { useState } from 'react';

import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/react';

import { BreadCrumbsClient } from '@/components/breadcrumbs';
import Header from '@/components/header';
import NavTabs from '@/components/nav-tabs';
import Providers from '@/app/providers';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'Bug busters - Find glitches get money',
//   description: 'Submit bugs, get noticed, get paid',

export enum Theme {
  dark = 'dark',
  light = 'light',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>(Theme.dark);
  return (
    <html lang="en">
      <body
        className={`${theme === Theme.dark ? 'dark text-foreground bg-background' : ''}`}
      >
        <Providers>
          <Header theme={theme} setTheme={setTheme} />
          <NavTabs />
          <main className="flex flex-col my-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
