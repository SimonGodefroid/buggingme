import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  Link,
} from '@nextui-org/react';

import { BreadCrumbsClient } from '@/components/breadcrumbs';
import CampaignCard from '@/components/campaigns/campaign-card';

export default function Campaigns() {
  const list = [
    {
      title: 'Orange',
      img: '/images/fruit-1.jpeg',
      price: '$5.50',
    },
    {
      title: 'Tangerine',
      img: '/images/fruit-2.jpeg',
      price: '$3.00',
    },
    {
      title: 'Raspberry',
      img: '/images/fruit-3.jpeg',
      price: '$10.00',
    },
    {
      title: 'Lemon',
      img: '/images/fruit-4.jpeg',
      price: '$5.30',
    },
    {
      title: 'Avocado',
      img: '/images/fruit-5.jpeg',
      price: '$15.70',
    },
    // {
    //   title: 'Lemon 2',
    //   img: '/images/fruit-6.jpeg',
    //   price: '$8.00',
    // },
    // {
    //   title: 'Banana',
    //   img: '/images/fruit-7.jpeg',
    //   price: '$7.50',
    // },
    // {
    //   title: 'Watermelon',
    //   img: '/images/fruit-8.jpeg',
    //   price: '$12.20',
    // },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <BreadCrumbsClient
          crumbs={[{ href: '/campaigns', text: 'Campaigns' }]}
        />
        <div className="flex flex-col flex-wrap gap-4"></div>
        <div className="flex items-center gap-4"></div>
      </div>
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
        {list.map((item, index) => (
          <CampaignCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
