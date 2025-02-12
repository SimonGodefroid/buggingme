'use client';

import { ReactNode } from 'react';

import { useRouter } from 'next/navigation';

import { Button, Link } from '@nextui-org/react';

import type { Crumbs } from '@/components/breadcrumbs';

import { BreadCrumbsClient } from '../breadcrumbs';

export default function PageHeader({
  crumbs,
  buttonProps,
}: {
  crumbs: Crumbs;
  buttonProps?: {
    primary?: { href?: string; text: string };
    secondary?: { href?: string; text: string };
    custom?: ReactNode;
  };
}) {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center md:flex-row md:justify-between gap-4 mx-8">
      <BreadCrumbsClient crumbs={crumbs} />
      <div className="flex justify-center md:justify-end gap-4 flex-col md:flex-row">
        {buttonProps?.secondary && (
          <Button
            href={
              buttonProps.secondary.href
                ? buttonProps.secondary.href
                : undefined
            }
            as={Link}
            onClick={
              buttonProps.secondary.href ? undefined : () => router.back()
            }
            color="primary"
            variant="ghost"
          >
            {buttonProps.secondary.text}
          </Button>
        )}
        {buttonProps?.primary && (
          <Button
            href={buttonProps.primary.href}
            as={Link}
            variant="solid"
            color="primary"
          >
            {buttonProps.primary.text}
          </Button>
        )}
        {buttonProps?.custom && buttonProps.custom}
      </div>
    </div>
  );
}
