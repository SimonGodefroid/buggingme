'use client';

import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/react';

export type Crumb = { href: string; text: string };
export type Crumbs = Crumb[];
const HOME_CRUMB = { href: '/', text: 'Home' };
export const BreadCrumbsClient = ({ crumbs }: { crumbs: Crumbs }) => {
  return (
    <div>
      <Breadcrumbs>
        {[HOME_CRUMB, ...crumbs].map((crumb, index) => (
          <BreadcrumbItem classNames={{ 'item': 'text-red-300 text-wrap' }}
            key={crumb.href + index + crumb.text}
            href={crumb.href}
          >
            {crumb.text}
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
    </div>
  );
};
