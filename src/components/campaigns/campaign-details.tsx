'use client';

import { CampaignWithCompany } from '@/types';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Image,
} from '@nextui-org/react';

import CampaignStatusChip from './campaign-status-chip';

export default function CampaignDetails({
  item,
}: {
  item: CampaignWithCompany | null;
}) {
  return (
    <Card shadow="sm">
      <CardHeader className="flex justify-center my-4">
        <div className="flex flex-col items-center">
          <b>{item?.name}</b>
          <p className="text-default-500">
            {item?.startDate?.toDateString()}-{item?.endDate?.toDateString()}
          </p>
          <p className="text-default-500">{item?.type}</p>
        </div>
        <div className="absolute bottom-2 md:top-2 right-4 m-4">
          <CampaignStatusChip campaign={item} />
        </div>
      </CardHeader>
      <CardBody className="overflow-visible p-10">
        <Image
          shadow="sm"
          radius="lg"
          width="100%"
          alt={item?.name}
          className="w-full object-cover h-[140px]"
          src={`https://placehold.co/200x200/000000/FFFFFF?text=${item?.name}`}
        />
        <div className="flex flex-col gap-4 m-4">
          <div className="flex gap-4">
            <dt>Description:</dt>
            <dd>{item?.description && <p>{item.description}</p>}</dd>
          </div>
          <div className="flex gap-4">
            <dt>Rules:</dt>
            <dd>{item?.rules && <p>{item.rules}</p>}</dd>
          </div>
        </div>
      </CardBody>
      <CardFooter className="flex text-small justify-center"></CardFooter>
    </Card>
  );
}
