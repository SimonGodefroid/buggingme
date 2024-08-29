// import { Suspense } from 'react';
import Link from 'next/link';

import { auth } from '@/auth';
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react';

import HeaderAuth from '@/components/header-auth';

import ThemeSwitch from './common/theme-switch';

// import SearchInput from './search-input';
export default async function Header() {
  const session = await auth();
  return (
    <Navbar className="shadow mb-6">
      <NavbarBrand>
        <Link href="/" className="font-bold">
          BugBusters
        </Link>
      </NavbarBrand>
      <NavbarContent justify="center"></NavbarContent>
      <NavbarContent justify="end">
        <HeaderAuth user={session?.user} />
        <ThemeSwitch />
      </NavbarContent>
    </Navbar>
  );
}
