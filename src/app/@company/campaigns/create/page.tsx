import { fetchUser } from '@/actions';

import { CreateCampaignForm } from '@/components/campaigns/forms';
import PageHeader from '@/components/common/page-header';

export default async function CreateCampaign() {
  const user = await fetchUser();

  return (
    <div className="flex flex-col">
      <PageHeader
        crumbs={[
          { href: '/campaigns', text: 'Campaigns' },
          { href: `/campaigns/create`, text: 'Create campaign' },
        ]}
        buttonProps={{
          secondary: { text: 'Back' },
        }}
      />
      <CreateCampaignForm user={user} />
    </div>
  );
}
