'use client';

import { Chip } from '@nextui-org/react';
import { UserType } from '@prisma/client';

import { ReportWithTags } from '@/types/reports';
import { UserWithCompanies } from '@/types/users';

import { Category } from '../category';
import Selector from './selector';

export default function CategorySelector({
  user,
  report,
  mode,
}: {
  user?: UserWithCompanies | null;
  report?: ReportWithTags;
  mode?: 'view' | 'creation' | 'update';
}) {
  let content;
  const isCompany = user?.userTypes.includes(UserType.COMPANY);
  if (mode === 'view' && !isCompany) {
    content = [
      <Chip
        key="category-label"
        radius="sm"
        className="text-foreground bg-background"
      >
        Category
      </Chip>,
      <Category key="category" category={report!.category} />,
    ];
  } else if (mode === 'view' && isCompany) {
    content = [
      <Selector key="category-selector" />,
      <Category key="category" category={report!.category} />,
    ];
  } else if (mode === 'update') {
    content = [
      <Selector key="category-selector" />,
      <Category key="category" category={report!.category} />,
    ];
  }
  return content;
}
