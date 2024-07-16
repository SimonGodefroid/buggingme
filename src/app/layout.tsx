import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

import Header from '@/components/header';
import Providers from '@/app/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bugging me - Find glitches get money',
  description: 'Submit bugs, get noticed, get paid',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="mx-4">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
