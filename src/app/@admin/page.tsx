'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { getAllCompanies, getAllUsers } from '@/db/queries';
import { UserWithCompanies } from '@/types';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from '@nextui-org/react';

import { LinkUserForm } from '@/components/users/link-user-form';

export default function Admin() {
  const router = useRouter();
  const adminActions = [
    {
      title: 'Create company',
      href: '/admin/companies/create',
      description: 'Create a new company to attach reports to',
    },
    {
      title: 'Link user to company',
      href: '/admin/users/link',
      description:
        'When a user claims a company profile, you have to link the user profile to an existing company',
    },
    {
      title: 'Link report to company',
      href: '/admin/reports/link',
      description:
        'When the company is created, the admin will have to QC the report and link it to the company',
    },
  ];
  return (
    <div className="flex flex-col">
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
        {adminActions.map((item, index) => (
          <Card
            key={index}
            className="flex flex-col h-full gap-4 p-4"
            isPressable
            shadow="sm"
            onPress={() => {
              router.push(item.href);
            }}
          >
            <CardBody className="overflow-visible p-0">
              <b>{item.title}</b>
              <p className="text-default-500">{item.description}</p>
            </CardBody>
            <CardFooter className="text-small justify-between"></CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
