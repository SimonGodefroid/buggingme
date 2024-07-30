// import { Suspense } from 'react';

import type { Dispatch, SetStateAction } from 'react';

import Link from 'next/link';

import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Tooltip,
} from '@nextui-org/react';

import HeaderAuth from '@/components/header-auth';
import { Theme } from '@/app/layout';

// import SearchInput from './search-input';

export default function Header({
  theme,
  setTheme,
}: {
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
}) {
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
      <NavbarContent justify="end">
        <Tooltip
          content={`Switch to ${theme === Theme.light ? Theme.dark : Theme.light} theme`}
        >
          <Button
          variant='light'
            onClick={() => {
              setTheme((prevTheme: Theme) =>
                prevTheme === Theme.light ? Theme.dark : Theme.light,
              );
            }}
          >
            {theme === Theme.light ? '🌙' : '🌞'}
          </Button>
        </Tooltip>
        <HeaderAuth />
      </NavbarContent>
    </Navbar>
  );
}
