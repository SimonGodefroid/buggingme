'use client';

import React, { FC } from 'react';

import { usePathname } from 'next/navigation';

import { signIn, signInAuth0, signOut } from '@/actions';
import { isCompany } from '@/helpers';
import { UserWithCompanies } from '@/types';
import {
  Avatar,
  Button,
  Chip,
  Link,
  LinkProps,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';
import { IconProps } from 'react-toastify';

import Icon from './common/Icon';
import SignInAuth0Button from './common/sign-in-auth0-button';
import SignInGitHubButton from './common/sign-in-github-button';
import ThemeSwitch from './common/theme-switch';
import HeaderAuth from './header-auth';

export type Count = {
  companies: number;
  campaigns: number;
  contributors: number;
  reports: number;
};

export default function NavTabs({
  user,
  count,
}: {
  user: UserWithCompanies | null;
  count: Count;
}) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const path = usePathname();

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Reports', href: '/reports' },
    { label: 'Contributors', href: '/contributors' },
    { label: 'Sites', href: '/sites' },
    // { label: 'Companies', href: '/companies' },
    // { label: 'Campaigns', href: '/campaigns' },
    // { label: 'Invitations', href: '/invitations' },
    { label: 'Leaderboard', href: '/leaderboard' },
    user
      ? { label: 'Log Out', onPress: () => signOut(), color: 'danger' }
      : null,
    !user ? { label: 'Sign in | Engineer', onPress: () => signIn() } : null,
    !user ? { label: 'Sign in | Company', onPress: () => signInAuth0() } : null,
  ].filter(Boolean) as
    | {
        label: string;
        href: string;
        onPress: never;
        color?: LinkProps['color'] | undefined;
      }[]
    | {
        label: string;
        href: never;
        onPress: () => void;
        color?: LinkProps['color'] | undefined;
      }[];

  type NavItem = {
    emoji: string | React.ReactNode;
    label: string;
    href: string;
    count?: number;
  };

  const navItems = [
    {
      emoji: <Icon name="bug" />,
      // emoji: '🐛',
      label: 'Reports',
      href: '/reports',
      count: count.reports,
    },
    {
      emoji: <Icon name="group" />,
      // emoji: '👷👷‍♀️',
      label: 'Contributors',
      href: '/contributors',
      count: count.contributors,
    },
    // isCompany(user!)
    //   ? null
    //   : {
    //       emoji: <Icon name="buildings" />,
    //       // emoji: '🏢',
    //       label: 'Companies',
    //       href: '/companies',
    //       count: count.companies,
    //     },
    // {
    //   emoji: (
    //     <div className="flex">
    //       <i className="bx bxs-megaphone bx-sm"></i>
    //     </div>
    //   ),
    //   // emoji: '📢',
    //   label: 'Campaigns',
    //   href: '/campaigns',
    //   count: count.campaigns,
    // },
    // {
    //   emoji: <Icon name="envelope" />,
    //   // emoji: '✉️',
    //   label: 'Invitations',
    //   href: '/invitations',
    // },
    {
      // emoji: '🏆',
      emoji: <Icon name="globe" />,
      label: 'Sites',
      href: '/sites',
    },
    {
      // emoji: '🏆',
      emoji: <Icon name="trophy" />,
      label: 'Leaderboard',
      href: '/leaderboard',
    },
    {
      emoji: <Icon name="help-circle" />,
      label: 'How It Works',
      href: '/how-it-works',
    },
  ].filter(Boolean) as NavItem[];
  const noop = () => {};

  return (
    <Navbar
      classNames={{
        base: 'justify-start md:justify-between md:max-w-8xl',
        // base: 'justify-start md:justify-between md:max-w-8xl sm:bg-orange-800 md:bg-green-800 lg:bg-pink-800',
        wrapper: 'flex max-w-8xl justify-end',
      }}
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="sm:hidden">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <p className="font-bold text-inherit ">BugBusters</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex gap-4 sm:text-sm md:flex-nowrap"
        justify="center"
      >
        <NavbarBrand className="cursor-pointer">
          <Link color="foreground" href="/">
            <p className="font-bold text-inherit ">BugBusters</p>
          </Link>
        </NavbarBrand>

        {navItems.map((item) => (
          <NavbarItem
            isActive={item.href === `/${path.split('/')[1]}`}
            key={item.label}
          >
            <Link
              color="foreground"
              isBlock
              href={item.href}
              className="hover:text-violet-300"
            >
              <div className="flex items-center space-x-2">
                <span className="sm:hidden xl:flex">{item.emoji}</span>
                <span>{item.label}</span>
                {!('count' in item) || !user ? null : (
                  <Chip
                    size="sm"
                    variant="flat"
                    color="primary"
                    className="sm:hidden xl:flex"
                  >
                    {item.count}
                  </Chip>
                )}
              </div>
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent className="flex flex-row-reverse justify-between">
        <NavbarItem className="xl:hidden">
          <Popover>
            <PopoverTrigger>
              <Avatar size="sm" src={user?.image || ''} />
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col gap-4">
                {user ? (
                  <div className="flex flex-col items-center gap-4 p-4 xs:hidden">
                    <span>{user?.email}</span>
                    <Button
                      as={Link}
                      href={`/profile/${user.id}}`}
                      startContent={<Icon name="user" />}
                    >
                      Profile
                    </Button>
                    <form action={signOut}>
                      <Button
                        color="danger"
                        type="submit"
                        startContent={<Icon name="log-out" />}
                      >
                        Logout
                      </Button>
                    </form>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 p-4 xs:hidden">
                    <SignInGitHubButton label="Sign In | Sign Up" />
                    {/* <SignInAuth0Button /> */}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </NavbarItem>
        <NavbarItem className="hidden xl:flex xl:justify-end">
          <HeaderAuth user={user} />
        </NavbarItem>
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                item?.color
                  ? item?.color
                  : item.href === `/${path.split('/')[1]}`
                    ? 'warning'
                    : 'foreground'
              }
              href={item.href}
              onPress={item.onPress || noop}
              size="lg"
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
