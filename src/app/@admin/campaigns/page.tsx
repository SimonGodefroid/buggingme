import db from '@/db';
import { CampaignWithCompany } from '@/types';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  Link,
} from '@nextui-org/react';

import CampaignCard from '@/components/campaigns/campaign-card';
import PageHeader from '@/components/common/page-header';

export default async function Campaigns() {
  const campaigns = (await db.campaign.findMany({})) as CampaignWithCompany[];
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <PageHeader crumbs={[{ href: '/campaigns', text: 'Campaigns' }]} />
        <div className="flex flex-col flex-wrap gap-4"></div>
        <div className="flex items-center gap-4"></div>
      </div>
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
        {campaigns.map((item, index) => (
          <CampaignCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
