'use client';

import React from 'react';

import {
  Button,
  Chip,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@nextui-org/react';
import { User } from 'next-auth';

import { UserWithCompanies } from '@/app/@admin/admin/page';

import SignInAuth0Button from './common/sign-in-auth0-button';
import SignInGitHubButton from './common/sign-in-github-button';

export type Count = {
  companies: number;
  campaigns: number;
  contributors: number;
  reports: number;
};

export default function NavTabs({
  count,
  user,
}: {
  count: Count;
  user: User | null;
}) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    'Reports',
    'Contributors',
    'Companies',
    'Campaigns',
    'Leaderboard',
    'Log Out',
  ];

  return (
    <Navbar
      classNames={{ base: 'justify-start' }}
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <p className="font-bold text-inherit">Bug busters</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand className="cursor-pointer">
          <Link color="foreground" href="/">
            <p className="font-bold text-inherit">Bug busters</p>
          </Link>
        </NavbarBrand>
        <NavbarItem>
          <Link color="foreground" isBlock href="/reports">
            <div className="flex items-center space-x-2">
              <span>🐛&nbsp;Reports</span>
              <Chip size="sm" variant="faded">
                0{/* {count.reports} */}
              </Chip>
            </div>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" isBlock href="/contributors">
            <div className="flex items-center space-x-2">
              <span>👷👷‍♀️&nbsp;Contributors</span>
              <Chip size="sm" variant="faded">
                {/* {count.contributors} */}0
              </Chip>
            </div>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" isBlock href="/companies">
            <div className="flex items-center space-x-2">
              <span>🏢&nbsp;Companies</span>
              <Chip size="sm" variant="faded">
                {/* {count.companies} */}0
              </Chip>
            </div>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" isBlock href="/campaigns">
            <div className="flex items-center space-x-2">
              <span>📢&nbsp;Campaigns</span>
              <Chip size="sm" variant="faded">
                {/* {count.campaigns} */}0
              </Chip>
            </div>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" isBlock href="/reports">
            <div className="flex items-center space-x-2">
              <span>🏆&nbsp;Leaderboard</span>
              <Chip size="sm" color="danger">
                New
              </Chip>
            </div>
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <SignInAuth0Button />
        </NavbarItem>
        <NavbarItem>
          <SignInGitHubButton />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2
                  ? 'warning'
                  : index === menuItems.length - 1
                    ? 'danger'
                    : 'foreground'
              }
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
