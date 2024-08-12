import { Button, Link } from '@nextui-org/react';

import type { Crumbs } from '@/components/breadcrumbs';

import { BreadCrumbsClient } from '../breadcrumbs';

export default function PageHeader({
  crumbs,
  buttonProps,
}: {
  crumbs: Crumbs;
  buttonProps?: {
    primary?: { href: string; text: string };
    secondary?: { href: string; text: string };
  };
}) {
  return (
    <div className="flex flex-col items-center md:flex-row md:justify-between gap-4">
      <BreadCrumbsClient crumbs={crumbs} />
      <div className="flex justify-center md:justify-end gap-4">
        {buttonProps?.secondary && (
          <Button
            href={buttonProps.secondary.href}
            as={Link}
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
      </div>
    </div>
  );
}
