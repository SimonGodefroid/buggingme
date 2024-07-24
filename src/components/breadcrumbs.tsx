'use client';

import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/react';

export type Crumb = { href: string; text: string };
export type Crumbs = Crumb[];
const HOME_CRUMB = { href: '/', text: 'Home' };
export const BreadCrumbsClient = ({ crumbs }: { crumbs: Crumbs }) => {
  return (
    <div className="mt-4">
      <Breadcrumbs>
        {[HOME_CRUMB, ...crumbs].map((crumb) => (
          <BreadcrumbItem href={crumb.href}>{crumb.text}</BreadcrumbItem>
        ))}
      </Breadcrumbs>
    </div>
  );
};
