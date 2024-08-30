'use client';

import { useRouter } from 'next/navigation';

import { CampaignWithCompany } from '@/types';
import { Card, CardBody, CardFooter, Image } from '@nextui-org/react';

export default function CampaignCard({ item }: { item: CampaignWithCompany }) {
  const router = useRouter();
  return (
    <Card
      shadow="sm"
      isPressable
      onPress={() => router.push(`/campaigns/${item.id}`)}
    >
      <CardBody className="overflow-visible p-0">
        <Image
          shadow="sm"
          radius="lg"
          width="100%"
          alt={item?.name}
          className="w-full object-cover h-[140px]"
          src={`https://placehold.co/200x200?text=${item.name}`}
        />
      </CardBody>
      <CardFooter className="text-small justify-between">
        <b>{item.name}</b>
        <p className="text-default-500">{item.startDate?.toISOString()}</p>
      </CardFooter>
    </Card>
  );
}
