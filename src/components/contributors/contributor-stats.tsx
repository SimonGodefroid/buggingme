'use client';

import { ContributorWithReports } from '@/types';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
} from '@nextui-org/react';

export default function ContributorStats({
  contributor,
}: {
  contributor: ContributorWithReports;
}) {
  const list = [
    ...contributor.Report.map((report) => {
      console.log('chier', report?.attachments?.[0]?.url);
      console.log('contributor', contributor);
      return {
        title: report.title,
        img: report?.attachments?.[0]?.url,
        price: '$5.50',
      };
    }),
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex  flex-col h-full gap-4">
        <Card>
          <CardHeader>Stats</CardHeader>
          <CardBody className="overflow-visible"></CardBody>
        </Card>
      </div>
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
        {list.map((item, index) => (
          <Card
            shadow="sm"
            key={index}
            isPressable
            onPress={() => console.log('item pressed')}
          >
            <CardBody className="overflow-visible p-0">
              <Image
                shadow="sm"
                radius="lg"
                width="100%"
                alt={item.title}
                className="w-full object-cover h-[140px]"
                src={item.img}
              />
            </CardBody>
            <CardFooter className="text-small justify-between">
              <b>{item.title}</b>
              <p className="text-default-500">{item.price}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
