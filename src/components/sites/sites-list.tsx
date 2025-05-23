'use client';

import { useRouter } from 'next/navigation';

import { CompanyWithReports } from '@/types';
import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
} from '@nextui-org/react';

const getHost = (domain?: string): string => {
  if (!domain) return ''; // Handle undefined/null case early

  try {
    return new URL(domain).host;
  } catch {
    return ''; // Fallback in case of an invalid URL
  }
};

export default function SitesList({
  companies,
}: {
  companies: CompanyWithReports[];
}) {
  const router = useRouter();
  return (companies || []).map((c) => {
    const link = getHost(c.domain ?? undefined);

    return (
      <Card
        className="w-4/5 sm:w-2/3 md:w-1/2 lg:w-10/12"
        key={c.id}
        isPressable
        onPress={() => {
          router.push(`/sites/${link}`);
        }}
      >
        <CardHeader className="flex justify-between items-center bg-blue-400">
          <div className="flex gap-3 items-center">
            <Avatar
              alt={c.name + ' logo'}
              radius="sm"
              src={`${c.logo}`}
              name={c.name}
            />
            <div className="flex flex-col">
              <p className="text-md">{c.name}</p>
              <p className="text-small text-foreground">{c.domain}</p>
            </div>
          </div>
          <p className="text-md">{c.reports.length} reports</p>
        </CardHeader>
        <CardBody>
          <p>
            Categories:{' '}
            {c.reports.map((r) => r.tags.map((tag) => tag.name).join(', '))}
          </p>
        </CardBody>
        <CardFooter className="flex justify-end">
          <Link showAnchorIcon href={`${c.domain}`}>
            {c.domain}
          </Link>
        </CardFooter>
      </Card>
    );
  });
}
