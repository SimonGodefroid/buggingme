import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

import { useState } from 'react';

import db from '@/db';
import {
  countCampaigns,
  countCompanies,
  countContributors,
  countReports,
} from '@/queries';

import Header from '@/components/header';
import NavTabs from '@/components/nav-tabs';
import Providers from '@/app/providers';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'Bug busters - Find glitches get money',
//   description: 'Submit bugs, get noticed, get paid',

async function fetchCounts() {
  try {
    const [companies, reports, campaigns, contributors] = await Promise.all([
      countCompanies(),
      countReports(),
      countCampaigns(),
      countContributors(),
    ]);

    return { companies, reports, campaigns, contributors };
  } catch (error) {
    console.error('Failed to load counts:', error);
    return { companies: 0, reports: 0, campaigns: 0, contributors: 0 };
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const counts = await fetchCounts();

  return (
    <html lang="en">
      <body>
        <Providers>
          {/* Wrap main content with ThemeProvider */}
          <Header />
          <NavTabs count={counts} />
          <main className="my-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
