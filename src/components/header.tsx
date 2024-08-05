'use client';

// import { Suspense } from 'react';
import Link from 'next/link';

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

export default function Header() {
  return (
    <Navbar className="shadow mb-6">
      <NavbarBrand>
        <Link href="/" className="font-bold">
          Bug busters
        </Link>
      </NavbarBrand>
      <NavbarContent justify="center">
        <NavbarItem>{/* <Suspense><SearchInput /></Suspense> */}</NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end" >
        <HeaderAuth />
        <ThemeSwitch />
      </NavbarContent>
    </Navbar>
  );
}
